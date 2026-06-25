/* ── cabinetsandme — shared LP script ────────────────────────
   Used by every landing page. To add a new LP:
     1. <script src="/shared/form.js"></script> before </body>
     2. Add name="" attrs + <input type="hidden" name="form_name" value="LP Name - Form Name"> to each form
     3. Keep only page-specific JS (nav scroll, etc.) in a local <script>
   ──────────────────────────────────────────────────────────── */

// ── Tracking IDs ─────────────────────────────────────────────
const PIXEL_ID = '3344391675738369';
const GTAG_ID  = 'G-ETE07PL3RP';

// ── Google Analytics (gtag.js) ───────────────────────────────
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', GTAG_ID);
(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
  document.head.appendChild(s);
})();

// ── Meta Pixel ───────────────────────────────────────────────
!function(f,b,e,v,n,t,s){
  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)
}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', PIXEL_ID);
fbq('track', 'PageView');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw2KUWCkm8ZG3KEzY2XM4ital76WQt9rgDqXMvPIrBWsQbrNGZEMHoVR8GZLAtooGAUKg/exec';

// ── Utilities ────────────────────────────────────────────────

function collectFormData(form) {
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.name && el.value !== '') data[el.name] = el.value;
  });
  return data;
}

// Indian mobile: strips +91 / 0091 / leading 0, spaces, dashes, parens
function validatePhoneNumber(raw) {
  let n = raw.replace(/[\s\-().]/g, '');
  if (n.startsWith('+91'))       n = n.slice(3);
  else if (n.startsWith('0091')) n = n.slice(4);
  else if (n.startsWith('91') && n.length === 12) n = n.slice(2);
  else if (n.startsWith('0'))    n = n.slice(1);
  return /^[6-9]\d{9}$/.test(n);
}

// ── FAQ accordion ────────────────────────────────────────────

function faq(btn) {
  const item = btn.closest('.faq-item'), isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(b => b.classList.remove('open'));
  if (!isOpen) { item.classList.add('open'); btn.classList.add('open'); }
}

// ── Form submission ──────────────────────────────────────────
// Works with both LP error styles:
//   Villa-style:     .field.phone-err (CSS shows the error span)
//   Apartment-style: #<inputId>-err element gets .show class

function sub(e, id) {
  e.preventDefault();
  const form = document.getElementById(id);
  const phoneInput = form.querySelector('input[type="tel"]');

  if (phoneInput) {
    const field  = phoneInput.closest('.field');
    const errEl  = document.getElementById(phoneInput.id + '-err');
    if (!validatePhoneNumber(phoneInput.value.trim())) {
      if (field)  field.classList.add('phone-err');
      if (errEl)  { errEl.classList.add('show'); phoneInput.classList.add('error'); }
      phoneInput.focus();
      return;
    }
    if (field)  field.classList.remove('phone-err');
    if (errEl)  { errEl.classList.remove('show'); phoneInput.classList.remove('error'); }
  }

  const btn = form.querySelector('.submit-btn');
  const origLabel = btn.textContent; // capture before overwriting — no per-page hardcoding
  btn.textContent = 'Sending…'; btn.disabled = true;
  if (typeof fbq !== 'undefined') fbq('track', 'Lead');

  const payload = collectFormData(form);
  payload.id = 'cnm_lp_' + Date.now();
  payload.created_time = new Date().toISOString();

  // no-cors: response is opaque, fire-and-forget
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(() => {});

  setTimeout(() => {
    btn.textContent = 'Submitted ✓'; btn.style.background = '#2e7d52';
    const t = document.getElementById('toast');
    if (t) { t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 5000); }
    setTimeout(() => {
      btn.textContent = origLabel; btn.style.background = ''; btn.disabled = false;
      form.reset();
      if (phoneInput) {
        const field = phoneInput.closest('.field');
        if (field) field.classList.remove('phone-err');
        phoneInput.classList.remove('error');
        const errEl = document.getElementById(phoneInput.id + '-err');
        if (errEl) errEl.classList.remove('show');
      }
    }, 3500);
  }, 900);
}

// ── Auto-init on DOM ready ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const io = new IntersectionObserver(
    e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }),
    { threshold: .1, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('.r').forEach(el => io.observe(el));
  setTimeout(() => document.querySelectorAll('#hero .r').forEach(el => el.classList.add('in')), 100);

  // Phone inputs: clear both error styles on any keystroke
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', () => {
      const field = inp.closest('.field');
      if (field) field.classList.remove('phone-err');
      inp.classList.remove('error');
      const errEl = document.getElementById(inp.id + '-err');
      if (errEl) errEl.classList.remove('show');
    });
  });
});
