/**
 * Spec block — a 2-column key/value specification table.
 * Authoring model: each row has two cells (label, value).
 * Renders as a semantic <table> to match the source spec table.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  rows.forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');
    cells.forEach((cell, i) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      td.scope = i === 0 ? 'row' : '';
      while (cell.firstChild) td.append(cell.firstChild);
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(tbody);
  block.textContent = '';
  block.append(table);
}
