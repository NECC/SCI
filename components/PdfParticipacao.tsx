import React from 'react';
import { Document, Page, View, Image, Text } from '@react-pdf/renderer';

const Pdf = (props) => {
    const { user } = props;
    const nome = user?.name;
    const Nome = nome?.charAt(0).toUpperCase() + nome?.slice(1);
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
                    <Image src="./bg-pdf.png" alt="abj" style={{ width: '100%', height: '100%' }} />
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Image src="./ciencias.png" alt="SCI Logo" style={{ width: '95px', height: '50px' }} />
                    <Image src="./sci-logo.png" alt="SCI Logo" style={{ width: '110px', height: '50px' }} />
                </View>

                <Text style={{
                    marginTop: 40,
                    fontSize: 35,
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica-Bold',
                }}>Certificado de Participação</ Text>
                <Text style={{
                    marginTop: 15,
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica',
                }}>Este certificado é concebido a </ Text>
                <Text style={{
                    marginTop: 35,
                    fontSize: 30,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica-Bold',
                }}> {Nome}</ Text>
                <Text style={{
                    marginTop: 35,
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica',
                }}>Pela sua participação na</ Text>
                <Text style={{
                    marginTop: 15,
                    fontSize: 25,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Helvetica-Bold',
                }}>Semana da Ciência e Inovação 2024</ Text>

                <View style={{
                    marginTop: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    color: 'white',
                }}>
                    <Image src="./assinatura.png" alt="SCI Logo" style={{ width: '140px', height: '70px' }} />
                    <View style={{
                        width: '60%',
                        height: '1px',
                        backgroundColor: 'white',
                        marginTop: -25,
                    }}> </View>
                    <Text style={{ marginTop: 15 }}>José Manuel González-Méijome</ Text>
                    <Text style={{ marginTop: -5, fontFamily: 'Courier', fontSize: 15, }}>Presidente da Escola de Ciências</ Text>
                </View>
            </Page>
        </Document>
    );
}

export default Pdf;
