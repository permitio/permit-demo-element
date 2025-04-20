"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/utils/cn";
import permit, { LoginMethod } from '@permitio/permit-js';

interface PermitElementProps {
  title: string;
  elementId: string;
  description?: string;
  className?: string;
  height?: string;
  embedUrl?: string;
  envId?: string;
  tenantId?: string;
  userKey?: string;
  userToken?: string;
}

interface PermitError {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export default function PermitElement({
  title,
  elementId,
  description,
  className,
  height = "500px",
  embedUrl,
  envId,
  tenantId,
  userKey,
  userToken,
}: PermitElementProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Used to force iframe refresh

  useEffect(() => {
    // Initialize dark mode state
    const updateDarkModeState = () => {
      const darkModeActive = document.documentElement.classList.contains('dark') || 
                          window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModeActive);
    };

    // Set initial dark mode state
    updateDarkModeState();

    // Set up listeners for dark mode changes
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const mediaQueryListener = () => {
      updateDarkModeState();
      setIframeKey(prev => prev + 1); // Force iframe refresh
    };

    // Watch for class changes on document.documentElement
    const documentObserver = new MutationObserver(() => {
      updateDarkModeState();
      setIframeKey(prev => prev + 1); // Force iframe refresh
    });
    
    documentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Add media query listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', mediaQueryListener);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(mediaQueryListener);
    }

    return () => {
      // Clean up listeners
      documentObserver.disconnect();
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', mediaQueryListener);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(mediaQueryListener);
      }
    };
  }, []);

  useEffect(() => {
    const initPermit = async () => {
      try {
        // Only proceed if we have all required credentials
        if (embedUrl && (userKey || userToken) && envId && tenantId) {
          // Reset state when credentials change
          setIsAuthenticated(false);
          setError(null);
          setIsLoading(true);
          
          // Login to Permit.io
          const loginOpts = {
            loginMethod: LoginMethod.frontendOnly,
            userJwt: userToken,
            tenant: tenantId,
            envId: envId,
          };
          
          permit.elements.login(loginOpts).then(() => {
            setIsAuthenticated(true);
          }).catch((err: PermitError) => {
            console.error("Login error:", err);
          });
        }
      } catch (err) {
        console.error('Error initializing Permit:', err);
        
        // Extract and display more helpful error messages
        let errorMessage = 'Failed to initialize Permit';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null) {
          // Try to extract error from Permit.io API response
          const permitErr = err as PermitError;
          if (permitErr.message) {
            errorMessage = String(permitErr.message);
          } else if (permitErr.error) {
            errorMessage = String(permitErr.error);
          } else {
            errorMessage = JSON.stringify(err);
          }
        }
        
        setError(errorMessage);
      } finally {
        // End loading state
        setIsLoading(false);
      }
    };

    // Initialize authentication
    initPermit();
    
    // Cleanup function
    return () => {
      // Perform any necessary cleanup
      if (permit.elements && typeof permit.elements.logout === 'function') {
        permit.elements.logout().catch((err: PermitError) => {
          console.error('Error during logout:', err);
        });
      }
    };
  }, [embedUrl, envId, tenantId, userKey, userToken]);

  // Generate the final URL with query parameters if needed
  const getFinalUrl = () => {
    if (!embedUrl) return '';
    
    const url = new URL(embedUrl);
    
    // Add any missing query parameters
    if (envId && !url.searchParams.has('envId')) {
      url.searchParams.set('envId', envId);
    }

    // Add dark mode parameter based on current state
    url.searchParams.set('darkMode', isDarkMode ? 'true' : 'false');
    
    return url.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <div 
            className={cn(
              "relative w-full rounded-md border", 
              isLoading ? "animate-pulse bg-gray-100 dark:bg-gray-800" : ""
            )}
            style={{ height }}
          >
            {!isLoading && isAuthenticated && embedUrl && (
              <iframe
                key={iframeKey}
                src={getFinalUrl()}
                className="absolute inset-0 h-full w-full"
                style={{ border: "none" }}
                title={title}
                data-element-id={elementId}
                allow="clipboard-write"
              />
            )}
            
            {!isLoading && error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <p className="mb-2 text-center text-lg font-semibold text-red-500">Authentication Error</p>
                <p className="text-center text-sm text-red-500">{error}</p>
                <p className="mt-4 text-center text-xs text-gray-500">
                  Please check the browser console for more details.
                </p>
              </div>
            )}
            
            {!isLoading && !isAuthenticated && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userKey || userToken 
                    ? "Authentication with Permit.io is pending. Please check console for details."
                    : "Waiting for authentication credentials (API key, JWT, etc.)"}
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Initializing Permit.io element...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 