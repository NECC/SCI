import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
        points: number;
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


