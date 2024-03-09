import React from 'react';
import { Document, Page, StyleSheet, View, Image, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    logos: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        marginTop: 40,
        fontSize: 35,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    certificado: {
        marginTop: 15,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    name: {
        marginTop: 35,
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',

    },
    presença: {
        marginTop: 35,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    Semana: {
        marginTop: 15,
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
    },
    assinatura: {
        marginTop: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        color: 'white',
    },
    line: {
        width: '60%',
        height: '1px',
        backgroundColor: 'white',
        marginTop: -25,
    },
});

const Pdf = (props) => {
    const { user } = props;
    const nome = user?.name;
    const Nome = nome?.charAt(0).toUpperCase() + nome?.slice(1);
    return (

        <Document>
            <Page size="SRA4" orientation="landscape" style={styles.page}>
                <View style={styles.content}>
                    <Image src="./bg-pdf.png" alt="abj" style={{ width: '100%', height: '100%' }} />
                </View>

                <View style={styles.logos}>
                    <Image src="./ciencias.png" alt="SCI Logo" style={{ width: '95px', height: '50px' }} />
                    <Image src="./sci-logo.png" alt="SCI Logo" style={{ width: '110px', height: '50px' }} />
                </View>

                <Text style={styles.title}>Certificado de Participação</ Text>
                <Text style={styles.certificado}>Este certificado é concebido a </ Text>
                <Text style={styles.name}> {Nome}</ Text>
                <Text style={styles.presença}>Pela sua participação na</ Text>
                <Text style={styles.Semana}>Semana da Ciência e Inovação 2024</ Text>


                <View style={styles.assinatura}>
                    <Image src="./assinatura.png" alt="SCI Logo" style={{ width: '140px', height: '70px' }} />
                    <View style={styles.line}> </View>
                    <Text style={{ marginTop: 15 }}>José Manuel González-Méijome</ Text>
                    <Text style={{ marginTop: -5, fontFamily: 'Courier', fontSize: 15, }}>Presidente da Escola de Ciências</ Text>
                </View>

            </Page>
        </Document>
    );
}

export default Pdf;
