/*
  Warnings:

  - Made the column `userId` on table `Joke` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Joke" DROP CONSTRAINT "Joke_userId_fkey";

-- AlterTable
ALTER TABLE "Joke" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
