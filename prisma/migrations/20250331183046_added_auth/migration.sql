-- CreateTable
CREATE TABLE `Client` (
    `client_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cases` (
    `case_id` INTEGER NOT NULL AUTO_INCREMENT,
    `filing_date` DATE NOT NULL,
    `court_name` VARCHAR(100) NOT NULL,
    `verdict` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `case_type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `staff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `experience` INTEGER NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,
    `bar_number` VARCHAR(50) NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `specialisation` VARCHAR(100) NULL,
    `designation` VARCHAR(50) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `expense_id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `expense_date` DATE NOT NULL,
    `paid_by` INTEGER NOT NULL,

    INDEX `paid_by`(`paid_by`),
    PRIMARY KEY (`expense_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `doc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `upload_date` DATETIME(0) NOT NULL,
    `doc_type` VARCHAR(50) NOT NULL,
    `case_id` INTEGER NOT NULL,

    INDEX `case_id`(`case_id`),
    PRIMARY KEY (`doc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff_Case` (
    `staff_id` INTEGER NOT NULL,
    `case_id` INTEGER NOT NULL,

    INDEX `case_id`(`case_id`),
    PRIMARY KEY (`staff_id`, `case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client_Case` (
    `client_id` INTEGER NOT NULL,
    `case_id` INTEGER NOT NULL,

    INDEX `case_id`(`case_id`),
    PRIMARY KEY (`client_id`, `case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purpose` VARCHAR(255) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `appointment_date` DATETIME(0) NOT NULL,
    `case_id` INTEGER NOT NULL,

    INDEX `case_id`(`case_id`),
    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billing` (
    `billing_id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_date` DATE NOT NULL,
    `payment_mode` VARCHAR(50) NOT NULL,
    `due_date` DATE NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `client_id` INTEGER NOT NULL,
    `case_id` INTEGER NOT NULL,

    INDEX `case_id`(`case_id`),
    INDEX `client_id`(`client_id`),
    PRIMARY KEY (`billing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment_Client` (
    `appointment_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,

    INDEX `client_id`(`client_id`),
    PRIMARY KEY (`appointment_id`, `client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment_Staff` (
    `appointment_id` INTEGER NOT NULL,
    `staff_id` INTEGER NOT NULL,

    INDEX `staff_id`(`staff_id`),
    PRIMARY KEY (`appointment_id`, `staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_ibfk_1` FOREIGN KEY (`paid_by`) REFERENCES `Staff`(`staff_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Staff_Case` ADD CONSTRAINT `Staff_Case_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Staff_Case` ADD CONSTRAINT `Staff_Case_ibfk_2` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Client_Case` ADD CONSTRAINT `Client_Case_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Client_Case` ADD CONSTRAINT `Client_Case_ibfk_2` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_ibfk_2` FOREIGN KEY (`case_id`) REFERENCES `Cases`(`case_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Appointment_Client` ADD CONSTRAINT `Appointment_Client_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Appointment_Client` ADD CONSTRAINT `Appointment_Client_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Appointment_Staff` ADD CONSTRAINT `Appointment_Staff_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Appointment_Staff` ADD CONSTRAINT `Appointment_Staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
