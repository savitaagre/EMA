/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsAdventureParser from './parsers/cards-adventure.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-featured': columnsFeaturedParser,
  'cards-adventure': cardsAdventureParser,
  'hero-overlay': heroOverlayParser,
};

// PAGE TEMPLATE CONFIGURATION — embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND home page: hero carousel, featured article, article/adventure card grids, overlay teaser.',
  urls: [
    'https://wknd.site/us/en.html',
  ],
  blocks: [
    { name: 'carousel-hero', instances: ['.carousel.cmp-carousel--hero'] },
    { name: 'columns-featured', instances: ['.teaser.cmp-teaser--featured'] },
    {
      name: 'cards-adventure',
      instances: [
        'main.cmp-layout-container--fixed:nth-of-type(1) .image-list.list',
        'main.cmp-layout-container--fixed:nth-of-type(2) .image-list.list',
      ],
    },
    { name: 'hero-overlay', instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom'] },
  ],
  sections: [
    { id: 'rc1', name: 'Hero carousel', selector: '.carousel.cmp-carousel--hero', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'rc3', name: 'Featured article', selector: '.teaser.cmp-teaser--featured', style: null, blocks: ['columns-featured'], defaultContent: [] },
    { id: 'rc4-rc5', name: 'Recent articles', selector: 'main.cmp-layout-container--fixed:nth-of-type(1)', style: null, blocks: ['cards-adventure'], defaultContent: ['main.cmp-layout-container--fixed:nth-of-type(1) .cmp-title', 'main.cmp-layout-container--fixed:nth-of-type(1) .cmp-button'] },
    { id: 'rc8-rc10', name: 'Next adventures', selector: '.teaser.cmp-teaser--hero.cmp-teaser--imagebottom', style: null, blocks: ['hero-overlay'], defaultContent: [] },
    { id: 'rc11-rc12', name: 'Where do you want to go', selector: 'main.cmp-layout-container--fixed:nth-of-type(2)', style: null, blocks: ['cards-adventure'], defaultContent: ['main.cmp-layout-container--fixed:nth-of-type(2) .cmp-title', 'main.cmp-layout-container--fixed:nth-of-type(2) .cmp-button'] },
  ],
};

// TRANSFORMER REGISTRY — cleanup first, then section breaks (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
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

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
