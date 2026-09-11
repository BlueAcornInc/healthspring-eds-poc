/**
 * about-hero — full-bleed primary hero on a NAVY brand band.
 * Source: healthspring.com About Us hero (#healthspring-about-us-hero).
 *
 * Content model (authored rows):
 *   Row 1: hero composition image (baked navy "spring" loops + lifestyle photo).
 *   Row 2: content — H1 title + one-line subtitle paragraph.
 *
 * Layout: mobile stacks image on top, text below on navy; desktop overlays the
 * image full-bleed with the white text constrained to the left.
 */
export default function decorate(block) {
  const firstImage = block.querySelector(':scope > div:first-child picture img, :scope > div:first-child img');
  if (!firstImage) {
    block.classList.add('no-image');
    return;
  }
  // Hero image is the LCP element: prioritise it.
  firstImage.setAttribute('loading', 'eager');
  firstImage.setAttribute('fetchpriority', 'high');
}
