/*
  Warnings:

  - You are about to drop the column `faculty` on the `faculty` table. All the data in the column will be lost.
  - Added the required column `faculty_abbr` to the `faculty` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_faculty" (
    "fac_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faculty_abbr" TEXT NOT NULL,
    "faculty_name" TEXT
);
INSERT INTO "new_faculty" ("fac_id", "faculty_name") SELECT "fac_id", "faculty_name" FROM "faculty";
DROP TABLE "faculty";
ALTER TABLE "new_faculty" RENAME TO "faculty";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
