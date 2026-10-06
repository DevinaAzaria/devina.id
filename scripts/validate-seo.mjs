import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const site = 'https://devina.id';

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

function routeFromFile(file) {
  const relativeDir = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  return relativeDir ? `/${relativeDir}/` : '/';
}

function getTag(html, name, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  return tags.find((tag) => {
    const nameMatch = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'));
    return nameMatch && nameMatch[1] === value;
  }) || null;
}

function getAttr(tag, attr) {
  if (!tag) return null;
  const match = tag.match(new RegExp(`\\b${attr}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : null;
}

function stripTags(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const files = await walk(dist);
const indexFiles = files.filter((file) => path.basename(file) === 'index.html');
const routeSet = new Set(indexFiles.map(routeFromFile));
const hubPath = path.join(dist, 'research-writing', 'index.html');
let hubHtml = '';
try {
  hubHtml = await readFile(hubPath, 'utf8');
} catch {
  // The normal build verification already checks this route.
}

const errors = [];
const warnings = [];
let checked = 0;

for (const file of indexFiles) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('data-seo-writing="true"')) continue;

  checked += 1;
  const route = routeFromFile(file);
  const canonicalExpected = new URL(route, site).href;

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : '';
  if (!title) errors.push(`${route}: missing <title>`);
  if (title.length > 70) warnings.push(`${route}: title is long (${title.length} chars); Google has no hard limit, but long titles may truncate`);

  const descriptionTag = getTag(html, 'name', 'description');
  const description = getAttr(descriptionTag, 'content');
  if (!description) errors.push(`${route}: missing meta description`);
  if (description && description.length > 180) warnings.push(`${route}: meta description is long (${description.length} chars); keep it succinct and useful`);

  const canonicalMatch = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i);
  const canonical = getAttr(canonicalMatch?.[0] || null, 'href');
  if (!canonical) errors.push(`${route}: missing canonical URL`);
  else if (canonical !== canonicalExpected) errors.push(`${route}: canonical mismatch (${canonical})`);

  const ogType = getAttr(getTag(html, 'property', 'og:type'), 'content');
  if (ogType !== 'article') errors.push(`${route}: og:type must be article`);

  if (!html.includes('"@type":"Article"')) errors.push(`${route}: Article structured data missing`);
  if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`${route}: BreadcrumbList structured data missing`);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) errors.push(`${route}: expected exactly one H1, found ${h1Count}`);

  if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) {
    errors.push(`${route}: meta keywords must not be used`);
  }

  const slug = route.split('/').filter(Boolean).at(-1) || '';
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${route}: slug must use lowercase ASCII words separated by hyphens`);
  }

  const images = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of images) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) {
      errors.push(`${route}: every image must have an alt attribute`);
    }
    if (!/\bwidth=["']?\d+/i.test(tag) || !/\bheight=["']?\d+/i.test(tag)) {
      errors.push(`${route}: every content image must declare width and height`);
    }
    const src = getAttr(tag, 'src');
    if (src && src.startsWith('/')) {
      const filename = src.split('/').pop()?.split('?')[0] || '';
      if (filename && !/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:avif|webp|png|jpe?g|svg)$/i.test(filename)) {
        errors.push(`${route}: image filename should be short, descriptive, and hyphen-separated (${filename})`);
      }
    }
  }

  const ogImage = getAttr(getTag(html, 'property', 'og:image'), 'content');
  if (ogImage) {
    const ogImageAlt = getAttr(getTag(html, 'property', 'og:image:alt'), 'content');
    if (!ogImageAlt) errors.push(`${route}: og:image requires og:image:alt`);
  }

  if (!hubHtml.includes(`href="${route}"`) && !hubHtml.includes(`href='${route}'`)) {
    errors.push(`${route}: Research & Writing hub must provide an inbound link to this article`);
  }

  if (!html.includes('href="/research-writing/"')) {
    errors.push(`${route}: article must link back to Research & Writing`);
  }

  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (const [, href, rawText] of anchors) {
    const text = stripTags(rawText).toLowerCase();
    if (/^(click here|klik di sini|baca di sini|selengkapnya|more)$/.test(text)) {
      warnings.push(`${route}: use descriptive anchor text instead of "${text}" for ${href}`);
    }

    if (href.startsWith('/') && !href.startsWith('//')) {
      const localPath = href.split('#')[0].split('?')[0] || '/';
      if (localPath.endsWith('/') && !routeSet.has(localPath)) {
        errors.push(`${route}: broken internal link ${href}`);
      }
    }
  }
}

if (checked === 0) {
  warnings.push('No data-seo-writing pages were found to validate.');
}

for (const warning of warnings) console.warn(`SEO warning: ${warning}`);

if (errors.length) {
  console.error('\nSEO validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${checked} writing page(s) with ${warnings.length} warning(s).`);
