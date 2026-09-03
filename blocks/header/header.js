// Header / navigation block — content-driven (WKND).
// Reads content/nav.plain.html (flat sections) and builds a 2-row header:
// utility bar (sign-in + locale dropdown) + main bar (logo, nav, search).

const DESKTOP_MQ = window.matchMedia('(min-width: 900px)');

/** Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS). */
async function fetchNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html').body;
}

function buildUtility(section) {
  const util = document.createElement('div');
  util.className = 'nav-utility';

  // Sign-in link = first standalone <p><a>
  const signIn = section.querySelector(':scope > p > a');
  if (signIn) {
    const a = document.createElement('a');
    a.className = 'nav-signin';
    a.href = signIn.getAttribute('href');
    a.textContent = signIn.textContent.trim();
    util.append(a);
  }

  // Locale selector: <h2> current label + <ul> of locale links
  const label = section.querySelector(':scope > h2');
  const list = section.querySelector(':scope > ul');
  if (label && list) {
    const locale = document.createElement('div');
    locale.className = 'nav-locale';

    // Country code = the segment after the hyphen in a locale label (en-US → US).
    const countryOf = (text) => {
      const parts = text.trim().split('-');
      return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
    };

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-locale-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.textContent = label.textContent.trim();
    const triggerCC = countryOf(label.textContent);
    if (triggerCC) trigger.dataset.country = triggerCC;

    const menu = document.createElement('ul');
    menu.className = 'nav-locale-menu';
    [...list.querySelectorAll('li > a')].forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      const cc = countryOf(a.textContent);
      if (cc) link.dataset.country = cc;
      if (a.textContent.trim() === label.textContent.trim()) link.setAttribute('aria-current', 'true');
      li.append(link);
      menu.append(li);
    });

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      locale.classList.toggle('is-open', !open);
    });

    locale.append(trigger, menu);
    util.append(locale);
  }

  return util;
}

function buildBrand(section) {
  const link = section.querySelector('a');
  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  brand.href = link ? link.getAttribute('href') : '/';
  const img = link ? link.querySelector('img') : null;
  if (img) {
    const logo = document.createElement('img');
    logo.className = 'nav-brand-logo';
    // Fragment paths are relative to the nav file; normalize to site-absolute
    // so the logo resolves regardless of the current page path.
    const src = img.getAttribute('src');
    logo.src = /^(https?:)?\/\//.test(src) || src.startsWith('/') ? src : `/${src}`;
    logo.alt = img.getAttribute('alt') || 'WKND Logo';
    brand.append(logo);
  } else {
    brand.textContent = link ? link.textContent.trim() : 'WKND';
  }
  return brand;
}

function buildMainNav(section) {
  const nav = document.createElement('nav');
  nav.className = 'nav-main';
  nav.setAttribute('aria-label', 'Main navigation');
  const ul = document.createElement('ul');
  ul.className = 'nav-list';
  [...section.querySelectorAll(':scope > ul > li > a')].forEach((a) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    const link = document.createElement('a');
    link.className = 'nav-link';
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    li.append(link);
    ul.append(li);
  });
  nav.append(ul);
  return nav;
}

/** Search is a form control → built in JS, not in the fragment. */
const SEARCH_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.5 1a5.5 5.5 0 0 1 4.383 8.82l3.898 3.9-1.06 1.06-3.9-3.898A5.5 5.5 0 1 1 6.5 1Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" fill="currentColor"/></svg>';

function buildSearch() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');

  const icon = document.createElement('span');
  icon.className = 'nav-search-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = SEARCH_ICON;

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'nav-search-input';
  input.setAttribute('aria-label', 'Search');
  input.placeholder = 'Search';

  form.append(icon, input);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) window.location.href = `/us/en/search.html?q=${encodeURIComponent(q)}`;
  });
  return form;
}

export default async function decorate(block) {
  const body = await fetchNavFragment();
  if (!body) return;

  const sections = [...body.children].filter((el) => el.tagName === 'DIV');
  const [utilitySection, brandSection, navSection] = sections;

  const nav = document.createElement('div');
  nav.className = 'nav-inner';
  nav.id = 'nav';

  // Row 1: utility bar
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility-bar';
  if (utilitySection) utilityBar.append(buildUtility(utilitySection));

  // Row 2: main bar
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';
  if (brandSection) mainBar.append(buildBrand(brandSection));

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  if (navSection) menu.append(buildMainNav(navSection));
  menu.append(buildSearch());

  mainBar.append(menu, hamburger);
  nav.append(utilityBar, mainBar);

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

  // Close locale dropdown / mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.nav-locale.is-open').forEach((l) => {
        l.classList.remove('is-open');
        l.querySelector('.nav-locale-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Reset on breakpoint change
  DESKTOP_MQ.addEventListener('change', () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
}
