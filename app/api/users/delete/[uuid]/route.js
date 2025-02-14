import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

/**
 * Deletes an User by ID
 * @method DELETE
 * @requires ADMIN
 * @param {string} uuid User id to delete
 * @returns {response: "success", userDeleted: { id, name, email, role, points } | {response: "error", error: error}}
 */
export async function DELETE(req, { params: { uuid }}) {

  const session = await getServerSession(authOptions);
  // console.log("SESSION FROM POST: ",session);

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

    prisma.$disconnect();
    return Response.json({ response: "success", userDeleted: user })
  } catch (error) {
    prisma.$disconnect();
    console.log(error);
    return Response.json({ response: "error", error: error })

  }
}
