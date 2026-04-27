
// products-all.js  v=20260417-img  (2026-04-17)
// ── 品牌映射（key 对应 products-data.js 里的 p.brand 字段）──────────────
var brandMap = {
  shield:  { name: 'PandaSHIELD™',  color: '#E85D00', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 4L6 10v14c0 11 8 18 18 20 10-2 18-9 18-20V10L24 4z" fill="#E85D00" opacity=".15" stroke="#E85D00" stroke-width="2"/><path d="M18 24l4 4 8-8" stroke="#E85D00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  pierce:  { name: 'PandaPIERCE™',  color: '#7C3AED', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 6l-4 20h8L24 6z" stroke="#7C3AED" stroke-width="2.5" stroke-linejoin="round" fill="#7C3AED" fill-opacity=".12"/><circle cx="24" cy="38" r="4" stroke="#7C3AED" stroke-width="2" fill="#7C3AED" fill-opacity=".2"/></svg>' },
  impact:  { name: 'PandaIMPACT™',  color: '#1A1108', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M14 34l-4 4m28-4l4 4M10 18H4m40 0h-6" stroke="#1A1108" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="24" r="10" stroke="#1A1108" stroke-width="2.5" fill="#1A1108" fill-opacity=".12"/><path d="M24 18v6l-4 4" stroke="#1A1108" stroke-width="2" stroke-linecap="round"/></svg>' },
  chem:    { name: 'PandaCHEM™',    color: '#2563EB', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M16 40V20l8-12 8 12v20" stroke="#2563EB" stroke-width="2.5" fill="#2563EB" fill-opacity=".12"/><path d="M10 40h28" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="30" r="2" fill="#2563EB"/><circle cx="28" cy="33" r="1.5" fill="#2563EB"/><circle cx="24" cy="27" r="1" fill="#2563EB"/></svg>' },
  bio:     { name: 'PandaBIO™',     color: '#16A34A', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 40c0-8 6-14 12-14-6 0-10-6-10-12C26 8 20 14 14 26c0-6-4-12-10-12 6 0 12 6 12 14" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/><path d="M24 20v12M20 26l4 6 4-6" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/></svg>' },
  volt:    { name: 'PandaVOLT™',    color: '#EAB308', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M26 4L14 24h10l-6 20 20-24H24l2-16z" fill="#EAB308" fill-opacity=".2" stroke="#EAB308" stroke-width="2.5" stroke-linejoin="round"/></svg>' },
  heat:    { name: 'PandaHEAT™',   color: '#DC2626', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 6c-4 8-10 12-10 20a10 10 0 0020 0c0-8-6-12-10-20z" stroke="#DC2626" stroke-width="2.5" fill="#DC2626" fill-opacity=".15"/><path d="M24 18v6M20 22c0-2 2-3 4-3s4 1 4 3" stroke="#DC2626" stroke-width="2" stroke-linecap="round"/></svg>' },
  frost:   { name: 'PandaFROST™',  color: '#06B6D4', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 4v40M4 24h40M10 10l28 28M38 10L10 38" stroke="#06B6D4" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="#06B6D4" fill-opacity=".25" stroke="#06B6D4" stroke-width="2"/></svg>' },
  grip:    { name: 'PandaGRIP™',   color: '#F59E0B', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M16 10h16v4c0 10-4 16-8 18-4-2-8-8-8-18v-4z" stroke="#F59E0B" stroke-width="2.5" fill="#F59E0B" fill-opacity=".12"/><path d="M20 22l2 2 6-6" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>' },
  eco:     { name: 'PandaECO™',    color: '#22C55E', svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M12 36c4-8 10-14 20-14-8 0-14-6-14-14 0 6-6 10-14 14 0 8 4 14 8 14z" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/><path d="M24 22v14M20 28l4 8 4-8" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/></svg>' },
};

// HTML 里 data-val 是 "PandaSHIELD" 这种形式，需要做映射到 brandMap 的 key
var brandValToKey = {
  'PandaSHIELD':  'shield',
  'PandaPIERCE':  'pierce',
  'PandaIMPACT':  'impact',
  'PandaCHEM':    'chem',
  'PandaBIO':     'bio',
  'PandaVOLT':    'volt',
  'PandaHEAT':    'heat',
  'PandaFROST':   'frost',
  'PandaGRIP':    'grip',
  'PandaECO':     'eco',
};

var certNameMap = {
  EN388: 'EN 388', ANSI: 'ANSI A4', CE: 'CE', ISO9001: 'ISO 9001', SGS: 'SGS',
  EN407: 'EN 407', EN374: 'EN 374', ANSI107: 'ANSI 107',
};

var _currentPage = 1;
var _pageSize = 20;
var _filteredProducts = [];
var _sortOrder = 'default';
var _currentView = 'grid'; // 'grid' | 'list'

// ── 产品数据源（只用本地100个产品）──────────
function _getProducts() {
  return window.__PANDA_PRODUCTS__ || [];
}

// ── 读取当前筛选状态 ──────────────────────────────────────
function _getActiveFilters() {
  var filters = { brand: [], type: [], industry: [], sport: [], cert: [] };
  // 品牌/行业/运动 checkbox
  var navCB = document.querySelectorAll('.pa-nav-checkbox:checked');
  for (var i = 0; i < navCB.length; i++) {
    var cb = navCB[i];
    var dim = cb.getAttribute('data-dim');
    var val = cb.getAttribute('data-val');
    if (dim && val && filters[dim] !== undefined) {
      filters[dim].push(val);
    }
  }
  // 检验认证 checkbox：只取 L2/L3 层（leaf层），跳过 L1 header（L1 只管展开/全选，不参与筛选）
  var certCB = document.querySelectorAll('.pa-cert-l2-item input[data-dim="cert"]:checked, .pa-cert-l3-item input[data-dim="cert"]:checked');
  var seenCerts = {}; // { labelText: true }
  for (var j = 0; j < certCB.length; j++) {
    var c = certCB[j];
    var parent = c.closest('.pa-cert-l3-item') || c.closest('.pa-cert-l2-item');
    var labelEl = parent ? (parent.querySelector('.pa-cert-l3-label') || parent.querySelector('.pa-cert-l2-label')) : null;
    var certVal = c.getAttribute('data-val') || (labelEl ? labelEl.textContent.trim() : ('cert-' + j));
    // 防重复：同 label 只推一次
    if (!seenCerts[certVal]) {
      seenCerts[certVal] = true;
      filters.cert.push(certVal);
    }
  }
  return filters;
}

// ── 产品筛选 ──────────────────────────────────────────────
function _applyFilters(products) {
  var f = _getActiveFilters();
  return products.filter(function(p) {
    // brand：HTML 里存 "PandaSHIELD"，p.brand 是 "shield"，需要转换
    if (f.brand.length > 0) {
      var pBrandKey = p.brand ? p.brand.toLowerCase().replace('panda-','') : '';
      var matched = f.brand.some(function(v) {
        var key = brandValToKey[v] || v.toLowerCase().replace('panda','');
        return pBrandKey === key || pBrandKey === v.toLowerCase();
      });
      if (!matched) return false;
    }
    if (f.type.length > 0) {
      var types = Array.isArray(p.type) ? p.type : (p.type ? [p.type] : []);
      if (!f.type.some(function(v){ return types.indexOf(v) !== -1; })) return false;
    }
    if (f.industry.length > 0) {
      // 兼容本地（industry 数组）和 API（industries 字符串/数组）
      var rawInd = p.industry || p.industries || '';
      var inds = Array.isArray(rawInd) ? rawInd : (typeof rawInd === 'string' ? rawInd.split(',').map(function(s){ return s.trim(); }) : []);
      if (!f.industry.some(function(v){ return inds.indexOf(v) !== -1; })) return false;
    }
    if (f.sport.length > 0) {
      // 兼容本地（sport 数组）和 API（sports 字符串/数组）
      var rawSport = p.sport || p.sports || '';
      var sports = Array.isArray(rawSport) ? rawSport : (typeof rawSport === 'string' ? rawSport.split(',').map(function(s){ return s.trim(); }) : []);
      if (!f.sport.some(function(v){ return sports.indexOf(v) !== -1; })) return false;
    }
    if (f.cert.length > 0) {
      // 同时兼容本地产品（p.cert 数组）和 API 产品（p.certifications 字符串/数组）
      var rawCert = p.cert || p.certifications || '';
      var certs = Array.isArray(rawCert) ? rawCert : (typeof rawCert === 'string' ? rawCert.split(',').map(function(s){ return s.trim(); }) : []);
      // 同时匹配 filter 值（如 cert-en388）和产品原始值（如 EN388）
      var matchFound = f.cert.some(function(v) {
        // 直接匹配
        if (certs.indexOf(v) !== -1) return true;
        // 通过别名映射匹配（产品原始 cert → filter 值）
        var prodVals = Object.keys(certKeyAlias).filter(function(pk) { return certKeyAlias[pk] === v; });
        return prodVals.some(function(pk) { return certs.indexOf(pk) !== -1; });
      });
      if (!matchFound) return false;
    }
    return true;
  });
}

// ── 产品排序 ──────────────────────────────────────────────
function _applySort(products) {
  var sorted = products.slice();
  var lang = document.documentElement.lang || 'zh';
  var isZh = !lang.startsWith('en');
  if (_sortOrder === 'name') {
    sorted.sort(function(a, b) {
      var na = isZh ? (a.name_zh || a.name || '') : (a.name_en || a.name || '');
      var nb = isZh ? (b.name_zh || b.name || '') : (b.name_en || b.name || '');
      return na.localeCompare(nb);
    });
  } else if (_sortOrder === 'brand') {
    sorted.sort(function(a, b) {
      return (a.brand || '').localeCompare(b.brand || '');
    });
  } else if (_sortOrder === 'new') {
    sorted.sort(function(a, b) {
      return (b.id || 0) - (a.id || 0);
    });
  } else if (_sortOrder === 'pop') {
    sorted.sort(function(a, b) {
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }
  // default: 原始顺序
  return sorted;
}

// ── 激活标签渲染 ──────────────────────────────────────────
function _renderActiveTags() {
  var container = document.getElementById('activeTags');
  if (!container) return;
  var f = _getActiveFilters();
  var tags = [];
  var dimLabels = { brand: '品牌', type: '功能', industry: '行业', sport: '运动', cert: '认证' };
  Object.keys(f).forEach(function(dim) {
    if (dim === 'cert') {
      // filter值 → 中文显示标签 反向映射表
      var certFilterToLabel = {
        'cert-en388': 'EN 388:2016+A1:2018',
        'cert-en374': 'EN 374:2016系列',
        'cert-en407': 'EN 407:2020',
        'cert-en511': 'EN 511:2006',
        'cert-en12477': 'EN 12477:2001+A1:2005',
        'cert-iso10819': 'ISO 10819:2013',
        'cert-ansi138': 'ANSI/ISEA 138-2019',
        'cert-ansi105': 'ANSI/ISEA 105',
        'cert-bs388': 'BS EN 388:2016+A1:2018',
        'cert-bs374': 'BS EN 374系列',
        'cert-bs407': 'BS EN 407:2020',
        'cert-bs511': 'BS EN 511:2006',
        'cert-gb24541': 'GB 24541-2022',
        'cert-gb24539': 'GB 24539-2021',
        'cert-gb28881': 'GB 28881-2023',
        'cert-cut': '切割防护等级',
        'cert-puncture': '穿刺防护等级',
        'cert-abrasion': '耐磨防护等级',
        'cert-tear': '抗撕裂性能',
        'cert-en388-abrasion': '耐磨性：0-4级',
        'cert-en388-cut': '耐切割性：0-5级',
        'cert-en388-tear': '抗撕裂性：0-4级',
        'cert-en388-puncture': '抗穿刺性：0-4级',
        'cert-en388-cut-af': '耐切割性 A-F级',
        'cert-en388-impact': '冲击保护：P标识'
      };
      f.cert.forEach(function(certVal) {
        tags.push({ dim: dim, val: certVal, label: certFilterToLabel[certVal] || certVal });
      });
      return;
    }
    f[dim].forEach(function(val) {
      var label = val;
      var cb = document.querySelector('.pa-nav-checkbox[data-dim="' + dim + '"][data-val="' + val + '"]');
      if (cb) {
        var textEl = cb.closest('label') ? cb.closest('label').querySelector('.pa-nav-text, .pa-brand-name') : null;
        if (textEl) label = textEl.textContent.trim();
      }
      tags.push({ dim: dim, val: val, label: label });
    });
  });
  if (tags.length === 0) {
    container.innerHTML = '';
    return;
  }
  var html = '';
  tags.forEach(function(t) {
    html += '<span class="pa-tag" data-dim="' + t.dim + '" data-val="' + t.val + '">';
    html += t.label;
    html += '<button class="pa-tag-close" onclick="_removeTag(\'' + t.dim + '\',\'' + t.val + '\')" title="移除">×</button>';
    html += '</span>';
  });
  container.innerHTML = html;
}

function _removeTag(dim, val) {
  if (dim === 'cert') {
    // 遍历 cert checkbox，找 label 匹配的
    var allCertCB = document.querySelectorAll('.pa-cert-content input[data-dim="cert"]:checked');
    allCertCB.forEach(function(c) {
      var parent = c.closest('.pa-cert-l3-item') || c.closest('.pa-cert-l2-item') || c.closest('.pa-cert-l1-header');
      var labelEl = parent ? (parent.querySelector('.pa-cert-l3-label') || parent.querySelector('.pa-cert-l2-label') || parent.querySelector('.pa-cert-l1-title')) : null;
      if (labelEl && labelEl.textContent.trim() === val) {
        c.checked = false;
      }
    });
  } else {
    var cb = document.querySelector('.pa-nav-checkbox[data-dim="' + dim + '"][data-val="' + val + '"]');
    if (cb) cb.checked = false;
  }
  _updateFilterCountBtn(dim);
  _currentPage = 1;
  renderProducts();
}

// ── 更新筛选计数按钮 ──────────────────────────────────────
function _updateFilterCountBtn(dim) {
  // 品牌系列不显示数字
  if (dim === 'brand') return;
  var btn = document.querySelector('.pa-filter-count-btn[data-dim="' + dim + '"]');
  if (!btn) return;
  var count = document.querySelectorAll('.pa-nav-checkbox[data-dim="' + dim + '"]:checked').length;
  if (count > 0) {
    btn.textContent = count;
    btn.style.display = '';
  } else {
    btn.textContent = '';
    btn.style.display = 'none';
  }
}

// ── 主渲染函数 ──────────────────────────────────────────
function renderProducts() {
  // 防御：如果产品数据还没加载，等待
  var products = _getProducts();
  if (!products || !products.length) {
    setTimeout(renderProducts, 100);
    return;
  }

  var grid = document.getElementById('paGrid');
  if (!grid) return;

  // 应用筛选 + 排序
  _filteredProducts = _applyFilters(products);
  var sorted = _applySort(_filteredProducts);

  // 更新结果数
  var countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = _filteredProducts.length;

  // 渲染激活标签
  _renderActiveTags();

  // 分页
  var totalPages = Math.max(1, Math.ceil(_filteredProducts.length / _pageSize));
  if (_currentPage > totalPages) _currentPage = totalPages;
  var start = (_currentPage - 1) * _pageSize;
  var pageProducts = sorted.slice(start, start + _pageSize);

  if (pageProducts.length === 0) {
    grid.innerHTML = '';
    var es = document.getElementById('emptyState');
    if (es) es.style.display = 'flex';
    var pg = document.getElementById('paPagination');
    if (pg) pg.style.display = 'none';
    return;
  }

  var es = document.getElementById('emptyState');
  if (es) es.style.display = 'none';

  var lang = document.documentElement.lang || 'zh';
  var isZh = !lang.startsWith('en');
  var isList = _currentView === 'list';

  var html = '';
  for (var i = 0; i < pageProducts.length; i++) {
    var p = pageProducts[i];
    var brandKey = p.brand ? p.brand.toLowerCase().replace('panda-','') : 'shield';
    var b = brandMap[brandKey] || brandMap.shield;
    var certBadge = (p.cert && p.cert[0]) ? (certNameMap[p.cert[0]] || p.cert[0]) :
                    (p.certifications ? (certNameMap[p.certifications] || p.certifications) : '');
    var certHtml = certBadge ? '<span class="pa-card-badge">' + certBadge + '</span>' : '';
    var name = isZh ? (p.name_zh || p.name || p.sku) : (p.name_en || p.name || p.sku);
    var priceLabel = p.price && p.price.tiers && p.price.tiers[0] ? p.price.tiers[0].price : (p.price && p.price.sample ? p.price.sample : '¥--');

    var isComp = _compareSkus.indexOf(p.sku) > -1;
    if (isList) {
      html += '<div class="pa-card pa-card--list" data-sku="' + p.sku + '" data-brand="' + p.brand + '">';
      var pImg = (p.images && p.images[0]) || '';
      var svgFallback = '<div class="pa-card-img-placeholder"><div class="pa-card-svg">' + b.svg + '</div></div>';
      html += '<a href="product-detail.html?id=' + p.sku + '" class="pa-card-img-link">';
      if (pImg) {
        html += '<img class="pa-card-img" src="' + pImg + '" alt="' + name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' + svgFallback + certHtml;
      } else {
        html += svgFallback + certHtml;
      }
      html += '</a>';
      html += '<div class="pa-card-body">';
      html += '<div class="pa-card-brand" style="color:' + b.color + '">' + b.name + '</div>';
      html += '<a href="product-detail.html?id=' + p.sku + '" class="pa-card-name">' + name + '</a>';
      html += '<div class="pa-card-sku" style="color:#999;font-size:12px;">SKU: ' + p.sku + '</div>';
      html += '<div class="pa-card-price">' + priceLabel + '</div>';
      html += '<button class="pa-card-cart-btn" data-sku="' + p.sku + '" onclick="addToCart(\'' + p.sku + '\');return false">加入采购清单</button>';
      html += '</div></div>';
    } else {
      html += '<div class="pa-card" data-sku="' + p.sku + '" data-brand="' + p.brand + '" data-type="' + (p.type||'') + '" data-cert="' + ((p.cert||[]).join(',')) + '">';
      html += '<div class="pa-card-img-wrap">';
      html += '<a href="product-detail.html?id=' + encodeURIComponent(p.sku) + '" class="pa-card-img-link">';
      if (p.images && p.images[0]) {
        html += '<div class="pa-card-img"><img class="pa-card-img" src="' + p.images[0] + '" alt="' + name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="pa-card-img-placeholder" style="display:none;"><div class="pa-card-svg">' + b.svg + '</div></div>' + certHtml + '</div>';
      } else {
        html += '<div class="pa-card-img"><div class="pa-card-img-placeholder"><div class="pa-card-svg">' + b.svg + '</div></div>' + certHtml + '</div>';
      }
      html += '</a>';
      html += '<label class="pa-card-compare-check" onclick="event.stopPropagation()">';
      html += '<input type="checkbox" ' + (isComp ? 'checked' : '') + ' onclick="event.stopPropagation();toggleCompare(\'' + p.sku + '\',this)">';
      html += '</label>';
      html += '</div>';
      html += '<div class="pa-card-body">';
      html += '<div class="pa-card-brand" style="color:' + b.color + '">' + b.name + '</div>';
      html += '<div class="pa-card-name">' + name + '</div>';
      html += '<div class="pa-card-price">' + priceLabel + '</div>';
      html += '<div class="pa-card-actions">';
      html += '<button class="pa-card-cart-btn" data-sku="' + p.sku + '" onclick="addToCart(\'' + p.sku + '\');return false">加入采购清单</button>';
      html += '</div>';
      html += '</div></div>';
    }
  }

  grid.innerHTML = html;
  window.__PANDA_VISIBLE_PRODUCTS__ = _filteredProducts.length;

  // 更新网格/列表 class
  grid.className = isList ? 'pa-grid list-view' : 'pa-grid';

  _renderPageButtons();
  _renderCompareBar();
}
function _renderPageButtons() {
  var pg = document.getElementById('paPagination');
  if (!pg) return;
  var totalPages = Math.max(1, Math.ceil(_filteredProducts.length / _pageSize));

  // 翻页始终显示，不受页数影响
  pg.style.display = '';

  var html = '';
  html += '<button class="pa-page-btn' + (_currentPage === 1 ? ' disabled' : '') + '" onclick="changePage(\'prev\')">上一页</button>';

  // 最多显示5个页码，中间省略号
  var pages = _buildPageRange(_currentPage, totalPages);
  for (var i = 0; i < pages.length; i++) {
    if (pages[i] === '...') {
      html += '<span class="pa-page-dots">…</span>';
    } else {
      var n = pages[i];
      html += '<button class="pa-page-btn' + (n === _currentPage ? ' active' : '') + '" onclick="changePage(' + n + ')">' + n + '</button>';
    }
  }

  html += '<button class="pa-page-btn' + (_currentPage === totalPages ? ' disabled' : '') + '" onclick="changePage(\'next\')">下一页</button>';
  pg.innerHTML = html;
}

function _buildPageRange(current, total) {
  if (total <= 7) {
    var arr = [];
    for (var i = 1; i <= total; i++) arr.push(i);
    return arr;
  }
  var result = [1];
  if (current > 3) result.push('...');
  var start = Math.max(2, current - 1);
  var end = Math.min(total - 1, current + 1);
  for (var i = start; i <= end; i++) result.push(i);
  if (current < total - 2) result.push('...');
  result.push(total);
  return result;
}

function changePage(arg) {
  var totalPages = Math.max(1, Math.ceil(_filteredProducts.length / _pageSize));
  if (arg === 'prev') {
    if (_currentPage > 1) _currentPage--;
  } else if (arg === 'next') {
    if (_currentPage < totalPages) _currentPage++;
  } else {
    var n = parseInt(arg);
    if (!isNaN(n) && n >= 1 && n <= totalPages) _currentPage = n;
  }
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── B-02：排序函数 ──────────────────────────────────────────
function sortProducts() {
  var sel = document.getElementById('sortSelect');
  if (sel) _sortOrder = sel.value;
  _currentPage = 1;
  renderProducts();
}

// ── B-03：筛选交互函数 ──────────────────────────────────────

// checkbox 勾选/取消
function navFilterToggle(cb) {
  if (!cb) return;
  var dim = cb.getAttribute('data-dim');
  _updateFilterCountBtn(dim);
  _currentPage = 1;
  renderProducts();
}

// 重置某个维度的所有筛选（取消勾选）
function resetDim(dim, btn) {
  var checkboxes = document.querySelectorAll('.pa-nav-checkbox[data-dim="' + dim + '"]');
  checkboxes.forEach(function(cb) { cb.checked = false; });
  _updateFilterCountBtn(dim);
  _currentPage = 1;
  renderProducts();
}

// 全选/取消某个维度的所有选项（toggle）
function selectAllDim(dim) {
  var checkboxes = document.querySelectorAll('[data-dim="' + dim + '"]');
  var allChecked = Array.from(checkboxes).every(function(cb) { return cb.checked; });
  checkboxes.forEach(function(cb) {
    cb.checked = !allChecked;
    var label = cb.closest('.pa-nav-item-label');
    if (!allChecked) {
      label.classList.add('checked');
    } else {
      label.classList.remove('checked');
    }
  });
  _updateFilterCountBtn(dim);
  _currentPage = 1;
  renderProducts();
}

// 重置所有筛选
function resetFilters() {
  var checkboxes = document.querySelectorAll('.pa-nav-checkbox');
  checkboxes.forEach(function(cb) { cb.checked = false; });
  ['brand','type','industry','sport','cert'].forEach(function(dim) { _updateFilterCountBtn(dim); });
  _currentPage = 1;
  renderProducts();
  // cert checkbox 需要额外触发 change 事件以同步视觉状态
  certFilterChanged();
}

// 折叠/展开筛选卡片
function toggleFilterCard(btn) {
  if (!btn) return;
  var group = btn.closest('.pa-filter-group');
  if (!group) return;
  var body = group.querySelector('.pa-filter-body');
  if (!body) return;
  var expanded = btn.getAttribute('aria-expanded') !== 'false';
  btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  body.style.display = expanded ? 'none' : '';
  var chevron = group.querySelector('.pa-filter-chevron');
  if (chevron) chevron.style.transform = expanded ? 'rotate(-90deg)' : '';
}

// 移动端筛选折叠
function toggleMobileFilter(btn) {
  var wrap = document.getElementById('paFilterWrap');
  if (!wrap) return;
  var isOpen = wrap.classList.toggle('is-open');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// 切换视图
function setView(mode) {
  _currentView = mode;
  var gridBtn = document.getElementById('gridBtn');
  var listBtn = document.getElementById('listBtn');
  if (gridBtn) gridBtn.classList.toggle('active', mode === 'grid');
  if (listBtn) listBtn.classList.toggle('active', mode === 'list');
  renderProducts();
}

// 认证筛选变化（认证区的 checkbox 点击后触发渲染）
function certFilterChanged() {
  _currentPage = 1;
  renderProducts();
}

// ── cert 映射表（全局，供 _applyFilters 使用） ──────────────────────
var certKeyAlias = {
  'EN388': 'cert-en388',
  'ANSI': 'cert-ansi105',
  'EN374': 'cert-en374',
  'ISO374': 'cert-en374',
  'EN421': 'cert-en374',
  'EN407': 'cert-en407',
  'EN511': 'cert-en511',
  'IEC60903': 'cert-en12477',
  'EN60903': 'cert-en12477',
  'ISO10819': 'cert-iso10819',
  'ANSI138': 'cert-ansi138',
  'REACH': 'cert-en374',
  'ROHS': 'cert-en374',
  'CE': 'cert-en388',
  'ISO9001': 'cert-en388'
};

var certMap = {
  '2. EN 388:2016+A1:2018': 'cert-en388',
  '耐磨性：0-4级': 'cert-en388-abrasion',
  '耐切割性：0-5级': 'cert-en388-cut',
  '抗撕裂性：0-4级': 'cert-en388-tear',
  '抗穿刺性：0-4级': 'cert-en388-puncture',
  '耐切割性 A-F级': 'cert-en388-cut-af',
  '冲击保护：P标识': 'cert-en388-impact',
  '3. EN 374:2016系列': 'cert-en374',
  'EN 374-1': 'cert-en374-1',
  'EN 374-2': 'cert-en374-2',
  'EN 374-3': 'cert-en374-3',
  '4. EN 407:2020': 'cert-en407',
  '5. EN 511:2006': 'cert-en511',
  '6. EN 12477:2001+A1:2005': 'cert-en12477',
  '7. ISO 10819:2013': 'cert-iso10819',
  '1. BS EN 388:2016+A1:2018': 'cert-bs388',
  '2. BS EN ISO 21420:2020': 'cert-bs21420',
  '3. BS EN 374系列': 'cert-bs374',
  '4. BS EN 407:2020': 'cert-bs407',
  '5. BS EN 511:2006': 'cert-bs511',
  '1. 切割防护等级：A1-A9级': 'cert-cut',
  'A1-A3：轻级防护（200-1,499克）': 'cert-cut-a13',
  'A4-A6：中级防护（1,500-3,999克）': 'cert-cut-a46',
  'A7-A9：重级防护（4,000-6,000+克）': 'cert-cut-a79',
  '2. 穿刺防护等级：0-5级': 'cert-puncture',
  '3. 耐磨防护等级：0-6级': 'cert-abrasion',
  '4. 抗撕裂性能分级': 'cert-tear',
  'ASTM F2992-15 TDM-100': 'cert-tear-astm1',
  'ASTM D3389-10、ASTM D3884-09': 'cert-abrasion-astm',
  'ASTM D689、ASTM D1938': 'cert-tear-astm2',
  'ASTM D2582': 'cert-tear-astm3',
  '5. ANSI/ISEA 138-2019': 'cert-ansi138',
  '机械防护：参考ANSI/ISEA 105标准': 'cert-ansi105',
  '化学防护：参考ASTM、ISO相关标准': 'cert-chem-ref',
  '1. GB 24541-2022': 'cert-gb24541',
  '2. GB 24539-2021': 'cert-gb24539',
  '3. GB 28881-2023': 'cert-gb28881',
  '4. GB/T 38306-2019': 'cert-gb38306',
  '5. GB/T 38304-2019': 'cert-gb38304',
  '1. CSA Z259.4-1979': 'cert-csa1',
  '2. CAN/CSA-ISO 10819:2016': 'cert-csa2',
  '3. CSA Z94.4系列': 'cert-csa3',
  '4. CSA Z316.11': 'cert-csa4',
  '5. 参考标准': 'cert-csa-ref',
  '1. AS/NZS 2161.2:2020': 'cert-as1',
  '2. AS/NZS 2161.3:2020': 'cert-as2',
  '3. AS/NZS 2161.4:1999(R2016)': 'cert-as3',
  '4. AS/NZS 2161.5:1998': 'cert-as4',
  '5. AS/NZS 2161.10.2:2025': 'cert-as5',
  '1. JIS T 8008:2024': 'cert-jis1',
  '2. JIS T 8116:2005': 'cert-jis2',
  '3. JIS T 8121-2:2007': 'cert-jis3',
  '4. JIS T 8112:2014': 'cert-jis4',
  '5. 相关测试标准': 'cert-jis-ref'
};

// ── cert checkbox DOM 初始化 ─────────────────────────────────────
(function initCertDOM() {
  function applyCertMap() {
    var certInputs = document.querySelectorAll('.pa-cert-content input[type="checkbox"]');
    certInputs.forEach(function(inp) {
      inp.classList.add('pa-nav-checkbox');
      if (!inp.nextElementSibling || !inp.nextElementSibling.classList.contains('pa-nav-checkmark')) {
        var checkmark = document.createElement('span');
        checkmark.className = 'pa-nav-checkmark';
        inp.parentNode.insertBefore(checkmark, inp.nextSibling);
      }
      if (!inp.hasAttribute('data-dim')) inp.setAttribute('data-dim', 'cert');
      var label = inp.nextElementSibling ? inp.nextElementSibling.nextElementSibling : null;
      if (!label) return;
      var txt = label.textContent.trim();
      if (certMap[txt]) {
        inp.setAttribute('data-val', certMap[txt]);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCertMap);
  } else {
    applyCertMap();
  }

  function attachCertClick() {
    var certInputs = document.querySelectorAll('.pa-cert-content input[type="checkbox"]');
    certInputs.forEach(function(inp) {
      inp.addEventListener('change', function() {
        certFilterChanged();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCertClick);
  } else {
    attachCertClick();
  }
})();


// 认证 L1 区域点击（标题+勾选框）：全选/取消该区域下所有 checkbox
function toggleCertL1SelectAll(headerEl) {
  if (!headerEl) return;
  var l1 = headerEl.closest('.pa-cert-l1');
  if (!l1) return;
  var allCB = l1.querySelectorAll('input[type="checkbox"]');
  if (!allCB.length) return;
  var allChecked = Array.from(allCB).every(function(cb) { return cb.checked; });
  allCB.forEach(function(cb) { cb.checked = !allChecked; });
  certFilterChanged();
}

// 认证 L1 箭头点击：展开/折叠 L2 目录（不影响勾选状态）
function toggleCertL1Expand(arrowEl) {
  if (!arrowEl) return;
  var l1 = arrowEl.closest('.pa-cert-l1');
  if (!l1) return;
  l1.classList.toggle('is-expanded');
}



// 展开/折叠认证 L2 子项
function toggleCertL2Expand(btn) {
  var item = btn.closest('.pa-cert-l2-item');
  if (!item) return;
  item.classList.toggle('is-expanded');
}
function toggleCertL2(itemEl) {
  if (!itemEl) return;
  itemEl.classList.toggle('is-expanded');

  var allCB = itemEl.querySelectorAll('input[type="checkbox"]');
  if (!allCB.length) return;
  var allChecked = Array.from(allCB).every(function(cb) { return cb.checked; });
  allCB.forEach(function(cb) { cb.checked = !allChecked; });
  certFilterChanged();
}

// 展开全部认证 + toggle 全选/取消（不展开/折叠二级目录）
function toggleAllCerts() {
  var allCB = document.querySelectorAll('.pa-cert-content input[type="checkbox"]');
  var btn = document.getElementById('btnToggleAllCerts');
  if (!btn || !allCB.length) return;

  var anyUnchecked = [].some.call(allCB, function(cb) { return !cb.checked; });

  if (anyUnchecked) {
    // 全部勾选，不展开二级目录
    allCB.forEach(function(cb) { cb.checked = true; });
    btn.innerHTML = '取消全部 <span id="certCount">' + allCB.length + '</span>';
  } else {
    // 全部取消勾选
    allCB.forEach(function(cb) { cb.checked = false; });
    btn.innerHTML = '查看全部 <span id="certCount">' + allCB.length + '</span>';
  }
  certFilterChanged();
}

function toggleAllByDim(dim, btnId, countId, total) {
  var allCB = document.querySelectorAll('input[data-dim="' + dim + '"]');
  var btn = document.getElementById(btnId);
  if (!btn || !allCB.length) return;

  var anyUnchecked = [].some.call(allCB, function(cb) { return !cb.checked; });

  if (anyUnchecked) {
    allCB.forEach(function(cb) { cb.checked = true; });
    btn.innerHTML = '取消全部 <span id="' + countId + '">' + total + '</span>';
  } else {
    allCB.forEach(function(cb) { cb.checked = false; });
    btn.innerHTML = '查看全部 <span id="' + countId + '">' + total + '</span>';
  }
  certFilterChanged();
}

function toggleAllBrand()  { toggleAllByDim('brand',    'btnToggleAllBrand',    'brandCount',    10); }
function toggleAllType()   { toggleAllByDim('type',     'btnToggleAllType',     'typeCount',     17); }
function toggleAllIndustry(){ toggleAllByDim('industry', 'btnToggleAllIndustry', 'industryCount', 14); }
function toggleAllSport()  { toggleAllByDim('sport',    'btnToggleAllSport',    'sportCount',    15); }

// ── 加入购物车 ──────────────────────────────────────────
function addToCart(sku) {
  // 从产品数据中查找完整对象
  var allProducts = window.__PANDA_PRODUCTS__ || [];
  var product = null;
  for (var k = 0; k < allProducts.length; k++) {
    if (allProducts[k].sku === sku) { product = allProducts[k]; break; }
  }
  if (!product) product = { sku: sku }; // fallback

  var lang = localStorage.getItem('pg_lang') || 'zh';
  var isZh = !lang.startsWith('en');
  var name = isZh ? (product.name_zh || product.name || sku) : (product.name_en || product.name || sku);
  var b = brandMap[product.brand] || brandMap.shield;
  var priceVal = (product.price && product.price.tiers && product.price.tiers[0])
    ? product.price.tiers[0].price
    : (product.price && product.price.sample ? product.price.sample : '¥--');

  // 读取现有购物车（对象数组）
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('pandaCart') || '[]'); } catch(e){ cart = []; }
  // 兼容旧版（字符串数组）：若元素是字符串则升级
  if (cart.length > 0 && typeof cart[0] === 'string') {
    cart = cart.map(function(s){ return { sku: s, name: s, brand: '', price: '¥--', qty: 1 }; });
  }

  var existing = null;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].sku === sku) { existing = cart[j]; break; }
  }
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      sku:   sku,
      // 同时保存 API 返回的内部 id，方便后续同步到后端
      id:    product.id || null,
      name:  name,
      brand: b ? b.name : (product.brand || ''),
      price: priceVal,
      image: (product.images && product.images[0]) || '',
      qty:   1
    });
  }
  localStorage.setItem('pandaCart', JSON.stringify(cart));

  // ── 静默同步到后端 API（已登录用户） ───────────────────
  (function syncCartToAPI() {
    if (!window.PandaAPI || !PandaAPI.Auth.isLoggedIn()) return;
    // product.id 是 API 返回的内部数字 id，优先用；SKU 作为兜底
    var productIdOrSku = product.id || sku;
    PandaAPI.Cart.add(productIdOrSku, 1, '').catch(function() {
      // API 同步失败不影响本地购物车静默忽略
    });
  })();
  var btn = document.querySelector('[data-sku="' + sku + '"]');
  if (btn) {
    var orig = btn.textContent;
    btn.textContent = '已添加 ✓';
    btn.disabled = true;
    setTimeout(function() {
      btn.textContent = orig;
      btn.disabled = false;
    }, 1500);
  }
  // 更新 FAB 角标
  var badge = document.getElementById('fabBadge');
  if (badge) {
    var cartArr = JSON.parse(localStorage.getItem('pandaCart') || '[]');
    badge.textContent = cartArr.length;
  }
  // 显示 toast
  var toast = document.getElementById('cartToast');
  if (toast) {
    var msg = document.getElementById('cartToastMsg');
    if (msg) msg.textContent = '已加入采购清单';
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
  }
}

// ── 颜色/尺码选择器（product-detail 共用） ───────────────────
document.addEventListener('click', function(e) {
  var cb = e.target.closest('.pd-color-btn');
  if (cb) {
    var g = cb.closest('.pd-color-options');
    if (g) g.querySelectorAll('.pd-color-btn').forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    cb.classList.add('active');
    cb.setAttribute('aria-pressed','true');
    return;
  }
  var sb = e.target.closest('.pd-size-btn');
  if (sb) {
    var g2 = sb.closest('.pd-size-options');
    if (g2) g2.querySelectorAll('.pd-size-btn').forEach(function(b){ b.classList.remove('active'); });
    sb.classList.add('active');
  }
});

// ── 对比功能 ──────────────────────────────────────────────
var _compareSkus = JSON.parse(localStorage.getItem('pandaCompare') || '[]');
var _COMPARE_MAX  = 4;

function toggleCompare(sku, el) {
  var idx = _compareSkus.indexOf(sku);
  if (idx > -1) {
    _compareSkus.splice(idx, 1);
  } else {
    if (_compareSkus.length >= _COMPARE_MAX) {
      alert('最多同时对比 ' + _COMPARE_MAX + ' 款产品，请先取消一款再添加。');
      if (el && el.type === 'checkbox') el.checked = false;
      return;
    }
    _compareSkus.push(sku);
  }
  // 同步 checkbox 状态（el 为 null 时跳过，不报错）
  if (el && el.type === 'checkbox') {
    el.checked = _compareSkus.indexOf(sku) > -1;
  }
  document.querySelectorAll('.pa-card-compare-check input[type="checkbox"]').forEach(function(cb) {
    cb.checked = _compareSkus.indexOf(cb.closest('.pa-card').getAttribute('data-sku')) > -1;
  });
  document.querySelectorAll('.pa-card-compare-btn').forEach(function(b) {
    var s = b.getAttribute('data-sku');
    b.classList.toggle('is-active', _compareSkus.indexOf(s) > -1);
  });
  localStorage.setItem('pandaCompare', JSON.stringify(_compareSkus));
  _renderCompareBar();
}

function _renderCompareBar() {
  var bar     = document.getElementById('compareBar');
  var slots   = document.getElementById('compareSlots');
  var countEl = document.getElementById('compareCount');
  var goBtn   = document.getElementById('compareGoBtn');
  if (!bar) return;
  if (!slots || !countEl || !goBtn) return;

  var allProducts = window.__PANDA_PRODUCTS__ || [];
  var html = '';
  _compareSkus.forEach(function(sku) {
    var p = null;
    for (var i = 0; i < allProducts.length; i++) {
      if (allProducts[i].sku === sku) { p = allProducts[i]; break; }
    }
    var name = p ? (p.name_zh || p.name || sku) : sku;
    var b    = p ? (brandMap[p.brand] || brandMap.shield) : brandMap.shield;
    html += '<div class="pa-compare-slot">';
    html += '<div class="pa-compare-slot-icon" style="color:' + b.color + '">' + b.svg + '</div>';
    html += '<span class="pa-compare-slot-name">' + name + '</span>';
    html += '<button class="pa-compare-slot-del" onclick="toggleCompare(\'' + sku + '\',null)" title="移除">✕</button>';
    html += '</div>';
  });
  // 空槽
  for (var fill = _compareSkus.length; fill < _COMPARE_MAX; fill++) {
    html += '<div class="pa-compare-slot pa-compare-slot--empty"><span>+ 选择产品</span></div>';
  }

  slots.innerHTML   = html;
  countEl.textContent = '已选 ' + _compareSkus.length + ' / ' + _COMPARE_MAX;
  goBtn.disabled      = _compareSkus.length < 2;
  bar.style.display   = _compareSkus.length > 0 ? 'block' : 'none';
}

function clearCompare() {
  _compareSkus = [];
  localStorage.removeItem('pandaCompare');
  document.querySelectorAll('.pa-card-compare-btn').forEach(function(b){ b.classList.remove('is-active'); });
  document.querySelectorAll('.pa-card-compare-check input[type="checkbox"]').forEach(function(cb){ cb.checked = false; });
  _renderCompareBar();
}

function openComparePage() {
  if (_compareSkus.length < 2) return;
  var url = 'compare.html?skus=' + _compareSkus.join(',');
  window.location.href = url;
}

function closeCompareOverlay() {
  var overlay = document.getElementById('compareOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function _buildCompareTable() {
  var allProducts = window.__PANDA_PRODUCTS__ || [];
  var products = _compareSkus.map(function(sku) {
    for (var i = 0; i < allProducts.length; i++) {
      if (allProducts[i].sku === sku) return allProducts[i];
    }
    return { sku: sku, name: sku };
  });

  // 对比维度定义
  var rows = [
    { label: '品牌系列', fn: function(p){ var b = brandMap[p.brand]; return b ? '<span style="color:' + b.color + '">' + b.name + '</span>' : (p.brand || '—'); } },
    { label: '产品名称', fn: function(p){ return p.name_zh || p.name || p.sku; } },
    { label: 'SKU',      fn: function(p){ return p.sku || '—'; } },
    { label: '防护等级', fn: function(p){ return (p.cert || []).join(', ') || '—'; } },
    { label: '材质',     fn: function(p){ return p.material || p.material_zh || '—'; } },
    { label: '适用场景', fn: function(p){ return (p.industries || p.tags || []).slice(0,3).join('、') || '—'; } },
    { label: '起订量',   fn: function(p){ return (p.moq ? p.moq + ' 双' : '—'); } },
    { label: '样品价',   fn: function(p){ return (p.price && p.price.sample) ? p.price.sample : '面议'; } },
    { label: '批量价',   fn: function(p){ return (p.price && p.price.tiers && p.price.tiers[0]) ? p.price.tiers[0].price : '面议'; } },
  ];

  var thHtml = '<th class="pa-ct-row-label"></th>';
  products.forEach(function(p) {
    var b = brandMap[p.brand] || brandMap.shield;
    thHtml += '<th class="pa-ct-prod-head">';
    thHtml += '<div class="pa-ct-prod-icon" style="color:' + b.color + '">' + b.svg + '</div>';
    thHtml += '<div class="pa-ct-prod-name">' + (p.name_zh || p.name || p.sku) + '</div>';
    thHtml += '<a class="pa-ct-prod-link" href="product-detail.html?id=' + p.sku + '" target="_blank">查看详情 →</a>';
    thHtml += '</th>';
  });

  var bodyHtml = '';
  rows.forEach(function(row) {
    bodyHtml += '<tr>';
    bodyHtml += '<td class="pa-ct-row-label">' + row.label + '</td>';
    products.forEach(function(p) {
      bodyHtml += '<td class="pa-ct-cell">' + row.fn(p) + '</td>';
    });
    bodyHtml += '</tr>';
  });

  return '<table class="pa-compare-table"><thead><tr>' + thHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
}

// ── 初始化 ────────────────────────────────────────────────
(function() {
  // ── 统计区动态化（PA-09）────────────────────────────────────────
  var _renderStats = function() {
    var products = window.__PANDA_PRODUCTS__;
    if (!products || !products.length) {
      // 等待 products-data.js 加载
      setTimeout(_renderStats, 100);
      return;
    }
    var skuEl = document.getElementById('statSku');
    var brandEl = document.getElementById('statBrand');
    var certEl = document.getElementById('statCert');
    var ratingEl = document.getElementById('statRating');
    var total = products.length;
    var brands = new Set(products.map(function(p) { return p.brand; })).size;
    var certs = new Set(products.map(function(p) { return (p.cert || []).join(','); })).size;
    if (skuEl) skuEl.textContent = total;
    if (brandEl) brandEl.textContent = brands;
    if (certEl) certEl.textContent = Math.min(certs, 40) + '+';
    if (ratingEl) ratingEl.textContent = '98%';
  };

  // 初始化所有 count btn 为隐藏
  document.querySelectorAll('.pa-filter-count-btn').forEach(function(btn) {
    btn.style.display = 'none';
  });

  // ── 从 API 加载产品数据，替换静态数据 ───────────────────────
  (function loadProductsFromAPI() {
    // 先设为 null，触发 renderProducts 的防御性等待
    window.__PANDA_PRODUCTS__ = null;

    if (window.PandaAPI && window.PandaAPI.Products) {
      window.PandaAPI.Products.list({ pageSize: 200 }).then(function(products) {
        console.log('[products-all] API 产品数量:', products ? products.length : 0);
        if (products && products.length > 0) {
          window.__PANDA_PRODUCTS__ = products;
        } else {
          // API 返回空，使用本地静态数据
          console.warn('[products-all] API 返回空，使用本地静态数据');
        }
        _renderStats();
        renderProducts();
      }).catch(function(err) {
        console.warn('[products-all] API 加载失败，使用本地静态数据:', err.message);
        _renderStats();
        renderProducts();
      });
    } else {
      // API 客户端未加载，直接用静态数据
      console.warn('[products-all] PandaAPI 未加载，使用本地静态数据');
      _renderStats();
      renderProducts();
    }
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProducts);
  } else {
    // renderProducts 已在 loadProductsFromAPI 回调中调用
  }

  // ── 产品卡片整卡点击委托 ──────────────────────────────────────
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.pa-card[data-sku]');
    if (!card) return;
    e.stopPropagation();
    var sku = card.getAttribute('data-sku');
    if (sku) window.location.href = 'product-detail.html?id=' + sku;
  });

  // ── 对比按钮安全绑定（双保险：onclick + addEventListener） ───
  var clearBtn = document.getElementById('compareClearBtn');
  var goBtn = document.getElementById('compareGoBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearCompare);
  if (goBtn) goBtn.addEventListener('click', openComparePage);
})();


