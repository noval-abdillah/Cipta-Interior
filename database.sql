-- ============================================================
-- SQL Schema Setup untuk Database Cipta Interior
-- Hostname: sql112.infinityfree.com
-- Database Name: if0_41898050_pt_ciptainterior
-- ============================================================

-- 1. Tabel admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'superadmin') DEFAULT 'admin',
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel portfolio
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('residensial', 'komersial', 'restoran', 'hotel', 'furnitur') NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(255) NOT NULL,
  `image_filename` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel contacts (Pesan masuk)
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `service` VARCHAR(100) NULL,
  `message` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel rate_limit (Pencegahan serangan Bruteforce login & spam)
CREATE TABLE IF NOT EXISTS `rate_limit` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(50) NOT NULL,
  `ip` VARCHAR(45) NOT NULL,
  `created_at` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AKUN DEMO DEFAULT ADMIN
-- Username: admin
-- Password asli: admin123
-- ============================================================
INSERT INTO `admins` (`username`, `password`, `role`, `is_active`) 
VALUES ('admin', '$2y$10$U4sW7xSjK9K6vT6l6u6y6O5P5T5V5W5X5y5Z5a5b5c5d5e5f5g5h5', 'admin', 1)
ON DUPLICATE KEY UPDATE `username`=`username`;
