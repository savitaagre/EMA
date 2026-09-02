export default function decorate(block) {
  const rows = [...block.children];

  // The content row is the one that contains the heading.
  const contentRow = rows.find((r) => r.querySelector('h1, h2, h3'));
  const mediaRow = rows.find((r) => r !== contentRow && r.querySelector('picture'));

  if (mediaRow) mediaRow.classList.add('hero-split-media');
  if (contentRow) contentRow.classList.add('hero-split-content');

  // The first hero image is the LCP candidate — prioritize it and never lazy-load it.
  const lcpImg = mediaRow && mediaRow.querySelector('img');
  if (lcpImg) {
    lcpImg.setAttribute('fetchpriority', 'high');
    lcpImg.setAttribute('loading', 'eager');
  }

  if (contentRow) {
    const cell = contentRow.firstElementChild || contentRow;

    // Collect standalone link paragraphs (a single link, no other text) as CTAs.
    const btnParas = [...cell.querySelectorAll(':scope > p')].filter(
      (p) => p.childElementCount === 1
        && p.firstElementChild.tagName === 'A'
        && p.textContent.trim() === p.firstElementChild.textContent.trim(),
    );

    if (btnParas.length) {
      const group = document.createElement('div');
      group.className = 'hero-split-buttons';
      btnParas.forEach((p, i) => {
        const a = p.firstElementChild;
        a.classList.add('button', i === 0 ? 'primary' : 'secondary');
        group.append(a);
        p.remove();
      });
      cell.append(group);
    }
  }
}
