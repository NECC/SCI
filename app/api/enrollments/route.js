import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = new PrismaClient();
    const enrollments = await prisma.enrollments.findMany({
      select: {
        id: true,
        user: true,
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
        user: true,
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
