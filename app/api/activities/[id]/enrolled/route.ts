import { Speaker } from "@prisma/generated/zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export interface ActivityEnrolleesResponse {
    response: "success" | "error";
    userNames: string[];
    error?: string;
}

/**
 * Get specific Activity points from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const enrollees: any = await prisma.enrollments.findMany({
      where: {
        activityId: parseInt(id),
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", userNames: enrollees.map((enrollee: { user: { name: string } }) => enrollee.user.name) })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}