/*
  Warnings:

  - Added the required column `updatedAt` to the `CorrectAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CorrectAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CorrectAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CorrectAnswer" ("answerText", "id", "questionId") SELECT "answerText", "id", "questionId" FROM "CorrectAnswer";
DROP TABLE "CorrectAnswer";
ALTER TABLE "new_CorrectAnswer" RENAME TO "CorrectAnswer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
