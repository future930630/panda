/**
 * brands-config.js
 * 从 brands-config.json 读取品牌数据，动态填充品牌页面
 */
(function() {
  // 获取当前页面文件名，提取品牌ID
  var pathParts = window.location.pathname.split('/');
  var filename = pathParts[pathParts.length - 1] || 'index.html';
  var brandId = filename.replace('.html', '').toLowerCase();

  // 映射文件名到JSON中的key
  var brandMap = {
    'pandashield': 'shd',
    'shd': 'shd',
    'pandabio': 'bio',
    'bio': 'bio',
    'pandachem': 'chem',
    'chem': 'chem',
    'pandaeco': 'eco',
    'eco': 'eco',
    'pandafrost': 'frost',
    'frost': 'frost',
    'pandagrip': 'grip',
    'grip': 'grip',
    'pandaheat': 'heat',
    'heat': 'heat',
    'pandaimpact': 'impact',
    'impact': 'impact',
    'pandapierce': 'pir',
    'pir': 'pir',
    'pandavolt': 'volt',
    'volt': 'volt'
  };

  var configKey = brandMap[brandId] || brandId;

  // 加载 brands-config.json（使用绝对路径）
  fetch('/brands-config.json?v=20260426')
    .then(function(response) { return response.json(); })
    .then(function(allBrands) {
      var brand = allBrands[configKey];
      if (!brand) {
        console.warn('Brand config not found for:', configKey);
        return;
      }
      applyBrandData(brand);
    })
    .catch(function(err) {
      console.error('Failed to load brand config:', err);
    });

  function applyBrandData(brand) {
    // 1. 更新 meta 信息
    document.title = brand.meta.title;

    // 2. 更新 HERO 区域
    var heroSection = document.querySelector('.bp-hero');
    if (heroSection) {
      heroSection.style.setProperty('--hero-accent', brand.heroAccent);
      heroSection.style.setProperty('--hero-glow', brand.heroGlow);

      var brandPill = heroSection.querySelector('.bp-brand-pill');
      if (brandPill) {
        brandPill.textContent = brand.hero.brandPill;
        brandPill.style.background = brand.hero.brandPillColor;
      }

      var heroTitle = heroSection.querySelector('.bp-hero-title');
      if (heroTitle) heroTitle.innerHTML = brand.hero.title;

      var heroSub = heroSection.querySelector('.bp-hero-sub');
      if (heroSub) heroSub.textContent = brand.hero.subtitle;

      // Stats
      var statsContainer = heroSection.querySelector('.bp-hero-stats');
      if (statsContainer) {
        statsContainer.innerHTML = brand.hero.stats.map(function(s) {
          return '<div class="bp-stat"><span class="bp-stat-val" style="color:' + brand.heroAccent + ';">' + s.val + '</span><span class="bp-stat-label">' + s.label + '</span></div>';
        }).join('');
      }

      // CTA buttons
      var btnPrimary = heroSection.querySelector('.bp-btn-primary, .bp-hero-btns .bp-btn:first-child');
      if (btnPrimary) btnPrimary.textContent = brand.hero.btnPrimary;

      var btnSecondary = heroSection.querySelector('.bp-btn-outline, .bp-hero-btns .bp-btn:nth-child(2)');
      if (btnSecondary) btnSecondary.textContent = brand.hero.btnSecondary;
    }

    // 3. 更新 PRODUCT INTRO
    var introSection = document.querySelector('.bp-section.bp-white');
    if (introSection) {
      var overline = introSection.querySelector('.bp-overline');
      if (overline) overline.textContent = brand.intro.overline;

      var h2 = introSection.querySelector('.bp-h2');
      if (h2) h2.textContent = brand.intro.h2;

      var body = introSection.querySelector('.bp-body');
      if (body) body.textContent = brand.intro.body;

      // Features
      var featureList = introSection.querySelector('.bp-feature-list');
      if (featureList) {
        featureList.innerHTML = brand.intro.features.map(function(f) {
          return '<li><span class="bp-fl-dot" style="background:' + brand.heroAccent + ';"></span>' + f.text + '</li>';
        }).join('');
      }
    }

    // 4. 更新技术参数表格
    var specTable = document.querySelector('.bp-spec-table');
    if (specTable) {
      specTable.innerHTML = brand.specs.map(function(s) {
        return '<tr><th>' + s.label + '</th><td>' + s.value + '</td></tr>';
      }).join('');
    }

    // 5. 更新 VARIANTS
    var variantGrid = document.querySelector('.bp-variant-grid');
    if (variantGrid) {
      variantGrid.innerHTML = brand.variants.map(function(v) {
        return '<div class="bp-variant-card">\
          <div class="bp-variant-head" style="background:' + v.headBg + ';">\
            <span class="bp-variant-icon">' + v.icon + '</span>\
          </div>\
          <div class="bp-variant-body">\
            <h4>' + v.title + ' <span class="bp-vtag">' + v.tag + '</span></h4>\
            <p>' + v.desc + '</p>\
            <ul class="bp-vspec">' + v.specs.map(function(s) { return '<li>' + s + '</li>'; }).join('') + '</ul>\
          </div>\
        </div>';
      }).join('');
    }

    // 6. 更新 INDUSTRIES
    var industryGrid = document.querySelector('.bp-industry-grid');
    if (industryGrid) {
      industryGrid.innerHTML = brand.industries.map(function(ind) {
        return '<div class="bp-ind-item"><span class="bp-ind-icon">' + ind.icon + '</span><strong>' + ind.strong + '</strong><small>' + ind.small + '</small></div>';
      }).join('');
    }

    // 7. 更新 CTA
    var ctaSection = document.querySelector('.bp-cta');
    if (ctaSection) {
      ctaSection.style.setProperty('--cta-color', brand.heroAccent);

      var ctaH2 = ctaSection.querySelector('h2');
      if (ctaH2) ctaH2.textContent = brand.cta.h2;

      var ctaP = ctaSection.querySelector('p');
      if (ctaP) ctaP.textContent = brand.cta.p;

      var ctaBtns = ctaSection.querySelectorAll('.bp-btn');
      if (ctaBtns[0]) ctaBtns[0].textContent = brand.cta.btnPrimary;
      if (ctaBtns[1]) ctaBtns[1].textContent = brand.cta.btnSecondary;
    }

    // 8. 更新面包屑
    var breadcrumb = document.querySelector('.site-breadcrumb span:last-child');
    if (breadcrumb) breadcrumb.textContent = brand.breadcrumb;
  }
})();