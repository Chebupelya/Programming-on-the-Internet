-- CreateTable
CREATE TABLE "faculty" (
    "faculty" TEXT NOT NULL PRIMARY KEY,
    "faculty_name" TEXT
);

-- CreateTable
CREATE TABLE "pulpit" (
    "pulpit" TEXT NOT NULL PRIMARY KEY,
    "pulpit_name" TEXT,
    "faculty" TEXT NOT NULL,
    CONSTRAINT "pulpit_faculty_fkey" FOREIGN KEY ("faculty") REFERENCES "faculty" ("faculty") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subject" (
    "subject" TEXT NOT NULL PRIMARY KEY,
    "subject_name" TEXT NOT NULL,
    "pulpit" TEXT NOT NULL,
    CONSTRAINT "subject_pulpit_fkey" FOREIGN KEY ("pulpit") REFERENCES "pulpit" ("pulpit") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacher" TEXT NOT NULL PRIMARY KEY,
    "teacher_name" TEXT,
    "pulpit" TEXT NOT NULL,
    CONSTRAINT "teacher_pulpit_fkey" FOREIGN KEY ("pulpit") REFERENCES "pulpit" ("pulpit") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "auditorium_type" (
    "auditorium_type" TEXT NOT NULL PRIMARY KEY,
    "auditorium_typename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "auditorium" (
    "auditorium" TEXT NOT NULL PRIMARY KEY,
    "auditorium_name" TEXT,
    "auditorium_capacity" INTEGER,
    "auditorium_type" TEXT NOT NULL,
    CONSTRAINT "auditorium_auditorium_type_fkey" FOREIGN KEY ("auditorium_type") REFERENCES "auditorium_type" ("auditorium_type") ON DELETE RESTRICT ON UPDATE CASCADE
);
