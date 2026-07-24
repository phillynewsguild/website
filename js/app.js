/* NewsGuild of Greater Philadelphia — Fair Contract Campaign
   Site behavior: contact-email assembly + privacy modal.
   (Dev preview toolbar removed for production.) */

// AN petition form — "Not in the US?" toggles the country dropdown. AN's own
// markup ships this pre-wired to their bundled CSS/JS ("hide" class + their
// own click handler), neither of which loads on the no-styles embed, so we
// supply the toggle ourselves.
document.addEventListener('click', function (e) {
  var link = e.target.closest && e.target.closest('.international_link');
  if (!link) return;
  e.preventDefault();
  var wrap = link.closest('.international_link-wrap');
  var drop = wrap && wrap.nextElementSibling;
  if (drop && drop.classList.contains('country_drop_wrap')) {
    drop.classList.toggle('is-shown');
  }
});

// Assemble the contact email client-side to reduce scraping by bots.
(function () {
  var user = 'phillynewsguild';
  var domain = 'gmail' + '.' + 'com';
  var addr = user + '@' + domain;

  var contact = document.getElementById('contact-email-link');
  if (contact) { contact.href = 'mailto:' + addr; contact.textContent = addr; }

  var privacy = document.getElementById('privacy-contact-link');
  if (privacy) { privacy.href = 'mailto:' + addr; privacy.textContent = addr; privacy.style.display = ''; }

  var press = document.getElementById('press-email-link');
  if (press) { press.href = 'mailto:' + addr + '?subject=Press%20Inquiry%20%E2%80%94%20Interview%20Request'; }
})();

// Privacy modal (opened from inline onclick handlers, so these stay global).
function openPrivacy() {
  var m = document.getElementById('privacy-modal');
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePrivacy() {
  var m = document.getElementById('privacy-modal');
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
}
(function () {
  var m = document.getElementById('privacy-modal');
  if (m) {
    m.addEventListener('click', function (e) { if (e.target === this) closePrivacy(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePrivacy();
  });
})();

// Copy-link share button — updates the label span, not the whole button (keeps the icon).
function copyShareLink(btn) {
  var url = 'https://phillynewsguild.com/';
  var label = btn.querySelector('.share-label');
  var restore = label ? label.textContent : '';
  var done = function () { if (label) { label.textContent = 'Copied!'; setTimeout(function () { label.textContent = restore; }, 2000); } };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done).catch(function () {});
  }
}

// Dismissible notification bar — remembers dismissal across visits.
function dismissNotice() {
  var bar = document.getElementById('notice-bar');
  if (bar) bar.classList.add('is-dismissed');
  try { localStorage.setItem('ng-notice-dismissed', '1'); } catch (e) {}
}
(function () {
  var bar = document.getElementById('notice-bar');
  if (!bar) return;
  try { if (localStorage.getItem('ng-notice-dismissed') === '1') bar.classList.add('is-dismissed'); } catch (e) {}
})();

// ── Signature count — THE ONLY NUMBER TO EDIT. Update SIGNATURE_COUNT (and
// SIGNATURE_GOAL, if it ever changes) as new signatures come in; the hero
// text, the counter, and the progress bar all sync from these two lines.
// No live count: the Action Network API is partner-only — DECIDED 2026-07-13.
var SIGNATURE_COUNT = 586;
var SIGNATURE_GOAL = 800;

// Sync every dependent element to the numbers above. Runs immediately (not
// just on scroll) so the fallback for reduced-motion / no-JS-observer users
// is always correct, not just the animated version.
(function () {
  document.querySelectorAll('.count-up[data-target]').forEach(function (el) {
    el.setAttribute('data-target', SIGNATURE_COUNT);
    el.textContent = SIGNATURE_COUNT;
  });
  var goalLabel = document.querySelector('.progress-goals span:last-child');
  if (goalLabel) goalLabel.textContent = 'Goal: ' + SIGNATURE_GOAL;
  var fill = document.querySelector('.progress-fill');
  if (fill) fill.style.width = Math.min(100, (SIGNATURE_COUNT / SIGNATURE_GOAL) * 100) + '%';
})();

// Signature counters — count up on scroll-into-view. Purely cosmetic;
// the sync step above already guarantees the right number is on screen.
(function () {
  var els = document.querySelectorAll('.count-up[data-target]');
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // static number from the sync step above is the fallback
  function animate(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();
