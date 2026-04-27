// ============================================================
// 回到顶部按钮 - 快速修复脚本
// 在浏览器 Console 中执行这个脚本来快速修复问题
// ============================================================

console.log('%c🔧 开始回到顶部按钮修复...', 'color: #E85D00; font-size: 16px; font-weight: bold;');

// 1. 获取按钮元素
const btn = document.getElementById('backToTopBtn');
if (!btn) {
  console.error('❌ 错误: 找不到按钮元素');
  console.log('正在尝试创建按钮...');
  
  const newBtn = document.createElement('button');
  newBtn.id = 'backToTopBtn';
  newBtn.className = 'back-to-top';
  newBtn.title = '回到顶部';
  newBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(newBtn);
  console.log('✓ 按钮已创建');
} else {
  console.log('✓ 找到按钮元素');
}

// 2. 确保样式正确
const button = document.getElementById('backToTopBtn');
button.style.cssText = `
  position: fixed !important;
  bottom: 40px !important;
  right: 40px !important;
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  background-color: #E85D00 !important;
  color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  border: none !important;
  padding: 0 !important;
  z-index: 9999 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(20px) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 12px rgba(232, 93, 0, 0.25) !important;
`;
console.log('✓ 按钮样式已设置');

// 3. 移除所有旧的事件监听
const oldBtn = document.getElementById('backToTopBtn');
const newBtn2 = oldBtn.cloneNode(true);
oldBtn.parentNode.replaceChild(newBtn2, oldBtn);
console.log('✓ 事件监听已重置');

// 4. 添加滚动监听
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  
  if (window.scrollY > 300) {
    btn.style.opacity = '1 !important';
    btn.style.visibility = 'visible !important';
    btn.style.transform = 'translateY(0) !important';
  } else {
    btn.style.opacity = '0 !important';
    btn.style.visibility = 'hidden !important';
    btn.style.transform = 'translateY(20px) !important';
  }
}, { passive: true });
console.log('✓ 滚动监听已添加');

// 5. 添加点击事件
document.getElementById('backToTopBtn').addEventListener('click', () => {
  console.log('✓ 按钮被点击');
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
console.log('✓ 点击事件已绑定');

// 6. 测试
console.log('%c✅ 修复完成! 现在向下滚动超过 300px 来测试按钮', 'color: green; font-size: 14px; font-weight: bold;');

// 7. 帮助信息
console.log(`
%c使用说明:
1. 向下滚动页面超过 300px
2. 在右下角应该会看到橙色圆形按钮
3. 点击按钮会平滑滚动回顶部

%c测试命令:
// 强制显示按钮
document.getElementById('backToTopBtn').style.opacity = '1';
document.getElementById('backToTopBtn').style.visibility = 'visible';

// 强制隐藏按钮
document.getElementById('backToTopBtn').style.opacity = '0';
document.getElementById('backToTopBtn').style.visibility = 'hidden';

// 模拟点击
document.getElementById('backToTopBtn').click();
`, 'color: #666; font-size: 12px;', 'color: #E85D00; font-size: 12px; font-family: monospace;');
