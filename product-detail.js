/**
 * product-detail.js
 * 读取 URL 参数 ?id=xxx，从 products-data.js 数据层动态填充详情页
 */

(function() {
  'use strict';

  // 从 URL 读取 id 参数
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'shield-cut5'; // 默认加载第一个产品
  }

  // 渲染标题徽章（已合并到 renderStats，统一输出到 #pd-stats-tags）
  function renderTitleBadge(product) {
    const badgeEl = document.getElementById('pd-title-badge');
    if (badgeEl) badgeEl.innerHTML = '';
  }

  // 渲染面包屑 + 标题
  function renderHeader(product) {
    const name = product.name_zh || product.name || '';
    const titleEl = document.getElementById('pd-product-title');
    if (titleEl) titleEl.textContent = name;

    const crumbEl = document.getElementById('pd-breadcrumb-name');
    if (crumbEl) crumbEl.textContent = name;

    window.__pandaTitleLocked = true;
    document.title = name + ' - Panda Hand Guard';
  }

  // 渲染图片画廊
  function renderGallery(product) {
    const thumbCol = document.querySelector('.pd-thumb-col');
    const mainImg = document.getElementById('pdMainImg');
    if (!thumbCol) {
      console.error('[gallery] thumbCol不存在!');
      return;
    }
    if (!product.images || !product.images.length) {
      console.error('[gallery] 没有图片数据!', product);
      return;
    }

    const total = product.images.length;
    const visibleCount = 7;
    const thumbSlot = 56; // 每张缩略图占56px（50px图片+6px间隔）
    const baseHeight = visibleCount * thumbSlot; // 固定392px基准高度
    console.log('[gallery] 总图片:' + total + ', 基准高度:' + baseHeight + ', images:', JSON.stringify(product.images));

    // 构建缩略图列HTML：箭头在上，滚动区在中，箭头在下
    thumbCol.innerHTML =
      '<div class="pd-thumb-scroll" id="pdThumbScroll">' +
        product.images.map(function(src, i) {
          return '<div class="pd-thumb" data-index="' + i + '"><img src="' + src + '" alt="' + (product.name_zh || product.name || '') + '"></div>';
        }).join('') +
      '</div>' +
      '<button class="pd-thumb-arrow pd-thumb-up" id="pdThumbUp" style="display:none">&#9650;</button>' +
      '<button class="pd-thumb-arrow pd-thumb-down" id="pdThumbDown" style="display:none">&#9660;</button>';

    if (mainImg && product.images[0]) {
      mainImg.src = product.images[0];
    }

    // 选中第一个缩略图
    var firstThumb = document.querySelector('#pdThumbScroll .pd-thumb');
    if (firstThumb) firstThumb.classList.add('active');

    var scrollEl = document.getElementById('pdThumbScroll');
    var upBtn = document.getElementById('pdThumbUp');
    var downBtn = document.getElementById('pdThumbDown');
    var thumbs = document.querySelectorAll('#pdThumbScroll .pd-thumb');

    // 记录当前激活的缩略图索引
    var currentThumbIndex = 0;

    // 同步更新箭头状态：根据滚动位置和图片总数判断
    function updateArrows() {
      if (!scrollEl || !upBtn || !downBtn) return;
      var scrollTop = scrollEl.scrollTop || 0;
      var scrollHeight = scrollEl.scrollHeight || 0;
      var clientHeight = scrollEl.clientHeight || 0;
      // 滚动到底部时隐藏下箭头
      var atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      var atTop = scrollTop <= 2;
      upBtn.style.display = (!atTop && total > visibleCount) ? 'flex' : 'none';
      downBtn.style.display = (!atBottom && total > visibleCount) ? 'flex' : 'none';
    }

    // 滚动区域监听：滚动时同步箭头
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateArrows);
    }

    // 设置滚动区：固定高度392px，竖向滚动，多余隐藏
    if (scrollEl) {
      scrollEl.style.cssText = 'height:' + baseHeight + 'px;overflow-y:auto;overflow-x:hidden;';
    }

    // 大图容器高度固定为基准高度，不随图片数量变化
    var mainWrap = document.querySelector('.pd-main-img-wrap');
    if (mainWrap) {
      mainWrap.style.height = baseHeight + 'px';
    }

    // 初始化箭头：图片总数>7时显示向下箭头
    if (total > visibleCount) {
      upBtn.style.display = 'none';
      downBtn.style.display = 'flex';
    } else {
      upBtn.style.display = 'none';
      downBtn.style.display = 'none';
    }

    // 向下箭头点击：平滑滚动到底部（显示第8-12张），箭头切换
    if (downBtn) {
      downBtn.addEventListener('click', function() {
        if (scrollEl) {
          scrollEl.scrollTo({ top: scrollEl.scrollHeight - baseHeight, behavior: 'smooth' });
        }
      });
    }

    // 向上箭头点击：平滑滚动回顶部（显示第1-7张），箭头切换
    if (upBtn) {
      upBtn.addEventListener('click', function() {
        if (scrollEl) {
          scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // 点击缩略图：只处理滚动到可见区域（切换大图由 product-detail-ui.js 事件委托统一处理）
    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        // 将点击的缩略图滚动到可见区域
        if (scrollEl) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        // 同步箭头状态
        updateArrows();
      });
    });

    // 初始箭头状态
    updateArrows();
  }

  // 渲染颜色/尺码选项
  function renderOptions(product) {
    // HTML 中使用 .pd-color-options / .pd-size-options（与旧的 .pd-color-list/.pd-size-list 不同）
    const colorList = document.querySelector('.pd-color-options');
    if (colorList && product.colors && product.colors.length) {
      colorList.innerHTML = product.colors.map((c, i) =>
        `<button type="button"
             class="pd-color-btn${i === 0 ? ' active' : ''}"
             data-color="${c.name}"
             style="background:${c.hex || '#ccc'};"
             aria-label="${c.name}"
             aria-pressed="${i === 0}"
             title="${c.name}">
        </button>`
      ).join('');
      // 点击切换
      colorList.querySelectorAll('.pd-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          colorList.querySelectorAll('.pd-color-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
          this.classList.add('active');
          this.setAttribute('aria-pressed','true');
        });
      });
    }
    const sizeList = document.querySelector('.pd-size-options');
    if (sizeList && product.sizes && product.sizes.length) {
      sizeList.innerHTML = product.sizes.map((s, i) =>
        `<button type="button"
             class="pd-size-btn${i === 2 ? ' active' : ''}"
             data-size="${s}">${s}</button>`
      ).join('');
      // 点击切换
      sizeList.querySelectorAll('.pd-size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          sizeList.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
    }
  }

  // 渲染价格阶梯
  function renderPrice(product) {
    const block = document.querySelector('.pd-price-table');

    // 兼容两种数据格式：
    // 1. 本地数据：product.price = { tiers: [{qty, price}], moq, sample }
    // 2. API 数据：product.price_usd（数字），product.moq（数字），product.lead_time_days
    const priceUsd = product.price_usd || (product.price && product.price.tiers && product.price.tiers[0] && product.price.tiers[0].price);
    const moqVal   = product.moq || (product.price && product.price.moq) || '--';
    const leadTime = product.lead_time_days ? product.lead_time_days + ' 天' : (product.attributes && product.attributes['交货期']) || '协商';
    const samplePriceVal = (product.price && product.price.sample) || '¥203.95';

    if (block) {
      // 有阶梯数据时渲染阶梯，否则用 price_usd 展示单一价格
      const tiers = (product.price && product.price.tiers) || [];
      if (tiers.length) {
        block.innerHTML = tiers.map(t =>
          `<div class="pd-price-row">
            <span class="pd-price-qty">${t.qty} pairs</span>
            <span class="pd-price-val">¥${t.price}/双</span>
          </div>`
        ).join('');
      } else if (priceUsd) {
        block.innerHTML = `
          <div class="pd-price-row">
            <span class="pd-price-qty">${moqVal}+ pairs</span>
            <span class="pd-price-val">$${priceUsd}/双</span>
          </div>`;
      }
    }

    const samplePrice = document.querySelector('.pd-sample-price');
    if (samplePrice) samplePrice.textContent = samplePriceVal;

    const moqDelivery = document.getElementById('pd-moq-delivery');
    if (moqDelivery) {
      moqDelivery.innerHTML = `
        <div class="pd-moq-item">
          <span class="pd-moq-label">MOQ</span>
          <span class="pd-moq-val">${moqVal} 双</span>
        </div>
        <div class="pd-moq-item">
          <span class="pd-moq-label">交货期</span>
          <span class="pd-moq-val">${leadTime}</span>
        </div>
        <div class="pd-moq-item">
          <span class="pd-moq-label">样品</span>
          <span class="pd-moq-val">${samplePriceVal}</span>
        </div>
      `;
    }
  }


  // 渲染四列属性表格（阿里简约风格，属性名-值 × 2）
  // 根据产品所属系列，从attr-config读取字段配置，动态渲染对应属性
  // 兼容同一个key的多种命名（如"内衬"或"衬里材料"都指向同一个属性）
  function renderAttributes(product) {
    const grid = document.getElementById('pd-attr-grid');
    if (!grid) return;
    if (!product || !product.attributes) {
      grid.innerHTML = '';
      return;
    }
    const attrs = product.attributes;

    var rows = [];

    // key别名映射：attr-config的key → products-data中可能的key列表
    var keyAlias = {
      '防护等级': ['防护等级', '功能'],
      '型号': ['型号', '产品名称'],
      '原产地': ['原产地'],
      '品牌': ['品牌'],
      '涂层': ['涂层', '涂层材料'],
      '尺码': ['尺码', '尺寸'],
      '颜色': ['颜色'],
      '内衬': ['内衬', '衬里材料'],
      '袖口': ['袖口'],
      '包装': ['包装'],
      '单品尺寸': ['单品尺寸'],
      '单品净重': ['单品净重'],
      '外箱尺寸': ['外箱尺寸'],
      '外箱毛重': ['外箱毛重'],
      '认证': ['认证'],
      'MOQ': ['MOQ'],
      '交货期': ['交货期'],
      '应用领域': ['应用领域', '应用场景', '应用']
    };

    // 按attr-config中的字段顺序渲染
    if (window.PandaAttrConfig) {
      var fieldConfig = window.PandaAttrConfig.getFieldsByBrand(product.brand);
      if (fieldConfig && fieldConfig.tech && fieldConfig.tech.length > 0) {
        for (var i = 0; i < fieldConfig.tech.length; i++) {
          var field = fieldConfig.tech[i];
          // 尝试从别名列表中找到实际存在的key
          var aliasList = keyAlias[field.key] || [field.key];
          var value = '';
          for (var a = 0; a < aliasList.length; a++) {
            if (attrs[aliasList[a]]) {
              value = attrs[aliasList[a]];
              break;
            }
          }
          if (value) {
            rows.push({ k: field.label, v: value });
          }
        }
      }
    }

    // fallback：如果没有匹配到attr-config中的字段，渲染所有有值的属性
    if (rows.length === 0) {
      var entries = Object.entries(attrs);
      for (var j = 0; j < entries.length; j++) {
        var kv = entries[j];
        if (kv[1]) {
          rows.push({ k: kv[0], v: kv[1] });
        }
      }
    }

    // 生成四列HTML
    var html = '';
    for (var m = 0; m < rows.length; m += 2) {
      var r1 = rows[m] || { k: '', v: '' };
      var r2 = rows[m + 1] || { k: '', v: '' };
      html += '<div class="pd-ali-row">' +
        '<span class="pd-ali-k">' + r1.k + '</span>' +
        '<span class="pd-ali-v">' + r1.v + '</span>' +
        '<span class="pd-ali-k">' + r2.k + '</span>' +
        '<span class="pd-ali-v">' + r2.v + '</span>' +
        '</div>';
    }
    grid.innerHTML = html;
  }

  // 星级（SVG 版，避免 Emoji 兼容性问题）
  function renderStarsSVG(rating) {
    const full  = Math.round(rating);
    const empty = 5 - full;
    let svg = '';
    for (let i = 0; i < full; i++) {
      svg += `<svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    }
    for (let i = 0; i < empty; i++) {
      svg += `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D0CFCB" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    }
    return svg;
  }

  // 渲染单个评价卡片
  function renderReviewCard(r) {
    const initials = (r.user || '?')[0].toUpperCase();
    const imagesHtml = r.images && r.images.length
      ? `<div class="pd-review-imgs">${r.images.map(img => `<img src="${img}" alt="">`).join('')}</div>` : '';
    const specsHtml  = r.specs ? `<div class="pd-review-specs">${r.specs}</div>` : '';
    const replyHtml  = r.reply ? `<div class="pd-review-reply">供应商回复: <span class="pd-reply-label">${r.reply}</span></div>` : '';
    const purchasedHtml = r.purchased ? `<span class="pd-review-badge">已购买</span>` : '';
    const helpful = r.helpful || 0;

    return `<div class="pd-review-card">
      <div class="pd-review-avatar">${initials}</div>
      <div class="pd-review-body">
        <div class="pd-review-top">
          <span class="pd-review-user">${r.user || ''}</span>
          <span class="pd-review-country">${r.country || ''}</span>
          ${r.verified ? '<span class="pd-review-verified">✓ 已验证</span>' : ''}
          ${purchasedHtml}
          <span class="pd-review-date">${r.date || ''}</span>
        </div>
        <div class="pd-review-stars">${renderStarsSVG(r.rating || 5)}</div>
        ${specsHtml}
        <div class="pd-review-text">${r.text || ''}</div>
        ${imagesHtml}
        ${replyHtml}
        <div class="pd-review-footer"><button class="pd-like-btn" aria-label="有用 (${helpful})">有用 (${helpful})</button></div>
      </div>
    </div>`;
  }

  // 渲染评价
  function renderReviews(product) {
    const productList   = document.getElementById('pd-product-reviews');
    const storeList     = document.getElementById('pd-store-reviews');
    // 注意：#rp-product-rating / #rp-product-filters 在 HTML 结构中不存在，
    // 这里只做安全查找，不存在时跳过，不会报错
    const productRating  = document.getElementById('rp-product-rating');
    const productFilters = document.getElementById('rp-product-filters');
    const rev = product.reviews || { product: [], store: [] };

    if (productList) {
      const proReviews = rev.product || [];
      productList.innerHTML = proReviews.map(r => renderReviewCard(r)).join('') ||
        '<p style="padding:20px;color:#999;">暂无产品评价</p>';

      if (productRating) {
        const avg  = proReviews.length ? (proReviews.reduce((s, r) => s + (r.rating || 5), 0) / proReviews.length).toFixed(1) : '5.0';
        const cnt  = proReviews.length;
        const scoreEl = productRating.querySelector && productRating.querySelector('.pd-score-num');
        if (scoreEl) scoreEl.textContent = avg;
        const metaEl = productRating.querySelector && productRating.querySelector('.pd-rating-meta');
        if (metaEl) metaEl.innerHTML = `基于 ${cnt} 条评论 &nbsp; <span class="pd-verified">✓ 真实买家评论</span>`;
      }
      if (productFilters) {
        const cnt  = proReviews.length;
        const pCnt = proReviews.filter(r => r.images && r.images.length).length;
        productFilters.innerHTML = `
          <span class="pd-filter-tag active">全部 (${cnt})</span>
          <span class="pd-filter-tag">照片或视频 (${pCnt})</span>
        `;
      }
      const productTab = document.querySelector('[data-review-tab="rp-product"]');
      if (productTab) productTab.textContent = `产品评价 (${proReviews.length})`;
    }

    if (storeList) {
      const storeReviews = rev.store || [];
      storeList.innerHTML = storeReviews.map(r => renderReviewCard(r)).join('') ||
        '<p style="padding:20px;color:#999;">暂无店铺评价</p>';
      const storeTab = document.querySelector('[data-review-tab="rp-store"]');
      if (storeTab) storeTab.textContent = `店铺评价 (${storeReviews.length})`;
    }
  }

  // 渲染证书卡片（SVG 图标替代 Emoji）
  function renderCertificates(product) {
    const grid = document.getElementById('pd-cert-grid');
    if (!grid || !product.certificates || !product.certificates.length) return;

    grid.innerHTML = product.certificates.map(cert => `
      <a href="${cert.pdf || '#'}" class="pd-cert-card" target="_blank" download>
        <div class="pd-cert-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E85D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="pd-cert-info">
          <span class="pd-cert-name">${cert.name}</span>
          <span class="pd-cert-desc">${cert.desc}</span>
          <span class="pd-cert-level">${cert.level}</span>
        </div>
        <span class="pd-cert-download">↓ 下载证书</span>
      </a>
    `).join('');
  }

  // 渲染搭配购买
  function renderBundles(product) {
    const grid = document.getElementById('pd-bundle-grid');
    if (!grid) return;

    const bundles = getBundleProducts ? getBundleProducts(product) : [];
    if (!bundles.length) {
      grid.innerHTML = '<p style="padding:20px;color:#999;">暂无搭配产品</p>';
      return;
    }

    grid.innerHTML = bundles.map(b => `
      <div class="pd-bundle-card">
        <div class="pd-bundle-img-wrap">
          <img class="pd-bundle-img" src="${b.images && b.images[0] ? b.images[0] : 'image/qiege.jpg'}" alt="${b.name_zh || b.name || ''}">
        </div>
        <div class="pd-bundle-info">
          <a href="product-detail.html?id=${b.id || b.sku}" class="pd-bundle-name">${b.name_zh || b.name || ''}</a>
          <div class="pd-bundle-meta">¥${b.price && b.price.tiers && b.price.tiers[0] ? b.price.tiers[0].price : '--'} / 件 · MOQ ${b.price ? b.price.moq : '--'}</div>
          <div class="pd-bundle-tags">
            ${(b.tags || []).slice(0, 2).map(t => `<span class="pd-bundle-tag">${t}</span>`).join('')}
          </div>
        </div>
        <button class="pd-bundle-add-btn">加入询盘</button>
      </div>
    `).join('');
  }

  // 渲染 FAQ
  function renderFAQ(product) {
    const list = document.getElementById('pd-faq-list');
    if (!list || !product.faq || !product.faq.length) return;

    list.innerHTML = product.faq.map(item => `
      <div class="pd-faq-item">
        <div class="pd-faq-q">
          <span>Q:</span>
          <span>${item.q}</span>
        </div>
        <div class="pd-faq-a">
          <span>A:</span>
          <span>${item.a}</span>
        </div>
      </div>
    `).join('');
  }

  // 渲染供应商
  function renderSupplier(product) {
    const infoEl = document.getElementById('pd-supplier-info');
    const sp = product.supplier;
    if (!infoEl || !sp) return;

    // Logo 区（静态）
    const logoEl = infoEl.querySelector('.pd-supplier-logo');
    if (logoEl) logoEl.textContent = '熊猫';

    // 文字信息
    const nameEl = infoEl.querySelector('h4');
    if (nameEl) nameEl.textContent = sp.name;

    const subEl = infoEl.querySelector('p');
    if (subEl) subEl.textContent = `专业生产安全防护手套12年 · ISO 9001认证工厂`;

    const badgesEl = infoEl.querySelector('.pd-supplier-badges');
    if (badgesEl) {
      badgesEl.innerHTML = `
        <span class="pd-badge">已验证</span>
        <span class="pd-badge">金牌供应商</span>
        <span class="pd-badge pd-badge-green">源头工厂</span>
      `;
    }

    // 产能数据
    const stats = document.getElementById('pd-supplier-stats');
    if (stats) {
      stats.innerHTML = `
        <div class="pd-capacity-item">
          <span class="pd-capacity-num">${sp.capacity || '50000+'}</span>
          <span class="pd-capacity-label">月产能（双）</span>
        </div>
        <div class="pd-capacity-item">
          <span class="pd-capacity-num">${sp.onTimeRate || '98%'}</span>
          <span class="pd-capacity-label">准时交付率</span>
        </div>
        <div class="pd-capacity-item">
          <span class="pd-capacity-num">${sp.exportCountries || '15+'}</span>
          <span class="pd-capacity-label">出口国家</span>
        </div>
        <div class="pd-capacity-item">
          <span class="pd-capacity-num">${sp.responseTime || '1h内'}</span>
          <span class="pd-capacity-label">响应率</span>
        </div>
      `;
    }

    // 证书标签
    const certTagsEl = document.querySelector('.pd-cert-tags');
    if (certTagsEl) {
      certTagsEl.innerHTML = (sp.certifications || ['ISO 9001', 'CE', 'EN 388', 'ANSI', 'SGS'])
        .map(c => `<span class="pd-cert-tag">${c}</span>`).join('');
    }

    // 主营产品
    const products = document.getElementById('pd-main-products-list');
    if (products && sp.mainProducts) {
      products.innerHTML = sp.mainProducts.map(p =>
        `<a href="products-all.html">${p}</a>`
      ).join('');
    }

    // 交易数据
    const tradeStats = document.querySelector('.pd-trade-stats');
    if (tradeStats) {
      tradeStats.innerHTML = `
        <div class="pd-trade-stat">
          <span class="pd-trade-num">${sp.annualRevenue || '$10万+'}</span>
          <span class="pd-trade-label">年出口额</span>
        </div>
        <div class="pd-trade-stat">
          <span class="pd-trade-num">${sp.orders || '280+'}</span>
          <span class="pd-trade-label">总订单数</span>
        </div>
        <div class="pd-trade-stat">
          <span class="pd-trade-num">${sp.repeatRate || '96%'}</span>
          <span class="pd-trade-label">回头率</span>
        </div>
      `;
    }
  }

  // 渲染描述区块
  function renderDescription(product) {
    const desc = document.getElementById('pd-desc-content');
    if (!desc) return;
    const attrs = product.attributes || {};
    const indMap = { metal: '金属加工', glass: '玻璃处理', mechanical: '机械制造', automotive: '汽车维修', chemical: '化工', agriculture: '农业', construction: '建筑施工' };
    const industries = (product.industries || []).map(i => indMap[i] || i).join('、');
    // 兼容中文 key（本地数据）和英文 key（API specs）
    const protLevel = attrs['防护等级'] || attrs['protection_level'] || '';
    const coating   = attrs['涂层']     || attrs['coating']          || '';
    const certs     = attrs['认证']     || attrs['standard']         || (product.certifications && product.certifications.join('、')) || '';
    const descText  = product.desc_zh   || product.shortDesc_zh      || (product.name_zh || product.name || '');

    desc.innerHTML = `
      <h4>产品描述</h4>
      <p>${descText}</p>
      <h4>产品特点</h4>
      <ul>
        ${protLevel ? `<li>防护等级：${protLevel}</li>` : ''}
        ${coating   ? `<li>涂层：${coating}</li>` : ''}
        ${certs     ? `<li>认证：${certs}</li>` : ''}
        <li>多种颜色和尺码可选</li>
        <li>可定制Logo和包装</li>
      </ul>
      <h4>应用领域</h4>
      <p>${industries ? industries + '等行业。' : '广泛应用于各行业防护场景。'}</p>
    `;
  }

  // 动态渲染属性面板（#pd-panel-spec）
  function renderSpecPanel(product) {
    const panel = document.getElementById('pd-panel-spec');
    if (!panel) return;
    const attrs = product.attributes || {};
    // 展示最重要的几个参数
    const specFields = [
      { key: ['型号',   'model'],      label: '型号' },
      { key: ['材质',   'material'],   label: '材质' },
      { key: ['克重',   'weight'],     label: '克重' },
      { key: ['长度',   'length'],     label: '长度' },
      { key: ['厚度',   'thickness'],  label: '厚度' },
      { key: ['颜色',   'color'],      label: '颜色' },
      { key: ['包装',   'package_spec'], label: '包装' },
    ];
    const rows = specFields.map(f => {
      const val = f.key.reduce((acc, k) => acc || attrs[k], '') || '';
      if (!val) return '';
      return `<div class="pd-spec-row"><span class="pd-spec-k">${f.label}</span><span class="pd-spec-v">${val}</span></div>`;
    }).filter(Boolean).join('');

    if (rows) {
      panel.innerHTML = `<div class="pd-spec-table">${rows}</div>`;
    }
    // 若无数据则保留现有硬编码内容，不清空
  }

  // 渲染"其他推荐" — 优先从 API 实时读取同品牌产品
  function renderAlsoView(product) {
    const scrollEl = document.getElementById('pd-av-scroll');
    const countEl  = document.getElementById('pd-av-count');
    if (!scrollEl) return;

    function renderRelatedItems(related) {
      if (countEl) countEl.textContent = `${related.length} 款产品`;
      if (!related || related.length === 0) {
        scrollEl.innerHTML = '<p style="padding:20px;color:#999;font-size:13px;">暂无推荐产品</p>';
        return;
      }
      scrollEl.innerHTML = related.slice(0, 8).map(p => {
        const name    = p.name_zh || p.name || '';
        const imgSrc  = (p.images && p.images[0]) ? p.images[0] : 'image/qiege.jpg';
        const priceVal = p.price_usd || (p.price && p.price.tiers && p.price.tiers[0] ? p.price.tiers[0].price : '--');
        const currency = p.price_usd ? '$' : '¥';
        const moqVal   = p.moq || (p.price ? p.price.moq : '--');
        return `<a href="product-detail.html?id=${p.id || p.sku}" class="pd-av-item">
          <div class="pd-av-img-wrap"><img class="pd-av-img" src="${imgSrc}" alt="${name}"></div>
          <div class="pd-av-name">${name}</div>
          <div class="pd-av-price">${currency}${priceVal}</div>
          <div class="pd-av-moqs">MOQ: ${moqVal} pairs</div>
        </a>`;
      }).join('');
    }

    const currentId = product.id || product.sku;

    // 优先从 API 加载同品牌产品
    if (window.PandaAPI && window.PandaAPI.Products) {
      window.PandaAPI.Products.list({ brand: product.brand, pageSize: 20 })
        .then(function(related) {
          if (!related || !related.length) return;
          related = related.filter(p => (p.id || p.sku) !== currentId);
          renderRelatedItems(related);
        })
        .catch(function() {
          // API 失败，用本地静态数据兜底
          var local = window.__PANDA_PRODUCTS__ || [];
          if (!local.length) return;
          var sameTags = new Set(product.tags || []);
          var fallback = local
            .filter(p => (p.id || p.sku) !== currentId)
            .map(p => ({ p, score: (p.tags || []).filter(t => sameTags.has(t)).length }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
            .map(x => x.p);
          renderRelatedItems(fallback);
        });
    } else {
      // 无 API 时用本地数据
      var local = window.__PANDA_PRODUCTS__ || [];
      if (!local.length) return;
      var sameTags = new Set(product.tags || []);
      var fallback = local
        .filter(p => (p.id || p.sku) !== currentId)
        .map(p => ({ p, score: (p.tags || []).filter(t => sameTags.has(t)).length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(x => x.p);
      renderRelatedItems(fallback);
    }
  }

  // 渲染品牌 + 评分统计行（标题下方）
  function renderStats(product) {
    // 品牌名：根据 brand slug 映射中文名称
    const brandMap = {
      shield:  'PandaSHIELD™',
      pierce:  'PandaPIERCE™',
      impact:  'PandaIMPACT™',
      chem:    'PandaCHEM™',
      bio:     'PandaBIO™',
      volt:    'PandaVOLT™',
      heat:    'PandaHEAT™',
      frost:   'PandaFROST™',
      grip:    'PandaGRIP™',
      eco:     'PandaECO™',
      nitrile: 'PandaGRIP™',
      latex:   'PandaSHIELD™',
      static:  'PandaVOLT™',
    };
    const brandName = brandMap[product.brand] || 'PandaSHIELD™';

    // 渲染第一行：品牌标签 + 动态标签（来自 product.tags）
    const tagsEl = document.getElementById('pd-stats-tags');
    if (tagsEl) {
      // 固定标签：品牌名
      let tagsHtml = `<span class="pd-stats-brand-tag pd-tag-orange">${brandName}</span>`;
      // 从 product.tags 动态生成，过滤常见认证关键词给绿色，其他橙色
      const certKeywords = ['CE', 'EN', 'ANSI', 'ISO', 'SGS', 'GB', 'REACH'];
      const tagColors = { '热销': 'pd-tag-red', '工厂直营': 'pd-tag-green', '源头工厂': 'pd-tag-green', '7天发货': 'pd-tag-orange', '现货': 'pd-tag-green' };
      if (product.tags && product.tags.length) {
        product.tags.forEach(tag => {
          const isCert = certKeywords.some(k => tag.toUpperCase().includes(k));
          const colorClass = tagColors[tag] || (isCert ? 'pd-tag-green' : 'pd-tag-orange');
          tagsHtml += `<span class="pd-stats-brand-tag ${colorClass}">${tag}</span>`;
        });
      } else {
        // 无 tags 时保留默认展示
        tagsHtml += `
          <span class="pd-stats-brand-tag pd-tag-red">热销</span>
          <span class="pd-stats-brand-tag pd-tag-green">工厂直营</span>
          <span class="pd-stats-brand-tag pd-tag-green">源头工厂</span>
          <span class="pd-stats-brand-tag pd-tag-orange">7天发货</span>
          <span class="pd-stats-brand-tag pd-tag-green">CE认证</span>
        `;
      }
      tagsEl.innerHTML = tagsHtml;
    }

    // 从评论数组动态计算平均分和数量
    const reviews = product.reviews && product.reviews.product
      ? product.reviews.product : [];
    const reviewCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 128);
    const avgRating = reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : (product.avgRating || '4.9');

    // 询盘数（占位，可后续替换为真实数据）
    const inquiryCount = product.inquiryCount || '2.4k+';

    // 渲染第二行：评分统计
    const numsEl = document.getElementById('pd-stats-numbers');
    if (numsEl) {
      numsEl.innerHTML = `
        <span class="pd-rating-val">${avgRating}</span>
        <span class="pd-rating-label">买家评分</span>
        <span class="pd-stats-divider">|</span>
        <span>${reviewCount} 条评价</span>
        <span class="pd-stats-divider">|</span>
        <span>${inquiryCount} 近90天询盘</span>
      `;
    }
  }

  // 主函数：初始化详情页（优先API，fallback本地数据）
  async function init() {
    const id = getProductId();
    console.log('[init] 加载产品 ID:', id);

    // 检查 __PANDA_PRODUCTS__ 是否加载
    var allProds = window.__PANDA_PRODUCTS__;
    console.log('[init] __PANDA_PRODUCTS__ 数量:', allProds ? allProds.length : 'undefined');

    // 先从本地保存一份产品数据（API覆盖__PANDA_PRODUCTS__后备用）
    var localProduct = getProductById(id);
    console.log('[init] 本地数据:', localProduct ? '找到' : '未找到', localProduct && localProduct.images ? 'images=' + localProduct.images.length : '无images');

    let product = localProduct;

    // 尝试从API加载（通过 PandaAPI 封装，自动处理跨端口）
    try {
      const apiProduct = await window.PandaAPI.Products.getBySku(id);
      console.log('[init] API数据:', apiProduct ? '找到 id=' + apiProduct.id + ' images=' + (apiProduct.images ? apiProduct.images.length : '无') : 'API返回null');
      if (apiProduct) product = apiProduct;
    } catch (e) {
      console.log('[init] API异常:', e.message);
    }

    if (!product) {
      console.warn('[product-detail.js] 未找到产品 ID:', id);
      return;
    }

    console.log('[init] 最终使用 product.images 数量:', (product.images || []).length);

    // API 返回的 specs JSON 合并进 attributes（与发布页两两对应）
    if (product.specs && typeof product.specs === 'object') {
      product.attributes = Object.assign({}, product.attributes || {}, product.specs);
    }

    // API 数据没有 attributes，从本地保存的数据补上（确保新 attributes 生效）
    if (!product.attributes || Object.keys(product.attributes).length === 0) {
      console.log('[product-detail] API attributes 空，使用本地数据 id=' + id, localProduct ? '本地有数据' : '本地也无数据');
      if (localProduct && localProduct.attributes) {
        product.attributes = localProduct.attributes;
        console.log('[product-detail] 已补上本地 attributes');
      }
    }

    renderHeader(product);
    renderStats(product);
    renderGallery(product);
    renderOptions(product);
    renderPrice(product);
    renderAttributes(product);
    renderSpecPanel(product);
    renderReviews(product);
    renderCertificates(product);
    renderBundles(product);
    renderFAQ(product);
    renderSupplier(product);
    renderDescription(product);
    renderAlsoView(product);

    window.__currentProduct = product;

    // ── 写入浏览历史（localStorage） ─────────────────────────
    (function saveBrowseHistory() {
      var key = 'panda_browse_history';
      var history = [];
      try { history = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
      if (!Array.isArray(history)) history = [];

      var entry = {
        sku: product.id || product.sku,
        name: product.name_zh || product.name || product.sku || '',
        brand: product.brand || '',
        image: (product.images && product.images[0]) ? product.images[0] : '',
        price: product.price_usd || (product.price && product.price.tiers && product.price.tiers[0] ? product.price.tiers[0].price : ''),
        time: Date.now()
      };

      // 同一个产品去重（按 sku），保留最新一条
      history = history.filter(function(h) { return (h.sku || '') !== (entry.sku || ''); });
      history.unshift(entry);
      // 最多保留 50 条
      if (history.length > 50) history = history.slice(0, 50);

      localStorage.setItem(key, JSON.stringify(history));
    })();

    // 生成 JSON-LD 结构化数据
    var ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name_zh || product.name || product.sku,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": "Panda Guard"
      },
      "description": product.shortDesc_zh || product.desc_zh || (product.name_zh || product.name || ''),
      "offers": {
        "@type": "Offer",
        "price": product.moq_price || product.price || "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    };
    var ldEl = document.getElementById('pd-jsonld');
    if (ldEl) ldEl.textContent = JSON.stringify(ld);

    // 动态更新页面 title
    var title = (product.name_zh || product.name || product.sku) + ' — 熊猫手护 Panda Guard';
    if (!window.__pandaTitleLocked && (!document.title || document.title === 'Panda Hand Guard')) {
      document.title = title;
      window.__pandaTitleLocked = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
