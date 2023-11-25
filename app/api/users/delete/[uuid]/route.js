import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Delete an User from the database
export async function DELETE(req, { params: { uuid }}) {
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
