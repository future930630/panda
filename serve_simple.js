const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = 'c:/Users/Windows13/Desktop/20260331999999';
const MIME = {
  html:'text/html;charset=utf-8', css:'text/css', js:'application/javascript',
  jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp',
  gif:'image/gif', svg:'image/svg+xml', pdf:'application/pdf', woff2:'font/woff2', woff:'font/woff', ttf:'font/ttf'
};
http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(file).slice(1);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(3000, () => console.log('Server running at http://localhost:3000/'));
