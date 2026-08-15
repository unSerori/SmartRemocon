/*
  Warnings:

  - You are about to drop the column `data` on the `ir_sensor_values` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ir_sensor_values` DROP COLUMN `data`;

-- CreateTable
CREATE TABLE `ir_sensor_value_known_protocol_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ir_sensor_value_id` INTEGER NOT NULL,
    `protocol` VARCHAR(191) NOT NULL,
    `frequency_khz` INTEGER NOT NULL,
    `header_mark_micros` INTEGER NOT NULL,
    `header_space_micros` INTEGER NOT NULL,
    `one_mark_micros` INTEGER NOT NULL,
    `one_space_micros` INTEGER NOT NULL,
    `zero_mark_micros` INTEGER NOT NULL,
    `zero_space_micros` INTEGER NOT NULL,
    `data` JSON NOT NULL,
    `number_of_bits` INTEGER NOT NULL,

    UNIQUE INDEX `ir_sensor_value_known_protocol_data_ir_sensor_value_id_key`(`ir_sensor_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ir_sensor_value_raw_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ir_sensor_value_id` INTEGER NOT NULL,
    `data` JSON NOT NULL,
    `frequency_khz` INTEGER NOT NULL,

    UNIQUE INDEX `ir_sensor_value_raw_data_ir_sensor_value_id_key`(`ir_sensor_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ir_sensor_value_known_protocol_data` ADD CONSTRAINT `ir_sensor_value_known_protocol_data_ir_sensor_value_id_fkey` FOREIGN KEY (`ir_sensor_value_id`) REFERENCES `ir_sensor_values`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ir_sensor_value_raw_data` ADD CONSTRAINT `ir_sensor_value_raw_data_ir_sensor_value_id_fkey` FOREIGN KEY (`ir_sensor_value_id`) REFERENCES `ir_sensor_values`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
