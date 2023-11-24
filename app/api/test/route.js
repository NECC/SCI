import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.create({
    data: {
      name: "Pedro2",
      email: "testando@gmail.com",
      password: "123456",
      points: 0,
    },
  });
  console.log(user);

  return new Response("ok");
}
