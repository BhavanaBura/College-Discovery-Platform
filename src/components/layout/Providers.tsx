// src/components/layout/Providers.tsx
// Client component that wraps the app with NextAuth's SessionProvider
// SessionProvider makes useSession() work in all child components

"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
