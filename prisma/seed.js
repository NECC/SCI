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
      },
      {
        email: 'pedroaugennes@gmail.com',
        name: 'Maromba',
        password: passwordPedro,
        role: 'ADMIN',
      },
    ],
  });
  await prisma.activity.createMany({
    data: [
      { "title": "Palestra de React", "description": "Palestra sobre React", "speakers": "Pedro Camargo", "location": "Sala 1", "capacity": 50, "date": "2024-01-20T00:00:00.000Z", "startTime": "9:30", "endTime": "10:00", "type": "WORKSHOP" },
      { "title": "Stream the Apple 🍎", "description": "Room-filling sound, Intelligent assistant. Smart home control. Works seamlessly with iPhone. Check it out", "date": "2024-01-23T00:00:00.000Z", "startTime": "9:30", "endTime": "10:00", "location": "", "capacity": 0, "speakers": "Pedro Augennes", "type": "WORKSHOP" },
      { "title": "Teste1", "description": "teste", "date": "2024-01-25T00:00:00.000Z", "startTime": "05:12", "endTime": "06:12", "location": "teste", "capacity": 1, "speakers": "teste", "type": "WORKSHOP" },
      { "title": "Teste2", "description": "Teste2", "date": "2024-01-25T00:00:00.000Z", "startTime": "11:12", "endTime": "12:30", "location": "Edificio 1 - 0.24", "capacity": 10, "speakers": "Paulo", "type": "WORKSHOP" },
      { "title": "☕ Coffee Break", "description": "", "date": "2024-01-23T00:00:00.000Z", "startTime": "11:00", "endTime": "12:00", "location": "", "capacity": 0, "speakers": "", "type": "WORKSHOP" }
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