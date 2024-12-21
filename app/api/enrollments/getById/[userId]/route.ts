import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export interface EnrollmentGetByUserIdResponse {
  response: "success" | "error";
  enrollment: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    activity: {
      id: number;
      title: string;
      description: string;
      speakers: string;
      location: string;
      capacity: number;
      date: Date;
      type: string;
    };
    attended: boolean;
  }[];
}

/**
 * Get all Enrollments from the database
 * @method GET
 * @requires AUTH
 * @param {string} activityId
 * @returns [{ enrollments }]
 */
export async function GET(request, context) {
  const id = context.params.userId;

  try {
    const enrollments = await prisma.enrollments.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activity: true,
        attended: true,
      },
    });

    // console.log(enrollments);
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", enrollment: enrollments })
    );
  } catch (err) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        message: "Error fetching enrollments",
      }),
      { status: 500 }
    );
  }
}
