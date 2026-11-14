/* Prueba de humo: abre las recetas en un movil de 390 px y falla si hay errores de consola,
   desbordamiento horizontal o textos rotos. Uso: python3 scripts/build.py --estricto && node tests/smoke.js
   Necesita puppeteer-core y Chrome (CHROME=/ruta/al/chrome si no esta en /usr/bin/google-chrome). */
const http = require('http'), fs = require('fs'), path = require('path'), puppeteer = require('puppeteer-core');
const SITE = path.join(__dirname, '..', '_site'), TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => {
  const f = path.join(SITE, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'text/plain' }); s.end(d); } });
});
(async () => {
  await new Promise(r => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port + '/';
  const ids = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'recipes.json'), 'utf8')).map(r => r.id);
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'], headless: 'new' });
  const pg = await b.newPage(), errs = [], fallos = [];
  pg.on('pageerror', e => errs.push(e.message)); pg.on('requestfailed', r => errs.push('peticion fallida ' + r.url()));
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  for (const id of ids) {
    errs.length = 0; await pg.goto(base + '#' + id); await new Promise(r => setTimeout(r, 600));
    const r = await pg.evaluate(() => ({ ovx: document.documentElement.scrollWidth > innerWidth + 1, pasos: document.querySelectorAll('.paso').length, roto: /undefined|NaN|\[object/.test(document.body.innerText) }));
    if (errs.length || r.ovx || !r.pasos || r.roto) fallos.push(id + ' ' + JSON.stringify({ errs: errs.slice(0, 2), ...r }));
  }
  await b.close(); srv.close();
  console.log(ids.length + ' recetas, ' + fallos.length + ' con fallos'); fallos.forEach(f => console.log(' - ' + f));
  process.exit(fallos.length ? 1 : 0);
})();
