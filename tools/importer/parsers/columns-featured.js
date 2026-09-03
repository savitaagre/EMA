/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-02
 *
 * Library structure (Columns): first row = block name; subsequent rows have as
 * many columns as the layout needs. This is a "Featured Article" teaser laid
 * out as a single 2-column row: image | text.
 *
 * Source: `.teaser.cmp-teaser--featured` with `.cmp-teaser__content`
 * (pretitle/eyebrow, title heading, description, action link) and
 * `.cmp-teaser__image` (img).
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');
  const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
  // Heading: title only. Avoid loose [class*="title"] which also matches
  // cmp-teaser__pretitle (appears first in DOM) and would steal the node.
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  // Description: the teaser description block. Avoid a bare `p` fallback which
  // matches the pretitle paragraph; exclude pretitle/title explicitly.
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"]):not([class*="title"])');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));

  const textCell = [];
  if (eyebrow) textCell.push(eyebrow);
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  ctaLinks.forEach((cta) => textCell.push(cta));

  // Empty-block guard
  if (!image && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([image || '', textCell.length ? textCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
