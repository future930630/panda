-- ============================================
-- PandaShield B2B 数据库建表 SQL (MySQL 5.7+)
-- 运行方式：在 phpMyAdmin 或 MySQL 命令行执行
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 用户表
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(80) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','customer') DEFAULT 'customer',
  `company` VARCHAR(255) DEFAULT '',
  `country` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(100) DEFAULT '',
  `company_size` VARCHAR(50) DEFAULT '',
  `annual_revenue` VARCHAR(50) DEFAULT '',
  `purchase_amount` VARCHAR(50) DEFAULT '',
  `industry` VARCHAR(100) DEFAULT '',
  `whatsapp` VARCHAR(100) DEFAULT '',
  `linkedin` VARCHAR(255) DEFAULT '',
  `notes` TEXT,
  `contact_person` VARCHAR(100) DEFAULT '',
  `contact_title` VARCHAR(100) DEFAULT '',
  `contact_mobile` VARCHAR(100) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `profile_complete` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` DATETIME DEFAULT NULL,
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 种子管理员账号
-- 密码: admin123!  (bcrypt hash)
INSERT INTO `users` (`username`,`email`,`password_hash`,`role`,`company`,`country`,`phone`) VALUES
('admin','admin@pandashield.com','$2a$10$8K1p/a0dR1xqM8K9Y7cQ5OGn1Rr7T3JH5pXY6eJqUQ2L3G5H6eJmK','admin','PandaShield Inc.','China','+86-000-0000-0000');

-- ----------------------------
-- 2. 案例表
-- ----------------------------
DROP TABLE IF EXISTS `cases`;
CREATE TABLE `cases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) DEFAULT '',
  `category` VARCHAR(100) DEFAULT '',
  `industry` VARCHAR(100) DEFAULT '',
  `description` TEXT,
  `description_en` TEXT,
  `image_url` VARCHAR(500) DEFAULT '',
  `tags` VARCHAR(500) DEFAULT '',
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- 3. 品牌授权表
-- ----------------------------
DROP TABLE IF EXISTS `brand_licensing`;
CREATE TABLE `brand_licensing` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) DEFAULT '',
  `contact_name` VARCHAR(100) DEFAULT '',
  `contact_email` VARCHAR(255) DEFAULT '',
  `contact_phone` VARCHAR(100) DEFAULT '',
  `country` VARCHAR(100) DEFAULT '',
  `licensing_type` VARCHAR(100) DEFAULT '',
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- 4. 产品表
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(100) NOT NULL,
  `name_zh` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) DEFAULT '',
  `short_desc_zh` TEXT,
  `short_desc_en` TEXT,
  `desc_zh` TEXT,
  `desc_en` TEXT,
  `brand` VARCHAR(50) DEFAULT 'panda-shield',
  `tags` VARCHAR(500) DEFAULT '',
  `industries` VARCHAR(500) DEFAULT '',
  `sports` VARCHAR(500) DEFAULT '',
  `certifications` VARCHAR(500) DEFAULT '',
  `price_usd` DECIMAL(10,2) DEFAULT 0,
  `moq` INT UNSIGNED DEFAULT 50,
  `lead_time_days` INT UNSIGNED DEFAULT 7,
  `images` TEXT DEFAULT '[]',
  `video_url` VARCHAR(500) DEFAULT '',
  `specs` TEXT DEFAULT '{}',
  `status` ENUM('draft','active') DEFAULT 'draft',
  `visibility` ENUM('visible','trash') DEFAULT 'visible',
  `meta_title` VARCHAR(255) DEFAULT '',
  `meta_desc` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `updated_by` INT UNSIGNED DEFAULT NULL,
  UNIQUE KEY `uk_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 种子产品
INSERT INTO `products` (`sku`,`name_zh`,`name_en`,`short_desc_zh`,`short_desc_en`,`brand`,`tags`,`industries`,`sports`,`certifications`,`price_usd`,`moq`,`lead_time_days`,`status`,`visibility`) VALUES
('SHIELD-CUT5','防切割手套 SE','Cut-Resistant Gloves SE','高强度 HPPE 防切割内衬，渗透测试达 EN 388 Level 5','HPPE lining, EN 388 Level 5 cut resistance','panda-shield','防切割,工业,制造','制造业,建筑,物流','骑行,攀岩,射击','EN388,CE,ISO9001',12.50,100,7,'active','visible'),
('IMPACT-GRIP','防撞防滑手套 PR','Impact-Resistant Grip Gloves PR','TPR 关节防撞设计，硅胶防滑掌面，适合重载搬运','TPR impact guards, silicone grip palm, heavy-duty handling','panda-impact','防撞,防滑,重载','制造业,物流,建筑','健身,射击,潜水','EN388,CE,ANSI107',18.00,50,10,'active','visible'),
('CHEM-NITRILE-B','耐油耐化学手套 NC','Nitrile Chemical Gloves NC','加厚丁腈涂层，抗油污、抗弱酸碱，适合石油化工','Heavy nitrile coating, oil & mild chemical resistance','panda-chem','耐油,耐化学,化工','石油化工,食品加工,农业','','EN374,CE,SGS',9.80,200,5,'active','visible'),
('HEAT-WELD-350','耐高温焊接手套 HT','Heat-Resistant Welding Gloves HT','牛皮外层 + 芳纶隔热层，最高耐温 350°C，适合焊接场景','Split leather outer, aramid lining, 350°C rated','panda-heat','耐高温,焊接,耐热','冶金,焊接,制造','','EN407,CE,ISO9001',22.00,50,14,'active','visible'),
('SHIELD-PUNCT-A4','防穿刺手套 PU','Puncture-Resistant Gloves PU','聚氨酯涂层 + 芳纶防穿刺层，ANSI A4 等级，保护指尖','PU coated, aramid puncture layer, ANSI A4 rated','panda-shield','防穿刺,防切割,工业','制造业,建筑,物流,农业','骑行,钓鱼,攀岩','ANSI107,EN388,CE',14.50,80,7,'active','visible'),
('BIO-MED-GL','医疗防护手套 MP','Medical Examination Gloves MP','一次性丁腈无粉手套，医疗级 FDA 认证，敏肌友好','Disposable nitrile, powder-free, FDA medical grade','panda-bio','医疗,防护,一次性','医疗,实验室,食品','','EN455,FDA,CE',6.20,500,3,'active','visible'),
('ECO-REBEL-GR','可降解再生手套 RG','Eco Recycled Gloves RG','60% 再生纱线，生物可降解，适合轻载与户外运动','60% recycled yarn, biodegradable, eco-friendly','panda-eco','环保,再生,轻载','物流,农业,户外','骑行,健身,钓鱼,马术','OEKO-TEX,CE',8.90,120,7,'active','visible'),
('VOLT-INSUL-00','电绝缘手套 EL','Electrical Insulation Gloves EL','Class 00 绝缘等级，天然橡胶内层，最高 AC 500V','Class 00 rated, natural rubber, AC 500V max','panda-volt','绝缘,电工,电力','电力,电子,通讯','','EN60903,CE,IEC',35.00,30,14,'active','visible'),
('FROST-COLD-30','防寒保暖手套 CF','Cold-Resistant Gloves CF','3M Thinsulate 保温层，耐低温 -30°C，防水透湿','3M Thinsulate, -30°C rated, waterproof & breathable','panda-frost','防寒,保暖,防水','冷链,农业,户外,物流','滑雪,钓鱼,潜水','EN511,CE',28.00,40,10,'active','visible'),
('SHIELD-GRIP-Pro','通用防滑手套 GP','General Grip Gloves GP','尼龙弹力内衬 + 超细丁腈发泡掌面，透气灵巧，适合精密装配','Nylon stretch liner, micro-foam nitrile palm, precision work','panda-shield','防滑,透气,精密','制造业,电子,物流','健身,骑行','EN388,CE',7.50,200,5,'active','visible');

-- ----------------------------
-- 5. 购物车表
-- ----------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED DEFAULT 1,
  `specs` TEXT DEFAULT '',
  `message` TEXT DEFAULT '',
  `added_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- 6. 询价表
-- ----------------------------
DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE `inquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT 0,
  `items` TEXT NOT NULL,
  `message` TEXT DEFAULT '',
  `status` ENUM('pending','replied','closed') DEFAULT 'pending',
  `reply_message` TEXT DEFAULT '',
  `replied_at` DATETIME DEFAULT NULL,
  `replied_by` INT UNSIGNED DEFAULT NULL,
  `contact_name` VARCHAR(100) DEFAULT '',
  `contact_email` VARCHAR(255) DEFAULT '',
  `contact_phone` VARCHAR(100) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- 7. 订单表
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_no` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `items` TEXT NOT NULL,
  `subtotal` DECIMAL(10,2) DEFAULT 0,
  `shipping_cost` DECIMAL(10,2) DEFAULT 0,
  `tax` DECIMAL(10,2) DEFAULT 0,
  `total` DECIMAL(10,2) DEFAULT 0,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `status` ENUM('pending','paid','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `payment_method` VARCHAR(50) DEFAULT '',
  `payment_id` VARCHAR(100) DEFAULT '',
  `paid_at` DATETIME DEFAULT NULL,
  `shipping_address` TEXT DEFAULT '',
  `tracking_no` VARCHAR(100) DEFAULT '',
  `courier` VARCHAR(100) DEFAULT '',
  `shipped_at` DATETIME DEFAULT NULL,
  `delivered_at` DATETIME DEFAULT NULL,
  `notes` TEXT DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
