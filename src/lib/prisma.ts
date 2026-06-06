// src/lib/prisma.ts
// Singleton pattern: reuse the same Prisma client in development
// (Next.js hot-reload would create too many connections without this)

import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type to hold our Prisma instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

// In development, save the client on global so hot-reload reuses it
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
