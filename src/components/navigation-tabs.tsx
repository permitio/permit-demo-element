"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Tab {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationTabsProps {
  tabs: Tab[];
  className?: string;
}

export default function NavigationTabs({ tabs, className }: NavigationTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={cn("flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800", className)}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        
        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.href)}
            className={cn(
              "relative flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white dark:bg-gray-950"
                style={{ borderRadius: "0.375rem" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center space-x-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
} 