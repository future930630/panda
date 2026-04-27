<?php
/**
 * PandaShield B2B - PHP API 配置文件
 * 上传到服务器后修改以下配置
 */

// 数据库配置（从服务器面板获取）
$db_config = [
    'host'     => 'localhost',      // 数据库地址，通常是 localhost
    'port'     => 3306,             // 数据库端口
    'dbname'   => 'your_db_name',   // 数据库名（需要先在面板创建）
    'username' => 'your_db_user',   // 数据库用户名
    'password' => 'your_db_password', // 数据库密码
    'charset'  => 'utf8mb4'
];

// JWT 密钥（修改为一个复杂随机字符串，不要泄露）
$jwt_secret = 'PandaShieldSecretKey2026VeryLongAndSecure123!';

// JWT 配置
$jwt_issuer  = 'PandaShield';
$jwt_audience = 'PandaShieldClient';
$jwt_expiry  = '30d'; // 30天

// 上传配置
$upload_dir = __DIR__ . '/uploads/products/';
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}
$max_upload_size = 5 * 1024 * 1024; // 5MB
