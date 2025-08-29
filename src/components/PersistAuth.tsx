"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function PersistAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
