/* ============================================================
   PANDA CUSTOMER — customer.js
   客户主页：登录校验、历史数据加载、标签切换
   ============================================================ */
(function () {
  'use strict';

  // ---- 未登录保护 ----
  var token = localStorage.getItem('panda_token');
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }

  var userData = null;
  try { userData = JSON.parse(localStorage.getItem('panda_user') || 'null'); } catch(e) {}
  if (!userData) {
    window.location.href = 'auth.html';
    return;
  }

  // 管理员重定向到 admin.html
  if (userData.role === 'admin') {
    window.location.href = 'admin.html';
    return;
  }

  // ---- 标签切换 ----
  var currentTab = 'browse';

  window.custSwitchTab = function(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.cust-sb-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.tab === tabId);
    });
    document.querySelectorAll('.cust-section').forEach(function(el) {
      el.classList.toggle('active', el.id === 'sec-' + tabId);
    });
    if (tabId === 'browse')        renderBrowse();
    if (tabId === 'orders')        renderOrders();
    if (tabId === 'spending')      renderSpending();
    if (tabId === 'inquiries')     renderInquiries();
    if (tabId === 'profile')       renderProfile();
    if (tabId === 'favorites')     renderFavorites();
    if (tabId === 'address')       renderAddress();
    if (tabId === 'security')      renderSecurity();
    if (tabId === 'notifications') renderNotifications();
    if (tabId === 'samples')       renderSamples();
  };

  // ---- 格式化时间 ----
  function fmtDate(str) {
    if (!str) return '--';
    var d = new Date(str);
    if (isNaN(d)) return str;
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // ---- 骨架屏占位 ----
  function skelRows(cols, n) {
    n = n || 4;
    return Array.from({length: n}, function() {
      return '<tr>' + cols.map(function() {
        return '<td><div class="cust-skeleton" style="width:80%;height:13px;"></div></td>';
      }).join('') + '</tr>';
    }).join('');
  }

  // ---- 空状态 ----
  function emptyHtml(msg) {
    return '<div class="cust-empty">' +
      '<svg class="cust-empty-icon" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#F1ECE6"/><path d="M18 28h20M28 18v20" stroke="#867A6D" stroke-width="2.5" stroke-linecap="round"/></svg>' +
      '<div class="cust-empty-text">' + (msg || '暂无记录') + '</div>' +
      '</div>';
  }

  // ---- 状态徽章 ----
  function badge(status) {
    var map = {
      'pending': ['cust-badge-orange', '待处理'],
      'replied': ['cust-badge-green', '已回复'],
      'closed':  ['cust-badge-gray',  '已关闭'],
      'processing': ['cust-badge-orange', '处理中'],
      'completed':  ['cust-badge-green', '已完成'],
      'cancelled':  ['cust-badge-gray',  '已取消']
    };
    var info = map[status] || ['cust-badge-gray', status || '--'];
    return '<span class="cust-badge ' + info[0] + '">' + info[1] + '</span>';
  }

  // ---- 浏览记录 ----
  var browseHistory = [];
  try {
    var raw = localStorage.getItem('panda_browse_history');
    browseHistory = raw ? JSON.parse(raw) : [];
  } catch(e) { browseHistory = []; }

  // 同时从 panda_footprint 读
  var footprintData = [];
  try {
    var rawFp = localStorage.getItem('panda_footprint');
    footprintData = rawFp ? JSON.parse(rawFp) : [];
  } catch(e) { footprintData = []; }

  function renderBrowse() {
    var grid = document.getElementById('browse-grid');
    if (!grid) return;
    // 合并来源
    var items = browseHistory.length ? browseHistory : footprintData;
    if (!items.length) {
      grid.innerHTML = emptyHtml('您还没有浏览过任何产品');
      return;
    }
    grid.innerHTML = items.slice(0, 24).map(function(item) {
      var img = item.image || item.img || 'image/logo1.png';
      var name = item.name || item.sku || '产品';
      var sku = item.sku || '';
      var time = fmtDate(item.time || item.ts || item.created_at);
      return '<a href="product-detail.html?sku=' + encodeURIComponent(sku) + '" class="cust-browse-card">' +
        '<img class="cust-browse-img" src="' + img + '" alt="' + name + '" onerror="this.src=\'image/logo1.png\'">' +
        '<div class="cust-browse-info">' +
          '<div class="cust-browse-name">' + name + '</div>' +
          '<div class="cust-browse-time">' + time + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  // ---- 询盘记录 & 订单记录 ---- (从 API 加载)
  var historyData = { inquiries: [], orders: [] };
  var historyLoaded = false;

  function loadHistory() {
    if (historyLoaded) return Promise.resolve(historyData);
    return PandaAPI.History.get()
      .then(function(data) {
        historyData = data || { inquiries: [], orders: [] };
        historyLoaded = true;
        return historyData;
      })
      .catch(function() {
        historyLoaded = true;
        return historyData;
      });
  }

  function renderInquiries() {
    var tbody = document.getElementById('inq-tbody');
    if (!tbody) return;
    tbody.innerHTML = skelRows(['','','',''], 3);
    loadHistory().then(function(data) {
      var list = (data && data.inquiries) || [];
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="4">' + emptyHtml('暂无询盘记录') + '</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(function(inq) {
        return '<tr>' +
          '<td>#' + (inq.id || '--') + '</td>' +
          '<td>' + (inq.subject || inq.product_sku || '--') + '</td>' +
          '<td>' + badge(inq.status || 'pending') + '</td>' +
          '<td>' + fmtDate(inq.created_at) + '</td>' +
        '</tr>';
      }).join('');
    });
  }

  function renderOrders() {
    var tbody = document.getElementById('order-tbody');
    if (!tbody) return;
    tbody.innerHTML = skelRows(['','','',''], 3);
    loadHistory().then(function(data) {
      var list = (data && data.orders) || [];
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="4">' + emptyHtml('暂无采购记录') + '</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(function(ord) {
        return '<tr>' +
          '<td>#' + (ord.id || '--') + '</td>' +
          '<td>$' + (parseFloat(ord.total_amount || 0).toFixed(2)) + '</td>' +
          '<td>' + badge(ord.status || 'pending') + '</td>' +
          '<td>' + fmtDate(ord.created_at) + '</td>' +
        '</tr>';
      }).join('');
    });
  }

  function renderSpending() {
    var tbody = document.getElementById('spending-tbody');
    if (!tbody) return;
    tbody.innerHTML = skelRows(['','','',''], 3);
    loadHistory().then(function(data) {
      var list = (data && data.orders) || [];
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="3">' + emptyHtml('暂无消费记录') + '</td></tr>';
        return;
      }
      var total = 0;
      var rows = list.map(function(ord) {
        var amt = parseFloat(ord.total_amount || 0);
        total += amt;
        return '<tr>' +
          '<td>' + fmtDate(ord.created_at) + '</td>' +
          '<td>$' + amt.toFixed(2) + '</td>' +
          '<td>' + badge(ord.status || 'completed') + '</td>' +
        '</tr>';
      }).join('');
      document.getElementById('spending-total') && (document.getElementById('spending-total').textContent = '$' + total.toFixed(2));
      tbody.innerHTML = rows;
    });
  }

  // ---- 我的收藏 ----
  function renderFavorites() {
    var grid = document.getElementById('favorites-grid');
    if (!grid) return;
    var favData = [];
    try { favData = JSON.parse(localStorage.getItem('panda_favorites') || '[]'); } catch(e) {}
    if (!favData.length) {
      grid.innerHTML = emptyHtml('您还没有收藏任何产品');
      return;
    }
    grid.innerHTML = favData.map(function(item) {
      var img = item.image || item.img || 'image/logo1.png';
      var name = item.name || item.sku || '产品';
      var sku = item.sku || '';
      return '<a href="product-detail.html?sku=' + encodeURIComponent(sku) + '" class="cust-browse-card">' +
        '<img class="cust-browse-img" src="' + img + '" alt="' + name + '" onerror="this.src=\'image/logo1.png\'">' +
        '<div class="cust-browse-info">' +
          '<div class="cust-browse-name">' + name + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  // ---- 收货地址 ----
  function renderAddress() {
    var wrap = document.getElementById('address-list');
    if (!wrap) return;
    var addrData = [];
    try { addrData = JSON.parse(localStorage.getItem('panda_addresses') || '[]'); } catch(e) {}
    if (!addrData.length) {
      wrap.innerHTML = emptyHtml('暂无收货地址，请点击右上角新增');
      return;
    }
    wrap.innerHTML = addrData.map(function(addr, idx) {
      return '<div class="cust-address-card' + (addr.is_default ? ' cust-address-default' : '') + '">' +
        '<div class="cust-address-info">' +
          '<div class="cust-address-name">' + (addr.name || '--') + ' <span class="cust-address-phone">' + (addr.phone || '') + '</span></div>' +
          '<div class="cust-address-detail">' + (addr.address || '--') + '</div>' +
        '</div>' +
        (addr.is_default ? '<span class="cust-badge cust-badge-orange">默认</span>' : '') +
        '<div class="cust-address-actions">' +
          '<button class="cust-addr-btn" onclick="custEditAddress(' + idx + ')">编辑</button>' +
          '<button class="cust-addr-btn cust-addr-del" onclick="custDelAddress(' + idx + ')">删除</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window.custEditAddress = function(idx) { alert('编辑地址功能开发中'); };
  window.custDelAddress = function(idx) {
    var addrData = [];
    try { addrData = JSON.parse(localStorage.getItem('panda_addresses') || '[]'); } catch(e) {}
    addrData.splice(idx, 1);
    localStorage.setItem('panda_addresses', JSON.stringify(addrData));
    renderAddress();
  };

  // ---- 账号安全 ----
  function renderSecurity() {
    var emailEl = document.getElementById('security-email');
    if (emailEl && userData && userData.email) {
      emailEl.textContent = userData.email;
    }
  }

  // ---- 消息通知 ----
  function renderNotifications() {
    var wrap = document.getElementById('notifications-list');
    if (!wrap) return;
    var notifData = [];
    try { notifData = JSON.parse(localStorage.getItem('panda_notifications') || '[]'); } catch(e) {}
    if (!notifData.length) {
      wrap.innerHTML = emptyHtml('暂无新消息');
      return;
    }
    wrap.innerHTML = notifData.map(function(n) {
      var isRead = n.read;
      return '<div class="cust-notif-item' + (isRead ? ' cust-notif-read' : '') + '">' +
        '<div class="cust-notif-dot' + (isRead ? '' : ' cust-notif-dot-unread') + '"></div>' +
        '<div class="cust-notif-body">' +
          '<div class="cust-notif-title">' + (n.title || '通知') + '</div>' +
          '<div class="cust-notif-desc">' + (n.content || '') + '</div>' +
          '<div class="cust-notif-time">' + fmtDate(n.time) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ---- 样品申请 ----
  function renderSamples() {
    var tbody = document.getElementById('sample-tbody');
    if (!tbody) return;
    tbody.innerHTML = skelRows(['','','',''], 3);
    loadHistory().then(function(data) {
      // samples 从 history.samples 或独立的 API 获取
      var list = (data && data.samples) || [];
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="4">' + emptyHtml('暂无样品申请记录') + '</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(function(s) {
        return '<tr>' +
          '<td>#' + (s.id || '--') + '</td>' +
          '<td>' + (s.product_name || s.subject || '--') + '</td>' +
          '<td>' + badge(s.status || 'pending') + '</td>' +
          '<td>' + fmtDate(s.created_at) + '</td>' +
        '</tr>';
      }).join('');
    });
  }

  // ---- 个人资料 ----
  window._profileEditing = false;

  window._toggleProfileEdit = function() {
    var card = document.getElementById('profile-card');
    if (!card) return;
    window._profileEditing = !window._profileEditing;
    if (window._profileEditing) {
      renderProfileEdit();
    } else {
      renderProfile();
    }
  };

  function renderProfileEdit() {
    var card = document.getElementById('profile-card');
    if (!card) return;
    var savedAvatar = localStorage.getItem('panda_avatar') || '';
    PandaAPI.Profile.get().then(function(user) {
      card.innerHTML =
        '<div class="cust-profile-avatar-row">' +
          '<div class="cust-profile-avatar-wrap">' +
            (savedAvatar ? '<img src="' + savedAvatar + '" class="cust-profile-avatar-img" id="pe-avatar-preview">' :
             '<div class="cust-profile-avatar-placeholder" id="pe-avatar-preview"><svg viewBox="0 0 20 20" fill="currentColor" width="32"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg></div>') +
            '<input type="file" id="pe-avatar-input" accept="image/*" style="display:none" onchange="window._handleAvatarChange(event)">' +
            '<button class="cust-profile-avatar-btn" onclick="document.getElementById(\'pe-avatar-input\').click()">更换头像</button>' +
          '</div>' +
          '<div class="cust-profile-avatar-hint">支持 JPG、PNG 格式<br>建议使用正方形图片</div>' +
        '</div>' +
        '<div class="cust-profile-grid">' +
          '<div class="cust-profile-field"><div class="cust-profile-label">邮箱</div>' +
            '<input class="cust-profile-input" type="email" id="pe-email" value="' + escHtml(user.email || '') + '" readonly style="background:#f5f0ea;color:#867A6D"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">国家/地区</div>' +
            '<input class="cust-profile-input" type="text" id="pe-country" value="' + escHtml(user.country || '') + '" placeholder="如：中国、美国"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">公司名称</div>' +
            '<input class="cust-profile-input" type="text" id="pe-company" value="' + escHtml(user.company || '') + '" placeholder="请填写公司全称"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">所属行业</div>' +
            '<input class="cust-profile-input" type="text" id="pe-industry" value="' + escHtml(user.industry || '') + '" placeholder="如：制造业、零售"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">公司规模</div>' +
            '<select class="cust-profile-input" id="pe-company-size">' +
              '<option value="">请选择</option>' +
              '<option value="1-50"' + (user.company_size === '1-50' ? ' selected' : '') + '>1-50人</option>' +
              '<option value="51-200"' + (user.company_size === '51-200' ? ' selected' : '') + '>51-200人</option>' +
              '<option value="201-500"' + (user.company_size === '201-500' ? ' selected' : '') + '>201-500人</option>' +
              '<option value="500+"' + (user.company_size === '500+' ? ' selected' : '') + '>500人以上</option>' +
            '</select></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">所在城市</div>' +
            '<input class="cust-profile-input" type="text" id="pe-city" value="' + escHtml(user.city || '') + '" placeholder="如：上海、深圳"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">联系人</div>' +
            '<input class="cust-profile-input" type="text" id="pe-contact-person" value="' + escHtml(user.contact_person || '') + '" placeholder="联系人姓名"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">职位</div>' +
            '<input class="cust-profile-input" type="text" id="pe-contact-title" value="' + escHtml(user.contact_title || '') + '" placeholder="如：采购经理"></input></div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">联系电话</div>' +
            '<input class="cust-profile-input" type="tel" id="pe-contact-mobile" value="' + escHtml(user.contact_mobile || '') + '" placeholder="手机或电话"></input></div>' +
        '</div>' +
        '<div class="cust-profile-btn-row">' +
          '<button class="cust-profile-edit-btn" onclick="window._toggleProfileEdit()">取消</button>' +
          '<button class="cust-profile-save-btn" id="pe-save-btn">保存修改</button>' +
        '</div>';
      document.getElementById('pe-save-btn').addEventListener('click', saveProfile);
    });
  }

  function saveProfile() {
    var data = {
      country: document.getElementById('pe-country').value.trim(),
      company: document.getElementById('pe-company').value.trim(),
      industry: document.getElementById('pe-industry').value.trim(),
      company_size: document.getElementById('pe-company-size').value,
      city: document.getElementById('pe-city').value.trim(),
      contact_person: document.getElementById('pe-contact-person').value.trim(),
      contact_title: document.getElementById('pe-contact-title').value.trim(),
      contact_mobile: document.getElementById('pe-contact-mobile').value.trim()
    };
    var btn = document.getElementById('pe-save-btn');
    btn.textContent = '保存中...';
    btn.disabled = true;
    PandaAPI.Profile.update(data).then(function() {
      alert('资料保存成功！');
      window._profileEditing = false;
      renderProfile();
    }).catch(function() {
      alert('保存失败，请稍后重试。');
      btn.textContent = '保存修改';
      btn.disabled = false;
    });
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function renderProfile() {
    var card = document.getElementById('profile-card');
    if (!card) return;
    card.innerHTML = '<div class="cust-profile-loading">' + emptyHtml('加载中...') + '</div>';
    var savedAvatar = localStorage.getItem('panda_avatar') || '';
    PandaAPI.Profile.get().then(function(user) {
      var f = function(v) { return v ? ('<span class="cust-profile-value">' + escHtml(v) + '</span>') : '<span class="cust-profile-value empty">未填写</span>'; };
      card.innerHTML =
        '<div class="cust-profile-avatar-row">' +
          '<div class="cust-profile-avatar-wrap">' +
            (savedAvatar
              ? '<img src="' + savedAvatar + '" class="cust-profile-avatar-img">'
              : '<div class="cust-profile-avatar-placeholder"><svg viewBox="0 0 20 20" fill="currentColor" width="36"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg></div>') +
          '</div>' +
        '</div>' +
        '<div class="cust-profile-grid">' +
          '<div class="cust-profile-field"><div class="cust-profile-label">邮箱</div>' + f(user.email) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">国家/地区</div>' + f(user.country) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">公司名称</div>' + f(user.company) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">所属行业</div>' + f(user.industry) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">公司规模</div>' + f(user.company_size) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">所在城市</div>' + f(user.city) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">联系人</div>' + f(user.contact_person) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">职位</div>' + f(user.contact_title) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">联系电话</div>' + f(user.contact_mobile) + '</div>' +
          '<div class="cust-profile-field"><div class="cust-profile-label">注册时间</div>' + f(fmtDate(user.created_at)) + '</div>' +
        '</div>' +
        '<button class="cust-profile-edit-btn" onclick="window._toggleProfileEdit()">完善/修改资料</button>';
    }).catch(function() {
      card.innerHTML = emptyHtml('无法加载资料，请刷新重试');
    });
  }

  // ---- 头像更换 ----
  window._handleAvatarChange = function(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件！');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB！');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var base64 = e.target.result;
      localStorage.setItem('panda_avatar', base64);
      var preview = document.getElementById('pe-avatar-preview');
      if (preview) {
        preview.outerHTML = '<img src="' + base64 + '" class="cust-profile-avatar-img" id="pe-avatar-preview">';
      }
    };
    reader.readAsDataURL(file);
  };

  // ---- 首页统计数字 ----
  function loadHeroStats() {
    loadHistory().then(function(data) {
      var inqCount = (data && data.inquiries && data.inquiries.length) || 0;
      var ordCount = (data && data.orders && data.orders.length) || 0;
      var browseCount = browseHistory.length || footprintData.length;
      var el1 = document.getElementById('hero-browse-count');
      var el2 = document.getElementById('hero-inq-count');
      var el3 = document.getElementById('hero-ord-count');
      if (el1) el1.textContent = browseCount;
      if (el2) el2.textContent = inqCount;
      if (el3) el3.textContent = ordCount;
      // 更新快捷入口徽标
      var qnBrowse = document.getElementById('qn-browse-count');
      var qnInq   = document.getElementById('qn-inq-count');
      var qnOrd   = document.getElementById('qn-ord-count');
      if (qnBrowse) qnBrowse.textContent = browseCount + ' 件';
      if (qnInq)   qnInq.textContent   = inqCount + ' 条';
      if (qnOrd)   qnOrd.textContent   = ordCount + ' 笔';
      // 收藏数量
      var favCount = 0;
      try { favCount = JSON.parse(localStorage.getItem('panda_favorites') || '[]').length; } catch(e) {}
      var qnFav = document.getElementById('qn-fav-count');
      if (qnFav) qnFav.textContent = favCount + ' 件';
      // 通知数量
      var notifCount = 0;
      try {
        var notifs = JSON.parse(localStorage.getItem('panda_notifications') || '[]');
        notifCount = notifs.filter(function(n) { return !n.read; }).length;
      } catch(e) {}
      var qnNotif = document.getElementById('qn-notif-count');
      if (qnNotif) qnNotif.textContent = notifCount + ' 条';
    });
  }

  // ---- 填充用户信息到 hero ----
  function fillHero() {
    var nameEl    = document.getElementById('hero-name');
    var companyEl = document.getElementById('hero-company');
    var displayName = userData.username || userData.email || '用户';
    if (displayName.indexOf('@') > -1) displayName = displayName.split('@')[0];
    if (nameEl)    nameEl.textContent    = '您好，' + displayName;
    if (companyEl && userData.company) companyEl.textContent = userData.company;
  }

  // ---- 初始化 ----
  fillHero();
  loadHeroStats();
  custSwitchTab('browse');

  // 绑定侧边栏导航
  document.querySelectorAll('.cust-sb-item').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      custSwitchTab(el.dataset.tab);
    });
  });

  // 绑定新增地址按钮
  var btnAddAddr = document.getElementById('btn-add-address');
  if (btnAddAddr) {
    btnAddAddr.addEventListener('click', function() {
      var name = prompt('收件人姓名：');
      if (!name) return;
      var phone = prompt('联系电话：');
      if (!phone) return;
      var address = prompt('详细地址：');
      if (!address) return;
      var addrData = [];
      try { addrData = JSON.parse(localStorage.getItem('panda_addresses') || '[]'); } catch(e) {}
      addrData.push({ name: name, phone: phone, address: address, is_default: addrData.length === 0 });
      localStorage.setItem('panda_addresses', JSON.stringify(addrData));
      renderAddress();
    });
  }

  // 绑定全部已读按钮
  var btnMarkRead = document.getElementById('btn-mark-all-read');
  if (btnMarkRead) {
    btnMarkRead.addEventListener('click', function() {
      var notifs = [];
      try { notifs = JSON.parse(localStorage.getItem('panda_notifications') || '[]'); } catch(e) {}
      notifs.forEach(function(n) { n.read = true; });
      localStorage.setItem('panda_notifications', JSON.stringify(notifs));
      renderNotifications();
      loadHeroStats();
    });
  }

  // 绑定申请样品按钮
  var btnSample = document.getElementById('btn-apply-sample');
  if (btnSample) {
    btnSample.addEventListener('click', function() {
      window.location.href = 'products-all.html';
    });
  }

  // URL hash 自动切换标签
  if (window.location.hash) {
    var hashTab = window.location.hash.replace('#tab-', '');
    if (hashTab) custSwitchTab(hashTab);
  }

})();
