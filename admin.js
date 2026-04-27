/* ============================================================
   PANDA ADMIN — admin.js (ali-style sidebar)
   ============================================================ */

(function() {
  'use strict';

  // ---- Utilities ----
  function debounce(fn, delay) {
    var t;
    return function() {
      var a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(function() { fn.apply(c, a); }, delay);
    };
  }

  // ---- Skeleton helpers (3.3) ----
  function showSkeleton(tbodyId, cols) {
    var el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = Array.from({length: 5}, function() {
      return '<tr class="skeleton-row">' + cols.map(function(c) {
        return '<td><div class="skeleton-cell ' + (c || '') + '"></div></td>';
      }).join('') + '</tr>';
    }).join('');
  }
  function showError(tbodyId, msg) {
    var el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = '<tr><td colspan="20"><div class="skeleton-msg" style="color:#ef4444">' + (msg || '加载失败，请刷新重试') + '</div></td></tr>';
  }

  // ---- API Base（动态判断当前服务器端口）----
  var _host = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost';
  var _port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
  var _apiHost = (_port === '3000' || _port === '') ? _host + ':3001' : (_port ? _host + ':' + _port : _host);
  var API = 'http://' + _apiHost + '/api';

  // ---- Auth Check ----
  const token = localStorage.getItem('panda_token');
  const userData = token ? JSON.parse(localStorage.getItem('panda_user') || 'null') : null;
  const isAdminUser = userData && (userData.role === 'admin');

  if (!token || !isAdminUser) {
    var _ad = document.getElementById('adashWrap'); var _al = document.getElementById('aloginWrap');
    if (_ad) _ad.style.display = 'none';
    if (_al) _al.style.display = 'flex';
  } else {
    var _ad2 = document.getElementById('adashWrap'); var _al2 = document.getElementById('aloginWrap');
    var _tb = document.getElementById('adminTopbar');
    var _tu = document.getElementById('adminTopbarUser');
    if (_ad2) _ad2.style.display = 'flex';
    if (_al2) _al2.style.display = 'none';
    if (_tb) _tb.style.display = 'flex';
    // Show username in topbar
    var uname = userData.name || userData.email || 'Admin';
    var unameDisplay = uname.indexOf('@') > 0 ? uname.split('@')[0] : uname;
    if (_tu) _tu.textContent = '👤 ' + unameDisplay;
    // Load overview data
    loadOverview();
    loadProductList();
    loadDrafts();
    loadTrash();
    loadCustomers();
    loadOrders();
    loadInquiries();
  }

  // ---- Login ----
  window.adminLogin = function() {
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value;
    if (!u || !p) { toast('请输入账号和密码', 'error'); return; }
    PandaAPI.Auth.login(u, p)
      .then(function(data) {
        localStorage.setItem('panda_token', data.token);
        localStorage.setItem('panda_user', JSON.stringify(data.user));
        localStorage.setItem('panda_admin', '1');
        location.reload();
      })
      .catch(function(err) {
        toast('登录失败：' + (err.message || '账号或密码错误'), 'error');
      });
  };

  // Enter key on pass
  var _ap = document.getElementById('adminPass');
  if (_ap) _ap.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') window.adminLogin && window.adminLogin();
  });

  // ---- Logout ----
  window.adminLogout = function() {
    localStorage.removeItem('panda_token');
    localStorage.removeItem('panda_user');
    localStorage.removeItem('panda_admin');
    location.reload();
  };

  // Bind logout button
  var _lob = document.getElementById('adminLogoutBtn');
  if (_lob) _lob.addEventListener('click', window.adminLogout);

  // ---- Sidebar Navigation ----
  window.sdashShow = function(pageId) {
    // Highlight sidebar
    document.querySelectorAll('.asb-gi').forEach(function(el) { el.classList.remove('active'); });
    const target = document.querySelector('[data-gi="' + pageId + '"]');
    if (target) target.classList.add('active');

    // Show page
    document.querySelectorAll('.apage').forEach(function(el) { el.classList.remove('active'); });
    const page = document.getElementById('apage-' + pageId);
    if (page) page.classList.add('active');

    // Update breadcrumb
    const pageNames = {
      'overview':'数据概览',
      'product-publish':'发布产品',
      'product-list':'产品列表',
      'product-trash':'回收站',
      'customers':'客户档案',
      'orders':'订单管理',
      'inquiries':'询盘管理',
      'cust-add':'新增客户',
      'cases':'客户案例',
      'brands':'品牌授权',
      'reports':'报表中心',
      'analytics':'数据分析'
    };
    const pname = pageNames[pageId] || pageId;
    document.getElementById('atbCurrentPage').textContent = pname;

    // Refresh data when switching to tab
    if (pageId === 'overview') loadOverview();
    if (pageId === 'product-list') loadProductList();
    if (pageId === 'product-draft') loadDrafts();
    if (pageId === 'product-trash') loadTrash();
    if (pageId === 'customers') loadCustomers();
    if (pageId === 'orders') loadOrders();
    if (pageId === 'inquiries') loadInquiries();
    if (pageId === 'reports') loadReports();
    if (pageId === 'analytics') loadAnalytics();
    if (pageId === 'cases') loadCases();
    if (pageId === 'brands') loadBrands();
  };

  // ---- Load Overview ----
  function loadOverview() {
    PandaAPI.Auth.me(function(ok, user) {
      if (!ok) return;
    });

    // Products count
    PandaAPI.Products.adminList({ visibility: 'all', pageSize: 1 })
      .then(function(res) {
        var prods = res && res.products;
        if (prods) {
          document.getElementById('ov-products').textContent = res.total || 0;
          document.getElementById('asb-prod-count').textContent = res.total || 0;
        }
      })
      .catch(function() {});

    // Customers
    const allUsers = [];
    PandaAPI.Inquiries ? loadInquiriesCount() : null;

    // Overview stats via API
    PandaAPI.Users.list()
      .then(function(data) {
        if (data && Array.isArray(data.users)) {
          var total = data.users.length;
          var countries = {};
          data.users.forEach(function(u) {
            if (u.country) countries[u.country] = (countries[u.country] || 0) + 1;
          });
          document.getElementById('ov-total').textContent = total;
          document.getElementById('asb-cust-count').textContent = total;

          // Country bars
          var bars = document.getElementById('countryBars');
          if (bars) {
            var sorted = Object.entries(countries).sort(function(a,b){ return b[1]-a[1]; }).slice(0,8);
            var max = sorted.length ? sorted[0][1] : 1;
            bars.innerHTML = sorted.map(function(e) {
              return '<div class="cb-row"><span class="cb-label">' + e[0] + '</span><div class="cb-bar-wrap"><div class="cb-bar" style="width:' + Math.round(e[1]/max*100) + '%"></div></div><span class="cb-count">' + e[1] + '</span></div>';
            }).join('');
          }
          document.getElementById('ov-countries').textContent = Object.keys(countries).length;

          // Recent customers table
          var recent = document.getElementById('recentCustomers');
          if (recent) {
            var recent5 = data.users.slice(-5).reverse();
            if (recent5.length === 0) {
              recent.innerHTML = '';
              document.getElementById('recentEmpty').style.display = 'block';
            } else {
              document.getElementById('recentEmpty').style.display = 'none';
              recent.innerHTML = recent5.map(function(u) {
                return '<tr onclick="showCustomerModal(\'' + u.id + '\')">' +
                  '<td>' + escHtml(u.name || '-') + '</td>' +
                  '<td>' + escHtml(u.company || '-') + '</td>' +
                  '<td>' + escHtml(u.country || '-') + '</td>' +
                  '<td>' + escHtml(u.email || '-') + '</td>' +
                  '<td>' + escHtml(u.created_at ? u.created_at.slice(0,10) : '-') + '</td>' +
                '</tr>';
              }).join('');
            }
          }
        }
      }).catch(function(){});

    // Orders
    PandaAPI.Orders.adminList()
      .then(function(data) {
        if (data && Array.isArray(data.orders)) {
          var total = data.orders.length;
          var amount = 0;
          data.orders.forEach(function(o) { amount += (parseFloat(o.total) || 0); });
          document.getElementById('ov-orders').textContent = total;
          document.getElementById('ov-amount').textContent = '$' + amount.toLocaleString('en', {maximumFractionDigits: 0});
          document.getElementById('asb-ord-count').textContent = total;
        }
      }).catch(function(){});
  }

  // ---- Product List ----
  function loadProductList() {
    showSkeleton('productsTableBody', ['circle', 'long', 'medium', 'short', 'short', 'btn']);
    document.getElementById('productsEmpty').style.display = 'none';
    PandaAPI.Products.adminList({ visibility: 'all', pageSize: 9999 })
      .then(function(res) {
        var prods = res && res.products;
        if (!prods || prods.length === 0) {
          document.getElementById('productsTableBody').innerHTML = '';
          document.getElementById('productsEmpty').style.display = 'block';
          document.getElementById('prodResultCount').textContent = '';
          return;
        }
        document.getElementById('productsEmpty').style.display = 'none';
        renderProductRows(prods);
        window._allProducts = prods;
        document.getElementById('prodResultCount').textContent = '共 ' + (res.total || prods.length) + ' 条产品';
      })
      .catch(function() {
        showError('productsTableBody', '产品列表加载失败，请刷新');
      });
  }

  function renderProductRows(prods) {
    document.getElementById('productsTableBody').innerHTML = prods.map(function(p) {
      var img = p.images && p.images.length > 0
        ? '<img class="tbl-img" src="' + p.images[0] + '" alt="' + escHtml(p.name_zh) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
          + '<div class="tbl-img-placeholder" style="display:none"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 2v2h8V5H6zm0 4v6h8V9H6z"/></svg></div>'
        : '<div class="tbl-img-placeholder"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 2v2h8V5H6zm0 4v6h8V9H6z"/></svg></div>';
      var price = (p.price_usd && p.price_usd > 0) ? '$' + parseFloat(p.price_usd).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}) : '—';
      var moq = p.moq || '—';
      var status = p.visibility === 'trash' ? '<span class="status-badge inactive">已删除</span>' : '<span class="status-badge active">上架</span>';
      return '<tr>' +
        '<td>' + img + '</td>' +
        '<td style="font-weight:600;color:var(--orange);font-size:12px">' + escHtml(p.sku || '-') + '</td>' +
        '<td style="font-weight:700">' + escHtml(p.name_zh || '-') + '</td>' +
        '<td>' + escHtml(p.brand || '-') + '</td>' +
        '<td>' + escHtml(p.tags || '-') + '</td>' +
        '<td style="font-weight:700">' + price + '</td>' +
        '<td>' + moq + '</td>' +
        '<td><div class="tbl-act">' +
          '<button class="tbl-act-btn view" onclick="editProduct(\'' + (p.id||p.sku) + '\')">编辑</button>' +
          '<button class="tbl-act-btn del" onclick="deleteProduct(\'' + (p.id||p.sku) + '\')">删除</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  window.filterProducts = function() {
    var q = (document.getElementById('prodSearchInput').value || '').toLowerCase().trim();
    if (!window._allProducts) return;
    if (!q) {
      renderProductRows(window._allProducts);
      document.getElementById('prodResultCount').textContent = '共 ' + window._allProducts.length + ' 条产品';
      return;
    }
    var filtered = window._allProducts.filter(function(p) {
      return (p.name||'').toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q);
    });
    renderProductRows(filtered);
    document.getElementById('prodResultCount').textContent = '共 ' + filtered.length + ' 条（筛选自 ' + window._allProducts.length + '）';
    if (filtered.length === 0) document.getElementById('productsEmpty').style.display = 'block';
  };
  window._filterProductsDebounced = debounce(window.filterProducts, 300);

  window.filterCustomers = function() {
    var q = (document.getElementById('custSearchInput').value || '').toLowerCase().trim();
    var country = document.getElementById('filterCountry').value;
    var source = document.getElementById('filterSource').value;
    var cycle = document.getElementById('filterCycle').value;

    var filtered = allCustomers.filter(function(u) {
      var matchQ = !q || (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q) || (u.company||'').toLowerCase().includes(q);
      var matchC = !country || u.country === country;
      var matchS = !source || u.source === source;
      var matchCy = !cycle || u.purchase_cycle === cycle;
      return matchQ && matchC && matchS && matchCy;
    });
    renderCustomerRows(filtered);
  };
  window._filterCustomersDebounced = debounce(window.filterCustomers, 300);

  window.editProduct = function(id) {
    window.location.href = 'product-publish.html?edit=' + id;
  };

  window.editDraft = function(id) {
    window.location.href = 'product-publish.html?edit=' + id;
  };

  window.deleteProduct = function(id) {
    if (!confirm('确定删除此产品？')) return;
    PandaAPI.Products.remove(id)
      .then(function() {
        toast('产品已移入回收站', 'success');
        loadProductList();
        loadTrash();
      })
      .catch(function(){ toast('删除失败', 'error'); });
  };

  // ---- Trash ----
  function loadTrash() {
    PandaAPI.Products.adminList({ visibility: 'trash', pageSize: 9999 })
      .then(function(res) {
        var trashed = (res && res.products) || [];
      if (trashed.length === 0) {
        document.getElementById('trashTableBody').innerHTML = '';
        document.getElementById('trashEmpty').style.display = 'block';
        document.getElementById('trashResultCount').textContent = '';
        return;
      }
      document.getElementById('trashEmpty').style.display = 'none';
      document.getElementById('trashResultCount').textContent = '共 ' + trashed.length + ' 条';
      document.getElementById('trashTableBody').innerHTML = trashed.map(function(p) {
        var img = p.images && p.images.length > 0
          ? '<img class="tbl-img" src="' + p.images[0] + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
            + '<div class="tbl-img-placeholder" style="display:none"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/></svg></div>'
          : '<div class="tbl-img-placeholder"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/></svg></div>';
        return '<tr>' +
          '<td>' + img + '</td>' +
          '<td style="font-weight:600;color:var(--orange);font-size:12px">' + escHtml(p.sku || '-') + '</td>' +
          '<td style="font-weight:700">' + escHtml(p.name_zh || '-') + '</td>' +
          '<td>' + escHtml(p.brand || '-') + '</td>' +
          '<td>' + escHtml(p.updated_at ? p.updated_at.slice(0,10) : '-') + '</td>' +
          '<td><div class="tbl-act">' +
            '<button class="tbl-act-btn restore" onclick="restoreProduct(\'' + (p.id||p.sku) + '\')">恢复</button>' +
            '<button class="tbl-act-btn del" onclick="permanentDelete(\'' + (p.id||p.sku) + '\')">永久删除</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }).catch(function(){});
  }

  function loadDrafts() {
    showSkeleton('draftsTableBody', ['long', 'medium', 'short', 'btn']);
    document.getElementById('draftsEmpty').style.display = 'none';
    PandaAPI.Products.adminList({ visibility: 'all', pageSize: 9999 })
      .then(function(res) {
        var prods = (res && res.products) || [];
        var drafts = prods.filter(function(p) { return p.status === 'draft'; });
        document.getElementById('asb-draft-count').textContent = drafts.length;
        document.getElementById('asb-draft-count').style.display = drafts.length > 0 ? '' : 'none';
        if (drafts.length === 0) {
          document.getElementById('draftsTableBody').innerHTML = '';
          document.getElementById('draftsEmpty').style.display = 'block';
          document.getElementById('draftResultCount').textContent = '';
          return;
        }
        document.getElementById('draftsEmpty').style.display = 'none';
        document.getElementById('draftResultCount').textContent = '共 ' + drafts.length + ' 条草稿';
        document.getElementById('draftsTableBody').innerHTML = drafts.map(function(p) {
          return '<tr>' +
            '<td style="font-weight:600;color:var(--orange);font-size:12px">' + escHtml(p.sku || '-') + '</td>' +
            '<td style="font-weight:700">' + escHtml(p.name_zh || '-') + '</td>' +
            '<td>' + escHtml(p.brand || '-') + '</td>' +
            '<td>' + escHtml(p.updated_at ? p.updated_at.slice(0,16).replace('T',' ') : '-') + '</td>' +
            '<td><div class="tbl-act">' +
              '<button class="tbl-act-btn edit" onclick="editDraft(\'' + (p.id||p.sku) + '\')">编辑</button>' +
              '<button class="tbl-act-btn del" onclick="permanentDelete(\'' + (p.id||p.sku) + '\')">删除</button>' +
            '</div></td>' +
          '</tr>';
        }).join('');
      })
      .catch(function() {
        showError('draftsTableBody', '草稿加载失败，请刷新');
      });
  }

  window.restoreProduct = function(id) {
    PandaAPI.Products.restore(id)
      .then(function() {
        toast('产品已恢复', 'success');
        loadTrash();
        loadProductList();
      }).catch(function(){ toast('恢复失败', 'error'); });
  };

  window.permanentDelete = function(id) {
    if (!confirm('⚠️ 永久删除后无法恢复，确定继续？')) return;
    PandaAPI.Products.permanentDelete(id)
      .then(function() {
        toast('已永久删除', 'success');
        loadTrash();
      }).catch(function(){ toast('删除失败', 'error'); });
  };

  // ---- Customers ----
  var allCustomers = [];

  function loadCustomers() {
    showSkeleton('customersTableBody', ['short', 'medium', 'short', 'long', 'short', 'short', 'short', 'btn']);
    document.getElementById('customersEmpty').style.display = 'none';
    PandaAPI.Users.list()
      .then(function(data) {
        if (!data || !Array.isArray(data.users)) return;
        allCustomers = data.users;
        renderCustomerRows(allCustomers);
        // Populate country filter
        var countries = {};
        allCustomers.forEach(function(u){ if(u.country) countries[u.country]=1; });
        var sel = document.getElementById('filterCountry');
        var cur = sel.value;
        sel.innerHTML = '<option value="">全部国家</option>' + Object.keys(countries).sort().map(function(c){ return '<option>'+c+'</option>'; }).join('');
        sel.value = cur;
      }).catch(function() {
        showError('customersTableBody', '客户列表加载失败，请刷新');
      });
  }

  function renderCustomerRows(customers) {
    if (!customers || customers.length === 0) {
      document.getElementById('customersTableBody').innerHTML = '';
      document.getElementById('customersEmpty').style.display = 'block';
      document.getElementById('custResultCount').textContent = '';
      return;
    }
    document.getElementById('customersEmpty').style.display = 'none';
    document.getElementById('custResultCount').textContent = '共 ' + customers.length + ' 条';
    document.getElementById('customersTableBody').innerHTML = customers.map(function(u) {
      return '<tr onclick="showCustomerModal(\'' + u.id + '\')" style="cursor:pointer">' +
        '<td style="font-weight:700">' + escHtml(u.name || '-') + '</td>' +
        '<td>' + escHtml(u.company || '-') + '</td>' +
        '<td>' + escHtml(u.country || '-') + '</td>' +
        '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(u.email || '-') + '</td>' +
        '<td>' + escHtml(u.whatsapp || '-') + '</td>' +
        '<td>' + escHtml(u.categories || '-') + '</td>' +
        '<td>' + escHtml(u.source || '-') + '</td>' +
        '<td>' + escHtml(u.created_at ? u.created_at.slice(0,10) : '-') + '</td>' +
        '<td><div class="tbl-act"><button class="tbl-act-btn view" onclick="event.stopPropagation();showCustomerModal(\'' + u.id + '\')">详情</button></div></td>' +
      '</tr>';
    }).join('');
  }

  window.filterCustomers = function() {
    var q = (document.getElementById('custSearchInput').value || '').toLowerCase().trim();
    var country = document.getElementById('filterCountry').value;
    var source = document.getElementById('filterSource').value;
    var cycle = document.getElementById('filterCycle').value;

    var filtered = allCustomers.filter(function(u) {
      var matchQ = !q || (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q) || (u.company||'').toLowerCase().includes(q);
      var matchC = !country || u.country === country;
      var matchS = !source || u.source === source;
      var matchCy = !cycle || u.purchase_cycle === cycle;
      return matchQ && matchC && matchS && matchCy;
    });
    renderCustomerRows(filtered);
  };

  window.showCustomerModal = function(id) {
    var u = allCustomers.find(function(x){ return x.id == id; });
    if (!u) return;
    var fields = [
      ['姓名', u.name], ['公司', u.company], ['职位', u.title],
      ['国家', u.country], ['邮箱', u.email], ['电话', u.phone],
      ['WhatsApp', u.whatsapp], ['LinkedIn', u.linkedin], ['Facebook', u.facebook],
      ['传真', u.fax], ['官网', u.website],
      ['采购用途', u.usage], ['采购量', u.quantity], ['采购周期', u.purchase_cycle],
      ['来源', u.source], ['采购类别', u.categories],
      ['注册时间', u.created_at ? u.created_at.slice(0,16).replace('T',' ') : '-'],
      ['备注', u.notes]
    ];
    document.getElementById('modalTitle').textContent = '客户详情：' + (u.name || u.email);
    document.getElementById('modalBody').innerHTML = '<div class="modal-grid">' +
      fields.filter(function(f){ return f[1]; }).map(function(f) {
        return '<div class="modal-field"><div class="mf-label">' + f[0] + '</div><div class="mf-val">' + escHtml(String(f[1])) + '</div></div>';
      }).join('') + '</div>';
    window._deletingUserId = id;
    document.getElementById('modalOverlay').classList.add('open');
  };

  window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('open');
  };

  window.deleteCustomerModal = function() {
    if (!window._deletingUserId) return;
    if (!confirm('确定删除此客户？')) return;
    PandaAPI.Users.delete(window._deletingUserId)
      .then(function() {
        toast('客户已删除', 'success');
        closeModal();
        loadCustomers();
      }).catch(function(){ toast('删除失败', 'error'); });
  };

  // ---- Orders ----
  function loadOrders() {
    showSkeleton('allOrdersTableBody', ['short', 'short', 'short', 'short', 'medium', 'short', 'short', 'btn']);
    document.getElementById('allOrdersEmpty').style.display = 'none';
    PandaAPI.Orders.adminList()
      .then(function(data) {
        if (!data || !Array.isArray(data.orders)) {
          document.getElementById('allOrdersEmpty').style.display = 'block';
          return;
        }
        document.getElementById('allOrdersEmpty').style.display = 'none';
        var statusMap = {
          'pending': '<span class="status-badge pending">待处理</span>',
          'processing': '<span class="status-badge new">处理中</span>',
          'shipped': '<span class="status-badge active">已发货</span>',
          'delivered': '<span class="status-badge active">已送达</span>',
          'cancelled': '<span class="status-badge closed">已取消</span>'
        };
        document.getElementById('allOrdersTableBody').innerHTML = data.orders.map(function(o) {
          var amt = (parseFloat(o.total) || 0) > 0 ? '$' + parseFloat(o.total).toLocaleString('en',{minimumFractionDigits:2}) : '—';
          var st = statusMap[o.status] || '<span class="status-badge">' + escHtml(o.status || '-') + '</span>';
          var itemsHtml = (o.items && o.items.length > 0) ? o.items.map(function(item) {
            return '<div style="display:flex;gap:16px"><span>' + escHtml(item.name || item.sku || '-') + '</span><span>x' + (item.quantity || 1) + '</span><span>' + (item.subtotal ? '$' + parseFloat(item.subtotal).toFixed(2) : '-') + '</span></div>';
          }).join('') : '<span style="color:#999">无</span>';
          var detailRow = '<tr class="detail-row" id="odetail-' + o.id + '" style="display:none"><td colspan="8" style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;color:#374151;margin-bottom:8px">' +
              '<div><strong>订单号：</strong>' + escHtml(o.order_no || '-') + '</div>' +
              '<div><strong>客户邮箱：</strong>' + escHtml(o.user_email || '-') + '</div>' +
              '<div><strong>收货地址：</strong>' + escHtml(o.shipping_address || '-') + '</div>' +
              '<div><strong>物流单号：</strong>' + escHtml(o.tracking_no || '暂无') + '</div>' +
              '<div><strong>快递公司：</strong>' + escHtml(o.courier || '暂无') + '</div>' +
              '<div><strong>支付方式：</strong>' + escHtml(o.payment_method || '-') + '</div>' +
              '<div><strong>备注：</strong>' + escHtml(o.notes || '无') + '</div>' +
              '<div><strong>下单时间：</strong>' + escHtml(o.created_at || '-') + '</div>' +
            '</div>' +
            '<div style="font-size:12px"><strong>商品明细：</strong>' + itemsHtml + '</div>' +
            '<div style="margin-top:6px;font-size:12px"><span>小计 <strong>$' + (parseFloat(o.subtotal)||0).toFixed(2) + '</strong></span>  <span>运费 <strong>$' + (parseFloat(o.shipping_cost)||0).toFixed(2) + '</strong></span>  <span>税费 <strong>$' + (parseFloat(o.tax)||0).toFixed(2) + '</strong></span>  <span style="color:#E85D00">总计 <strong>$' + (parseFloat(o.total)||0).toFixed(2) + '</strong></span></div>' +
          '</td></tr>';
          return '<tr class="main-row" onclick="toggleOrderDetail(\'' + o.id + '\')" style="cursor:pointer">' +
            '<td style="font-weight:700">' + escHtml(o.customer_name || '-') + '</td>' +
            '<td>' + escHtml(o.country || '-') + '</td>' +
            '<td>' + (o.items && o.items.length > 0 ? o.items.length + '件商品' : '-') + '</td>' +
            '<td>' + (o.quantity || '-') + '</td>' +
            '<td style="font-weight:700">' + amt + '</td>' +
            '<td>' + st + '</td>' +
            '<td>' + escHtml(o.created_at ? o.created_at.slice(0,10) : '-') + '</td>' +
            '<td onclick="event.stopPropagation()"><div class="tbl-act">' +
              '<select class="tbl-act-btn" style="cursor:pointer;border-radius:4px;font-size:11px;padding:3px 8px;" onchange="updateOrderStatus(\'' + o.id + '\',this.value)">' +
                '<option value="">改状态</option>' +
                '<option value="pending">待处理</option>' +
                '<option value="processing">处理中</option>' +
                '<option value="shipped">已发货</option>' +
                '<option value="delivered">已送达</option>' +
                '<option value="cancelled">已取消</option>' +
              '</select>' +
            '</div></td>' +
          '</tr>' + detailRow;
        }).join('');
      }).catch(function() {
        showError('allOrdersTableBody', '订单列表加载失败，请刷新');
      });
  }

  window.toggleOrderDetail = function(id) {
    var el = document.getElementById('odetail-' + id);
    if (el) el.style.display = el.style.display === 'none' ? 'table-row' : 'none';
  };

  window.updateOrderStatus = function(id, status) {
    if (!status) return;
    PandaAPI.Orders.updateStatus(id, status)
      .then(function() {
        toast('状态已更新', 'success');
        loadOrders();
      }).catch(function(){ toast('更新失败', 'error'); });
  };

  // ---- Inquiries ----
  function loadInquiries() {
    showSkeleton('inquiriesTableBody', ['short', 'long', 'short', 'medium', 'short', 'short', 'btn']);
    document.getElementById('inquiriesEmpty').style.display = 'none';
    PandaAPI.Inquiries.adminList()
      .then(function(data) {
        if (!data || !Array.isArray(data.inquiries)) {
          document.getElementById('inquiriesEmpty').style.display = 'block';
          return;
        }
        document.getElementById('asb-inq-count').textContent = data.inquiries.filter(function(i){ return i.status !== 'replied' && i.status !== 'closed'; }).length;
        document.getElementById('ov-inquiries').textContent = data.inquiries.filter(function(i){ return i.status !== 'replied' && i.status !== 'closed'; }).length;
        document.getElementById('inquiriesEmpty').style.display = 'none';
        var statusMap = {
          'new': '<span class="status-badge new">新询盘</span>',
          'pending': '<span class="status-badge pending">待回复</span>',
          'replied': '<span class="status-badge replied">已回复</span>',
          'closed': '<span class="status-badge closed">已关闭</span>'
        };
        document.getElementById('inquiriesTableBody').innerHTML = data.inquiries.map(function(i) {
          var detailRow = '<tr class="detail-row" id="idetail-' + i.id + '" style="display:none"><td colspan="10" style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb">' +
            '<div style="font-size:12px;color:#374151;margin-bottom:6px"><strong>询盘详情：</strong></div>' +
            '<div style="font-size:12px;line-height:1.8">' +
              '<div><strong>联系邮箱：</strong>' + escHtml(i.email || '-') + '</div>' +
              '<div><strong>WhatsApp：</strong>' + escHtml(i.whatsapp || '-') + '</div>' +
              '<div><strong>公司：</strong>' + escHtml(i.company || '-') + '</div>' +
              '<div><strong>所属行业：</strong>' + escHtml(i.usage || '-') + '</div>' +
              '<div><strong>询盘产品：</strong>' + escHtml(i.product_name || i.product_sku || '-') + '</div>' +
              '<div><strong>采购数量：</strong>' + escHtml(i.quantity || '-') + '</div>' +
              '<div><strong>询盘内容：</strong><span style="background:#f3f4f6;padding:4px 8px;border-radius:4px;display:inline-block;max-width:600px">' + escHtml(i.message || '无') + '</span></div>' +
              (i.reply_message ? '<div style="margin-top:4px"><strong>回复内容：</strong><span style="background:#fff7ed;padding:4px 8px;border-radius:4px;border:1px solid #fed7aa;color:#c2410c;display:inline-block;max-width:600px">' + escHtml(i.reply_message) + '</span></div>' : '') +
              '<div><strong>提交时间：</strong>' + escHtml(i.created_at || '-') + '</div>' +
            '</div>' +
          '</td></tr>';
          return '<tr class="main-row" onclick="toggleInquiryDetail(\'' + i.id + '\')" style="cursor:pointer">' +
            '<td style="font-weight:700">' + escHtml(i.name || '-') + '</td>' +
            '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(i.email || '-') + '</td>' +
            '<td>' + escHtml(i.whatsapp || '-') + '</td>' +
            '<td>' + escHtml(i.company || '-') + '</td>' +
            '<td>' + escHtml(i.product_name || i.product_sku || '-') + '</td>' +
            '<td>' + escHtml(i.quantity || '-') + '</td>' +
            '<td>' + escHtml(i.usage || '-') + '</td>' +
            '<td>' + (statusMap[i.status] || '<span class="status-badge">' + escHtml(i.status||'-') + '</span>') + '</td>' +
            '<td>' + escHtml(i.created_at ? i.created_at.slice(0,10) : '-') + '</td>' +
            '<td onclick="event.stopPropagation()"><div class="tbl-act">' +
              '<button class="tbl-act-btn view" onclick="replyInquiry(\'' + i.id + '\')">回复</button>' +
              '<button class="tbl-act-btn del" onclick="closeInquiry(\'' + i.id + '\')">关闭</button>' +
            '</div></td>' +
          '</tr>' + detailRow;
        }).join('');
      }).catch(function() {
        showError('inquiriesTableBody', '询盘列表加载失败，请刷新');
      });
  }

  window.replyInquiry = function(id) {
    var reply = prompt('请输入回复内容：');
    if (!reply || !reply.trim()) return;
    PandaAPI.Inquiries.reply(id, reply)
      .then(function() {
        toast('回复已发送', 'success');
        loadInquiries();
      }).catch(function(){ toast('回复失败', 'error'); });
  };

  window.toggleInquiryDetail = function(id) {
    var el = document.getElementById('idetail-' + id);
    if (el) el.style.display = el.style.display === 'none' ? 'table-row' : 'none';
  };

  window.closeInquiry = function(id) {
    PandaAPI.Inquiries.close(id)
      .then(function() {
        toast('询盘已关闭', 'success');
        loadInquiries();
      }).catch(function(){ toast('操作失败', 'error'); });
  };

  // ---- Add Customer ----
  window.adminAddCustomer = function() {
    var name = document.getElementById('af_name').value.trim();
    var email = document.getElementById('af_email').value.trim();
    var company = document.getElementById('af_company').value.trim();
    var country = document.getElementById('af_country').value;
    if (!name || !email) { toast('姓名和邮箱为必填项', 'error'); return; }
    var payload = {
      name: name,
      email: email,
      company: company,
      country: country,
      title: document.getElementById('af_title').value.trim(),
      password: document.getElementById('af_password').value.trim(),
      whatsapp: document.getElementById('af_whatsapp').value.trim(),
      linkedin: document.getElementById('af_linkedin').value.trim(),
      facebook: document.getElementById('af_facebook').value.trim(),
      fax: document.getElementById('af_fax').value.trim(),
      phone: document.getElementById('af_phone').value.trim(),
      website: document.getElementById('af_website').value.trim(),
      address: document.getElementById('af_address').value.trim(),
      usage: document.getElementById('af_usage').value,
      quantity: document.getElementById('af_quantity').value,
      purchase_cycle: document.getElementById('af_cycle').value,
      source: document.getElementById('af_source').value,
      categories: document.getElementById('af_categories').value.trim(),
      notes: document.getElementById('af_notes').value.trim()
    };
    PandaAPI.Auth.register(payload)
      .then(function(data) {
        if (data && data.token) {
          toast('客户添加成功', 'success');
          clearAddForm();
          sdashShow('customers');
          loadCustomers();
        } else {
          toast('添加失败：' + (data && data.message ? data.message : '未知错误'), 'error');
        }
      }).catch(function(){ toast('添加失败', 'error'); });
  };

  window.clearAddForm = function() {
    ['af_name','af_company','af_title','af_email','af_password','af_whatsapp',
     'af_linkedin','af_facebook','af_fax','af_phone','af_website','af_address',
     'af_categories','af_notes'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['af_country','af_usage','af_quantity','af_cycle','af_source'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
  };

  // ---- Reports ----
  function loadReports() {
    PandaAPI.Users.list()
      .then(function(data) {
        if (!data || !Array.isArray(data.users)) return;
        var cats={}, sources={}, cycles={}, qtys={};
        data.users.forEach(function(u) {
          if(u.categories) cats[u.categories]=(cats[u.categories]||0)+1;
          if(u.source) sources[u.source]=(sources[u.source]||0)+1;
          if(u.purchase_cycle) cycles[u.purchase_cycle]=(cycles[u.purchase_cycle]||0)+1;
          if(u.quantity) qtys[u.quantity]=(qtys[u.quantity]||0)+1;
        });
        renderBarChart('catChart', cats);
        renderBarChart('sourceChart', sources);
        renderBarChart('cycleChart', cycles);
        renderBarChart('qtyChart', qtys);
      }).catch(function(){});
  }

  // ---- Analytics ----
  function loadAnalytics() {
    loadReports(); // same data for now
  }

  function renderBarChart(elId, data) {
    var el = document.getElementById(elId);
    if (!el) return;
    var sorted = Object.entries(data).sort(function(a,b){ return b[1]-a[1]; }).slice(0, 8);
    if (sorted.length === 0) { el.innerHTML = '<div style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">暂无数据</div>'; return; }
    var max = sorted[0][1];
    el.innerHTML = sorted.map(function(e) {
      return '<div class="bc-row"><span class="bc-name">' + e[0] + '</span><div class="bc-track"><div class="bc-fill" style="width:' + Math.round(e[1]/max*100) + '%"></div></div><span class="bc-val">' + e[1] + '</span></div>';
    }).join('');
  }

  // ---- Cases (localStorage) ----
  var CASES_KEY = 'panda_admin_cases';

  function loadCases() {
    var tbody = document.getElementById('casesTableBody');
    var empty = document.getElementById('casesEmpty');
    if (!tbody) return;
    var cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
    if (cases.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    tbody.innerHTML = cases.map(function(c) {
      return '<tr>' +
        '<td style="font-weight:700">' + escHtml(c.client || '-') + '</td>' +
        '<td>' + escHtml(c.industry || '-') + '</td>' +
        '<td>' + escHtml(c.region || '-') + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + escHtml(c.desc || '') + '">' + escHtml(c.desc || '-') + '</td>' +
        '<td>' + escHtml(c.date || '-') + '</td>' +
        '<td><div class="tbl-act">' +
          '<button class="tbl-act-btn del" onclick="deleteCase(\'' + c.id + '\')">删除</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  window.showAddCaseModal = function() {
    var client = prompt('客户名称:');
    if (!client) return;
    var industry = prompt('所属行业:') || '';
    var region = prompt('地区:') || '';
    var desc = prompt('案例描述:') || '';
    var date = new Date().toISOString().slice(0, 10);
    var cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
    cases.push({ id: Date.now(), client: client, industry: industry, region: region, desc: desc, date: date });
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
    toast('案例添加成功', 'success');
    loadCases();
  };

  window.deleteCase = function(id) {
    if (!confirm('确定删除此案例?')) return;
    var cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
    cases = cases.filter(function(c){ return c.id != id; });
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
    toast('案例已删除', 'success');
    loadCases();
  };

  // ---- Brands (localStorage) ----
  var BRANDS_KEY = 'panda_admin_brands';

  function loadBrands() {
    var tbody = document.getElementById('brandsTableBody');
    var empty = document.getElementById('brandsEmpty');
    if (!tbody) return;
    var brands = JSON.parse(localStorage.getItem(BRANDS_KEY) || '[]');
    if (brands.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    var statusMap = { 'pending': '<span class="status-badge pending">待审核</span>', 'approved': '<span class="status-badge active">已通过</span>', 'rejected': '<span class="status-badge closed">已拒绝</span>' };
    tbody.innerHTML = brands.map(function(b) {
      return '<tr>' +
        '<td style="font-weight:700">' + escHtml(b.company || '-') + '</td>' +
        '<td>' + escHtml(b.contact || '-') + '</td>' +
        '<td>' + escHtml(b.mode || '-') + '</td>' +
        '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(b.email || '-') + '</td>' +
        '<td>' + (statusMap[b.status] || '<span class="status-badge">' + escHtml(b.status||'') + '</span>') + '</td>' +
        '<td>' + escHtml(b.date || '-') + '</td>' +
        '<td><div class="tbl-act">' +
          '<button class="tbl-act-btn" onclick="updateBrandStatus(\'' + b.id + '\')">审核</button>' +
          '<button class="tbl-act-btn del" onclick="deleteBrand(\'' + b.id + '\')">删除</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  window.showAddBrandModal = function() {
    var company = prompt('公司名称:');
    if (!company) return;
    var contact = prompt('联系人:') || '';
    var mode = prompt('合作模式 (OEM/ODM/区域代理/品牌联名):') || '';
    var email = prompt('邮箱:') || '';
    var date = new Date().toISOString().slice(0, 10);
    var brands = JSON.parse(localStorage.getItem(BRANDS_KEY) || '[]');
    brands.push({ id: Date.now(), company: company, contact: contact, mode: mode, email: email, status: 'pending', date: date });
    localStorage.setItem(BRANDS_KEY, JSON.stringify(brands));
    toast('授权申请添加成功', 'success');
    loadBrands();
  };

  window.updateBrandStatus = function(id) {
    var brands = JSON.parse(localStorage.getItem(BRANDS_KEY) || '[]');
    var b = brands.find(function(x){ return x.id == id; });
    if (!b) return;
    var s = prompt('设置状态 (pending/approved/rejected):', b.status);
    if (!s) return;
    b.status = s;
    localStorage.setItem(BRANDS_KEY, JSON.stringify(brands));
    toast('状态已更新', 'success');
    loadBrands();
  };

  window.deleteBrand = function(id) {
    if (!confirm('确定删除此申请?')) return;
    var brands = JSON.parse(localStorage.getItem(BRANDS_KEY) || '[]');
    brands = brands.filter(function(b){ return b.id != id; });
    localStorage.setItem(BRANDS_KEY, JSON.stringify(brands));
    toast('已删除', 'success');
    loadBrands();
  };

  // ---- Enhanced analytics ----
  window.loadAnalytics = function() {
    loadReports();
    PandaAPI.Users.list()
      .then(function(data) {
        if (!data || !Array.isArray(data.users)) return;
        var monthly = {};
        data.users.forEach(function(u) {
          var m = (u.created_at || '').slice(0, 7);
          if (m) monthly[m] = (monthly[m] || 0) + 1;
        });
        renderBarChart('monthlyChart', monthly);
      }).catch(function(){});
    PandaAPI.Users.list()
      .then(function(data) {
        if (!data || !Array.isArray(data.users)) return;
        var ind = {};
        data.users.forEach(function(u) {
          var c = u.usage || u.categories || '其他';
          ind[c] = (ind[c] || 0) + 1;
        });
        renderBarChart('industryChart', ind);
      }).catch(function(){});
  };

  // ---- Publish Form (inline) ----
  // Image upload preview
  (function() {
    var uploadZone = document.getElementById('pub-upload-zone');
    if (!uploadZone) return;
    var fileInput = document.getElementById('p-images');
    var preview = document.getElementById('pub-img-preview');
    uploadZone.addEventListener('click', function() { fileInput.click(); });
    uploadZone.addEventListener('dragover', function(e) { e.preventDefault(); uploadZone.style.borderColor = '#E85D00'; });
    uploadZone.addEventListener('dragleave', function() { uploadZone.style.borderColor = '#E0D9D2'; });
    uploadZone.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadZone.style.borderColor = '#E0D9D2';
      fileInput.files = e.dataTransfer.files;
      window.renderPreviews();
    });
    fileInput.addEventListener('change', function() { window.renderPreviews(); });
    window.renderPreviews = function() {
      if (!preview) return;
      preview.innerHTML = '';
      Array.from(fileInput.files).slice(0, 10).forEach(function(f) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var div = document.createElement('div');
          div.className = 'pub-img-thumb';
          div.innerHTML = '<img src="' + e.target.result + '" alt="">';
          preview.appendChild(div);
        };
        reader.readAsDataURL(f);
      });
    };
  })();

  // ── 品牌选择后动态渲染属性字段 ────────────────────────────────────
  window.renderBrandAttrs = function(brand) {
    var section = document.getElementById('brand-attrs-section');
    var container = document.getElementById('dynamic-attrs-container');
    if (!section || !container) return;

    if (!brand) {
      section.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    // 获取品牌的属性配置
    var config = window.PandaAttrConfig ? window.PandaAttrConfig.getFieldsByBrand(brand) : null;
    var fields = config && config.tech ? config.tech : [];

    if (!fields.length) {
      section.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    section.style.display = 'block';
    var html = '<div class="pub-ali-table">';

    for (var i = 0; i < fields.length; i += 2) {
      var f1 = fields[i];
      var f2 = fields[i + 1];
      html += '<div class="pub-ali-row">';

      // 第一个字段
      if (f1) {
        var inputId1 = 'p-attr-' + f1.key;
        html += '<div class="pub-ali-k">' + f1.label + '</div>';
        html += '<div class="pub-ali-v"><input type="text" id="' + inputId1 + '" class="pub-input" data-attr-key="' + f1.key + '" placeholder="请输入' + f1.label + '"></div>';
      } else {
        html += '<div class="pub-ali-k"></div><div class="pub-ali-v"></div>';
      }

      // 第二个字段
      if (f2) {
        var inputId2 = 'p-attr-' + f2.key;
        html += '<div class="pub-ali-k">' + f2.label + '</div>';
        html += '<div class="pub-ali-v"><input type="text" id="' + inputId2 + '" class="pub-input" data-attr-key="' + f2.key + '" placeholder="请输入' + f2.label + '"></div>';
      } else {
        html += '<div class="pub-ali-k"></div><div class="pub-ali-v"></div>';
      }

      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  };

  // 页面加载时检查是否已有品牌选中值，如果有则渲染
  (function initBrandAttrs() {
    var brandSelect = document.getElementById('p-brand');
    if (brandSelect && brandSelect.value) {
      window.renderBrandAttrs(brandSelect.value);
    }
  })();

  // Submit handler
  var pubForm = document.getElementById('admin-pub-form');
  if (pubForm) {
    // 存入草稿
    var draftBtn = document.getElementById('admin-pub-draft-btn');
    if (draftBtn) {
      draftBtn.addEventListener('click', function() {
        draftBtn.disabled = true;
        draftBtn.textContent = '保存中...';
        var payload = {
          sku: document.getElementById('p-sku').value.trim() || ('DRAFT-' + Date.now()),
          name_zh: document.getElementById('p-name-zh').value.trim() || '未命名草稿',
          status: 'draft',
          visibility: 'hidden',
          brand: document.getElementById('p-brand').value,
        };
        // 收集动态品牌属性
        var brand = document.getElementById('p-brand').value;
        if (brand && window.PandaAttrConfig) {
          var config = window.PandaAttrConfig.getFieldsByBrand(brand);
          if (config && config.tech && config.tech.length) {
            payload.attributes = {};
            for (var i = 0; i < config.tech.length; i++) {
              var field = config.tech[i];
              var input = document.getElementById('p-attr-' + field.key);
              if (input && input.value.trim()) {
                payload.attributes[field.key] = input.value.trim();
              }
            }
          }
        }
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('panda_token') },
          body: JSON.stringify(payload)
        }).then(function(r) {
          if (!r.ok) { alert('保存草稿失败'); draftBtn.disabled = false; draftBtn.textContent = '存入草稿'; return; }
          alert('已存入草稿');
          document.getElementById('admin-pub-form').reset();
          sdashShow('product-list');
        }).catch(function(err) {
          alert('网络错误：' + err.message);
          draftBtn.disabled = false;
          draftBtn.textContent = '存入草稿';
        });
      });
    }

    pubForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = document.getElementById('pub-submit-btn');
      btn.disabled = true;
      btn.textContent = '发布中...';
      var payload = {
        sku: document.getElementById('p-sku').value.trim(),
        name_zh: document.getElementById('p-name-zh').value.trim(),
        name_en: document.getElementById('p-name-en').value.trim(),
        short_desc_zh: document.getElementById('p-short-zh').value.trim(),
        short_desc_en: document.getElementById('p-short-en').value.trim(),
        desc_zh: document.getElementById('p-desc-zh').value.trim(),
        desc_en: document.getElementById('p-desc-en').value.trim(),
        brand: document.getElementById('p-brand').value || 'panda-shield',
        tags: document.getElementById('p-tags').value.trim(),
        industries: document.getElementById('p-industries').value.trim(),
        certifications: document.getElementById('p-certs').value.trim(),
        sports: '',
        video_url: '',
        price_usd: parseFloat(document.getElementById('p-price').value) || 0,
        moq: parseInt(document.getElementById('p-moq').value) || 50,
        lead_time_days: parseInt(document.getElementById('p-lead').value) || 7,
        status: document.getElementById('p-status').value || 'published',
        visibility: document.getElementById('p-visibility').value || 'visible',
        specs: JSON.stringify({
          model:            document.getElementById('p-model').value.trim(),
          material:         document.getElementById('p-material').value.trim(),
          weight:           document.getElementById('p-weight').value.trim(),
          length:           document.getElementById('p-length').value.trim(),
          thickness:        document.getElementById('p-thickness').value.trim(),
          color:            document.getElementById('p-color').value.trim(),
          coating:          document.getElementById('p-coating').value.trim(),
          package_spec:     document.getElementById('p-package').value.trim(),
          protection_level: document.getElementById('p-level').value.trim(),
          temp_range:       document.getElementById('p-temp').value.trim(),
          size_range:       document.getElementById('p-size').value.trim(),
          standard:         document.getElementById('p-standard').value.trim(),
          scenes:           document.getElementById('p-scenes').value.trim(),
          warranty:         document.getElementById('p-warranty').value.trim(),
          en388_abrasion:   document.getElementById('p-en388-abrasion').value,
          en388_cut:        document.getElementById('p-en388-cut').value,
          en388_tear:       document.getElementById('p-en388-tear').value.trim(),
          en388_puncture:   document.getElementById('p-en388-puncture').value,
          iso13997_cut:     document.getElementById('p-iso-cut').value.trim(),
          ansi_level:       document.getElementById('p-ansi-level').value.trim(),
          custom_logo:      document.getElementById('p-custom-logo').value,
          custom_pack:      document.getElementById('p-custom-pack').value,
          custom_graphic:   document.getElementById('p-custom-graphic').value,
          custom_moq:       document.getElementById('p-custom-moq').value.trim(),
          pkg_size:         document.getElementById('p-pkg-size').value.trim(),
          gross_weight:     document.getElementById('p-gross-weight').value.trim(),
          carton_size:      document.getElementById('p-carton-size').value.trim(),
        })
      };

      // 收集动态品牌属性到 attributes
      var brand = document.getElementById('p-brand').value;
      if (brand && window.PandaAttrConfig) {
        var config = window.PandaAttrConfig.getFieldsByBrand(brand);
        if (config && config.tech && config.tech.length) {
          payload.attributes = {};
          for (var i = 0; i < config.tech.length; i++) {
            var field = config.tech[i];
            var input = document.getElementById('p-attr-' + field.key);
            if (input && input.value.trim()) {
              payload.attributes[field.key] = input.value.trim();
            }
          }
        }
      }

      if (!payload.sku || !payload.name_zh) {
        toast('SKU 和产品名称为必填项', 'error');
        btn.disabled = false;
        btn.textContent = '发布产品';
        return;
      }
      PandaAPI.Products.create(payload)
        .then(function() {
          toast('产品发布成功', 'success');
          btn.textContent = '发布成功';
          setTimeout(function() {
            sdashShow('product-list');
            loadProductList();
            document.getElementById('admin-pub-form').reset();
            if (window.renderPreviews) window.renderPreviews();
            btn.disabled = false;
            btn.textContent = '发布产品';
          }, 1000);
        })
        .catch(function(err) {
          toast('发布失败：' + (err.message || '请检查填写内容'), 'error');
          btn.disabled = false;
          btn.textContent = '发布产品';
        });
    });
  }

  // ---- Export CSV ----
  window.exportCSV = function() {
    if (!allCustomers.length) { toast('暂无数据可导出', 'error'); return; }
    var headers = ['姓名','公司','职位','国家','邮箱','电话','WhatsApp','LinkedIn','Facebook','采购用途','采购量','采购周期','来源','注册时间'];
    var rows = allCustomers.map(function(u) {
      return headers.map(function(h) {
        var key = h === '姓名' ? 'name' : h === '公司' ? 'company' : h === '职位' ? 'title' :
                  h === '国家' ? 'country' : h === '邮箱' ? 'email' : h === '电话' ? 'phone' :
                  h === 'WhatsApp' ? 'whatsapp' : h === 'LinkedIn' ? 'linkedin' : h === 'Facebook' ? 'facebook' :
                  h === '采购用途' ? 'usage' : h === '采购量' ? 'quantity' : h === '采购周期' ? 'purchase_cycle' :
                  h === '来源' ? 'source' : '注册时间';
        return '"' + (u[key]||'').replace(/"/g,'""') + '"';
      }).join(',');
    });
    var csv = '\uFEFF' + headers.map(function(h){return'"'+h+'"'}).join(',') + '\n' + rows.join('\n');
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'pandashield_customers_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click(); URL.revokeObjectURL(url);
    toast('CSV 已导出', 'success');
  };

  // ---- Toast ----
  window.toast = function(msg, type) {
    var el = document.getElementById('adminToast');
    el.textContent = msg;
    el.className = 'atoast show ' + (type || '');
    setTimeout(function(){ el.classList.remove('show'); }, 3000);
  };

  // ---- Helpers ----
  function escHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

})();
