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

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (slides.length === 0) {
      slides = Array.from(element.querySelectorAll('.teaser, [class*="teaser"]'));
    }
    if (slides.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
      const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      ctaLinks.forEach((cta) => textCell.push(cta));
      if (!image && textCell.length === 0) return;
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"]):not([class*="title"])');
    const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));
    const textCell = [];
    if (eyebrow) textCell.push(eyebrow);
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    ctaLinks.forEach((cta) => textCell.push(cta));
    if (!image && textCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([image || "", textCell.length ? textCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-adventure.js
  function parse3(element, { document: document2 }) {
    let cards = Array.from(element.querySelectorAll("li.cmp-image-list__item, .cmp-image-list__item"));
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(".cmp-image-list__item-content, article"));
    }
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".cmp-image-list__item-image img, .cmp-image img, img");
      const titleEl = card.querySelector('.cmp-image-list__item-title, h1, h2, h3, h4, [class*="title"]');
      const description = card.querySelector('.cmp-image-list__item-description, [class*="description"]');
      const titleLink = card.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');
      const textCell = [];
      if (titleEl) {
        const href = titleLink ? titleLink.getAttribute("href") : null;
        if (href) {
          const link = document2.createElement("a");
          link.href = href;
          link.append(titleEl);
          textCell.push(link);
        } else {
          textCell.push(titleEl);
        }
      }
      if (description) textCell.push(description);
      if (!image && textCell.length === 0) return;
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse4(element, { document: document2 }) {
    const bgImage = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"]):not([class*="title"])');
    const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctaLinks.forEach((cta) => contentCell.push(cta));
    if (!bgImage && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#toggleNav",
        "#mobileNav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#destination_publishing_iframe_wkndsite_0",
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-image > meta",
        ".cmp-image meta"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-adventure": parse3,
    "hero-overlay": parse4
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND home page: hero carousel, featured article, article/adventure card grids, overlay teaser.",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.cmp-carousel--hero"] },
      { name: "columns-featured", instances: [".teaser.cmp-teaser--featured"] },
      {
        name: "cards-adventure",
        instances: [
          "main.cmp-layout-container--fixed:nth-of-type(1) .image-list.list",
          "main.cmp-layout-container--fixed:nth-of-type(2) .image-list.list"
        ]
      },
      { name: "hero-overlay", instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"] }
    ],
    sections: [
      { id: "rc1", name: "Hero carousel", selector: ".carousel.cmp-carousel--hero", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "rc3", name: "Featured article", selector: ".teaser.cmp-teaser--featured", style: null, blocks: ["columns-featured"], defaultContent: [] },
      { id: "rc4-rc5", name: "Recent articles", selector: "main.cmp-layout-container--fixed:nth-of-type(1)", style: null, blocks: ["cards-adventure"], defaultContent: ["main.cmp-layout-container--fixed:nth-of-type(1) .cmp-title", "main.cmp-layout-container--fixed:nth-of-type(1) .cmp-button"] },
      { id: "rc8-rc10", name: "Next adventures", selector: ".teaser.cmp-teaser--hero.cmp-teaser--imagebottom", style: null, blocks: ["hero-overlay"], defaultContent: [] },
      { id: "rc11-rc12", name: "Where do you want to go", selector: "main.cmp-layout-container--fixed:nth-of-type(2)", style: null, blocks: ["cards-adventure"], defaultContent: ["main.cmp-layout-container--fixed:nth-of-type(2) .cmp-title", "main.cmp-layout-container--fixed:nth-of-type(2) .cmp-button"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
