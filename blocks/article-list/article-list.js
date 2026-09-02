import { createOptimizedPicture } from '../../scripts/aem.js';

const PAGE_SIZE = 10;

/**
 * Article List block.
 *
 * Reads the EDS query index and renders cards, PAGE_SIZE at a time, with a
 * "Load more" button that reveals the next batch.
 *
 * Authoring model (all cells optional):
 *   Row 1: index path — the query-index to read (default: /blog/query-index.json,
 *          the blog index defined in helix-query.yaml)
 *   Row 2: filter — a path prefix to include (e.g. /blog/); blank = all entries
 *
 * Query-index entries are expected to expose: path, title, image, description,
 * and optionally a category/tag and date (lastModified). Missing fields are
 * handled defensively.
 */

function readConfig(block) {
  const rows = [...block.children];
  const cfg = { indexPath: '/blog/query-index.json', filter: '' };
  const first = rows[0]?.textContent.trim();
  const second = rows[1]?.textContent.trim();
  if (first) cfg.indexPath = first;
  if (second) cfg.filter = second;
  return cfg;
}

async function fetchIndex(indexPath) {
  try {
    const resp = await fetch(indexPath);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

function formatDate(entry) {
  const raw = entry.date || entry.publishDate || entry.lastModified;
  if (!raw) return '';
  // lastModified is a unix seconds string in EDS query-index
  const ms = /^\d+$/.test(String(raw)) ? Number(raw) * 1000 : Date.parse(raw);
  if (Number.isNaN(ms)) return '';
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildCard(entry) {
  const li = document.createElement('li');
  li.className = 'article-list-card';

  const link = document.createElement('a');
  link.className = 'article-list-card-link';
  link.href = entry.path || '#';

  if (entry.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'article-list-card-image';
    imgWrap.append(createOptimizedPicture(entry.image, entry.title || '', false, [{ width: '750' }]));
    link.append(imgWrap);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  const tag = entry.category || entry.tag || entry.template;
  const date = formatDate(entry);
  if (tag || date) {
    const meta = document.createElement('div');
    meta.className = 'article-list-card-meta';
    if (tag) {
      const t = document.createElement('span');
      t.className = 'article-list-tag';
      t.textContent = tag;
      meta.append(t);
    }
    if (date) {
      const d = document.createElement('span');
      d.className = 'article-list-date';
      d.textContent = date;
      meta.append(d);
    }
    body.append(meta);
  }

  if (entry.title) {
    const h = document.createElement('h3');
    h.className = 'article-list-card-title';
    h.textContent = entry.title;
    body.append(h);
  }

  if (entry.description) {
    const p = document.createElement('p');
    p.className = 'article-list-card-desc';
    p.textContent = entry.description;
    body.append(p);
  }

  link.append(body);
  li.append(link);
  return li;
}

export default async function decorate(block) {
  const { indexPath, filter } = readConfig(block);

  let entries = await fetchIndex(indexPath);
  if (filter) entries = entries.filter((e) => (e.path || '').startsWith(filter));

  block.textContent = '';

  const list = document.createElement('ul');
  list.className = 'article-list-cards';
  block.append(list);

  let shown = 0;
  const renderNext = () => {
    const next = entries.slice(shown, shown + PAGE_SIZE);
    next.forEach((entry) => list.append(buildCard(entry)));
    shown += next.length;
  };

  renderNext();

  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'article-list-empty';
    empty.textContent = 'No articles found.';
    block.append(empty);
    return;
  }

  if (entries.length > PAGE_SIZE) {
    const moreWrap = document.createElement('div');
    moreWrap.className = 'article-list-more';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'article-list-more-button button';
    btn.textContent = 'Load more';
    btn.addEventListener('click', () => {
      renderNext();
      if (shown >= entries.length) moreWrap.remove();
    });
    moreWrap.append(btn);
    block.append(moreWrap);
  }
}
