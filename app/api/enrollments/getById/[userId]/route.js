import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Get all Enrollments from the database
 * @method GET
 * @requires AUTH
 * @param {string} activityId
 * @returns [{ enrollments }]
 */
export async function GET(request, context) {
    const id = context.params.userId;

    try {

        const enrollments = await prisma.enrollments.findMany({
            where: {
                userId: id,
            },
            include: {
                activity: true,
            }
        });

        console.log(enrollments);
        
        return new NextResponse(
            JSON.stringify({ response: "success", enrollment: enrollments })
        );
    } catch(err) {
        return new NextResponse(
            JSON.stringify({ response: "error", message: "Error fetching enrollments" }),
            { status: 500 }
        );
    }
}


