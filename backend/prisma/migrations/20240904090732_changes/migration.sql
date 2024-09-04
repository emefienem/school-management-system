-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_teachSclassId_fkey";

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "teachSclassId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_teachSclassId_fkey" FOREIGN KEY ("teachSclassId") REFERENCES "Sclass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
