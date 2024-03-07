import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ActivitySchema } from "/prisma/zod";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

/**
 * Get all Activities from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET() {
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
        startTime: true,
        endTime: true,
        picUrl: true,
      },
    });
    // console.log(activities);

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", activities: activities })
    );
  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}

/**
 * Creates a new Activity
 * @method POST
 * @param body title, description, speakers, location, capacity, date, type
 *
 * @example body: { "title": "Palestra de React", "description": "Palestra sobre React", "speakers": "Pedro Camargo", "location": "Sala 1", "capacity": 50, "date": "2021-10-10T14:00:00.000Z", "type": "Palestra" }
 *
 */
export async function POST(request) {
  const data = await request.json();
  const response = ActivitySchema.safeParse(data);

  const session = await getServerSession(authOptions);

  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to create an activity",
      })
    );
  }

  if (!response.success) {
    console.error(response.error);
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: "ja fostes" })
    );
  }

  const activity = await prisma.activity.create({
    data: {
      title: data.title,
      description: data.description,
      speakers: data.speakers,
      location: data.location,
      capacity: data.capacity,
      date: new Date(data.date),
      endTime: data.endTime,
      startTime: data.startTime,
      type: data.type,
    },
  });
  prisma.$disconnect();
  return new NextResponse(
    JSON.stringify({ response: "success", activity: activity })
  );
}
