// Footer block — content-driven.
// Reads content/footer.plain.html (flat sections) and builds the footer:
// a brand + social block and three link columns.

// Social icon SVGs, keyed by label. Inline (fill=currentColor) to match source.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M16,8.048a8,8,0,1,0-9.25,7.9V10.36H4.719V8.048H6.75V6.285A2.822,2.822,0,0,1,9.771,3.173a12.2,12.2,0,0,1,1.791.156V5.3H10.554a1.155,1.155,0,0,0-1.3,1.25v1.5h2.219l-.355,2.312H9.25v5.591A8,8,0,0,0,16,8.048Z" fill="currentColor"/></svg>',
  instagram: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8,1.441c2.136,0,2.389.009,3.233.047a4.419,4.419,0,0,1,1.485.276,2.472,2.472,0,0,1,.92.6,2.472,2.472,0,0,1,.6.92,4.419,4.419,0,0,1,.276,1.485c.038.844.047,1.1.047,3.233s-.009,2.389-.047,3.233a4.419,4.419,0,0,1-.276,1.485,2.644,2.644,0,0,1-1.518,1.518,4.419,4.419,0,0,1-1.485.276c-.844.038-1.1.047-3.233.047s-2.389-.009-3.233-.047a4.419,4.419,0,0,1-1.485-.276,2.472,2.472,0,0,1-.92-.6,2.472,2.472,0,0,1-.6-.92,4.419,4.419,0,0,1-.276-1.485c-.038-.844-.047-1.1-.047-3.233s.009-2.389.047-3.233a4.419,4.419,0,0,1,.276-1.485,2.472,2.472,0,0,1,.6-.92,2.472,2.472,0,0,1,.92-.6,4.419,4.419,0,0,1,1.485-.276c.844-.038,1.1-.047,3.233-.047M8,0C5.827,0,5.555.009,4.7.048A5.868,5.868,0,0,0,2.76.42a3.908,3.908,0,0,0-1.417.923A3.908,3.908,0,0,0,.42,2.76,5.868,5.868,0,0,0,.048,4.7C.009,5.555,0,5.827,0,8s.009,2.445.048,3.3A5.868,5.868,0,0,0,.42,13.24a3.908,3.908,0,0,0,.923,1.417,3.908,3.908,0,0,0,1.417.923,5.868,5.868,0,0,0,1.942.372C5.555,15.991,5.827,16,8,16s2.445-.009,3.3-.048a5.868,5.868,0,0,0,1.942-.372,4.094,4.094,0,0,0,2.34-2.34,5.868,5.868,0,0,0,.372-1.942c.039-.853.048-1.125.048-3.3s-.009-2.445-.048-3.3A5.868,5.868,0,0,0,15.58,2.76a3.908,3.908,0,0,0-.923-1.417A3.908,3.908,0,0,0,13.24.42,5.868,5.868,0,0,0,11.3.048C10.445.009,10.173,0,8,0Z" fill="currentColor"/><path d="M8,3.892A4.108,4.108,0,1,0,12.108,8,4.108,4.108,0,0,0,8,3.892Zm0,6.775A2.667,2.667,0,1,1,10.667,8,2.667,2.667,0,0,1,8,10.667Z" fill="currentColor"/><circle cx="12.27" cy="3.73" r="0.96" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.3723 1.16992H14.6895L9.6272 6.95576L15.5825 14.829H10.9196L7.26734 10.0539L3.08837 14.829H0.769833L6.18442 8.64037L0.471436 1.16992H5.2528L8.55409 5.53451L12.3723 1.16992ZM11.5591 13.4421H12.843L4.55514 2.48399H3.17733L11.5591 13.4421Z" fill="currentColor"/></svg>',
  linkedin: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7 C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4 C4.9,4.3,4.3,5,3.6,5z M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2 c2.4,0,2.8,1.6,2.8,3.6V13.6z"/></svg>',
  youtube: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M15.8,4.8c-0.2-1.3-0.8-2.2-2.2-2.4C11.4,2,8,2,8,2S4.6,2,2.4,2.4C1,2.6,0.3,3.5,0.2,4.8C0,6.1,0,8,0,8 s0,1.9,0.2,3.2c0.2,1.3,0.8,2.2,2.2,2.4C4.6,14,8,14,8,14s3.4,0,5.6-0.4c1.4-0.3,2-1.1,2.2-2.4C16,9.9,16,8,16,8S16,6.1,15.8,4.8z M6,11V5l5,3L6,11z" fill="currentColor"/></svg>',
};

const BRAND_ICON = '<svg viewBox="0 0 33 33" aria-hidden="true"><path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"></path></svg>';

/**
 * Fetch the footer fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body;
}

function buildBrand(section) {
  const link = section.querySelector('a');
  const brand = document.createElement('a');
  brand.className = 'footer-brand';
  brand.href = link ? link.getAttribute('href') : '/';
  brand.innerHTML = `<span class="footer-brand-icon" aria-hidden="true">${BRAND_ICON}</span>`
    + `<span class="footer-brand-text">${link ? link.textContent.trim() : 'Fashion Blog'}</span>`;
  return brand;
}

function buildSocial(section) {
  const ul = document.createElement('ul');
  ul.className = 'footer-social';
  [...section.querySelectorAll('li > a')].forEach((a) => {
    const label = a.textContent.trim();
    const key = label.toLowerCase();
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.setAttribute('aria-label', label);
    link.innerHTML = SOCIAL_ICONS[key] || label;
    li.append(link);
    ul.append(li);
  });
  return ul;
}

function buildLinkColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-col';
  const h = section.querySelector(':scope > h2');
  if (h) {
    const heading = document.createElement('h2');
    heading.className = 'footer-col-heading';
    heading.textContent = h.textContent.trim();
    col.append(heading);
  }
  const ul = document.createElement('ul');
  ul.className = 'footer-col-links';
  [...section.querySelectorAll(':scope > ul > li > a')].forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    li.append(link);
    ul.append(li);
  });
  col.append(ul);
  return col;
}

export default async function decorate(block) {
  const body = await fetchFooterFragment();
  if (!body) return;

  const sections = [...body.children].filter((el) => el.tagName === 'DIV');
  // Section 0 = brand, section 1 = social, sections 2..n = link columns
  const brandSection = sections[0];
  const socialSection = sections[1];
  const columnSections = sections.slice(2);

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  const brandBlock = document.createElement('div');
  brandBlock.className = 'footer-brand-block';
  if (brandSection) brandBlock.append(buildBrand(brandSection));
  if (socialSection) brandBlock.append(buildSocial(socialSection));
  footer.append(brandBlock);

  columnSections.forEach((section) => footer.append(buildLinkColumn(section)));

  block.textContent = '';
  block.append(footer);
}
