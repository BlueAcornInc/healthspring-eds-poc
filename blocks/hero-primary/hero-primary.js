export default function decorate(block) {
  const firstImage = block.querySelector(':scope > div:first-child picture img');
  if (!firstImage) {
    block.classList.add('no-image');
    return;
  }
  // Hero image is the LCP element: prioritise it (fidelity-invisible perf hint).
  firstImage.setAttribute('loading', 'eager');
  firstImage.setAttribute('fetchpriority', 'high');
}
