import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(root, 'docs');
await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await mkdir(resolve(docs, 'client'), { recursive: true });
await mkdir(resolve(docs, 'data'), { recursive: true });
await mkdir(resolve(docs, 'vendor'), { recursive: true });
await mkdir(resolve(docs, 'wasm'), { recursive: true });

await cp(resolve(root, 'ui/index.html'), resolve(docs, 'index.html'));
await cp(resolve(root, 'ui/style.css'), resolve(docs, 'style.css'));
await cp(resolve(root, 'client/main.js'), resolve(docs, 'client/main.js'));
await cp(resolve(root, 'data/player.json'), resolve(docs, 'data/player.json'));
await cp(resolve(root, 'public/vendor/three.module.js'), resolve(docs, 'vendor/three.module.js'));
await cp(resolve(root, 'public/vendor/THREE-LICENSE.txt'), resolve(docs, 'vendor/THREE-LICENSE.txt'));
await cp(resolve(root, 'public/wasm'), resolve(docs, 'wasm'), { recursive: true, force: true });

const html = await readFile(resolve(docs, 'index.html'), 'utf8');
await writeFile(resolve(docs, 'index.html'), html.replace('<head>', '<head>\n    <base href="./">'));
console.log('Site estático preparado em docs/ para GitHub Pages.');
