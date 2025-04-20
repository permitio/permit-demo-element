import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PermitElement from "@/components/permit-element";

interface PreviewStepProps {
  stepNumber: number;
  title: string;
  elementId: string;
  description: string;
  height?: string;
  embedUrl: string;
  envId: string;
  tenantId: string;
  userToken: string;
}

export function PreviewStep({
  stepNumber,
  title,
  elementId,
  description,
  height = "600px",
  embedUrl,
  envId,
  tenantId,
  userToken
}: PreviewStepProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {stepNumber}
          </div>
          <span>Preview</span>
        </CardTitle>
        <CardDescription>
          {title} Preview
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <PermitElement 
          title={title} 
          elementId={elementId} 
          description={description} 
          height={height}
          embedUrl={embedUrl}
          envId={envId}
          tenantId={tenantId}
          userToken={userToken}
        />
      </CardContent>
    </Card>
  );
} 