/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-adventure. Base: cards.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-02
 *
 * Library structure (Cards): 2 columns; first row = block name.
 *   Each subsequent row = one card:
 *     Cell 1: Image (mandatory)
 *     Cell 2: Text content — title (heading) + description.
 *
 * Source: `ul.cmp-image-list` with `li.cmp-image-list__item` cards. Each card
 * is an `article.cmp-image-list__item-content` containing an image link, a
 * title link (`.cmp-image-list__item-title`), and a description span
 * (`.cmp-image-list__item-description`). Title text is preserved as a link so
 * the destination survives import.
 */
export default function parse(element, { document }) {
  // Each list item is one card.
  let cards = Array.from(element.querySelectorAll('li.cmp-image-list__item, .cmp-image-list__item'));
  // Fallback: articles directly if the list markup differs.
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('.cmp-image-list__item-content, article'));
  }

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');
    const titleEl = card.querySelector('.cmp-image-list__item-title, h1, h2, h3, h4, [class*="title"]');
    const description = card.querySelector('.cmp-image-list__item-description, [class*="description"]');
    const titleLink = card.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');

    const textCell = [];
    if (titleEl) {
      const href = titleLink ? titleLink.getAttribute('href') : null;
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.append(titleEl);
        textCell.push(link);
      } else {
        textCell.push(titleEl);
      }
    }
    if (description) textCell.push(description);

    // Skip empty items
    if (!image && textCell.length === 0) return;

    cells.push([image || '', textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-adventure', cells });
  element.replaceWith(block);
}
