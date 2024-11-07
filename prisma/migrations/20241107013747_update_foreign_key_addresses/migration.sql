/*
  Warnings:

  - A unique constraint covering the columns `[recipientId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_recipientId_key" ON "addresses"("recipientId");
