'use server'
import { PrismaClient } from "@prisma/client";

export async function getActivity(id) {
  const prisma = new PrismaClient();
  // find activity by id and return
  return await prisma.activity.findUnique({
    where: {
      id: id,
    },
  });
}