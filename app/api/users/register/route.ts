import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { CreateUserSchema, CourseType as Course } from "@prisma/zod";
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase-server';

export interface UserPostRegisterResponse {
  response: "success" | "error";
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    academicNumber?: number;
    graduation?: Course;
    courseYear?: number;
  };
  error?: string;
}

export async function POST(request: Request) {
  try {
    console.log("Registering user");
    const userData = await request.json();
    const validation = CreateUserSchema.safeParse(userData);

    if (!validation.success) {
      console.error("Form validation error", validation.error);
      return NextResponse.json(
        { response: "error", error: "Form validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check for duplicate email
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (emailExists) {
      return NextResponse.json(
        { response: "error", error: "Email already exists" },
        { status: 409 }
      );
    }

    if (data.academicNumber) {
      const academicNumberExists = await prisma.user.findUnique({
        where: { academicNumber: data.academicNumber },
      });

      if (academicNumberExists) {
        return NextResponse.json(
          { response: "error", error: "A user with this academic number already exists." },
          { status: 409 }
        );
      }
    }

    // Create user in Supabase Auth
    const supabase = await createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email.toLowerCase(),
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (signUpError) {
      console.error('Supabase signUp error', signUpError);

      if (signUpError.code === 'user_already_exists') {
        return NextResponse.json(
          { response: 'error', error: 'Email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { response: 'error', error: signUpError.message || 'Failed to create auth user' },
        { status: 400 }
      );
    }

    const authUser = signUpData?.user;
    if (!authUser?.id) {
      console.error('No auth user returned from Supabase', signUpData);
      return NextResponse.json(
        { response: 'error', error: 'Failed to create auth user' },
        { status: 500 }
      );
    }

    const authId = String(authUser.id);
    const hashPassword = await bcrypt.hash(data.password, 10);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          id: authId,
          name: data.name,
          email: data.email.toLowerCase(),
          password: hashPassword,
          role: 'USER',
          academicNumber: data.academicNumber,
          graduation: data.graduation,
          courseYear: data.courseYear,
          sponsor_badge: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const fields = (error.meta?.target as string[]) ?? [];
        const message = fields.includes('academicNumber')
          ? 'A user with this academic number already exists.'
          : fields.includes('email')
          ? 'Email already exists.'
          : 'A unique constraint was violated.';

        return NextResponse.json({ response: 'error', error: message }, { status: 409 });
      }
      throw error;
    }

    await prisma.account.create({
      data: {
        userId: authId,
        type: 'oauth',
        provider: 'supabase',
        providerAccountId: authId,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Send welcome email
    try {
      await fetch(`${appUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email.toLowerCase(),
          subject: 'Welcome to SCI - Registration Complete',
          html: `
            <h1>Welcome to SCI, ${data.name}!</h1>
            <p>Your account has been successfully created.</p>
            <ul>
              <li><strong>Name:</strong> ${data.name}</li>
              <li><strong>Email:</strong> ${data.email.toLowerCase()}</li>
              ${data.academicNumber ? `<li><strong>Academic Number:</strong> ${data.academicNumber}</li>` : ''}
              ${data.graduation ? `<li><strong>Course:</strong> ${data.graduation}</li>` : ''}
            </ul>
            <p>You can now sign in and start participating in activities!</p>
            <p>Best regards,<br/>The SCI Team</p>
          `,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Send admin notification
    try {
      await fetch(`${appUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          subject: 'New User Registration - SCI',
          html: `
            <h1>New User Registration</h1>
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
    }

    return NextResponse.json({ response: 'success', user }, { status: 201 });

  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { response: "error", error: error.message || "Failed to create user in database" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}