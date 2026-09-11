/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import widgetParser from './parsers/widget.js';
import promoCardParser from './parsers/promo-card.js';
import linkListParser from './parsers/link-list.js';
import planSelectExploreParser from './parsers/plan-select-explore.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/healthspring-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'widget': widgetParser,
  'promo-card': promoCardParser,
  'link-list': linkListParser,
  'plan-select': planSelectExploreParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates-interior.json
const PAGE_TEMPLATE = {
  name: 'understanding-medicare',
  description: 'HealthSpring Understanding Medicare long-form article (Choosing a Medicare Plan): purple title-band hero (default content), plan-finder widget, article body as default content, inline navy promo-card, Related link-list, and Explore Our Plans plan-select grid.',
  urls: [
    'https://www.healthspring.com/medicare/understanding-medicare/choosing-a-medicare-plan',
  ],
  blocks: [
    // Hero (#healthspring-choosing-medicare-plan-hero) stays as DEFAULT CONTENT
    // inside a purple section (see sectionStyles). Article body (Understanding
    // Medicare basics / Factors to consider / Steps to choose / legal) is also
    // default content and needs no block mapping.
    { name: 'widget', instances: ['#content > leaf-sticky-banner'] },
    { name: 'promo-card', instances: ['#content > div:nth-of-type(3)'] },
    { name: 'link-list', instances: ['#content > div:nth-of-type(6)'] },
    { name: 'plan-select', instances: ['#content > div:nth-of-type(7)'] },
  ],
  // Section styling: applied as Section Metadata after the block's element so the
  // authored section inherits the source background treatment. The hero renders
  // on a purple band in the source.
  sectionStyles: [
    { selector: '#healthspring-choosing-medicare-plan-hero', style: 'purple' },
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

    // 2a. Apply section styles that anchor to elements which are NOT parsed
    //     blocks (e.g. the default-content hero band). These must be handled
    //     here because the block-parsing loop below only re-anchors metadata for
    //     elements that are also blocks.
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    const blockElements = new Set(pageBlocks.map((b) => b.element));

    sectionTargets.forEach((target) => {
      if (blockElements.has(target.element)) return; // handled in the block loop
      const el = target.element;
      const parent = el.parentNode;
      if (!parent) return;
      // Capture the anchor ONCE — re-reading el.nextSibling after the first
      // insert would return the freshly-inserted node and mis-order the <hr>.
      const anchorNext = el.nextSibling;
      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: [['Style', target.style]],
      });
      const nextSection = document.createElement('hr');
      // Keep the metadata INSIDE the hero's section, then close the section with
      // an <hr> so following default content does not inherit the purple band.
      if (anchorNext && anchorNext.parentNode === parent) {
        parent.insertBefore(meta, anchorNext);
        parent.insertBefore(nextSection, anchorNext);
      } else {
        parent.appendChild(meta);
        parent.appendChild(nextSection);
      }
    });

    // 4. Parse each block. Track the resulting block element so we can attach
    //    section metadata immediately after it.
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const target = sectionTargets.find((t) => t.element === block.element);
      const anchorParent = block.element.parentNode;
      const anchorNext = block.element.nextSibling;

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

    // 7a. Tag this page with its template so scripts.js applies a
    //     body.understanding-medicare class. That lets styles.css scope the
    //     long-form article measure/typography without affecting other pages.
    //     createMetadata appends a metadata <table> to main; add a "Template"
    //     row to it (the metadata block is the last table with a "Metadata"
    //     header cell).
    const tables = Array.from(main.querySelectorAll('table'));
    const metaTable = tables.reverse().find((t) => {
      const th = t.querySelector('th, td');
      return th && /metadata/i.test(th.textContent || '');
    });
    if (metaTable) {
      const tbody = metaTable.querySelector('tbody') || metaTable;
      const row = document.createElement('tr');
      const key = document.createElement('td');
      // Lowercase key so the rendered <meta name="template"> matches
      // getMetadata('template') in scripts/aem.js (case-sensitive; the pipeline
      // only auto-lowercases known OG fields like title/description/image).
      key.textContent = 'template';
      const value = document.createElement('td');
      value.textContent = 'understanding-medicare';
      row.append(key, value);
      tbody.append(row);
    }

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
