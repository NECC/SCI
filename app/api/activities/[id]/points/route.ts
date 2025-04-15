import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export interface ActivityPointsResponse {
    response: "success" | "error";
    points: number;
    error?: string;
  }

/**
 * Get specific Activity points from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req: Request, props: { params: { id: string }}) {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: parseInt(props.params.id),
      },
      select: {
        points: true,
      },
    });
    // console.log(activity);

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", points: activity })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}