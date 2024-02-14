import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const prisma = new PrismaClient();
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
    });
    console.log(enrollments);

    return new NextResponse(
      JSON.stringify({ response: "success", enrollments: enrollments })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}

export async function POST(request) {
  const prisma = new PrismaClient();
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
    if (activityEnrollments.enrollments.length >= activityEnrollments.capacity) {
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
    console.log(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
