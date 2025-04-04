/*
  Warnings:

  - You are about to drop the column `client_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `staff_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `client_auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_auth` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_staff_id_fkey`;

-- DropIndex
DROP INDEX `sessions_client_id_fkey` ON `sessions`;

-- DropIndex
DROP INDEX `sessions_staff_id_fkey` ON `sessions`;

-- AlterTable
ALTER TABLE `sessions` DROP COLUMN `client_id`,
    DROP COLUMN `staff_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `client_auth`;

-- DropTable
DROP TABLE `staff_auth`;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointment_id` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(255) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `appointment_date` DATETIME(0) NOT NULL,
    `case_id` VARCHAR(191) NOT NULL,

    INDEX `fk_appointment_case`(`case_id`),
    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment_Client` (
    `appointment_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,

    INDEX `fk_appclient_client`(`client_id`),
    PRIMARY KEY (`appointment_id`, `client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment_Staff` (
    `appointment_id` VARCHAR(191) NOT NULL,
    `staff_id` VARCHAR(191) NOT NULL,

    INDEX `fk_appstaff_staff`(`staff_id`),
    PRIMARY KEY (`appointment_id`, `staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billing` (
    `billing_id` VARCHAR(191) NOT NULL,
    `payment_date` DATE NOT NULL,
    `payment_mode` VARCHAR(50) NOT NULL,
    `due_date` DATE NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `case_id` VARCHAR(191) NOT NULL,

    INDEX `fk_billing_case`(`case_id`),
    INDEX `fk_billing_client`(`client_id`),
    PRIMARY KEY (`billing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cases` (
    `case_id` VARCHAR(191) NOT NULL,
    `filing_date` DATE NOT NULL,
    `court_name` VARCHAR(100) NOT NULL,
    `verdict` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `case_type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `client_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client_Case` (
    `client_id` VARCHAR(191) NOT NULL,
    `case_id` VARCHAR(191) NOT NULL,

    INDEX `fk_clientcase_case`(`case_id`),
    PRIMARY KEY (`client_id`, `case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `doc_id` VARCHAR(191) NOT NULL,
    `upload_date` DATETIME(0) NOT NULL,
    `doc_type` VARCHAR(50) NOT NULL,
    `case_id` VARCHAR(191) NOT NULL,

    INDEX `fk_document_case`(`case_id`),
    PRIMARY KEY (`doc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `expense_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `expense_date` DATE NOT NULL,
    `paid_by` VARCHAR(191) NOT NULL,

    INDEX `fk_expense_staff`(`paid_by`),
    PRIMARY KEY (`expense_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `staff_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `experience` INTEGER NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,
    `bar_number` VARCHAR(50) NULL,
    `address` VARCHAR(255) NOT NULL,
    `specialisation` VARCHAR(100) NULL,

    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff_Case` (
    `staff_id` VARCHAR(191) NOT NULL,
    `case_id` VARCHAR(191) NOT NULL,

    INDEX `fk_staffcase_case`(`case_id`),
    PRIMARY KEY (`staff_id`, `case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` DATETIME(3) NULL,
    `hashedPassword` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('CLIENT', 'STAFF', 'ADMIN') NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `sessions_user_id_fkey` ON `sessions`(`user_id`);

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `fk_appointment_case` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment_Client` ADD CONSTRAINT `fk_appclient_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment_Client` ADD CONSTRAINT `fk_appclient_client` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment_Staff` ADD CONSTRAINT `fk_appstaff_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment_Staff` ADD CONSTRAINT `fk_appstaff_staff` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `fk_billing_case` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `fk_billing_client` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `fk_client_auth` FOREIGN KEY (`client_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client_Case` ADD CONSTRAINT `fk_clientcase_case` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client_Case` ADD CONSTRAINT `fk_clientcase_client` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `fk_document_case` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `fk_expense_staff` FOREIGN KEY (`paid_by`) REFERENCES `Staff`(`staff_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `fk_staffauth_staff` FOREIGN KEY (`staff_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff_Case` ADD CONSTRAINT `fk_staffcase_case` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff_Case` ADD CONSTRAINT `fk_staffcase_staff` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;
