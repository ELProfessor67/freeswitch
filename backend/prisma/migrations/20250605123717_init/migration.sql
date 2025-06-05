/*
  Warnings:

  - You are about to drop the column `WSS_POST` on the `PBX` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extension_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extension_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PBX" DROP COLUMN "WSS_POST",
ADD COLUMN     "WSS_PORT" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "extension_number" TEXT NOT NULL,
ADD COLUMN     "extension_password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
