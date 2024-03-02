import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

/**
 * Deletes an Activity by ID
 * @method DELETE
 * @requires ADMIN
 * @param {string} id Activity id to delete
 * @returns {response: "success", activityDeleted: { id, title, description, speakers, location, capacity, date, type, enrollments } | {response: "error", error: error}}
**/
export async function DELETE(req, { params: { id } }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to delete an activity!",
      })
    );
  }


  try {
    
    // first we must delete the enrollments that have the activity
    await prisma.enrollments.deleteMany({
      where: {
        activityId: parseInt(id),
      },
    });

    // then we delete the activity
    const activity = await prisma.activity.delete({
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
      },
    });

    prisma.$disconnect();

    return new NextResponse(
      JSON.stringify({ response: "success", activityDeleted: activity })
    );
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
