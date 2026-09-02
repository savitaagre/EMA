export default function decorate(block) {
  const rows = [...block.children];

  // Content row has the heading; the other row (with a picture) is the background image.
  const contentRow = rows.find((r) => r.querySelector('h1, h2, h3'));
  const imageRow = rows.find((r) => r !== contentRow && r.querySelector('picture'));

  if (imageRow) {
    imageRow.classList.add('hero-banner-image');
    // Background image is the LCP candidate — prioritize it.
    const img = imageRow.querySelector('img');
    if (img) {
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('loading', 'eager');
    }
  } else {
    block.classList.add('no-image');
  }

  if (contentRow) {
    contentRow.classList.add('hero-banner-content');
    const cell = contentRow.firstElementChild || contentRow;

    // Standalone link paragraphs (single link, no other text) become CTAs.
    const btnParas = [...cell.querySelectorAll(':scope > p')].filter(
      (p) => p.childElementCount === 1
        && p.firstElementChild.tagName === 'A'
        && p.textContent.trim() === p.firstElementChild.textContent.trim(),
    );

    if (btnParas.length) {
      const group = document.createElement('div');
      group.className = 'hero-banner-buttons';
      btnParas.forEach((p) => {
        const a = p.firstElementChild;
        a.classList.add('button');
        group.append(a);
        p.remove();
      });
      cell.append(group);
    }
  }
}
