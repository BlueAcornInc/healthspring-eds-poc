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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/about-hero.js
  function parse(element, { document }) {
    const image = element.querySelector(".leaf-c-leaf-hero__image-container img, picture img, img");
    const heading = element.querySelector('h1, .leaf-c-leaf-hero__heading h1, [class*="heading"] h1');
    const subtitle = element.querySelector('.leaf-c-leaf-hero__content p, [class*="content"] p, p');
    if (!heading && !subtitle && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = (heading.textContent || "").trim();
      contentCell.push(h1);
    }
    if (subtitle && /\S/.test(subtitle.textContent)) {
      const p = document.createElement("p");
      p.textContent = (subtitle.textContent || "").replace(/\s+/g, " ").trim();
      contentCell.push(p);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "about-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/plan-select.js
  function parse2(element, { document }) {
    const heading = element.querySelector("h1, h2, h3");
    const intro = element.querySelector("p");
    const cards = Array.from(element.querySelectorAll("leaf-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const CARD_LINKS = [
      { title: "Medicare Advantage (Medicare Part C)", href: "/medicare/medicare-advantage" },
      { title: "Prescription Drug Plans (Medicare Part D)", href: "/medicare/part-d" },
      { title: "Medicare Supplement Plans", href: "/medicare/medicare-supplement" },
      { title: "Supplemental Health Plans", href: "/supplemental" }
    ];
    const cells = [];
    cards.forEach((card, i) => {
      const image = card.querySelector("picture img, img");
      const titleLink = card.querySelector('[slot="heading"] a[href], h1 a, h2 a, h3 a, a[href]');
      const fallback = CARD_LINKS[i];
      const textNodes = [];
      if (titleLink || fallback) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = titleLink ? titleLink.getAttribute("href") : fallback.href;
        a.textContent = titleLink ? (titleLink.textContent || "").replace(/\s+/g, " ").trim() : fallback.title;
        h.append(a);
        textNodes.push(h);
      }
      cells.push([image || "", textNodes.length ? textNodes : ""]);
    });
    const output = [];
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = (heading.textContent || "").trim();
      output.push(h);
    }
    if (intro && /\S/.test(intro.textContent)) {
      const p = document.createElement("p");
      p.textContent = (intro.textContent || "").replace(/\s+/g, " ").trim();
      output.push(p);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "plan-select", cells });
    output.push(block);
    element.replaceWith(...output);
  }

  // tools/importer/parsers/promo-band.js
  function parse3(element, { document }) {
    const promo = element.querySelector("leaf-promo") || element;
    const contentCell = [];
    const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = (heading.textContent || "").trim();
      contentCell.push(h);
    }
    const list = promo.querySelector('ul[slot="content"], ul');
    promo.querySelectorAll('div[slot="content"] > p, [slot="content"] p').forEach((p) => {
      if (list && list.contains(p)) return;
      if (!/\S/.test(p.textContent)) return;
      if (p.querySelector("a") && p.textContent.trim() === p.querySelector("a").textContent.trim()) return;
      contentCell.push(p);
    });
    if (list) {
      const ul = document.createElement("ul");
      list.querySelectorAll("li").forEach((li) => {
        const text = (li.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) return;
        const newLi = document.createElement("li");
        newLi.textContent = text;
        ul.append(newLi);
      });
      if (ul.childElementCount) contentCell.push(ul);
    }
    const ctas = [];
    promo.querySelectorAll("leaf-button[href]").forEach((btn) => {
      const a = document.createElement("a");
      a.href = btn.getAttribute("href");
      a.textContent = (btn.textContent || "").replace(/\s+/g, " ").trim();
      if (a.textContent) ctas.push(a);
    });
    promo.querySelectorAll('div[slot="content"] > p > a[href]').forEach((a) => {
      if (a.closest("li")) return;
      if (a.parentElement.textContent.trim() === a.textContent.trim()) {
        ctas.push(a);
      }
    });
    ctas.forEach((a) => {
      const p = document.createElement("p");
      p.append(a);
      contentCell.push(p);
    });
    if (contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-band", cells: [[contentCell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/link-list.js
  function parse4(element, { document }) {
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    const list = element.querySelector("ul");
    if (!list) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell = [];
    if (heading) {
      const h = document.createElement("h4");
      h.textContent = (heading.textContent || "").replace(/\s+/g, " ").trim();
      cell.push(h);
    }
    const ul = document.createElement("ul");
    list.querySelectorAll("li").forEach((li) => {
      const a = li.querySelector("a[href]");
      if (!a) return;
      const newLi = document.createElement("li");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (!link.textContent) return;
      newLi.append(link);
      ul.append(newLi);
    });
    if (!ul.childElementCount) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cell.push(ul);
    const block = WebImporter.Blocks.createBlock(document, { name: "link-list", cells: [[cell]] });
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
        "leaf-back-to-top",
        "leaf-breadcrumbs",
        "leaf-modal",
        "#content script",
        "#content style"
      ]);
    }
  }

  // tools/importer/import-about-us.js
  var parsers = {
    "about-hero": parse,
    "plan-select": parse2,
    "promo-band": parse3,
    "link-list": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: 'HealthSpring About Us interior page: full-bleed navy brand hero, intro copy (default content), "Explore Our Plans" 4-up plan navigator cards, purple "we understand" promo band, and a "Learn More" community resource link list.',
    urls: [
      "https://www.healthspring.com/about-us"
    ],
    blocks: [
      { name: "about-hero", instances: ["#healthspring-about-us-hero"] },
      // idx2 (intro copy) stays as default content.
      { name: "plan-select", instances: ["#content > div:nth-of-type(3)"] },
      { name: "promo-band", instances: ["#content > div:nth-of-type(4)"] },
      { name: "link-list", instances: ["#content > div:nth-of-type(5)"] }
    ],
    // Section styling: applied as Section Metadata after the block's element so the
    // authored section inherits the source background treatment. The hero band is
    // painted by the about-hero block itself (full-bleed navy), so it takes no
    // section style; the "we understand" promo band is a full-bleed purple band.
    sectionStyles: [
      { selector: "#content > div:nth-of-type(4)", style: "purple" }
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
  var import_about_us_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const sectionTargets = (PAGE_TEMPLATE.sectionStyles || []).map(({ selector, style }) => ({ element: document.querySelector(selector), style })).filter((t) => t.element);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block, idx) => {
        if (!block.element.parentNode) return;
        const target = sectionTargets.find((t) => t.element === block.element);
        const anchorParent = block.element.parentNode;
        const anchorNext = block.element.nextSibling;
        if (target && idx > 0) {
          anchorParent.insertBefore(document.createElement("hr"), block.element);
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
  return __toCommonJS(import_about_us_exports);
})();
