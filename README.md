# Fiorillo Tech Website

Simple static website for Fiorillo Tech.

This version is designed for GitHub Pages and Formspree:

- No framework
- No build step
- No npm dependencies
- Plain HTML and CSS
- Formspree-ready contact form

## Local Preview

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Formspree Setup

In `contact.html`, replace:

```html
https://formspree.io/f/YOUR_FORM_ID
```

with the real Formspree endpoint.

The form redirects to:

```html
https://fiorillotech.com/thanks.html
```

after a successful submission.

## GitHub Pages

The `CNAME` file is set to:

```text
fiorillotech.com
```

For GitHub Pages, publish from the repository root. Keep `.nojekyll`.

## Still Needed

- Real Formspree endpoint
- Real phone/email if you want them displayed on the site
- Owner names and real photo
- Final pricing language
- GitHub Pages DNS setup
