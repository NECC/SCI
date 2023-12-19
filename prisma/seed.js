const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    await prisma.user.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.enrollments.deleteMany();

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