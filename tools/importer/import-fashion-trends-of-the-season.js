/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsGalleryParser from './parsers/cards-gallery.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'columns-media': columnsMediaParser,
  'cards-feature': cardsFeatureParser,
  'cards-gallery': cardsGalleryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'fashion-trends-of-the-season',
  description: 'Fashion blog landing page: hero, intro + media columns, feature cards, image gallery, and accent CTA band',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
  ],
  blocks: [
    {
      name: 'hero-split',
      instances: ['#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'columns-media',
      instances: ['#trends .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-feature',
      instances: ['#main-content > section.section.secondary-section .grid-layout.desktop-3-column'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section:nth-of-type(3) .grid-layout.desktop-3-column'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Hero header',
      selector: '#main-content > header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-split'],
      defaultContent: [],
    },
    {
      id: 'rc2',
      name: 'Trend alert intro + media',
      selector: '#trends',
      style: null,
      blocks: ['columns-media'],
      defaultContent: ['#trends .utility-text-align-center h2', '#trends .utility-text-align-center p'],
    },
    {
      id: 'rc3',
      name: 'Trends that turn heads',
      selector: '#main-content > section.section.secondary-section',
      style: 'secondary',
      blocks: ['cards-feature'],
      defaultContent: ['#main-content > section.section.secondary-section .utility-text-align-center h2'],
    },
    {
      id: 'rc4',
      name: 'Style in every snapshot gallery',
      selector: '#main-content > section.section:nth-of-type(3)',
      style: null,
      blocks: ['cards-gallery'],
      defaultContent: ['#main-content > section.section:nth-of-type(3) .utility-text-align-center h2', '#main-content > section.section:nth-of-type(3) .utility-text-align-center p'],
    },
    {
      id: 'rc5',
      name: 'Accent CTA band',
      selector: '#main-content > section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['#main-content > section.section.accent-section h2', '#main-content > section.section.accent-section p', '#main-content > section.section.accent-section a'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
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
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block, skipping any element already detached by a prior parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
