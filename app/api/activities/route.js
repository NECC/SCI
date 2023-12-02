import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Get all Activities from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
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

/**
 * Creates a new Activity
 * @method POST
 * @param body title, description, speakers, location, capacity, date, type
 *
 * @example body: { "title": "Palestra de React", "description": "Palestra sobre React", "speakers": "Pedro Camargo", "location": "Sala 1", "capacity": 50, "date": "2021-10-10T14:00:00.000Z", "type": "Palestra" }
 * 
 */
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