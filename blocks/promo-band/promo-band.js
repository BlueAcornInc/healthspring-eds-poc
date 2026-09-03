/**
 * promo-band — full-width coloured promo band (e.g. "24/7 Access to your plan",
 * "When are you eligible..."). A single content cell holding a heading, body copy
 * and/or a bulleted list, and a CTA. The band colour comes from the section
 * (navy-section / purple-section via Section Metadata).
 *
 * The last authored link is promoted to a pill CTA button.
 */
export default function decorate(block) {
  const inner = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  if (inner) inner.classList.add('promo-band-content');

  // Promote standalone paragraph links to CTA pill buttons.
  block.querySelectorAll('p > a[href]').forEach((a) => {
    const p = a.closest('p');
    if (p && p.textContent.trim() === a.textContent.trim()) {
      a.classList.add('promo-band-cta');
      p.classList.add('promo-band-cta-wrapper');
    }
  });
}
