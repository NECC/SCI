import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();


/**
 * Get csv file of user points
 * @method POST
 * @returns [{ user, points }]
**/
export async function GET() {
  // const data = await request.json();
  const session = await getServerSession(authOptions);


  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to get the ranking!",
      })
    );
  }

  try {
    // get csv file of user id, email, name, and points

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            points: true,
            role: true
        }
    })

    // create csv file where each line of id email name appears points times

    let csv = "id,email,name\n";

    for (let i = 0; i < users.length; i++) {
      if (users[i].role == "USER") {
        for (let j = 0; j < users[i].points; j++) {
          csv += `${users[i].id},${users[i].email},${users[i].name}\n`;
        }
      }
    }

    prisma.$disconnect();

    // return csv file
    return new NextResponse(
      csv,
      {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="users.csv"`,
        },
      }
    );

  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}

/**
 * Increments the points of an User by 1
 * @method POST
 * @returns [{ user, points }]
**/
export async function POST(request) {
  const data = await request.json();
  const session = await getServerSession(authOptions);


  if (session?.user.role != "ADMIN") {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({
        response: "error",
        error: "You don't have permission to give points to an user!",
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
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", increment: { user: increment.id, points: increment.points }})
    );

  } catch (error) {
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "error", error: error })
    );
  }
}
