import { authOptions } from "@lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export interface UserPutRouletteResponse {
  response: "success" | "error";
  update?: {
    email: string;
    id: string;
    name: string;
    rewarded: number;
  };
  error?: string;
}

/**
 * Update user reward by ID
 * @method PUT
 * @param {string} id User id to get
 * @returns
 */
export async function PUT(request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
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
        points: true,
        hasTicket: true,
      }
    });

    if (!user) {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "User not found!" })
      );
    }

    if (user.hasTicket) {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "You still have a unspent roulette ticket!" })
      );
    }

    if (user.points < (user.rewarded+1)*1000) {
        prisma.$disconnect();
        return new NextResponse(
            JSON.stringify({ response: "error", error: `You need at least ${(user.rewarded+1)*1000} points to spin the wheel!` })
        );
    }

    const update = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        rewarded: {
          increment: 1,
        },
        hasTicket: true,
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