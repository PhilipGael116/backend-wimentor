/*
  Warnings:

  - You are about to drop the column `aLevelseries` on the `MentorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MentorProfile" DROP COLUMN "aLevelseries",
ADD COLUMN     "aLevelSeries" TEXT;
