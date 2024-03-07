import React from 'react';
import { Document, Page, StyleSheet, View, Image } from '@react-pdf/renderer';
import { Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        color: "white",
        padding: 40,
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
        marginTop: 50,
        fontSize: 35,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    certificado:{
        marginTop: 15,
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Courier',
    },
    name:{
        marginTop: 45,
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',

    },
    presença:{
        marginTop: 45,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    ola:{
        fontFamily: 'Helvetica-Oblique',
    }



});

const Pdf = (props) => {
    const { data, user } = props;

    return (

        <Document>
            <Page size="LETTER" orientation="landscape" style={styles.page}>
                <View style={styles.content}>
                    <Image src="./rectangle.png" alt="abj" style={{ width: '100%', height: '100%' }} />
                </View>

                {/* Content */}
                <View style={styles.logos}>
                    <Image src="./ciencias.png" alt="SCI Logo" style={{ width: '95px', height: '50px' }} />
                    <Image src="./sci-logo.png" alt="SCI Logo" style={{ width: '110px', height: '50px' }} />
                </View>
                <Text style={styles.title}>Certificado de Participação</ Text>
                <Text style={styles.certificado}>Este certificado é concebido a </ Text>
                <Text style={styles.name}> {data.speakers}</ Text>
                <Text style={styles.name}> {user.name}</ Text>

                <Text style={styles.presença}>Pela sua participação na atividade <Text style={styles.ola}>{data.title}</Text></ Text>
           </Page>
        </Document>
    );
}

export default Pdf;

