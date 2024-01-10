/*
  Warnings:

  - You are about to drop the column `tokenAuth` on the `User` table. All the data in the column will be lost.
  - Added the required column `token42` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenAuth",
ADD COLUMN     "jwt" JSONB,
ADD COLUMN     "token42" JSONB NOT NULL;
