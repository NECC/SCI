/*
  Warnings:

  - You are about to drop the column `userId` on the `Workshop` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workshop" DROP CONSTRAINT "Workshop_userId_fkey";

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Enrollments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workshopId" INTEGER NOT NULL,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_userId_workshopId_key" ON "Enrollments"("userId", "workshopId");

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
