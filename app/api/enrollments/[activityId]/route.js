import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";

import { prisma } from '@/lib/prisma';

/**
 * Get all Enrollments from the database
 * @method GET
 * @requires AUTH
 * @param {string} activityId
 * @returns [{ enrollments }]
 */
export async function GET(request, context) {
    const id = context.params.activityId;

    try {
        const session = await getServerSession(authOptions);
        if (session?.user.id !== id) {
            return NextResponse.json({ response: "error", error: "Forbidden" }, { status: 403 });
        }

        const enrollments = await prisma.activity.findMany({
            where: {
                id: parseInt(id),
            },
            select: {
                enrollments: {
                    select: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    }
                    
                },
            },
        });
        
        // console.log(enrollments);
        prisma.$disconnect();
        return new NextResponse(
            JSON.stringify({ response: "success", enrollment: enrollments })
        );
    } catch(err) {
        prisma.$disconnect();
        return new NextResponse(
            JSON.stringify({ response: "error", message: "Error fetching enrollments" }),
            { status: 500 }
        );
    }
}


