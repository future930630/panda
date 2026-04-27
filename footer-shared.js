// ============================================================
// GLOBAL FOOTER INJECT — 全站统一页脚
// 在所有子页面中替换 id="site-footer" 占位元素
// ============================================================
(function() {
  const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-top">
    <div class="container footer-top-inner">
      <div class="footer-left-rail">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="image/logo1.png" alt="熊猫手护" class="footer-logo-img" />
          </div>
          <div class="footer-brand-copy">
            <span class="footer-brand-name" data-i18n="siteName">熊猫手护</span>
            <span class="footer-brand-slogan" data-i18n="footerTagline">永远手护安全</span>
          </div>
          <p class="footer-company" data-i18n="companyFull">熊猫手护（北京）科技有限公司</p>

          <div class="footer-social">
            <a href="https://work.weixin.qq.com/" class="social-link" title="微信" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 11.5c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm5.5 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>
            </a>
            <a href="https://weibo.com/pandaguard" class="social-link" title="微博" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.194 11.516c-.27-.83-1.11-1.25-1.88-0.94-.77.31-1.14 1.2-.86 2.04.28.84 1.12 1.27 1.89.96.76-.31 1.11-1.2.85-2.06zM12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 12c-1.1.8-2.4 1-3.5 1-2.76 0-5-2.01-5-4.5C7 10.01 9.24 8 12 8c.88 0 1.74.2 2.5.56 1.67.79 2.5 2.2 2.5 3.94 0 1.37-.68 2.69-1.5 3.5z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/pandashield" class="social-link" title="LinkedIn" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="footer-nav-group footer-contact-group">
          <h4 data-i18n="footerContact">联系我们</h4>
          <ul class="contact-list">
            <li>📍 北京市朝阳区望京科技园</li>
            <li>📞 400-888-PANDA</li>
            <li>📧 info@pandaguard.cn</li>
            <li>🌐 www.pandaguard.cn</li>
          </ul>
        </div>
      </div>


      <!-- 品牌和产品 -->

      <div class="footer-nav-group">
        <h4 data-i18n="footerProducts">品牌和产品</h4>
        <ul>
          <li><a href="pandashield.html">PandaSHIELD™ 防切割/撕裂/磨损</a></li>
          <li><a href="pandapierce.html">PandaPIERCE™ 防穿刺</a></li>
          <li><a href="pandaimpact.html">PandaIMPACT™ 防冲击</a></li>
          <li><a href="pandachem.html">PandaCHEM™ 防油污/酸碱/溶剂</a></li>
          <li><a href="pandabio.html">PandaBIO™ 防生物污染</a></li>
          <li><a href="pandavolt.html">PandaVOLT™ 防电/绝缘/静电</a></li>
          <li><a href="pandaheat.html">PandaHEAT™ 防火/阻燃/耐高温</a></li>
          <li><a href="pandafrost.html">PandaFROST™ 防寒/保暖</a></li>
          <li><a href="pandagrip.html">PandaGRIP™ 防震/防滑</a></li>
          <li><a href="pandaeco.html">PandaECO™ 环保可持续</a></li>
        </ul>
      </div>

      <!-- 解决方案 -->
      <div class="footer-nav-group">
        <h4 data-i18n="footerSolutions">解决方案</h4>
        <ul>
          <li><a href="industry-hub.html">工业制造整体防护</a></li>
          <li><a href="industry-hub.html">危化品处理方案</a></li>
          <li><a href="industry-hub.html">医疗防护解决方案</a></li>
          <li><a href="industry-hub.html">智能工厂防护</a></li>
          <li><a href="brand-licensing.html">企业批量定制</a></li>
          <li><a href="faq.html">合规认证支持</a></li>
        </ul>
      </div>

      <!-- 服务 -->
      <div class="footer-nav-group">
        <h4 data-i18n="footerService">服务</h4>
        <ul>
          <li><a href="faq.html">技术支持</a></li>
          <li><a href="faq.html">产品培训</a></li>
          <li><a href="contact.html">安全咨询</a></li>
          <li><a href="contact.html">售后服务</a></li>
          <li><a href="research-center.html">资源下载</a></li>
          <li><a href="research-center.html">全球研究中心</a></li>
        </ul>
      </div>

      <!-- 品牌授权 -->
      <div class="footer-nav-group">
        <h4 data-i18n="footerBrand">品牌授权</h4>
        <ul>
          <li><a href="brand-licensing.html">区域独家代理</a></li>
          <li><a href="brand-licensing.html">国家级总代理商</a></li>
          <li><a href="brand-licensing.html">城市/省级经销商</a></li>
          <li><a href="brand-licensing.html">全套VI设计手册</a></li>
          <li><a href="brand-licensing.html">加盟流程说明</a></li>
          <li><a href="brand-licensing.html">立即申请加盟</a></li>
        </ul>
      </div>


      <!-- 熊猫账号 -->

      <div class="footer-nav-group">
        <h4 data-i18n="footerAccount">熊猫账号</h4>
        <ul>
          <li><a href="auth.html">登录会员</a></li>
          <li><a href="auth.html">注册采购会员</a></li>
          <li><a href="auth.html">订单管理</a></li>
          <li><a href="index.html">新闻中心</a></li>
        </ul>
      </div>

      <!-- 未来发展 -->
      <div class="footer-nav-group">
        <h4 data-i18n="footerFuture">未来发展</h4>
        <ul>
          <li><a href="sustainability.html" data-i18n="footerFutureSustainability">可持续发展</a></li>
          <li><a href="research-center.html" data-i18n="footerFutureMarketAccess">市场准入</a></li>
          <li><a href="research-center.html" data-i18n="footerFutureSafetyPrivacy">安全和隐私</a></li>
          <li><a href="research-center.html" data-i18n="footerFutureHandGuardCitizen">手护公民</a></li>
          <li><a href="sustainability.html" data-i18n="footerFutureSocialResponsibility">社会责任</a></li>
          <li><a href="children-safety.html" data-i18n="footerFutureChildrenSafety">儿童手护</a></li>
          <li><a href="research-center.html" data-i18n="footerDataPanda">数说Panda</a></li>
          <li><a href="research-center.html" data-i18n="footerSafetyAcademy">Panda安全学院</a></li>
        </ul>
      </div>


      <!-- 关于我们 -->
      <div class="footer-nav-group">
        <h4 data-i18n="footerAbout">关于我们</h4>
        <ul>
          <li><a href="index.html">公司介绍</a></li>
          <li><a href="brand-shield.html">品牌故事</a></li>
          <li><a href="index.html">新闻中心</a></li>
          <li><a href="contact.html">人才招聘</a></li>
          <li><a href="sustainability.html">可持续发展</a></li>
          <li><a href="children-safety.html">儿童手护</a></li>
          <li><a href="admin.html">管理员</a></li>
        </ul>
      </div>

    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <span>© 2026 <span data-i18n="footerCopyright">熊猫手护（北京）科技有限公司 | Panda Guard (Beijing) Technology Co., Ltd.</span> All rights reserved.</span>
      <div class="footer-legal">
        <a href="privacy.html" data-i18n="footerPrivacy">隐私政策</a>
        <a href="terms.html" data-i18n="footerTerms">使用条款</a>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">京ICP备XXXXXXXX号</a>
      </div>
    </div>
  </div>
</footer>
`;

  // 找占位元素并替换
  const placeholder = document.getElementById('site-footer');
  if (placeholder) {
    placeholder.outerHTML = FOOTER_HTML;
  } else {
    // 如果没有占位，则插到 body 最后面
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

  // 【重要】页脚注入后立即应用翻译
  setTimeout(() => {
    if (typeof PandaI18N !== 'undefined' && PandaI18N.getCurrentLang) {
      const currentLang = PandaI18N.getCurrentLang();
      if (typeof I18N !== 'undefined' && I18N[currentLang]) {
        const t = I18N[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (t[key] !== undefined) {
            el.textContent = t[key];
          }
        });
      }
    }
  }, 60);
})();
