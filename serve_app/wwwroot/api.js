/**
 * PandaShield API Client
 */
(function (global) {
  // 当前服务器端口
  var _apiBase = (function() {
    // 浏览器环境：从当前 host 自动判断
    if (typeof window !== 'undefined') {
      var h = window.location.hostname || 'localhost';
      var p = window.location.port;
      // 如果当前是 3000（本地 Python），强制用 3001（Node API）
      if (p === '3000') {
        return 'http://' + h + ':3001/api';
      }
      // 其他情况（生产服务器/标准端口/空端口）：走同源 /api
      return '/api';
    }
    return '/api';
  })();
  const API_BASE = _apiBase;

  // ============ Token Storage ============
  const TOKEN_KEY = 'panda_token';
  const USER_KEY = 'panda_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getUser() {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function isAdmin() {
    const u = getUser();
    return u && u.role === 'admin';
  }

  // ============ HTTP Core ============
  async function request(method, path, body, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const opts = { method, headers };
    if (body && method !== 'GET') {
      opts.body = JSON.stringify(body);
    }

    // 10 秒超时，防止请求永久挂起
    const controller = new AbortController();
    opts.signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let res;
    try {
      res = await fetch(API_BASE + path, opts);
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error('请求超时，请检查网络或服务器状态');
      }
      throw new Error('网络错误：' + e.message);
    }
    clearTimeout(timeoutId);

    const text = await res.text();

    if (!res.ok) {
      let err;
      try { err = JSON.parse(text); } catch { err = { error: text }; }
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    if (!text) return null;
    try { return JSON.parse(text); }
    catch { return text; }
  }

  const get = (path, params) => {
    let url = path;
    if (params) {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v != null) q.append(k, v); });
      const qs = q.toString();
      if (qs) url += '?' + qs;
    }
    return request('GET', url);
  };

  const post = (path, body) => request('POST', path, body);
  const put = (path, body) => request('PUT', path, body);
  const del = (path, body) => body ? request('DELETE', path, body) : request('DELETE', path);

  // ============ Auth API ============
  const Auth = {
    register: (data) => post('/auth/register', data)
      .then(r => { setToken(r.token); setUser(r.user); return r; }),

    login: (email, password) => post('/auth/login', { email, password })
      .then(r => { setToken(r.token); setUser(r.user); return r; }),

    logout: () => { clearAuth(); },

    me: () => get('/auth/me')
      .then(u => { setUser(u); return u; }),

    getUser,

    isLoggedIn,

    isAdmin,

    // Auto-restore session
    restore: () => {
      if (!isLoggedIn()) return Promise.resolve(null);
      return Auth.me().catch(() => { clearAuth(); return null; });
    }
  };

  // ============ Products API ============
  // 统一数据格式：把 API 返回的 PascalCase 字段转为前端认识的 snake_case 格式
  function normalizeProduct(p) {
    if (!p) return null;
    // tags/industries/sports/certifications 从逗号字符串转数组
    function strToArr(s) {
      if (!s) return [];
      if (Array.isArray(s)) return s;
      return String(s).split(',').map(function(x) { return x.trim(); }).filter(Boolean);
    }
    // specs 可能是 JSON 字符串，转为对象
    var specsObj = p.Specs;
    if (typeof specsObj === 'string' && specsObj) {
      try { specsObj = JSON.parse(specsObj); } catch {}
    }
    return {
      id: p.Id || p.Sku,
      sku: p.Sku,
      name_zh: p.NameZh,
      name_en: p.NameEn,
      short_desc_zh: p.ShortDescZh,
      short_desc_en: p.ShortDescEn,
      desc_zh: p.DescriptionZh,
      desc_en: p.DescriptionEn,
      brand: p.Brand,
      tags: strToArr(p.Tags),
      industries: strToArr(p.Industries),
      sports: strToArr(p.Sports),
      certifications: strToArr(p.Certifications),
      price_usd: p.PriceUsd,
      moq: p.Moq,
      lead_time_days: p.LeadTimeDays,
      images: Array.isArray(p.Images) ? p.Images : [],
      video_url: p.VideoUrl,
      specs: specsObj,
      attributes: specsObj || {},
      status: p.Status,
      visibility: p.Visibility,
      meta_title: p.MetaTitle,
      meta_desc: p.MetaDesc,
      created_at: p.CreatedAt,
      updated_at: p.UpdatedAt,
      // 保留原始引用，方便调试
      _raw: p
    };
  }

  function normalizeProductList(list) {
    if (!list) return [];
    if (Array.isArray(list)) return list.map(normalizeProduct);
    // 如果是分页格式 { items: [...] } 或 { data: [...] }
    if (list.items) return list.items.map(normalizeProduct);
    if (list.data) return list.data.map(normalizeProduct);
    if (list.products) return list.products.map(normalizeProduct);
    return [];
  }

  const Products = {
    list: function(params) {
      return get('/products', params).then(function(res) {
        // 兼容两种返回格式：直接数组 或 分页对象 { total, page, pageSize, items: [...] }
        var items;
        if (Array.isArray(res)) {
          items = res;
        } else if (res && Array.isArray(res.items)) {
          items = res.items;
        } else if (res && Array.isArray(res.data)) {
          items = res.data;
        } else if (res && Array.isArray(res.products)) {
          items = res.products;
        } else {
          items = [];
        }
        return normalizeProductList(items);
      });
    },
    get: function(id) {
      return get('/products/' + id).then(normalizeProduct);
    },
    getBySku: function(sku) {
      return get('/products/sku/' + sku).then(normalizeProduct);
    },
    // Admin
    create: function(data) { return post('/products', data); },
    update: function(id, data) { return put('/products/' + id, data); },
    remove: function(id) { return del('/products/' + id); },
    restore: function(id) { return post('/products/admin/restore/' + id); },
    permanentDelete: function(id) { return del('/products/admin/permanent/' + id); },
    uploadImages: async function(productId, files) {
      var form = new FormData();
      files.forEach(function(f) { form.append('files', f); });
      var token = getToken();
      var res = await fetch(API_BASE + '/products/' + productId + '/images', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: form
      });
      return res.json();
    },
    adminList: function(params) {
      return get('/products/admin/all', params).then(function(res) {
        var items = Array.isArray(res) ? res : (res.items || res.data || []);
        return normalizeProductList(items);
      });
    }
  };

  // ============ Cart API ============
  const Cart = {
    list: () => get('/cart'),
    add: (productId, quantity = 1, specs = '') =>
      post('/cart', { productId, quantity, specs }),
    update: (id, quantity) => put(`/cart/${id}`, { quantity }),
    remove: (id) => del(`/cart/${id}`),
    clear: () => del('/cart')
  };

  // ============ Inquiry API ============
  const Inquiries = {
    create: (items, message) =>
      post('/inquiries', { items: items.map(i => ({ productId: i.productId || i.product_id, quantity: i.quantity || 1, specs: i.specs || {} })), message }),
    myList: () => get('/inquiries'),
    adminList: (params) => get('/inquiries/admin/all', params),
    reply: (id, message) => put(`/inquiries/${id}/reply`, { message }),
    close: (id) => put(`/inquiries/${id}/close`)
  };

  // ============ Orders API ============
  const Orders = {
    create: (items, shipping_address, notes) =>
      post('/orders', { items, shipping_address, notes }),
    myList: (params) => get('/orders', params),
    get: (id) => get(`/orders/${id}`),
    recordPayment: (id, method, paymentId) =>
      put(`/orders/${id}/payment`, { method, payment_id: paymentId }),
    // Admin
    adminList: (params) => get('/orders/admin/all', params),
    updateStatus: (id, status, tracking_no, courier) =>
      put(`/orders/${id}/status`, { status, tracking_no, courier }),
    report: (from, to) => get('/orders/reports/summary', { from, to })
  };

  // ============ Users API ============
  const Users = {
    list: (params) => get('/users', params),
    get: (id) => get(`/users/${id}`),
    update: (id, data) => put(`/users/${id}`, data),
    delete: (id) => del(`/users/${id}`)
  };

  // ============ Profile API（客户自助更新企业资料）============
  const Profile = {
    get: () => get('/auth/me'),
    update: (data) => put('/users/me/profile', data)
  };

  // ============ History API（客户历史记录）============
  const History = {
    get: () => get('/users/me/history')
  };

  // ============ Export ============
  const PandaAPI = {
    Auth, Products, Cart, Inquiries, Orders, Users, Profile, History,
    getToken, setToken, clearAuth, getUser, isLoggedIn, isAdmin,
    API_BASE
  };

  // Expose globally
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PandaAPI;
  } else {
    global.PandaAPI = PandaAPI;
  }

})(typeof window !== 'undefined' ? window : global);
