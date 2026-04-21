import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req:Request)
{
  try {
    const speakers = await prisma.speaker.findMany({
    });
    if (!speakers) {
      return NextResponse.json({ response: "error", error: "No speakers found" }, { status: 404 });
    }
    return NextResponse.json({ response: "success", speakers });  
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return NextResponse.json({ response: "error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json(
      { response: "error", error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      return NextResponse.json(
        { response: "error", error: "Missing name or image file" },
        { status: 400 }
      );
    }

    const existingSpeaker = await prisma.speaker.findFirst({ where: { name } });
    if (existingSpeaker) {
      return NextResponse.json(
        { response: "error", error: "Speaker already exists" },
        { status: 400 }
      );
    }


    const speaker = await prisma.speaker.create({
      data: { name, picUrl: "" }, 
    });

    const fileExtension = file.name.split('.').pop();
    const filePath = `${speaker.id}/${Date.now()}.${fileExtension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image_speakers')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });

   if (uploadError) {
      await prisma.speaker.delete({ where: { id: speaker.id } });
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('image_speakers')
      .getPublicUrl(filePath);

    const updatedSpeaker = await prisma.speaker.update({
      where: { id: speaker.id },
      data: { picUrl: publicUrl },
    });

    return NextResponse.json({ 
      response: "Speaker created successfully.", 
      speaker: updatedSpeaker 
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { response: "error", error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}