-- Migration: Update schema to match database plan
-- This migration updates the existing tables to match the database plan

-- Update users table
ALTER TABLE `users` 
  ADD COLUMN `password_hash` varchar(255) NOT NULL AFTER `email`,
  ADD COLUMN `bio` text AFTER `password_hash`,
  ADD COLUMN `location` varchar(255) AFTER `bio`,
  ADD COLUMN `available_times` text AFTER `location`,
  ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Drop the old password column and rename username to name if needed
-- Note: You may need to migrate data from password to password_hash
-- ALTER TABLE `users` DROP COLUMN `password`;
-- ALTER TABLE `users` DROP COLUMN `username`;

-- Update dogs table
ALTER TABLE `dogs`
  ADD COLUMN `sex` varchar(10) NOT NULL AFTER `name`,
  ADD COLUMN `size` varchar(20) NOT NULL AFTER `age`,
  ADD COLUMN `temperament` text AFTER `size`,
  ADD COLUMN `vaccination_status` varchar(50) NOT NULL AFTER `temperament`,
  ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Rename dog_name to name
ALTER TABLE `dogs` CHANGE COLUMN `dog_name` `name` varchar(100) NOT NULL;

-- Update vaccination enum to varchar
ALTER TABLE `dogs` MODIFY COLUMN `vaccination_status` varchar(50) NOT NULL;

-- Update playdate_requests table
ALTER TABLE `playdate_request` RENAME TO `playdate_requests`;

ALTER TABLE `playdate_requests`
  ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update date and time columns
ALTER TABLE `playdate_requests` 
  MODIFY COLUMN `date` date NOT NULL,
  MODIFY COLUMN `time` time NOT NULL;

-- Update messages table
ALTER TABLE `messages`
  ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update content column to text
ALTER TABLE `messages` MODIFY COLUMN `content` text NOT NULL;
