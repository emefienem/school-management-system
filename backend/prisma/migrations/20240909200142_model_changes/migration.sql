/*
  Warnings:

  - You are about to drop the column `userId` on the `Complain` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Complain" DROP CONSTRAINT "Complain_userId_fkey";

-- AlterTable
ALTER TABLE "Complain" DROP COLUMN "userId",
ADD COLUMN     "studentId" INTEGER,
ADD COLUMN     "teacherId" INTEGER;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
