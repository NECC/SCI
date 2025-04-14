import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@lib/auth";
import { Activity, Enrollments } from "@prisma/generated/zod";
const prisma = new PrismaClient();

export interface EnrollmentGetResponse {
  response: "success" | "error";
  enrollments: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    activity: Activity;
    attended: boolean;
  }[]
  error?: string;
}

/**
 * Get all Enrollments from the database
 * @method GET
 * @returns [{ enrollments }]
**/
export async function GET(req: Request) {
  const params = new URL(req.url);
  const takeParam = params.searchParams.get("take");
  const all = (takeParam !== null && +takeParam === -1) || takeParam === null;
  const session = await getServerSession(authOptions);

  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to see all enrollments!",
      })
    );
  }

  try {
    const enrollments = await prisma.enrollments.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        activity: true,
        attended: true,
      },
      ...(all
        ? {}
        : {
            skip: +(params.searchParams.get("skip") ?? 0) * +(params.searchParams.get("take") ?? 0),
            take: +(params.searchParams.get("take") ?? 0),
          }),
    });
    // console.log(enrollments);
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", enrollments: enrollments })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}


export interface EnrollmentPostResponse {
  response: "success" | "error" | "already_enrolled";
  enrollment?: Enrollments;
  error?: string;
}

/**
  * Creates a new Enrollment
  * @requires AUTH
  * @method POST
  * @param body activityId
  * @returns {response: "success", enrollment: enrollment || {response: "error", error: error}}
 */
export async function POST(request: Request) {
  const data = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You need to be logged in to create an enrollment",
      })
    );
  }

  try {
    // Get activity enrollments and check if it's full
    const activityEnrollments = await prisma.activity.findUnique({
      where: {
        id: data.activityId,
      },
      select: {
        enrollments: true,
        capacity: true,
      },
    });

    // If it's full, return an error
    if (activityEnrollments !== null && activityEnrollments.enrollments && activityEnrollments.enrollments.length >= activityEnrollments.capacity) {
      return new NextResponse(
        JSON.stringify({
          response: "error",
          error: "This activity is already full",
        })
      );
    }

    // check if user is already enrolled
    const userEnrollment = await prisma.enrollments.findFirst({
      where: {
        userId: session?.user.id,
        activityId: data.activityId,
      },
    });

    if (userEnrollment) {
      return new NextResponse(
        JSON.stringify({
          response: "already_enrolled",
          error: "You are already enrolled in this activity",
        })
      );
    }

    // If it's not full, create a new enrollment
    const enrollment = await prisma.enrollments.create({
      data: {
        user: {
          connect: {
            id: session?.user.id,
          },
        },
        activity: {
          connect: {
            id: data.activityId,
          },
        },
        attended: false,
      },
    });

    return new NextResponse(
      JSON.stringify({ response: "success", enrollment: enrollment })
    );
  } catch (error) {
    // console.log(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
