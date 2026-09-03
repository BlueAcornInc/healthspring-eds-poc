// Social brand icons, keyed by hostname fragment found in the link href.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
};

/**
 * Fetches the footer fragment, trying the localhost path first, then the
 * production root path. Metadata-independent by design.
 * @returns {Promise<Document|null>}
 */
async function loadFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Replaces social link text with a brand icon (keeps an accessible label).
 * @param {Element} scope The footer element
 */
function decorateSocialLinks(scope) {
  scope.querySelectorAll('a[href]').forEach((a) => {
    const key = Object.keys(SOCIAL_ICONS).find((k) => a.href.includes(k));
    if (key) {
      const label = a.textContent.trim();
      a.setAttribute('aria-label', label);
      a.classList.add('footer-social-link');
      a.innerHTML = SOCIAL_ICONS[key];
    }
  });
}

/**
 * loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFooterFragment();
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  while (fragment.body.firstElementChild) footer.append(fragment.body.firstElementChild);

  const classes = ['links', 'connect', 'legal'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  // First <ul> in the connect section holds the social links.
  const connect = footer.querySelector('.footer-connect');
  if (connect) {
    const socialList = connect.querySelector('ul');
    if (socialList) {
      socialList.classList.add('footer-social');
      decorateSocialLinks(socialList);
    }
    const legalLinks = connect.querySelectorAll('ul')[1];
    if (legalLinks) legalLinks.classList.add('footer-legal-links');
  }

  // Back-to-top control (built in JS per the footer.plain.html contract).
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'footer-to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8l-6 6 1.4 1.4L12 10.8l4.6 4.6L18 14z"/></svg><span>Top</span>';
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  footer.append(toTop);

  block.append(footer);
}
