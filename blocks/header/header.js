// Header / navigation block — content-driven.
// Reads content/nav.plain.html (flat sections) and builds a horizontal nav
// with hover megamenus/dropdowns for desktop and a slide-in drawer for mobile.

const DESKTOP_MQ = window.matchMedia('(min-width: 992px)');

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body;
}

/**
 * Classify top-level sections from the fragment.
 * - logo: first section (link to "/")
 * - subscribe: last section (CTA)
 * - menu items: sections in between, each led by an <h2> label
 */
function classifySections(body) {
  const sections = [...body.children].filter((el) => el.tagName === 'DIV');
  return {
    logoSection: sections[0],
    subscribeSection: sections[sections.length - 1],
    menuSections: sections.slice(1, -1),
  };
}

function buildLogo(section) {
  const link = section.querySelector('a');
  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  brand.href = link ? link.getAttribute('href') : '/';
  brand.innerHTML = `
    <span class="nav-brand-icon" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"></path>
      </svg>
    </span>
    <span class="nav-brand-text">${link ? link.textContent.trim() : 'Fashion Blog'}</span>`;
  return brand;
}

function buildSubscribe(section) {
  const link = section.querySelector('a');
  const cta = document.createElement('a');
  cta.className = 'nav-subscribe button';
  cta.href = link ? link.getAttribute('href') : '#';
  cta.textContent = link ? link.textContent.trim() : 'Subscribe';
  return cta;
}

/** A menu item is a plain link when it has no column headings and no link list. */
function isPlainLink(section) {
  const hasColumns = section.querySelector(':scope > h3');
  const listItems = section.querySelectorAll(':scope > ul > li').length;
  return !hasColumns && listItems === 0;
}

const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 4a12 12 0 1 0 12 12A12 12 0 0 0 16 4Zm0 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Z"/><circle cx="16" cy="16" r="4"/></svg>';

function buildMegaColumns(section, panel) {
  panel.classList.add('nav-panel-mega');
  [...section.querySelectorAll(':scope > h3')].forEach((h3) => {
    const col = document.createElement('div');
    col.className = 'nav-panel-col';
    const heading = document.createElement('h3');
    heading.textContent = h3.textContent.trim();
    col.append(heading);
    const list = h3.nextElementSibling;
    if (list && list.tagName === 'UL') {
      const ul = document.createElement('ul');
      [...list.querySelectorAll('li > a')].forEach((a) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'nav-mega-link';
        link.href = a.getAttribute('href');
        const strong = a.querySelector('strong');
        const title = strong ? strong.textContent.trim() : a.textContent.trim();
        const desc = strong ? a.textContent.replace(strong.textContent, '').trim() : '';
        link.innerHTML = `<span class="nav-mega-icon" aria-hidden="true">${ICON_SVG}</span>`
          + `<span class="nav-mega-text"><strong>${title}</strong> <span>${desc}</span></span>`;
        item.append(link);
        ul.append(item);
      });
      col.append(ul);
    }
    panel.append(col);
  });
  // Featured card = trailing <p><a> after the columns
  const featured = section.querySelector(':scope > p > a');
  if (featured) {
    const card = document.createElement('a');
    card.className = 'nav-panel-featured';
    card.href = featured.getAttribute('href');
    const strong = featured.querySelector('strong');
    const heading = strong ? strong.textContent.trim() : '';
    let rest = featured.textContent.replace(heading, '').trim();
    const cta = 'Discover';
    if (rest.endsWith(cta)) rest = rest.slice(0, -cta.length).trim();
    card.innerHTML = `<h3 class="nav-featured-title">${heading}</h3>`
      + `<span class="nav-featured-desc">${rest}</span>`
      + `<span class="nav-featured-cta">${cta}</span>`;
    panel.append(card);
  }
}

function buildSimpleColumn(section, panel) {
  panel.classList.add('nav-panel-simple');
  const ul = document.createElement('ul');
  [...section.querySelectorAll(':scope > ul > li > a')].forEach((a) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    item.append(link);
    ul.append(item);
  });
  panel.append(ul);
}

function closeAllDropdowns(scope) {
  if (!scope) return;
  scope.querySelectorAll('.nav-item-dropdown.is-open').forEach((item) => {
    item.classList.remove('is-open');
    const t = item.querySelector('.nav-dropdown-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

function buildMenuItem(section) {
  const li = document.createElement('li');
  li.className = 'nav-item';
  const label = section.querySelector(':scope > h2');
  const labelText = label ? label.textContent.trim() : '';

  if (isPlainLink(section)) {
    const link = section.querySelector('a');
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = link ? link.getAttribute('href') : '#';
    a.textContent = labelText;
    li.append(a);
    return li;
  }

  li.classList.add('nav-item-dropdown');
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-link nav-dropdown-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.innerHTML = `<span>${labelText}</span><span class="nav-caret" aria-hidden="true">`
    + '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 11 3 6h10z"/></svg></span>';

  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  if (section.querySelector(':scope > h3')) buildMegaColumns(section, panel);
  else buildSimpleColumn(section, panel);

  li.append(trigger, panel);

  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns(li.closest('.nav-menu'));
    trigger.setAttribute('aria-expanded', String(!open));
    li.classList.toggle('is-open', !open);
  });

  return li;
}

export default async function decorate(block) {
  const body = await fetchNavFragment();
  if (!body) return;

  const { logoSection, subscribeSection, menuSections } = classifySections(body);

  const nav = document.createElement('nav');
  nav.className = 'nav-inner';
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  nav.append(buildLogo(logoSection));

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  const ul = document.createElement('ul');
  ul.className = 'nav-list';
  menuSections.forEach((section) => ul.append(buildMenuItem(section)));
  menu.append(ul);
  menu.append(buildSubscribe(subscribeSection));

  nav.append(menu, hamburger);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.textContent = '';
  block.append(navWrapper);

  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('nav-open', !open);
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllDropdowns(menu);
  });

  DESKTOP_MQ.addEventListener('change', () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    closeAllDropdowns(menu);
  });
}
