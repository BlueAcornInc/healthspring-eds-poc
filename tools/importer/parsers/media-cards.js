/* eslint-disable */
/* global WebImporter */
/**
 * Parser for media-cards. Base: cards.
 * Source: https://www.healthspring.com/medicare/medicare-advantage
 *   (#content > div:nth-of-type(7) — two "brand-media-vertical" video promos)
 * Generated: 2026-09-03
 *
 * Two side-by-side promo cards, each with an image on top, a heading, a
 * description, a "Watch" button (opens a Brightcove modal — not importable as
 * static content, so dropped) and a "View transcript" PDF link (kept as the CTA).
 *
 * Library convention (Cards): 2 columns per row — [ image | text content ].
 */
export default function parse(element, { document }) {
  const promos = Array.from(element.querySelectorAll('leaf-promo'));

  if (promos.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  promos.forEach((promo) => {
    // Image (top of card).
    const image = promo.querySelector('picture img, img');

    // Text content: heading + description + transcript link.
    const textNodes = [];
    const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = (heading.textContent || '').trim();
      textNodes.push(h);
    }
    promo.querySelectorAll('div[slot="content"] p').forEach((p) => {
      if (/\S/.test(p.textContent)) textNodes.push(p);
    });
    // "View transcript" PDF link (an <a> in the cta slot). The "Watch" trigger is
    // a <leaf-button> with no href, so it is intentionally skipped.
    const transcript = promo.querySelector('[slot="cta"] a[href], div[slot="cta"] a[href]')
      || Array.from(promo.querySelectorAll('a[href]')).find((a) => /transcript/i.test(a.textContent));
    if (transcript) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = transcript.getAttribute('href');
      a.textContent = (transcript.textContent || '').replace(/\s+/g, ' ').trim() || 'View transcript';
      p.append(a);
      textNodes.push(p);
    }

    cells.push([image || '', textNodes.length ? textNodes : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'media-cards', cells });
  element.replaceWith(block);
}
