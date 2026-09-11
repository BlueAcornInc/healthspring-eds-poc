/**
 * link-callout — "Understanding Medicare" callout: an intro sentence followed by
 * two side-by-side link lists inside a soft card. Row 1 is the intro (spanning
 * both columns); row 2 holds the two link-list columns.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: intro sentence.
  if (rows[0]) {
    rows[0].classList.add('link-callout-intro');
    // Drop the empty padding cell.
    const cells = [...rows[0].children];
    if (cells.length > 1 && !(cells[1].textContent || '').trim()) cells[1].remove();
  }

  // Row 2: the two link columns.
  if (rows[1]) {
    rows[1].classList.add('link-callout-lists');
  }
}
