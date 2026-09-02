/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: blog article metadata emitter.
 *
 * The wknd-trendsetters blog articles expose category, publish date, and a lead
 * cover image as visible masthead CONTENT (not <meta> tags), so the query index
 * cannot harvest them. This transformer reads those from the article masthead and
 * appends a `metadata` block (Category, Publication Date, Image) to <main> so
 * WebImporter.rules.createMetadata() emits them as page metadata — which the EDS
 * indexer then surfaces in /blog/query-index.json.
 *
 * Runs on afterTransform, BEFORE the import script calls createMetadata(). It must
 * read from the ORIGINAL masthead DOM, so it captures values in beforeTransform
 * (before the columns-article parser replaces the masthead) and writes the block
 * in afterTransform.
 *
 * Scoped to blog articles only (path under /blog/) — a no-op elsewhere.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Matches "February 23, 2026", "May 12", etc.
const DATE_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(,\s*\d{4})?$/;

const captured = new WeakMap();

function isBlog(payload) {
  try {
    const url = payload && (payload.params?.originalURL || payload.url);
    return url ? new URL(url).pathname.startsWith('/blog/') : false;
  } catch {
    return false;
  }
}

export default function transform(hookName, element, payload) {
  if (!isBlog(payload)) return;

  if (hookName === TransformHook.beforeTransform) {
    const data = {};

    // Category — masthead .tag pill (e.g. "Casual Cool").
    const tag = element.querySelector('.tag');
    if (tag && tag.textContent.trim()) data.category = tag.textContent.trim();

    // Publication date — a date-formatted text node inside the byline area.
    const dateEl = [...element.querySelectorAll('p, div, span, time')]
      .find((el) => DATE_RE.test(el.textContent.trim()));
    if (dateEl) data.date = dateEl.textContent.trim();

    // Lead image — the masthead cover image (falls back to first main image).
    const cover = element.querySelector('img.cover-image, .cover-image img')
      || element.querySelector('img');
    if (cover && cover.getAttribute('src')) data.image = cover;

    captured.set(payload.document, data);
  }

  if (hookName === TransformHook.afterTransform) {
    const data = captured.get(payload.document) || {};
    const { document } = payload;

    // Reuse an existing metadata block if the importer/other transformer made one,
    // else create a fresh one appended to main.
    let metaBlock = element.querySelector('.metadata');
    const rows = [];

    if (data.category) rows.push(['Category', data.category]);
    if (data.date) rows.push(['Publication Date', data.date]);
    if (data.image) {
      // Re-point the captured <img> to its absolute source so the indexer can use it.
      rows.push(['Image', data.image]);
    }
    if (rows.length === 0) return;

    if (!metaBlock) {
      metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Metadata',
        cells: rows,
      });
      element.append(metaBlock);
    } else {
      // Append missing rows to the existing metadata table.
      rows.forEach(([key, value]) => {
        const row = document.createElement('div');
        const k = document.createElement('div');
        k.textContent = key;
        const v = document.createElement('div');
        if (typeof value === 'string') v.textContent = value;
        else v.append(value);
        row.append(k, v);
        metaBlock.append(row);
      });
    }
  }
}
