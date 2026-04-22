import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

// 1. Define the expected shape of your route parameters
interface RouteContext {
  params: Promise<{ uuid: string }>;
}
/**
 * Deletes a User by ID
 * @method DELETE
 * @requires ADMIN
 * @param {string} uuid User id to delete
 * @returns {response: "success", userDeleted: { id, name, email, role, points } | {response: "error", error: string}}
 */
export async function DELETE(
  req: NextRequest, 
  { params }: RouteContext
) {
  const { uuid } = await params;

  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    await prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to delete a user",
      }),
      { status: 403 } 
    );
  }

  try {
    const enrollments = await prisma.enrollments.deleteMany({
      where: {
        userId: uuid
      }
    });

    const user = await prisma.user.delete({
      where: {
        id: uuid
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    await prisma.$disconnect();
    return NextResponse.json({ response: "success", userDeleted: user });
    
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
  
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { response: "error", error: errorMessage },
      { status: 500 }
    );
  }
}