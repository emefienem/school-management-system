/*
  Warnings:

  - Changed the type of `time` on the `Quiz` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "studentId" INTEGER,
DROP COLUMN "time",
ADD COLUMN     "time" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
