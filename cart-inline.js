// ══════════════════════════════════════════════════════
//  采购清单 — 动态渲染 + localStorage 双向同步
// ══════════════════════════════════════════════════════

// 登录检查：未登录跳转到注册登录页
(function(){
  var token = localStorage.getItem('panda_token');
  var user = localStorage.getItem('panda_user');
  if (!token || !user) {
    window.location.href = 'auth.html?redirect=cart.html';
    return;
  }
})();

// 品牌颜色映射
var BRAND_COLORS = {
  'PandaSHIELD™': { bg: '#fff3ed', color: '#E85D00' },
  'PandaPIERCE™': { bg: '#fef3e2', color: '#0369a1' },
  'PandaIMPACT™': { bg: '#f5f0ff', color: '#7C3AED' },
  'PandaCHEM™':   { bg: '#f0e8ff', color: '#7c3aed' },
  'PandaBIO™':    { bg: '#d1fae5', color: '#059669' },
  'PandaVOLT™':   { bg: '#fefce8', color: '#CA8A04' },
  'PandaHEAT™':   { bg: '#fde8d8', color: '#DC2626' },
  'PandaFROST™':  { bg: '#e0f2fe', color: '#0369a1' },
  'PandaGRIP™':   { bg: '#dbeafe', color: '#2563EB' },
  'PandaECO™':    { bg: '#dcfce7', color: '#15803d' },
};

// 从 localStorage 读取并修正 cart 数据
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('pandaCart') || '[]');
  } catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('pandaCart', JSON.stringify(cart));
  localStorage.setItem('pg_cart_count', cart.reduce(function(s, i) { return s + i.qty; }, 0));
}

// 渲染主列表
function renderCartList() {
  var cart = loadCart();
  var container = document.getElementById('cartItemsContainer');
  var emptyEl   = document.getElementById('cartEmpty');
  var bulkBar   = document.getElementById('cartBulkBar');
  var listArea  = document.getElementById('cartListArea');

  if (!cart.length) {
    if (emptyEl)  emptyEl.style.display = '';
    if (bulkBar)  bulkBar.style.display = 'none';
    if (listArea) listArea.style.display = 'none';
    recalcSummary(cart);
    return;
  }

  if (emptyEl)  emptyEl.style.display = 'none';
  if (bulkBar)  bulkBar.style.display = '';
  if (listArea) listArea.style.display = '';

  // 按品牌分组
  var groups = {};
  cart.forEach(function(item) {
    var brand = item.brand || 'Other';
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(item);
  });

  var cartIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>';
  var trashIconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>';

  var html = '';
  Object.keys(groups).forEach(function(brand) {
    var items = groups[brand];
    var bColor = BRAND_COLORS[brand] || { bg: '#f5f5f5', color: '#555' };
      html += '<div class="cart-brand-group" data-brand="' + brand + '">' +
      '<div class="cart-brand-header">' +
        '<span class="cart-brand-tag" style="background:' + bColor.bg + ';color:' + bColor.color + ';">' + brand + '</span>' +
        '<span class="cart-brand-count">' + items.length + ' ' + (window.PandaI18N ? PandaI18N.t('cart_summary_unit') : '') + '</span>' +
      '</div>';

    items.forEach(function(item, idx) {
      var cartKey = item.cartKey || item.sku;
      var noteId = 'note_' + cartKey.replace(/[^a-z0-9]/gi, '_') + '_' + idx;
      var qtyId  = 'qty_' + cartKey.replace(/[^a-z0-9]/gi, '_') + '_' + idx;
      var name = item.name || item.sku;
      var sizePart = item.size ? ' · ' + item.size : '';
      var stdPart = item.std || '';

      html += '<div class="cart-item" data-cartkey="' + cartKey + '">' +
        '<input type="checkbox" class="cart-item-select item-cb" onchange="updateSelected()">' +
        '<div class="cart-item-emoji" style="display:flex;align-items:center;justify-content:center;">' +
          '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect width="40" height="40" rx="8" fill="' + bColor.bg + '"/>' +
            '<text x="20" y="26" font-size="16" text-anchor="middle" fill="' + bColor.color + '" font-family="sans-serif">' + (item.brand ? item.brand.charAt(0).toUpperCase() : 'P') + '</text>' +
          '</svg>' +
        '</div>' +
        '<div class="cart-item-info">' +
          '<div><span class="cart-item-brand" style="background:' + bColor.bg + ';color:' + bColor.color + ';">' + brand + '</span></div>' +
          '<div class="cart-item-name">' + name + sizePart + '</div>' +
          '<div class="cart-item-meta">' +
            (stdPart ? '<span>📋 ' + stdPart + '</span>' : '') +
            '<span>🔖 ' + (window.PandaI18N ? PandaI18N.t('cart_meta_sku') : 'SKU') + ' ' + item.sku + '</span>' +
          '</div>' +
          '<textarea class="cart-note-input" id="' + noteId + '" rows="2" placeholder="' + (window.PandaI18N ? PandaI18N.t('cart_note_placeholder') : '备注（如交货日期、特殊要求…）') + '" onchange="saveNote(\'' + cartKey + '\', this.value)">' + (item.note || '') + '</textarea>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" onclick="changeQtyByKey(\'' + cartKey + '\', -1)">−</button>' +
            '<input type="number" class="qty-input" id="' + qtyId + '" value="' + item.qty + '" min="1" onchange="setQtyByKey(\'' + cartKey + '\', this.value)">' +
            '<button class="qty-btn" onclick="changeQtyByKey(\'' + cartKey + '\', 1)">+</button>' +
          '</div>' +
          '<span class="cart-item-unit">' + (window.PandaI18N ? PandaI18N.t('cart_item_unit') : '双/组') + '</span>' +
        '</div>' +
        '<div class="cart-item-actions">' +
          '<button class="cart-del-btn" onclick="removeByKey(\'' + cartKey + '\')" title="' + (window.PandaI18N ? PandaI18N.t('cart_delete_title') : '删除') + '">' + trashIconSvg + '</button>' +
          '<button class="cart-item-note" onclick="toggleNote(\'' + noteId + '\')">' + (window.PandaI18N ? PandaI18N.t('cart_add_note') : '+ 添加备注') + '</button>' +
        '</div>' +
        '<a class="cart-detail-link" href="product-detail.html?id=' + item.sku + '" style="' +
          'position:absolute;inset:0;z-index:0;display:block;' +
        '" tabindex="-1" aria-hidden="true"></a>' +
      '</div>';
    });

    html += '</div>';
  });

  if (container) container.innerHTML = html;

  // 恢复备注显示
  cart.forEach(function(item) {
    var cartKey = item.cartKey || item.sku;
    var noteId = document.querySelector('[data-cartkey="' + cartKey + '"] .cart-note-input');
    if (noteId && item.note) noteId.classList.add('show');
  });

  recalcSummary(cart);
  updateSelected();
}

// 更新汇总栏
function recalcSummary(cart) {
  var items = cart.length;
  var qty = cart.reduce(function(s, i) { return s + (parseInt(i.qty) || 0); }, 0);
  var sumItems = document.getElementById('sumItems');
  var sumQty   = document.getElementById('sumQty');
  var totalItems = document.getElementById('totalItems');
  var totalQty   = document.getElementById('totalQty');
  var headerP    = document.querySelector('.cart-sum-header p');

  var unitLabel = window.PandaI18N ? PandaI18N.t('cart_summary_unit') : '';
  var pairLabel = window.PandaI18N ? PandaI18N.t('cart_summary_pair') : '双';
  if (sumItems)   sumItems.textContent = items + ' ' + unitLabel;
  if (sumQty)     sumQty.textContent   = qty   + ' ' + pairLabel;
  if (totalItems) totalItems.textContent = items;
  if (totalQty)   totalQty.textContent   = qty;
  var headerTpl = window.PandaI18N ? PandaI18N.t('cart_summary_header') : '含 {items} 款产品 · ';
  if (headerP)    headerP.textContent = headerTpl.replace('{items}', items) + qty + ' ' + pairLabel;
}

// 按 cartKey 修改数量
function changeQtyByKey(cartKey, delta) {
  var cart = loadCart();
  var item = cart.find(function(i) { return (i.cartKey || i.sku) === cartKey; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  var qtyEl = document.querySelector('[data-cartkey="' + cartKey + '"] .qty-input');
  if (qtyEl) qtyEl.value = item.qty;
  recalcSummary(cart);
}

function setQtyByKey(cartKey, val) {
  var cart = loadCart();
  var item = cart.find(function(i) { return (i.cartKey || i.sku) === cartKey; });
  if (!item) return;
  item.qty = Math.max(1, parseInt(val) || 1);
  saveCart(cart);
  recalcSummary(cart);
}

function saveNote(cartKey, val) {
  var cart = loadCart();
  var item = cart.find(function(i) { return (i.cartKey || i.sku) === cartKey; });
  if (item) { item.note = val; saveCart(cart); }
}

// 删除
function removeByKey(cartKey) {
  var cart = loadCart();
  cart = cart.filter(function(i) { return (i.cartKey || i.sku) !== cartKey; });
  saveCart(cart);
  renderCartList();
}

// 备注切换
function toggleNote(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('show');
  if (el.classList.contains('show')) el.focus();
}

// ── 全选 ──
function toggleAll(masterCb) {
  document.querySelectorAll('.item-cb').forEach(function(cb) { cb.checked = masterCb.checked; });
  updateSelected();
}

// ── 更新选中计数 ──
function updateSelected() {
  var count = document.querySelectorAll('.item-cb:checked').length;
  var el = document.getElementById('selectedCount');
  if (el) el.textContent = '(' + (window.PandaI18N ? PandaI18N.t('cart_selected_n').replace('{n}', count) : '已选 ' + count + ' 项') + ')';
}

// ── 批量删除 ──
function batchDelete() {
  var checked = document.querySelectorAll('.item-cb:checked');
  if (checked.length === 0) { alert(window.PandaI18N ? PandaI18N.t('cart_alert_select_first') : '请先选择产品'); return; }
  var delMsg = window.PandaI18N ? PandaI18N.t('cart_confirm_delete').replace('{n}', checked.length) : '确认删除选中的 ' + checked.length + ' 款产品？';
  if (!confirm(delMsg)) return;
  var cart = loadCart();
  var keysToRemove = Array.from(checked).map(function(cb) { return cb.closest('.cart-item') && cb.closest('.cart-item').dataset.cartkey; }).filter(Boolean);
  cart = cart.filter(function(i) { return !keysToRemove.includes(i.cartKey || i.sku); });
  saveCart(cart);
  renderCartList();
}

// ── 移至收藏 ──
function addToFav() {
  var count = document.querySelectorAll('.item-cb:checked').length;
  if (count === 0) { alert(window.PandaI18N ? PandaI18N.t('cart_alert_select_first') : '请先选择产品'); return; }
  var favMsg = window.PandaI18N ? PandaI18N.t('cart_fav_added').replace('{n}', count) : count + ' 款产品已移至收藏夹（功能开发中）';
  alert(favMsg);
}

// ── 推荐产品加入清单 ──
function addRec(btn, sku, brand) {
  var cart = loadCart();
  var existing = cart.find(function(i) { return i.sku === sku; });
  if (existing) { existing.qty++; } else { cart.push({ cartKey: sku, sku: sku, brand: brand, name: sku, qty: 1 }); }
  saveCart(cart);
  btn.textContent = window.PandaI18N ? PandaI18N.t('cart_added') : '已添加 ✓';
  btn.style.background = '#0a6e3f'; btn.style.color = '#fff';
  btn.style.borderColor = '#0a6e3f';
  btn.disabled = true;
  recalcSummary(cart);
}

// ── 应用优惠码 ──
function applyCoupon() {
  var codeEl = document.getElementById('couponInput');
  var code = codeEl && codeEl.value ? codeEl.value.trim() : '';
  if (!code) { alert(window.PandaI18N ? PandaI18N.t('cart_alert_coupon_empty') : '请输入优惠码'); return; }
  var couponMsg = window.PandaI18N ? PandaI18N.t('cart_alert_coupon_applied').replace('{code}', code) : '优惠码 "' + code + '" 已提交，客户经理将在报价时核实';
  alert(couponMsg);
}

// ── 提交询价 ──
function submitInquiry() {
  var cart = loadCart();
  if (!cart.length) { alert(window.PandaI18N ? PandaI18N.t('cart_alert_cart_empty') : '请先添加产品到采购清单'); return; }
  location.href = 'auth.html?action=inquiry';
}

// ── 下载清单 ──
function downloadList() {
  alert(window.PandaI18N ? PandaI18N.t('cart_download_pending') : '采购清单 PDF 下载功能开发中，当前可截图保存');
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function() {
  renderCartList();
});
