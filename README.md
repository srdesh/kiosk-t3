# OrderMonkey — Pan-Oston Full HD Kiosk

A static HTML, CSS, and vanilla JavaScript kiosk prototype based on the OrderMonkey Kiosk V2 Figma flow, adapted for a landscape **1920 × 1080** Pan-Oston touchscreen.

- **Stack:** HTML5, CSS, vanilla JavaScript
- **Build step:** None
- **Target display:** Full HD 16:9, with responsive fallback breakpoints
- **Deployment:** GitHub Pages via Actions

## Screens and flow

1. Idle / welcome
2. Dine-in or takeaway
3. Menu categories, search, dietary filters, product details
4. Item quick-view (add as-is or customise)
5. Seven-step burger builder — Bun, Patty, Sauce, Cheese, Veg, Meal, Review
6. Item added
7. Optional global upsell
8. Cart review, quantity editing, promo-code demo, optional tip
9. Payment-method choice
10. Thank-you screen and receipt options

The interactive prototype keeps cart and builder state locally in the browser. Payment is **simulated only**; no payment gateway, customer account, order API, receipt printer, or real-time kitchen system is connected.

## Run locally

Open `index.html` directly in a modern browser, or serve the folder over HTTP:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

The workflow at `.github/workflows/pages.yml` validates `script.js` and publishes the repository root when a commit is pushed to `main`.

If Pages has not been enabled for this repository, open **Settings → Pages** and select **GitHub Actions** as the source. Then check the **Actions** tab for the latest deployment run.

Expected URL: https://srdesh.github.io/kiosk-t3/

## Accessibility implementation notes

The prototype uses native buttons and inputs, visible focus indicators, explicit labels for icon controls, live announcements for major state updates, a labelled radio group for payment selection, selected-state text/indicators, and reduced-motion/high-contrast settings. These are a starting point, not a certification. Test the actual kiosk hardware with keyboard navigation, touch use, zoom, contrast checks, and screen readers before release.

## Content and launch caveats

Menu items, prices, allergens, promo codes, service estimates, and food illustrations are **illustrative demo content**. Verify all product descriptions, pricing, allergen data, translations, payment instructions, brand assets, timeout policy, and Pan-Oston hardware integration before production. Food illustrations are locally rendered with CSS because the Figma image URLs are temporary and were not accessible for a durable asset download in this environment.
