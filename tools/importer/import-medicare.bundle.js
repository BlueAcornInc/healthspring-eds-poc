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

  // tools/importer/import-medicare.js
  var import_medicare_exports = {};
  __export(import_medicare_exports, {
    default: () => import_medicare_default
  });

  // tools/importer/parsers/medicare-hero.js
  function parse(element, { document }) {
    const image = element.querySelector(".leaf-c-leaf-hero__image-container img, picture img, img");
    const heading = element.querySelector("h1");
    const bannerHeading = element.querySelector("leaf-sticky-banner h2, h2");
    const widgetLink = document.createElement("a");
    widgetLink.href = "/widgets/plan-finder.html";
    widgetLink.textContent = "Plan Finder";
    const phone = document.createElement("p");
    const phoneLink = document.createElement("a");
    phoneLink.href = "tel:+18774506693";
    phoneLink.textContent = "1-877-450-6693";
    const strong = document.createElement("strong");
    strong.append(phoneLink);
    phone.append(document.createTextNode("Or call "), strong, document.createTextNode(" (TTY: 711)"));
    phone.append(document.createElement("br"));
    phone.append(document.createTextNode("8 a.m. - 8 p.m., Monday - Friday"));
    const contentCell = [];
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = (heading.textContent || "").trim();
      contentCell.push(h1);
    }
    if (bannerHeading) {
      const h2 = document.createElement("h2");
      h2.textContent = (bannerHeading.textContent || "").trim();
      contentCell.push(h2);
    }
    const widgetPara = document.createElement("p");
    widgetPara.append(widgetLink);
    contentCell.push(widgetPara);
    contentCell.push(phone);
    const cells = [];
    if (image) cells.push([image]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "medicare-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/benefit-cards.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll("leaf-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const CARD_TITLES = [
      "All-in-one coverage",
      "Team-based support",
      "Low\u2014or no\u2014monthly premiums",
      "Flexible plan options",
      "Extra benefits included",
      "Part B Giveback"
    ];
    const cells = [];
    cards.forEach((card, i) => {
      const cellContent = [];
      const heading = card.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
      const titleText = heading ? (heading.textContent || "").trim() : CARD_TITLES[i];
      if (titleText) {
        const h = document.createElement("h3");
        h.textContent = titleText;
        cellContent.push(h);
      }
      card.querySelectorAll('[slot="content"]').forEach((sc) => {
        sc.querySelectorAll("p").forEach((p) => {
          if (/\S/.test(p.textContent)) cellContent.push(p);
        });
      });
      card.querySelectorAll('[slot="cta"] a[href]').forEach((a) => {
        const p = document.createElement("p");
        p.append(a);
        cellContent.push(p);
      });
      if (cellContent.length) cells.push([cellContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "benefit-cards", cells });
    element.replaceWith(block);
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

  // tools/importer/parsers/link-callout.js
  function parse4(element, { document }) {
    const promo = element.querySelector("leaf-promo") || element;
    const intro = promo.querySelector('div[slot="content"] > p');
    const lists = Array.from(promo.querySelectorAll("ul.leaf-u-link-list, .leaf-c-astro-list ul, ul"));
    if (!intro && lists.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (intro) cells.push([intro, ""]);
    const buildCol = (ul) => {
      if (!ul) return "";
      const col = document.createElement("ul");
      ul.querySelectorAll("li").forEach((li) => {
        const a = li.querySelector("a[href]");
        if (!a) return;
        const newLi = document.createElement("li");
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = (a.textContent || "").replace(/\s+/g, " ").trim();
        newLi.append(link);
        col.append(newLi);
      });
      return col.childElementCount ? col : "";
    };
    cells.push([buildCol(lists[0]), buildCol(lists[1])]);
    const block = WebImporter.Blocks.createBlock(document, { name: "link-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/media-cards.js
  function parse5(element, { document }) {
    const promos = Array.from(element.querySelectorAll("leaf-promo"));
    if (promos.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    promos.forEach((promo) => {
      const image = promo.querySelector("picture img, img");
      const textNodes = [];
      const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
      if (heading) {
        const h = document.createElement("h3");
        h.textContent = (heading.textContent || "").trim();
        textNodes.push(h);
      }
      promo.querySelectorAll('div[slot="content"] p').forEach((p) => {
        if (/\S/.test(p.textContent)) textNodes.push(p);
      });
      const transcript = promo.querySelector('[slot="cta"] a[href], div[slot="cta"] a[href]') || Array.from(promo.querySelectorAll("a[href]")).find((a) => /transcript/i.test(a.textContent));
      if (transcript) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = transcript.getAttribute("href");
        a.textContent = (transcript.textContent || "").replace(/\s+/g, " ").trim() || "View transcript";
        p.append(a);
        textNodes.push(p);
      }
      cells.push([image || "", textNodes.length ? textNodes : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "media-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/plan-cards.js
  function parse6(element, { document }) {
    const heading = element.querySelector(":scope > div > h1, :scope > div > h2, :scope > div > h3, h3");
    const cards = Array.from(element.querySelectorAll("leaf-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const CARD_LINKS = [
      { title: "Medicare Part D", href: "/medicare/part-d" }
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
      const h = document.createElement("h3");
      h.textContent = (heading.textContent || "").trim();
      output.push(h);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "plan-cards", cells });
    output.push(block);
    element.replaceWith(...output);
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

  // tools/importer/import-medicare.js
  var parsers = {
    "medicare-hero": parse,
    "benefit-cards": parse2,
    "promo-band": parse3,
    "link-callout": parse4,
    "media-cards": parse5,
    "plan-cards": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "medicare",
    description: "HealthSpring Medicare Advantage interior page: hero + plan-finder, value-prop benefit cards, colour promo bands, understanding-medicare link callout, video media cards, keep-shopping plan cards",
    urls: [
      "https://www.healthspring.com/medicare/medicare-advantage"
    ],
    blocks: [
      { name: "medicare-hero", instances: ["#medicare-advantage-hero-v2"] },
      { name: "benefit-cards", instances: ["#content > div:nth-of-type(3)"] },
      // idx4 (extra-info links) & idx2 (intro h2) stay as default content.
      { name: "promo-band", instances: ["#content > div:nth-of-type(5)", "#content > div:nth-of-type(8)"] },
      { name: "link-callout", instances: ["#content > div:nth-of-type(6)"] },
      { name: "media-cards", instances: ["#content > div:nth-of-type(7)"] },
      { name: "plan-cards", instances: ["#content > div:nth-of-type(11)"] }
    ],
    // Section styling: applied as Section Metadata after the block's element so the
    // authored section inherits the source background treatment.
    sectionStyles: [
      { selector: "#medicare-advantage-hero-v2", style: "purple" },
      { selector: "#content > div:nth-of-type(5)", style: "navy" },
      { selector: "#content > div:nth-of-type(8)", style: "purple" },
      { selector: "#content > div:nth-of-type(11)", style: "dark-purple" }
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
  var import_medicare_default = {
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
  return __toCommonJS(import_medicare_exports);
})();
