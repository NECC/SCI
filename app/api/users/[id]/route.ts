import { authOptions } from "@lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from '@/lib/prisma';

interface Props {
    params: { id: string };
}

export interface UserGetResponse {
    response: "success" | "error";
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        picture?: string;
        points: number,
        graduation: string,
        courseYear: number,
        academicNumber: number,
        enrollments: {
            id: string;
            activity: {
                id: string;
                title: string;
                type: string;
            }
        }[];
    };
    error?: string;
}

export interface UserUpdateResponse {
    response: "success" | "error";
    error?: string;
}


// TODO: Try catch() block
/**
 * Get an User by ID
 * @method GET
 * @param {string} id User id to get
 * @returns 
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            picture: true,
            points: true,
            graduation: true,
            courseYear: true,
            academicNumber: true,
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
    });
    // console.log(user);
    prisma.$disconnect();
    return new NextResponse(
        JSON.stringify({ response: "success", user: user })
    );
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const data = await request.json();

    const session = await getServerSession(authOptions);
    
    // admin-only updates: points (absolute or increment), role, accreditation
    if (data.points !== undefined || data.role !== undefined || data.accredited !== undefined) {
          if (session?.user.role !== "ADMIN") {
            prisma.$disconnect();
            return new NextResponse(
              JSON.stringify({
                response: "error",
                error: "You don't have permission to update users!",
              })
            );
          }

          const updateData: any = {};
          
          if (data.pointsAbsolute !== undefined) {
            // Set points to an absolute value
            updateData.points = data.pointsAbsolute;
          } else if (data.points !== undefined) {
            // Increment points by this amount
            updateData.points = { increment: parseInt(data.points) ?? 0 };
          }
          
          if (data.role !== undefined) {
            updateData.role = data.role;
          }
          
          if (data.accredited !== undefined) {
            updateData.accredited = data.accredited;
          }

          const user = await prisma.user.update({
              where: { id },
              data: updateData,
          });
          prisma.$disconnect();
          return new NextResponse(
              JSON.stringify({ response: "success", user: user })
          );
    }

    // otherwise treat as profile edit (name/picture)
    if (session?.user.id !== id && session?.user.role !== "ADMIN") {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "Not authorized" })
      );
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.picture) updateData.picture = data.picture;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", user: user })
    );
}
