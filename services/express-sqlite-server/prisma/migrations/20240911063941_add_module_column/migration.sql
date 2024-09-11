PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Add the new column with a default value
ALTER TABLE "Task" ADD COLUMN "moduleId" TEXT DEFAULT 'default_module_id';

-- Now create a new table with the non-nullable column
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskName" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "dueDate" DATETIME,
    "moduleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from the old table to the new table
INSERT INTO "new_Task" ("createdAt", "dueDate", "id", "taskName", "taskType", "updatedAt", "moduleId")
SELECT "createdAt", "dueDate", "id", "taskName", "taskType", "updatedAt", "moduleId"
FROM "Task";

-- Drop the old table
DROP TABLE "Task";

-- Rename the new table
ALTER TABLE "new_Task" RENAME TO "Task";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
