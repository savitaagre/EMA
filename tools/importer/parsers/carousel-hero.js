/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-02
 *
 * Library structure (Carousel): 2 columns; first row = block name.
 *   Each subsequent row = one slide:
 *     Cell 1: Image (mandatory)
 *     Cell 2: Text content — title (heading), description, CTA link.
 *
 * Source: `.cmp-carousel__item` elements, each wrapping a
 * `.teaser.cmp-teaser--hero` with `.cmp-teaser__content` (title, description,
 * action link) and `.cmp-teaser__image` (img).
 */
export default function parse(element, { document }) {
  // Each carousel item is one slide.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  // Fallback: if no explicit items, treat each teaser as a slide.
  if (slides.length === 0) {
    slides = Array.from(element.querySelectorAll('.teaser, [class*="teaser"]'));
  }

  // Empty-block guard
  if (slides.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a[class*="action"]'));

    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    ctaLinks.forEach((cta) => textCell.push(cta));

    // Skip empty slides (navigation/indicator wrappers matched by fallback).
    if (!image && textCell.length === 0) return;

    cells.push([image || '', textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
