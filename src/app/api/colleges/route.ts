// src/app/api/colleges/route.ts
// GET  /api/colleges  — list colleges with search, filter, and pagination
// POST /api/colleges  — create a new college (admin use)

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const type = searchParams.get("type") || "";
    const minFees = Number(searchParams.get("minFees")) || 0;
    const maxFees = Number(searchParams.get("maxFees")) || 10000000;
    const minRating = Number(searchParams.get("minRating")) || 0;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(20, Number(searchParams.get("limit")) || 9); // max 20 per page

    const skip = (page - 1) * limit;

    // Build Prisma WHERE clause dynamically
    const where = {
      // Case-insensitive search on name or location
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(state && { state: { contains: state, mode: "insensitive" as const } }),
      ...(type && { type }),
      totalFees: { gte: minFees, lte: maxFees },
      rating: { gte: minRating },
    };

    // Run count and data queries in parallel for better performance
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: "desc" }, // highest rated first
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          type: true,
          totalFees: true,
          rating: true,
          accreditation: true,
          avgPackage: true,
          placementRate: true,
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    return NextResponse.json({
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
