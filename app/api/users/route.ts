import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth"
import bcrypt from "bcrypt";
import { authOptions } from "../auth/[...nextauth]/route";
const prisma = new PrismaClient();

export interface UsersGetResponse {
  response: "success" | "error";
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    accredited: boolean;
    enrollments: {
      id: string;
      activity: {
        id: string;
        title: string;
        type: string;
      }
    }[]
  }[];
  error?: string;
}

/**
 * Get all Users from the database
 * @method GET
 * @returns [{ id, name, email, role, points }]
 */
export async function GET(req : Request) {
  const session = await getServerSession(authOptions);
  const params = new URL(req.url);
  
  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to get all users",
      })
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accredited: true,
      enrollments: {
        select: {
          id: true,
          activity: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        }
      },
    },
    skip: +params.searchParams.get("skip"),
    take: +params.searchParams.get("take"),
  });
  // // console.log(users);

  return new NextResponse(
    JSON.stringify({ response: "success", users: users })
  );
}


export interface UserPostResponse {
  response: "success" | "error";
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  error?: string;
}

/**
 * Creates a new User
 * @method POST
 * @param body name, email, password
 *
 * @example body: { "name": "Pedro Camargo", "email": "example@gmail.com", "password": "123456" }
 *
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // console.log("SESSION FROM POST: ",session);

  if (session?.user.role != "ADMIN") {
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to create a new user",
      })
    );
  }

  try {
    const userData = await req.json();
    
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      return new NextResponse(
        JSON.stringify({
          response: "error",
          error: "Missing name, email or password",
        })
      );
    }

    // check for duplicate emails
    const emailExists = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (emailExists) {
      return new NextResponse(
        JSON.stringify({
          response: "error",
          error: "Email already exists",
        })
      );
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        academicNumber: userData.academicNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // console.log("User Created Successfully: ", user);

    return new NextResponse(
      JSON.stringify({ response: "User created Successfully.", user: user })
    );
  } catch (error) {
    // console.log(error);
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
  const data = await req.json();
  const uuid = data.uuid;

  const session = await getServerSession(authOptions);
  // // console.log("SESSION FROM POST: ",session);

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
    const user = await prisma.user.updateMany({
      where: {
        id: uuid,
      },
      data: {
        name: data.params.name,
        email: data.params.email,
        role: data.params.role,
      },
    });

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", userUpdated: user })
    );
  } catch (error) {
    // console.log(error);
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
