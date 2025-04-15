import { authOptions } from "@lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export interface UserPutRouletteResponse {
  response: "success" | "error";
  update?: {
    email: string;
    id: string;
    name: string;
    rewarded: boolean;
  };
  error?: string;
}

/**
 * Update user accreditation by ID
 * @method PUT
 * @param {string} id User id to get
 * @returns
 */
export async function PUT(request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role != "STAFF") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to spend a ticket!",
      })
    );
  }
  
  const id = context.params.id;
  // console.log(id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        rewarded: true,
      }
    });

    if (!user) {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "User not found!" })
      );
    }

    if(!user.rewarded) {
        prisma.$disconnect();
        return new NextResponse(
            JSON.stringify({ response: "error", error: "You don't have a roulette ticket!" })
        );
    }

    const update = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        rewarded: false,
      },
      select: {
        email: true,
        id: true,
        name: true,
        rewarded: true,
      },
    });

    // console.log(update);
    
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", update: update })
    );

  } catch (error) {

    // console.log(error);

    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}