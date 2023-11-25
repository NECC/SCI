import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// Create a User in the database
export async function POST(req) {
  const data = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
      }
    });

    return Response.json({ response: "success", user: user })

  } catch (error) {

    console.log(error);
    return Response.json({ response: "error", error: error })

  }
}
