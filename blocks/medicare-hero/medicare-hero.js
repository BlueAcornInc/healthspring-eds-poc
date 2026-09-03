/**
 * medicare-hero — "secondary" interior hero (purple band).
 * Source: healthspring.com Medicare Advantage hero.
 *
 * Content model (authored rows):
 *   Row 1: hero image (lifestyle photo, shown on the right on desktop).
 *   Row 2: content — H1 title, "Shop and Compare Plans" H2, the plan-finder
 *          widget (a /widgets/ link auto-blocked into a .widget by scripts.js),
 *          and a phone callout paragraph.
 *
 * Layout: mobile stacks image → content; desktop places content (left) beside
 * the image (right). The "Shop and Compare Plans" box is a white card holding
 * the widget + phone callout.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 1 = image.
  const imageRow = rows[0];
  if (imageRow) imageRow.classList.add('medicare-hero-image');

  // Row 2 = content.
  const contentRow = rows[1];
  if (contentRow) {
    contentRow.classList.add('medicare-hero-content');
    const cell = contentRow.querySelector(':scope > div') || contentRow;

    // Wrap the shopping box: H2 + widget + phone callout into a white card.
    const h2 = cell.querySelector('h2');
    if (h2) {
      const box = document.createElement('div');
      box.className = 'medicare-hero-shop';
      let node = h2;
      const toMove = [];
      while (node) {
        toMove.push(node);
        node = node.nextElementSibling;
      }
      h2.before(box);
      toMove.forEach((n) => box.append(n));
    }
  }

  // Prioritise the hero image for LCP.
  const img = block.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
  }
}
