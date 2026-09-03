/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-02
 *
 * Library structure (Hero): 1 column, 3 rows; first row = block name.
 *   Row 2 (single cell): Background image (optional).
 *   Row 3 (single cell): Title (heading), subheading/description, CTA link.
 *
 * Source: `.teaser.cmp-teaser--hero.cmp-teaser--imagebottom` with
 * `.cmp-teaser__content` (title, description, action link) and
 * `.cmp-teaser__image` (background img).
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"]):not([class*="title"])');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  ctaLinks.forEach((cta) => contentCell.push(cta));

  // Empty-block guard
  if (!bgImage && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: background image (single cell). Add only if present.
  if (bgImage) cells.push([bgImage]);
  // Row 3: text content (single cell holding all elements).
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
