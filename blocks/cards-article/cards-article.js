import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
        return;
      }
      div.className = 'cards-article-card-body';

      const p = div.querySelector('p') || div;
      const link = p.querySelector('a');

      // Meta = leading text before the link (import fused "CategoryMonth DD")
      let meta = '';
      [...p.childNodes].forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) meta += n.textContent;
      });
      meta = meta.replace(/\s+/g, ' ').trim();

      div.textContent = '';

      if (meta) {
        const metaWrap = document.createElement('div');
        metaWrap.className = 'cards-article-card-meta';
        // Split "Casual CoolMay 12" -> category + date at the month boundary
        const m = meta.match(new RegExp(`^(.*?)((?:${MONTHS})[a-z]*\\s*\\d.*)$`));
        if (m && m[1].trim()) {
          const cat = document.createElement('span');
          cat.className = 'cards-article-tag';
          cat.textContent = m[1].trim();
          const date = document.createElement('span');
          date.className = 'cards-article-date';
          date.textContent = m[2].trim();
          metaWrap.append(cat, date);
        } else {
          const date = document.createElement('span');
          date.className = 'cards-article-date';
          date.textContent = meta;
          metaWrap.append(date);
        }
        div.append(metaWrap);
      }

      if (link) {
        // Strip leading markdown heading markers from the imported title
        const title = link.textContent.replace(/^#+\s*/, '').trim();
        link.textContent = '';
        link.removeAttribute('title');
        link.className = 'cards-article-card-link';
        const h3 = document.createElement('h3');
        h3.textContent = title;
        link.append(h3);
        div.append(link);
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
