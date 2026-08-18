CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer,
	`location_id` integer,
	`starts_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `repair_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `service_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `device_brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `device_brands_name_unique` ON `device_brands` (`name`);--> statement-breakpoint
CREATE TABLE `device_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_id` integer,
	`name` text NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `device_brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `device_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer,
	`name` text NOT NULL,
	`active` integer DEFAULT true,
	FOREIGN KEY (`category_id`) REFERENCES `device_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `repair_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`customer_id` integer,
	`device_model_id` integer,
	`estimated_price` integer NOT NULL,
	`delivery_method` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'REQUESTED' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`device_model_id`) REFERENCES `device_models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repair_orders_public_id_unique` ON `repair_orders` (`public_id`);--> statement-breakpoint
CREATE TABLE `repair_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_model_id` integer,
	`repair_service_id` integer,
	`amount_czk` integer NOT NULL,
	`duration_minutes` integer,
	FOREIGN KEY (`device_model_id`) REFERENCES `device_models`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`repair_service_id`) REFERENCES `repair_services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `repair_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `service_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);