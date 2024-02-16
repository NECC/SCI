import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Get an User by ID
 * @method GET
 * @param {string} id User id to get
 * @returns 
 */
export async function GET(request, context) {
    const id = context.params.id;
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
    console.log(user);
    
    return new NextResponse(
        JSON.stringify({ response: "success", user: user })
    );
}


