/**
 * promo-card — inline navy "Need Medicare Coverage?" CTA card.
 * The authored structure (heading + body paragraph + CTA link) is already
 * correct; this just tags the inner wrapper + the CTA link for scoped styling.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  if (cell) cell.classList.add('promo-card-content');

  const links = [...block.querySelectorAll('a[href]')];
  const cta = links[links.length - 1];
  if (cta) {
    cta.classList.add('promo-card-cta');
    const p = cta.closest('p');
    if (p) p.classList.add('promo-card-cta-wrapper');
  }
}
