import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImplementationStepProps {
  stepNumber: number;
  tenantId: string;
  environmentId: string;
  embedUrl: string;
}

export function ImplementationStep({ stepNumber, tenantId, environmentId, embedUrl }: ImplementationStepProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            {stepNumber}
          </div>
          Implementation
        </CardTitle>
        <CardDescription>
          Use this code to embed the Permit.io element in your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-950">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            1. Import the Permit.io library
          </p>
          <pre className="mb-4 overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
            <code>{`import permit, { LoginMethod } from '@permitio/permit-js';`}</code>
          </pre>

          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            2. Initialize and authenticate with Permit.io
          </p>
          <pre className="mb-4 overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
            <code>{`// Use a JWT token to authenticate to Permit.io
const loginOptions = {
  loginMethod: LoginMethod.frontendOnly,
  userJwt: "USER_JWT_TOKEN", // Replace with your JWT token
  tenant: "${tenantId}",
  envId: "${environmentId}"
};

permit.elements.login(loginOptions).then(() => {
  console.log("Successfully authenticated with Permit.io");
}).catch(err => {
  console.error("Login error:", err);
});`}</code>
          </pre>

          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            3. Embed the element in your HTML
          </p>
          <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
            <code>{`<iframe 
  src="${embedUrl}?darkMode=false"
  style="border: none; width: 100%; height: 500px;"
  title="Permit.io Element"
  allow="clipboard-write"
></iframe>`}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
} 