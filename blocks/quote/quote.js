/**
 * Quote block.
 * Authoring model (rows):
 *   Row 1: the quotation text (required)
 *   Row 2: the attribution line (optional) — e.g. name, title
 *
 * Authors omit or add cells; decorate defensively.
 */
export default function decorate(block) {
  const rows = [...block.children];

  const figure = document.createElement('figure');
  figure.className = 'quote-figure';

  // First non-empty row is the quotation.
  const quoteRow = rows.find((r) => r.textContent.trim());
  if (quoteRow) {
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'quote-text';
    const cell = quoteRow.firstElementChild || quoteRow;
    // Preserve authored inline markup (em/strong/links) rather than flattening.
    while (cell.firstChild) blockquote.append(cell.firstChild);
    figure.append(blockquote);
  }

  // Any subsequent non-empty row is the attribution.
  const attrRow = rows.find((r) => r !== quoteRow && r.textContent.trim());
  if (attrRow) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-attribution';
    const cell = attrRow.firstElementChild || attrRow;
    while (cell.firstChild) caption.append(cell.firstChild);
    figure.append(caption);
  }

  block.textContent = '';
  block.append(figure);
}
