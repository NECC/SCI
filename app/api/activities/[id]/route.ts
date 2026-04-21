import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export interface ActivityGetResponseById {
  response: "success" | "error";
  activity: {
    id: number;
    title: string;
    description: string;
    speakerId: string;
    location: string;
    capacity: number;
    date: Date;
    type: string;
    achievement:string;
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
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const activity = await prisma.activity.findMany({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        speakerId: true,
        location: true,
        capacity: true,
        date: true,
        type: true,
        achievement: true,
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