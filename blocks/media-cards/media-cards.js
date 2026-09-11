/**
 * media-cards — side-by-side media promo cards (source: the two video promos).
 * Each authored row is [ image | text (heading + description + transcript link) ].
 * Rendered as a responsive grid of image-top cards.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const li = document.createElement('li');

    // Image cell.
    const imgCell = cells.find((c) => c.querySelector('picture, img'));
    if (imgCell) {
      const wrap = document.createElement('div');
      wrap.className = 'media-cards-image';
      const pic = imgCell.querySelector('picture') || imgCell.querySelector('img');
      wrap.append(pic);
      li.append(wrap);
    }

    // Text cell = the cell that isn't the image.
    const textCell = cells.find((c) => c !== imgCell) || cells[cells.length - 1];
    const body = document.createElement('div');
    body.className = 'media-cards-body';
    if (textCell) {
      while (textCell.firstElementChild) body.append(textCell.firstElementChild);
    }
    li.append(body);

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
