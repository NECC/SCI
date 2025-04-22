import { Speaker } from "@prisma/generated/zod";
import { NextResponse } from "next/server";
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
export async function GET(req: Request, props: { params: { id: string }}) {
  try {
    const enrollees = await prisma.enrollments.findMany({
      where: {
        activityId: parseInt(props.params.id),
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
      JSON.stringify({ response: "success", userNames: enrollees.map((enrollee) => enrollee.user.name) })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}