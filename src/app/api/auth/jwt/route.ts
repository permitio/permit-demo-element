import { NextRequest, NextResponse } from 'next/server';
import { generateJWT } from '@/utils/jwt';
import { JWKS_JSON, JWT_KID } from '@/utils/env';

export async function POST(request: NextRequest) {
  try {
    const { user, tenant, environmentId } = await request.json();
    
    // Validate required parameters
    if (!user) {
      return NextResponse.json(
        { error: 'Missing required parameter: user' },
        { status: 400 }
      );
    }
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Missing required parameter: tenant' },
        { status: 400 }
      );
    }
    
    if (!environmentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: environmentId' },
        { status: 400 }
      );
    }
    
    // Parse JWKS and get kid from first key, or use default
    let kid = JWT_KID;
    
    if (JWKS_JSON) {
      try {
        const jwks = JSON.parse(JWKS_JSON);
        if (jwks.keys && jwks.keys.length > 0 && jwks.keys[0].kid) {
          kid = jwks.keys[0].kid;
        }
      } catch (error) {
        console.error('Error parsing JWKS JSON:', error);
        // Continue with default kid
      }
    }
    
    const token = await generateJWT(user, tenant, environmentId, kid);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while generating JWT';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 