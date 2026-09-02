/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site/magazine/article-1
 * Generated: 2026-09-02
 *
 * Library structure (Hero): 1 column, 3 rows; first row = block name.
 *   Row 2 (single cell): Background image (optional).
 *   Row 3 (single cell): Title (heading) + subheading + CTA(s).
 *
 * Source: a full-bleed banner — an overlay cover image plus a `.card-body`
 * holding the h2 headline, a subheading paragraph, and a `.button-group` CTA.
 * The mapped element is the whole `section.inverse-section`.
 */
export default function parse(element, { document }) {
  // Background image (full-bleed overlay cover image)
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  // Content
  const heading = element.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, .subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional) — one cell.
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: content — single cell holding heading, subheading, and CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
