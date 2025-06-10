"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/app/ui/button";

export function SignOutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/requests" })}>
      Sign Out
    </Button>
  );
}
