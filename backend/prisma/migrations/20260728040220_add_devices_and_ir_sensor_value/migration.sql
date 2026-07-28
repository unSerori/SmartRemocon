-- CreateTable
CREATE TABLE `devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mac_address` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` TEXT NULL,
    `collect_matrics` BOOLEAN NOT NULL DEFAULT false,
    `registerd_at` TIMESTAMP(3) NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,

    UNIQUE INDEX `devices_mac_address_key`(`mac_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ir_sensor_values` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `data` TEXT NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ir_sensor_values` ADD CONSTRAINT `ir_sensor_values_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `devices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
