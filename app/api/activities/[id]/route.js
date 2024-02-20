import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

/**
 * Get specific Activity from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req, {params: { id }}) {
  try {
    const activity = await prisma.activity.findMany({
      where: {
        id: parseInt(id),
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
    console.log(activity);

    return new NextResponse(
      JSON.stringify({ response: "success", activity: activity })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}