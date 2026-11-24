import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('.', import.meta.url));
const roots = [
  { prefix: '/client/', directory: 'client' },
  { prefix: '/data/', directory: 'data' },
  { prefix: '/wasm/', directory: 'public/wasm' },
  { prefix: '/vendor/', directory: 'public/vendor' },
  { prefix: '/', directory: 'ui' }
];
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.wasm': 'application/wasm' };

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const root = roots.find((entry) => pathname.startsWith(entry.prefix));
  const relative = root && pathname.slice(root.prefix.length);
  const base = resolve(project, root?.directory ?? 'ui');
  const file = resolve(base, relative || 'index.html');
  if (!file.startsWith(base + sep) && file !== resolve(base, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(Number(process.env.PORT) || 4173, '0.0.0.0', () => {
  console.log(`Konoha protótipo disponível em http://localhost:${Number(process.env.PORT) || 4173}`);
});
