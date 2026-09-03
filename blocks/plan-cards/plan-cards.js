import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * plan-cards — "Let's keep shopping" grid of large interactive image cards.
 * Each authored row is [ image | linked title ]. The whole card is made
 * clickable via the title's link. Sits on a dark section band (dark-purple).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const li = document.createElement('li');

    const imgCell = cells.find((c) => c.querySelector('picture, img'));
    const titleCell = cells.find((c) => c !== imgCell) || cells[cells.length - 1];
    const link = titleCell && titleCell.querySelector('a[href]');

    const card = link ? document.createElement('a') : document.createElement('div');
    card.className = 'plan-cards-card';
    if (link) card.href = link.getAttribute('href');

    if (imgCell) {
      const pic = imgCell.querySelector('picture') || imgCell.querySelector('img');
      const wrap = document.createElement('div');
      wrap.className = 'plan-cards-image';
      wrap.append(pic);
      card.append(wrap);
    }

    const title = document.createElement('span');
    title.className = 'plan-cards-title';
    title.textContent = link ? link.textContent.trim() : (titleCell ? titleCell.textContent.trim() : '');
    card.append(title);

    li.append(card);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
