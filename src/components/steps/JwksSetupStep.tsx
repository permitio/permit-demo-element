import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JWKS } from "@/utils/jwt";
import { ExternalLink, Copy, Check, CheckCircle, KeyRound} from "lucide-react";
import { parseJWT } from "@/utils/client-jwt";

interface JWKSSetupStepProps {
  stepNumber: number;
  jwks: JWKS | null;
  userJwt: string;
}

interface JwtInfo {
  header?: {
    alg?: string;
    typ?: string;
    kid?: string;
    [key: string]: unknown;
  };
  payload?: {
    sub?: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
  };
  signaturePrefix?: string;
}

export function JwksSetupStep({
  stepNumber,
  jwks,
  userJwt
}: JWKSSetupStepProps) {
  const [jwtInfo, setJwtInfo] = useState<JwtInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [jwtError, setJwtError] = useState<string | null>(null);
  const [newJwtGenerated, setNewJwtGenerated] = useState(false);
  
  // Extract JWT information if available
  React.useEffect(() => {
    if (userJwt) {
      try {
        const parsedJwt = parseJWT(userJwt);
        setJwtInfo(parsedJwt as JwtInfo);
        setJwtError(null);
        setNewJwtGenerated(true);
      } catch (error) {
        console.error('Error parsing JWT:', error);
        setJwtError('Failed to parse JWT');
      }
    } else {
      // If there's no JWT but we should have one, it might be due to missing private key
      setJwtError('No JWT available. This may be due to missing JWT_PRIVATE_KEY.');
    }
  }, [userJwt]);

  const copyJwt = async () => {
    if (userJwt) {
      try {
        await navigator.clipboard.writeText(userJwt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy JWT:', error);
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            {stepNumber}
          </div>
          Authentication Setup
        </CardTitle>
        <CardDescription>
          JSON Web Key Set (JWKS) for JWT authentication with Permit.io
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!jwks ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
              <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-500">JWKS Not Configured</h3>
              <p className="mb-4 text-sm text-amber-800 dark:text-amber-400">
                A JSON Web Key Set allows secure JWT authentication with Permit.io.
                For this demo, we&apos;re generating JWTs on-the-fly from the server.
              </p>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                <p className="mb-2">For production:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Generate a public/private key pair and create a JWKS</li>
                  <li>Configure the JWKS in Permit.io</li>
                  <li>Sign JWTs with your private key</li>
                </ul>
                <a 
                  href="https://docs.permit.io/foaz/fetching-jwks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center text-amber-800 hover:underline dark:text-amber-400"
                >
                  <span>Learn more about JWKS</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <h3 className="mb-2 font-medium text-green-800 dark:text-green-500">JWKS Configured</h3>
              <p className="mb-4 text-sm text-green-700 dark:text-green-300">
                A JWKS has been configured, which means we can generate valid JWTs for Permit.io authentication.
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Key ID: <code className="rounded bg-green-100 px-1 py-0.5 font-mono dark:bg-green-800/50">{jwks.keys[0]?.kid}</code>
              </p>
            </div>
          )}

          {jwtError && !userJwt && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
              <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-500">JWT Private Key May Be Missing</h3>
              <p className="text-sm text-amber-800 dark:text-amber-400">
                No JWT was generated. This could be because the JWT_PRIVATE_KEY environment variable is not set.
              </p>
              <p className="mt-2 text-sm text-amber-800 dark:text-amber-400">
                While the JWKS contains the public key for verification, the private key is needed for generating valid JWT tokens.
              </p>
              <ul className="ml-5 mt-2 list-disc text-xs text-amber-700 dark:text-amber-300">
                <li>Set the JWT_PRIVATE_KEY in your .env file</li>
                <li>Keep your private key secure and never expose it publicly</li>
                <li>The private key must correspond to the public key in your JWKS</li>
              </ul>
            </div>
          )}

          {jwtInfo && (
            <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="font-medium">JWT Token</h3>
                  {newJwtGenerated && (
                    <div className="ml-2 flex items-center text-green-600 dark:text-green-400 text-xs duration-6000 animate-pulse">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>New JWT Generated</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyJwt}
                    className="flex items-center text-xs text-blue-600 hover:underline dark:text-blue-400"
                    aria-label="Copy JWT token"
                  >
                    {copied ? (
                      <>
                        <span>Copied!</span>
                        <Check className="ml-1 h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <span>Copy JWT</span>
                        <Copy className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </button>
                  <a
                    href="https://jwt.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <span>Verify at JWT.io</span> 
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="space-y-2 rounded-md  p-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Payload</h4>
                  <div className="mt-1 overflow-x-auto rounded bg-gray-100 p-2 dark:bg-gray-800">
                    <pre className="text-xs text-gray-800 dark:text-gray-200">
                      <code>{JSON.stringify(jwtInfo.payload || {}, null, 2)}</code>
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Header</h4>
                    {jwtInfo.header?.kid && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        kid: {jwtInfo.header.kid}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 overflow-x-auto rounded bg-gray-100 p-2 dark:bg-gray-800">
                    <pre className="text-xs text-gray-800 dark:text-gray-200">
                      <code>{JSON.stringify(jwtInfo.header || {}, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/30">
                <div>
                  <h4 className="text-xs font-medium text-indigo-700 dark:text-indigo-300">How it works</h4>
                  <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                    The JWT authenticates you to Permit.io and identifies which tenant and user you represent.
                  </p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center">
                  <KeyRound className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 