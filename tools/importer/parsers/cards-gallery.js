/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated: 2026-09-01
 *
 * Library structure (Cards): 2 columns, multiple rows; first row is block name.
 *   Cell 1: image (mandatory)
 *   Cell 2: text content (title/description/CTA)
 *
 * This is an image-only gallery: each source card is a div containing a single
 * cover image and no text. Each card becomes a row with the image in cell 1 and
 * an empty text cell to keep the 2-column structure consistent.
 */
export default function parse(element, { document }) {
  // Each direct child div is a gallery card
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img');

    // Text content (if any card ever carries a caption/heading/CTA)
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const description = Array.from(card.querySelectorAll('p'));
    const ctaLinks = Array.from(card.querySelectorAll('.button-group a, a.button'));

    const textCell = [];
    if (heading) textCell.push(heading);
    textCell.push(...description);
    textCell.push(...ctaLinks);

    // 2-column row: image cell + text cell (empty when gallery is image-only)
    cells.push([image || '', textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
