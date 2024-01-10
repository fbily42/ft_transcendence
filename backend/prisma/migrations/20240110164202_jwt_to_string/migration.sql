/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "jwt" SET DATA TYPE TEXT;
