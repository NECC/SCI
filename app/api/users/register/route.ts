import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";
import { CreateUserSchema, CourseType as Course } from "@prisma/zod";
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase-server';

export interface UserPostRegisterResponse {
  response: "success" | "error";
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    academicNumber?: number;
    graduation?: Course;
    courseYear?: number;
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
  try {
    console.log("Registering user");
    const userData = await request.json();
    const validation = CreateUserSchema.safeParse(userData);
    if (!validation.success) {
      console.error("Form validation error", validation.error);
      return new NextResponse(
        JSON.stringify({ response: "error", error: "Form validation failed" })
      );
    }

    const data = validation.data;

    // check for duplicate emails
    const emailExists = await prisma.user.findUnique({
      where: {
        email: data.email.toLowerCase(),
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

    // Create user in Supabase Auth first
    const supabase = await createClient();

    // Use supabase auth signUp to create the auth user
    // We use any casts because the supabase client types can vary between versions
    const signUpResult: any = await supabase.auth.signUp({
      email: data.email.toLowerCase(),
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (signUpResult.error) {
      console.error('Supabase signUp error', signUpResult.error);
      return new NextResponse(
        JSON.stringify({ response: 'error', error: signUpResult.error.message || 'Failed to create auth user' })
      );
    }

    const authUser = signUpResult.data?.user || signUpResult.user;
    if (!authUser || !authUser.id) {
      console.error('No auth user returned from Supabase', signUpResult);
      return new NextResponse(
        JSON.stringify({ response: 'error', error: 'Failed to create auth user' })
      );
    }

    const authId = String(authUser.id);

    // Hash local password if still storing locally (keeps compatibility with credentials provider)
    const hashPassword = await bcrypt.hash(data.password, 10);

    // Create local User record using the Supabase auth id as primary key
    const user = await prisma.user.create({
      data: {
        id: authId,
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashPassword,
        role: 'USER',
        academicNumber: data.academicNumber,
        graduation: data.graduation,
        courseYear: data.courseYear,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Create Account record to link with NextAuth / external provider
    await prisma.account.create({
      data: {
        userId: authId,
        type: 'oauth',
        provider: 'supabase',
        providerAccountId: authId,
      },
    });

    // Send welcome email to the new user
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email.toLowerCase(),
          subject: 'Welcome to SCI - Registration Complete',
          html: `
            <h1>Welcome to SCI, ${data.name}!</h1>
            <p>Your account has been successfully created.</p>
            <p>Here are your registration details:</p>
            <ul>
              <li><strong>Name:</strong> ${data.name}</li>
              <li><strong>Email:</strong> ${data.email.toLowerCase()}</li>
              ${data.academicNumber ? `<li><strong>Academic Number:</strong> ${data.academicNumber}</li>` : ''}
              ${data.graduation ? `<li><strong>Course:</strong> ${data.graduation}</li>` : ''}
            </ul>
            <p>You can now sign in to your account and start participating in activities!</p>
            <p>Best regards,<br/>The SCI Team</p>
          `,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Send admin notification about new registration
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          subject: 'New User Registration - SCI',
          html: `
            <h1>New User Registration</h1>
            <p>A new user has registered on SCI:</p>
            <ul>
              <li><strong>Name:</strong> ${data.name}</li>
              <li><strong>Email:</strong> ${data.email.toLowerCase()}</li>
              <li><strong>Academic Number:</strong> ${data.academicNumber || 'N/A'}</li>
              <li><strong>Course:</strong> ${data.graduation || 'N/A'}</li>
              <li><strong>Course Year:</strong> ${data.courseYear || 'N/A'}</li>
            </ul>
          `,
        }),
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
      // Don't fail registration if admin email fails
    }

    return new NextResponse(JSON.stringify({ response: 'success', user: user }));
  } catch (error: any) {
    console.error("Error registering user:", error);
    return new NextResponse(
      JSON.stringify({ response: "error", error: error.message || "Failed to create user in database" })
    );
  } finally {
    prisma.$disconnect();
  }
}
