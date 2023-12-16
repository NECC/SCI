/*
  Warnings:

  - Added the required column `endTime` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
