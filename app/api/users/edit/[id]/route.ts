import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Props {
    params: { id: string };
}


/**
 * Update a User with ID
 * @method PUT
 * @param {string} id User id to get
 * @returns 
 */
export async function PUT(req: Request, props: Props){
    const id = props.params.id;
    const userData = await req.json();

    if (userData.name == ""){
      userData.name = null;
    }
    if (userData.email == ""){
      userData.email = null;
    }
    if (userData.role == "NO CHANGE"){
      userData.role = null;
    }

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

    const update = await prisma.user.update({
        where:{
            id: id,
        },

        data:{
            name: userData.name ?? undefined,
            email: userData.email ?? undefined,
            role: userData.role ?? undefined,
        },
    });

    prisma.$disconnect();
    return new NextResponse(
        JSON.stringify({ response: "User updated Successfully.", user: update })
    );
}