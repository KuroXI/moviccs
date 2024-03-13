/*
  Warnings:

  - You are about to drop the `Deliver` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deliver" DROP CONSTRAINT "Deliver_deliveryById_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "handlerId" TEXT,
ADD COLUMN     "orderGroupId" TEXT,
ADD COLUMN     "orderId" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "maxWeight" INTEGER NOT NULL DEFAULT 10;

-- DropTable
DROP TABLE "Deliver";

-- CreateTable
CREATE TABLE "PendingDelivery" (
    "ordersId" TEXT NOT NULL,
    "handlerId" TEXT NOT NULL,

    CONSTRAINT "PendingDelivery_pkey" PRIMARY KEY ("ordersId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingDelivery_handlerId_key" ON "PendingDelivery"("handlerId");

-- AddForeignKey
ALTER TABLE "PendingDelivery" ADD CONSTRAINT "PendingDelivery_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderGroupId_fkey" FOREIGN KEY ("orderGroupId") REFERENCES "PendingDelivery"("ordersId") ON DELETE SET NULL ON UPDATE CASCADE;
