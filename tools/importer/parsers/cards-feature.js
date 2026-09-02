/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated: 2026-09-01
 *
 * Library structure (Cards): 2 columns, multiple rows; first row is block name.
 * Each subsequent row is one card:
 *   Cell 1: image (mandatory)
 *   Cell 2: text content (title + description + optional CTA)
 *
 * Source has three card divs, each with an <img>, an <h3> title, and a <p>.
 */
export default function parse(element, { document }) {
  // Each direct child div is a card
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img');

    // Text content: everything except the image
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const description = Array.from(card.querySelectorAll('p'));
    const ctaLinks = Array.from(card.querySelectorAll('.button-group a, a.button'));

    const textCell = [];
    if (heading) textCell.push(heading);
    textCell.push(...description);
    textCell.push(...ctaLinks);

    // 2-column row: image cell + text cell (pad image cell if absent)
    cells.push([image || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
