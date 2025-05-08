/**
 * Client-side utility for JWT operations
 * Separates client-side JWT handling from server-side implementation
 */

/**
 * Fetch a JWT token from the server API
 * @param user User email or ID
 * @param tenant Tenant ID
 * @param environmentId Environment ID
 * @returns Generated JWT token
 */
export async function fetchJWT(user: string, tenant: string, environmentId: string): Promise<string> {
  try {
    const response = await fetch('/api/auth/jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        tenant,
        environmentId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate JWT');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching JWT:', error);
    throw error;
  }
}

/**
 * Parse and extract information from a JWT token 
 * @param token JWT token string
 * @returns Decoded payload and header
 */
export function parseJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    return {
      header,
      payload,
      signaturePrefix: parts[2].substring(0, 10) + '...'
    };
  } catch (error) {
    console.error('Error parsing JWT:', error);
    throw error;
  }
} 