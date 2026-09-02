/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/magazine/article-1
 * Generated: 2026-09-02
 *
 * Library structure (Accordion): 2 columns; first row = block name.
 *   Each subsequent row = one accordion item:
 *     Cell 1: Title (mandatory) — the question text.
 *     Cell 2: Content (mandatory) — the answer body.
 *
 * Source: the mapped element is a `.faq-list` containing N `<details.faq-item>`,
 * each with a `<summary.faq-question>` (question text + toggle icon) and a
 * `.faq-answer` body. Extract just the question text (drop the SVG icon) for
 * the title cell and the answer body for the content cell.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > .faq-item, details.faq-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const summary = item.querySelector('.faq-question, summary');
    // Question text without the toggle icon.
    const questionText = summary
      ? (summary.querySelector('span') || summary)
      : '';

    const answer = item.querySelector('.faq-answer') || '';

    cells.push([questionText || '', answer || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
