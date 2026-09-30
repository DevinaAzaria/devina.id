import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const site = 'https://devina.id';
const dist = path.resolve('dist');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const files = await walk(dist);
const urls = [];

for (const file of files) {
  if (path.basename(file) !== 'index.html') continue;

  const html = await readFile(file, 'utf8');
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;

  const relativeDir = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  const pathname = relativeDir ? `/${relativeDir}/` : '/';
  urls.push(new URL(pathname, site).href);
}

urls.sort((a, b) => {
  if (a === site + '/') return -1;
  if (b === site + '/') return 1;
  return a.localeCompare(b);
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(dist, 'sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs.`);
