# DealHound — Black Friday deal finder

A Black Friday deal finder with 40 real deals, every price read on 27 November 2026
(Black Friday itself), after this competition opened.

## What it is

- **40 deals** in 9 categories (TV, Laptop, Audio, Gaming, Smart home, Tablet & Wearable,
  Kitchen, Toys, Accessories), from Amazon, Best Buy, Walmart, Target and Dell.
- **Every deal carries**: product, store, sale price, usual price, discount %, a link to the
  store, when the price was checked (UTC) and where it was read.
- **An honest verdict on every deal**: TRUE LOW (lowest price ever recorded, with price
  history), STRONG (a big cut, clearly below the normal price), or ROUTINE (a real cut
  that repeats every Black Friday — Amazon's own devices at 50% off, every year).
  The verdict is shown, with the evidence for it, on every deal page.
- **A deal score, 1–5 stars**: TRUE LOW 5, STRONG at 40% off or more 4, STRONG below 40% 3,
  ROUTINE 2. The board sorts best deal first by default.
- **Working search and filters**: text search, category, store, verdict, minimum discount,
  and sorting by best deal, biggest % off, biggest saving ($), or lowest price.
- **Compare across stores**: 8 products priced at every store that sells them, so shoppers
  see who is actually cheapest (AirPods Pro 3, MacBook Air M5, AirPods Max 2, The Frame 65",
  Switch 2 bundle, Beats Studio Buds+, Galaxy S26 FE, LEGO Santa).

## How the prices were checked

No price, store or link was invented. Every sale price was read in a deals source that
names the store (Best Buy's own Black Friday release was read live; CNN Underscored,
MacRumors, DealNews, Slickdeals, 9to5Toys, BricksValue and others for the rest), and
cross-checked against a second independent source wherever one existed. Store links go
to the store — search for the exact product name there — except AirPods Pro 3, whose
direct product page (amazon.com/dp/B0FQFB8FMG) was confirmed.

Products that were deliberately left out, with the reason: PlayStation 5 (Sony cut no
console price this year), Xbox Series X (no console cut), AirPods 5 (not discounted),
carrier phone offers (monthly prices with trade-in, not a cash sale price).

## Run it

```
node serve.ts   # serves app/ at http://localhost:8080
```

Static files under `app/` only; no build step, no network request at runtime.

## Screenshots

Three screenshots of the running site live in `screenshots/`:

- `1-deals.jpg` — the board at 1280×800: hero, filters, and the top deals.
- `2-deal.jpg` — one deal page (Dyson V9) at 1280×800, with its verdict evidence.
- `3-deal-phone.jpg` — one deal page (AirPods Pro 3) at 390×844, the phone layout.

They were taken with a headless browser against the local server, after waiting for
`window.__shotReady`, and each is under the 256 KiB cap.
