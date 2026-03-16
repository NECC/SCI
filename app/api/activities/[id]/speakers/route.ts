import { PrismaClient } from "@prisma/client";
import { Speaker } from "@prisma/generated/zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export interface ActivitySpeakersResponse {
    response: "success" | "error";
    speakers: Speaker[];
    error?: string;
}

/**
 * Get specific Activity points from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req: Request, props: { params: Promise<{ id: string }>}) {
  const { id } = await props.params;
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        speakers: true,
      },
    });
    // console.log(activity);

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", speakers: activity })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}