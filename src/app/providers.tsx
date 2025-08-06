"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { LiffProvider } from "@/contexts/LiffContext";

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <LiffProvider>
        {children}
      </LiffProvider>
    </SessionProvider>
  );
}
