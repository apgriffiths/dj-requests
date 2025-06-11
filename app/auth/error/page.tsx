// pages/auth/error.tsx or app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function AuthError() {
  //const router = useRouter();
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({
    type: "",
    message: "",
    description: "",
    action: "",
  });

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorDetails(getErrorDetails(error));
    }
  }, [searchParams]);

  const getErrorDetails = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case "configuration":
        return {
          type: "Configuration Error",
          message: "Authentication service configuration issue",
          description:
            "There is a problem with the server configuration. Please contact support.",
          action: "contact-support",
        };
      case "accessdenied":
        return {
          type: "Access Denied",
          message: "Access to this application was denied",
          description:
            "You do not have permission to sign in to this application, or your account has been restricted.",
          action: "retry",
        };
      case "verification":
        return {
          type: "Verification Error",
          message: "Unable to verify your identity",
          description:
            "The verification token is invalid or has expired. Please try signing in again.",
          action: "retry",
        };
      case "oauthsignin":
        return {
          type: "OAuth Sign In Error",
          message: "Error constructing authorization URL",
          description:
            "There was a problem setting up the authentication with Google. Please try again.",
          action: "retry",
        };
      case "oauthcallback":
        return {
          type: "OAuth Callback Error",
          message: "Error handling OAuth response",
          description:
            "There was a problem processing the response from Google. Please try signing in again.",
          action: "retry",
        };
      case "oauthcreateaccount":
        return {
          type: "Account Creation Error",
          message: "Could not create your account",
          description:
            "There was a problem creating your account with the information provided by Google.",
          action: "contact-support",
        };
      case "emailsignin":
        return {
          type: "Email Sign In Error",
          message: "Unable to send verification email",
          description:
            "There was a problem sending the sign-in verification email. Please check your email address and try again.",
          action: "retry",
        };
      case "credentialssignin":
        return {
          type: "Sign In Failed",
          message: "The credentials you provided are incorrect",
          description: "Please check your login information and try again.",
          action: "retry",
        };
      case "sessionrequired":
        return {
          type: "Session Required",
          message: "You must be signed in to view this page",
          description: "Please sign in with your Google account to continue.",
          action: "signin",
        };
      case "callback":
        return {
          type: "Callback Error",
          message: "Authentication callback failed",
          description:
            "There was an error processing your authentication. This might be a temporary issue.",
          action: "retry",
        };
      case "oauthaccountnotlinked":
        return {
          type: "Account Already Exists",
          message: "Email address already in use",
          description:
            "An account with this email address already exists but is linked to a different authentication method.",
          action: "contact-support",
        };
      default:
        return {
          type: "Authentication Error",
          message: "An unknown error occurred",
          description:
            "Something went wrong during the authentication process. Please try again.",
          action: "retry",
        };
    }
  };

  const getActionButton = () => {
    switch (errorDetails.action) {
      case "retry":
        return (
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </Link>
        );
      case "signin":
        return (
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In
          </Link>
        );
      case "contact-support":
        return (
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 mr-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Contact Support
            </Link>
          </div>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Authentication Error - Your App</title>
        <meta name="description" content="Authentication error occurred" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Error Icon */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {errorDetails.type || "Authentication Error"}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {errorDetails.message || "Something went wrong"}
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
            <div className="space-y-6">
              {/* Error Description */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  {errorDetails.description ||
                    "An unexpected error occurred during authentication."}
                </p>
              </div>

              {/* Troubleshooting Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  What you can try:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Clear your browser cookies and cache</li>
                  <li>• Try using an incognito/private browsing window</li>
                  <li>• Check if your Google account is accessible</li>
                  <li>• Disable browser extensions temporarily</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="text-center">{getActionButton()}</div>

              {/* Home Link */}
              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Error Code */}
          {searchParams.get("error") && (
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Error Code: {searchParams.get("error")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
