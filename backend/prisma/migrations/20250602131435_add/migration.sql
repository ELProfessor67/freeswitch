/*
  Warnings:

  - You are about to drop the column `SIP` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_SIP_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "SIP",
ADD COLUMN     "pbx_id" TEXT;

-- CreateTable
CREATE TABLE "PBX" (
    "id" TEXT NOT NULL,
    "SIP_HOST" TEXT NOT NULL,
    "SIP_PORT" TEXT NOT NULL,
    "WSS_POST" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PBX_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PBX_id_key" ON "PBX"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pbx_id_fkey" FOREIGN KEY ("pbx_id") REFERENCES "PBX"("id") ON DELETE SET NULL ON UPDATE CASCADE;
