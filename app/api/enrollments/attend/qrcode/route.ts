import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

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
export async function POST(request) {
  const data = await request.json();
  const session = await getServerSession(authOptions);

  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to do this action, get out of here!",
      })
    );
  }

  try {
    const updateEnrollment = await prisma.enrollments.updateMany({
      where: {
        activityId: parseInt(data.activityId),
        userId: data.userId,
      },
      data: {
        attended: true,
      },
    });

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "success",
        updateEnrollment,
      })
    );
  } catch (error) {
    prisma.$disconnect();
    // console.log(error)
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
