/* eslint-disable */
/* global WebImporter */
/**
 * Parser for link-list. Base: columns.
 * Source: https://www.healthspring.com/about-us
 *   (#content > div:nth-of-type(5) — "Learn More About Our Health Care
 *   Community")
 * Generated: 2026-09-03
 *
 * A simple resource link block: an <h4> heading above a single <ul> of links
 * ("FAQs", "About HCSC", "Careers with HCSC", "Natural Disaster Resources").
 * Some links are external (a decorative external-link <img>/<svg> icon that
 * does not scrape) — text + href are kept. All content lives in the light DOM.
 *
 * Emitted as a single-cell block holding the heading + rebuilt link list.
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  const list = element.querySelector('ul');

  if (!list) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cell = [];
  if (heading) {
    const h = document.createElement('h4');
    h.textContent = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    cell.push(h);
  }

  const ul = document.createElement('ul');
  list.querySelectorAll('li').forEach((li) => {
    const a = li.querySelector('a[href]');
    if (!a) return;
    const newLi = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = (a.textContent || '').replace(/\s+/g, ' ').trim();
    if (!link.textContent) return;
    newLi.append(link);
    ul.append(newLi);
  });

  if (!ul.childElementCount) {
    element.replaceWith(...element.childNodes);
    return;
  }
  cell.push(ul);

  const block = WebImporter.Blocks.createBlock(document, { name: 'link-list', cells: [[cell]] });
  element.replaceWith(block);
}
