/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import aboutHeroParser from './parsers/about-hero.js';
import planSelectParser from './parsers/plan-select.js';
import promoBandParser from './parsers/promo-band.js';
import linkListParser from './parsers/link-list.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/healthspring-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'about-hero': aboutHeroParser,
  'plan-select': planSelectParser,
  'promo-band': promoBandParser,
  'link-list': linkListParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates-interior.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'HealthSpring About Us interior page: full-bleed navy brand hero, intro copy (default content), "Explore Our Plans" 4-up plan navigator cards, purple "we understand" promo band, and a "Learn More" community resource link list.',
  urls: [
    'https://www.healthspring.com/about-us',
  ],
  blocks: [
    { name: 'about-hero', instances: ['#healthspring-about-us-hero'] },
    // idx2 (intro copy) stays as default content.
    { name: 'plan-select', instances: ['#content > div:nth-of-type(3)'] },
    { name: 'promo-band', instances: ['#content > div:nth-of-type(4)'] },
    { name: 'link-list', instances: ['#content > div:nth-of-type(5)'] },
  ],
  // Section styling: applied as Section Metadata after the block's element so the
  // authored section inherits the source background treatment. The hero band is
  // painted by the about-hero block itself (full-bleed navy), so it takes no
  // section style; the "we understand" promo band is a full-bleed purple band.
  sectionStyles: [
    { selector: '#content > div:nth-of-type(4)', style: 'purple' },
  ],
};

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Capture section-style targets BEFORE parsing detaches/replaces elements
    const sectionTargets = (PAGE_TEMPLATE.sectionStyles || [])
      .map(({ selector, style }) => ({ element: document.querySelector(selector), style }))
      .filter((t) => t.element);

    // 3. Find blocks on the page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 4. Parse each block. Track the resulting block element so we can attach
    //    section metadata immediately after it.
    pageBlocks.forEach((block, idx) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      // Find the matching section target (by element identity) before the parser
      // replaces the element, so we can re-anchor the section metadata.
      const target = sectionTargets.find((t) => t.element === block.element);
      const anchorParent = block.element.parentNode;
      const anchorNext = block.element.nextSibling;

      // A coloured band must START its own section, otherwise the preceding
      // default content (which carries no Section Metadata) merges into the
      // band and inherits its background. Insert a leading <hr> before every
      // styled block except the first (the hero has no preceding content).
      if (target && idx > 0) {
        anchorParent.insertBefore(document.createElement('hr'), block.element);
      }

      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }

      // 5. If this element carried a section style, append Section Metadata + <hr>
      //    right after the (now parsed) block so EDS applies the section style.
      if (target && anchorParent) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['Style', target.style]],
        });
        const hr = document.createElement('hr');
        if (anchorNext && anchorNext.parentNode === anchorParent) {
          anchorParent.insertBefore(meta, anchorNext);
          anchorParent.insertBefore(hr, anchorNext);
        } else {
          anchorParent.appendChild(meta);
          anchorParent.appendChild(hr);
        }
      }
    });

    // 6. afterTransform cleanup
    executeTransformers('afterTransform', main, payload);

    // 7. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 8. Sanitized path. Map the root URL to /index (empty path crashes the bundled importer).
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
