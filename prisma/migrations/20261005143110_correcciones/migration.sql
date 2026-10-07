/*
  Warnings:

  - The values [EGRESO] on the enum `TipoMovimiento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoMovimiento_new" AS ENUM ('INGRESO', 'RETIRO', 'APERTURA', 'AJUSTE');
ALTER TABLE "movimientos_caja" ALTER COLUMN "tipo" TYPE "TipoMovimiento_new" USING ("tipo"::text::"TipoMovimiento_new");
ALTER TYPE "TipoMovimiento" RENAME TO "TipoMovimiento_old";
ALTER TYPE "TipoMovimiento_new" RENAME TO "TipoMovimiento";
DROP TYPE "public"."TipoMovimiento_old";
COMMIT;
