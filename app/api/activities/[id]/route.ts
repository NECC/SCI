import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export interface ActivityGetResponseById {
  response: "success" | "error";
  activity: {
    id: number;
    title: string;
    description: string;
    speakers: string;
    location: string;
    capacity: number;
    date: Date;
    type: string;
    enrollments: {
      id: number;
      userId: number;
      attended: boolean;
    }[];
  }[];
  error?: string;
}

/**
 * Get specific Activity from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req: Request, props: { params: { id: string }}) {
  try {
    const activity = await prisma.activity.findMany({
      where: {
        id: parseInt(props.params.id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        speakers: true,
        location: true,
        capacity: true,
        date: true,
        type: true,
        enrollments: true,
        startTime: true,
        endTime: true,
      },
    });
    // console.log(activity);

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", activity: activity })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}