import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

/**
 * Get an enrollment attended status
 * @method GET
 * @param {params}  { ids: [activityId, userId] }
 * @returns [{ attended: boolean }]
 **/
export async function GET(request, { params }) {
  try {
    const updateEnrollment = await prisma.enrollments.findMany({
      where: {
        activityId: parseInt(params.ids[0]),
        userId: params.ids[1],
      },
      select: {
        attended: true,
      }
    });
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "success",
        attended: updateEnrollment[0]?.attended, // TODO: if the enrollment is not found, it will return undefined, since there's Talks and the possibility of the enrollment not existing, we should handle this case
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
