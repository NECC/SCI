-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
