import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  const data = await request.json();

  try {
    const increment = await prisma.user.update({
        where: {
            id: data.id
        },
        data: {
            points: {
                increment: 1
            }
        }
    })

    return new NextResponse(
      JSON.stringify({ response: "success", increment: { user: increment.id, points: increment.points }})
    );
    
  } catch (error) {

    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );

  }
}
