-- CreateTable
CREATE TABLE "ReadBy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notificationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadBy_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReadBy_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ReadByStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ReadByStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "ReadBy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReadByStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReadByStudent_AB_unique" ON "_ReadByStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadByStudent_B_index" ON "_ReadByStudent"("B");
