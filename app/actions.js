"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getActivity(id) {
  // find activity by id and return
  return await prisma.activity.findUnique({
    where: {
      id: id,
    },
  });
}

// get all the activities from the database and add a new field enrollable if activity.capacity > activity.enrollments.length
export async function getActivities() {
  const activities = await prisma.activity.findMany({
    include: {
      enrollments: true,
    },
  });

  return activities.map((activity) => {
    return {
      ...activity,
      enrollable: activity.capacity > activity.enrollments.length,
    };
  });
}
