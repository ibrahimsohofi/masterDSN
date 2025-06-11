/*
  Warnings:

  - The values [TEACHER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `fileUrl` on table `Submission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileType` on table `Submission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN;

-- Update User role
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_role_check";
-- ALTER TABLE "User" ALTER COLUMN "role" TYPE VARCHAR(50);
-- ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
ALTER TABLE "User" ADD CONSTRAINT "User_role_check" CHECK ("role" IN ('STUDENT', 'PROFESSOR', 'ADMIN'));

-- Update Submission table
-- ALTER TABLE "Submission" ADD COLUMN "order" INT NOT NULL DEFAULT 0;
-- ALTER TABLE "Submission" ADD COLUMN "status" VARCHAR(50) NOT NULL DEFAULT 'pending';
-- ALTER TABLE "Submission" ALTER COLUMN "description" TYPE TEXT;
-- ALTER TABLE "Submission" ALTER COLUMN "fileUrl" TYPE TEXT;
-- ALTER TABLE "Submission" ALTER COLUMN "fileType" TYPE VARCHAR(100);

-- Update User table
-- ALTER TABLE "User" ALTER COLUMN "name" TYPE VARCHAR(255);

-- Create ShareToken table
CREATE TABLE "ShareToken" (
    "id" VARCHAR(255) NOT NULL PRIMARY KEY,
    "token" VARCHAR(255) NOT NULL UNIQUE,
    "submissionId" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "ShareToken_submissionId_idx" ON "ShareToken"("submissionId");
CREATE INDEX "ShareToken_token_idx" ON "ShareToken"("token");
CREATE INDEX "Module_code_idx" ON "Module"("code");
CREATE INDEX "User_email_idx" ON "User"("email");

-- Add foreign key
ALTER TABLE "ShareToken" ADD CONSTRAINT "ShareToken_submissionId_fkey" 
    FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE;

COMMIT;
