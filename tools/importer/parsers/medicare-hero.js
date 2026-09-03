/* eslint-disable */
/* global WebImporter */
/**
 * Parser for medicare-hero. Base: hero (secondary variant).
 * Source: https://www.healthspring.com/medicare/medicare-advantage (#medicare-advantage-hero-v2)
 * Generated: 2026-09-03
 *
 * The source hero is a "secondary" leaf-hero: a purple band with a lifestyle
 * photo on the right and, on the left, the H1 plus a white "Shop and Compare
 * Plans" box that holds the dynamically-hydrated Medicare plan-finder (astro
 * zip form) and a phone callout.
 *
 * This is a distinct layout from the homepage's full-bleed hero-primary
 * (image-as-background), so it is its own variant. The plan-finder is
 * interactive and cannot be imported statically, so it is authored as a link to
 * the captured snapshot at /widgets/plan-finder.html — scripts/scripts.js
 * buildWidgetAutoBlocks converts that link into the widget block at runtime
 * (widget.js fetches + hydrates the snapshot).
 *
 * Block table (2 rows, 1 column):
 *   Row 1: hero image.
 *   Row 2: H1 + "Shop and Compare Plans" H2 + plan-finder link + phone callout.
 */
export default function parse(element, { document }) {
  // Hero image (lifestyle photo, right side).
  const image = element.querySelector('.leaf-c-leaf-hero__image-container img, picture img, img');

  // H1 title.
  const heading = element.querySelector('h1');

  // "Shop and Compare Plans" banner heading (H2).
  const bannerHeading = element.querySelector('leaf-sticky-banner h2, h2');

  // Plan-finder widget link -> static snapshot (auto-blocked at runtime).
  const widgetLink = document.createElement('a');
  widgetLink.href = '/widgets/plan-finder.html';
  widgetLink.textContent = 'Plan Finder';

  // Phone callout. The source uses a <leaf-phone-number> custom element (no text
  // in static markup), so the number is rebuilt as a real tel: link.
  const phone = document.createElement('p');
  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:+18774506693';
  phoneLink.textContent = '1-877-450-6693';
  const strong = document.createElement('strong');
  strong.append(phoneLink);
  phone.append(document.createTextNode('Or call '), strong, document.createTextNode(' (TTY: 711)'));
  phone.append(document.createElement('br'));
  phone.append(document.createTextNode('8 a.m. - 8 p.m., Monday - Friday'));

  // Content cell: title, banner heading, plan-finder link, phone.
  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = (heading.textContent || '').trim();
    contentCell.push(h1);
  }
  if (bannerHeading) {
    const h2 = document.createElement('h2');
    h2.textContent = (bannerHeading.textContent || '').trim();
    contentCell.push(h2);
  }
  const widgetPara = document.createElement('p');
  widgetPara.append(widgetLink);
  contentCell.push(widgetPara);
  contentCell.push(phone);

  const cells = [];
  if (image) cells.push([image]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'medicare-hero', cells });
  element.replaceWith(block);
}
