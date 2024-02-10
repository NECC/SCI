import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

// Delete an User from the database
export async function DELETE(req, { params: { uuid }}) {

  const session = await getServerSession(authOptions);
  // console.log("SESSION FROM POST: ",session);

  if (session?.user.role != "ADMIN") {
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
        points: true,
      }
    });

    return Response.json({ response: "success", userDeleted: user })
  } catch (error) {

    console.log(error);
    return Response.json({ response: "error", error: error })

  }
}
