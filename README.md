# Fair Contract Now — phillynewsguild.com

Campaign site for the NewsGuild of Greater Philadelphia (CWA Local 38010), supporting the
union's contract campaign at The Philadelphia Inquirer. Static HTML/CSS/JS, hosted on GitHub
Pages at the custom domain **phillynewsguild.com**.

## Stack & structure

No build step, no framework, no package manager. Everything is hand-written and deploys as-is.

```
index.html          # the whole page — single file, all sections
css/styles.css       # all styles; :root (top of file) holds the 5-color palette + fonts
js/app.js            # all behavior — see "Signature counter" and "Notification bar" below
fonts/               # self-hosted webfonts (Redaction, Bebas Neue)
assets/              # logo, icons, social-share images, textures
favicon.svg / favicon-32.png / favicon-64.png / og.png / CNAME   # root-level, referenced directly by index.html
preview.html         # dev-only viewport tester (Desktop/Tablet/Mobile) — gitignored, never deployed
```

## Local preview

No build required — just serve the folder and open it:

```
python3 -m http.server
```

Then open `http://localhost:8000/preview.html` to check Desktop/Tablet/Mobile breakpoints side
by side, or `http://localhost:8000/index.html` directly.

## Deployment

Push to `main` → GitHub Pages rebuilds automatically, live in about a minute. No staging
environment, no CI. Repo **must stay public** on the current (Free) GitHub plan — GitHub Pages
with a custom domain is not available on private repos below GitHub Pro. See
`Settings → Pages` in this repo for the custom-domain / HTTPS status.

Custom domain is controlled by the `CNAME` file (contains exactly `phillynewsguild.com`) plus
DNS records at the registrar (4 apex A records to GitHub's Pages IPs, `www` CNAME to
`phillynewsguild.github.io`).

## Signature counter

**One number to edit, in `js/app.js`:**

```js
var SIGNATURE_COUNT = 1;
var SIGNATURE_GOAL = 400;
```

`SIGNATURE_COUNT` drives the hero line ("N supporters have signed"), the big number in the
petition box, and the progress bar — all three sync from this one variable on page load, so you
never need to touch `index.html` for a signature update. There's no live count: Action Network's
count API is partner-only, so this is a manual, once-a-day-ish update. Easiest path is editing
the file directly on github.com (pencil icon → edit → commit to `main`). Full step-by-step for
non-developers is in `COUNTER-UPDATE-GUIDE.md` (gitignored — internal only, not in this public
repo's history; ask Beth if you need a copy).

## Notification bar

The dismissible bar pinned to the top of the page (`#notice-bar` in `index.html`, just after
`<body>`):

```html
<div id="notice-bar">
  <a class="notice-bar__msg" href="#petition">Inquirer workers are fighting for a fair contract. <strong>Add your name &rarr;</strong></a>
  <button class="notice-bar__close" type="button" aria-label="Dismiss announcement" onclick="dismissNotice()">&#10005;</button>
</div>
```

To change the message, edit the text inside `.notice-bar__msg` directly — it's plain HTML, no
templating. Styling lives in `css/styles.css` under `#notice-bar`.

**Important caveat:** dismissal is remembered per-visitor via `localStorage` (`ng-notice-dismissed`,
set in `js/app.js`). If you change the message, anyone who already dismissed the *old* message
will still have it hidden — there's no version-stamping on the dismissal key. If a message change
is important enough that previously-dismissed visitors should see it again, you'll need to change
the localStorage key name in `js/app.js` (e.g. `ng-notice-dismissed-v2`) so it resets for
everyone.

## Petition thank-you page styling

The Action Network petition embed (`#petition` in `index.html`) injects its own markup after
signup, including the post-signature confirmation view — scoped by AN's own documented container
ID, `#can_thank_you`. AN doesn't publish stable class names for the individual sharing fields
(Direct Link / Email a Friend / Embed This Petition), so the corresponding block in
`css/styles.css` (just after `#logo_wrap`) targets that view by element type (heading level,
`input`, `textarea`) instead of guessed classes. Because that markup only renders client-side
after a real signature, verify any change there by signing the petition once after deploying —
don't rely on `preview.html`, which can't reproduce it.

## Brand / design system

Everything derives from `css/styles.css`'s `:root` block: 5 colors (ink, paper, bone, red, muted)
and 4 fonts (Redaction Display, Redaction, Archivo Narrow, Archivo). Don't introduce new colors or
fonts without checking with Beth — there's a one-page social media brand guide
(`NewsGuild-Social-Media-Brand-Guide.docx`) covering usage of the palette, type, and the logo/fist
marks for anyone producing social assets.

## Security notes

- A `Content-Security-Policy` meta tag lives in `index.html`'s `<head>`. If you add a new external
  script/font/embed, you must add its domain to the relevant CSP directive or it will be silently
  blocked by the browser — test locally with the console open after any CSP change.
- External links (share buttons, footer links) use `target="_blank" rel="noopener noreferrer"` —
  keep that pattern for any new outbound link.
- No secrets, API keys, or backend live in this repo — it's a fully static site, so there's
  nothing here that repo-privacy would meaningfully protect. Keep it public (see Deployment note
  above on why private breaks Pages on the Free plan).

## Annotating manual updates

Counter bumps, notice-bar copy changes, and other small content edits don't need a PR, but they
do need a commit message that says *what* changed and *why* well enough that someone reading
`git log` in six months understands it without guessing. Convention:

```
<type>: <what changed>

<why, if not obvious — e.g. "AN dashboard showed 210 as of 2026-07-20">
```

Where `<type>` is one of: `content` (counter, notice bar, copy), `fix` (bug), `feat` (new
section/behavior), `style` (CSS-only), `chore` (assets, cleanup). Example:

```
content: update signature counter to 210

AN dashboard confirmed 210 signatures as of 2026-07-20, up from 166.
```

This keeps manual, no-review edits traceable — anyone can `git blame` a number on the live site
and immediately see who changed it, to what, and on what basis.
