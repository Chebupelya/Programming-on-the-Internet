/*
  Warnings:

  - The primary key for the `pulpit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `auditorium_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `auditorium` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `auditorium_type` on the `auditorium` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `pulpit` on the `subject` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `pulpit` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `pulpit_id` to the `pulpit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditorium_type_id` to the `auditorium_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditorium_id` to the `auditorium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pulpit" (
    "pulpit_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pulpit" TEXT NOT NULL,
    "pulpit_name" TEXT,
    "faculty" INTEGER NOT NULL,
    CONSTRAINT "pulpit_faculty_fkey" FOREIGN KEY ("faculty") REFERENCES "faculty" ("fac_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pulpit" ("faculty", "pulpit", "pulpit_name") SELECT "faculty", "pulpit", "pulpit_name" FROM "pulpit";
DROP TABLE "pulpit";
ALTER TABLE "new_pulpit" RENAME TO "pulpit";
CREATE TABLE "new_auditorium_type" (
    "auditorium_type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auditorium_type" TEXT NOT NULL,
    "auditorium_typename" TEXT NOT NULL
);
INSERT INTO "new_auditorium_type" ("auditorium_type", "auditorium_typename") SELECT "auditorium_type", "auditorium_typename" FROM "auditorium_type";
DROP TABLE "auditorium_type";
ALTER TABLE "new_auditorium_type" RENAME TO "auditorium_type";
CREATE TABLE "new_auditorium" (
    "auditorium_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auditorium" TEXT NOT NULL,
    "auditorium_name" TEXT,
    "auditorium_capacity" INTEGER,
    "auditorium_type" INTEGER NOT NULL,
    CONSTRAINT "auditorium_auditorium_type_fkey" FOREIGN KEY ("auditorium_type") REFERENCES "auditorium_type" ("auditorium_type_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_auditorium" ("auditorium", "auditorium_capacity", "auditorium_name", "auditorium_type") SELECT "auditorium", "auditorium_capacity", "auditorium_name", "auditorium_type" FROM "auditorium";
DROP TABLE "auditorium";
ALTER TABLE "new_auditorium" RENAME TO "auditorium";
CREATE TABLE "new_subject" (
    "subject_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "pulpit" INTEGER NOT NULL,
    CONSTRAINT "subject_pulpit_fkey" FOREIGN KEY ("pulpit") REFERENCES "pulpit" ("pulpit_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subject" ("pulpit", "subject", "subject_name") SELECT "pulpit", "subject", "subject_name" FROM "subject";
DROP TABLE "subject";
ALTER TABLE "new_subject" RENAME TO "subject";
CREATE TABLE "new_teacher" (
    "teacher_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacher" TEXT NOT NULL,
    "teacher_name" TEXT,
    "pulpit" INTEGER NOT NULL,
    CONSTRAINT "teacher_pulpit_fkey" FOREIGN KEY ("pulpit") REFERENCES "pulpit" ("pulpit_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_teacher" ("pulpit", "teacher", "teacher_name") SELECT "pulpit", "teacher", "teacher_name" FROM "teacher";
DROP TABLE "teacher";
ALTER TABLE "new_teacher" RENAME TO "teacher";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
