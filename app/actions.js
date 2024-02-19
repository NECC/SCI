"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
const prisma = new PrismaClient();

export async function getActivity(id) {
  // find activity by id and return
  return await prisma.activity.findUnique({
    where: {
      id: id,
    },
  });
}

const groupAndSortActivitiesByDay = (activities) => {
  // Group activities by date
  const groups = activities.reduce((groups, activity) => {
    const date = new Date(activity.date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are 0-based
    const year = date.getUTCFullYear();
    const dateString = `${day}`;

    const group = groups[dateString] || [];
    group.push(activity);
    groups[dateString] = group;
    return groups;
  }, {});

  // Convert groups to an array and sort by date
  return Object.entries(groups).sort(
    ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
  );
};

export async function getUserEnrolledActivitiesGroupedByDay() {
  const session = await getServerSession(authOptions);
  const enrollments = await prisma.enrollments.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      activity: true,
    },
  });

  return groupAndSortActivitiesByDay(
    enrollments.map((enrollment) => {
      return {
        ...enrollment.activity,
        attended: enrollment.attended,
      };
    })
  );
}

// get all the activities from the database and add a new field enrollable if activity.capacity > activity.enrollments.length
export async function getActivitiesGroupedByDay() {
  const session = await getServerSession(authOptions);
  const activities = await prisma.activity.findMany({
    include: {
      enrollments: true,
    },
  });

  return groupAndSortActivitiesByDay(
    activities.map((activity) => {
      return {
        ...activity,
        enrollable: activity.capacity > activity.enrollments.length,
        alreadyEnrolled: activity.enrollments.some(
          (enrollment) => enrollment.userId === session?.user.id
        ),
      };
    })
  );
}
