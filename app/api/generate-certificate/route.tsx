export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import fs from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role !== "ADMIN") { return NextResponse.json({ response: "error", error: "Not authorized" }, { status: 401 });}
  
  try {
    const body = await req.json();
    const { certificateType, formData } = body;

    const nome = formData?.name || "";
    const title = formData?.title || "";
    const role = formData?.role || "";
    const daysRaw = formData?.days;
    const days = Array.isArray(daysRaw) ? daysRaw.join(", ") : daysRaw || "";
    const isEmergency = certificateType === "Emergency";

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [324, 229], 
    });

    const pageWidth = 324;
    const pageHeight = 229;

    const publicDir = path.join(process.cwd(), "public");

    const getImageBase64 = async (filename: string) => {
      const filePath = path.join(publicDir, filename);
      const fileBuffer = await fs.readFile(filePath);
      return `data:image/png;base64,${fileBuffer.toString("base64")}`;
    };

    const bgPdf = await getImageBase64("bg-pdf.png");
    const cienciasLogo = await getImageBase64("ciencias.png");
    const sciLogo = await getImageBase64("sci-logo2025.png");
    const assinatura = await getImageBase64("assinatura.png");

    doc.addImage(bgPdf, "PNG", 0, 0, pageWidth, pageHeight);

    doc.addImage(cienciasLogo, "PNG", 15, 15, 35, 18);
    doc.addImage(sciLogo, "PNG", pageWidth - 55, 15, 40, 18);

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(35);
    doc.setFont("helvetica", "bold");
    doc.text("Certificado de Participação", pageWidth / 2, 60, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("Este certificado é concedido a", pageWidth / 2, 80, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(nome, pageWidth / 2, 100, { align: "center" });

    if (isEmergency) {
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      doc.text("Pela sua participação na atividade", pageWidth / 2, 125, { align: "center" });
      
      doc.setFontSize(25);
      doc.setFont("helvetica", "italic");
      doc.text(title || "(Sem título)", pageWidth / 2, 140, { align: "center" });
    } else {
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      doc.text("Pela sua participação na organização da Semana de Ciência e Inovação na capacidade de", pageWidth / 2, 120, { align: "center" });
      
      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.text(role, pageWidth / 2, 140, { align: "center" });
      
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      doc.text("nos dias", pageWidth / 2, 160, { align: "center" });
      
      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.text(days + " de Abril", pageWidth / 2, 175, { align: "center" });
    }

  
    const signatureY = isEmergency ? 180 : 190;
    
    doc.addImage(assinatura, "PNG", (pageWidth / 2) - 25, signatureY - 20, 50, 25);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line((pageWidth / 2) - 40, signatureY + 5, (pageWidth / 2) + 40, signatureY + 5);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("José Manuel González-Méijome", pageWidth / 2, signatureY + 12, { align: "center" });
    
    doc.setFontSize(15);
    doc.setFont("courier", "normal");
    doc.text("Presidente da Escola de Ciências", pageWidth / 2, signatureY + 19, { align: "center" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=certificate.pdf",
      },
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate PDF", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}