import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthenticationStepProps {
  stepNumber: number;
  isGeneratingJwt: boolean;
  onConnect: () => Promise<void>;
  description?: string;
}

export function AuthenticationStep({
  stepNumber,
  isGeneratingJwt,
  onConnect,
  description = "Connect to enable functionality"
}: AuthenticationStepProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {stepNumber}
          </div>
          <span>Authentication</span>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Button 
            onClick={onConnect} 
            disabled={isGeneratingJwt}
            size="lg"
          >
            {isGeneratingJwt ? "Authenticating..." : "Connect to Permit.io"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 