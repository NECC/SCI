import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { to, subject, html, from } = await req.json();

    if (!to || !subject) {
      return new NextResponse(
        JSON.stringify({ response: 'error', error: 'Missing required fields: to, subject' })
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

    const data = await resend.emails.send({
      from: from || 'noreply@seudominio.com',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html || '',
    });

    return new NextResponse(
      JSON.stringify({ response: 'success', data })
    );
  } catch (error: any) {
    console.error('Email send error:', error);
    return new NextResponse(
      JSON.stringify({ response: 'error', error: error.message || 'Failed to send email' })
    );
  }
}
