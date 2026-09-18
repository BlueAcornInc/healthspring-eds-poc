import { createOptimizedPicture } from '../../scripts/aem.js';

// White glyphs for the purple feature discs (source used bespoke SVG icons
// that did not import). One per card, cycled by order.
const CARD_GLYPHS = [
  // shield-check (quality/care)
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3zm-1.2 13.2L7.5 12l1.4-1.4 1.9 1.9 4-4L16.2 10l-5.4 5.2z" fill="#fff"/></svg>',
  // ribbon/award (plans that deliver)
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a6 6 0 0 0-3 11.2V22l3-2 3 2v-8.8A6 6 0 0 0 12 2zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#fff"/></svg>',
  // scale/stability
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a2 2 0 0 0-1.9 1.4L4 6v2l3 .0-3 6a4 4 0 0 0 8 0l-3-6 4-1v11H8v2h8v-2h-3V7l4 1-3 6a4 4 0 0 0 8 0l-3-6 3 .0V6l-6.1-1.6A2 2 0 0 0 12 3z" fill="#fff"/></svg>',
  // heart (caring experience)
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.6 8.5 2.2 5 5.5 5c2 0 3.3 1.1 4.1 2.3L12 9l2.4-1.7C15.2 6.1 16.5 5 18.5 5c3.3 0 4.9 3.5 3.5 6.7C19.5 16.4 12 21 12 21z" fill="#fff"/></svg>',
];

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
  let cardIndex = 0;
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
      // No authored image: render a purple disc with a white glyph so the
      // circles aren't empty (source uses SVG icons that did not import).
      iconWrap.classList.add('cards-feature-card-icon-placeholder');
      iconWrap.setAttribute('aria-hidden', 'true');
      iconWrap.innerHTML = CARD_GLYPHS[cardIndex % CARD_GLYPHS.length];
      cardIndex += 1;
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
