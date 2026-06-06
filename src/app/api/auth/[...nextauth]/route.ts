// src/app/api/auth/[...nextauth]/route.ts
// This single file handles ALL NextAuth routes:
// /api/auth/signin, /api/auth/signout, /api/auth/session, etc.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Export both GET and POST — NextAuth needs both
export { handler as GET, handler as POST };
