import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@lib/auth";

import { prisma } from '@/lib/prisma';

export interface EnrollmentAttendQRCodePostResponse {
  response: "success" | "error";
  updateEnrollment?: Prisma.BatchPayload;
  error?: string;
}


/**
 * Turn an enrollment attended
 * @method POST
 * @param {Request}  { userId: string, activityId: int }
 * @returns [{ user, points }]
 **/
export async function POST(request: Request) {
  const data = await request.json();
  const session = await getServerSession(authOptions);

  if (session?.user.role == "USER") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to do this action, get out of here!",
      })
    );
  }

  try {
    const qrParts = data.code.split(';');
    if (qrParts.length !== 3 || qrParts[0] !== 'attend') {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({
          response: "error",
          error: "Invalid QR code format",
        })
      );
    }
    const userId = qrParts[1];
    const scannedActivityId = parseInt(qrParts[2]);
    const activityId = parseInt(data.activityId);
    if (scannedActivityId !== activityId) {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({
          response: "error",
          error: "QR code activity mismatch",
        })
      );
    }

    const updateEnrollment = await prisma.enrollments.updateMany({
      where: {
        activityId,
        userId,
      },
      data: {
        attended: true,
      },
    });

    if (updateEnrollment.count === 1) {
      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
        select: { points: true },
      });
      let awardedPoints = 0;
      if (activity) {
        await prisma.user.update({
          where: { id: userId },
          data: { points: { increment: activity.points } },
        });
        awardedPoints = activity.points;
      }

      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({
          response: "success",
          updateEnrollment,
          awardedPoints,
          message: `Check-in successful! Awarded ${awardedPoints} points.`,
        })
      );
    } else {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({
          response: "success",
          updateEnrollment,
          awardedPoints: 0,
          message: "Already checked in or enrollment not found.",
        })
      );
    }
  } catch (error) {
    prisma.$disconnect();
    // console.log(error)
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
