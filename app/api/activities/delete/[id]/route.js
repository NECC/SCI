import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

// Delete an Activity from the database
export async function DELETE(req, { params: { id } }) {
  try {
    
    await prisma.enrollments.deleteMany({
      where: {
        activityId: parseInt(id),
      },
    });

    const user = await prisma.activity.delete({
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

    return new NextResponse(
      JSON.stringify({ response: "success", activityDeleted: user })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
