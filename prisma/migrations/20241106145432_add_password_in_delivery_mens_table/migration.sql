/*
  Warnings:

  - Added the required column `password` to the `delivery_mens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "delivery_mens" ADD COLUMN     "password" TEXT NOT NULL;
