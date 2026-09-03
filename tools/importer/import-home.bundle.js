/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-primary.js
  function parse(element, { document }) {
    const image = element.querySelector(".leaf-c-leaf-hero__image-container img, picture img, img");
    const heading = element.querySelector(
      '.leaf-c-leaf-hero__heading h1, .leaf-c-leaf-hero__heading h2, h1, h2, [class*="heading"] h1'
    );
    const paragraphs = Array.from(
      element.querySelectorAll('.leaf-c-leaf-hero__content p, [class*="content"] p')
    );
    if (paragraphs.length === 0) {
      const p = element.querySelector("p");
      if (p) paragraphs.push(p);
    }
    if (!heading && paragraphs.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paragraphs);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-primary", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/widget.js
  function parse2(element, { document }) {
    const banner = element.querySelector("leaf-sticky-banner") || element;
    const heading = banner.querySelector("h1, h2, h3, h4, h5, h6");
    const planFinder = banner.querySelector(".medicare-plan-finder, astro-island");
    const callout = Array.from(banner.querySelectorAll("p")).find(
      (p) => /\S/.test(p.textContent) && !(planFinder && planFinder.contains(p))
    );
    const link = document.createElement("a");
    link.href = "/widgets/plan-finder.html";
    link.textContent = "Plan Finder";
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "widget", cells });
    const output = [];
    if (heading) output.push(heading);
    output.push(block);
    if (callout) output.push(callout);
    element.replaceWith(...output);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const row = element.querySelector(".grid-container--flex-direction-row") || element;
    let textCol = row.querySelector(":scope > .col-md-7");
    let mediaCol = row.querySelector(":scope > .col-md-4");
    if (!textCol || !mediaCol) {
      const cols = Array.from(row.querySelectorAll(":scope > div"));
      cols.forEach((col) => {
        const hasImg = col.querySelector("picture, img");
        const hasText = col.querySelector("h1, h2, h3, h4, h5, h6, p");
        if (!mediaCol && hasImg && !hasText) mediaCol = col;
        else if (!textCol && hasText) textCol = col;
      });
    }
    const image = mediaCol ? mediaCol.querySelector("picture, img") : null;
    const textNodes = [];
    if (textCol) {
      Array.from(textCol.children).forEach((child) => {
        const hasContent = child.querySelector("h1,h2,h3,h4,h5,h6,p,a,hr,img") || /\S/.test(child.textContent) || ["H1", "H2", "H3", "H4", "H5", "H6", "P", "HR"].includes(child.tagName);
        if (hasContent) textNodes.push(child);
      });
    }
    if (textNodes.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([textNodes.length ? textNodes : "", image || ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const introBlock = element.querySelector(
      ".leaf-u-text-align-center, .grid-container--align-items-center .leaf-u-text-align-center"
    );
    const introNodes = [];
    if (introBlock) {
      Array.from(introBlock.children).forEach((child) => {
        if (/\S/.test(child.textContent) || child.querySelector("img, a")) {
          introNodes.push(child);
        }
      });
    }
    const cardEls = Array.from(element.querySelectorAll("leaf-card"));
    const CARD_TITLES = [
      "High Quality Care",
      "Plans that Deliver",
      "Stability & Consistency",
      "A Caring Experience"
    ];
    if (cardEls.length === 0 && introNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (introNodes.length) {
      cells.push([introNodes, ""]);
    }
    cardEls.forEach((card, i) => {
      const icon = card.querySelector("img, svg, leaf-icon");
      const iconContent = icon && (icon.querySelector("img, svg") || /\S/.test(icon.textContent)) ? icon : "";
      const textNodes = [];
      if (!card.querySelector("h1, h2, h3, h4, h5, h6") && CARD_TITLES[i]) {
        const title = document.createElement("h4");
        title.textContent = CARD_TITLES[i];
        textNodes.push(title);
      }
      Array.from(card.children).forEach((child) => {
        if (child.tagName && child.tagName.toLowerCase() === "leaf-icon") return;
        if (/\S/.test(child.textContent) || child.querySelector("img, a")) {
          textNodes.push(child);
        }
      });
      cells.push([iconContent, textNodes.length ? textNodes : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse5(element, { document }) {
    const promo = element.querySelector("leaf-promo") || element;
    const heading = promo.querySelector('h1, h2, h3, h4, [class*="heading"]');
    const paragraphs = Array.from(promo.querySelectorAll("p")).filter(
      (p) => /\S/.test(p.textContent)
    );
    const ctas = [];
    promo.querySelectorAll("leaf-button[href]").forEach((btn) => {
      const a = document.createElement("a");
      a.href = btn.getAttribute("href");
      a.textContent = (btn.textContent || "").trim();
      if (a.textContent) ctas.push(a);
    });
    Array.from(promo.querySelectorAll("a[href]")).forEach((a) => {
      if (/\S/.test(a.textContent)) ctas.push(a);
    });
    if (!heading && paragraphs.length === 0 && ctas.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paragraphs);
    contentCell.push(...ctas);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse6(element, { document }) {
    const row = element.querySelector(".grid-container--flex-direction-row") || element;
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    let cta = null;
    const sourceLink = row.querySelector("a[href]");
    if (sourceLink) {
      cta = document.createElement("a");
      cta.href = sourceLink.getAttribute("href");
      cta.textContent = (sourceLink.textContent || "").trim();
    }
    if (!heading && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([heading || "", cta || ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/healthspring-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter",
        "#destination_publishing_iframe_healthspringgrowthandservices_0",
        "iframe.aamIframeLoaded"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "leaf-skiplink",
        "leaf-header",
        "footer.leaf-c-footer",
        "leaf-back-to-top"
      ]);
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-primary": parse,
    "widget": parse2,
    "columns-media": parse3,
    "cards-feature": parse4,
    "hero-promo": parse5,
    "columns-cta": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "home",
    description: "HealthSpring homepage: hero, plan-finder widget, text+image, feature cards, promo banner, questions CTA",
    urls: [
      "https://www.healthspring.com/"
    ],
    blocks: [
      { name: "hero-primary", instances: ["#healthspring-index-hero"] },
      { name: "widget", instances: ["#content > div.grid-container.grid-container--navy.grid-container--justify-content-center.grid-container--margin-top-0.grid-container--fullwidth"] },
      { name: "columns-media", instances: ["#content > div.grid-container--navy.grid-container--margin-top-0.grid-container--fullwidth:nth-of-type(3)"] },
      { name: "cards-feature", instances: ["#content > div.grid-container--margin-top-0.grid-container--fullwidth:nth-of-type(5)"] },
      { name: "hero-promo", instances: ["#content > div.grid-container:nth-of-type(7)"] },
      { name: "columns-cta", instances: ["#content > div.grid-container--white.grid-container--margin-top-0.grid-container--padding-y-48.grid-container--fullwidth"] }
    ],
    // Section styling: applied as Section Metadata after the block's element so the
    // authored section inherits the source background treatment.
    sectionStyles: [
      { selector: "#content > div.grid-container.grid-container--navy.grid-container--justify-content-center.grid-container--margin-top-0.grid-container--fullwidth", style: "navy" },
      { selector: "#content > div.grid-container--navy.grid-container--margin-top-0.grid-container--fullwidth:nth-of-type(3)", style: "navy" },
      { selector: "#content > div.grid-container--margin-top-0.grid-container--fullwidth:nth-of-type(5)", style: "light" },
      { selector: "#content > div.grid-container--white.grid-container--margin-top-0.grid-container--padding-y-48.grid-container--fullwidth", style: "white-padded" }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const sectionTargets = (PAGE_TEMPLATE.sectionStyles || []).map(({ selector, style }) => ({ element: document.querySelector(selector), style })).filter((t) => t.element);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
        if (target && anchorParent) {
          const meta = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["Style", target.style]]
          });
          const hr2 = document.createElement("hr");
          if (anchorNext && anchorNext.parentNode === anchorParent) {
            anchorParent.insertBefore(meta, anchorNext);
            anchorParent.insertBefore(hr2, anchorNext);
          } else {
            anchorParent.appendChild(meta);
            anchorParent.appendChild(hr2);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
