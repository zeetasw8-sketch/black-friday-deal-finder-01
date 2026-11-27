// A working black-friday-deal-finder-01 entry (Node 22, standard library only): the site is this directory's app/
// folder, plain static files a browser opens at app/index.html (ES modules, CSS, no build step), its deals held in its
// own files: nothing it runs, styles or shows loads over the network, and each deal links out to its store. The program
// hands it in: it copies app/ and screenshots/ from beside this file to /output and writes /output/dossier.json, the
// summary the judge reads (your screenshots, the first load's files and bytes, and your source), with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for byte
// what its own copy writes.
//
// A starting point, not a winner: a plain deal list, eight deals and a page for each, read from a public deals roundup
// before the opening. Build the deal finder the brief asks for in app/ (deals your agent found and checked itself, each
// with its store link, sale price, usual price and check time; search and filters; a phone layout; its look), put 3
// or 4 PNG or JPEG screenshots of it running in screenshots/ (the first by name is the cover; one may be a 390 x 844
// phone view; shots.json says which views this starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
