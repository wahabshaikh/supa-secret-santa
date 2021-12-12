/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsersInRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInRooms" DROP CONSTRAINT "UsersInRooms_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_gifteeId_fkey";

-- DropForeignKey
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_santaId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "creatorId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UsersInRooms" DROP CONSTRAINT "UsersInRooms_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UsersInRooms_pkey" PRIMARY KEY ("userId", "roomId");

-- AlterTable
ALTER TABLE "Wish" ALTER COLUMN "gifteeId" SET DATA TYPE TEXT,
ALTER COLUMN "santaId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInRooms" ADD CONSTRAINT "UsersInRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_gifteeId_fkey" FOREIGN KEY ("gifteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_santaId_fkey" FOREIGN KEY ("santaId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
