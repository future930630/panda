<?php
/**
 * PandaShield B2B - PHP API 主文件
 * 单文件实现所有 REST API 端点
 * 上传顺序：config.php → database.sql（执行） → api.php
 */

// ===================== 配置 =====================
require_once __DIR__ . '/config.php';

// ===================== 数据库 =====================
function getDb(): mysqli {
    global $db_config;
    static $mysqli = null;
    if ($mysqli === null) {
        $mysqli = @new mysqli(
            $db_config['host'],
            $db_config['username'],
            $db_config['password'],
            $db_config['dbname'],
            $db_config['port']
        );
        if ($mysqli->connect_error) {
            http_response_code(503);
            jsonOut(['error' => 'Database connection failed']);
            exit;
        }
        $mysqli->set_charset($db_config['charset']);
    }
    return $mysqli;
}

// ===================== JSON 响应 =====================
function jsonOut($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $msg, int $code = 400): void {
    jsonOut(['error' => $msg], $code);
}

// ===================== JWT 实现 =====================
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwtSign(array $payload): string {
    global $jwt_secret, $jwt_issuer, $jwt_audience, $jwt_expiry;
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload['iat'] = $now;
    $payload['nbf'] = $now;
    $payload['iss'] = $jwt_issuer;
    $payload['aud'] = $jwt_audience;
    if ($jwt_expiry) {
        $payload['exp'] = $now + parseExpiry($jwt_expiry);
    }
    $body = base64UrlEncode(json_encode($header)) . '.' . base64UrlEncode(json_encode($payload));
    $sig = base64UrlEncode(hash_hmac('sha256', $body, $jwt_secret, true));
    return $body . '.' . $sig;
}

function jwtVerify(string $token): ?array {
    global $jwt_secret, $jwt_issuer, $jwt_audience;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$h.$p", $jwt_secret, true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(base64UrlDecode($p), true);
    if (!$payload) return null;
    $now = time();
    if (isset($payload['exp']) && $payload['exp'] < $now) return null;
    if (isset($payload['nbf']) && $payload['nbf'] > $now) return null;
    if ($payload['iss'] !== $jwt_issuer) return null;
    if ($payload['aud'] !== $jwt_audience) return null;
    return $payload;
}

function parseExpiry(string $expiry): int {
    $unit = substr($expiry, -1);
    $val = (int)substr($expiry, 0, -1);
    return match($unit) {
        's' => $val,
        'm' => $val * 60,
        'h' => $val * 3600,
        'd' => $val * 86400,
        default => (int)$expiry
    };
}

// ===================== 认证中间件 =====================
function authRequired(): ?array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($auth, 'Bearer ')) {
        jsonError('No token provided', 401);
    }
    $payload = jwtVerify(substr($auth, 7));
    if (!$payload) {
        jsonError('Invalid or expired token', 401);
    }
    return $payload;
}

function optionalAuth(): ?array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($auth, 'Bearer ')) {
        return jwtVerify(substr($auth, 7));
    }
    return null;
}

function adminOnly(array $payload): void {
    if (($payload['role'] ?? '') !== 'admin') {
        jsonError('Admin access required', 403);
    }
}

// ===================== 辅助函数 =====================
function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function getQuery(): array {
    return $_GET;
}

function genOrderNo(): string {
    return 'PS' . date('YmdHis') . mt_rand(1000, 9999);
}

function myRow(mysqli_result $result): ?array {
    $row = $result->fetch_assoc();
    return $row ?: null;
}

function myAll(mysqli_result $result): array {
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return $rows;
}

function myOne(string $sql, array $params = []): ?array {
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    return myRow($result);
}

function myAllExec(string $sql, array $params = []): array {
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    return myAll($stmt->get_result());
}

function myExec(string $sql, array $params = []): int {
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    return $stmt->affected_rows;
}

function myInsert(string $sql, array $params = []): int {
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    return $db->insert_id;
}

// ===================== CORS =====================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ===================== 路由 =====================
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^/?api/#', '/', $uri) ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

// 去除前缀路径（如果 API 在子目录）
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && str_starts_with($uri, $scriptName)) {
    $uri = '/' . ltrim(substr($uri, strlen($scriptName)), '/');
}

$path = trim($uri, '/');
$parts = $path ? explode('/', $path) : [];
$q = getQuery();
$b = getBody();

// ========== 健康检查 ==========
if ($path === 'health') {
    jsonOut(['status' => 'ok', 'time' => date('c')]);
}

// ========== 认证 ==========
if ($path === 'auth/login' && $method === 'POST') {
    $email = $b['email'] ?? '';
    $password = $b['password'] ?? '';
    if (!$email || !$password) jsonError('email and password required');
    $user = myOne("SELECT * FROM users WHERE email=? AND is_active=1", [$email]);
    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }
    myExec("UPDATE users SET last_login_at=NOW() WHERE id=?", [$user['id']]);
    $token = jwtSign(['sub' => (int)$user['id'], 'email' => $user['email'], 'name' => $user['username'], 'role' => $user['role']]);
    jsonOut([
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'company' => $user['company'] ?? '',
            'country' => $user['country'] ?? '',
            'phone' => $user['phone'] ?? '',
            'created_at' => $user['created_at'],
            'profile_complete' => (int)($user['profile_complete'] ?? 0)
        ]
    ]);
}

if ($path === 'auth/register' && $method === 'POST') {
    $username = $b['username'] ?? '';
    $email = $b['email'] ?? '';
    $password = $b['password'] ?? '';
    $company = $b['company'] ?? '';
    $country = $b['country'] ?? '';
    $phone = $b['phone'] ?? '';
    if (!$username || !$email || !$password) jsonError('username, email, password required');
    if (strlen($password) < 6) jsonError('Password must be at least 6 characters');
    $exist = myOne("SELECT id FROM users WHERE email=? OR username=?", [$email, $username]);
    if ($exist) jsonError('Email or username already exists');
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $id = myInsert("INSERT INTO users (username,email,password_hash,company,country,phone) VALUES (?,?,?,?,?,?)",
        [$username, $email, $hash, $company, $country, $phone]);
    $user = myOne("SELECT * FROM users WHERE id=?", [$id]);
    $token = jwtSign(['sub' => (int)$user['id'], 'email' => $user['email'], 'name' => $user['username'], 'role' => $user['role']]);
    jsonOut([
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'company' => $user['company'] ?? '',
            'country' => $user['country'] ?? '',
            'phone' => $user['phone'] ?? '',
            'created_at' => $user['created_at'],
            'profile_complete' => 0
        ]
    ], 201);
}

if ($path === 'auth/me' && $method === 'GET') {
    $u = authRequired();
    $user = myOne("SELECT * FROM users WHERE id=?", [$u['sub']]);
    if (!$user) jsonError('User not found', 404);
    jsonOut([
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role'],
        'company' => $user['company'] ?? '',
        'country' => $user['country'] ?? '',
        'phone' => $user['phone'] ?? '',
        'created_at' => $user['created_at'],
        'industry' => $user['industry'] ?? '',
        'company_size' => $user['company_size'] ?? '',
        'contact_person' => $user['contact_person'] ?? '',
        'contact_title' => $user['contact_title'] ?? '',
        'contact_mobile' => $user['contact_mobile'] ?? '',
        'city' => $user['city'] ?? '',
        'profile_complete' => (int)($user['profile_complete'] ?? 0)
    ]);
}

if ($path === 'auth/change-password' && $method === 'POST') {
    $u = authRequired();
    $current = $b['currentPassword'] ?? '';
    $newPwd = $b['newPassword'] ?? '';
    $user = myOne("SELECT * FROM users WHERE id=?", [$u['sub']]);
    if (!$user) jsonError('User not found', 404);
    if (!password_verify($current, $user['password_hash'])) jsonError('Current password is incorrect', 400);
    $hash = password_hash($newPwd, PASSWORD_BCRYPT);
    myExec("UPDATE users SET password_hash=? WHERE id=?", [$hash, $user['id']]);
    jsonOut(['message' => 'Password changed']);
}

// ========== 用户资料更新 ==========
if ($path === 'users/me/profile' && $method === 'PUT') {
    $u = authRequired();
    $fields = ['company','industry','company_size','contact_person','contact_title','contact_mobile','city'];
    $updates = [];
    $vals = [];
    foreach ($fields as $f) {
        if (isset($b[$f])) {
            $updates[] = "$f=?";
            $vals[] = $b[$f];
        }
    }
    $updates[] = 'profile_complete=1';
    $vals[] = $u['sub'];
    myExec("UPDATE users SET " . implode(',', $updates) . " WHERE id=?", $vals);
    jsonOut(['message' => 'Profile updated', 'profile_complete' => 1]);
}

// ========== 产品 ==========
if ($path === 'products' && $method === 'GET') {
    $page = max(1, (int)($q['page'] ?? 1));
    $pageSize = min(100, max(1, (int)($q['pageSize'] ?? 20)));
    $offset = ($page - 1) * $pageSize;
    $brand = $q['brand'] ?? '';
    $search = $q['search'] ?? '';
    $tag = $q['tag'] ?? '';
    $industry = $q['industry'] ?? '';
    $sport = $q['sport'] ?? '';
    $sort = $q['sort'] ?? '';

    $where = "WHERE visibility='visible' AND status='active'";
    $params = [];
    if ($brand) { $where .= " AND brand=?"; $params[] = $brand; }
    if ($tag) { $where .= " AND tags LIKE ?"; $params[] = "%$tag%"; }
    if ($industry) { $where .= " AND industries LIKE ?"; $params[] = "%$industry%"; }
    if ($sport) { $where .= " AND sports LIKE ?"; $params[] = "%$sport%"; }
    if ($search) {
        $s = "%$search%";
        $where .= " AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ? OR short_desc_zh LIKE ? OR short_desc_en LIKE ?)";
        $params = array_merge($params, [$s, $s, $s, $s, $s]);
    }

    $sortMap = ['price-asc' => 'price_usd ASC', 'price-desc' => 'price_usd DESC', 'newest' => 'created_at DESC'];
    $orderBy = $sortMap[$sort] ?? 'created_at DESC';

    $total = (int)(myOne("SELECT COUNT(*) as c FROM products $where", $params)['c'] ?? 0);
    $params[] = $pageSize;
    $params[] = $offset;
    $items = myAllExec("SELECT * FROM products $where ORDER BY $orderBy LIMIT ? OFFSET ?", $params);
    $items = array_map(fn($p) => array_merge($p, [
        'images' => json_decode($p['images'] ?? '[]', true),
        'specs' => json_decode($p['specs'] ?? '{}', true)
    ]), $items);
    jsonOut(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'items' => $items]);
}

// 产品按 ID
if ($parts[0] === 'products' && is_numeric($parts[1] ?? '') && count($parts) === 2 && $method === 'GET') {
    $id = (int)$parts[1];
    $u = optionalAuth();
    $p = myOne("SELECT * FROM products WHERE id=?", [$id]);
    if (!$p || ($p['visibility'] === 'trash' && ($u['role'] ?? '') !== 'admin')) jsonError('Not found', 404);
    jsonOut(array_merge($p, [
        'images' => json_decode($p['images'] ?? '[]', true),
        'specs' => json_decode($p['specs'] ?? '{}', true)
    ]));
}

// 产品按 SKU
if ($parts[0] === 'products' && ($parts[1] ?? '') === 'sku' && ($parts[2] ?? '') && $method === 'GET') {
    $sku = $parts[2];
    $p = myOne("SELECT * FROM products WHERE sku=?", [$sku]);
    if (!$p) jsonError('Not found', 404);
    jsonOut(array_merge($p, [
        'images' => json_decode($p['images'] ?? '[]', true),
        'specs' => json_decode($p['specs'] ?? '{}', true)
    ]));
}

// ========== 购物车（需登录） ==========
if ($path === 'cart' && $method === 'GET') {
    $u = authRequired();
    $items = myAllExec(
        "SELECT ci.*, p.sku, p.name_zh, p.name_en, p.price_usd, p.images
         FROM cart_items ci JOIN products p ON ci.product_id=p.id
         WHERE ci.user_id=? ORDER BY ci.added_at DESC",
        [$u['sub']]
    );
    $items = array_map(fn($i) => array_merge($i, [
        'images' => json_decode($i['images'] ?? '[]', true),
        'specs' => json_decode($i['specs'] ?? 'null', true)
    ]), $items);
    jsonOut($items);
}

if ($path === 'cart' && $method === 'POST') {
    $u = authRequired();
    $productId = (int)($b['productId'] ?? 0);
    $quantity = max(1, (int)($b['quantity'] ?? 1));
    $specs = $b['specs'] ?? '';
    if (!$productId) jsonError('productId required');
    $product = myOne("SELECT * FROM products WHERE id=? AND visibility='visible'", [$productId]);
    if (!$product) jsonError('Product not found', 404);
    $exist = myOne("SELECT * FROM cart_items WHERE user_id=? AND product_id=?", [$u['sub'], $productId]);
    if ($exist) {
        myExec("UPDATE cart_items SET quantity=quantity+? WHERE id=?", [$quantity, $exist['id']]);
    } else {
        myInsert("INSERT INTO cart_items (user_id,product_id,quantity,specs) VALUES (?,?,?,?)",
            [$u['sub'], $productId, $quantity, is_array($specs) ? json_encode($specs) : $specs]);
    }
    jsonOut(['message' => 'Added to cart']);
}

if ($parts[0] === 'cart' && is_numeric($parts[1] ?? '') && count($parts) === 2) {
    $u = authRequired();
    $id = (int)$parts[1];
    if ($method === 'PUT') {
        $quantity = max(1, (int)($b['quantity'] ?? 1));
        myExec("UPDATE cart_items SET quantity=? WHERE id=? AND user_id=?", [$quantity, $id, $u['sub']]);
        jsonOut(['message' => 'Updated']);
    }
    if ($method === 'DELETE') {
        myExec("DELETE FROM cart_items WHERE id=? AND user_id=?", [$id, $u['sub']]);
        jsonOut(['message' => 'Removed']);
    }
}

if ($path === 'cart' && $method === 'DELETE') {
    $u = authRequired();
    myExec("DELETE FROM cart_items WHERE user_id=?", [$u['sub']]);
    jsonOut(['message' => 'Cart cleared']);
}

// ========== 询价 ==========
if ($path === 'inquiries' && $method === 'POST') {
    $items = $b['items'] ?? [];
    $message = $b['message'] ?? '';
    if (!$items) jsonError('items required');
    $u = optionalAuth();
    $uid = $u['sub'] ?? 0;
    $contactName = '';
    $contactEmail = '';
    $contactPhone = '';
    if ($uid) {
        $user = myOne("SELECT * FROM users WHERE id=?", [$uid]);
        if ($user) {
            $contactName = $user['username'];
            $contactEmail = $user['email'];
            $contactPhone = $user['phone'];
        }
    }
    $itemsJson = is_array($items) ? json_encode($items) : $items;
    $inqId = myInsert(
        "INSERT INTO inquiries (user_id,items,message,contact_name,contact_email,contact_phone) VALUES (?,?,?,?,?,?)",
        [$uid, $itemsJson, $message, $contactName, $contactEmail, $contactPhone]
    );
    if ($uid) {
        myExec("DELETE FROM cart_items WHERE user_id=?", [$uid]);
    }
    jsonOut(['message' => 'Inquiry submitted', 'id' => $inqId], 201);
}

if ($path === 'inquiries' && $method === 'GET') {
    $u = authRequired();
    $items = myAllExec("SELECT * FROM inquiries WHERE user_id=? ORDER BY created_at DESC", [$u['sub']]);
    jsonOut($items);
}

// ========== 订单 ==========
if ($path === 'orders' && $method === 'POST') {
    $u = authRequired();
    $shippingAddress = $b['shipping_address'] ?? '';
    $notes = $b['notes'] ?? '';
    $itemsRaw = $b['items'] ?? null;
    $cartItems = myAllExec(
        "SELECT ci.*, p.sku, p.name_zh, p.name_en, p.price_usd FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=?",
        [$u['sub']]
    );
    if (!$cartItems) jsonError('Cart is empty');
    $orderItems = array_map(fn($ci) => [
        'productId' => (int)$ci['product_id'],
        'sku' => $ci['sku'],
        'nameZh' => $ci['name_zh'],
        'nameEn' => $ci['name_en'],
        'unitPrice' => (float)$ci['price_usd'],
        'quantity' => (int)$ci['quantity'],
        'specs' => $ci['specs'],
        'subtotal' => (float)$ci['price_usd'] * (int)$ci['quantity']
    ], $cartItems);
    $subtotal = array_sum(array_column($orderItems, 'subtotal'));
    $tax = round($subtotal * 0.1, 2);
    $shipping = $subtotal > 1000 ? 0 : 50;
    $total = round($subtotal + $tax + $shipping, 2);
    $orderNo = genOrderNo();
    $id = myInsert(
        "INSERT INTO orders (order_no,user_id,items,subtotal,shipping_cost,tax,total,shipping_address,notes) VALUES (?,?,?,?,?,?,?,?,?)",
        [$orderNo, $u['sub'], json_encode($orderItems), $subtotal, $shipping, $tax, $total, $shippingAddress, $notes]
    );
    myExec("DELETE FROM cart_items WHERE user_id=?", [$u['sub']]);
    $order = myOne("SELECT * FROM orders WHERE id=?", [$id]);
    jsonOut(array_merge($order, ['items' => json_decode($order['items'] ?? '[]', true)]), 201);
}

if ($path === 'orders' && $method === 'GET') {
    $u = authRequired();
    $page = max(1, (int)($q['page'] ?? 1));
    $pageSize = min(100, max(1, (int)($q['pageSize'] ?? 20)));
    $offset = ($page - 1) * $pageSize;
    $status = $q['status'] ?? '';
    $where = 'WHERE user_id=?';
    $params = [$u['sub']];
    if ($status) { $where .= ' AND status=?'; $params[] = $status; }
    $total = (int)(myOne("SELECT COUNT(*) as c FROM orders $where", $params)['c'] ?? 0);
    $params[] = $pageSize;
    $params[] = $offset;
    $items = myAllExec("SELECT * FROM orders $where ORDER BY created_at DESC LIMIT ? OFFSET ?", $params);
    $items = array_map(fn($o) => array_merge($o, ['items' => json_decode($o['items'] ?? '[]', true)]), $items);
    jsonOut(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'items' => $items]);
}

// ========== 管理端（需要 admin 权限） ==========
if (str_starts_with($path, 'admin/') || in_array($parts[0], ['users', 'products']) && ($q['admin'] ?? '')) {
    $u = authRequired();
    adminOnly($u);

    // ---- 用户列表 ----
    if ($path === 'users' && $method === 'GET') {
        $role = $q['role'] ?? '';
        $country = $q['country'] ?? '';
        $search = $q['search'] ?? '';
        $where = 'WHERE 1=1';
        $params = [];
        if ($role) { $where .= ' AND role=?'; $params[] = $role; }
        if ($country) { $where .= ' AND country=?'; $params[] = $country; }
        if ($search) {
            $s = "%$search%";
            $where .= ' AND (username LIKE ? OR email LIKE ? OR company LIKE ?)';
            $params = array_merge($params, [$s, $s, $s]);
        }
        $total = (int)(myOne("SELECT COUNT(*) as c FROM users $where", $params)['c'] ?? 0);
        $users = myAllExec("SELECT id,username,email,role,company,country,phone,created_at,last_login_at,is_active,company_size,annual_revenue,purchase_amount,industry,whatsapp,linkedin,notes FROM users $where ORDER BY created_at DESC", $params);
        jsonOut(['total' => $total, 'users' => $users]);
    }

    // ---- 用户更新 ----
    if ($parts[0] === 'users' && ($parts[1] ?? '') && is_numeric($parts[1]) && $method === 'PUT') {
        $id = (int)$parts[1];
        $allow = ['role','company','country','phone','is_active','company_size','annual_revenue','purchase_amount','industry','whatsapp','linkedin','notes'];
        $updates = [];
        $vals = [];
        foreach ($allow as $f) {
            if (isset($b[$f])) {
                $updates[] = "$f=?";
                $vals[] = $b[$f];
            }
        }
        if ($updates) {
            $vals[] = $id;
            myExec("UPDATE users SET " . implode(',', $updates) . " WHERE id=?", $vals);
        }
        jsonOut(['message' => 'User updated']);
    }

    // ---- 用户删除 ----
    if ($parts[0] === 'users' && ($parts[1] ?? '') && is_numeric($parts[1]) && $method === 'DELETE') {
        $id = (int)$parts[1];
        $user = myOne("SELECT role FROM users WHERE id=?", [$id]);
        if (!$user) jsonError('User not found', 404);
        if ($user['role'] === 'admin') jsonError('Cannot delete admin', 403);
        myExec("DELETE FROM users WHERE id=?", [$id]);
        jsonOut(['message' => 'User deleted']);
    }

    // ---- 产品列表（全部含草稿）----
    if ($path === 'products/admin/all' && $method === 'GET') {
        $page = max(1, (int)($q['page'] ?? 1));
        $pageSize = min(100, max(1, (int)($q['pageSize'] ?? 20)));
        $offset = ($page - 1) * $pageSize;
        $visibility = $q['visibility'] ?? 'visible';
        $status = $q['status'] ?? '';
        $search = $q['search'] ?? '';
        $brand = $q['brand'] ?? '';
        $where = 'WHERE 1=1';
        $params = [];
        if ($visibility !== 'all') { $where .= ' AND visibility=?'; $params[] = $visibility; }
        if ($status) { $where .= ' AND status=?'; $params[] = $status; }
        if ($search) {
            $s = "%$search%";
            $where .= ' AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ?)';
            $params = array_merge($params, [$s, $s, $s]);
        }
        if ($brand) { $where .= ' AND brand=?'; $params[] = $brand; }
        $total = (int)(myOne("SELECT COUNT(*) as c FROM products $where", $params)['c'] ?? 0);
        $params[] = $pageSize;
        $params[] = $offset;
        $products = myAllExec("SELECT * FROM products $where ORDER BY updated_at DESC LIMIT ? OFFSET ?", $params);
        $products = array_map(fn($p) => array_merge($p, [
            'images' => json_decode($p['images'] ?? '[]', true),
            'specs' => json_decode($p['specs'] ?? '{}', true)
        ]), $products);
        jsonOut(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'products' => $products]);
    }

    // ---- 创建产品 ----
    if ($path === 'products' && $method === 'POST') {
        $sku = $b['sku'] ?? '';
        $nameZh = $b['name_zh'] ?? '';
        if (!$sku || !$nameZh) jsonError('sku and name_zh required');
        $exist = myOne("SELECT id FROM products WHERE sku=?", [$sku]);
        if ($exist) jsonError('SKU already exists');
        $fields = [
            'sku','name_zh','name_en','short_desc_zh','short_desc_en','desc_zh','desc_en',
            'brand','tags','industries','sports','certifications','price_usd','moq',
            'lead_time_days','video_url','specs','status','visibility'
        ];
        $cols = [];
        $vals = [];
        $placeholders = [];
        foreach ($fields as $f) {
            if (isset($b[$f])) {
                $cols[] = $f;
                $vals[] = $f === 'specs' ? json_encode($b[$f]) : $b[$f];
                $placeholders[] = '?';
            }
        }
        $cols[] = 'created_by'; $vals[] = $u['sub']; $placeholders[] = '?';
        $cols[] = 'updated_by'; $vals[] = $u['sub']; $placeholders[] = '?';
        $id = myInsert("INSERT INTO products (" . implode(',', $cols) . ") VALUES (" . implode(',', $placeholders) . ")", $vals);
        $p = myOne("SELECT * FROM products WHERE id=?", [$id]);
        jsonOut(array_merge($p, [
            'images' => json_decode($p['images'] ?? '[]', true),
            'specs' => json_decode($p['specs'] ?? '{}', true)
        ]), 201);
    }

    // ---- 更新产品 ----
    if ($parts[0] === 'products' && is_numeric($parts[1] ?? '') && count($parts) === 2 && $method === 'PUT') {
        $id = (int)$parts[1];
        $p = myOne("SELECT * FROM products WHERE id=?", [$id]);
        if (!$p) jsonError('Not found', 404);
        $allow = [
            'name_zh','name_en','short_desc_zh','short_desc_en','desc_zh','desc_en',
            'tags','industries','sports','certifications','price_usd','moq','lead_time_days',
            'video_url','specs','status','visibility','meta_title','meta_desc'
        ];
        $updates = [];
        $vals = [];
        foreach ($allow as $f) {
            if (isset($b[$f])) {
                $updates[] = "$f=?";
                $vals[] = $f === 'specs' ? json_encode($b[$f]) : $b[$f];
            }
        }
        $updates[] = 'updated_by=?';
        $vals[] = $u['sub'];
        $updates[] = 'updated_at=NOW()';
        $vals[] = $id;
        if ($updates) {
            myExec("UPDATE products SET " . implode(',', $updates) . " WHERE id=?", $vals);
        }
        $updated = myOne("SELECT * FROM products WHERE id=?", [$id]);
        jsonOut(array_merge($updated, [
            'images' => json_decode($updated['images'] ?? '[]', true),
            'specs' => json_decode($updated['specs'] ?? '{}', true)
        ]));
    }

    // ---- 删除产品（软删除）----
    if ($parts[0] === 'products' && is_numeric($parts[1] ?? '') && count($parts) === 2 && $method === 'DELETE') {
        myExec("UPDATE products SET visibility='trash', updated_at=NOW() WHERE id=?", [(int)$parts[1]]);
        jsonOut(['message' => 'Moved to trash']);
    }

    // ---- 询价列表 ----
    if ($path === 'inquiries/admin/all' && $method === 'GET') {
        $page = max(1, (int)($q['page'] ?? 1));
        $pageSize = min(100, max(1, (int)($q['pageSize'] ?? 20)));
        $offset = ($page - 1) * $pageSize;
        $status = $q['status'] ?? '';
        $where = 'WHERE 1=1';
        $params = [];
        if ($status) { $where .= ' AND i.status=?'; $params[] = $status; }
        $total = (int)(myOne("SELECT COUNT(*) as c FROM inquiries i $where", $params)['c'] ?? 0);
        $params[] = $pageSize;
        $params[] = $offset;
        $items = myAllExec(
            "SELECT i.*, u.username, u.email as user_email FROM inquiries i LEFT JOIN users u ON i.user_id=u.id $where ORDER BY i.created_at DESC LIMIT ? OFFSET ?",
            $params
        );
        jsonOut(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'items' => $items]);
    }

    // ---- 询价回复 ----
    if (preg_match('#^inquiries/(\d+)/reply$#', $path, $m) && $method === 'PUT') {
        $id = (int)$m[1];
        $msg = $b['message'] ?? '';
        myExec("UPDATE inquiries SET reply_message=?, status='replied', replied_at=NOW(), replied_by=? WHERE id=?",
            [$msg, $u['sub'], $id]);
        jsonOut(['message' => 'Reply sent']);
    }

    // ---- 关闭询价 ----
    if (preg_match('#^inquiries/(\d+)/close$#', $path, $m) && $method === 'PUT') {
        myExec("UPDATE inquiries SET status='closed' WHERE id=?", [(int)$m[1]]);
        jsonOut(['message' => 'Closed']);
    }

    // ---- 订单列表 ----
    if ($path === 'orders/admin/all' && $method === 'GET') {
        $page = max(1, (int)($q['page'] ?? 1));
        $pageSize = min(100, max(1, (int)($q['pageSize'] ?? 20)));
        $offset = ($page - 1) * $pageSize;
        $status = $q['status'] ?? '';
        $where = 'WHERE 1=1';
        $params = [];
        if ($status) { $where .= ' AND o.status=?'; $params[] = $status; }
        $total = (int)(myOne("SELECT COUNT(*) as c FROM orders o $where", $params)['c'] ?? 0);
        $params[] = $pageSize;
        $params[] = $offset;
        $orders = myAllExec(
            "SELECT o.*, u.username, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id=u.id $where ORDER BY o.created_at DESC LIMIT ? OFFSET ?",
            $params
        );
        $orders = array_map(fn($o) => array_merge($o, [
            'customer_name' => $o['username'] ?? $o['email'] ?? '-',
            'items' => json_decode($o['items'] ?? '[]', true)
        ]), $orders);
        jsonOut(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'orders' => $orders]);
    }

    // ---- 订单状态更新 ----
    if (preg_match('#^orders/(\d+)/status$#', $path, $m) && $method === 'PUT') {
        $id = (int)$m[1];
        $status = $b['status'] ?? '';
        $trackingNo = $b['tracking_no'] ?? '';
        $courier = $b['courier'] ?? '';
        $updates = ['status=?', 'updated_at=NOW()'];
        $vals = [$status];
        if ($status === 'paid') $updates[] = 'paid_at=NOW()';
        if ($status === 'shipped') {
            $updates[] = 'shipped_at=NOW()';
            if ($trackingNo) { $updates[] = 'tracking_no=?'; $vals[] = $trackingNo; }
            if ($courier) { $updates[] = 'courier=?'; $vals[] = $courier; }
        }
        if ($status === 'delivered') $updates[] = 'delivered_at=NOW()';
        $vals[] = $id;
        myExec("UPDATE orders SET " . implode(',', $updates) . " WHERE id=?", $vals);
        $order = myOne("SELECT * FROM orders WHERE id=?", [$id]);
        jsonOut(array_merge($order, ['items' => json_decode($order['items'] ?? '[]', true)]));
    }

    // ---- 案例管理 ----
    if ($path === 'cases/admin/all' && $method === 'GET') {
        $cases = myAllExec("SELECT * FROM cases ORDER BY created_at DESC");
        jsonOut(['cases' => $cases]);
    }

    if ($path === 'cases' && $method === 'POST') {
        $id = myInsert(
            "INSERT INTO cases (title,title_en,category,industry,description,description_en,image_url,tags) VALUES (?,?,?,?,?,?,?,?)",
            [$b['title'] ?? '', $b['title_en'] ?? '', $b['category'] ?? '', $b['industry'] ?? '',
             $b['description'] ?? '', $b['description_en'] ?? '', $b['image_url'] ?? '', $b['tags'] ?? '']
        );
        jsonOut(['id' => $id, 'message' => 'Case created'], 201);
    }

    if (preg_match('#^cases/(\d+)$#', $path, $m) && $method === 'PUT') {
        $id = (int)$m[1];
        $allow = ['title','title_en','category','industry','description','description_en','image_url','tags','status'];
        $updates = [];
        $vals = [];
        foreach ($allow as $f) {
            if (isset($b[$f])) {
                $updates[] = "$f=?";
                $vals[] = $b[$f];
            }
        }
        if ($updates) {
            $vals[] = $id;
            myExec("UPDATE cases SET " . implode(',', $updates) . " WHERE id=?", $vals);
        }
        jsonOut(['message' => 'Case updated']);
    }

    if (preg_match('#^cases/(\d+)$#', $path, $m) && $method === 'DELETE') {
        myExec("DELETE FROM cases WHERE id=?", [(int)$m[1]]);
        jsonOut(['message' => 'Case deleted']);
    }

    // ---- 品牌授权 ----
    if ($path === 'brand-licensing/admin/all' && $method === 'GET') {
        $status = $q['status'] ?? '';
        $where = $status ? 'WHERE status=?' : '';
        $params = $status ? [$status] : [];
        $records = myAllExec("SELECT * FROM brand_licensing $where ORDER BY created_at DESC", $params);
        jsonOut(['records' => $records]);
    }

    if (preg_match('#^brand-licensing/(\d+)$#', $path, $m) && $method === 'PUT') {
        $id = (int)$m[1];
        $updates = [];
        $vals = [];
        if (isset($b['status'])) { $updates[] = 'status=?'; $vals[] = $b['status']; }
        if (isset($b['notes'])) { $updates[] = 'notes=?'; $vals[] = $b['notes']; }
        if ($updates) { $vals[] = $id; myExec("UPDATE brand_licensing SET " . implode(',', $updates) . " WHERE id=?", $vals); }
        jsonOut(['message' => 'Record updated']);
    }

    if (preg_match('#^brand-licensing/(\d+)$#', $path, $m) && $method === 'DELETE') {
        myExec("DELETE FROM brand_licensing WHERE id=?", [(int)$m[1]]);
        jsonOut(['message' => 'Record deleted']);
    }

    // ---- 订单报表 ----
    if ($path === 'orders/reports/summary' && $method === 'GET') {
        $where = 'WHERE 1=1';
        $params = [];
        if ($q['from'] ?? '') { $where .= ' AND created_at>=?'; $params[] = $q['from']; }
        if ($q['to'] ?? '') { $where .= ' AND created_at<=?'; $params[] = $q['to']; }
        $orders = myAllExec("SELECT * FROM orders $where", $params);
        $paid = array_filter($orders, fn($o) => in_array($o['status'], ['paid','processing','shipped','delivered']));
        $productCounts = [];
        foreach ($paid as $o) {
            $items = json_decode($o['items'] ?? '[]', true);
            foreach ($items as $item) {
                $sku = $item['sku'] ?? '';
                $productCounts[$sku] = ($productCounts[$sku] ?? 0) + ($item['quantity'] ?? 0);
            }
        }
        arsort($productCounts);
        $topProducts = array_slice(array_map(fn($s, $c) => ['sku' => $s, 'count' => $c], array_keys($productCounts), array_values($productCounts)), 0, 5);
        jsonOut([
            'totalOrders' => count($orders),
            'totalRevenue' => array_sum(array_column($orders, 'total')),
            'paidOrders' => count($paid),
            'pendingOrders' => count(array_filter($orders, fn($o) => $o['status'] === 'pending')),
            'shippedOrders' => count(array_filter($orders, fn($o) => in_array($o['status'], ['shipped','delivered']))),
            'avgOrderValue' => $paid ? array_sum(array_column($paid, 'total')) / count($paid) : 0,
            'topProducts' => $topProducts
        ]);
    }
}

// ========== 公开案例列表 ==========
if ($path === 'cases' && $method === 'GET') {
    $industry = $q['industry'] ?? '';
    $category = $q['category'] ?? '';
    $where = "WHERE status='active'";
    $params = [];
    if ($industry) { $where .= ' AND industry=?'; $params[] = $industry; }
    if ($category) { $where .= ' AND category=?'; $params[] = $category; }
    $cases = myAllExec("SELECT * FROM cases $where ORDER BY created_at DESC", $params);
    jsonOut($cases);
}

// ========== 品牌授权提交（公开）==========
if ($path === 'brand-licensing' && $method === 'POST') {
    myInsert(
        "INSERT INTO brand_licensing (company_name,contact_name,contact_email,contact_phone,country,licensing_type,notes) VALUES (?,?,?,?,?,?,?)",
        [
            $b['company_name'] ?? '', $b['contact_name'] ?? '', $b['contact_email'] ?? '',
            $b['contact_phone'] ?? '', $b['country'] ?? '', $b['licensing_type'] ?? '', $b['notes'] ?? ''
        ]
    );
    jsonOut(['message' => 'Application submitted'], 201);
}

// ========== 404 ==========
jsonError('Endpoint not found', 404);
