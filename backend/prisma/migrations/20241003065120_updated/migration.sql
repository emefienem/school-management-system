/*
  Warnings:

  - You are about to drop the `_AssignmentToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssignmentToStudent" DROP CONSTRAINT "_AssignmentToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToStudent" DROP CONSTRAINT "_AssignmentToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "studentId" INTEGER;

-- DropTable
DROP TABLE "_AssignmentToStudent";

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
