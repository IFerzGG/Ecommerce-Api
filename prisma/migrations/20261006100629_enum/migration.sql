/*
  Warnings:

  - Changed the type of `metodoPago` on the `ventas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('EFECTIVO', 'TARJETA');

-- AlterTable
ALTER TABLE "ventas" DROP COLUMN "metodoPago",
ADD COLUMN     "metodoPago" "TipoPago" NOT NULL;
