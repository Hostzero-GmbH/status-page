import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Plugin } from 'payload'
import { fileURLToPath } from 'url'

// Collections
import {
  Incidents,
  Maintenances,
  Media,
  Notifications,
  ServiceGroups,
  Services,
  Subscribers,
  Users,
} from '@/collections'

// Globals
import { EmailSettings, Settings, SmsSettings } from '@/globals'

// Tasks
import { sendNotificationFromCollectionHandler } from '@/tasks/sendNotificationFromCollection'

// Migrations
import { migrations } from '@/migrations'

// Optional OIDC/SSO
import { getOIDCPlugin, isOIDCPartiallyConfigured } from '@/lib/oidc'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Build plugins array (OIDC is optional)
const plugins: Plugin[] = []
const oidcPlugin = getOIDCPlugin()
if (oidcPlugin) {
  plugins.push(oidcPlugin)
  console.log('OIDC SSO enabled')
} else if (isOIDCPartiallyConfigured()) {
  console.warn('OIDC configuration incomplete - some OIDC_* env vars are set but not all required ones. SSO disabled.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Status',
    },
    components: {
      beforeDashboard: ['@/components/admin/DashboardWidgets#DashboardWidgets'],
    },
  },
  collections: [
    // Status collections
    ServiceGroups,
    Services,
    Incidents,
    Maintenances,
    // Notification collections
    Notifications,
    Subscribers,
    // Admin collections
    Users,
    Media,
  ],
  globals: [Settings, EmailSettings, SmsSettings],
  plugins,
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      LinkFeature(),
      FixedToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || '',
    },
    prodMigrations: migrations,
  }),
  // Jobs Queue configuration
  jobs: {
    tasks: [
      {
        slug: 'sendNotificationFromCollection',
        handler: sendNotificationFromCollectionHandler as any,
        inputSchema: [
          { name: 'notificationId', type: 'text', required: true },
          { name: 'channel', type: 'text', required: true },
          { name: 'subject', type: 'text' },
          { name: 'emailBody', type: 'text' },
          { name: 'smsBody', type: 'text' },
          { name: 'itemTitle', type: 'text', required: true },
          { name: 'itemUrl', type: 'text', required: true },
        ],
        retries: 3,
      },
    ],
  },
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
})
