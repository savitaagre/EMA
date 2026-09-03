export default function decorate(block) {
  // Mark as image-less when the first row has no picture (box has nothing to overlap)
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // The hero CTA is a standalone link; the global decorator only buttonizes
  // links with authored emphasis, so promote it to a button here.
  const cta = block.querySelector(':scope > div:last-child a[href]');
  if (cta && !cta.classList.contains('button')) {
    const p = cta.closest('p');
    if (p && p.textContent.trim() === cta.textContent.trim()) {
      cta.className = 'button';
      p.className = 'button-container';
    }
  }
}
