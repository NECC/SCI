// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';


// export async function POST(req, res) {
//   try {

//     // const { pdf, id } = await req.json();    

//     // const data = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

//     // const res = await data.emails.send({
//     //     from: "Acme <onboarding@resend.dev>",
//     //     to: ["pedroaugennes@gmail.com"],
//     //     subject: "Certificate",
//     //     message: "Congratulations",
//     //     text: "Congratulations",
//     //     attachments: [
//     //         {
//     //             filename: "certificate.pdf",
//     //             content: pdf.split("base64,")[1],
//     //             type: "application/pdf"
//     //         }
//     //     ]
//     // });



//     return new NextResponse(
//         JSON.stringify({ response: 'success', res })
//     );
//   } catch (error) {
//     return new NextResponse(
//         JSON.stringify({ response: 'error', error })
//     );
//   }
// }