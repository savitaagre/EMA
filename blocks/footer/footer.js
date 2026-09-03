// Footer block — content-driven (WKND).
// Reads content/footer.plain.html (flat sections) and builds the footer:
// brand logo, footer nav, "Follow Us" + social icons, and copyright/legal block.

// Social icon SVGs, keyed by label. Inline (fill=currentColor) to match source.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M16,8.048a8,8,0,1,0-9.25,7.9V10.36H4.719V8.048H6.75V6.285A2.822,2.822,0,0,1,9.771,3.173a12.2,12.2,0,0,1,1.791.156V5.3H10.554a1.155,1.155,0,0,0-1.3,1.25v1.5h2.219l-.355,2.312H9.25v5.591A8,8,0,0,0,16,8.048Z" fill="currentColor"/></svg>',
  twitter: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.3723 1.16992H14.6895L9.6272 6.95576L15.5825 14.829H10.9196L7.26734 10.0539L3.08837 14.829H0.769833L6.18442 8.64037L0.471436 1.16992H5.2528L8.55409 5.53451L12.3723 1.16992ZM11.5591 13.4421H12.843L4.55514 2.48399H3.17733L11.5591 13.4421Z" fill="currentColor"/></svg>',
  instagram: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8,1.441c2.136,0,2.389.009,3.233.047a4.419,4.419,0,0,1,1.485.276,2.472,2.472,0,0,1,.92.6,2.472,2.472,0,0,1,.6.92,4.419,4.419,0,0,1,.276,1.485c.038.844.047,1.1.047,3.233s-.009,2.389-.047,3.233a4.419,4.419,0,0,1-.276,1.485,2.644,2.644,0,0,1-1.518,1.518,4.419,4.419,0,0,1-1.485.276c-.844.038-1.1.047-3.233.047s-2.389-.009-3.233-.047a4.419,4.419,0,0,1-1.485-.276,2.472,2.472,0,0,1-.92-.6,2.472,2.472,0,0,1-.6-.92,4.419,4.419,0,0,1-.276-1.485c-.038-.844-.047-1.1-.047-3.233s.009-2.389.047-3.233a4.419,4.419,0,0,1,.276-1.485,2.472,2.472,0,0,1,.6-.92,2.472,2.472,0,0,1,.92-.6,4.419,4.419,0,0,1,1.485-.276c.844-.038,1.1-.047,3.233-.047M8,0C5.827,0,5.555.009,4.7.048A5.868,5.868,0,0,0,2.76.42a3.908,3.908,0,0,0-1.417.923A3.908,3.908,0,0,0,.42,2.76,5.868,5.868,0,0,0,.048,4.7C.009,5.555,0,5.827,0,8s.009,2.445.048,3.3A5.868,5.868,0,0,0,.42,13.24a3.908,3.908,0,0,0,.923,1.417,3.908,3.908,0,0,0,1.417.923,5.868,5.868,0,0,0,1.942.372C5.555,15.991,5.827,16,8,16s2.445-.009,3.3-.048a5.868,5.868,0,0,0,1.942-.372,4.094,4.094,0,0,0,2.34-2.34,5.868,5.868,0,0,0,.372-1.942c.039-.853.048-1.125.048-3.3s-.009-2.445-.048-3.3A5.868,5.868,0,0,0,15.58,2.76a3.908,3.908,0,0,0-.923-1.417A3.908,3.908,0,0,0,13.24.42,5.868,5.868,0,0,0,11.3.048C10.445.009,10.173,0,8,0Z" fill="currentColor"/><path d="M8,3.892A4.108,4.108,0,1,0,12.108,8,4.108,4.108,0,0,0,8,3.892Zm0,6.775A2.667,2.667,0,1,1,10.667,8,2.667,2.667,0,0,1,8,10.667Z" fill="currentColor"/><circle cx="12.27" cy="3.73" r="0.96" fill="currentColor"/></svg>',
};

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

/** Normalize a fragment-relative src to a site-absolute path. */
function absolutize(src) {
  if (!src) return src;
  return /^(https?:)?\/\//.test(src) || src.startsWith('/') ? src : `/${src}`;
}

function buildBrand(section) {
  const link = section.querySelector('a');
  const brand = document.createElement('a');
  brand.className = 'footer-brand';
  brand.href = link ? link.getAttribute('href') : '/';
  const img = link ? link.querySelector('img') : null;
  if (img) {
    const logo = document.createElement('img');
    logo.className = 'footer-brand-logo';
    logo.src = absolutize(img.getAttribute('src'));
    logo.alt = img.getAttribute('alt') || 'WKND Logo';
    brand.append(logo);
  } else {
    brand.textContent = link ? link.textContent.trim() : 'WKND';
  }
  return brand;
}

function buildNav(section) {
  const nav = document.createElement('nav');
  nav.className = 'footer-nav';
  nav.setAttribute('aria-label', 'Footer navigation');
  const ul = document.createElement('ul');
  ul.className = 'footer-nav-links';
  [...section.querySelectorAll(':scope > ul > li > a')].forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    li.append(link);
    ul.append(li);
  });
  nav.append(ul);
  return nav;
}

function buildSocial(section) {
  const wrap = document.createElement('div');
  wrap.className = 'footer-social-block';
  const h = section.querySelector(':scope > h2');
  if (h) {
    const heading = document.createElement('h2');
    heading.className = 'footer-social-heading';
    heading.textContent = h.textContent.trim();
    wrap.append(heading);
  }
  const ul = document.createElement('ul');
  ul.className = 'footer-social';
  [...section.querySelectorAll(':scope > ul > li > a')].forEach((a) => {
    const label = a.textContent.trim();
    const key = label.toLowerCase();
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.setAttribute('aria-label', `${label} WKND`);
    link.innerHTML = SOCIAL_ICONS[key] || label;
    li.append(link);
    ul.append(li);
  });
  wrap.append(ul);
  return wrap;
}

function buildLegal(section) {
  const legal = document.createElement('div');
  legal.className = 'footer-legal';
  [...section.querySelectorAll(':scope > p')].forEach((p, i) => {
    const para = document.createElement('p');
    if (i === 0) para.className = 'footer-copyright';
    para.innerHTML = p.innerHTML;
    legal.append(para);
  });
  return legal;
}

export default async function decorate(block) {
  const body = await fetchFooterFragment();
  if (!body) return;

  const sections = [...body.children].filter((el) => el.tagName === 'DIV');
  // Section 0 = brand, 1 = footer nav, 2 = social, 3 = legal/copyright
  const [brandSection, navSection, socialSection, legalSection] = sections;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  const top = document.createElement('div');
  top.className = 'footer-top';
  if (brandSection) top.append(buildBrand(brandSection));
  if (navSection) top.append(buildNav(navSection));
  if (socialSection) top.append(buildSocial(socialSection));
  footer.append(top);

  if (legalSection) {
    const hr = document.createElement('hr');
    hr.className = 'footer-divider';
    footer.append(hr);
    footer.append(buildLegal(legalSection));
  }

  block.textContent = '';
  block.append(footer);
}
