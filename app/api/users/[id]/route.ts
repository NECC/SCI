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
export async function GET(request: Request, props: Props) {
    const id = props.params.id;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
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

export async function PUT(request: Request, props: Props) {
    const id = props.params.id;
    const data = await request.json();

    const session = await getServerSession(authOptions);
          
          if (session?.user.role != "ADMIN") {
            prisma.$disconnect();
            return new NextResponse(
              JSON.stringify({
                response: "error",
                error: "You don't have permission to update an user's points!",
              })
            );
          }

    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            points: {
                increment: parseInt(data.points) ?? 0,
            }
        },
    });
    // console.log(user);
    prisma.$disconnect();
    return new NextResponse(
        JSON.stringify({ response: "success", user: user })
    );
}
