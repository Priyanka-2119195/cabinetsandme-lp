# Adding a New Landing Page — Cabinets & Me

## Project structure

```
cabinetsandme LP's/
├── shared/
│   ├── shared.css           ← common styles: tokens, nav, footer, forms, sticky bar
│   └── form.js              ← common JS: analytics, tracking, form logic, scroll reveal
├── lp-villa-owners/
│   └── index.html
├── lp-apartment-owners/
│   └── index.html
├── lp-<new-slug>/           ← new LP goes here
│   └── index.html
└── index.html               ← hub page (add a link here too)
```

Each folder becomes a clean URL on Vercel: `/lp-villa-owners`, `/lp-apartment-owners`, etc.

---

## Checklist — minimum required for every new LP

### 1. Create the folder and file

```
lp-<slug>/index.html
```

Use `lp-villa-owners/index.html` as the starting point. Replace content, keep structure.

---

### 2. Link the shared stylesheet in `<head>`

Place this **after the Google Fonts link**, before any page-specific `<style>` block:

```html
<link rel="stylesheet" href="/shared/shared.css">
```

This gives you the full design system for free — tokens, nav, glassmorphic header, press bar,
section utilities, form fields, buttons, sticky bar, toast, WhatsApp float, footer, and
responsive rules for all of the above. You only write page-specific CSS in your local `<style>`.

---

### 3. Load the shared script before `</body>`

```html
<script src="/shared/form.js"></script>
```

This gives you:
- **Meta Pixel** — fires `PageView` automatically on every LP
- **Google Analytics (GA4)** — fires on every LP, ID: `G-ETE07PL3RP`
- `sub()` — form submission + Google Sheets webhook
- `faq()` — accordion handler
- `validatePhoneNumber()` — Indian mobile validation
- Scroll reveal (IntersectionObserver on all `.r` elements)

**Do not** copy pixel or gtag code into page `<head>`. It's all handled here.

---

### 4. Add `name=""` attributes to every form input

Every `<input>`, `<select>`, or `<textarea>` that should land in the Sheet needs a `name` attribute.
Use snake_case. Standard names already used across LPs:

| Field | `name` value |
|---|---|
| Full name | `full_name` |
| Phone | `phone_number` |
| Email | `email` |
| What to design | `what_are_you_looking_to_design` |
| Budget | `budget` |
| Timeline | `timeline` |
| Apartment type | `apartment_type` |
| Villa size | `villa_size` |
| Project stage | `project_stage` |

---

### 5. Add a hidden `form_name` input inside every `<form>`

This is how the Google Sheet tells submissions apart.

```html
<form id="hform" onsubmit="sub(event,'hform')">
  <input type="hidden" name="form_name" value="[LP Label] - Hero Form">
  ...
</form>

<form id="mform" onsubmit="sub(event,'mform')">
  <input type="hidden" name="form_name" value="[LP Label] - Mid Form">
  ...
</form>
```

Examples:
- `"Villa Owners LP - Hero Form"`
- `"Apartment Owners LP - Mid Form"`
- `"Commercial LP - Hero Form"`

---

### 6. Keep only page-specific JS in the local `<script>` block

```html
<script src="/shared/form.js"></script>
<script>
// Nav scroll + sticky bar
const navEl = document.getElementById('nav'), stickEl = document.getElementById('stick');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', scrollY > 60);
  stickEl.classList.toggle('on', scrollY > innerHeight * .65);
});
// Any other page-specific behaviour (gallery drag, mobile menu, etc.)
</script>
```

Do **not** re-define `WEBHOOK_URL`, `sub`, `faq`, `collectFormData`, `validatePhoneNumber`,
`gtag`, `fbq`, or the scroll reveal observer — those will conflict with the shared file.

---

### 7. Update the hub page

Open `/index.html` and add a link to the new LP:

```html
<a href="/lp-<slug>">New LP Name</a>
```

---

## What shared.css provides (don't rewrite these)

| Component | Classes / IDs |
|---|---|
| Design tokens | `:root` CSS variables |
| Reset | `*`, `html`, `body`, `img`, `a` |
| Scroll reveal | `.r`, `.r.in`, `.d1`–`.d5` |
| Nav (glassmorphic) | `nav`, `nav.scrolled`, `.nav-logo`, `.nav-links`, `.nav-cta`, `.mob-btn` |
| Press bar | `#press`, `.press-label`, `.press-div`, `.press-logos` |
| Section utilities | `.sec`, `.sec-inner`, `.sec-eyebrow`, `.sec-h2`, `.sec-lead`, `.gold-line`, `.sec-divider` |
| Form fields | `.field`, `.field label`, `.field input/select`, `.submit-btn`, `.form-eyebrow`, `.form-heading`, `.form-note`, `.field-error` |
| Buttons | `.btn`, `.btn-white`, `.btn-outline` |
| Scarcity strip | `#scarcity`, `.scarcity-text` |
| Sticky bar (glassmorphic) | `#stick`, `#stick.on`, `.stick-text`, `.stick-right`, `.stick-phone`, `.stick-cta` |
| Toast | `#toast`, `#toast.on` |
| WhatsApp float | `#wa-float` |
| Footer | `footer`, `.foot-grid`, `.foot-logo`, `.foot-tagline`, `.foot-label`, `.foot-links`, `.foot-bottom`, `.foot-copy`, `.foot-certs`, `.fcert` |
| Responsive (all above) | `@media(max-width:1080px/480px/360px)` |

---

## Minimal new LP boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Title | Cabinets & Me, Bengaluru</title>
<meta name="description" content="...">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/shared/shared.css">
<style>
/* Page-specific styles only */
</style>
</head>
<body>

<nav id="nav">
  <a href="#hero" class="nav-logo">
    <img src="https://static.wixstatic.com/media/e3b82d_5921d7d9eaaf4f6a97e1a12b94e8847c~mv2.png/v1/fill/w_214,h_58,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabinets-and-Me-logo-NO-Background.png" alt="Cabinets & Me">
  </a>
  <ul class="nav-links">
    <li><a href="#collections">Collections</a></li>
    <li><a href="#portfolio">Our Work</a></li>
    <li><a href="#faq">FAQs</a></li>
    <li><a href="#studio">Studio</a></li>
  </ul>
  <button class="nav-cta" onclick="document.getElementById('hero').scrollIntoView({behavior:'smooth'})">Consult Now</button>
  <button class="mob-btn" aria-label="Menu">
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M0 1h22M0 8h22M0 15h22" stroke="#094D57" stroke-width="1.5"/></svg>
  </button>
</nav>

<!-- Page sections here -->

<footer>
  <div class="foot-grid">
    <div>
      <img class="foot-logo" src="https://static.wixstatic.com/media/e3b82d_5921d7d9eaaf4f6a97e1a12b94e8847c~mv2.png/v1/fill/w_214,h_58,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabinets-and-Me-logo-NO-Background.png" alt="Cabinets & Me">
      <p class="foot-tagline">Bespoke luxury interiors for South India's most discerning homes. Scandinavian form. Italian colour. German precision.</p>
    </div>
    <div>
      <div class="foot-label">Studio</div>
      <ul class="foot-links">
        <li><a href="#">Kitchens</a></li>
        <li><a href="#">Wardrobes</a></li>
        <li><a href="#">Projects</a></li>
        <li><a href="#">Experience Centre</a></li>
      </ul>
    </div>
    <div>
      <div class="foot-label">Contact</div>
      <ul class="foot-links">
        <li><a href="tel:+919731100913">+91 97311 00913</a></li>
        <li><a href="mailto:info@cabinetsandme.com">info@cabinetsandme.com</a></li>
        <li><a href="#">No. 131, Jayanagar 4th Block, Bengaluru – 560011</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <span class="foot-copy">© 2026 Cabinets & Me. All rights reserved.</span>
    <div class="foot-certs"><span class="fcert">LGA Certified</span><span class="fcert">CATAS</span><span class="fcert">FSC</span></div>
  </div>
</footer>

<div id="stick">
  <div class="stick-text">Ready to begin your <span>interior legacy</span>?</div>
  <div class="stick-right">
    <a href="tel:+919731100913" class="stick-phone">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h3l1.5 3.5-1.5 1a7 7 0 003.5 3.5l1-1.5L13 10v3a1 1 0 01-1 1C5 14 0 9 0 3a1 1 0 011-1z" fill="currentColor"/></svg>
      +91 97311 00913
    </a>
    <button class="stick-cta" onclick="document.getElementById('hform').scrollIntoView({behavior:'smooth'})">Book Consultation</button>
  </div>
</div>
<div id="toast">Thank you — our design consultant will reach you within 24 hours.</div>

<a id="wa-float" href="https://wa.me/919731100913?text=Hi%20Cabinets%20%26%20Me!%20I'm%20interested%20in%20a%20consultation." target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.59 5.99L0 24l6.19-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zm-8.52 18.44c-1.79 0-3.54-.48-5.07-1.38l-.36-.22-3.68.96.99-3.59-.23-.37A9.94 9.94 0 012.06 12c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 017.03 2.91A9.87 9.87 0 0122 12c0 5.48-4.46 9.92-9.94 9.92zm5.45-7.44c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07a8.15 8.15 0 01-2.4-1.48 8.98 8.98 0 01-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52s-.67-1.61-.92-2.2c-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" fill="#FFFFFF"/></svg>
</a>

<script src="/shared/form.js"></script>
<script>
const navEl = document.getElementById('nav'), stickEl = document.getElementById('stick');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', scrollY > 60);
  stickEl.classList.toggle('on', scrollY > innerHeight * .65);
});
</script>
</body>
</html>
```

---

## Phone validation — two error styles supported

`shared/form.js` supports both patterns. Use whichever matches your preference:

**Style A — CSS class on parent (simpler):**
```html
<div class="field">
  <label>Phone *</label>
  <input type="tel" name="phone_number" required>
  <span class="field-error">Please enter a valid 10-digit Indian mobile number.</span>
</div>
```

**Style B — Error element with ID:**
```html
<div class="field">
  <label>Phone *</label>
  <input type="tel" name="phone_number" id="hform-phone" required>
  <div class="field-error" id="hform-phone-err">Please enter a valid 10-digit Indian mobile number.</div>
</div>
```
The input `id` must follow `<formId>-phone` — the shared script derives the error element ID as `<inputId>-err`.

---

## Analytics & Tracking

Both trackers live in `shared/form.js` — **never add them to page `<head>` manually**.

| Tracker | ID | Fires |
|---|---|---|
| Meta Pixel | `3344391675738369` | `PageView` on load, `Lead` on every form submit |
| Google Analytics GA4 | `G-ETE07PL3RP` | `page_view` on load |

To update an ID, change `PIXEL_ID` or `GTAG_ID` at the top of `shared/form.js` — all LPs update instantly.

---

## Google Sheets — what lands in the sheet

Every submission sends:
- All named form fields
- `form_name` — which LP and form it came from
- `id` — unique ID: `cnm_lp_<timestamp>`
- `created_time` — ISO 8601 timestamp

Webhook URL lives in `shared/form.js → const WEBHOOK_URL`. Change once, updates everywhere.

---

## Deploying to Vercel

Push / drag-drop the project folder. No config needed — Vercel serves each `lp-*/index.html`
at its clean slug automatically. All `/shared/` paths resolve correctly from any LP folder
because they are absolute paths from the domain root.
