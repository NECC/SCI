import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

/**
 * Deletes an Enrollment by ID
 * @method DELETE
 * @requires ADMIN
 * @param {string} id - Enrollment ID
 * @returns {response: "success", userDeleted: enrollment.count | {response: "error", error: error}}
 */
export async function DELETE(req, { params: { id }}) {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to delete an user",
      })
    );
  }

  try {
    const enrollment = await prisma.enrollments.deleteMany({
      where: {
        id: parseInt(id),
      },
    });

    prisma.$disconnect();
    return Response.json({ response: "success", enrollmentDeleted: enrollment.count })
  } catch (error) {
    prisma.$disconnect();
    // console.log(error);
    return Response.json({ response: "error", error: error })

  }
}
