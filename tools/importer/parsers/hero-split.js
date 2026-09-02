/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base: hero.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated: 2026-09-01
 *
 * Library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name (handled by createBlock)
 *   Row 2: background/media image(s) (optional)
 *   Row 3: title (heading) + subheading + CTA(s)
 *
 * Source is a split layout: left cell = heading/subheading/buttons,
 * right cell = one or more cover images. All media goes in the image row,
 * all text/CTAs go in the content row.
 */
export default function parse(element, { document }) {
  // Media: one or more images on the split's media side
  const images = Array.from(element.querySelectorAll('img'));

  // Content
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, .subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: media (optional) — single cell holding all images
  if (images.length) {
    cells.push([images]);
  }

  // Row 3: content — single cell holding heading, subheading, and CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
