"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "ADMIN",
    session,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    throw new Error("Authentication required");
  }

  return useAuth();
}

export function useRequireAdmin() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();

  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    throw new Error("Admin access required");
  }

  return useAuth();
}
