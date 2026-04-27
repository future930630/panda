const fs = require('fs');
const path = 'debug-mega-output.txt';

async function debug(page) {
  await page.hover('text=工厂与设备');
  await page.waitForTimeout(500);
  
  const result = await page.evaluate(() => {
    const mega = document.querySelector('.nav-item.has-mega .mega-menu');
    if (!mega) return 'NO MEGA FOUND';
    const inner = mega.querySelector('.mega-fw-inner');
    const cs = getComputedStyle(inner);
    const mcs = getComputedStyle(mega);
    const logo = document.querySelector('.header-logo');
    const searchBtn = document.getElementById('headerSearchBtn');
    const logoRect = logo ? logo.getBoundingClientRect() : null;
    const searchRect = searchBtn ? searchBtn.getBoundingClientRect() : null;
    const innerRect = inner.getBoundingClientRect();
    
    let lines = [];
    lines.push('=== MEGA MENU LAYOUT DEBUG ===');
    lines.push('Window innerWidth: ' + window.innerWidth);
    lines.push('Mega: width=' + mcs.width + ' position=' + mcs.position + ' left=' + mcs.left + ' right=' + mcs.right);
    lines.push('Inner: display=' + cs.display);
    lines.push('Inner padding: ' + cs.padding);
    lines.push('Inner width: ' + cs.width + ' maxWidth: ' + cs.maxWidth);
    lines.push('Grid columns: ' + cs.gridTemplateColumns);
    lines.push('Logo left: ' + (logoRect ? logoRect.left : 'N/A'));
    lines.push('Search right: ' + (searchRect ? searchRect.right : 'N/A'));
    lines.push('Inner left: ' + innerRect.left + ' right: ' + innerRect.right + ' width: ' + innerRect.width);
    
    const imgPanel = inner.querySelector('.mega-img-panel');
    if (imgPanel) {
      const r = imgPanel.getBoundingClientRect();
      lines.push('ImgPanel: left=' + r.left + ' right=' + r.right + ' width=' + r.width);
    }
    
    // Get all direct children of inner (after display:contents flattening)
    const allDirectChildren = inner.children;
    lines.push('Inner direct children count: ' + allDirectChildren.length);
    for (let i = 0; i < allDirectChildren.length; i++) {
      const el = allDirectChildren[i];
      const r = el.getBoundingClientRect();
      lines.push('  [' + i + '] ' + el.className + ': left=' + r.left + ' right=' + r.right + ' width=' + r.width + ' display=' + getComputedStyle(el).display);
    }
    
    // The actual grid items after display:contents
    // mega-cols-wrap has display:contents, so its children become grid items
    const colsWrap = inner.querySelector('.mega-cols-wrap');
    if (colsWrap) {
      const cols = colsWrap.children;
      lines.push('mega-cols-wrap children (grid items after display:contents): ' + cols.length);
      for (let i = 0; i < cols.length; i++) {
        const el = cols[i];
        const r = el.getBoundingClientRect();
        const tag = el.querySelector('h4') ? el.querySelector('h4').textContent.trim() : el.className;
        lines.push('  Col[' + i + '] "' + tag + '": left=' + r.left + ' right=' + r.right + ' width=' + r.width);
      }
    }
    
    return lines.join('\n');
  });
  
  fs.writeFileSync(path, result, 'utf-8');
  console.log('Debug output written to ' + path);
  console.log(result);
}

module.exports = debug;
