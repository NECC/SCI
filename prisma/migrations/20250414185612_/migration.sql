/*
  Warnings:

  - A unique constraint covering the columns `[academicNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Course" AS ENUM ('BIOLOGIA_APLICADA', 'BIOLOGIA_E_GEOLOGIA', 'BIOQUIMICA', 'CIENCIA_DE_DADOS', 'CIENCIAS_DA_COMPUTACAO', 'CIENCIAS_DO_AMBIENTE', 'ESTATISTICA_APLICADA', 'FISICA', 'GEOLOGIA', 'MATEMATICA', 'OPTOMETRIA_E_CIENCIAS_DA_VISAO', 'QUIMICA');

-- AlterEnum
ALTER TYPE "Type" ADD VALUE 'TERTULIA';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicNumber" INTEGER,
ADD COLUMN     "courseYear" INTEGER,
ADD COLUMN     "graduation" "Course",
ADD COLUMN     "rewarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DailyRanking" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "DailyRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_academicNumber_key" ON "User"("academicNumber");

-- AddForeignKey
ALTER TABLE "DailyRanking" ADD CONSTRAINT "DailyRanking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
