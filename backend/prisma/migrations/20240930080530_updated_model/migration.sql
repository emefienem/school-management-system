/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LeaderBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `points` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LeaderBoard" DROP CONSTRAINT "LeaderBoard_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_studentId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
DROP COLUMN "categoryId",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "options",
DROP COLUMN "studentId",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "LeaderBoard";

-- DropTable
DROP TABLE "Score";

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "option" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "MinPoints" INTEGER NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "time" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
