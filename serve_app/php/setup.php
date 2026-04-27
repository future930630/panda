<?php
/**
 * 初始化脚本（首次部署后访问一次即可）
 * 访问地址：https://你的域名/api/setup.php
 * 执行完会自动创建 admin 账号，然后删除自己
 */
require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');
echo "<pre>";

// 1. 创建表
$sql = file_get_contents(__DIR__ . '/database.sql');
$statements = array_filter(array_map('trim', explode(';', $sql)));

$db = @new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['dbname'], $db_config['port']);
if ($db->connect_error) {
    die('数据库连接失败，请检查 config.php 配置');
}
$db->set_charset('utf8mb4');

$created = 0;
foreach ($statements as $stmt) {
    if (empty(trim($stmt))) continue;
    if (stripos($stmt, 'SET ') === 0 || stripos($stmt, 'SET FOREIGN_KEY') === 0) { @$db->query($stmt); continue; }
    if (stripos($stmt, 'DROP TABLE') === 0) { @$db->query($stmt); continue; }
    if (stripos($stmt, 'INSERT INTO') !== false && stripos($stmt, 'users') !== false) continue; // 跳过种子admin，后面单独插
    if ($db->query($stmt)) $created++;
}
echo "✓ 表创建完成 ($created 条)\n";

// 2. 用 PHP password_hash 生成 admin
$hash = password_hash('admin123!', PASSWORD_BCRYPT);
$check = $db->query("SELECT id FROM users WHERE email='admin@pandashield.com'");
if ($check->num_rows === 0) {
    $db->query("INSERT INTO users (username,email,password_hash,role,company,country,phone) VALUES ('admin','admin@pandashield.com','$hash','admin','PandaShield Inc.','China','+86-000-0000-0000')");
    echo "✓ admin 账号创建成功\n";
    echo "  邮箱：admin@pandashield.com\n";
    echo "  密码：admin123!\n";
} else {
    echo "✓ admin 账号已存在，跳过\n";
}

echo "\n✓ 初始化完成！\n";
echo "现在可以用 admin@pandashield.com / admin123! 登录管理后台了。\n";
echo "\n为安全起见，请立即删除 setup.php（已自动删除，如看到此消息说明删除失败，请手动删除）。\n";
echo "</pre>";

// 自动删除本文件
@unlink(__FILE__);
