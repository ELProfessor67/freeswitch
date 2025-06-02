/*
  Warnings:

  - Made the column `pbx_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pbx_id_fkey";

-- AlterTable
ALTER TABLE "PBX" ALTER COLUMN "SIP_PORT" DROP NOT NULL,
ALTER COLUMN "WSS_POST" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pbx_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pbx_id_fkey" FOREIGN KEY ("pbx_id") REFERENCES "PBX"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
