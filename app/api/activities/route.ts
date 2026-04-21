import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ActivitySchema } from "@prisma/zod";
import { authOptions } from "@lib/auth";
import { Activity, Enrollments, Speaker } from "@prisma/generated/zod";
import { prisma } from '@/lib/prisma';

export interface ActivityGetResponse {
  response: "success" | "error";
  activities: (Activity & { enrollments: Enrollments[]} & {speakers: Speaker[]})[]
  error?: string;
}

/**
 * Get all Activities from the database
 * @method GET
 * @returns [{ id, title, description, speakers, location, capacity, date, type, enrollments }]
 */
export async function GET(req: Request) {
  const params = new URL(req.url);
  const takeParam = params.searchParams.get("take");
  const all = (takeParam !== null && +takeParam === -1) || takeParam === null;
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
        url: true,
        points: true,
        achievement: true,
      },

      ...(all
        ? {}
        : {
            skip: +(params.searchParams.get("skip") ?? 0) * +(params.searchParams.get("take") ?? 0),
            take: +(params.searchParams.get("take") ?? 0),
          }),
    });
    console.log(activities);

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
export async function POST(request: Request) {
  const data = await request.json();
  const response = ActivitySchema.safeParse(data);
  console.log(data);

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
    console.error("An error occurred while validating the data");
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: "ja fostes" })
    );
  }

  const activity = await prisma.activity.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      capacity: data.capacity,
      date: new Date(data.date),
      endTime: data.endTime,
      startTime: data.startTime,
      type: data.type,
      url: null,
      points: data.points,
      achievement:data.achievement,
    },
  });
  prisma.$disconnect();
  return new NextResponse(
    JSON.stringify({ response: "success", activity: activity })
  );
}
