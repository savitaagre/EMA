import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Testimonials block — repeats: avatar, quote, name.
 * Authoring model: each row is one testimonial with up to three cells:
 *   Cell 1: avatar image (optional)
 *   Cell 2: quote text (required)
 *   Cell 3: name / attribution (optional)
 *
 * Authors omit and add cells, so classify each cell by content rather than
 * by fixed position: the cell with a picture is the avatar; of the remaining
 * text cells the first is the quote, the next is the name.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'testimonials-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'testimonials-item';

    const cells = [...row.children];
    const avatarCell = cells.find((c) => c.querySelector('picture, img'));
    const textCells = cells.filter((c) => c !== avatarCell && c.textContent.trim());

    if (avatarCell) {
      const avatar = document.createElement('div');
      avatar.className = 'testimonials-avatar';
      const pic = avatarCell.querySelector('picture');
      if (pic) avatar.append(pic);
      li.append(avatar);
    }

    // First text cell = quote, second = name.
    const [quoteCell, nameCell] = textCells;
    if (quoteCell) {
      const quote = document.createElement('blockquote');
      quote.className = 'testimonials-quote';
      while (quoteCell.firstChild) quote.append(quoteCell.firstChild);
      li.append(quote);
    }
    if (nameCell) {
      const name = document.createElement('p');
      name.className = 'testimonials-name';
      while (nameCell.firstChild) name.append(nameCell.firstChild);
      li.append(name);
    }

    ul.append(li);
  });

  // Optimize avatar images (small, square).
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
