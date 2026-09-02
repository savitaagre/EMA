/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated: 2026-09-01
 *
 * Library structure (Columns): multiple columns/rows; first row is block name.
 * Column count is derived from the natural grouping in the source. Here the
 * source has two direct-child columns: a media column (image) and a text
 * column (heading + paragraph + CTA). Each becomes one cell in a single
 * content row.
 */
export default function parse(element, { document }) {
  // Each direct child div is a visual column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Single content row: one cell per column, each holding its content
  const row = columns.map((col) => {
    const cellContent = Array.from(col.childNodes);
    return cellContent;
  });
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
