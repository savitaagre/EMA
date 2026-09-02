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

  // tools/importer/import-magazine-article.js
  var import_magazine_article_exports = {};
  __export(import_magazine_article_exports, {
    default: () => import_magazine_article_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const images = Array.from(element.querySelectorAll("img"));
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (images.length) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const image = element.querySelector("img.cover-image, img");
    const breadcrumbs = element.querySelector(".breadcrumbs");
    const heading = element.querySelector('h1, h2, h3, .h2-heading, [class*="heading"]');
    const metaBlocks = Array.from(element.querySelectorAll(":scope > div .flex-horizontal")).filter((el) => !el.closest(".breadcrumbs"));
    if (!image && !heading) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (breadcrumbs) textCell.push(breadcrumbs);
    if (heading) textCell.push(heading);
    metaBlocks.forEach((m) => textCell.push(m));
    const cells = [];
    cells.push([image || "", textCell.length ? textCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > div"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const description = Array.from(card.querySelectorAll("p"));
      const ctaLinks = Array.from(card.querySelectorAll(".button-group a, a.button"));
      const textCell = [];
      if (heading) textCell.push(heading);
      textCell.push(...description);
      textCell.push(...ctaLinks);
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonials.js
  function parse4(element, { document: document2 }) {
    const root = element.closest(".tabs-wrapper") || element;
    const panes = Array.from(root.querySelectorAll(".tabs-content .tab-pane"));
    const menuButtons = Array.from(root.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    if (panes.length === 0 && menuButtons.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const rowCount = Math.max(panes.length, menuButtons.length);
    for (let i = 0; i < rowCount; i += 1) {
      const button = menuButtons[i];
      const pane = panes[i];
      let labelCell = "";
      if (button) {
        const labelContent = button.querySelector(".flex-horizontal > div:not(.avatar)") || button.querySelector(":scope > div");
        labelCell = labelContent || button;
      } else if (pane) {
        labelCell = pane.querySelector("strong") || "";
      }
      const contentCell = pane || "";
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonials", cells });
    root.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > .article-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const tag = card.querySelector('.tag, [class*="tag"]');
      const date = card.querySelector('.article-card-meta .paragraph-sm, [class*="meta"] [class*="paragraph"]');
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const textCell = [];
      if (tag) textCell.push(tag);
      if (date && date !== tag) textCell.push(date);
      const href = card.getAttribute("href");
      if (heading && href) {
        const link = document2.createElement("a");
        link.href = href;
        link.append(heading);
        textCell.push(link);
      } else if (heading) {
        textCell.push(heading);
      }
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > .faq-item, details.faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector(".faq-question, summary");
      const questionText = summary ? summary.querySelector("span") || summary : "";
      const answer = item.querySelector(".faq-answer") || "";
      cells.push([questionText || "", answer || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
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

  // tools/importer/import-magazine-article.js
  var parsers = {
    "hero-split": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonials": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "magazine-article",
    description: "Magazine article page: hero, article masthead, gallery, testimonials tabs, article cards, FAQ accordion, closing CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/magazine/article-1"
    ],
    blocks: [
      { name: "hero-split", instances: ["#main-content > header.section.secondary-section .grid-layout"] },
      { name: "columns-article", instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"] },
      { name: "cards-gallery", instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout"] },
      { name: "tabs-testimonials", instances: ["#main-content > section.section:nth-of-type(3) .grid-layout.tab-menu", "#main-content > section.section:nth-of-type(3) .grid-layout"] },
      { name: "cards-article", instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column"] },
      { name: "accordion-faq", instances: ["#main-content > section.section:nth-of-type(5) .faq-list"] },
      { name: "hero-banner", instances: ["#main-content > section.section.inverse-section"] }
    ],
    sections: [
      { id: "rc1", name: "Hero header", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero-split"], defaultContent: [] },
      { id: "rc2", name: "Article masthead", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "rc3", name: "Style in every snapshot gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: [] },
      { id: "rc4", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonials"], defaultContent: [] },
      { id: "rc5", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-article"], defaultContent: [] },
      { id: "rc6", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc7", name: "Closing CTA banner", selector: "#main-content > section.section.inverse-section", style: "inverse", blocks: ["hero-banner"], defaultContent: [] }
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
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_magazine_article_default = {
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
  return __toCommonJS(import_magazine_article_exports);
})();
