/*
  Warnings:

  - You are about to drop the column `latitude` on the `delivery_mens` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `delivery_mens` table. All the data in the column will be lost.
  - Added the required column `deliveryManLatitude` to the `delivery_mens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryManLongitude` to the `delivery_mens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "delivery_mens" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "deliveryManLatitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "deliveryManLongitude" DECIMAL(65,30) NOT NULL;
