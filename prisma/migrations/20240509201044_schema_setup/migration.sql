/*
  Warnings:

  - Added the required column `clientAddressId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderAddressId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientAddressId" TEXT NOT NULL,
ADD COLUMN     "senderAddressId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_senderAddressId_fkey" FOREIGN KEY ("senderAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientAddressId_fkey" FOREIGN KEY ("clientAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
