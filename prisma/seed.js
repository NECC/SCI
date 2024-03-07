const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  await prisma.enrollments.deleteMany();
  await prisma.user.deleteMany();
  await prisma.activity.deleteMany();

  const passwordCarlos = await bcrypt.hash('batatadoce', 10);
  const passwordPedro = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'carlosdf035@gmail.com',
        name: 'carlos',
        password:  passwordCarlos,
        role: 'ADMIN',
        accredited: true,
      },
      {
        email: 'pedroaugennes@gmail.com',
        name: 'Maromba',
        password: passwordPedro,
        role: 'ADMIN',
        accredited: true,
      },
    ],
  });

  const day18 = "2024-03-18T00:00:00.000Z";
  const day19 = "2024-03-19T00:00:00.000Z";
  const day20 = "2024-03-20T00:00:00.000Z";
  const day21 = "2024-03-21T00:00:00.000Z";
  const defaultUrl = "user.svg"

  const coffeeBreak = ({date, startTime, endTime}) => {
      return { "picUrl": "", "title": "🧁 Coffee Break", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": date, "startTime": startTime, "endTime": endTime, "type": "OTHER" }
  }

  await prisma.activity.createMany({
    data: [
      { "picUrl": "", "title": "🚩 Sessão de Abertura", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day18, "startTime": "9:00", "endTime": "9:30", "type": "OTHER" },
      

      { "picUrl": defaultUrl, "title": "Geologia e Sociedade", "description": "", "date": day18, "startTime": "9:30", "endTime": "10:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Renato Henriques", "type": "TALK" },


      coffeeBreak({date: day18, startTime: "10:30", endTime: "11:00"}),

      { "picUrl": "/dia18/Cassoni.jpeg", "title": "Valorização de resíduos agrícolas no contexto da economia circular: o caso da lenhina", "description": "", "date": day18, "startTime": "11:00", "endTime": "12:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Carolina Cassoni", "type": "TALK" },

      { "picUrl": "/dia18/Bruno_Jardim.jpeg", "title": "Python Básico", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Bruno Jardim (NECC)", "type": "WORKSHOP" },


      { "picUrl": "/dia18/Pedro_Martins.jpg", "title": "Development of new materials for environmental remediation applications", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Pedro Martins", "type": "WORKSHOP" },

      // TODO: Foto do Pedro Gomes 
      { "picUrl": defaultUrl, "title": "Ciência cidadã", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Pedro Gomes", "type": "WORKSHOP" },

      { "picUrl": "/dia18/Filipe_Rocha.jpg", "title": "Computer Aided Drug Discovery", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Filipe Rocha", "type": "WORKSHOP" },


      coffeeBreak({date: day18, startTime: "15:30", endTime: "16:00"}),


      { "picUrl": "/dia18/renatogonalves.jpg", "title": "Armazenamento de Energia e futuro da mobilidade elétrica - ESM", "description": "", "date": day18, "startTime": "16:00", "endTime": "16:30", "location": "Campus Gualtar, CP2 - Auditório B2", "capacity": 100, "speakers": "Renato Gonçalves", "type": "TALK" },
      { "picUrl": "/dia18/DANIELACORREIA.jpg", "title": "Materiais multifuncionais para sensores e atuadores - ESM", "description": "", "date": day18, "startTime": "16:30", "endTime": "17:00", "location": "Campus Gualtar, CP2 - Auditório B2", "capacity": 100, "speakers": "Daniela Correia", "type": "TALK" },

      
      // TODO: Foto do Júlio Santos ou Catia Santos
      { "picUrl": defaultUrl, "title": "Tertúlia - Exploração de Recursos em Portugal", "description": "", "date": day18, "startTime": "17:00", "endTime": "18:30", "location": "", "capacity": 100, "speakers": "Moderadora: Cátia Pinto | Convidados: Júlio Santos, Ana Hilário, Rui Moura", "type": "TALK" },

      { "picUrl": "", "title": "🤔 Quizz - DR. WHY", "description": "", "date": day18, "startTime": "18:30", "endTime": "20:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },


      // ------------------------------ Dia 19 ------------------------------


      { "picUrl": "/dia19/David_Machado.jpeg", "title": "Let's make a Website!", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "David Machado (NECC)", "type": "WORKSHOP" },
      { "picUrl": defaultUrl, "title": "Economia circular", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },
      { "picUrl": "/dia19/JoanaRodrigues.jpeg", "title": "Comunicar Ciência sem Preconceitos", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "Joana Rodrigues", "type": "WORKSHOP" },
      { "picUrl": defaultUrl, "title": "Remediação Ambiental", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },


      coffeeBreak({date: day19, startTime: "11:00", endTime: "11:30"}),


      { "picUrl": defaultUrl, "title": "Sustainble Chemistry", "description": "New Methodes and Materials Transparent and condutive silk films for application in thermotropic and eletrochemical devices", "date": day19, "startTime": "11:30", "endTime": "12:00", "location": "", "capacity": 100, "speakers": "João Silva", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "Trabalhos Mestrados", "description": "Genética, Biologia Molecular, Bioinformática", "date": day19, "startTime": "12:00", "endTime": "12:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "TALK" },


      { "picUrl": "/dia19/Susana_Costa.JPG", "title": "Aditivos alimentares: Como identificá-los?", "description": "", "date": day19, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Susana Costa", "type": "WORKSHOP" },
      { "picUrl": "/dia19/Paula_Sampaio.png", "title": "The One Health Concept", "description": "", "date": day19, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Paula Sampaio", "type": "TALK" },
      coffeeBreak({date: day19, startTime: "15:00", endTime: "15:30"}),
      { "picUrl": "/dia19/Fernanda_Proença.jpg", "title": "Alguns desafios da Química: Dos fármacos aos nanomateriais", "description": "", "date": day19, "startTime": "15:30", "endTime": "16:30", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Fernanda Proença", "type": "TALK" },
      { "picUrl": "/dia19/Catarina_Loureiro.jpeg", "title": "Problemas com a comunicação científica", "description": "", "date": day19, "startTime": "16:30", "endTime": "18:00", "location": "", "capacity": 100, "speakers": "Vítor Ribeiro, Catarina Loureiro, Jorge Dinis Oliveira", "type": "TALK" },


      // ------------------------------------ Dia 20 ------------------------------------

      // TODO: Jordão e DST group speakers and photos
      { "picUrl": "/dia20/dstGroup.png", "title": "DST", "description": "", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "DST", "type": "WORKSHOP" },
      { "picUrl": "/dia20/jordao.jpg", "title": "Jordão Cooling Systems", "description": "", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "Jordão", "type": "WORKSHOP" },

      coffeeBreak({date: day20, startTime: "11:00", endTime: "11:30"}),

      { "picUrl": "/dia20/Bruno_Fernandes.jpg", "title": "Unlocking Key Experiences with AI", "description": "Exploring the Intersection of Physics, Emotions, and Sports", "date": day20, "startTime": "11:30", "endTime": "12:30", "location": "Campus Gualtar, CP1 - Auditório A1", "capacity": 100, "speakers": "Prof. Bruno Fernandes", "type": "TALK" },

      { "picUrl": "/dia20/ernesto_galvao.jpg", "title": "Ótica aplicada à Computação Quântica", "description": "", "date": day20, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP1 - Auditório A1", "capacity": 100, "speakers": "Ernesto Galvão (INL)", "type": "TALK" },
      coffeeBreak({date: day20, startTime: "15:00", endTime: "15:30"}),

      { "picUrl": "/dia20/ana_neri.jpg", "title": "Quantum error correction / mitigation", "description": "", "date": day20, "startTime": "15:30", "endTime": "16:00", "location": "", "capacity": 100, "speakers": "Ana Neri (INESC TEC)", "type": "TALK" },
      { "picUrl": "/dia20/jaime_santos.png", "title": "Quantum walks on directed and oriented graphs", "description": "", "date": day20, "startTime": "16:00", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Jaime Santos (INESC TEC)", "type": "TALK" },

      { "picUrl": "/dia18/Bruno_Jardim.jpeg", "title": "Impacto da Computação Quântica", "description": "", "date": day20, "startTime": "16:30", "endTime": "18:00", "location": "", "capacity": 100, "speakers": "Luís Barbosa, Ernesto Galvão (INL), Luís Santos", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "🍻 RALLY", "description": "", "date": day20, "startTime": "21:00", "endTime": "22:00", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },


      // ------------------------------------------- Dia 21 -------------------------------------------
      { "picUrl": defaultUrl, "title": "LinkedIn e CV", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "Vinicius Silva (NEBAUM)", "type": "WORKSHOP" },
      { "picUrl": defaultUrl, "title": "Astrobiologia", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "", "type": "WORKSHOP" },
      { "picUrl": defaultUrl, "title": "Geofísica", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "Luís Gonçalves (NEGUM)", "type": "WORKSHOP" },
      { "picUrl": "/dia21/mathgurl.jpg", "title": "Uma palestra sobre Ciência, Matemática e Frustração", "description": "", "date": day21, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Inês Guimarães", "type": "TALK" },
      coffeeBreak({date: day21, startTime: "15:00", endTime: "15:30"}),
      { "picUrl": "/dia21/ivan.jpg", "title": "Sessão ALUMNI", "description": "", "date": day21, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Ivan", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "Sessão com a Journal UMinho Science", "description": "", "date": day21, "startTime": "16:30", "endTime": "17:30", "location": "", "capacity": 100, "speakers": "", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "🏁 Sessão de Encerramento", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day21, "startTime": "17:30", "endTime": "18:00", "type": "OTHER" },
      { "picUrl": defaultUrl, "title": "🍕 Pizza Night", "description": "", "date": day21, "startTime": "18:00", "endTime": "20:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });