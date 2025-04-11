-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `subCity` VARCHAR(191) NOT NULL,
    `locationDescription` LONGTEXT NOT NULL,
    `gym` BOOLEAN NOT NULL DEFAULT false,
    `spa` BOOLEAN NOT NULL DEFAULT false,
    `bar` BOOLEAN NOT NULL DEFAULT false,
    `restaurant` BOOLEAN NOT NULL DEFAULT false,
    `shopping` BOOLEAN NOT NULL DEFAULT false,
    `swimmingPool` BOOLEAN NOT NULL DEFAULT false,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    FULLTEXT INDEX `Hotel_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `bedCount` INTEGER NOT NULL DEFAULT 0,
    `bathroomCount` INTEGER NOT NULL DEFAULT 0,
    `kingBed` INTEGER NOT NULL DEFAULT 0,
    `normalBed` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NOT NULL,
    `breakfastPrice` INTEGER NOT NULL,
    `roomPrice` INTEGER NOT NULL,
    `tv` BOOLEAN NOT NULL DEFAULT false,
    `balcony` BOOLEAN NOT NULL DEFAULT false,
    `wifi` BOOLEAN NOT NULL DEFAULT false,
    `forestView` BOOLEAN NOT NULL DEFAULT false,
    `mountainView` BOOLEAN NOT NULL DEFAULT false,
    `airCondition` BOOLEAN NOT NULL DEFAULT false,
    `hotelId` VARCHAR(191) NOT NULL,

    INDEX `Room_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `breakfastIncluded` BOOLEAN NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `isPayed` BOOLEAN NOT NULL DEFAULT false,
    `paymentIntentId` VARCHAR(191) NOT NULL,
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hotelId` VARCHAR(191) NULL,
    `roomId` VARCHAR(191) NULL,

    UNIQUE INDEX `Booking_paymentIntentId_key`(`paymentIntentId`),
    INDEX `Booking_hotelId_idx`(`hotelId`),
    INDEX `Booking_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
