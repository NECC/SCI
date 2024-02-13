import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();


/**
 * Increments the points of an User by 1
 * @method POST
 * @returns [{ user, points }]
**/
export async function POST(request) {
  const data = await request.json();
  const session = await getServerSession(authOptions);


  if (session?.user.role != "ADMIN") {
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to delete an user",
      })
    );
  }

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
