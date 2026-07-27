/*
  Warnings:

  - You are about to drop the column `temperture_sht` on the `env_logs` table. All the data in the column will be lost.
  - Added the required column `temperature_sht` to the `env_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `env_logs` DROP COLUMN `temperture_sht`,
    ADD COLUMN `temperature_sht` DOUBLE NOT NULL,
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL;
