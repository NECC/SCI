/*
  Warnings:

  - You are about to drop the column `workshopId` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to drop the `Workshop` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,activityId]` on the table `Enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_workshopId_fkey";

-- DropIndex
DROP INDEX "Enrollments_userId_workshopId_key";

-- AlterTable
ALTER TABLE "Enrollments" DROP COLUMN "workshopId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Workshop";

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "speakers" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_userId_activityId_key" ON "Enrollments"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
