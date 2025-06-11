import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getRequiredServerSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.warn("No session found, redirecting to sign-in page.");
    redirect("/auth/signin");
  }
  console.log("Session found:", session);
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/unauthorized");
  }

  return session;
}
