"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

const ENV_ID = process.env.NEXT_PUBLIC_PERMIT_ENV_ID || "";
const TENANT_ID = process.env.NEXT_PUBLIC_PERMIT_TENANT_ID || "default";
const PERMIT_API_URL =
  process.env.NEXT_PUBLIC_PERMIT_API_URL || "https://api.permit.io";
const EMBED_URL = process.env.NEXT_PUBLIC_USER_MANAGEMENT_EMBED_URL || "";

export default function UserManagementPage() {
  const { loginWithRedirect, isAuthenticated, isLoading, getIdTokenClaims, user } = useAuth0();
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [permitToken, setPermitToken] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Step A: Call elements_fe_login_as to get the permit token
  const loginToPermit = useCallback(async () => {
    if (loggingIn || permitToken) return;
    setLoggingIn(true);
    setError(null);

    try {
      const claims = await getIdTokenClaims();
      if (!claims?.__raw) {
        throw new Error("Could not get ID token from Auth0");
      }
      const idToken = claims.__raw;

      console.log("Auth0 ID token sub:", claims.sub);
      console.log("Calling elements_fe_login_as on:", PERMIT_API_URL);

      const response = await fetch(
        `${PERMIT_API_URL}/v2/auth/${ENV_ID}/elements_fe_login_as`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: TENANT_ID,
            user_jwt: idToken,
            user_key_claim: "email",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || `HTTP ${response.status}`
        );
      }

      const data = await response.json();
      console.log("elements_fe_login_as response:", data);

      if (data.error) {
        throw new Error(`${data.error} (${data.extra || ""})`);
      }

      const token = data.element_bearer_token;
      if (!token) {
        throw new Error("No element_bearer_token in login response");
      }

      console.log("Got permit token, will send to iframe via postMessage");
      setPermitToken(token);
    } catch (err) {
      console.error("Permit login error:", err);
      setError(String(err));
    } finally {
      setLoggingIn(false);
    }
  }, [getIdTokenClaims, loggingIn, permitToken]);

  // Auto-login to Permit once Auth0 is authenticated
  useEffect(() => {
    if (isAuthenticated && !permitToken && !loggingIn) {
      loginToPermit();
    }
  }, [isAuthenticated, permitToken, loggingIn, loginToPermit]);

  // Step B: Once iframe loads AND we have the token, send it via postMessage
  useEffect(() => {
    if (!permitToken || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const sendToken = () => {
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) return;
      console.log("Sending permit token to iframe via postMessage");
      iframeWindow.postMessage(
        { type: "permitToken", permitToken: permitToken },
        "*"
      );
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "permitTokenReceived") {
        console.log("iframe acknowledged token receipt!");
        setElementReady(true);
      }
    };
    window.addEventListener("message", handleMessage);

    let attempts = 0;
    const maxAttempts = 60;
    const interval = setInterval(() => {
      if (elementReady || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts && !elementReady) {
          console.error("iframe never acknowledged the token");
        }
        return;
      }
      sendToken();
      attempts++;
    }, 500);

    iframe.addEventListener("load", sendToken);

    return () => {
      clearInterval(interval);
      window.removeEventListener("message", handleMessage);
      iframe.removeEventListener("load", sendToken);
    };
  }, [permitToken, elementReady]);

  // Build iframe URL with elementsToken flag so the embed app waits for postMessage
  const iframeUrl = EMBED_URL
    ? (() => {
        const url = new URL(EMBED_URL);
        if (!url.searchParams.has("envId")) url.searchParams.set("envId", ENV_ID);
        url.searchParams.set("elementsToken", "true");
        return url.toString();
      })()
    : "";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-2 text-3xl font-bold">User Management Element Test</h1>
      <p className="mb-6 text-muted-foreground">
        Testing the embedded User Management element with Auth0 staging authentication.
      </p>

      {/* Step 1: Auth0 Login */}
      {!isAuthenticated && (
        <div className="mb-6 rounded-lg border p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">Step 1: Login with Auth0</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            You need to log in first so we can get your Auth0 ID token.
          </p>
          <Button onClick={() => loginWithRedirect()} size="lg">
            Login with Auth0
          </Button>
        </div>
      )}

      {/* Step 2: Permit login status */}
      {isAuthenticated && !permitToken && (
        <div className="mb-6 rounded-lg border p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">Step 2: Connecting to Permit</h2>
          {loggingIn && (
            <p className="text-sm text-muted-foreground">
              Logging in as <strong>{user?.email}</strong> (sub: {user?.sub})...
            </p>
          )}
          {error && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-red-500">Error: {error}</p>
              <Button onClick={loginToPermit} variant="outline">
                Retry
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: The actual element */}
      {permitToken && iframeUrl && (
        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">User Management Element</h2>
            <p className="text-sm text-muted-foreground">
              Logged in as {user?.email} | Tenant: {TENANT_ID}
              {!elementReady && " | Sending token to iframe..."}
              {elementReady && " | Connected"}
            </p>
          </div>
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            className="w-full"
            style={{ height: "600px", border: "none" }}
            title="User Management Element"
            allow="clipboard-write"
          />
        </div>
      )}

      {/* Debug info */}
      <details className="mt-8">
        <summary className="cursor-pointer text-sm text-muted-foreground">
          Debug Info
        </summary>
        <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-900">
          {JSON.stringify(
            {
              auth0Authenticated: isAuthenticated,
              userEmail: user?.email,
              userSub: user?.sub,
              permitTokenReceived: !!permitToken,
              iframeAcknowledged: elementReady,
              envId: ENV_ID,
              tenantId: TENANT_ID,
              permitApiUrl: PERMIT_API_URL,
              embedUrl: EMBED_URL,
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}
