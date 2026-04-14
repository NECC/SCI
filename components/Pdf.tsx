/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { View, Image, Text, Page, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: '#000',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        marginTop: 40,
        fontSize: 35,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
    },
    subtitle: {
        marginTop: 15,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    userName: {
        marginTop: 35,
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
    },
    activityText: {
        marginTop: 35,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    activityTitle: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
        fontFamily: 'Helvetica-Oblique',
    },
    signatureSection: {
        marginTop: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    signatureLine: {
        width: '40%',
        height: 1,
        backgroundColor: 'white',
        marginTop: -25,
    }
});

const Pdf = (props: {
    data: { name?: string; title?: string };
    user: { name?: string; title?: string };
}) => {
    const { data, user } = props;
    const nome = user?.name || "Participante";
    const title = data?.title || "Atividade";

    // Helper to ensure absolute paths for the PDF engine
    const getAssetUrl = (path: string) => {
        if (typeof window === 'undefined') return path;
        return `${window.location.origin}${path}`;
    };

    return (
        <Document>
            <Page size="SRA4" orientation="landscape" style={styles.page}>
                {/* Background */}
                <View style={styles.background}>
                    <Image src={getAssetUrl("/bg-pdf.png")} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Image src={getAssetUrl("/ciencias.png")} style={{ width: 95, height: 50 }} />
                    <Image src={getAssetUrl("/sci-logo2025.png")} style={{ width: 110, height: 50 }} />
                </View>

                {/* Content */}
                <Text style={styles.title}>Certificado de Participação</Text>
                
                <Text style={styles.subtitle}>Este certificado é concebido a</Text>
                
                <Text style={styles.userName}>{nome}</Text>
                
                <Text style={styles.activityText}>Pela sua participação na atividade</Text>
                
                <Text style={styles.activityTitle}>{title}</Text>

                {/* Signature */}
                <View style={styles.signatureSection}>
                    <Image src={getAssetUrl("/assinatura.png")} style={{ width: 140, height: 70 }} />
                    <View style={styles.signatureLine} />
                    <Text style={{ marginTop: 15, fontSize: 14 }}>José Manuel González-Méijome</Text>
                    <Text style={{ marginTop: 2, fontFamily: 'Helvetica', fontSize: 12 }}>
                        Presidente da Escola de Ciências
                    </Text>
                </View>
            </Page>
        </Document>
    );
}

export default Pdf;