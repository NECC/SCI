import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  await prisma.user.deleteMany()

  return new Response("Deleted");
}
