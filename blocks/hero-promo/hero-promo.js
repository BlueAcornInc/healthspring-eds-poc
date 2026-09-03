export default function decorate(block) {
  const content = block.querySelector(':scope > div > div') || block;

  // The promo can optionally lead with a decorative image cell; if none, flag it.
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Collect standalone call-to-action links (a paragraph whose only content is a link).
  const ctaParagraphs = [...content.querySelectorAll(':scope > p')]
    .filter((p) => p.childElementCount === 1
      && p.firstElementChild.tagName === 'A'
      && p.textContent.trim() === p.firstElementChild.textContent.trim());

  if (ctaParagraphs.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-promo-actions';
    ctaParagraphs[0].before(actions);

    ctaParagraphs.forEach((p, i) => {
      const link = p.firstElementChild;
      if (i === 0) {
        link.classList.add('hero-promo-cta-primary');
      } else {
        link.classList.add('hero-promo-cta-secondary');
      }
      actions.append(link);
      p.remove();
    });
  }
}
