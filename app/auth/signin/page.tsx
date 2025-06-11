"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading, isAuthenticated, isAdmin, session } = useAuth();

  useEffect(() => {
    // Check if user is already signed in
    if (session && isAuthenticated && !isLoading) {
      if (isAdmin === true) {
        router.push("/dashboard");
      } else {
        router.push("/requests");
      }
    }
  }, [session, router, user, isAuthenticated, isLoading, isAdmin]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard", // Default callback URL
      });
      setTimeout(() => {
        if (result?.error) {
          setError("Failed to sign in. Please try again.");
        } else if (result?.ok) {
          // Get the session to check user role
          if (session) {
            // If trying to access dashboard but not admin, redirect to unauthorized
            if (isAdmin) {
              router.push("/dashboard");
            } else {
              router.push("/requests");
            }
          }
        }
      }, 1000); // Delay to simulate loading state
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Area */}
      <div className="logo-container text-center mb-12 w-full max-w-md">
        <h1 className="neon-blue text-6xl md:text-7xl mb-3 tracking-[0.25em] pulse">
          <Link href="/" className="hover:underline">
            <span className="text-cyan-200">DJ</span> PHAT TONY
          </Link>
        </h1>
        <p className="text-cyan-200 text-xl tracking-wider">
          Sign in to your account
        </p>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have admin access?{" "}
            <button
              onClick={() => router.push("/requests")}
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Go to Requests
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
