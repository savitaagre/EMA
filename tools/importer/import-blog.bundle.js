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

  // tools/importer/import-blog.js
  var import_blog_exports = {};
  __export(import_blog_exports, {
    default: () => import_blog_default
  });

  // tools/importer/parsers/columns-article.js
  function parse(element, { document: document2 }) {
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

  // tools/importer/transformers/wknd-trendsetters-blog-metadata.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var DATE_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(,\s*\d{4})?$/;
  var captured = /* @__PURE__ */ new WeakMap();
  function isBlog(payload) {
    var _a;
    try {
      const url = payload && (((_a = payload.params) == null ? void 0 : _a.originalURL) || payload.url);
      return url ? new URL(url).pathname.startsWith("/blog/") : false;
    } catch (e) {
      return false;
    }
  }
  function transform(hookName, element, payload) {
    if (!isBlog(payload)) return;
    if (hookName === TransformHook.beforeTransform) {
      const data = {};
      const tag = element.querySelector(".tag");
      if (tag && tag.textContent.trim()) data.category = tag.textContent.trim();
      const dateEl = [...element.querySelectorAll("p, div, span, time")].find((el) => DATE_RE.test(el.textContent.trim()));
      if (dateEl) data.date = dateEl.textContent.trim();
      const cover = element.querySelector("img.cover-image, .cover-image img") || element.querySelector("img");
      if (cover && cover.getAttribute("src")) data.image = cover;
      captured.set(payload.document, data);
    }
    if (hookName === TransformHook.afterTransform) {
      const data = captured.get(payload.document) || {};
      const { document: document2 } = payload;
      let metaBlock = element.querySelector(".metadata");
      const rows = [];
      if (data.category) rows.push(["Category", data.category]);
      if (data.date) rows.push(["Publication Date", data.date]);
      if (data.image) {
        rows.push(["Image", data.image]);
      }
      if (rows.length === 0) return;
      if (!metaBlock) {
        metaBlock = WebImporter.Blocks.createBlock(document2, {
          name: "Metadata",
          cells: rows
        });
        element.append(metaBlock);
      } else {
        rows.forEach(([key, value]) => {
          const row = document2.createElement("div");
          const k = document2.createElement("div");
          k.textContent = key;
          const v = document2.createElement("div");
          if (typeof value === "string") v.textContent = value;
          else v.append(value);
          row.append(k, v);
          metaBlock.append(row);
        });
      }
    }
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
    }
    if (hookName === TransformHook2.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform3(hookName, element, payload) {
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

  // tools/importer/import-blog.js
  var parsers = {
    "columns-article": parse
  };
  var PAGE_TEMPLATE = {
    name: "blog",
    description: "Blog article detail page: article masthead + long-form article body (default content).",
    urls: [
      "https://wknd-trendsetters.site/blog/ace-pro-court-polo"
    ],
    blocks: [
      { name: "columns-article", instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"] }
    ],
    sections: [
      { id: "rc1", name: "Article masthead", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "rc2", name: "Article body", selector: "#main-content > section.section:nth-of-type(2)", style: null, blocks: [], defaultContent: ["#main-content > section.section:nth-of-type(2) .blog-content"] }
    ]
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
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
  var import_blog_default = {
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
  return __toCommonJS(import_blog_exports);
})();
