/*
  Warnings:

  - Added the required column `picUrl` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "picUrl" TEXT NOT NULL;
