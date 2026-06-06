// src/app/api/compare/route.ts
// GET /api/compare?ids=id1,id2,id3 — fetch 2-3 colleges for comparison

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ error: "Please provide college IDs to compare" }, { status: 400 });
    }

    const ids = idsParam.split(",").map((id) => id.trim());

    // Validate: must compare 2 or 3 colleges
    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json(
        { error: "You can compare 2 to 3 colleges at a time" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: true,
        _count: { select: { reviews: true } },
      },
    });

    if (colleges.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    // Return in the same order as requested
    const ordered = ids.map((id) => colleges.find((c) => c.id === id)!);

    return NextResponse.json({ colleges: ordered });
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json({ error: "Failed to compare colleges" }, { status: 500 });
  }
}
