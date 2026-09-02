/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonials. Base: tabs.
 * Source: https://wknd-trendsetters.site/magazine/article-1
 * Generated: 2026-09-02
 *
 * Library structure (Tabs): 2 columns; first row = block name.
 *   Each subsequent row = one tab:
 *     Cell 1: Tab Label (mandatory) — the testimonial author (name + role)
 *     Cell 2: Tab Content (mandatory) — the testimonial pane (avatar image + name/role + quote)
 *
 * Source layout: a `.tabs-wrapper` holds a `.tabs-content` region with N
 * `.tab-pane` panels AND a separate `.grid-layout.tab-menu` region with N
 * `.tab-menu-link` buttons. Because the mapped selector targets inner
 * grid-layouts (either the tab-menu grid or a per-pane grid), we climb to the
 * shared `.tabs-wrapper` root so both panes (content) and buttons (labels) are
 * in scope, then replace that root. Re-invocations on now-detached matches
 * bail via the empty-block guard.
 */
export default function parse(element, { document }) {
  // Resolve to the shared tabs root so panes AND buttons are both in scope.
  const root = element.closest('.tabs-wrapper') || element;

  const panes = Array.from(root.querySelectorAll('.tabs-content .tab-pane'));
  const menuButtons = Array.from(root.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));

  // Empty-block guard (also catches detached re-invocations after root replaced)
  if (panes.length === 0 && menuButtons.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const rowCount = Math.max(panes.length, menuButtons.length);

  for (let i = 0; i < rowCount; i += 1) {
    const button = menuButtons[i];
    const pane = panes[i];

    // Label cell: the name + role text wrapper from the menu button (drop avatar).
    let labelCell = '';
    if (button) {
      const labelContent = button.querySelector('.flex-horizontal > div:not(.avatar)')
        || button.querySelector(':scope > div');
      labelCell = labelContent || button;
    } else if (pane) {
      labelCell = pane.querySelector('strong') || '';
    }

    // Content cell: the full testimonial pane (avatar image + name/role + quote).
    const contentCell = pane || '';

    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonials', cells });
  root.replaceWith(block);
}
