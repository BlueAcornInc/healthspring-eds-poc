import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature — "Why Choose HealthSpring?" style feature grid.
 *
 * Content model (authored rows):
 *   Row 1  : intro header (h3 + p + h4 + p) in a cell, second cell empty.
 *   Row 2+ : a feature item — one cell holds an icon (often empty, because the
 *            source used CSS/SVG icons that did not import), the other cell
 *            holds a short descriptive sentence (and, when present, a title).
 *
 * The first row is lifted out as a centered intro block. Remaining rows become
 * <li> cards with a circular purple icon on top and centered text below.
 * Empty icon cells fall back to a decorative purple circle so the layout never
 * shows a broken/empty media slot.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // --- Intro header: first row, identified by containing a heading ---
  let introRow = null;
  if (rows.length && rows[0].querySelector('h1, h2, h3, h4, h5, h6')) {
    introRow = rows.shift();
  }

  const intro = document.createElement('div');
  intro.className = 'cards-feature-intro';
  if (introRow) {
    [...introRow.children].forEach((cell) => {
      while (cell.firstElementChild) intro.append(cell.firstElementChild);
    });
  }

  // --- Cards ---
  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    // Text cell = the cell with the most text content; icon cell = the other.
    let [textCell] = cells;
    let iconCell = cells.length > 1 ? cells[1] : null;
    if (cells.length > 1) {
      const len0 = (cells[0].textContent || '').trim().length;
      const len1 = (cells[1].textContent || '').trim().length;
      if (len1 >= len0) {
        [iconCell, textCell] = cells;
      } else {
        [textCell, iconCell] = cells;
      }
    }

    // Skip fully empty rows.
    if (!(textCell.textContent || '').trim() && !(iconCell && iconCell.querySelector('picture, img'))) {
      return;
    }

    const li = document.createElement('li');

    // Icon: use an authored image if present, otherwise a purple placeholder.
    const iconWrap = document.createElement('div');
    iconWrap.className = 'cards-feature-card-icon';
    const pic = iconCell && iconCell.querySelector('picture, img');
    if (pic) {
      iconWrap.append(pic.closest('picture') || pic);
    } else {
      iconWrap.classList.add('cards-feature-card-icon-placeholder');
      iconWrap.setAttribute('aria-hidden', 'true');
    }

    // Body: title + description text.
    const body = document.createElement('div');
    body.className = 'cards-feature-card-body';
    while (textCell.firstElementChild) body.append(textCell.firstElementChild);
    // If the cell held only raw text (no element children), wrap it.
    if (!body.childElementCount && (textCell.textContent || '').trim()) {
      const p = document.createElement('p');
      p.textContent = textCell.textContent.trim();
      body.append(p);
    }

    li.append(iconWrap, body);
    ul.append(li);
  });

  // Optimize any real images that were carried over.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  if (intro.childElementCount) block.append(intro);
  block.append(ul);
}
