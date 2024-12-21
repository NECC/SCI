import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export interface UserPostAccreditationResponse {
  response: "success" | "error";
  update?: {
    email: string;
    id: string;
    name: string;
    accredited: boolean;
  };
  error?: string;
}

/**
 * Update user accreditation by ID
 * @method POST
 * @param {string} id User id to get
 * @returns
 */
export async function POST(request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to update an user accreditation!",
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
        accredited: true,
      }
    });

    const update = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        accredited: user.accredited ? false : true,
      },
      select: {
        email: true,
        id: true,
        name: true,
        accredited: true,
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
