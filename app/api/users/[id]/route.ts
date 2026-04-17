import { authOptions } from "@lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from '@/lib/prisma';

interface Props {
    params: { id: string };
}

export interface UserGetResponse {
    response: "success" | "error";
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        picture?: string;
        points: number;
        graduation: string;
        courseYear: number;
        academicNumber: number;
        enrollments: {
            id: number;
            activity: {
                id: number;
                title: string;
                type: string;
                achievement: string | null;
            }
        }[];
        achievements: {
            id_achievement: number;
            id_user: string;
            type: string; // The badge name/type
        }[];
    };
    error?: string;
}

// export interface UserGetBadges {
//     response: "success" | "error";
//     user: {
//         id: string;
//         achievements: {
//             id: string;
//             achievement: {
//                 id : string;
//                 type: string;
//             }
//         }[];
//     };
//     error?: string;
// }

export interface UserUpdateResponse {
    response: "success" | "error";
    error?: string;
}


// TODO: Try catch() block
/**
 * Get an User by ID
 * @method GET
 * @param {string} id User id to get
 * @returns 
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            picture: true,
            points: true,
            graduation: true,
            courseYear: true,
            academicNumber: true,
            enrollments: {
                select: {
                    id: true,
                    activity: {
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            achievement : true,
                        },
                    },
                }
            },
            achievements: {
                select: {
                    id_user: true,
                    achievement_id: true,
                    type: true,
                }
            },
        },
    });
    // console.log(user);
    prisma.$disconnect();
    return new NextResponse(
        JSON.stringify({ response: "success", user: user })
    );
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const data = await request.json();

    const session = await getServerSession(authOptions);
    
    // admin-only updates: points (absolute or increment), role, accreditation
    
    if (data.points !== undefined || data.role !== undefined) {
        if (session?.user.role !== "ADMIN") {
            return NextResponse.json({ response: "error", error: "Forbidden" }, { status: 403 });
        }

        const alreadyHasBadge = await prisma.achievement.findFirst({
            where: {
                id_user: id,
                achievement_id: data.activity 
            }
        });

        if (alreadyHasBadge) {
            return NextResponse.json({ 
                response: "error", 
                error: "Pontos já atribuídos para esta atividade." 
            });
        }

        const updateData: any = {};
        if (data.points !== undefined) {
            updateData.points = { increment: parseInt(data.points) || 0 };
        }
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...updateData,
                achievements: {
                    create: {
                        achievement_id: data.activity,
                        type: data.achievementType || "badge" 
                    }
                }
            }
        });

        return NextResponse.json({ response: "success", user: updatedUser });
    }

    // otherwise treat as profile edit (name/picture)
    if (session?.user.id !== id && session?.user.role !== "ADMIN") {
      prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ response: "error", error: "Not authorized" })
      );
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.picture) updateData.picture = data.picture;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ response: "success", user: user })
    );
}
