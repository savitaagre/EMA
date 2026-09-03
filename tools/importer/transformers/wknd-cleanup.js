/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND (wknd.site) site-wide cleanup.
 *
 * Removes non-authorable AEM Sites chrome so the import contains only
 * page-level authorable content (hero carousel, teasers, image-lists,
 * titles, buttons). Every selector below was verified against
 * migration-work/cleaned.html — none are guessed.
 *
 * Site: https://wknd.site/us/en.html (Adobe AEM Sites WKND demo).
 * NOTE: distinct from the wknd-trendsetters-*.js transformers (different site).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome, delivered as AEM experience fragments.
    // cleaned.html line 5:   <header class="experiencefragment cmp-experiencefragment--header ...">
    //   (contains sign-in buttons, language navigation, main navigation, search)
    // cleaned.html line 471: <footer class="experiencefragment cmp-experiencefragment--footer ...">
    //   (contains logo, footer navigation, social buttons, copyright text)
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
    ]);

    // Non-authorable navigation scaffolding rendered outside the XF header.
    // cleaned.html line 568: <div id="toggleNav"> ... mobile nav hamburger toggle
    // cleaned.html line 574: <div id="mobileNav" class="cmp-navigation--mobile"> ... mobile nav menu
    WebImporter.DOMUtils.remove(element, [
      '#toggleNav',
      '#mobileNav',
    ]);

    // Breadcrumb navigation — non-authorable site chrome, present on the
    // magazine article template (not on the home page). Removing the wrapper
    // GridColumn div takes the whole breadcrumb out cleanly.
    // magazine cleaned.html line 170: <div class="breadcrumb aem-GridColumn ...">
    //   containing <nav class="cmp-breadcrumb"> ... Magazine / Arctic Surfing
    WebImporter.DOMUtils.remove(element, [
      'div.breadcrumb',
      'nav.cmp-breadcrumb',
    ]);

    // Analytics / ID-syncing iframe injected by the site shell (not authorable).
    // cleaned.html line 566: <iframe id="destination_publishing_iframe_wkndsite_0" src="https://wkndsite.demdex.net/...">
    WebImporter.DOMUtils.remove(element, [
      '#destination_publishing_iframe_wkndsite_0',
      'iframe',
    ]);

    // Empty <meta> placeholders emitted by the Core Component image renderer,
    // one inside each cmp-image (e.g. cleaned.html lines 183, 204, 227, 271, 334, 378).
    // Not authorable content; strip so they don't leak into extracted image cells.
    WebImporter.DOMUtils.remove(element, [
      '.cmp-image > meta',
      '.cmp-image meta',
    ]);
  }
}
