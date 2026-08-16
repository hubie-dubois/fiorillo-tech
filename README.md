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

The contact form posts to:

```text
https://formspree.io/f/mnpaznpz
```

The form redirects to:

```text
https://fiorillotech.com/thanks.html
```

after a successful submission.

The form does not accept file uploads on the static site. If a customer wants
to send a screenshot, photo, or other file, the contact page directs them to
email:

```text
help@fiorillotech.com
```

The service selector uses checkboxes so customers can choose more than one
issue. `contact.js` requires at least one service selection and only shows the
TV mounting details when TV mounting or TV setup is selected.

## Turnstile Spam Protection

The contact form uses Cloudflare Turnstile with the public site key embedded in
`contact.html`.

In Cloudflare Turnstile, allow these hostnames:

```text
fiorillotech.com
www.fiorillotech.com
localhost
```

In Formspree, enable CAPTCHA or spam protection for the form, choose Cloudflare
Turnstile, and paste the matching Turnstile secret key there.

Never place the Turnstile secret key in this repository or in public HTML.

## GitHub Pages

The `CNAME` file is set to:

```text
fiorillotech.com
```

For GitHub Pages, publish from the repository root. Keep `.nojekyll`.

## Still Needed

- Real phone number if you want it displayed on the site
- Owner names and real photo
- Test a live Formspree submission after Turnstile is enabled in Formspree
