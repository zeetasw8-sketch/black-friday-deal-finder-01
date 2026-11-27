// DealHound: a Black Friday deal finder. The deals are in data.js, so the site needs no network to show
// them; each deal links out to its store.
//
//   #/            the board: search, filters by category/store/verdict/discount, sorting, deal scores
//   #/deal/<id>   one deal, with its verdict evidence and more deals in its category
//   #/compare     the same product priced at every store
//
// window.__shotReady is false while a page renders and true once it is on screen, so a screenshot script
// knows when to capture.

import { deals, comparisons } from './data.js';
import { applyFilters, compare, deal, list, missing, rows } from './views.js';

const app = document.getElementById('app');

const state = { q: '', category: 'all', store: 'all', verdict: 'all', minOff: 0, sort: 'score' };

function render() {
  window.__shotReady = false;
  const dealMatch = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Not found'} | DealHound`;
    app.innerHTML = found ? deal(found, deals) : missing();
  } else if (location.hash === '#/compare') {
    document.title = 'Compare across stores | DealHound';
    app.innerHTML = compare(comparisons);
  } else {
    document.title = 'DealHound — Black Friday deals, checked 27 Nov 2026';
    const shown = applyFilters(deals, state);
    app.innerHTML = list(shown, state, deals.length);
    const count = app.querySelector('#count');
    count.textContent = `Showing ${shown.length} of ${deals.length} deals, best deal first.`;
    const form = app.querySelector('#filters');
    form.addEventListener('input', () => {
      const data = new FormData(form);
      state.q = data.get('q') || '';
      state.category = data.get('category') || 'all';
      state.store = data.get('store') || 'all';
      state.verdict = data.get('verdict') || 'all';
      state.minOff = Number(data.get('minOff') || 0);
      state.sort = data.get('sort') || 'score';
      const next = applyFilters(deals, state);
      app.querySelector('#results').innerHTML = rows(next);
      count.textContent = `Showing ${next.length} of ${deals.length} deals.`;
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
