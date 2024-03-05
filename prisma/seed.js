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

  const coffeeBreak = ({date, startTime, endTime}) => {
      return { "title": "🧁 Coffee Break", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": date, "startTime": startTime, "endTime": endTime, "type": "OTHER" }
  }

  await prisma.activity.createMany({
    data: [
      { "title": "🚩 Sessão de Abertura", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day18, "startTime": "9:00", "endTime": "9:30", "type": "OTHER" },
      { "title": "Geologia e Sociedade", "description": "", "date": day18, "startTime": "9:30", "endTime": "10:00", "location": "", "capacity": 100, "speakers": "Renato Henriques", "type": "TALK" },
      coffeeBreak({date: day18, startTime: "10:30", endTime: "11:00"}),
      { "title": "Valorização de resíduos agrícolas no contexto da economia circular: o caso da lenhina", "description": "", "date": day18, "startTime": "11:00", "endTime": "12:00", "location": "", "capacity": 100, "speakers": "Carolina Cassoni", "type": "TALK" },
      { "title": "Python Básico", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Bruno Jardim (NECC)", "type": "WORKSHOP" },
      { "title": "Development of new materials for environmental remediation applications", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Pedro Martins", "type": "WORKSHOP" },
      { "title": "Ciência cidadã", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Pedro Gomes", "type": "WORKSHOP" },
      { "title": "Computer Aided Drug Discovery", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Filipe Rocha", "type": "WORKSHOP" },
      coffeeBreak({date: day18, startTime: "15:30", endTime: "16:00"}),
      { "title": "Grupos de Investigação Materiais, Polimeros, Fibras ....", "description": "", "date": day18, "startTime": "16:00", "endTime": "17:00", "location": "", "capacity": 100, "speakers": "unknown", "type": "TALK" },
      { "title": "Tertúlia - Exploração de Recursos em Portugal", "description": "", "date": day18, "startTime": "17:00", "endTime": "18:30", "location": "", "capacity": 100, "speakers": "Júlio Santos", "type": "TALK" },
      { "title": "🤔 Quizz - DR. WHY", "description": "", "date": day18, "startTime": "18:30", "endTime": "20:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },

      { "title": "Economia circular", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },
      { "title": "Comunicar Ciência sem Preconceitos", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "Joana Rodrigues", "type": "WORKSHOP" },
      { "title": "Remediação Ambiental", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },
      { "title": "Let's make a Website!", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "David Machado (NECC)", "type": "WORKSHOP" },
      coffeeBreak({date: day19, startTime: "11:00", endTime: "11:30"}),
      { "title": "Sustainble Chemistry", "description": "New Methodes and Materials Transparent and condutive silk films for application in thermotropic and eletrochemical devices", "date": day19, "startTime": "11:30", "endTime": "12:00", "location": "", "capacity": 100, "speakers": "João Silva", "type": "TALK" },
      { "title": "Trabalhos Mestrados", "description": "Genética, Bio. Molecular, Bioinformática ...", "date": day19, "startTime": "12:00", "endTime": "12:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "TALK" },
      { "title": "Aditivos alimentares: Como identificá-los?", "description": "", "date": day19, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 50, "speakers": "Susana Costa (NEBQUM)", "type": "WORKSHOP" },
      { "title": "The One Health Concept", "description": "", "date": day19, "startTime": "14:00", "endTime": "15:00", "location": "", "capacity": 100, "speakers": "Paula Sampaio", "type": "TALK" },
      coffeeBreak({date: day19, startTime: "15:00", endTime: "15:30"}),
      { "title": "Alguns desafios da Química: Dos fármacos aos nanomateriais", "description": "", "date": day19, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Fernanda Proença", "type": "TALK" },
      { "title": "Problemas com a comunicação científica", "description": "", "date": day19, "startTime": "16:30", "endTime": "18:00", "location": "", "capacity": 100, "speakers": "Vítor Ribeiro, Catarina Loureiro, Jorge Dinis Oliveira", "type": "TALK" },

      { "title": "DST", "description": "", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },
      { "title": "Jordão Cooling Systems", "description": "", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "unknown", "type": "WORKSHOP" },
      coffeeBreak({date: day20, startTime: "11:00", endTime: "11:30"}),
      { "title": "Unlocking Key Experiences with AI", "description": "Exploring the Intersection of Physics, Emotions, and Sports", "date": day20, "startTime": "11:30", "endTime": "12:30", "location": "", "capacity": 100, "speakers": "Prof. Bruno Fernandes", "type": "TALK" },
      { "title": "Ótica aplicada à Computação Quântica", "description": "", "date": day20, "startTime": "14:00", "endTime": "15:00", "location": "", "capacity": 100, "speakers": "Ernesto Galvão (INL)", "type": "TALK" },
      coffeeBreak({date: day20, startTime: "15:00", endTime: "15:30"}),
      { "title": "Quantum error correction / mitigation", "description": "", "date": day20, "startTime": "15:30", "endTime": "16:00", "location": "", "capacity": 100, "speakers": "Ana Neri (INESC TEC)", "type": "TALK" },
      { "title": "Quantum walks on directed and oriented graphs", "description": "", "date": day20, "startTime": "16:00", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Jaime (INESC TEC)", "type": "TALK" },
      { "title": "Impacto da Computação Quântica", "description": "", "date": day20, "startTime": "16:30", "endTime": "18:00", "location": "", "capacity": 100, "speakers": "Luís Barbosa, Ernesto Galvão (INL), Luís Santos", "type": "TALK" },
      { "title": "🍻 RALLY", "description": "", "date": day20, "startTime": "21:00", "endTime": "22:00", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },

      { "title": "LinkedIn e CV", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "Vinicius Silva (NEBAUM)", "type": "WORKSHOP" },
      { "title": "Astrobiologia", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "", "type": "WORKSHOP" },
      { "title": "Geofísica", "description": "", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "", "capacity": 50, "speakers": "Luís Gonçalves (NEGUM)", "type": "WORKSHOP" },
      { "title": "Uma palestra sobre Ciência, Matemática e Frustração", "description": "", "date": day21, "startTime": "14:00", "endTime": "15:00", "location": "", "capacity": 100, "speakers": "Inês Guimarães", "type": "TALK" },
      coffeeBreak({date: day21, startTime: "15:00", endTime: "15:30"}),
      { "title": "Sessão ALUMNI", "description": "", "date": day21, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "", "type": "TALK" },
      { "title": "Sessão com a Journal UMinho Science", "description": "", "date": day21, "startTime": "16:30", "endTime": "17:30", "location": "", "capacity": 100, "speakers": "", "type": "TALK" },
      { "title": "🏁 Sessão de Encerramento", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day21, "startTime": "17:30", "endTime": "18:00", "type": "OTHER" },
      { "title": "🍕 Pizza Night", "description": "", "date": day21, "startTime": "18:00", "endTime": "20:30", "location": "", "capacity": 100, "speakers": "unknown", "type": "OTHER" },
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