"use client";

import Link from "next/link";
import React from "react";
import { ClipboardList, FileCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export default function Home() {
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

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            Permit.io Elements Demo
          </h1>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
            A clean and modern demonstration of Permit.io&apos;s embeddable components
            for access control and user management.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/user-management">View Demo</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://docs.permit.io/embeddable-uis/overview"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-950">
          <h2 className="mb-4 text-xl font-semibold">Available Components</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {tabs.map((tab) => (
              <motion.div
                key={tab.name}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center rounded-lg border p-4 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  {tab.icon}
                </div>
                <h3 className="mb-1 font-medium">{tab.name}</h3>
                <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {tab.name === "User Management"
                    ? "Manage users and their permissions within safe boundaries."
                    : tab.name === "Audit Logs"
                    ? "Monitor access decisions and track user activity."
                    : "Process and manage approval requests for resource access."}
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-auto">
                  <Link href={tab.href}>View Demo</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
