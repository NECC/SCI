export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { certificateType, formData } = body;

    // Extract data from form
    const nome = formData?.name || "";
    const title = formData?.title || "";
    const role = formData?.role || "";
    const daysRaw = formData?.days;
    const days = Array.isArray(daysRaw) ? daysRaw.join(", ") : daysRaw || "";
    const isEmergency = certificateType === "Emergency";

    // Create PDF in landscape SRA4 format
    // SRA4 is 229mm x 324mm, in landscape: 324mm x 229mm
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [324, 229], // SRA4 dimensions
    });

    // Get page dimensions
    const pageWidth = 324;
    const pageHeight = 229;

    // Set text color to white
    doc.setTextColor(255, 255, 255);

    // Add title
    doc.setFontSize(35);
    doc.setFont("helvetica", "bold");
    doc.text("Certificado de Participação", pageWidth / 2, 60, { align: "center" });

    // Add subtitle
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("Este certificado é concebido a", pageWidth / 2, 80, { align: "center" });

    // Add name
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(nome, pageWidth / 2, 100, { align: "center" });

    // Add activity/role specific text
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

    // Add signature section
    const signatureY = isEmergency ? 195 : 205;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("José Manuel González-Méijome", pageWidth / 2, signatureY + 10, { align: "center" });
    
    doc.setFontSize(15);
    doc.setFont("courier", "normal");
    doc.text("Presidente da Escola de Ciências", pageWidth / 2, signatureY + 18, { align: "center" });

    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return the PDF response
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
