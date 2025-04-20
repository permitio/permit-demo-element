/**
 * Environment configuration utility
 * This file centralizes access to environment variables with sensible defaults
 */

// Permit.io configuration
export const PERMIT_ENV_ID = process.env.NEXT_PUBLIC_PERMIT_ENV_ID || '40e1b80613334bcc92f10abc49b1f4f2';
export const PERMIT_TENANT_ID = process.env.NEXT_PUBLIC_PERMIT_TENANT_ID || 'default';

// User information
export const DEFAULT_USER_EMAIL = process.env.NEXT_PUBLIC_DEFAULT_USER_EMAIL || 'raz@permit.io';

// Embed URLs
export const USER_MANAGEMENT_EMBED_URL = process.env.NEXT_PUBLIC_USER_MANAGEMENT_EMBED_URL || 'https://embed.permit.io/to-do-user-management';
export const AUDIT_LOGS_EMBED_URL = process.env.NEXT_PUBLIC_AUDIT_LOGS_EMBED_URL || 'https://embed.permit.io/to-do-audit-logs';
export const APPROVAL_FLOWS_EMBED_URL = process.env.NEXT_PUBLIC_APPROVAL_FLOWS_EMBED_URL || 'https://embed.permit.io/to-do-approval-flows';
export const RESOURCE_EXPLORER_EMBED_URL = process.env.NEXT_PUBLIC_RESOURCE_EXPLORER_EMBED_URL || 'https://embed.permit.io/resource-explorer';
export const APPROVAL_MANAGEMENT_EMBED_URL = process.env.NEXT_PUBLIC_APPROVAL_MANAGEMENT_EMBED_URL || 'https://embed.permit.io/approval-management-demo';
// JWT Configuration
export const JWT_KID = process.env.NEXT_PUBLIC_JWT_KID || 'permit-demo';

// JWT Token and JWKS
export const USER_JWT = process.env.NEXT_PUBLIC_USER_JWT || '';
export const JWKS_JSON = process.env.NEXT_PUBLIC_JWKS_JSON || '';


/**
 * Gets the private key for JWT signing from environment variable
 * @returns The private key as a string
 */
export function getPrivateKey(): string {
  // Check for private key in environment variable
  if (process.env.JWT_PRIVATE_KEY) {
    return process.env.JWT_PRIVATE_KEY;
  }
  
  // Error if no private key is found
  throw new Error('JWT_PRIVATE_KEY is not set');
}

/**
 * Helper function to append darkMode query parameter to embed URLs
 * @param url Base URL
 * @param isDarkMode Whether dark mode is active
 * @returns URL with darkMode query parameter
 */
export function getEmbedUrlWithDarkMode(url: string, isDarkMode: boolean = false): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('darkMode', isDarkMode ? 'true' : 'false');
    
    // Make sure environment ID is included if available
    if (PERMIT_ENV_ID && !urlObj.searchParams.has('envId')) {
      urlObj.searchParams.set('envId', PERMIT_ENV_ID);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error formatting embed URL:', error);
    return url;
  }
} 