// src/app/api/colleges/[id]/route.ts
// GET /api/colleges/:id — full college detail with courses and reviews

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Fetch college with all related data
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      include: {
        courses: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: { select: { savedBy: true, reviews: true } },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Check if logged-in user has saved this college
    let isSaved = false;
    if (session?.user?.id) {
      const saved = await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: session.user.id,
            collegeId: params.id,
          },
        },
      });
      isSaved = !!saved;
    }

    return NextResponse.json({ ...college, isSaved });
  } catch (error) {
    console.error("GET /api/colleges/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch college" }, { status: 500 });
  }
}
