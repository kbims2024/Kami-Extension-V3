const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE = '/home/z/my-project';
const indexHtml = fs.readFileSync('/tmp/app-index.html', 'utf-8');
const CT = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
    return;
  }
  if (url.startsWith('/_next/') || url.startsWith('/uploads/') || url.startsWith('/images/') || url === '/logo.svg' || url === '/robots.txt') {
    const fp = path.join(BASE, url);
    const ext = path.extname(fp);
    fs.readFile(fp, (err, d) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': CT[ext] || 'application/octet-stream' });
      res.end(d);
    });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(indexHtml);
});

server.listen(PORT, '0.0.0.0', () => console.log('Static server on ' + PORT));
process.on('uncaughtException', (e) => console.error('Caught:', e.message));
