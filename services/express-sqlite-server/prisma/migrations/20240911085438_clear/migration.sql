/*
  Warnings:

  - The primary key for the `StudentQuizResult` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answerText" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "quizResultId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "StudentQuizResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("answerText", "createdAt", "id", "questionId", "quizResultId", "updatedAt") SELECT "answerText", "createdAt", "id", "questionId", "quizResultId", "updatedAt" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_StudentQuizResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentQuizResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentQuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentQuizResult" ("createdAt", "id", "quizId", "score", "studentId", "updatedAt") SELECT "createdAt", "id", "quizId", "score", "studentId", "updatedAt" FROM "StudentQuizResult";
DROP TABLE "StudentQuizResult";
ALTER TABLE "new_StudentQuizResult" RENAME TO "StudentQuizResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
