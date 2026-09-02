/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + Section Metadata.
 * Uses payload.template.sections (DOM-verified selectors from page analysis).
 * Breaks inserted in beforeTransform (while every section element still exists,
 * before parsers replace them); metadata inserted in afterTransform, anchored to
 * a marker <hr> that survives parser replacement.
 *
 * Template-agnostic: works for any template whose page-templates.json entry
 * carries a `sections` array. Verified against both source templates:
 *   - fashion-trends-of-the-season (5 sections: secondary/null/secondary/null/accent)
 *   - magazine-article (/magazine/article-1, 7 sections per page-structure.json:
 *       rc1 hero=secondary, rc2 masthead=null, rc3 gallery=secondary,
 *       rc4 testimonials=null, rc5 latest articles=secondary, rc6 faq=null,
 *       rc7 closing banner=inverse). Section styles (incl. "inverse") are read
 *       straight from section.style, so no per-template code change is needed.
 * NOTE: the magazine-article entry in page-templates.json currently has no
 * `sections` array; block-mapping-manager must populate it (see agent report)
 * or this transformer emits nothing for that page at import time.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break needed
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run and may have replaced section elements. Anchor each styled
    // section's Section Metadata block to whichever still exists: the marker <hr>
    // placed above, or (first section, no marker) the original element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
