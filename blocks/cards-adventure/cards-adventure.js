import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-adventure — WKND article/adventure teaser grid.
 * Authored rows: [ image cell ] + [ body cell ].
 * The body cell holds one or more links plus a loose description text node
 * (an empty duplicate image-link may also be present). We normalise each card
 * into: image / linked title / description paragraph.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture')) {
        cell.className = 'cards-adventure-card-image';
        return;
      }

      // Body cell: split into linked title + description.
      cell.className = 'cards-adventure-card-body';

      const anchors = [...cell.querySelectorAll('a')];
      const titleAnchor = anchors.find((a) => a.textContent.trim())
        || anchors[0];
      const href = titleAnchor ? titleAnchor.getAttribute('href') : null;
      const titleText = titleAnchor ? titleAnchor.textContent.trim() : '';

      // Description = text content of the cell minus the anchor labels.
      let descText = cell.textContent.trim();
      anchors.forEach((a) => {
        const t = a.textContent.trim();
        if (t) descText = descText.replace(t, '');
      });
      descText = descText.trim();

      cell.textContent = '';

      if (titleText) {
        const link = document.createElement('a');
        if (href) link.href = href;
        link.className = 'cards-adventure-card-link';
        const title = document.createElement('span');
        title.className = 'cards-adventure-card-title';
        title.textContent = titleText;
        link.append(title);
        cell.append(link);
      }

      if (descText) {
        const desc = document.createElement('p');
        desc.className = 'cards-adventure-card-desc';
        desc.textContent = descText;
        cell.append(desc);
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
