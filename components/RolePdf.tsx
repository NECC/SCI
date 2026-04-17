/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { View, Image, Text, Page, Document } from '@react-pdf/renderer';

// 1. REMOVE these imports completely. 
// The PDF renderer needs absolute URLs, not Next.js relative static paths.
// import bgPdf from '@/public/bg-pdf.png';
// import ciencias from '@/public/ciencias.png';
// import sciLogo from '@/public/sci-logo2025.png';
// import assinatura from '@/public/assinatura.png';

interface RolePdfProps {
    data: {
        name?: string;
        role?: string;
        days?: string | string[];
    };
}

const RolePdf: React.FC<RolePdfProps> = ({ data }) => {
    const nome = data?.name || "";
    const role = data?.role || "";
    const daysRaw = data?.days;
    const days = Array.isArray(daysRaw) ? daysRaw.join(", ") : (daysRaw || "");
    
    // 2. Get the base URL (e.g., http://localhost:3000 or https://yourdomain.com)
    // We check for window to ensure it doesn't crash during server-side pre-rendering
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <Document>
            <Page size="SRA4" orientation="landscape" style={{
                paddingTop: 40,
                paddingLeft: 40,
                paddingRight: 40,
            }}>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}>
                    {/* 3. Append the origin to the public file path */}
                    <Image src={`${origin}/bg-pdf.png`} style={{ width: '100%', height: '100%' }} />
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Image src={`${origin}/ciencias.png`} style={{ width: '95px', height: '50px' }} />
                    <Image src={`${origin}/sci-logo2025.png`} style={{ width: '110px', height: '50px' }} />
                </View>

                <Text style={{
                    marginTop: 30,
                    fontSize: 35,
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica-Bold',
                }}>Certificado de Participação</Text>
                
                <Text style={{
                    marginTop: 15,
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica',
                }}>Este certificado é concedido a</Text>
                
                <Text style={{
                    marginTop: 25,
                    fontSize: 30,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica-Bold',
                }}>{nome}</Text>
                
                <Text style={{
                    marginTop: 25,
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica',
                }}>Pela sua participação na organização da Semana de Ciência e Inovação na capacidade de</Text>
                
                <Text style={{
                    marginTop: 25,
                    fontSize: 30,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica-Bold',
                }}>{role}</Text>
                
                <Text style={{
                    marginTop: 25,
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica',
                }}>nos dias</Text>
                
                <Text style={{
                    marginTop: 25,
                    fontSize: 30,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica-Bold',
                }}>{days} de Abril</Text>

                <View style={{
                    marginTop: 35,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    color: 'white',
                }}>
                    <Image src={`${origin}/assinatura.png`} style={{ width: '140px', height: '70px' }} />
                    <View style={{
                        width: '60%',
                        height: '1px',
                        backgroundColor: 'white',
                        marginTop: -25,
                    }} />
                    <Text style={{ marginTop: 15, color: 'white' }}>José Manuel González-Méijome</Text>
                    <Text style={{ marginTop: -5, fontFamily: 'Courier', fontSize: 15, color: 'white' }}>Presidente da Escola de Ciências</Text>
                </View>

            </Page>
        </Document>
    );
}

export default RolePdf;