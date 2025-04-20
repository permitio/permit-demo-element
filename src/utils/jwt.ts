import * as jose from 'jose';
import { getPrivateKey } from './env';

/**
 * JWKS interface representing a JSON Web Key Set
 */
export interface JWKS {
  keys: JWK[];
}

/**
 * JWK interface representing a JSON Web Key
 */
export interface JWK {
  kty: string;
  kid: string;
  n?: string;
  e?: string;
  x?: string;
  y?: string;
  crv?: string;
  use?: string;
  alg: string;
}

/**
 * Generate a JWT token signed with the private key
 * @param user User email or identifier
 * @param tenant Tenant ID
 * @param envId Environment ID
 * @param kid Key ID
 * @returns JWT token string
 */
export async function generateJWT(user: string, tenant: string, envId: string, kid: string): Promise<string> {
  try {
    // Import the private key
    const privateKey = await jose.importPKCS8(getPrivateKey(), 'RS256');
    console.log(getPrivateKey());
    // Create JWT payload
    const payload = {
      sub: user,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      "https://permit.io/tenant": tenant,
      "https://permit.io/env": envId,
      iss: `https://${tenant}.permit.io`,
      aud: [`https://${tenant}.permit.io`],
    };

    // Sign the JWT
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: 'RS256',
        typ: 'JWT',
        kid: kid,
      })
      .sign(privateKey);

    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
}

/**
 * Interface for JWKS response
 */
export interface JWKS {
  keys: {
    kty: string;
    kid: string;
    use: string;
    alg: string;
    n: string;
    e: string;
  }[];
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