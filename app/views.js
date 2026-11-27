// HTML for each page, built from the deal data. Every value is escaped before it goes into the page.
// DealHound's own look: a dark header with an amber price tag, deal cards with a 1-5 score badge and a
// verdict ribbon, and a compare table that puts the same product's price at every store side by side.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const day = (iso) =>
  new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
const verdictClass = (v) => v.toLowerCase().replace(/ /g, '-');

export const CATEGORIES = ["TV", "Laptop", "Audio", "Gaming", "Smart home", "Tablet & Wearable", "Kitchen", "Toys", "Accessories"];
export const STORES = ["Amazon", "Best Buy", "Walmart", "Target", "Dell"];

export function applyFilters(deals, f) {
  const q = (f.q || '').trim().toLowerCase();
  let out = deals.filter(
    (d) =>
      (q === '' || `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) &&
      (f.category === 'all' || d.category === f.category) &&
      (f.store === 'all' || d.store === f.store) &&
      (f.verdict === 'all' || d.verdict === f.verdict) &&
      percentOff(d) >= (f.minOff || 0),
  );
  const sort = f.sort || 'score';
  out = [...out];
  if (sort === 'score') out.sort((a, b) => b.score - a.score || percentOff(b) - percentOff(a));
  else if (sort === 'off') out.sort((a, b) => percentOff(b) - percentOff(a));
  else if (sort === 'saving') out.sort((a, b) => saved(b) - saved(a));
  else if (sort === 'price') out.sort((a, b) => a.price - b.price);
  return out;
}

export function card(d) {
  return `<article class="card">
  <div class="card-top">
    <span class="score" title="Deal score ${d.score} of 5">${'★'.repeat(d.score)}<span class="dim">${'★'.repeat(5 - d.score)}</span></span>
    <span class="verdict ${verdictClass(d.verdict)}">${escape(d.verdict)}</span>
  </div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="price">${usd(d.price)} <s>${usd(d.was)}</s> <b>${percentOff(d)}% off</b></p>
  <p class="save">You save ${usd(saved(d))}</p>
  <p class="checked">Checked ${day(d.checked)}</p>
</article>`;
}

export function rows(deals) {
  if (deals.length === 0) return '<p class="empty">No deal matches those filters. Loosen one and try again.</p>';
  return `<div class="grid">${deals.map(card).join('')}</div>`;
}

export function filters(f) {
  const opt = (v, label, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${label}</option>`;
  return `<form class="filters" id="filters">
  <label>Search <input type="search" name="q" value="${escape(f.q || '')}" placeholder="Product, store, category&hellip;"></label>
  <label>Category <select name="category"><option value="all">All categories</option>${CATEGORIES.map((c) => opt(c, c, f.category)).join('')}</select></label>
  <label>Store <select name="store"><option value="all">All stores</option>${STORES.map((s) => opt(s, s, f.store)).join('')}</select></label>
  <label>Verdict <select name="verdict"><option value="all">Any verdict</option>${['TRUE LOW', 'STRONG', 'ROUTINE'].map((v) => opt(v, v, f.verdict)).join('')}</select></label>
  <label>Min. discount <select name="minOff">${[0, 20, 40, 50].map((n) => opt(String(n), n === 0 ? 'Any' : `${n}% off or more`, String(f.minOff || 0))).join('')}</select></label>
  <label>Sort <select name="sort">${opt('score', 'Best deal first', f.sort)}${opt('off', 'Biggest % off', f.sort)}${opt('saving', 'Biggest saving ($)', f.sort)}${opt('price', 'Lowest price', f.sort)}</select></label>
</form>`;
}

export function list(deals, f, count) {
  const trueLows = deals.filter((d) => d.verdict === 'TRUE LOW').length;
  return `<section class="hero">
  <h1>Black Friday, checked deal by deal.</h1>
  <p>40 real deals, every price read on 27 November 2026 after this contest opened. Each one carries its store, its usual price, when it was checked and where it was read — plus an honest verdict: a true low, a strong price, or a routine sale that repeats every year.</p>
  <p class="stats"><b>${count} deals</b> &middot; <b>${trueLows} true lows</b> &middot; checked 27 Nov 2026 &middot; <a href="#/compare">compare the same product across stores</a></p>
</section>
${filters(f)}
<p class="count" id="count"></p>
<div id="results">${rows(deals)}</div>`;
}

export function deal(d, all) {
  const same = all.filter((x) => x.category === d.category && x.id !== d.id).sort((a, b) => b.score - a.score).slice(0, 3);
  return `<p><a href="#/">&larr; All deals</a> &middot; <a href="#/compare">Compare across stores</a></p>
<article class="detail">
  <div class="card-top">
    <span class="score" title="Deal score ${d.score} of 5">${'★'.repeat(d.score)}<span class="dim">${'★'.repeat(5 - d.score)}</span></span>
    <span class="verdict ${verdictClass(d.verdict)}">${escape(d.verdict)}</span>
  </div>
  <h1>${escape(d.title)}</h1>
  <p class="price big">${usd(d.price)} <s>${usd(d.was)}</s> <b>${percentOff(d)}% off — you save ${usd(saved(d))}</b></p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Deal score</dt><dd>${d.score} of 5 — ${d.verdict === 'TRUE LOW' ? 'the lowest price ever recorded for this product' : d.verdict === 'STRONG' ? 'a big cut, clearly below the normal price' : 'a real cut that repeats every Black Friday'}</dd>
    <dt>Why this verdict</dt><dd>${escape(d.evidence)}</dd>
    <dt>Price checked</dt><dd>${day(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="button" href="${escape(d.url)}" rel="noopener">Find it at ${escape(d.store)} &rarr;</a></p>
  <p class="note">The link goes to ${escape(d.store)} — search for the exact product name there. Prices move on Black Friday; the price above is the one read at the check time shown.</p>
</article>
${same.length ? `<section class="more"><h2>More ${escape(d.category)} deals</h2><div class="grid">${same.map(card).join('')}</div></section>` : ''}`;
}

export function compare(comparisons) {
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>Same product, every store.</h1>
<p>Eight products priced at more than one store on 27 November 2026, so you can see who is actually cheapest instead of trusting one store's crossed-out price.</p>
${comparisons
  .map(
    (c) => `<section class="compare">
  <h2>${escape(c.title)}</h2>
  <table>
    <thead><tr><th>Store</th><th>Price</th><th></th></tr></thead>
    <tbody>${c.rows
      .map(
        (r) =>
          `<tr${r.price !== null && c.rows.filter((x) => x.price !== null).every((x) => r.price <= x.price) ? ' class="cheapest"' : ''}><td>${escape(r.store)}</td><td>${r.price === null ? '—' : usd(r.price)}</td><td>${r.note ? escape(r.note) : r.price !== null && c.rows.filter((x) => x.price !== null).every((x) => r.price <= x.price) ? 'Cheapest' : ''}</td></tr>`,
      )
      .join('')}</tbody>
  </table>
  <p class="cheapest-line">Cheapest: <b>${escape(c.cheapest)}</b> &middot; Source: ${escape(c.source)}</p>
</section>`,
  )
  .join('')}`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
