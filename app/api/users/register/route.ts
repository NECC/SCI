import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";
import { UserSchema } from "@prisma/zod";

const prisma = new PrismaClient();

export interface UserPostRegisterResponse {
  response: "success" | "error";
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  error?: string;
}

/**
 * Registers a new User
 * @method POST
 * @param body name, email, password
 *
 * @example body: { "name": "Pedro Camargo", "email": "example@gmail.com", "password": "123456" }
 *
 */
export async function POST(request: Request) {
  const userData = await request.json();
  const response = UserSchema.safeParse(userData);
  if (!response.success) {
    console.error("Form validation error");
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: "form validation" })
    );
  }

  // check for duplicate emails
  const emailExists = await prisma.user.findUnique({
    where: {
      email: userData.email.toLowerCase(),
    },
  });

  if (emailExists) {
    prisma.$disconnect();
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
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  prisma.$disconnect();
  return new NextResponse(
    JSON.stringify({ response: "User created Successfully.", user: user })
  );
}
