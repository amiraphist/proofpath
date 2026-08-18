CREATE TABLE `player_stage_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stageId` int NOT NULL,
	`mode` enum('build','fix') NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`score` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_stage_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_stage_progress_user_stage_mode` UNIQUE(`userId`,`stageId`,`mode`)
);
ALTER TABLE `player_stage_progress` ADD CONSTRAINT `player_stage_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
