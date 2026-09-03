/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-related. Base: cards (no images variant).
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html
 * Generated: 2026-09-03
 *
 * Library structure (Cards - no images): 1 column; first row = block name.
 *   Each subsequent row = one card in a single cell:
 *     Heading (optional) – styled as a Heading.
 *     Description (optional) – below the heading.
 *     Call-to-Action (optional) – linked text.
 *
 * Source: the sidebar "Up Next" related-articles list —
 *   `div.list.cmp-list--upnext > ul.cmp-list > li.cmp-list__item`.
 *   Each `li` has `a.cmp-list__item-link[href]` wrapping
 *   `span.cmp-list__item-title` (article title) and
 *   `span.cmp-list__item-date` (publish date). No images.
 *   The title is preserved as a linked heading so the article destination
 *   survives import; the date follows as a description line.
 */
export default function parse(element, { document }) {
  // Each list item is one card.
  let items = Array.from(element.querySelectorAll('li.cmp-list__item, .cmp-list__item'));
  // Fallback: anchors directly if the list markup differs.
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('a.cmp-list__item-link, a[class*="item-link"]'));
  }

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const link = item.matches('a')
      ? item
      : item.querySelector('a.cmp-list__item-link, a[class*="item-link"], a');
    const titleEl = item.querySelector('.cmp-list__item-title, [class*="item-title"]');
    const dateEl = item.querySelector('.cmp-list__item-date, [class*="item-date"]');

    const titleText = titleEl ? titleEl.textContent.trim() : (link ? link.textContent.trim() : '');
    const href = link ? link.getAttribute('href') : null;

    const contentCell = [];

    // Title as a linked heading (preserves destination).
    if (titleText) {
      const heading = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleText;
        heading.append(a);
      } else {
        heading.textContent = titleText;
      }
      contentCell.push(heading);
    }

    // Date as a description line below the heading.
    const dateText = dateEl ? dateEl.textContent.trim() : '';
    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      contentCell.push(p);
    }

    // Skip empty items.
    if (contentCell.length === 0) return;

    cells.push([contentCell]); // 1-column block: one row, one cell holding all elements.
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-related', cells });
  element.replaceWith(block);
}
