/* eslint-disable */
/* global WebImporter */
/**
 * Parser for link-callout. Base: columns.
 * Source: https://www.healthspring.com/medicare/medicare-advantage
 *   (#content > div:nth-of-type(6) — "Go from questions to confidence...")
 * Generated: 2026-09-03
 *
 * A <leaf-promo variant="simple"> with a search icon, an intro line linking to
 * "Understanding Medicare", and two side-by-side link lists. The decorative icon
 * did not import (custom <leaf-icon>), so only text/links are captured.
 *
 * Emitted as a 2-row columns block:
 *   Row 1: the intro sentence spanning both columns.
 *   Row 2: link-list column 1 | link-list column 2.
 */
export default function parse(element, { document }) {
  const promo = element.querySelector('leaf-promo') || element;

  // Intro sentence (first content paragraph).
  const intro = promo.querySelector('div[slot="content"] > p');

  // The two link lists.
  const lists = Array.from(promo.querySelectorAll('ul.leaf-u-link-list, .leaf-c-astro-list ul, ul'));

  if (!intro && lists.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: intro spanning both columns (second cell empty for a 2-col table).
  if (intro) cells.push([intro, '']);

  // Row 2: two link-list columns. Rebuild clean <ul> so slot attrs are dropped.
  const buildCol = (ul) => {
    if (!ul) return '';
    const col = document.createElement('ul');
    ul.querySelectorAll('li').forEach((li) => {
      const a = li.querySelector('a[href]');
      if (!a) return;
      const newLi = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = (a.textContent || '').replace(/\s+/g, ' ').trim();
      newLi.append(link);
      col.append(newLi);
    });
    return col.childElementCount ? col : '';
  };

  cells.push([buildCol(lists[0]), buildCol(lists[1])]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'link-callout', cells });
  element.replaceWith(block);
}
