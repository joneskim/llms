/*
  Warnings:

  - A unique constraint covering the columns `[studentId,quizId]` on the table `StudentQuizResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentQuizResult_studentId_quizId_key" ON "StudentQuizResult"("studentId", "quizId");
