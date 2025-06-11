/*
  Warnings:

  - The values [PROFESSOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `downloads` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `ShareToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
        CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'PROFESSOR');
    ELSE
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PROFESSOR';
    END IF;
END $$;

-- DropForeignKey
ALTER TABLE IF EXISTS "ShareToken" DROP CONSTRAINT IF EXISTS "ShareToken_submissionId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Module_code_idx";
DROP INDEX IF EXISTS "User_email_idx";

-- AlterTable
ALTER TABLE IF EXISTS "Module" DROP COLUMN IF EXISTS "description";
ALTER TABLE IF EXISTS "Submission" DROP COLUMN IF EXISTS "downloads";
ALTER TABLE IF EXISTS "Submission" DROP COLUMN IF EXISTS "fileType";
ALTER TABLE IF EXISTS "Submission" DROP COLUMN IF EXISTS "order";
ALTER TABLE IF EXISTS "Submission" DROP COLUMN IF EXISTS "submissionDate";
ALTER TABLE IF EXISTS "Submission" DROP COLUMN IF EXISTS "views";

-- DropTable
DROP TABLE IF EXISTS "ShareToken";

-- CreateTable
CREATE TABLE "IPRights" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rightsType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "filingDate" TIMESTAMP NOT NULL,
    "expirationDate" TIMESTAMP,
    "jurisdiction" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "restrictions" TEXT[],
    "licensingTerms" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "IPRights_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IPUsageLog" (
    "id" TEXT NOT NULL,
    "ipRightsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "purpose" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    CONSTRAINT "IPUsageLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Watermark" (
    "id" TEXT NOT NULL,
    "ipRightsId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "opacity" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "Watermark_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IPLicense" (
    "id" TEXT NOT NULL,
    "ipRightsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP NOT NULL,
    "expirationDate" TIMESTAMP NOT NULL,
    "terms" TEXT NOT NULL,
    CONSTRAINT "IPLicense_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "IPRights_submissionId_idx" ON "IPRights"("submissionId");
CREATE INDEX IF NOT EXISTS "IPRights_userId_idx" ON "IPRights"("userId");
CREATE INDEX IF NOT EXISTS "IPUsageLog_ipRightsId_idx" ON "IPUsageLog"("ipRightsId");
CREATE INDEX IF NOT EXISTS "IPUsageLog_userId_idx" ON "IPUsageLog"("userId");
CREATE INDEX IF NOT EXISTS "Watermark_ipRightsId_idx" ON "Watermark"("ipRightsId");
CREATE INDEX IF NOT EXISTS "IPLicense_ipRightsId_idx" ON "IPLicense"("ipRightsId");
CREATE INDEX IF NOT EXISTS "IPLicense_userId_idx" ON "IPLicense"("userId");

ALTER TABLE "IPRights" ADD CONSTRAINT "IPRights_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IPRights" ADD CONSTRAINT "IPRights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IPUsageLog" ADD CONSTRAINT "IPUsageLog_ipRightsId_fkey" FOREIGN KEY ("ipRightsId") REFERENCES "IPRights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IPUsageLog" ADD CONSTRAINT "IPUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Watermark" ADD CONSTRAINT "Watermark_ipRightsId_fkey" FOREIGN KEY ("ipRightsId") REFERENCES "IPRights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IPLicense" ADD CONSTRAINT "IPLicense_ipRightsId_fkey" FOREIGN KEY ("ipRightsId") REFERENCES "IPRights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IPLicense" ADD CONSTRAINT "IPLicense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
