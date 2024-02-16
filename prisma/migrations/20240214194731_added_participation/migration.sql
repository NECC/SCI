/*
  Warnings:

  - Added the required column `attended` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollments" ADD COLUMN     "attended" BOOLEAN NOT NULL;
