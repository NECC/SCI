import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/**
 * Get all Users from the database
 * @method GET
 * @returns [{ id, name, email, role, points }]
 */
export async function GET() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
      enrollments: true,
    },
  });
  console.log(users);

  return new NextResponse(
    JSON.stringify({ response: "success", users: users })
  );
}

/**
 * Creates a new User
 * @method POST
 * @param body name, email, password
 *
 * @example body: { "name": "Pedro Camargo", "email": "example@gmail.com", "password": "123456" }
 * 
 */
export async function POST(req) {
  const prisma = new PrismaClient();
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
      },
    });

    return new NextResponse(
      JSON.stringify({ response: "success", user: user })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}

/**
 * Updates a User
 * @method PUT
 * @param body uuid, params: { name, email, role, points }
 *
 * @example body: { "uuid": "6143a3cb-2f08-43ae-9932-18a3c951d591", "params": { "name": "Pedro Camargo", "email": "pedrao@gmail.com", "role": "ADMIN", "points": 0 } }
 */
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
