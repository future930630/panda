// ============================================================
// PANDA SECURITY — MAIN SCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Hero Background Image Carousel ----
  const heroBg = document.getElementById('heroBg');
  const heroImages = [
    'image/gaowen.jpeg',      // 高温手套
    'image/qiege.jpg',        // 切割手套
    'image/jihan.jpg',        // 极寒手套
    'image/gaowen2.jpeg',     // 高温手套2
    'image/ci.jpg',           // 磁
    'image/gaoerfu.jpeg',     // 高尔夫
    'image/huaban.jpg',       // 滑板
    'image/shiyou.jpeg',      // 石油
    'image/jianzhu2.jpg',     // 建筑2
    'image/jingmi.jpg',       // 精密
    'image/zixingche2.jpg',   // 自行车2
    'image/zixingche.webp',   // 自行车
    'image/shoumenyuan.jpeg', // 守门员
    'image/masu.jpeg',        // 马术
    'image/diaoyu.jpg',       // 钓鱼
    'SOLID_COLOR'             // 纯色背景
  ];
  const gradient = 'linear-gradient(135deg, rgba(26, 17, 8, 0.6) 0%, rgba(42, 26, 6, 0.4) 50%, rgba(26, 17, 8, 0.6) 100%)';
  let currentImageIndex = 0;
  let carouselInterval = null;

  function setHeroImage(index) {
    if (heroBg) {
      // 处理纯色背景
      if (heroImages[index] === 'SOLID_COLOR') {
        heroBg.style.backgroundImage = 'linear-gradient(135deg, #E85D00 0%, #1A1108 50%, #E85D00 100%)';
      } else {
        heroBg.style.backgroundImage = gradient + ", url('" + heroImages[index] + "')";
      }
      heroBg.style.backgroundSize = 'cover';
      heroBg.style.backgroundPosition = 'center 30%';
      heroBg.style.backgroundAttachment = 'fixed';
      
      // 更新指示点
      const indicators = document.querySelectorAll('.hero-carousel-indicators .indicator');
      indicators.forEach((ind, idx) => {
        if (idx === index) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    }
  }

  function nextHeroImage() {
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    setHeroImage(currentImageIndex);
  }

  // 初始化第一张图片
  setHeroImage(0);

  // 每 3 秒切换一次图片
  carouselInterval = setInterval(nextHeroImage, 3000);

  // 点击指示点切换图片
  const indicators = document.querySelectorAll('.hero-carousel-indicators .indicator');
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.getAttribute('data-index'));
      currentImageIndex = index;
      setHeroImage(index);
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextHeroImage, 3000);
    });
  });

  // ---- Header Scroll Effect ----
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  // 调试：验证按钮是否存在
  console.log('[Back-to-Top] Button element:', backToTopBtn ? '✓ Found' : '✗ Not found');
  if (backToTopBtn) {
    console.log('[Back-to-Top] Initial visibility:', window.getComputedStyle(backToTopBtn).visibility);
    console.log('[Back-to-Top] Initial opacity:', window.getComputedStyle(backToTopBtn).opacity);
  }
  
  // Header scroll effect - 简单稳定版本
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (header) {
      if (scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Show/hide back to top button
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });
  
  // Back to Top functionality
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[Back-to-Top] Button clicked');
      // 使用requestAnimationFrame实现平滑滚动，避免抖动
      const startPosition = window.pageYOffset;
      const duration = 500; // 动画持续时间ms
      const startTime = performance.now();
      
      function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // 使用easeInOutCubic缓动函数
        const easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition * (1 - easeProgress));
        
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      }
      
      requestAnimationFrame(scrollAnimation);
    });
    console.log('[Back-to-Top] Click handler attached ✓');
  }

  // ---- Full-Width Mega Menu: fixed 定位，动态计算 top 与展开模式 ----
  const headerEl = document.getElementById('header');

  function getOuterWidth(element) {
    if (!element) return 0;
    const styles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return rect.width + (parseFloat(styles.marginLeft) || 0) + (parseFloat(styles.marginRight) || 0);
  }

  function getChildrenIntrinsicWidth(container) {
    if (!container) return 0;
    const children = Array.from(container.children).filter(child => window.getComputedStyle(child).display !== 'none');
    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    return children.reduce((total, child, index) => {
      return total + getOuterWidth(child) + (index < children.length - 1 ? gap : 0);
    }, 0);
  }

  function getHeaderLogoVisualRect(root, fallbackRect) {
    const logo = (root && root.querySelector('.header-logo')) || document.querySelector('.header-logo');
    if (!logo) return fallbackRect;

    const candidates = Array.from(logo.querySelectorAll('img, svg, .logo-wordmark, .logo-wordmark-main'));
    const visibleCandidate = candidates.find((element) => {
      const styles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });

    return visibleCandidate ? visibleCandidate.getBoundingClientRect() : logo.getBoundingClientRect();
  }

  function syncMegaMenuMode(menu, availableWidth) {
    const inner = menu.querySelector('.mega-fw-inner');
    if (!inner) return;

    const directChildren = Array.from(inner.children).filter(child => window.getComputedStyle(child).display !== 'none');
    const mediaPanel = directChildren.find(child => child.classList.contains('mega-img-panel')) || null;
    const colsWrap = directChildren.find(child => child.classList.contains('mega-cols-wrap')) || null;
    if (!colsWrap) return;

    const isProductsMenu = colsWrap.classList.contains('no-divider');
    inner.dataset.megaType = isProductsMenu ? 'products' : 'plain';

    if (!isProductsMenu) {
      inner.dataset.megaMode = 'plain';
      return;
    }


    const innerStyles = window.getComputedStyle(inner);
    const trackGap = parseFloat(innerStyles.columnGap || innerStyles.gap) || 0;
    const colsWidth = getChildrenIntrinsicWidth(colsWrap);
    const mediaWidth = mediaPanel ? getOuterWidth(mediaPanel) : 0;
    const totalWidth = colsWidth + (mediaPanel ? mediaWidth + trackGap : 0);
    const mode = totalWidth <= availableWidth ? 'spread' : 'center';

    inner.dataset.megaMode = mode;
  }


  function positionMegaMenus() {
    if (!headerEl) return;
    const headerRect = headerEl.getBoundingClientRect();
    const searchBtn = document.getElementById('headerSearchBtn');
    const logoRect = getHeaderLogoVisualRect(headerEl, headerRect);
    const buttonRect = searchBtn ? searchBtn.getBoundingClientRect() : headerRect;
    const leftGap = Math.max(16, logoRect.left);
    const rightGap = Math.max(16, window.innerWidth - buttonRect.right);
    const availableWidth = Math.max(0, window.innerWidth - leftGap - rightGap);
    // 使用header底部位置作为mega-menu的top值
    const bottom = Math.round(headerRect.bottom);
    document.querySelectorAll('.mega-menu').forEach(m => {
      m.style.top = bottom + 'px';
      m.style.setProperty('--mega-left-gap', leftGap + 'px');
      m.style.setProperty('--mega-right-gap', rightGap + 'px');
      syncMegaMenuMode(m, availableWidth);
    });
  }


  // 初始定位
  positionMegaMenus();
  // 使用requestAnimationFrame优化滚动时的性能
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        positionMegaMenus();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', positionMegaMenus);

  let megaTimer = null;
  document.querySelectorAll('.nav-item.has-mega').forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(megaTimer);
      positionMegaMenus();
      document.querySelectorAll('.nav-item.has-mega').forEach(other => {
        if (other !== item) other.classList.remove('mega-open');
      });
      item.classList.add('mega-open');
    });
    item.addEventListener('mouseleave', () => {
      megaTimer = setTimeout(() => {
        item.classList.remove('mega-open');
      }, 150);
    });
    const menu = item.querySelector('.mega-menu');
    if (menu) {
      menu.addEventListener('mouseenter', () => clearTimeout(megaTimer));
      menu.addEventListener('mouseleave', () => {
        megaTimer = setTimeout(() => {
          item.classList.remove('mega-open');
        }, 150);
      });
    }
  });

  // 点击页面其他地方关闭
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-mega')) {
      document.querySelectorAll('.nav-item.has-mega').forEach(item => item.classList.remove('mega-open'));
    }
  });

  // ---- Progress Bar Animate on Scroll ----
  const progressBars = document.querySelectorAll('.pp-fill, .pipe-bar div');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetWidth = el.style.width;
        el.style.width = '0';
        setTimeout(() => { el.style.transition = 'width 1.4s cubic-bezier(0.4,0,0.2,1)'; el.style.width = targetWidth; }, 100);
        progressObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(b => progressObserver.observe(b));

  // ---- Product Tab Switch ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ---- Mobile Hamburger（CSS class 驱动，与 nav-shared.js 保持一致） ----
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  // 创建遮罩层
  let mobileOverlay = document.getElementById('mobileNavOverlay');
  if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobileNavOverlay';
    mobileOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(mobileOverlay);
  }

  // 注入关闭按钮
  if (mainNav && !mainNav.querySelector('.mobile-nav-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close-btn';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    mainNav.insertBefore(closeBtn, mainNav.firstChild);
    closeBtn.addEventListener('click', closeMobileNavIndex);
  }

  function openMobileNavIndex() {
    if (!mainNav) return;
    // 清除旧内联样式
    ['display','flexDirection','position','top','left','right','background','padding','boxShadow','zIndex'].forEach(p => mainNav.style[p] = '');
    mainNav.classList.add('mobile-nav-drawer', 'mobile-open');
    mobileOverlay.classList.add('active');
    hamburger && hamburger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNavIndex() {
    if (!mainNav) return;
    mainNav.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
    hamburger && hamburger.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.contains('mobile-open') ? closeMobileNavIndex() : openMobileNavIndex();
    });
  }
  mobileOverlay.addEventListener('click', closeMobileNavIndex);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('mobile-open')) closeMobileNavIndex();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('mobile-open')) closeMobileNavIndex();
  });

  // ---- Intersection Observer: Fade-in animations ----
  const observeItems = document.querySelectorAll(
    '.brand-card, .product-card, .solution-card, .industry-card, .sport-card, .news-card, .cert-item'
  );
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observeItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(item);
  });

  // ---- Stats Bar Counter Animation with Random Numbers ----
  console.log('[Stats] 开始初始化统计栏动画');
  
  function animateStatNum(el) {
    try {
      // 获取目标值（固定）
      const targetVal = el.getAttribute('data-target');
      
      if (!targetVal) {
        console.warn('[Stats] 缺少 data-target 属性');
        return;
      }
      
      const targetNum = parseInt(targetVal, 10);
      console.log('[Stats] 动画目标值:', targetNum, '（固定值）');
      
      // 格式化数字（带千分位分隔符）
      const format = (n) => {
        if (targetNum >= 1000) {
          return n.toLocaleString('en-US');
        }
        return String(n);
      };

      let current = 0;
      const duration = 1800; // 1.8秒
      const startTime = performance.now();
      
      const ease = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      // 获取原始sup内容（默认为+）
      const supEl = el.querySelector('sup');
      const supContent = supEl ? supEl.innerHTML : '+';
      
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = ease(progress);
        current = Math.floor(eased * targetNum);
        
        // 显示：数字 + 原始sup内容
        el.innerHTML = format(current) + '<sup>' + supContent + '</sup>';
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // 确保最终值正确显示
          el.innerHTML = format(targetNum) + '<sup>' + supContent + '</sup>';
          console.log('[Stats] 动画完成，最终值:', targetNum);
        }
      };

      console.log('[Stats] 启动动画');
      requestAnimationFrame(animate);
    } catch (error) {
      console.error('[Stats] 动画出错:', error);
    }
  }

  // 使用 IntersectionObserver 监控元素进入视口，每次进入都重新动画
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  // 标记是否已动画过，确保只动画一次
  let statsAnimated = false;

  // 初始化：只执行一次统计数字动画
  function setupStatsObserver() {
    const sbNums = document.querySelectorAll('.sb-num');
    console.log('[Stats] 找到', sbNums.length, '个统计数字元素');
    
    if (sbNums.length === 0) {
      console.error('[Stats] 没有找到 .sb-num 元素');
      return;
    }
    
    // 只执行一次动画，不再绑定滚动观察器
    if (!statsAnimated) {
      sbNums.forEach(el => {
        animateStatNum(el);
      });
      statsAnimated = true;
      console.log('[Stats] 统计数字动画已执行（仅一次）');
    }
  }

  // 确保 DOM 已加载后再执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(setupStatsObserver, 100);
    });
  } else {
    setTimeout(setupStatsObserver, 100);
  }
  
  // 暴露全局函数，用于在页面交互时重新触发统计动画
  window.refreshStatsAnimation = function() {
    console.log('[Stats] 手动重新触发统计动画');
    const sbNums = document.querySelectorAll('.sb-num');
    sbNums.forEach(el => {
      animateStatNum(el);
    });
  };

  // ---- 字体大小控制功能 ----
  const fontSizeControl = document.querySelector('.font-size-control');
  if (fontSizeControl) {
    const smallBtn = fontSizeControl.querySelector('.font-size-small');
    const mediumBtn = fontSizeControl.querySelector('.font-size-medium');
    const largeBtn = fontSizeControl.querySelector('.font-size-large');
    const minScale = 0.85;
    const maxScale = 1.25;
    let currentFontScale = parseFloat(localStorage.getItem('fontScale')) || 1;

    currentFontScale = Math.min(maxScale, Math.max(minScale, currentFontScale));

    const skippedTags = new Set([
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CIRCLE', 'ELLIPSE',
      'POLYLINE', 'POLYGON', 'LINE', 'IMG', 'VIDEO', 'SOURCE', 'BR', 'HR',
      'META', 'LINK'
    ]);

    function getScalableElements() {
      if (!document.body) return [];
      return Array.from(document.body.querySelectorAll('*')).filter((el) => {
        if (skippedTags.has(el.tagName)) return false;
        if (el.closest('svg')) return false;
        const computed = window.getComputedStyle(el);
        return !!computed && computed.fontSize && computed.fontSize !== '0px';
      });
    }

    function rememberBaseTypography(el) {
      const computed = window.getComputedStyle(el);
      const currentSize = parseFloat(computed.fontSize);
      if (!Number.isFinite(currentSize) || currentSize <= 0) return;

      if (!el.dataset.baseFontSize) {
        el.dataset.baseFontSize = (currentSize / currentFontScale).toFixed(4);
      }

      if (!el.dataset.baseLineHeight && computed.lineHeight && computed.lineHeight.endsWith('px')) {
        const currentLineHeight = parseFloat(computed.lineHeight);
        if (Number.isFinite(currentLineHeight) && currentLineHeight > 0) {
          el.dataset.baseLineHeight = (currentLineHeight / currentFontScale).toFixed(4);
        }
      }
    }

    function applyTypographyScale(scale) {
      getScalableElements().forEach((el) => {
        rememberBaseTypography(el);

        const baseFontSize = parseFloat(el.dataset.baseFontSize || '0');
        if (Number.isFinite(baseFontSize) && baseFontSize > 0) {
          el.style.fontSize = `${(baseFontSize * scale).toFixed(2)}px`;
        }

        const baseLineHeight = parseFloat(el.dataset.baseLineHeight || '0');
        if (Number.isFinite(baseLineHeight) && baseLineHeight > 0) {
          el.style.lineHeight = `${(baseLineHeight * scale).toFixed(2)}px`;
        }
      });
    }

    function updateButtonState(button, isActive) {
      if (!button) return;
      button.style.opacity = isActive ? '1' : '0.55';
      button.style.color = isActive ? 'var(--orange)' : '';
    }

    function applyFontScale() {
      document.documentElement.style.setProperty('--font-scale', currentFontScale);
      document.documentElement.style.fontSize = (16 * currentFontScale) + 'px';
      document.body?.setAttribute('data-font-scale', String(currentFontScale));
      applyTypographyScale(currentFontScale);
      localStorage.setItem('fontScale', String(currentFontScale));

      updateButtonState(smallBtn, currentFontScale <= minScale + 0.001);
      updateButtonState(mediumBtn, currentFontScale > minScale + 0.001 && currentFontScale < maxScale - 0.001);
      updateButtonState(largeBtn, currentFontScale >= maxScale - 0.001);

      console.log('[FontSize] Applied:', currentFontScale);
    }

    function setFontScale(action, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (action === 'decrease') {
        currentFontScale = minScale;
      } else if (action === 'increase') {
        currentFontScale = maxScale;
      } else {
        currentFontScale = 1;
      }

      applyFontScale();
    }

    window._pandaFontSet = setFontScale;
    window._pandaFontApply = applyFontScale;

    applyFontScale();

    if (smallBtn && !smallBtn.dataset.pandaFontBound) {
      smallBtn.dataset.pandaFontBound = 'true';
      smallBtn.addEventListener('click', (e) => setFontScale('decrease', e));
    }

    if (mediumBtn && !mediumBtn.dataset.pandaFontBound) {
      mediumBtn.dataset.pandaFontBound = 'true';
      mediumBtn.addEventListener('click', (e) => setFontScale('reset', e));
    }

    if (largeBtn && !largeBtn.dataset.pandaFontBound) {
      largeBtn.dataset.pandaFontBound = 'true';
      largeBtn.addEventListener('click', (e) => setFontScale('increase', e));
    }
  }


});


  // ---- User Status Bar ----
  // 注意：index.html 的登录状态由 script.js 统一处理（带下拉菜单）
  // 其他页面使用 nav-shared.js 的 updateHeaderLoginState()
  (function(){
    // Admin pages have their own topbar — skip
    if (/admin\.html$/i.test(location.pathname)) return;
    // 除了 index.html 之外，其他使用 nav-shared.js 的页面跳过这里
    // nav-shared.js 会在注入导航后调用 i18n.js 的 updateHeaderLoginState()
    if (!/index\.html$/i.test(location.pathname) && location.pathname !== '/') return;
    var t=localStorage.getItem('panda_token'), u=localStorage.getItem('panda_user');
    if(!t||!u)return; var user; try{user=JSON.parse(u)}catch(e){return}
    if(!user||!user.email)return;
    var ia=user.role==='admin';
    var uname=user.username||user.name||(user.email||'').split('@')[0];
    var initials=(uname[0]||'?').toUpperCase();

    // Admin用户登录后 → 首页完全隐藏黑条（管理员用管理后台即可）
    // 双重判断：role === 'admin' 或 localStorage 有管理员登录标记
    if (ia || localStorage.getItem('panda_admin') === '1') return;

    // 客户用户 → 隐藏原注册图标，在其位置显示圆形头像+下拉菜单
    var regBtn=document.querySelector('.header-register-icon-btn');
    if(!regBtn)return;

    // 防止重复注入：如果已经显示了头像，直接退出
    if (document.getElementById('panda-user-icon')) return;

    // 注入样式
    var sty=document.createElement('style');
    sty.textContent=[
      '.header-register-icon-btn.logged-in{display:none !important;}',
      '#panda-user-icon{position:relative;display:inline-flex;align-items:center;cursor:pointer;gap:1px;}',
      '#panda-user-avatar{width:32px;height:32px;background:#E85D00;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;box-shadow:0 2px 8px rgba(232,93,0,.25);transition:box-shadow .2s,transform .2s;}',
      '#panda-user-avatar:hover{box-shadow:0 3px 12px rgba(232,93,0,.4);transform:scale(1.08);}',
      '#panda-user-icon:hover #panda-user-dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);pointer-events:auto;}',
      '#panda-user-dropdown{min-width:170px;position:absolute;top:calc(100% + 2px);left:50%;transform:translateX(-50%) translateY(-8px);background:#fff;border:1px solid #E8E0D8;border-radius:10px;box-shadow:0 8px 30px rgba(26,17,8,.16);padding:6px 0;z-index:99999;opacity:0;visibility:hidden;transition:opacity .18s ease;pointer-events:none;}',
      '#panda-user-dropdown a{display:flex;align-items:center;gap:10px;padding:10px 18px;font-size:13px;color:#1A1108;text-decoration:none;transition:background .15s;white-space:nowrap;}',
      '#panda-user-dropdown a:hover{background:#FFF3E0;color:#E85D00;}',
      '#panda-user-dropdown .pud-icon{font-size:15px;width:20px;text-align:center;}',
      '#panda-user-dropdown .pud-divider{height:1px;background:#F0EBE3;margin:4px 0;}',
      '#panda-user-dropdown .pud-logout{color:#C0392B;}',
      '#panda-user-dropdown .pud-logout:hover{background:#FDEDEC;color:#C0392B;}'
    ].join('');
    document.head.appendChild(sty);

    // 隐藏原注册图标
    regBtn.classList.add('logged-in');

    // 在注册图标后面插入头像
    var ic=document.createElement('div');
    ic.id='panda-user-icon';
    // 优先读取用户上传的头像，否则显示名字首字母
    var savedAvatar = localStorage.getItem('panda_avatar') || '';
    var avatarContent = savedAvatar
      ? '<img id=\"panda-user-avatar\" src=\"' + savedAvatar + '\" style=\"width:32px;height:32px;border-radius:50%;object-fit:cover;\">'
      : '<div id=\"panda-user-avatar\">'+initials+'</div>';
    ic.innerHTML = avatarContent;
    regBtn.parentNode.insertBefore(ic, regBtn.nextSibling);

    var dr=document.createElement('div');
    dr.id='panda-user-dropdown';
    dr.innerHTML=
      '<a href="customer.html#tab-orders"><span class="pud-icon">📋</span>我的订单</a>'
      +'<a href="customer.html#tab-browse"><span class="pud-icon">👁️</span>浏览记录</a>'
      +'<a href="customer.html#tab-samples"><span class="pud-icon">📦</span>样品申请</a>'
      +'<a href="customer.html#tab-notifications"><span class="pud-icon">🔔</span>消息通知</a>'
      +'<a href="customer.html#tab-security"><span class="pud-icon">🔒</span>账户安全</a>'
      +'<a href="customer.html#tab-profile"><span class="pud-icon">👤</span>我的资料</a>'
      +'<div class="pud-divider"></div>'
      +'<a href="#" onclick="pandaLogout();return false;" class="pud-logout"><span class="pud-icon">🚪</span>退出登录</a>';
    ic.appendChild(dr);

    // 点击头像 → 跳转客户中心主页
    document.getElementById('panda-user-avatar').addEventListener('click',function(){
      window.location.href='customer.html';
    });

    pandaLogout=function(){
      localStorage.removeItem('panda_token');
      localStorage.removeItem('panda_user');
      localStorage.removeItem('panda_admin');
      var rb=document.querySelector('.header-register-icon-btn');
      if(rb)rb.classList.remove('logged-in');
      // 移除头像元素
      var ui=document.getElementById('panda-user-icon');
      if(ui)ui.remove();
      window.location.reload();
    };
  })();

  // 兜底：每隔2秒检测一次登录状态（用于解决跨页面跳转后状态不同步的问题）
  (function(){
    var t=localStorage.getItem('panda_token'), u=localStorage.getItem('panda_user');
    var lastLoginState = !!(t&&u); // 初始化为当前实际状态，避免首次加载就触发reload
    function syncLoginState(){
      var t2=localStorage.getItem('panda_token'), u2=localStorage.getItem('panda_user');
      var currentLogin = !!(t2&&u2);
      if(currentLogin !== lastLoginState){
        lastLoginState = currentLogin;
        if(currentLogin){
          var regBtn=document.querySelector('.header-register-icon-btn');
          if(!regBtn)return;
          if(!document.getElementById('panda-user-icon')){
            window.location.reload();
          }
        }
      }
    }
    if(document.readyState === 'complete'){
      syncLoginState();
    } else {
      window.addEventListener('load', syncLoginState);
    }
    setInterval(syncLoginState, 2000);
    window.addEventListener('storage', function(e){
      if(e.key === 'panda_token' || e.key === 'panda_user'){
        syncLoginState();
      }
    });
  })();
