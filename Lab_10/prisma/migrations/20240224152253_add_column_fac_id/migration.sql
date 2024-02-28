/*
  Warnings:

  - The primary key for the `faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `faculty` on the `pulpit` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `fac_id` to the `faculty` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_faculty" (
    "fac_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faculty" TEXT NOT NULL,
    "faculty_name" TEXT
);
INSERT INTO "new_faculty" ("faculty", "faculty_name") SELECT "faculty", "faculty_name" FROM "faculty";
DROP TABLE "faculty";
ALTER TABLE "new_faculty" RENAME TO "faculty";
CREATE TABLE "new_pulpit" (
    "pulpit" TEXT NOT NULL PRIMARY KEY,
    "pulpit_name" TEXT,
    "faculty" INTEGER NOT NULL,
    CONSTRAINT "pulpit_faculty_fkey" FOREIGN KEY ("faculty") REFERENCES "faculty" ("fac_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pulpit" ("faculty", "pulpit", "pulpit_name") SELECT "faculty", "pulpit", "pulpit_name" FROM "pulpit";
DROP TABLE "pulpit";
ALTER TABLE "new_pulpit" RENAME TO "pulpit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
