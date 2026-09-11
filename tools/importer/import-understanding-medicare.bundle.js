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

  // tools/importer/import-understanding-medicare.js
  var import_understanding_medicare_exports = {};
  __export(import_understanding_medicare_exports, {
    default: () => import_understanding_medicare_default
  });

  // tools/importer/parsers/widget.js
  function parse(element, { document }) {
    const banner = element.querySelector("leaf-sticky-banner") || element;
    const heading = banner.querySelector("h1, h2, h3, h4, h5, h6");
    const planFinder = banner.querySelector(".medicare-plan-finder, astro-island");
    const callouts = Array.from(banner.querySelectorAll("p")).filter(
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
    callouts.forEach((c) => output.push(c));
    element.replaceWith(...output);
  }

  // tools/importer/parsers/promo-card.js
  function parse2(element, { document }) {
    const promo = element.querySelector("leaf-promo") || element;
    const contentCell = [];
    const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement("h3");
      h.textContent = (heading.textContent || "").replace(/\s+/g, " ").trim();
      contentCell.push(h);
    }
    promo.querySelectorAll('div[slot="content"] p, [slot="content"] p').forEach((p) => {
      if (!/\S/.test(p.textContent)) return;
      const np = document.createElement("p");
      np.textContent = (p.textContent || "").replace(/\s+/g, " ").trim();
      contentCell.push(np);
    });
    const cta = promo.querySelector('[slot="cta"] a[href], a[href]');
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.getAttribute("href");
      a.textContent = (cta.textContent || "").replace(/\s+/g, " ").trim();
      if (a.textContent) {
        p.append(a);
        contentCell.push(p);
      }
    }
    if (contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-card", cells: [[contentCell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/link-list.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/plan-select-explore.js
  function parse4(element, { document }) {
    const heading = element.querySelector("h1, h2, h3, h4");
    const cards = Array.from(element.querySelectorAll("leaf-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const CARD_LINKS = [
      { title: "Medicare Advantage Plans", href: "/medicare/medicare-advantage" },
      { title: "Medicare Supplement Policies", href: "/medicare/medicare-supplement" },
      { title: "Prescription Drug Plans", href: "/medicare/part-d" }
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
      h.textContent = (heading.textContent || "").replace(/\s+/g, " ").trim();
      output.push(h);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "plan-select", cells });
    output.push(block);
    const backLink = element.querySelector("a[href]");
    if (backLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = backLink.getAttribute("href");
      a.textContent = (backLink.textContent || "").replace(/\s+/g, " ").trim();
      if (a.textContent) {
        p.append(a);
        output.push(p);
      }
    }
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

  // tools/importer/import-understanding-medicare.js
  var parsers = {
    "widget": parse,
    "promo-card": parse2,
    "link-list": parse3,
    "plan-select": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "understanding-medicare",
    description: "HealthSpring Understanding Medicare long-form article (Choosing a Medicare Plan): purple title-band hero (default content), plan-finder widget, article body as default content, inline navy promo-card, Related link-list, and Explore Our Plans plan-select grid.",
    urls: [
      "https://www.healthspring.com/medicare/understanding-medicare/choosing-a-medicare-plan"
    ],
    blocks: [
      // Hero (#healthspring-choosing-medicare-plan-hero) stays as DEFAULT CONTENT
      // inside a purple section (see sectionStyles). Article body (Understanding
      // Medicare basics / Factors to consider / Steps to choose / legal) is also
      // default content and needs no block mapping.
      { name: "widget", instances: ["#content > leaf-sticky-banner"] },
      { name: "promo-card", instances: ["#content > div:nth-of-type(3)"] },
      { name: "link-list", instances: ["#content > div:nth-of-type(6)"] },
      { name: "plan-select", instances: ["#content > div:nth-of-type(7)"] }
    ],
    // Section styling: applied as Section Metadata after the block's element so the
    // authored section inherits the source background treatment. The hero renders
    // on a purple band in the source.
    sectionStyles: [
      { selector: "#healthspring-choosing-medicare-plan-hero", style: "purple" }
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
  var import_understanding_medicare_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const sectionTargets = (PAGE_TEMPLATE.sectionStyles || []).map(({ selector, style }) => ({ element: document.querySelector(selector), style })).filter((t) => t.element);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      const blockElements = new Set(pageBlocks.map((b) => b.element));
      sectionTargets.forEach((target) => {
        if (blockElements.has(target.element)) return;
        const el = target.element;
        const parent = el.parentNode;
        if (!parent) return;
        const anchorNext = el.nextSibling;
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: [["Style", target.style]]
        });
        const nextSection = document.createElement("hr");
        if (anchorNext && anchorNext.parentNode === parent) {
          parent.insertBefore(meta, anchorNext);
          parent.insertBefore(nextSection, anchorNext);
        } else {
          parent.appendChild(meta);
          parent.appendChild(nextSection);
        }
      });
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
      const tables = Array.from(main.querySelectorAll("table"));
      const metaTable = tables.reverse().find((t) => {
        const th = t.querySelector("th, td");
        return th && /metadata/i.test(th.textContent || "");
      });
      if (metaTable) {
        const tbody = metaTable.querySelector("tbody") || metaTable;
        const row = document.createElement("tr");
        const key = document.createElement("td");
        key.textContent = "template";
        const value = document.createElement("td");
        value.textContent = "understanding-medicare";
        row.append(key, value);
        tbody.append(row);
      }
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
  return __toCommonJS(import_understanding_medicare_exports);
})();
