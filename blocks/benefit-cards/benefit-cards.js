/**
 * benefit-cards — Medicare Advantage value-prop grid.
 *
 * Content model (authored rows): each row is one cell holding a card's
 * heading (h3) + description paragraph(s) + optional CTA link. Rendered as a
 * responsive grid of text cards (no icons/images), matching the source
 * value-prop layout.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    if (!(cell.textContent || '').trim()) return;

    const li = document.createElement('li');
    while (cell.firstElementChild) li.append(cell.firstElementChild);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
