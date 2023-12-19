import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
    
    // If it's not full, create a new enrollment
    const enrollment = await prisma.enrollments.create({
      data: {
        activity: {
          connect: {
            id: data.activityId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
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
