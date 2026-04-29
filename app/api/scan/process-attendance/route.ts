import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN" || session?.user.role !== "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    
    const body = await req.json();
    const { userId, activityId } = body;

    if (!userId || !activityId) {
      return NextResponse.json(
        { success: false, error: "Missing userId or activityId" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      
      // Check if the user is already enrolled AND has already attended
      const existingEnrollment = await tx.enrollments.findUnique({
        where: {
          userId_activityId: { 
            userId: userId,
            activityId: activityId,
          },
        },
      });

      if (existingEnrollment?.attended) {
        throw new Error("ALREADY_ATTENDED");
      }

      await tx.enrollments.upsert({
        where: {
          userId_activityId: {
            userId: userId,
            activityId: activityId,
          },
        },
        update: { attended: true },
        create: {
          userId: userId,
          activityId: activityId,
          attended: true,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          points: { increment: activity.points },
        },
      });

      if (activity.achievement) {
        await tx.achievement.upsert({
          where: {
            user_achievement_unique: { 
              id_user: userId,
              achievement_id: activityId,
            },
          },
          update: {},
          create: {
            id_user: userId,
            achievement_id: activityId,
            type: activity.achievement,
          },
        });
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Attendance Transaction Error:", error);

    if (error.message === "ALREADY_ATTENDED") {
      return NextResponse.json(
        { success: false, error: "User has already attended this activity." },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}