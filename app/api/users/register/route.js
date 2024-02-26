import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";

/**
 * Registers a new User
 * @method POST
 * @param body name, email, password
 *
 * @example body: { "name": "Pedro Camargo", "email": "example@gmail.com", "password": "123456" }
 *
 */
export async function POST(req) {      
    const prisma = new PrismaClient();
    try {
      const userData = await req.json();
      
      if (!userData.name || !userData.email || !userData.password) {
        prisma.$disconnect();
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
          email: userData.email,
          password: userData.password,
          role: "USER",
          points: 0,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          points: true,
        },
      });
  
      console.log("User Created Successfully: ", user);

      signIn("credentials", {
        email: userData.email,
        password: userData.password,
        callbackUrl: "/",
      });
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "User created Successfully.", user: user })
      );
    } catch (error) {
      console.log(error);
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: error })
      );
    }
  }
  