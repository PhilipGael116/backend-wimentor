-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Mentor', 'Mentee');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasOlevel" BOOLEAN NOT NULL DEFAULT false,
    "oLevelSeries" TEXT,
    "hasAlevel" BOOLEAN NOT NULL DEFAULT false,
    "aLevelseries" TEXT,
    "currentStatus" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "avRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenteeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MenteeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenteeProfileToMentorProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenteeProfileToMentorProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MenteeProfile_userId_key" ON "MenteeProfile"("userId");

-- CreateIndex
CREATE INDEX "_MenteeProfileToMentorProfile_B_index" ON "_MenteeProfileToMentorProfile"("B");

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeProfile" ADD CONSTRAINT "MenteeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "MenteeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeProfileToMentorProfile" ADD CONSTRAINT "_MenteeProfileToMentorProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "MenteeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeProfileToMentorProfile" ADD CONSTRAINT "_MenteeProfileToMentorProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
