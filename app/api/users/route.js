import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Get all Users from the database
export async function GET() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
    },
  });
  console.log(users);

  return new NextResponse(
    JSON.stringify({ response: "success", users: users })
  );
}

/**
 * 
  {
    "uuid": "6143a3cb-2f08-43ae-9932-18a3c951d591",
    "params": {
        "name": "Pedro Camargo",
        "email": "pedrao@gmail.com",
        "role": "ADMIN",
        "points": 0
    }
  }
 */
// Update a User in the database
export async function PUT(req) {
  const prisma = new PrismaClient();
  const data = await req.json();
  const uuid = data.uuid;

  try {
    const user = await prisma.user.updateMany({
      where: {
        id: uuid,
      },
      data: {
        name: data.params.name,
        email: data.params.email,
        role: data.params.role,
        points: data.params.points,
      },
    });

    return new NextResponse(
      JSON.stringify({ response: "success", userUpdated: user })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
