/*
  Warnings:

  - You are about to drop the `DailyRanking` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `points` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyRanking" DROP CONSTRAINT "DailyRanking_userId_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "points" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "speakers" DROP NOT NULL,
ALTER COLUMN "picUrl" DROP NOT NULL;

-- DropTable
DROP TABLE "DailyRanking";
