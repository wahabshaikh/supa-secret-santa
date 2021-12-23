/*
  Warnings:

  - You are about to drop the column `isSecret` on the `Wish` table. All the data in the column will be lost.
  - Added the required column `giftUrl` to the `Wish` table without a default value. This is not possible if the table is not empty.
  - Made the column `acceptedAt` on table `Wish` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UsersInRooms" ADD COLUMN     "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "isSecret",
ADD COLUMN     "giftUrl" TEXT NOT NULL,
ALTER COLUMN "acceptedAt" SET NOT NULL;
