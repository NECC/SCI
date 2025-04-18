import { authOptions } from "@lib/auth";
import { NextResponse } from "@node_modules/next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

export interface DeleteEnrrolmentResponse {
  response: string;
  enrollmentDeleted?: number;
  error?: string;
}

/**
 * Deletes a Users enrrolment in an activity
 * @method DELETE
 * @param {string} id - Enrollment ID
 * @returns {response: "success", enrrolmentDeleted: enrollment.count | {response: "error", error: error}}
 */
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  const params = new URL(req.url);
  const userId = params.searchParams.get("userId");
  const activityId = params.searchParams.get("activityId");

  try {
    const enrollment = await prisma.enrollments.deleteMany({
      where: {
        userId: userId,
        activityId: parseInt(activityId),
      },
    });

    prisma.$disconnect();
    return new NextResponse(
        JSON.stringify({ response: "success", enrollmentDeleted: enrollment.count })
      );
  } catch (error) {
    prisma.$disconnect();
    // console.log(error);
    return new NextResponse(
        JSON.stringify({ response: "error", error: error })
      );
  }
}
