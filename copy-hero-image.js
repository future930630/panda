const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Administrator\\Desktop\\1649214460922007071.jpg';
const dst = path.join(__dirname, 'hero-climbing.jpg');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log('✓ 图片复制成功:');
    console.log('  源: ' + src);
    console.log('  目标: ' + dst);
    console.log('  大小: ' + fs.statSync(dst).size + ' bytes');
  } else {
    console.error('✗ 源文件不存在: ' + src);
  }
} catch (err) {
  console.error('✗ 复制失败:', err.message);
}
