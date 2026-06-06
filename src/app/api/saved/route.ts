// src/app/api/saved/route.ts
// GET  /api/saved      — list user's saved colleges
// POST /api/saved      — save or unsave a college (toggle)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Return all colleges saved by the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to view saved colleges" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: "desc" },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            type: true,
            totalFees: true,
            rating: true,
            accreditation: true,
            avgPackage: true,
            placementRate: true,
          },
        },
      },
    });

    // Return just the college objects
    return NextResponse.json({ colleges: saved.map((s) => s.college) });
  } catch (error) {
    console.error("GET /api/saved error:", error);
    return NextResponse.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

// POST: Toggle save/unsave for a college
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to save colleges" }, { status: 401 });
    }

    const { collegeId } = await req.json();

    if (!collegeId) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId: session.user.id, collegeId },
      },
    });

    if (existing) {
      // Already saved → remove it
      await prisma.savedCollege.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: "College removed from saved" });
    } else {
      // Not saved → save it
      await prisma.savedCollege.create({
        data: { userId: session.user.id, collegeId },
      });
      return NextResponse.json({ saved: true, message: "College saved!" });
    }
  } catch (error) {
    console.error("POST /api/saved error:", error);
    return NextResponse.json({ error: "Failed to update saved colleges" }, { status: 500 });
  }
}
