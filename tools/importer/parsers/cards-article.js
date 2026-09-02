/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/magazine/article-1
 * Generated: 2026-09-02
 *
 * Library structure (Cards): 2 columns; first row = block name.
 *   Each subsequent row = one card:
 *     Cell 1: Image (mandatory)
 *     Cell 2: Text content — category tag + date + h3 title, and the card link.
 *
 * Source: each card is an `<a class="article-card card-link">` wrapping an
 * image div and a body div (meta tag + date + h3 heading). Preserve the card
 * link as a CTA so the article destination survives import.
 */
export default function parse(element, { document }) {
  // Each direct anchor (or article-card) is a card.
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > .article-card'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img');

    // Text content: category label, date, title.
    const tag = card.querySelector('.tag, [class*="tag"]');
    const date = card.querySelector('.article-card-meta .paragraph-sm, [class*="meta"] [class*="paragraph"]');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');

    const textCell = [];
    if (tag) textCell.push(tag);
    if (date && date !== tag) textCell.push(date);

    // Preserve the article link (href) by wrapping the title heading in the
    // card's anchor rather than adding a duplicate CTA — keeps title text once.
    const href = card.getAttribute('href');
    if (heading && href) {
      const link = document.createElement('a');
      link.href = href;
      link.append(heading);
      textCell.push(link);
    } else if (heading) {
      textCell.push(heading);
    }

    cells.push([image || '', textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
