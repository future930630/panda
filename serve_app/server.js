/**
 * PandaShield B2B E-commerce API Server
 * Node.js + Express + MySQL + JWT
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

// ============ Config ============
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'PandaShieldSecretKey2026VeryLongAndSecure123!';
const JWT_ISSUER = 'PandaShield';
const JWT_AUDIENCE = 'PandaShieldClient';
const JWT_EXPIRY = '30d';
const ROOT_DIR = path.join(__dirname, '..');
const UPLOAD_DIR = path.join(__dirname, 'wwwroot', 'uploads', 'products');

// ============ MySQL Config ============
// 填入你的 MySQL 连接信息
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234567890',
  database: process.env.DB_NAME || 'pandashield',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,       // 连接超时 30 秒
  idleTimeout: 60000,           // 空闲超时 60 秒回收
  maxIdle: 5,                   // 最多保持 5 个空闲连接
};

let pool;
let pingInterval;

// ============ App Setup ============
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (serve all HTML from root)
app.use(express.static(ROOT_DIR));
// Serve wwwroot dir (api.js lives here)
app.use('/serve_app/wwwroot', express.static(path.join(__dirname, 'wwwroot')));

// Ensure upload dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ============ File Upload ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ============ Database (MySQL) ============

async function initDatabase() {
  // Create connection pool
  pool = mysql.createPool(DB_CONFIG);

  // Test connection
  await pool.query('SELECT 1');
  console.log('✓ MySQL connected:', DB_CONFIG.database);

  // 监听连接错误，防止整个 pool 崩溃
  pool.on('error', function(err) {
    console.error('❌ MySQL pool error:', err.message);
  });

  // 每 30 秒 ping 一次，保持连接活跃，防止 MySQL 端超时断开
  pingInterval = setInterval(async function() {
    try {
      await pool.query('SELECT 1');
    } catch(e) {
      console.error('❌ MySQL ping failed:', e.message);
    }
  }, 30000);

  // Create tables
  await runSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'customer',
      company TEXT,
      country VARCHAR(100),
      phone VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME,
      is_active INT DEFAULT 1,
      company_size VARCHAR(255) DEFAULT '',
      annual_revenue VARCHAR(255) DEFAULT '',
      purchase_amount VARCHAR(255) DEFAULT '',
      industry VARCHAR(255) DEFAULT '',
      whatsapp VARCHAR(255) DEFAULT '',
      linkedin VARCHAR(255) DEFAULT '',
      notes TEXT,
      contact_person VARCHAR(255) DEFAULT '',
      contact_title VARCHAR(255) DEFAULT '',
      contact_mobile VARCHAR(255) DEFAULT '',
      city VARCHAR(255) DEFAULT '',
      profile_complete INT DEFAULT 0
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS cases (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT NOT NULL,
      title_en VARCHAR(255) DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      industry VARCHAR(100) DEFAULT '',
      description TEXT,
      description_en TEXT,
      image_url VARCHAR(500) DEFAULT '',
      tags VARCHAR(500) DEFAULT '',
      status VARCHAR(50) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS brand_licensing (
      id INT PRIMARY KEY AUTO_INCREMENT,
      company_name VARCHAR(255) DEFAULT '',
      contact_name VARCHAR(255) DEFAULT '',
      contact_email VARCHAR(255) DEFAULT '',
      contact_phone VARCHAR(100) DEFAULT '',
      country VARCHAR(100) DEFAULT '',
      licensing_type VARCHAR(100) DEFAULT '',
      status VARCHAR(50) DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      sku VARCHAR(255) UNIQUE NOT NULL,
      name_zh TEXT NOT NULL,
      name_en VARCHAR(500) DEFAULT '',
      short_desc_zh VARCHAR(500) DEFAULT '',
      short_desc_en VARCHAR(500) DEFAULT '',
      desc_zh TEXT,
      desc_en TEXT,
      brand VARCHAR(100) DEFAULT 'panda-shield',
      tags VARCHAR(500) DEFAULT '',
      industries VARCHAR(500) DEFAULT '',
      sports VARCHAR(500) DEFAULT '',
      certifications VARCHAR(500) DEFAULT '',
      price_usd REAL DEFAULT 0,
      moq INT DEFAULT 50,
      lead_time_days INT DEFAULT 7,
      images TEXT,
      video_url VARCHAR(500) DEFAULT '',
      specs TEXT,
      status VARCHAR(50) DEFAULT 'active',
      visibility VARCHAR(50) DEFAULT 'visible',
      meta_title VARCHAR(255) DEFAULT '',
      meta_desc VARCHAR(500) DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_by INT,
      updated_by INT
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      specs TEXT,
      message TEXT,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_cart (user_id, product_id)
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT DEFAULT 0,
      items TEXT NOT NULL,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      reply_message TEXT,
      replied_at DATETIME,
      replied_by INT,
      contact_name VARCHAR(255) DEFAULT '',
      contact_email VARCHAR(255) DEFAULT '',
      contact_phone VARCHAR(100) DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_no VARCHAR(100) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL DEFAULT 0,
      shipping_cost REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL DEFAULT 0,
      currency VARCHAR(20) DEFAULT 'USD',
      status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(100) DEFAULT '',
      payment_id VARCHAR(255) DEFAULT '',
      paid_at DATETIME,
      shipping_address TEXT,
      tracking_no VARCHAR(255) DEFAULT '',
      courier VARCHAR(100) DEFAULT '',
      shipped_at DATETIME,
      delivered_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Seed admin
  const admin = await queryOne(`SELECT id FROM users WHERE role='admin' LIMIT 1`);
  if (!admin) {
    const hash = bcrypt.hashSync('admin123!', 10);
    await runSql(`INSERT INTO users (username, email, password_hash, role, company, country, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['admin', 'admin@pandashield.com', hash, 'admin', 'PandaShield Inc.', 'China', '+86-000-0000-0000']
    );
    console.log('✓ Admin account created: admin@pandashield.com / admin123!');
  }

  // Seed demo products (only if none exist)
  const prodCount = await queryOne(`SELECT COUNT(*) as c FROM products`);
  if (!prodCount || prodCount.c === 0) {
    const seedProducts = [
      ['SHIELD-CUT5', '防切割手套 SE', 'Cut-Resistant Gloves SE', '高强度 HPPE 防切割内衬，渗透测试达 EN 388 Level 5', 'HPPE lining, EN 388 Level 5 cut resistance', 'panda-shield', '防切割,工业,制造', '制造业,建筑,物流', '骑行,攀岩,射击', 'EN388,CE,ISO9001', 12.50, 100, 7],
      ['IMPACT-GRIP', '防撞防滑手套 PR', 'Impact-Resistant Grip Gloves PR', 'TPR 关节防撞设计，硅胶防滑掌面，适合重载搬运', 'TPR impact guards, silicone grip palm, heavy-duty handling', 'panda-impact', '防撞,防滑,重载', '制造业,物流,建筑', '健身,射击,潜水', 'EN388,CE,ANSI107', 18.00, 50, 10],
      ['CHEM-NITRILE-B', '耐油耐化学手套 NC', 'Nitrile Chemical Gloves NC', '加厚丁腈涂层，抗油污、抗弱酸碱，适合石油化工', 'Heavy nitrile coating, oil & mild chemical resistance', 'panda-chem', '耐油,耐化学,化工', '石油化工,食品加工,农业', '', 'EN374,CE,SGS', 9.80, 200, 5],
      ['HEAT-WELD-350', '耐高温焊接手套 HT', 'Heat-Resistant Welding Gloves HT', '牛皮外层 + 芳纶隔热层，最高耐温 350°C，适合焊接场景', 'Split leather outer, aramid lining, 350°C rated', 'panda-heat', '耐高温,焊接,耐热', '冶金,焊接,制造', '', 'EN407,CE,ISO9001', 22.00, 50, 14],
      ['SHIELD-PUNCT-A4', '防穿刺手套 PU', 'Puncture-Resistant Gloves PU', '聚氨酯涂层 + 芳纶防穿刺层，ANSI A4 等级，保护指尖', 'PU coated, aramid puncture layer, ANSI A4 rated', 'panda-shield', '防穿刺,防切割,工业', '制造业,建筑,物流,农业', '骑行,钓鱼,攀岩', 'ANSI107,EN388,CE', 14.50, 80, 7],
      ['BIO-MED-GL', '医疗防护手套 MP', 'Medical Examination Gloves MP', '一次性丁腈无粉手套，医疗级 FDA 认证，敏肌友好', 'Disposable nitrile, powder-free, FDA medical grade', 'panda-bio', '医疗,防护,一次性', '医疗,实验室,食品', '', 'EN455,FDA,CE', 6.20, 500, 3],
      ['ECO-REBEL-GR', '可降解再生手套 RG', 'Eco Recycled Gloves RG', '60% 再生纱线，生物可降解，适合轻载与户外运动', '60% recycled yarn, biodegradable, eco-friendly', 'panda-eco', '环保,再生,轻载', '物流,农业,户外', '骑行,健身,钓鱼,马术', 'OEKO-TEX,CE', 8.90, 120, 7],
      ['VOLT-INSUL-00', '电绝缘手套 EL', 'Electrical Insulation Gloves EL', 'Class 00 绝缘等级，天然橡胶内层，最高 AC 500V', 'Class 00 rated, natural rubber, AC 500V max', 'panda-volt', '绝缘,电工,电力', '电力,电子,通讯', '', 'EN60903,CE,IEC', 35.00, 30, 14],
      ['FROST-COLD-30', '防寒保暖手套 CF', 'Cold-Resistant Gloves CF', '3M Thinsulate 保温层，耐低温 -30°C，防水透湿', '3M Thinsulate, -30°C rated, waterproof & breathable', 'panda-frost', '防寒,保暖,防水', '冷链,农业,户外,物流', '滑雪,钓鱼,潜水', 'EN511,CE', 28.00, 40, 10],
      ['SHIELD-GRIP-Pro', '通用防滑手套 GP', 'General Grip Gloves GP', '尼龙弹力内衬 + 超细丁腈发泡掌面，透气灵巧，适合精密装配', 'Nylon stretch liner, micro-foam nitrile palm, precision work', 'panda-shield', '防滑,透气,精密', '制造业,电子,物流', '健身,骑行', 'EN388,CE', 7.50, 200, 5],
    ];

    for (const p of seedProducts) {
      await runSql(`INSERT INTO products (sku, name_zh, name_en, short_desc_zh, short_desc_en, brand, tags, industries, sports, certifications, price_usd, moq, lead_time_days, status, visibility)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'active','visible')`, p);
    }
    console.log(`✓ ${seedProducts.length} demo products seeded`);
  }

  console.log('✓ Database tables ready');
}

// ============ Auth Middleware ============
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(auth.slice(7), JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
    } catch (e) {}
  }
  next();
}

// ============ Helpers ============
function generateOrderNo() {
  const ts = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
  return `PS${ts}${Math.floor(1000 + Math.random() * 9000)}`;
}

function rowToObj(columns, values) {
  const obj = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}

async function queryOne(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function queryAll(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function runSql(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

// ============ Routes ============

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Root redirect
app.get('/', (req, res) => res.redirect('/index.html'));

// ----- Auth -----
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, company, country, phone } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, password required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await queryOne(`SELECT id FROM users WHERE email=? OR username=?`, [email, username]);
  if (existing) {
    return res.status(400).json({ error: 'Email or username already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  await runSql(`INSERT INTO users (username, email, password_hash, company, country, phone)
          VALUES (?,?,?,?,?,?)`,
    [username, email, hash, company || '', country || '', phone || '']);

  const user = await queryOne(`SELECT * FROM users WHERE email=?`, [email]);
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.username, role: user.role },
    JWT_SECRET, { expiresIn: JWT_EXPIRY, issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
  );

  res.json({ token, user: { id: user.id, username, email, role: user.role, company, country, phone, created_at: user.created_at, profile_complete: 0 } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await queryOne(`SELECT * FROM users WHERE email=? AND is_active=1`, [email]);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  await runSql(`UPDATE users SET last_login_at=NOW() WHERE id=?`, [user.id]);

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.username, role: user.role },
    JWT_SECRET, { expiresIn: JWT_EXPIRY, issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
  );

  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, company: user.company, country: user.country, phone: user.phone, created_at: user.created_at, profile_complete: user.profile_complete || 0 } });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await queryOne(`SELECT * FROM users WHERE id=?`, [req.user.sub]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role, company: user.company, country: user.country, phone: user.phone, created_at: user.created_at, industry: user.industry, company_size: user.company_size, contact_person: user.contact_person, contact_title: user.contact_title, contact_mobile: user.contact_mobile, city: user.city, profile_complete: user.profile_complete || 0 });
});

// ----- 客户自助更新资料 -----
app.put('/api/users/me/profile', authMiddleware, async (req, res) => {
  const { company, industry, company_size, contact_person, contact_title, contact_mobile, city } = req.body;
  const updates = [];
  const vals = [];
  if (company !== undefined)        { updates.push('company=?');        vals.push(company); }
  if (industry !== undefined)       { updates.push('industry=?');       vals.push(industry); }
  if (company_size !== undefined)   { updates.push('company_size=?');   vals.push(company_size); }
  if (contact_person !== undefined) { updates.push('contact_person=?'); vals.push(contact_person); }
  if (contact_title !== undefined)  { updates.push('contact_title=?');  vals.push(contact_title); }
  if (contact_mobile !== undefined) { updates.push('contact_mobile=?'); vals.push(contact_mobile); }
  if (city !== undefined)           { updates.push('city=?');           vals.push(city); }
  // 标记资料已补充完整
  updates.push('profile_complete=1');
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  await runSql(`UPDATE users SET ${updates.join(',')} WHERE id=?`, [...vals, req.user.sub]);
  res.json({ message: 'Profile updated', profile_complete: 1 });
});

// ----- 客户查询自身历史记录 -----
app.get('/api/users/me/history', authMiddleware, async (req, res) => {
  const uid = req.user.sub;
  // 询盘记录（inquiries 表字段：id, items, message, status, created_at, contact_name, contact_email, contact_phone）
  const inquiries = await queryAll(`SELECT id, items, message, status, created_at, contact_name, contact_email, contact_phone FROM inquiries WHERE user_id=? ORDER BY created_at DESC LIMIT 50`, [uid]);
  // 订单记录（orders 表字段：id, total, subtotal, shipping_cost, tax, status, created_at）
  const orders = await queryAll(`SELECT id, total, subtotal, shipping_cost, tax, status, created_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 50`, [uid]);
  res.json({ inquiries, orders, browsing: [], footprints: [] });
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await queryOne(`SELECT * FROM users WHERE id=?`, [req.user.sub]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await runSql(`UPDATE users SET password_hash=? WHERE id=?`, [hash, user.id]);
  res.json({ message: 'Password changed' });
});

// ----- Users (admin) -----
app.get('/api/users', authMiddleware, adminOnly, async (req, res) => {
  const { role, country, search } = req.query;
  let sql = `SELECT id, username, email, role, company, country, phone, created_at, last_login_at, is_active,
    company_size, annual_revenue, purchase_amount, industry, whatsapp, linkedin, notes FROM users WHERE 1=1`;
  let countSql = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (role) { sql += ` AND role=?`; params.push(role); countSql += ` AND role=?`; countParams.push(role); }
  if (country) { sql += ` AND country=?`; params.push(country); countSql += ` AND country=?`; countParams.push(country); }
  if (search) { sql += ` AND (username LIKE ? OR email LIKE ? OR company LIKE ?)`; const s = `%${search}%`; params.push(s, s, s); countSql += ` AND (username LIKE ? OR email LIKE ? OR company LIKE ?)`; countParams.push(s, s, s); }

  sql += ` ORDER BY created_at DESC`;
  const users = await queryAll(sql, params);
  const { total } = await queryOne(countSql, countParams) || { total: 0 };
  res.json({ total, users });
});

app.put('/api/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const { role, company, country, phone, is_active,
    company_size, annual_revenue, purchase_amount, industry, whatsapp, linkedin, notes } = req.body;
  const updates = [];
  const vals = [];
  if (role !== undefined) { updates.push('role=?'); vals.push(role); }
  if (company !== undefined) { updates.push('company=?'); vals.push(company); }
  if (country !== undefined) { updates.push('country=?'); vals.push(country); }
  if (phone !== undefined) { updates.push('phone=?'); vals.push(phone); }
  if (is_active !== undefined) { updates.push('is_active=?'); vals.push(is_active ? 1 : 0); }
  if (company_size !== undefined) { updates.push('company_size=?'); vals.push(company_size); }
  if (annual_revenue !== undefined) { updates.push('annual_revenue=?'); vals.push(annual_revenue); }
  if (purchase_amount !== undefined) { updates.push('purchase_amount=?'); vals.push(purchase_amount); }
  if (industry !== undefined) { updates.push('industry=?'); vals.push(industry); }
  if (whatsapp !== undefined) { updates.push('whatsapp=?'); vals.push(whatsapp); }
  if (linkedin !== undefined) { updates.push('linkedin=?'); vals.push(linkedin); }
  if (notes !== undefined) { updates.push('notes=?'); vals.push(notes); }
  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
  vals.push(req.params.id);
  await runSql(`UPDATE users SET ${updates.join(', ')} WHERE id=?`, vals);

  res.json({ message: 'User updated' });
});

app.delete('/api/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const user = await queryOne(`SELECT role FROM users WHERE id=?`, [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
  await runSql(`DELETE FROM users WHERE id=?`, [req.params.id]);

  res.json({ message: 'User deleted' });
});

// ----- Cases -----
app.get('/api/cases', optionalAuth, async (req, res) => {
  const { industry, category, status } = req.query;
  let sql = `SELECT * FROM cases WHERE status='active'`;
  const params = [];
  if (industry) { sql += ` AND industry=?`; params.push(industry); }
  if (category) { sql += ` AND category=?`; params.push(category); }
  if (status) { sql += ` AND status=?`; params.push(status); }
  sql += ` ORDER BY created_at DESC`;
  const cases = await queryAll(sql, params);
  res.json(cases);
});

app.get('/api/cases/admin/all', authMiddleware, adminOnly, async (req, res) => {
  const cases = await queryAll(`SELECT * FROM cases ORDER BY created_at DESC`);
  res.json({ cases });
});

app.post('/api/cases', authMiddleware, adminOnly, async (req, res) => {
  const { title, title_en, category, industry, description, description_en, image_url, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const result = await runSql(`INSERT INTO cases (title, title_en, category, industry, description, description_en, image_url, tags) VALUES (?,?,?,?,?,?,?,?)`,
    [title, title_en || '', category || '', industry || '', description || '', description_en || '', image_url || '', tags || '']);

  res.json({ id: result.insertId, message: 'Case created' });
});

app.put('/api/cases/:id', authMiddleware, adminOnly, async (req, res) => {
  const { title, title_en, category, industry, description, description_en, image_url, tags, status } = req.body;
  const fields = ['title', 'title_en', 'category', 'industry', 'description', 'description_en', 'image_url', 'tags', 'status'];
  const vals = [title, title_en, category, industry, description, description_en, image_url, tags, status].filter(v => v !== undefined);
  const setStr = fields.filter((f, i) => [title, title_en, category, industry, description, description_en, image_url, tags, status][i] !== undefined).map(f => f + '=?').join(', ');
  if (!setStr) return res.status(400).json({ error: 'No fields to update' });
  await runSql(`UPDATE cases SET ${setStr} WHERE id=?`, vals.concat([req.params.id]));

  res.json({ message: 'Case updated' });
});

app.delete('/api/cases/:id', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`DELETE FROM cases WHERE id=?`, [parseInt(req.params.id)]);

  res.json({ message: 'Case deleted' });
});

// ----- Brand Licensing -----
app.get('/api/brand-licensing/admin/all', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.query;
  let sql = `SELECT * FROM brand_licensing WHERE 1=1`;
  const params = [];
  if (status) { sql += ` AND status=?`; params.push(status); }
  sql += ` ORDER BY created_at DESC`;
  const records = await queryAll(sql, params);
  res.json({ records });
});

app.post('/api/brand-licensing', async (req, res) => {
  const { company_name, contact_name, contact_email, contact_phone, country, licensing_type, notes } = req.body;
  await runSql(`INSERT INTO brand_licensing (company_name, contact_name, contact_email, contact_phone, country, licensing_type, notes) VALUES (?,?,?,?,?,?,?)`,
    [company_name || '', contact_name || '', contact_email || '', contact_phone || '', country || '', licensing_type || '', notes || '']);

  res.json({ message: 'Application submitted' });
});

app.put('/api/brand-licensing/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status, notes } = req.body;
  const updates = [];
  const vals = [];
  if (status !== undefined) { updates.push('status=?'); vals.push(status); }
  if (notes !== undefined) { updates.push('notes=?'); vals.push(notes); }
  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
  vals.push(req.params.id);
  await runSql(`UPDATE brand_licensing SET ${updates.join(', ')} WHERE id=?`, vals);

  res.json({ message: 'Brand licensing record updated' });
});

app.delete('/api/brand-licensing/:id', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`DELETE FROM brand_licensing WHERE id=?`, [parseInt(req.params.id)]);

  res.json({ message: 'Brand licensing record deleted' });
});

// ----- Brand Config Management -----
const BRANDS_FILE = path.join(ROOT_DIR, 'brands-config.json');

function loadBrandsConfig() {
  try {
    const raw = fs.readFileSync(BRANDS_FILE, 'utf8');
    const data = JSON.parse(raw);
    // brands-config.json 是扁平结构 { "shd": {...}, "heat": {...} }
    // API 统一返回 { "brands": {...} } 格式
    if (!data.brands) {
      // 如果没有 brands 外层，说明文件就是扁平结构
      return { brands: data };
    }
    return data;
  } catch (e) {
    return { brands: {} };
  }
}

function saveBrandsConfig(data) {
  // brands-config.json 使用扁平结构 { "shd": {...}, "heat": {...} }
  const flatData = data.brands || data;
  fs.writeFileSync(BRANDS_FILE, JSON.stringify(flatData, null, 2), 'utf8');
}

// GET /api/brands - 返回所有品牌列表
app.get('/api/brands', async (req, res) => {
  try {
    const data = loadBrandsConfig();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load brands' });
  }
});

// GET /api/brands/:id - 返回单个品牌
app.get('/api/brands/:id', async (req, res) => {
  try {
    const data = loadBrandsConfig();
    const brand = data.brands[req.params.id];
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load brand' });
  }
});

// PUT /api/brands/:id - 更新品牌配置（允许所有字段）
app.put('/api/brands/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const data = loadBrandsConfig();
    const brandId = req.params.id;
    if (!data.brands[brandId]) return res.status(404).json({ error: 'Brand not found' });
    // 允许更新 brands-config.json 中的所有字段
    const brandFields = ['id','name','code','tagline','heroAccent','heroGlow','meta','breadcrumb','hero','intro','specs','variants','industries','cta'];
    brandFields.forEach(key => {
      if (req.body[key] !== undefined) data.brands[brandId][key] = req.body[key];
    });
    saveBrandsConfig(data);
    res.json({ message: 'Brand updated successfully', brand: data.brands[brandId] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

// ----- Products -----
app.get('/api/products', optionalAuth, async (req, res) => {
  const { page = 1, pageSize = 20, brand, search, tag, industry, sport, sort } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  let sql = `SELECT * FROM products WHERE visibility='visible' AND status='active'`;
  let countSql = `SELECT COUNT(*) as total FROM products WHERE visibility='visible' AND status='active'`;
  const params = [];
  const countParams = [];

  if (brand) { sql += ` AND brand=?`; params.push(brand); countParams.push(brand); }
  if (tag) { sql += ` AND tags LIKE ?`; params.push(`%${tag}%`); countParams.push(`%${tag}%`); }
  if (industry) { sql += ` AND industries LIKE ?`; params.push(`%${industry}%`); countParams.push(`%${industry}%`); }
  if (sport) { sql += ` AND sports LIKE ?`; params.push(`%${sport}%`); countParams.push(`%${sport}%`); }
  if (search) {
    sql += ` AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ? OR short_desc_zh LIKE ? OR short_desc_en LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
    countSql += ` AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ? OR short_desc_zh LIKE ? OR short_desc_en LIKE ?)`;
    countParams.push(s, s, s, s, s);
  }

  const sortMap = { 'price-asc': 'price_usd ASC', 'price-desc': 'price_usd DESC', 'newest': 'created_at DESC' };
  sql += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize), offset);

  const items = await queryAll(sql, params).map(p => ({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') }));
  const { total } = await queryOne(countSql, countParams) || { total: 0 };

  res.json({ total, page: parseInt(page), pageSize: parseInt(pageSize), items });
});

app.get('/api/products/:id', optionalAuth, async (req, res) => {
  const p = await queryOne(`SELECT * FROM products WHERE id=?`, [parseInt(req.params.id)]);
  if (!p || (p.visibility === 'trash' && req.user?.role !== 'admin')) return res.status(404).json({ error: 'Not found' });
  res.json({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') });
});

app.get('/api/products/sku/:sku', optionalAuth, async (req, res) => {
  const p = await queryOne(`SELECT * FROM products WHERE sku=?`, [req.params.sku]);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') });
});

// Admin: create
app.post('/api/products', authMiddleware, adminOnly, async (req, res) => {
  const { sku, name_zh, name_en = '', short_desc_zh = '', short_desc_en = '', desc_zh = '', desc_en = '',
    brand = 'panda-shield', tags = '', industries = '', sports = '', certifications = '',
    price_usd = 0, moq = 50, lead_time_days = 7, video_url = '', specs = {},
    status = 'draft', visibility = 'visible' } = req.body;

  if (!sku || !name_zh) return res.status(400).json({ error: 'sku and name_zh required' });

  const existing = await queryOne(`SELECT id FROM products WHERE sku=?`, [sku]);
  if (existing) return res.status(400).json({ error: 'SKU already exists' });

  await runSql(`INSERT INTO products (sku, name_zh, name_en, short_desc_zh, short_desc_en, desc_zh, desc_en,
    brand, tags, industries, sports, certifications, price_usd, moq, lead_time_days, video_url, specs, status, visibility, created_by, updated_by)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [sku, name_zh, name_en, short_desc_zh, short_desc_en, desc_zh, desc_en,
     brand, tags, industries, sports, certifications, price_usd, moq, lead_time_days, video_url,
     JSON.stringify(specs), status, visibility, req.user.sub, req.user.sub]);


  const p = await queryOne(`SELECT * FROM products WHERE sku=?`, [sku]);
  res.status(201).json({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') });
});

// Admin: update
app.put('/api/products/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name_zh, name_en, short_desc_zh, short_desc_en, desc_zh, desc_en,
    tags, industries, sports, certifications, price_usd, moq, lead_time_days,
    video_url, specs, status, visibility, meta_title, meta_desc } = req.body;

  const p = await queryOne(`SELECT * FROM products WHERE id=?`, [parseInt(req.params.id)]);
  if (!p) return res.status(404).json({ error: 'Not found' });

  const updates = [];
  const vals = [];
  const add = (k, v) => { updates.push(`${k}=?`); vals.push(v); };

  if (name_zh !== undefined) add('name_zh', name_zh);
  if (name_en !== undefined) add('name_en', name_en);
  if (short_desc_zh !== undefined) add('short_desc_zh', short_desc_zh);
  if (short_desc_en !== undefined) add('short_desc_en', short_desc_en);
  if (desc_zh !== undefined) add('desc_zh', desc_zh);
  if (desc_en !== undefined) add('desc_en', desc_en);
  if (tags !== undefined) add('tags', tags);
  if (industries !== undefined) add('industries', industries);
  if (sports !== undefined) add('sports', sports);
  if (certifications !== undefined) add('certifications', certifications);
  if (price_usd !== undefined) add('price_usd', price_usd);
  if (moq !== undefined) add('moq', moq);
  if (lead_time_days !== undefined) add('lead_time_days', lead_time_days);
  if (video_url !== undefined) add('video_url', video_url);
  if (specs !== undefined) add('specs', JSON.stringify(specs));
  if (status !== undefined) add('status', status);
  if (visibility !== undefined) add('visibility', visibility);
  if (meta_title !== undefined) add('meta_title', meta_title);
  if (meta_desc !== undefined) add('meta_desc', meta_desc);

  updates.push(`updated_at=NOW()`);
  updates.push(`updated_by=?`);
  vals.push(req.user.sub);
  vals.push(parseInt(req.params.id));

  await runSql(`UPDATE products SET ${updates.join(',')} WHERE id=?`, vals);


  const updated = await queryOne(`SELECT * FROM products WHERE id=?`, [parseInt(req.params.id)]);
  res.json({ ...updated, images: JSON.parse(updated.images || '[]'), specs: JSON.parse(updated.specs || '{}') });
});

// Admin: soft delete (trash)
app.delete('/api/products/:id', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`UPDATE products SET visibility='trash', updated_at=NOW() WHERE id=?`, [parseInt(req.params.id)]);

  res.json({ message: 'Moved to trash' });
});

// Admin: upload images
app.post('/api/products/:id/images', authMiddleware, adminOnly, upload.array('files', 10), async (req, res) => {
  const p = await queryOne(`SELECT images FROM products WHERE id=?`, [parseInt(req.params.id)]);
  if (!p) return res.status(404).json({ error: 'Not found' });

  let images = [];
  try { images = JSON.parse(p.images || '[]'); } catch {}

  req.files.forEach(f => {
    images.push(`/uploads/products/${f.filename}`);
  });

  await runSql(`UPDATE products SET images=?, updated_at=NOW() WHERE id=?`,
    [JSON.stringify(images), parseInt(req.params.id)]);


  res.json({ images });
});

// Admin: list all (including draft/trash)
app.get('/api/products/admin/all', authMiddleware, adminOnly, async (req, res) => {
  const { page = 1, pageSize = 20, visibility = 'visible', status, search, brand } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  let sql = `SELECT * FROM products WHERE 1=1`;
  let countSql = `SELECT COUNT(*) as total FROM products WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (visibility !== 'all') {
    sql += ` AND visibility=?`;
    countSql += ` AND visibility=?`;
    params.push(visibility);
    countParams.push(visibility);
  }
  if (status) { sql += ` AND status=?`; params.push(status); countSql += ` AND status=?`; countParams.push(status); }
  if (search) {
    sql += ` AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ?)`;
    countSql += ` AND (sku LIKE ? OR name_zh LIKE ? OR name_en LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
    countParams.push(s, s, s);
  }
  if (brand) { sql += ` AND brand=?`; countSql += ` AND brand=?`; params.push(brand); countParams.push(brand); }

  sql += ` ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize), offset);

  const products = await queryAll(sql, params).map(p => ({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') }));
  const { total } = await queryOne(countSql, countParams) || { total: 0 };

  res.json({ total, page: parseInt(page), pageSize: parseInt(pageSize), products });
});

// Admin: permanent delete
app.delete('/api/products/admin/permanent/:id', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`DELETE FROM products WHERE id=?`, [parseInt(req.params.id)]);

  res.json({ message: 'Permanently deleted' });
});

// Admin: restore from trash
app.post('/api/products/admin/restore/:id', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`UPDATE products SET visibility='visible', updated_at=NOW() WHERE id=?`, [parseInt(req.params.id)]);

  const p = await queryOne(`SELECT * FROM products WHERE id=?`, [parseInt(req.params.id)]);
  res.json({ ...p, images: JSON.parse(p.images || '[]'), specs: JSON.parse(p.specs || '{}') });
});

// ----- Cart -----
app.get('/api/cart', authMiddleware, async (req, res) => {
  const items = await queryAll(`SELECT ci.*, p.sku, p.name_zh, p.name_en, p.price_usd, p.images
    FROM cart_items ci JOIN products p ON ci.product_id=p.id
    WHERE ci.user_id=? ORDER BY ci.added_at DESC`, [req.user.sub]);
  res.json(items.map(i => ({
    ...i, images: JSON.parse(i.images || '[]'),
    specs: i.specs ? JSON.parse(i.specs) : null
  })));
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { productId, quantity = 1, specs = '' } = req.body;
  const product = await queryOne(`SELECT * FROM products WHERE id=? AND visibility='visible'`, [productId]);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = await queryOne(`SELECT * FROM cart_items WHERE user_id=? AND product_id=?`, [req.user.sub, productId]);
  if (existing) {
    await runSql(`UPDATE cart_items SET quantity=quantity+? WHERE id=?`, [quantity, existing.id]);
  } else {
    await runSql(`INSERT INTO cart_items (user_id, product_id, quantity, specs) VALUES (?,?,?,?)`,
      [req.user.sub, productId, quantity, JSON.stringify(specs)]);
  }

  res.json({ message: 'Added to cart' });
});

app.put('/api/cart/:id', authMiddleware, async (req, res) => {
  const { quantity } = req.body;
  await runSql(`UPDATE cart_items SET quantity=? WHERE id=? AND user_id=?`, [quantity, parseInt(req.params.id), req.user.sub]);

  res.json({ message: 'Updated' });
});

app.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  await runSql(`DELETE FROM cart_items WHERE id=? AND user_id=?`, [parseInt(req.params.id), req.user.sub]);

  res.json({ message: 'Removed' });
});

app.delete('/api/cart', authMiddleware, async (req, res) => {
  await runSql(`DELETE FROM cart_items WHERE user_id=?`, [req.user.sub]);

  res.json({ message: 'Cart cleared' });
});

// ----- Inquiries -----
app.post('/api/inquiries', optionalAuth, async (req, res) => {
  const { items, message } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'items required' });

  const userId = req.user?.sub || 0;
  const user = userId ? await queryOne(`SELECT * FROM users WHERE id=?`, [userId]) : null;

  await runSql(`INSERT INTO inquiries (user_id, items, message, contact_name, contact_email, contact_phone)
    VALUES (?,?,?,?,?,?)`,
    [userId, JSON.stringify(items), message || '',
     user?.username || '', user?.email || '', user?.phone || '']);

  // Clear cart after inquiry
  if (userId) {
    await runSql(`DELETE FROM cart_items WHERE user_id=?`, [userId]);

  }

  res.json({ message: 'Inquiry submitted' });
});

app.get('/api/inquiries', authMiddleware, async (req, res) => {
  const items = await queryAll(`SELECT * FROM inquiries WHERE user_id=? ORDER BY created_at DESC`, [req.user.sub]);
  res.json(items);
});

// Admin: all inquiries
app.get('/api/inquiries/admin/all', authMiddleware, adminOnly, async (req, res) => {
  const { status, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  let sql = `SELECT i.*, u.username, u.email as user_email FROM inquiries i
    LEFT JOIN users u ON i.user_id=u.id WHERE 1=1`;
  let countSql = `SELECT COUNT(*) as total FROM inquiries WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (status) { sql += ` AND i.status=?`; params.push(status); countSql += ` AND status=?`; countParams.push(status); }
  sql += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize), offset);

  const items = await queryAll(sql, params);
  const { total } = await queryOne(countSql, countParams) || { total: 0 };
  res.json({ total, page: parseInt(page), pageSize: parseInt(pageSize), items });
});

app.put('/api/inquiries/:id/reply', authMiddleware, adminOnly, async (req, res) => {
  const { message } = req.body;
  await runSql(`UPDATE inquiries SET reply_message=?, status='replied', replied_at=NOW(), replied_by=? WHERE id=?`,
    [message, req.user.sub, parseInt(req.params.id)]);

  res.json({ message: 'Reply sent' });
});

app.put('/api/inquiries/:id/close', authMiddleware, adminOnly, async (req, res) => {
  await runSql(`UPDATE inquiries SET status='closed' WHERE id=?`, [parseInt(req.params.id)]);

  res.json({ message: 'Closed' });
});

// ----- Orders -----
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, shipping_address, notes } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'items required' });

  // Resolve items from cart
  const cartItems = await queryAll(`SELECT ci.*, p.sku, p.name_zh, p.name_en, p.price_usd
    FROM cart_items ci JOIN products p ON ci.product_id=p.id
    WHERE ci.user_id=?`, [req.user.sub]);

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  const orderItems = cartItems.map(ci => ({
    productId: ci.product_id,
    sku: ci.sku,
    nameZh: ci.name_zh,
    nameEn: ci.name_en,
    unitPrice: ci.price_usd,
    quantity: ci.quantity,
    specs: ci.specs,
    subtotal: ci.price_usd * ci.quantity
  }));

  const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;
  const orderNo = generateOrderNo();

  await runSql(`INSERT INTO orders (order_no, user_id, items, subtotal, shipping_cost, tax, total, shipping_address, notes)
    VALUES (?,?,?,?,?,?,?,?,?)`,
    [orderNo, req.user.sub, JSON.stringify(orderItems), subtotal, shipping, tax, total, shipping_address || '', notes || '']);


  const order = await queryOne(`SELECT * FROM orders WHERE order_no=?`, [orderNo]);
  res.status(201).json(order);
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  const { status, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  let sql = `SELECT * FROM orders WHERE user_id=?`;
  let countSql = `SELECT COUNT(*) as total FROM orders WHERE user_id=?`;
  const params = [req.user.sub];
  const countParams = [req.user.sub];

  if (status) { sql += ` AND status=?`; params.push(status); countSql += ` AND status=?`; countParams.push(status); }
  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize), offset);

  const items = await queryAll(sql, params).map(o => ({ ...o, items: JSON.parse(o.items || '[]') }));
  const { total } = await queryOne(countSql, countParams) || { total: 0 };
  res.json({ total, page: parseInt(page), pageSize: parseInt(pageSize), items });
});

app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  const order = await queryOne(`SELECT * FROM orders WHERE id=?`, [parseInt(req.params.id)]);
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (order.user_id !== req.user.sub && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json({ ...order, items: JSON.parse(order.items || '[]') });
});

// Admin: all orders
app.get('/api/orders/admin/all', authMiddleware, adminOnly, async (req, res) => {
  const { status, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  let sql = `SELECT o.*, u.username, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id=u.id WHERE 1=1`;
  let countSql = `SELECT COUNT(*) as total FROM orders WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (status) { sql += ` AND o.status=?`; params.push(status); countSql += ` AND status=?`; countParams.push(status); }
  sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize), offset);

  const orders = await queryAll(sql, params).map(o => ({
    ...o,
    customer_name: o.username || o.email || '-',
    items: JSON.parse(o.items || '[]')
  }));
  const { total } = await queryOne(countSql, countParams) || { total: 0 };
  res.json({ total, page: parseInt(page), pageSize: parseInt(pageSize), orders });
});

app.put('/api/orders/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { status, tracking_no, courier } = req.body;
  const updates = ['status=?', `updated_at=NOW()`];
  const vals = [status];

  if (status === 'paid') updates.push('paid_at=NOW()');
  if (status === 'shipped') {
    updates.push('shipped_at=NOW()');
    if (tracking_no) { updates.push('tracking_no=?'); vals.push(tracking_no); }
    if (courier) { updates.push('courier=?'); vals.push(courier); }
  }
  if (status === 'delivered') updates.push('delivered_at=NOW()');

  vals.push(parseInt(req.params.id));
  await runSql(`UPDATE orders SET ${updates.join(',')} WHERE id=?`, vals);


  const order = await queryOne(`SELECT * FROM orders WHERE id=?`, [parseInt(req.params.id)]);
  res.json({ ...order, items: JSON.parse(order.items || '[]') });
});

app.put('/api/orders/:id/payment', authMiddleware, async (req, res) => {
  const { method, payment_id } = req.body;
  await runSql(`UPDATE orders SET payment_method=?, payment_id=?, status='paid', paid_at=NOW(), updated_at=NOW() WHERE id=?`,
    [method, payment_id, parseInt(req.params.id)]);

  const order = await queryOne(`SELECT * FROM orders WHERE id=?`, [parseInt(req.params.id)]);
  res.json({ ...order, items: JSON.parse(order.items || '[]') });
});

// Admin: reports
app.get('/api/orders/reports/summary', authMiddleware, adminOnly, async (req, res) => {
  const { from, to } = req.query;
  let sql = `SELECT * FROM orders WHERE 1=1`;
  const params = [];
  if (from) { sql += ` AND created_at>=?`; params.push(from); }
  if (to) { sql += ` AND created_at<=?`; params.push(to); }

  const orders = await queryAll(sql, params);
  const paid = orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status));

  // Top products from paid orders
  const productCounts = {};
  paid.forEach(o => {
    try {
      const items = JSON.parse(o.items || '[]');
      items.forEach(i => {
        productCounts[i.sku] = (productCounts[i.sku] || 0) + i.quantity;
      });
    } catch {}
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sku, count]) => ({ sku, count }));

  res.json({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    paidOrders: paid.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    shippedOrders: orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length,
    avgOrderValue: paid.length ? paid.reduce((s, o) => s + o.total, 0) / paid.length : 0,
    topProducts
  });
});

// ----- Upload Test -----
app.post('/api/upload/test', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: `/uploads/products/${req.file.filename}` });
});

// ----- 404 Handler -----
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  // Serve HTML file if exists
  const htmlPath = path.join(ROOT_DIR, req.path);
  if (fs.existsSync(htmlPath) && htmlPath.endsWith('.html')) {
    return res.sendFile(htmlPath);
  }
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

// ============ Start ============
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('============================================');
    console.log('  PandaShield B2B API Server');
    console.log(`  http://localhost:${PORT}/api/...`);
    console.log(`  (Static files served from: ${ROOT_DIR})`);
    console.log(`  Admin: admin@pandashield.com / admin123!`);
    console.log('============================================');
  });
}

start().catch(console.error);
