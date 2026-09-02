/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/magazine/article-1
 * Generated: 2026-09-02
 *
 * Library structure (Columns): first row = block name; subsequent rows have
 * as many columns as the content's natural grouping. This is an article
 * masthead laid out as two side-by-side columns:
 *   Column 1: lead cover image
 *   Column 2: breadcrumbs + h2 title + byline ("By Taylor Brooks") + date/read-time meta
 * Rendered as a single 2-column row.
 */
export default function parse(element, { document }) {
  // Direct children of the grid are the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Column 1: lead image (may live in first column div)
  const image = element.querySelector('img.cover-image, img');

  // Column 2: text content — breadcrumbs, heading, byline + date meta
  const breadcrumbs = element.querySelector('.breadcrumbs');
  const heading = element.querySelector('h1, h2, h3, .h2-heading, [class*="heading"]');
  // Meta block(s): byline + date/read-time. Grab the flex rows that are NOT breadcrumbs.
  const metaBlocks = Array.from(element.querySelectorAll(':scope > div .flex-horizontal'))
    .filter((el) => !el.closest('.breadcrumbs'));

  // Empty-block guard
  if (!image && !heading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];
  if (breadcrumbs) textCell.push(breadcrumbs);
  if (heading) textCell.push(heading);
  metaBlocks.forEach((m) => textCell.push(m));

  const cells = [];
  // Single 2-column row: image | text content
  cells.push([image || '', textCell.length ? textCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
