(function () {
  var tabs = document.querySelectorAll('.auth-tab');
  var forms = document.querySelectorAll('.auth-form');
  var passwordInput = document.getElementById('signup-password');
  var strengthBars = document.querySelectorAll('.password-strength-bar');
  var flipContainer = document.getElementById('authGridFlip');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function switchTab(tabName) {
    tabs.forEach(function(tab) {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    forms.forEach(function(form) {
      form.classList.toggle('active', form.id === tabName + '-form');
    });
  }

  function updatePasswordStrength() {
    if (!passwordInput) return;
    var password = passwordInput.value || '';
    var strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;
    strength = Math.min(4, strength);

    strengthBars.forEach(function(bar, index) {
      bar.classList.toggle('active', index < strength);
    });
  }

  function buildAuthGrid() {
    if (!flipContainer) return;

    var tiles = [
      { code: 'KEV', image: 'image/qiege.jpg' },
      { code: 'CHEM', image: 'image/shiyou.jpeg' },
      { code: 'THERM', image: 'image/gaowen.jpeg' },
      { code: 'DYN', image: 'image/jingmi.jpg' },
      { code: 'SPORT', image: 'image/zixingche.webp' },
      { code: 'COLD', image: 'image/jihan.jpg' },
      { code: 'CLIMB', image: 'image/gaoshan.jpg' },
      { code: 'GOLF', image: 'image/gaoerfu.jpeg' },
      { code: 'FISH', image: 'image/diaoyu.jpg' },
      { code: 'BUILD', image: 'image/jianzhu.jpg' },
      { code: 'LAB', image: 'image/shoumenyuan.jpeg' },
      { code: 'ECO', image: 'image/AIjixie.jpg' }
    ];

    var width = flipContainer.clientWidth || window.innerWidth;
    var height = flipContainer.clientHeight || window.innerHeight;
    var cols = Math.max(4, Math.round(width / 150));
    var rows = Math.max(4, Math.round(height / 160));
    var totalCells = cols * rows;

    flipContainer.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    flipContainer.style.gridTemplateRows = 'repeat(' + rows + ', minmax(0, 1fr))';
    flipContainer.innerHTML = '';

    for (var i = 0; i < totalCells; i++) {
      var tile = tiles[i % tiles.length];
      var cell = document.createElement('div');
      cell.className = 'auth-flip-cell';
      cell.style.setProperty('--flip-delay', ((i % cols) * 0.12 + Math.floor(i / cols) * 0.09) + 's');

      if (!reduceMotion && Math.random() < 0.28) {
        cell.classList.add('auto-flip');
      }

      cell.innerHTML = '<div class="auth-flip-inner"><div class="auth-flip-front"><img src="' + tile.image + '" alt=""></div><div class="auth-flip-back"><span class="auth-flip-code">' + tile.code + '</span></div></div>';

      flipContainer.appendChild(cell);
    }
  }

  function initFontControls() {
    var fontSizeControl = document.querySelector('.font-size-control');
    if (!fontSizeControl) return;

    var smallBtn = fontSizeControl.querySelector('.font-size-small');
    var mediumBtn = fontSizeControl.querySelector('.font-size-medium');
    var largeBtn = fontSizeControl.querySelector('.font-size-large');
    var minScale = 0.85;
    var maxScale = 1.25;
    var currentFontScale = parseFloat(localStorage.getItem('fontScale')) || 1;

    currentFontScale = Math.min(maxScale, Math.max(minScale, currentFontScale));

    var skippedTags = new Set([
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CIRCLE', 'ELLIPSE',
      'POLYLINE', 'POLYGON', 'LINE', 'IMG', 'VIDEO', 'SOURCE', 'BR', 'HR',
      'META', 'LINK'
    ]);

    function getScalableElements() {
      if (!document.body) return [];
      return Array.from(document.body.querySelectorAll('*')).filter(function(el) {
        if (skippedTags.has(el.tagName)) return false;
        if (el.closest('svg')) return false;
        var computed = window.getComputedStyle(el);
        return !!computed && computed.fontSize && computed.fontSize !== '0px';
      });
    }

    function rememberBaseTypography(el) {
      var computed = window.getComputedStyle(el);
      var currentSize = parseFloat(computed.fontSize);
      if (!Number.isFinite(currentSize) || currentSize <= 0) return;

      if (!el.dataset.baseFontSize) {
        el.dataset.baseFontSize = (currentSize / currentFontScale).toFixed(4);
      }

      if (!el.dataset.baseLineHeight && computed.lineHeight && computed.lineHeight.endsWith('px')) {
        var currentLineHeight = parseFloat(computed.lineHeight);
        if (Number.isFinite(currentLineHeight) && currentLineHeight > 0) {
          el.dataset.baseLineHeight = (currentLineHeight / currentFontScale).toFixed(4);
        }
      }
    }

    function applyTypographyScale(scale) {
      getScalableElements().forEach(function(el) {
        rememberBaseTypography(el);

        var baseFontSize = parseFloat(el.dataset.baseFontSize || '0');
        if (Number.isFinite(baseFontSize) && baseFontSize > 0) {
          el.style.fontSize = (baseFontSize * scale).toFixed(2) + 'px';
        }

        var baseLineHeight = parseFloat(el.dataset.baseLineHeight || '0');
        if (Number.isFinite(baseLineHeight) && baseLineHeight > 0) {
          el.style.lineHeight = (baseLineHeight * scale).toFixed(2) + 'px';
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
      document.body.setAttribute('data-font-scale', String(currentFontScale));
      applyTypographyScale(currentFontScale);
      localStorage.setItem('fontScale', String(currentFontScale));

      updateButtonState(smallBtn, currentFontScale <= minScale + 0.001);
      updateButtonState(mediumBtn, currentFontScale > minScale + 0.001 && currentFontScale < maxScale - 0.001);
      updateButtonState(largeBtn, currentFontScale >= maxScale - 0.001);
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
    if (smallBtn) smallBtn.addEventListener('click', function(e) { setFontScale('decrease', e); });
    if (mediumBtn) mediumBtn.addEventListener('click', function(e) { setFontScale('reset', e); });
    if (largeBtn) largeBtn.addEventListener('click', function(e) { setFontScale('increase', e); });
    applyFontScale();
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      switchTab(tab.dataset.tab || 'login');
    });
  });

  // ============ API Login/Register ============
  function showAuthError(formId, msg) {
    var form = document.getElementById(formId);
    if (!form) return;
    var existing = form.querySelector('.auth-error-msg');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'auth-error-msg';
    div.style = 'color:#E85D00;font-size:13px;margin-top:6px;';
    div.textContent = msg;
    var btn = form.querySelector('button[type=submit]');
    if (btn) btn.insertAdjacentElement('beforebegin', div);
  }

  document.getElementById('login-form') && document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    var email = document.getElementById('login-account') && document.getElementById('login-account').value || '';
    var password = document.getElementById('login-password') && document.getElementById('login-password').value || '';
    if (!email || !password) { showAuthError('login-form', '请输入邮箱和密码'); return; }
    var btn = this.querySelector('button[type=submit]');
    var origText = btn.textContent;
    btn.disabled = true; btn.textContent = '登录中...';
    try {
      var r = await PandaAPI.Auth.login(email, password);
      // 记录登录时间戳，用于其他页面检测登录状态变化后刷新
      localStorage.setItem('panda_login_ts', Date.now().toString());
      if (r.user.role === 'admin') {
        localStorage.setItem('panda_admin', '1');
        window.location.href = 'admin.html';
      } else if (r.user.profile_complete) {
        window.location.href = 'customer.html';
      } else {
        showProfileStep();
      }
    } catch (e) {
      showAuthError('login-form', e.message || '登录失败，请检查邮箱和密码');
      btn.disabled = false; btn.textContent = origText;
    }
  });

  document.getElementById('signup-form') && document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    var email    = document.getElementById('signup-email') && document.getElementById('signup-email').value || '';
    var country  = document.getElementById('signup-country') && document.getElementById('signup-country').value || '';
    var password = document.getElementById('signup-password') && document.getElementById('signup-password').value || '';
    if (!email)   { showAuthError('signup-form', '请输入邮箱'); return; }
    if (!country) { showAuthError('signup-form', '请输入国家/地区'); return; }
    if (!password){ showAuthError('signup-form', '请输入密码'); return; }
    if (password.length < 6) { showAuthError('signup-form', '密码至少6位'); return; }
    var btn = this.querySelector('button[type=submit]');
    var origText = btn.textContent;
    btn.disabled = true; btn.textContent = '注册中...';
    try {
      await PandaAPI.Auth.register({
        username: email,
        email: email,
        password: password,
        country: country || ''
      });
      var r = await PandaAPI.Auth.login(email, password);
      localStorage.setItem('panda_login_ts', Date.now().toString());
      if (r.user.role === 'admin') {
        localStorage.setItem('panda_admin', '1');
        window.location.href = 'admin.html';
      } else {
        showProfileStep();
      }
    } catch (e) {
      showAuthError('signup-form', e.message || '注册失败，请重试');
      btn.disabled = false; btn.textContent = origText;
    }
  });

  // ===== 显示 Step3 企业信息补充 =====
  function showProfileStep() {
    var layout = document.querySelector('.auth-side-inner');
    var panel  = document.querySelector('.auth-panel:not(.auth-profile-step)');
    var step3  = document.getElementById('profileStep');
    if (panel)  panel.style.display  = 'none';
    if (step3)  step3.style.display  = 'flex';
    if (layout) layout.scrollTop = 0;
  }

  // ===== Step3 表单提交 =====
  document.getElementById('profile-form') && document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var company       = document.getElementById('pf-company') && document.getElementById('pf-company').value || '';
    var industry      = document.getElementById('pf-industry') && document.getElementById('pf-industry').value || '';
    var company_size  = document.querySelector('input[name=company_size]:checked') && document.querySelector('input[name=company_size]:checked').value || '';
    var contact_person = document.getElementById('pf-contact-name') && document.getElementById('pf-contact-name').value || '';
    var contact_title  = document.getElementById('pf-contact-title') && document.getElementById('pf-contact-title').value || '';
    var phoneCode     = document.getElementById('pf-phone-code') && document.getElementById('pf-phone-code').value || '';
    var phonNum       = document.getElementById('pf-contact-mobile') && document.getElementById('pf-contact-mobile').value || '';
    var contact_mobile = phonNum ? (phoneCode + ' ' + phonNum).trim() : '';
    var city          = document.getElementById('pf-city') && document.getElementById('pf-city').value || '';
    if (!company)  { alert('请填写公司名称'); return; }
    if (!industry) { alert('请选择所属行业'); return; }
    if (!company_size) { alert('请选择公司规模'); return; }
    if (!contact_person) { alert('请填写联系人姓名'); return; }
    var btn = this.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '提交中...';
    try {
      await PandaAPI.Profile.update({ company: company, industry: industry, company_size: company_size, contact_person: contact_person, contact_title: contact_title, contact_mobile: contact_mobile, city: city });
      window.location.href = 'customer.html';
    } catch(err) {
      alert('提交失败，请重试');
      btn.disabled = false; btn.textContent = '完成并进入客户中心';
    }
  });

  // ===== Step3 跳过按钮 =====
  document.getElementById('profileSkipBtn') && document.getElementById('profileSkipBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'customer.html';
  });

  if (passwordInput) passwordInput.addEventListener('input', updatePasswordStrength);
  window.addEventListener('resize', buildAuthGrid, { passive: true });

  var params = new URLSearchParams(window.location.search);
  var requestedTab = params.get('tab') || window.location.hash.replace('#', '');
  var action = params.get('action');
  if (requestedTab === 'signup' || action === 'inquiry' || action === 'register') {
    switchTab('signup');
  } else {
    switchTab('login');
  }

  updatePasswordStrength();
  buildAuthGrid();
  initFontControls();

  if (window.PandaI18N && window.PandaI18N.reinitLangSwitcher) {
    window.PandaI18N.reinitLangSwitcher();
  }
  if (window.PandaI18N && window.PandaI18N.applyTranslations && window.PandaI18N.getCurrentLang) {
    window.PandaI18N.applyTranslations(window.PandaI18N.getCurrentLang());
  }
// ===== 检测登录状态变化（从 auth.html 跳转回来时） =====
  (function(){
    var ts = localStorage.getItem('panda_login_ts');
    if (ts) {
      localStorage.removeItem('panda_login_ts');
      // 如果是从 auth.html 跳转过来的，强制更新登录状态
      if (location.pathname !== 'auth.html') {
        window.location.reload();
      }
    }
  })();
})();
