-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_teacherId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
