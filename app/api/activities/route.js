import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Get all Activities from the database
export async function GET() {
  const prisma = new PrismaClient();
  try {
    const activities = await prisma.activity.findMany({
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
      },
    });
    console.log(activities);

    return new NextResponse(
      JSON.stringify({ response: "success", activities: activities })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}

// Create a new Activity
export async function POST(request) {
  const prisma = new PrismaClient();
  const data = await request.json();

  try {
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        speakers: data.speakers,
        location: data.location,
        capacity: data.capacity,
        date: new Date(data.date),
        type: data.type,
      },
    });

    return new NextResponse(
      JSON.stringify({ response: "success", activity: activity })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}