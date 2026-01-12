import type { CollectionConfig } from 'payload'

const isProduction = process.env.NODE_ENV === 'production'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: {
    // Disable database sessions - use stateless JWT
    // Sessions cause issues behind reverse proxy
    useSessions: false,
    cookies: {
      secure: isProduction,
      sameSite: 'Lax',
    },
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description: 'User role for access control',
      },
    },
  ],
}
