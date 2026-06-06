// src/app/api/colleges/[id]/reviews/route.ts
// POST /api/colleges/:id/reviews — add a review (requires login)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to review" }, { status: 401 });
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    // upsert = update if exists, create if not
    // This enforces one review per user per college
    const review = await prisma.review.upsert({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: params.id,
        },
      },
      update: { rating: result.data.rating, comment: result.data.comment },
      create: {
        rating: result.data.rating,
        comment: result.data.comment,
        userId: session.user.id,
        collegeId: params.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
