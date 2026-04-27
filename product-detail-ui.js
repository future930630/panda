// ── 用事件委托处理动态缩略图和大图箭头（页面加载后始终有效） ──
var galleryIdx = 0;

function switchGalleryImg(idx) {
  var thumbs = document.querySelectorAll('.pd-thumb');
  if (!thumbs.length) return;
  galleryIdx = (idx + thumbs.length) % thumbs.length;
  var src = thumbs[galleryIdx].querySelector('img').src;
  document.getElementById('pdMainImg').src = src;
  thumbs.forEach(function(t, i) {
    t.classList.toggle('active', i === galleryIdx);
  });
}

// 缩略图点击 + 大图箭头，统一委托到上层静态容器
document.addEventListener('click', function(e) {
  // 缩略图点击（事件委托，renderGallery动态创建的也生效）
  if (e.target.closest && e.target.closest('.pd-thumb')) {
    var thumb = e.target.closest('.pd-thumb');
    document.querySelectorAll('.pd-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    var imgSrc = thumb.querySelector('img').src;
    document.getElementById('pdMainImg').src = imgSrc;
    // 同步 galleryIdx，保证左右箭头状态一致
    var thumbs = document.querySelectorAll('.pd-thumb');
    galleryIdx = Array.from(thumbs).indexOf(thumb);
    return;
  }
  // 大图左右箭头
  if (e.target.closest && e.target.closest('.pd-img-prev')) {
    switchGalleryImg(galleryIdx - 1);
    return;
  }
  if (e.target.closest && e.target.closest('.pd-img-next')) {
    switchGalleryImg(galleryIdx + 1);
  }
});

// ── 灯箱 ──
(function initLightbox() {
  var lightbox = document.getElementById('pdLightbox');
  var lbImg    = document.getElementById('pdLbImg');
  var lbCounter= document.getElementById('pdLbCounter');
  var lbThumbs = document.getElementById('pdLbThumbs');
  var currentIdx = 0;
  var srcList = []; // 动态获取，不在初始化时锁定

  function refreshSrcList() {
    var thumbsAll = document.querySelectorAll('.pd-thumb img');
    srcList = Array.from(thumbsAll).map(function(img) { return img.src; });
  }

  // 点击大图打开灯箱，当前显示哪张就打开哪张
  document.getElementById('pdMainImg').addEventListener('click', function() {
    refreshSrcList();
    var activeThumb = document.querySelector('.pd-thumb.active');
    currentIdx = activeThumb ? Array.from(document.querySelectorAll('.pd-thumb')).indexOf(activeThumb) : 0;
    openLightbox();
  });

  function openLightbox() {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderLb(currentIdx);
    buildLbThumbs();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLb(idx) {
    lbImg.src = srcList[idx];
    lbCounter.textContent = (idx + 1) + ' / ' + srcList.length;
    // 高亮底部缩略图
    lbThumbs.querySelectorAll('.pd-lb-thumb').forEach(function(t, i) {
      t.classList.toggle('active', i === idx);
    });
  }

  function buildLbThumbs() {
    lbThumbs.innerHTML = '';
    srcList.forEach(function(src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'pd-lb-thumb' + (i === currentIdx ? ' active' : '');
      img.addEventListener('click', function() { currentIdx = i; renderLb(i); });
      lbThumbs.appendChild(img);
    });
  }

  document.getElementById('pdLbClose').addEventListener('click', closeLightbox);
  document.getElementById('pdLbPrev').addEventListener('click', function() {
    currentIdx = (currentIdx - 1 + srcList.length) % srcList.length;
    renderLb(currentIdx);
  });
  document.getElementById('pdLbNext').addEventListener('click', function() {
    currentIdx = (currentIdx + 1) % srcList.length;
    renderLb(currentIdx);
  });
  // 点击遮罩关闭
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  // ESC 关闭
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + srcList.length) % srcList.length; renderLb(currentIdx); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % srcList.length; renderLb(currentIdx); }
  });
})();

// Tab切换（HTML用.pd-detail-tab，data-panel属性，目标section用id=pd-xxx）
document.querySelectorAll('.pd-detail-tab').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    var panelId = this.dataset.panel; // data-panel="attribute"|"review"|"supplier"
    if (!panelId) return; // 链接型(描述)不处理
    e.preventDefault();
    document.querySelectorAll('.pd-detail-tab').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.pd-section-block').forEach(function(c) { c.classList.remove('active'); });
    this.classList.add('active');
    var target = document.getElementById('pd-' + panelId);
    if (target) target.classList.add('active');
  });
});

// 数量增减（防崩溃保护：元素不存在时不报错）
var qtyInput = document.querySelector('.pd-qty-input');
if (qtyInput) {
  document.querySelectorAll('.pd-qty-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var val = parseInt(qtyInput.value) || 300;
      if (this.textContent === '+') {
        val += 100;
      } else {
        val = Math.max(300, val - 100);
      }
      qtyInput.value = val;
    });
  });
}

// 颜色/尺码选择（.pd-color-btn / .pd-size-btn 与HTML一致）
document.querySelectorAll('.pd-color-btn').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.pd-color-btn').forEach(function(i) { i.classList.remove('active'); });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('.pd-color-btn').forEach(function(i) {
      if (i !== item) i.setAttribute('aria-pressed', 'false');
    });
  });
});
document.querySelectorAll('.pd-size-btn').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.pd-size-btn').forEach(function(i) { i.classList.remove('active'); });
    this.classList.add('active');
  });
});

// 属性/评价/供应商/描述 Tab滚动高亮
var sections = document.querySelectorAll('.pd-section-block[id]');
var tabs = document.querySelectorAll('.pd-detail-tab');

function highlightTab() {
  var scrollPos = window.scrollY + 200;
  var current = '';
  sections.forEach(function(section) {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });
  tabs.forEach(function(tab) {
    tab.classList.remove('active');
    // 按钮型Tab（评价）
    if (tab.tagName === 'BUTTON' && current === 'pd-review') {
      tab.classList.add('active');
    }
    // 链接型Tab
    if (tab.tagName === 'A' && tab.getAttribute('href') === '#' + current) {
      tab.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightTab);
highlightTab();

// ── 评价子Tab逻辑 ──
// 1. 点击"评价"主按钮 → 展开子Tab，默认选"产品评价"
document.getElementById('pd-review-tab-btn').addEventListener('click', function(e) {
  e.preventDefault();
  // 激活"评价"主Tab
  tabs.forEach(function(t) { t.classList.remove('active'); });
  this.classList.add('active');
  // 滚动到评价区顶部
  document.getElementById('pd-review').scrollIntoView({ behavior: 'smooth', block: 'start' });
  // 激活"产品评价"子Tab
  var subTabs = document.querySelectorAll('.pd-reviews-tab');
  subTabs.forEach(function(t) { t.classList.remove('active'); });
  subTabs[0].classList.add('active');
  // 显示产品评价面板
  document.querySelectorAll('.pd-review-sub-panel').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('pd-review-product').classList.add('active');
});

// 2. 点击子Tab → 切换面板
document.querySelectorAll('.pd-reviews-tab').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var targetPanel = this.dataset.reviewPanel; // 'product' | 'store'
    // 高亮子Tab
    document.querySelectorAll('.pd-reviews-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
    // 切换面板
    document.querySelectorAll('.pd-review-sub-panel').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('pd-review-' + targetPanel).classList.add('active');
  });
});

// ── 右侧 sticky 与 header 高度同步 ──
function syncStickyTop() {
  var header = document.querySelector('.header');
  if (!header) return;
  // 读取 header 实际渲染高度
  var h = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--pd-sticky-top', h + 'px');
}
// 初始化 + 滚动时实时更新
syncStickyTop();
window.addEventListener('scroll', syncStickyTop, { passive: true });

// ── 商品规格选择 + 价格联动 ──
// 基础单价（元/双）
var BASE_PRICES = {
  basic: 30.60,
  low:   29.24,
  mid:   28.56,
  high:  25.89,
};
// 材质系数
var MATERIAL_FACTOR = {
  '丁腈': 1.00,
  '乳胶': 0.92,
  'PU':  0.88,
  '涤纶+丁腈': 0.95,
};
// 防护等级对应的 tier
var LEVEL_TIER = {
  'EN388 A1': 'basic',
  'EN388 A2': 'low',
  'EN388 A3': 'mid',
  'EN388 A4': 'high',
};
// 尺寸系数（越大越贵）
var SIZE_FACTOR = { 'S': 0.90, 'M': 0.95, 'L': 1.00, 'XL': 1.05, '2XL': 1.10 };

var currentSpec = { size: 'L', material: '丁腈', level: 'EN388 A4' };

function calcPrice(qtyBase) {
  var tier = LEVEL_TIER[currentSpec.level] || 'high';
  var matFactor = MATERIAL_FACTOR[currentSpec.material] || 1.0;
  var sizeFactor = SIZE_FACTOR[currentSpec.size] || 1.0;
  return (BASE_PRICES[tier] * matFactor * sizeFactor).toFixed(2);
}

function getHighlightTier() {
  return LEVEL_TIER[currentSpec.level] || 'high';
}

function updatePriceTable() {
  // 更新汇总文字
  var summaryEl = document.getElementById('pd-spec-summary');
  if (summaryEl) {
    summaryEl.textContent = currentSpec.size + ' | ' + currentSpec.material + ' | ' + currentSpec.level;
  }
  // 高亮对应价格行
  var tier = getHighlightTier();
  var tierRowMap = { basic: 0, low: 0, mid: 1, high: 2 };
  var rowIdx = tierRowMap[tier] || 0;
  document.querySelectorAll('.pd-price-row').forEach(function(row, i) {
    row.classList.toggle('highlighted', i === rowIdx);
  });
  // 更新价格显示（按当前规格重算）
  var rows = document.querySelectorAll('.pd-price-row');
  var qtyLabels = ['120-2,999 pairs', '3,000-11,999 pairs', '>= 12,000 pairs'];
  rows.forEach(function(row, i) {
    var qtyEl = row.querySelector('.pd-price-qty');
    var valEl = row.querySelector('.pd-price-val');
    qtyEl.textContent = qtyLabels[i];
    valEl.textContent = '¥' + calcPrice(i) + ' / 双';
  });
}

// 初始化高亮
updatePriceTable();

// 点击规格 chip
document.querySelectorAll('.pd-spec-chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    var specType = this.dataset.spec;
    var specVal  = this.dataset.val;
    // 同组只选一个
    document.querySelectorAll('.pd-spec-chip[data-spec="' + specType + '"]').forEach(function(c) { c.classList.remove('selected'); });
    this.classList.add('selected');
    currentSpec[specType] = specVal;
    updatePriceTable();
  });
});

// ── 通用折叠面板 ──

// ── 询盘表单弹窗 ──
var inquiryModal = document.getElementById('pd-inquiry-modal');
document.querySelector('.pd-btn-primary').addEventListener('click', function() {
  inquiryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('pd-inquiry-close').addEventListener('click', function() {
  inquiryModal.classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('pd-inquiry-overlay').addEventListener('click', function() {
  inquiryModal.classList.remove('open');
  document.body.style.overflow = '';
});
// 提交询盘
document.getElementById('pd-inquiry-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // 收集数据（可对接后端，这里只做演示）
  var data = new FormData(this);
  // 隐藏表单，显示成功状态
  this.style.display = 'none';
  document.getElementById('pd-inquiry-success').style.display = 'block';
  // 3秒后自动关闭
  setTimeout(function() {
    inquiryModal.classList.remove('open');
    document.body.style.overflow = '';
    // 重置表单
    this.reset();
    this.style.display = 'flex';
    document.getElementById('pd-inquiry-success').style.display = 'none';
  }, 3000);
});

// ── 聊天弹窗 ──
var chat = document.getElementById('pd-chat');
var chatBody = document.getElementById('pd-chat-body');
document.querySelector('.pd-btn-secondary').addEventListener('click', function() {
  chat.classList.add('open');
});
document.getElementById('pd-chat-close').addEventListener('click', function() {
  chat.classList.remove('open');
});

function chatAppend(text, type) {
  var div = document.createElement('div');
  div.className = 'pd-chat-msg pd-chat-msg-' + type;
  div.innerHTML = '<span>' + text.replace(/\n/g, '<br>') + '</span>';
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

var autoReplies = {
  '请问起订量是多少？': '我们丁腈防切割系列的起订量（MOQ）为 <strong>120 双</strong>。如果需要定制 LOGO 或特殊包装，起订量可能略有调整，具体请联系客服~',
  '能提供样品吗？': '可以！样品费用为 <strong>¥15 / 双</strong>（含运费），批量下单后可抵扣货款。样品通常在 <strong>3-5 个工作日</strong>内发出。',
  '支持定制 LOGO 吗？': '支持的！我们提供 <strong>丝印、压印、烫金</strong> 三种 LOGO 定制方式。最低起订量 200 双，需提供 AI 或 CDR 源文件。详情可联系我们客服~',
  '交期大概多久？': '标准品订单：<strong>7-12 个工作日</strong>；定制 LOGO 订单：<strong>15-20 个工作日</strong>。大批量订单（10000 双以上）请提前沟通，我们会优先排产。',
};

function sendUserMsg(text) {
  if (!text.trim()) return;
  chatAppend(text, 'user');
  document.getElementById('pd-chat-input').value = '';
  // 模拟回复
  setTimeout(function() {
    var reply = autoReplies[text] || '感谢您的留言！我们的客服人员将在 <strong>工作时间内</strong>尽快回复您。如需紧急咨询，请发送邮件至 <strong>sales@pandashield.com</strong>，我们24小时内必复！';
    chatAppend(reply, 'ai');
  }, 800);
}

// 快捷问题按钮
document.querySelectorAll('.pd-chat-suggest-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { sendUserMsg(btn.dataset.msg); });
});
// 发送按钮
document.getElementById('pd-chat-send').addEventListener('click', function() {
  sendUserMsg(document.getElementById('pd-chat-input').value);
});
// 回车发送
document.getElementById('pd-chat-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendUserMsg(e.target.value);
});
document.querySelectorAll('.pd-collapse-trigger').forEach(function(trigger) {
  trigger.addEventListener('click', function() {
    var body = document.getElementById(this.id.replace('-trigger', '-body'));
    var isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isOpen);
    body.style.display = isOpen ? 'none' : 'block';
  });
});

// ── 照片/视频/属性 标签切换 ──

// ── 回到顶部按钮 ──
var backToTop = document.getElementById('pdBackToTop');
window.addEventListener('scroll', function() {
  backToTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });
backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.querySelectorAll('.pd-img-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    var target = this.dataset.tab; // 'photo' | 'video' | 'spec'
    // 高亮标签
    document.querySelectorAll('.pd-img-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
    // 切换面板
    document.querySelectorAll('.pd-img-panel').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('pd-panel-' + target).classList.add('active');
  });
});
