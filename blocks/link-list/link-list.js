/**
 * link-list — "Learn More About Our Health Care Community" resource links.
 * A heading above a simple vertical list of purple text links. Presentational
 * only; the authored structure (heading + <ul>) is already correct, so this
 * just tags the inner wrapper for scoped styling.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  if (cell) cell.classList.add('link-list-body');
}
