// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>';
const CHEVRON_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.12 9.29 12 13.17l3.88-3.88a1 1 0 0 1 1.41 1.42l-4.59 4.59a1 1 0 0 1-1.41 0L6.7 10.71a1 1 0 1 1 1.42-1.42z"/></svg>';
const EXTERNAL_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5v2H7v10h10v-3h2v5H5V5z"/></svg>';

/**
 * Fetches the nav fragment HTML, trying the localhost path first, then the
 * production root path. Metadata-independent by design.
 * @returns {Promise<Document|null>}
 */
async function loadNavFragment() {
  let base = '/content/nav.plain.html';
  let resp = await fetch(base);
  if (!resp.ok) {
    base = '/nav.plain.html';
    resp = await fetch(base);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Resolve relative image paths against the fragment location, not the
  // current page URL (which breaks on nested pages like /medicare/...).
  doc.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.src = new URL(src, new URL(base, window.location.href)).href;
    }
  });
  return doc;
}

/**
 * Closes every open nav group.
 * @param {Element} sections The nav-sections container
 */
function closeAllGroups(sections) {
  sections.querySelectorAll('.nav-group[aria-expanded="true"]').forEach((g) => {
    g.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the mobile drawer open/closed.
 * @param {Element} nav The nav element
 * @param {boolean|null} forceExpanded Optional forced state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * Turns a nav group <li> (one that contains a submenu) into a toggle button + panel.
 * @param {Element} li The group list item
 * @param {Element} sections The nav-sections container
 */
function decorateGroup(li, sections) {
  const label = li.querySelector(':scope > p');
  const panel = li.querySelector(':scope > ul');
  if (!label || !panel) return;

  li.classList.add('nav-group');
  li.setAttribute('aria-expanded', 'false');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-group-toggle';
  toggle.innerHTML = `<span>${label.textContent.trim()}</span>${CHEVRON_ICON}`;
  toggle.addEventListener('click', () => {
    const open = li.getAttribute('aria-expanded') === 'true';
    closeAllGroups(sections);
    li.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  label.replaceWith(toggle);
  panel.classList.add('nav-group-panel');
}

/**
 * loads and decorates the header, mainly the nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await loadNavFragment();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  while (fragment.body.firstElementChild) nav.append(fragment.body.firstElementChild);

  const classes = ['brand', 'sections', 'secondary'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  const navSecondary = nav.querySelector('.nav-secondary');

  // Brand row: first link is the logo; remaining links are utility links.
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const paragraphs = [...navBrand.querySelectorAll(':scope > p')];
    const [logoP, ...utilPs] = paragraphs;
    if (logoP) logoP.classList.add('nav-logo');

    // Utility paragraphs split by destination:
    //  - phone (tel:) and Member Log in -> right side of the navy menu row
    //  - everything else (e.g. Español) -> top white utility row
    const isMemberRow = (p) => p.querySelector('a[href^="tel:"]')
      || /member log\s?in/i.test(p.textContent);
    const memberPs = utilPs.filter(isMemberRow);
    const topPs = utilPs.filter((p) => !isMemberRow(p));

    const utilWrapper = document.createElement('div');
    utilWrapper.className = 'nav-utility';

    // Fold the secondary links (Brokers/Employers/Providers) into the top
    // utility row, ahead of the remaining utility items, with a divider.
    if (navSecondary) {
      const secList = navSecondary.querySelector('ul');
      if (secList) {
        secList.classList.add('nav-secondary-links');
        utilWrapper.append(secList);
        const divider = document.createElement('span');
        divider.className = 'nav-utility-divider';
        divider.setAttribute('aria-hidden', 'true');
        utilWrapper.append(divider);
      }
      navSecondary.remove();
    }

    topPs.forEach((p) => utilWrapper.append(p));

    // Search control (built in JS per the nav.plain.html contract).
    const search = document.createElement('a');
    search.className = 'nav-search';
    search.href = '/search';
    search.setAttribute('aria-label', 'Search');
    search.innerHTML = `${SEARCH_ICON}<span>Search</span>`;
    utilWrapper.append(search);
    navBrand.append(utilWrapper);

    // Phone + Member Log in sit on the right of the navy menu row.
    if (memberPs.length && navSections) {
      const memberWrapper = document.createElement('div');
      memberWrapper.className = 'nav-member';
      memberPs.forEach((p) => memberWrapper.append(p));
      navSections.append(memberWrapper);
    }
  }

  // Nav groups (expandable categories).
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      if (li.querySelector(':scope > ul')) decorateGroup(li, navSections);
    });

    // Flag top-level menu links that leave the site (e.g. Find Care) with an
    // external-link icon, matching the source.
    navSections.querySelectorAll(':scope > ul > li a[href^="http"]').forEach((a) => {
      if (a.hostname && a.hostname !== window.location.hostname && !a.querySelector('svg')) {
        a.classList.add('nav-external');
        a.insertAdjacentHTML('beforeend', EXTERNAL_ICON);
      }
    });
  }

  // Hamburger toggle (mobile).
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  if (navBrand) navBrand.append(hamburger);

  // Reset drawer + open groups when crossing the desktop breakpoint.
  const applyBreakpoint = () => {
    toggleMenu(nav, isDesktop.matches);
    if (navSections) closeAllGroups(navSections);
  };
  applyBreakpoint();
  isDesktop.addEventListener('change', applyBreakpoint);

  // Close open groups when clicking outside the nav.
  document.addEventListener('click', (e) => {
    if (navSections && !nav.contains(e.target)) closeAllGroups(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
