// src/lib/auth.ts
// Central NextAuth configuration — imported by the API route

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  // Prisma adapter stores sessions in the database
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  // Use JWT strategy because we use CredentialsProvider
  // (database sessions don't work well with credentials)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Basic validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // 2. Find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No account found with this email");
        }

        // 3. Compare password with stored hash
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // 4. Return user object (goes into JWT token)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // Add user id to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Expose user id in the session (accessible via useSession())
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",  // Custom sign-in page
    error: "/auth/signin",   // Redirect errors to sign-in
  },
};
