/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `CorrectAnswer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CorrectAnswer_questionId_key" ON "CorrectAnswer"("questionId");
