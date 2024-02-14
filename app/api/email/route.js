import { NextResponse } from 'next/server';
import { Resend } from 'resend';


export async function POST() {
  try {
    const data = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const res = await data.emails.send({
        to: "pedroaugennes@gmail.com",
        subject: "Certificate",
        message: "Congratulations",
        // attachments: [
        //     {
        //         filename: "certificate.pdf",
        //         content: doc,
        //         type: "application/pdf"
        //     }
        // ]
    });



    return new NextResponse(
        JSON.stringify({ response: 'success', res })
    );
  } catch (error) {
    return new NextResponse(
        JSON.stringify({ response: 'error', error })
    );
  }
}