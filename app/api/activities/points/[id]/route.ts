import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export interface ActivityPointsResponse {
    response: "success" | "error";
    achievement:string,
    points: number;
    achievement:string,
    error?: string;
  }

/**
 * Get specific Activity points from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req: Request, props: { params: Promise<{ id: string }>}) {
  const { id } = await props.params;
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        achievement : true,
        points: true,
        achievement:true,
      },
    });
    //console.log("Activity from DB:", activity);

    if (!activity) {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "Activity not found" })
      );
    }

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", points: activity.points,achievement: activity.achievement})
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}