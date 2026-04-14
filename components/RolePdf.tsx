/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { View, Image, Text, Page, Document } from '@react-pdf/renderer';

interface RolePdfProps {
    data: {
        name?: string;
        role?: string;
        days?: string | string[];
    };
    // Add image paths to your props
    paths: {
        bgPdf: string;
        ciencias: string;
        sciLogo: string;
        assinatura: string;
    }
}

const RolePdf: React.FC<RolePdfProps> = ({ data, paths }) => {
    // ... existing variable declarations ...

    return (
        <Document>
            <Page size="SRA4" orientation="landscape" style={{ paddingTop: 40, paddingLeft: 40, paddingRight: 40 }}>
                {/* Use the paths passed from the API route */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <Image src={paths.bgPdf} style={{ width: '100%', height: '100%' }} />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Image src={paths.ciencias} style={{ width: '95px', height: '50px' }} />
                    <Image src={paths.sciLogo} style={{ width: '110px', height: '50px' }} />
                </View>
                
                {/* ... existing text elements ... */}

                <View style={{ marginTop: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Image src={paths.assinatura} style={{ width: '140px', height: '70px' }} />
                    {/* ... signature text ... */}
                </View>
            </Page>
        </Document>
    );
}

export default RolePdf;