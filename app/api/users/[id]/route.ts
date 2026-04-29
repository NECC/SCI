import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

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
        sponsor_badge: boolean;
        enrollments: any[];
        achievements: any[];
        cvs: any[];
        //speakers : any[];
    };
    error?: string;
}

export interface UserUpdateResponse {
    response: "success" | "error";
    user?: any; 
    error?: string;
}

// 1. GET: Fetch User Data
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (session && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                enrollments: { include: { activity: true }},
                achievements: true,
                cvs: true,
                //speakers: true,
            }
        });

        if (!user) return NextResponse.json({ response: "error", error: "User not found" }, { status: 404 });
        return NextResponse.json({ response: "success", user });
    } catch (error) {
        return NextResponse.json({ response: "error", error: "Internal Server Error" }, { status: 500 });
    }
}

// 2. POST: Handle CV Uploads
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (session && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (session?.user.id !== id && session?.user.role !== "ADMIN") {
            return NextResponse.json({ response: "error", error: "Not authorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ response: "error", error: "No file" }, { status: 400 });

        const fileExtension = file.name.split('.').pop();
        const filePath = `${id}/${Date.now()}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cvs')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('cvs')
            .getPublicUrl(uploadData.path);

        const bonusPoints = parseInt(formData.get("bonusPoints") as string) || 0;
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                points: { increment: bonusPoints},
                cvs: {
                    create: {
                        fileName: file.name,
                        fileUrl: publicUrl, 
                        uploadedAt: new Date(),
                    }
                }
            },
            select: { cvs: true }
        });

        return NextResponse.json({ response: "success", cvs: updatedUser.cvs });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ response: "error", error: "Upload failed" }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (session && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    try {
        const { id } = await props.params;
        const data = await request.json();
        const session = await getServerSession(authOptions);
        
        // Admin Logic (Points/Roles)
        if (data.points !== undefined || data.activity !== undefined) {
            if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

            const updateData: any = {};
            if (data.points !== undefined) updateData.points = { increment: parseInt(data.points) };
            if (data.activity) {
                updateData.achievements = {
                    create: { achievement_id: data.activity, type: data.achievementType || "badge" }
                };
            }
            
            const user = await prisma.user.update({ where: { id }, data: updateData });
            return NextResponse.json({ response: "success", user });
        }

        if (session?.user.id !== id && session?.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.picture !== undefined) updateData.picture = data.picture;
        if (data.sponsor_badge !== undefined) updateData.sponsor_badge = data.sponsor_badge;

        const user = await prisma.user.update({
            where: { id },
            data: updateData 
        });


        return NextResponse.json({ response: "success", user });
    } catch (error) {
        return NextResponse.json({ response: "error", error: "Update failed" }, { status: 500 });
    }
}