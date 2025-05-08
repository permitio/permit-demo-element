"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, FileCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

import { AuthenticationStep } from "@/components/steps/AuthenticationStep";
import { ImplementationStep } from "@/components/steps/ImplementationStep";
import { JwksSetupStep } from "@/components/steps/JwksSetupStep";
import NavigationTabs from "@/components/navigation-tabs";
import { PreviewStep } from "@/components/steps/PreviewStep";
import {
  DEFAULT_USER_EMAIL,
  JWKS_JSON,
  PERMIT_ENV_ID,
  PERMIT_TENANT_ID,
  USER_JWT,
  USER_MANAGEMENT_EMBED_URL,
  getEmbedUrlWithDarkMode
} from "@/utils/env";
import { fetchJWT } from "@/utils/client-jwt";
import { JWKS } from "@/utils/jwt";

export default function UserManagementPage() {
  // State for Permit.io credentials
  const [embedUrl, setEmbedUrl] = useState<string>(USER_MANAGEMENT_EMBED_URL);
  const [environmentId] = useState<string>(PERMIT_ENV_ID);
  const [tenantId] = useState<string>(PERMIT_TENANT_ID);
  const [userEmail] = useState<string>(DEFAULT_USER_EMAIL);
  const [userJwt, setUserJwt] = useState<string>(USER_JWT || "");
  const [isGeneratingJwt, setIsGeneratingJwt] = useState(false);
  const [jwks] = useState<JWKS | null>(JWKS_JSON ? JSON.parse(JWKS_JSON) : null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode and update URL
  useEffect(() => {
    const updateDarkMode = () => {
      const darkModeActive = document.documentElement.classList.contains('dark') || 
                         window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModeActive);
    };

    // Set initial state
    updateDarkMode();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    // Observer for class changes on document element
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  // Update embed URL when dark mode changes
  useEffect(() => {
    try {
      const url = getEmbedUrlWithDarkMode(USER_MANAGEMENT_EMBED_URL, isDarkMode);
      setEmbedUrl(url);
    } catch (error) {
      console.error('Error updating embed URL:', error);
    }
  }, [isDarkMode]);

  
  // Generate JWT on initial render if not already available
  useEffect(() => {
    const generateToken = async () => {
      if (USER_JWT) return;
      
      try {
        const token = await fetchJWT(userEmail, tenantId, environmentId);
        setUserJwt(token);
      } catch (error) {
        console.error('Error generating JWT:', error);
      }
    };

    if (userEmail && tenantId && environmentId) {
      generateToken();
    }
  }, [userEmail, tenantId, environmentId]);

  // Define tabs for navigation
  const tabs = [
    {
      name: "User Management",
      href: "/user-management",
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "Audit Logs",
      href: "/audit-logs",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      name: "Approval Flows",
      href: "/approval-flows",
      icon: <FileCheck className="h-4 w-4" />,
    },
  ];

  const handleCredentialsSubmit = async () => {
    try {
      setIsGeneratingJwt(true);
      const jwt = await fetchJWT(userEmail, tenantId, environmentId);
      setUserJwt(jwt);
    } catch (error) {
      console.error("Error generating JWT:", error);
    } finally {
      setIsGeneratingJwt(false);
    }
  };

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Allow your users to manage access control and permissions within safe boundaries.
            </p>
          </div>

          <NavigationTabs tabs={tabs} className="mb-6" />

          {/* Step 1: JWKS Setup */}
          <JwksSetupStep
            stepNumber={1}
            jwks={jwks}
            userJwt={userJwt}
          />

          {/* Step 2: Implementation */}
          <ImplementationStep
            stepNumber={2}
            tenantId={tenantId}
            environmentId={environmentId}
            embedUrl={embedUrl}
          />

          {/* Step 3: Login */}
          <AuthenticationStep 
            stepNumber={3}
            isGeneratingJwt={isGeneratingJwt}
            onConnect={handleCredentialsSubmit}
            description="Connect to enable user management functionality"
          />

          {/* Step 4: Preview */}
          <PreviewStep
            stepNumber={4}
            title="User Management Element"
            elementId="user-management"
            description="Manage users, roles, and permissions directly from this embedded interface."
            embedUrl={embedUrl}
            envId={environmentId}
            tenantId={tenantId}
            userToken={userJwt}
          />
        </div>
      </motion.div>
    </div>
  );
} 