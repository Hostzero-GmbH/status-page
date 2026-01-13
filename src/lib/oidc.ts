import type { Plugin, PayloadRequest } from 'payload'
import { OAuth2Plugin } from 'payload-oauth2'
import { getServerUrl } from '@/lib/utils'

/**
 * OIDC/OAuth2 SSO Configuration
 * 
 * Enable optional SSO authentication via OIDC/OAuth2 providers like
 * Keycloak, Okta, Auth0, Azure AD, Google Workspace, etc.
 * 
 * Environment Variables:
 * 
 * Required:
 *   OIDC_CLIENT_ID       - OAuth2 client ID from your identity provider
 *   OIDC_CLIENT_SECRET   - OAuth2 client secret
 *   OIDC_AUTH_URL        - Authorization endpoint URL
 *   OIDC_TOKEN_URL       - Token endpoint URL
 *   OIDC_USERINFO_URL    - User info endpoint URL
 * 
 * Optional:
 *   OIDC_SCOPES          - Space-separated scopes (default: "openid profile email")
 *   OIDC_AUTO_CREATE     - Create users on first login: "true" or "false" (default: "true")
 *   OIDC_ALLOWED_GROUPS  - Comma-separated list of groups allowed to access (default: allow all)
 *   OIDC_GROUP_CLAIM     - Name of the claim containing groups (default: "groups")
 *   OIDC_DISABLE_LOCAL_LOGIN - Disable password login when SSO is enabled: "true" or "false" (default: "false")
 * 
 * Group-Based Access Control:
 *   To restrict access to specific groups, configure your IdP to include group claims
 *   in the userinfo response, then set OIDC_ALLOWED_GROUPS.
 * 
 *   Example for Keycloak:
 *   1. Create a client scope named "groups" with a Group Membership mapper
 *   2. Add the scope to your client
 *   3. Set OIDC_SCOPES="openid profile email groups"
 *   4. Set OIDC_ALLOWED_GROUPS="status-page-admins,status-page-editors"
 * 
 * Common Provider URLs:
 * 
 * Keycloak:
 *   OIDC_AUTH_URL=https://keycloak.example.com/realms/{realm}/protocol/openid-connect/auth
 *   OIDC_TOKEN_URL=https://keycloak.example.com/realms/{realm}/protocol/openid-connect/token
 *   OIDC_USERINFO_URL=https://keycloak.example.com/realms/{realm}/protocol/openid-connect/userinfo
 * 
 * Okta:
 *   OIDC_AUTH_URL=https://{domain}.okta.com/oauth2/default/v1/authorize
 *   OIDC_TOKEN_URL=https://{domain}.okta.com/oauth2/default/v1/token
 *   OIDC_USERINFO_URL=https://{domain}.okta.com/oauth2/default/v1/userinfo
 * 
 * Auth0:
 *   OIDC_AUTH_URL=https://{tenant}.auth0.com/authorize
 *   OIDC_TOKEN_URL=https://{tenant}.auth0.com/oauth/token
 *   OIDC_USERINFO_URL=https://{tenant}.auth0.com/userinfo
 * 
 * Azure AD:
 *   OIDC_AUTH_URL=https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
 *   OIDC_TOKEN_URL=https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
 *   OIDC_USERINFO_URL=https://graph.microsoft.com/oidc/userinfo
 * 
 * Google:
 *   OIDC_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
 *   OIDC_TOKEN_URL=https://oauth2.googleapis.com/token
 *   OIDC_USERINFO_URL=https://openidconnect.googleapis.com/v1/userinfo
 */

/**
 * Check if all required OIDC environment variables are set.
 */
export function isOIDCEnabled(): boolean {
  return !!(
    process.env.OIDC_CLIENT_ID &&
    process.env.OIDC_CLIENT_SECRET &&
    process.env.OIDC_AUTH_URL &&
    process.env.OIDC_TOKEN_URL &&
    process.env.OIDC_USERINFO_URL
  )
}

/**
 * Check if OIDC is partially configured (some vars set, but not all required).
 * Used to warn users about incomplete configuration.
 */
export function isOIDCPartiallyConfigured(): boolean {
  const vars = [
    process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET,
    process.env.OIDC_AUTH_URL,
    process.env.OIDC_TOKEN_URL,
    process.env.OIDC_USERINFO_URL,
  ]
  const setCount = vars.filter(Boolean).length
  return setCount > 0 && setCount < vars.length
}

/**
 * Check if local (password) login should be disabled.
 * Returns true if OIDC is enabled AND OIDC_DISABLE_LOCAL_LOGIN is "true"
 */
export function isLocalLoginDisabled(): boolean {
  return isOIDCEnabled() && process.env.OIDC_DISABLE_LOCAL_LOGIN === 'true'
}

/**
 * Check if a user's groups include any of the allowed groups.
 * Returns true if no allowed groups are configured (allow all).
 */
function isUserInAllowedGroups(userGroups: string[] | undefined): boolean {
  const allowedGroupsEnv = process.env.OIDC_ALLOWED_GROUPS
  
  // No restriction configured - allow all
  if (!allowedGroupsEnv) {
    return true
  }
  
  const allowedGroups = allowedGroupsEnv.split(',').map(g => g.trim().toLowerCase())
  
  // No groups from IdP - deny if restrictions are configured
  if (!userGroups || userGroups.length === 0) {
    console.warn('OIDC: User has no groups but OIDC_ALLOWED_GROUPS is configured')
    return false
  }
  
  // Check if user has any allowed group
  const userGroupsLower = userGroups.map(g => g.toLowerCase())
  const hasAllowedGroup = allowedGroups.some(allowed => userGroupsLower.includes(allowed))
  
  if (!hasAllowedGroup) {
    console.warn(`OIDC: User groups [${userGroups.join(', ')}] do not include any allowed groups [${allowedGroups.join(', ')}]`)
  }
  
  return hasAllowedGroup
}

export function getOIDCPlugin(): Plugin | null {
  if (!isOIDCEnabled()) {
    return null
  }

  const serverUrl = getServerUrl()
  const scopes = (process.env.OIDC_SCOPES || 'openid profile email').split(' ')
  const autoCreate = process.env.OIDC_AUTO_CREATE !== 'false'
  const groupClaim = process.env.OIDC_GROUP_CLAIM || 'groups'

  return OAuth2Plugin({
    enabled: true,
    strategyName: 'oidc',
    useEmailAsIdentity: true,
    serverURL: serverUrl,
    authCollection: 'users',
    clientId: process.env.OIDC_CLIENT_ID!,
    clientSecret: process.env.OIDC_CLIENT_SECRET!,
    providerAuthorizationUrl: process.env.OIDC_AUTH_URL!,
    tokenEndpoint: process.env.OIDC_TOKEN_URL!,
    scopes,
    authorizePath: '/oauth/authorize',
    callbackPath: '/oauth/callback',
    onUserNotFoundBehavior: autoCreate ? 'create' : 'error',
    
    async getUserInfo(accessToken: string, _req: PayloadRequest) {
      const response = await fetch(process.env.OIDC_USERINFO_URL!, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`)
      }
      
      const user = await response.json()
      
      // Extract groups from the configured claim
      const groups: string[] | undefined = user[groupClaim]
      
      // Check group membership if OIDC_ALLOWED_GROUPS is configured
      if (!isUserInAllowedGroups(groups)) {
        throw new Error('Access denied: User is not a member of an allowed group')
      }
      
      return {
        email: user.email || user.preferred_username,
        name: user.name || user.given_name || user.preferred_username,
        sub: user.sub,
      }
    },

    successRedirect(_req: PayloadRequest) {
      return '/admin'
    },

    failureRedirect(_req: PayloadRequest, error?: unknown) {
      // Log the actual error for debugging, but don't expose it to users
      if (error) {
        console.error('OIDC authentication failed:', error instanceof Error ? error.message : error)
      }
      
      // Return a generic error message to avoid leaking internal details
      // Check for known error types to provide slightly better UX
      let errorCode = 'login_failed'
      if (error instanceof Error) {
        if (error.message.includes('not a member of an allowed group')) {
          errorCode = 'access_denied'
        } else if (error.message.includes('fetch user info')) {
          errorCode = 'provider_error'
        }
      }
      
      return `/admin/login?error=${errorCode}`
    },
  })
}
