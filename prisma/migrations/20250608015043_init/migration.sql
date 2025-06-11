CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_role_check" CHECK ("role" IN ('STUDENT', 'TEACHER', 'ADMIN'))
);

-- CreateTable
CREATE TABLE "Module" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileType" VARCHAR(255),
    "views" INT NOT NULL DEFAULT 0,
    "downloads" INT NOT NULL DEFAULT 0,
    "submissionDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moduleId" VARCHAR(255) NOT NULL,
    "authorId" VARCHAR(255) NOT NULL,
    "supervisorId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");
CREATE INDEX "Submission_moduleId_idx" ON "Submission"("moduleId");
CREATE INDEX "Submission_authorId_idx" ON "Submission"("authorId");
CREATE INDEX "Submission_supervisorId_idx" ON "Submission"("supervisorId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE NO ACTION;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE NO ACTION;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE NO ACTION;
