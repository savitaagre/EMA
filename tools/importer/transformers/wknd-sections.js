/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND (wknd.site) section breaks + section metadata.
 *
 * Data-driven — reads payload.template.sections from page-templates.json.
 * Inserts an <hr> before every non-first section and, for any section with a
 * `style`, appends a Section Metadata block. The WKND "home" template has 5
 * sections, all style:null, so this produces 4 <hr> breaks and 0 Section
 * Metadata blocks — but the logic is template-agnostic and handles styled
 * sections on other WKND templates too.
 *
 * Both-hook design (see generate-import-transformer.md): breaks are inserted in
 * beforeTransform while every section element still exists (parsers run between
 * hooks and replace section boundary elements). A temporary marker attribute on
 * the <hr> gives a stable anchor for metadata insertion in afterTransform.
 * Sections are processed in reverse so live-element inserts never shift the
 * positions of sections not yet processed.
 *
 * Site: https://wknd.site/us/en.html (Adobe AEM Sites WKND demo).
 * NOTE: distinct from wknd-trendsetters-sections.js (different site).
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

/**
 * Resolve a section boundary element. `section.selector` is a string on the
 * WKND "home" template, but on the "magazine" template page analysis emitted
 * an ARRAY of candidate selectors (primary + fallback). Try each in order and
 * return the first that matches, so we honor the intended priority instead of
 * relying on Array→String coercion (which builds a CSS selector *list* and
 * returns the first DOM match of any candidate, not the first candidate to hit).
 */
function findSectionEl(element, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (let s = 0; s < selectors.length; s += 1) {
    const found = element.querySelector(selectors[s]);
    if (found) return found;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = findSectionEl(element, section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess a replacement

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run and may have replaced section boundary elements. Anchor
    // each styled section's metadata to whichever anchor still exists.
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
