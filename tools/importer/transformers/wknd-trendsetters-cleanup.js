/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html for the wknd-trendsetters source site.
 *
 * Verified template-agnostic across both source templates:
 *   - fashion-trends-of-the-season
 *   - magazine-article (/magazine/article-1)
 * Both share identical global chrome: <a class="skip-link">, <div class="navbar">
 * (mega-menu header) and <footer class="footer inverse-footer">.
 * The masthead <div class="breadcrumbs"> in the article page is authorable content
 * of the columns-article block (see page-templates.json / page-structure.json) and
 * is intentionally NOT removed here. No cookie banners / modals / overlays exist in
 * either captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No modals/overlays/cookie banners present in captured DOM.
    // Skip-link and navbar are removed in afterTransform (non-authorable chrome).
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome found in cleaned.html:
    //   <a class="skip-link"> — accessibility skip link
    //   <div class="navbar"> — global header/nav with mega menu
    //   <footer class="footer inverse-footer"> — global footer
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer',
    ]);
  }
}
