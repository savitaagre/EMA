/**
 * Hero block.
 *
 * Default hero: a background picture behind heading/content (styled in hero.css).
 * Video-background variant (`.hero.video`): an author supplies a link to a video
 * file (mp4/webm) — often as the first cell — and it renders as a muted, looping,
 * autoplaying, inline background video behind the content. A poster image, if
 * present as a <picture>, is used as the video poster and as a no-JS/failure
 * fallback.
 */
function isVideoHref(href) {
  return /\.(mp4|webm|ogv)(\?.*)?$/i.test(href || '');
}

function buildBackgroundVideo(block) {
  // Find the first anchor pointing at a video file.
  const videoLink = [...block.querySelectorAll('a')].find((a) => isVideoHref(a.href));
  if (!videoLink) return;

  const video = document.createElement('video');
  video.className = 'hero-video';
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;

  // Use an existing hero picture as the poster / fallback if present.
  const poster = block.querySelector('picture img');
  if (poster && poster.src) {
    video.setAttribute('poster', poster.src);
    // The poster is the LCP candidate for the video hero — prioritize it.
    poster.setAttribute('fetchpriority', 'high');
    poster.setAttribute('loading', 'eager');
  }

  const source = document.createElement('source');
  source.src = videoLink.href;
  const ext = (videoLink.href.split('.').pop() || '').toLowerCase().replace(/\?.*$/, '');
  if (ext === 'webm') source.type = 'video/webm';
  else if (ext === 'ogv') source.type = 'video/ogg';
  else source.type = 'video/mp4';
  video.append(source);

  // Remove the authored link wrapper (its paragraph too, if now empty).
  const p = videoLink.closest('p');
  videoLink.remove();
  if (p && !p.textContent.trim() && !p.querySelector('img, picture')) p.remove();

  block.prepend(video);

  // Respect reduced-motion: pause and show the poster instead of playing.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMotionPref = () => {
    if (reduce.matches) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
    }
  };
  applyMotionPref();
  reduce.addEventListener('change', applyMotionPref);
}

export default function decorate(block) {
  if (block.classList.contains('video')) {
    buildBackgroundVideo(block);
  }
}
