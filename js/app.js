/* Recetario de la abuela: portada, pasaporte, mapa, fichas, recetas con planificador, temporizadores y modo cocina. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var R = [], MAPA = window.MAPA, ESC = window.ESC;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  ESC.instala();

  /* v2: estado de la version rota (v1) descartado una vez; evita sellos fantasma */
  try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('recetario:v1:') === 0) localStorage.removeItem(k); }); } catch (e0) {}
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('recetario:v2:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('recetario:v2:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- Datos ---------- */
  var porId = {}, REG = {};
  MAPA.regiones.forEach(function (g) { REG[g.id] = g; });
  function preparaRecetas() { R.forEach(function (r) {
    porId[r.id] = r;
    r.regs = r.regs || [r.reg];
    r.ings = []; r.porK = {};
    r.ing.forEach(function (x) {
      if (typeof x === 'string') { r.ings.push({ grupo: x.slice(1) }); return; }
      var nom = x[1].split('|'), i = { k: x[0], s: nom[0], p: nom[1] || nom[0], q: x[2], u: x[3] || null, r: x[4] || 1, plano: x[5] === 'plano' ? 1 : undefined };
      if (i.u === 'kg') { i.q *= 1000; i.u = 'g'; }
      if (i.u === 'l') { i.q *= 1000; i.u = 'ml'; }
      r.ings.push(i); r.porK[i.k] = i;
    });
    var n = 0; r.todos = [];
    r.fases.forEach(function (f, fi) { f.p.forEach(function (p) { p.key = ++n; p.fase = fi; r.todos.push(p); }); });
    r.rac = r.rac || [r.b];
  }); }
  var CATS = [['todas', 'Todas'], ['cuchara', 'De cuchara'], ['arroz', 'Arroces'], ['picar', 'Para picar'], ['huerta', 'Huerta'], ['carne', 'Carnes'], ['mar', 'Del mar'], ['postre', 'Postres']];
  var TIEMPOS = [['todos', 'Cualquier tiempo'], ['rapido', 'Hasta 1 h'], ['medio', 'De 1 a 3 h'], ['largo', 'Más de 3 h'], ['vispera', 'Empieza la víspera']];
  var FUEGO = { 0: ['Sin fuego', 0], 1: ['Fuego mínimo', 1], 2: ['Fuego suave', 1], 3: ['Fuego medio', 2], 4: ['Fuego medio-alto', 3], 5: ['Fuego fuerte', 4], a: ['Fuego apagado', 0] };

  /* ---------- Estado ---------- */
  var cocinados = store.get('cocinados', {}) || {};
  var favs = store.get('favs', {}) || {};
  var compra = store.get('compra', []) || [];
  var filtro = { cat: 'todas', t: 'todos', q: '', fav: false };
  var regionSel = null, verEspana = false;
  function est(r) {
    var e = store.get('r:' + r.id, null) || {};
    return {
      rac: (r.rac.indexOf(e.rac) > -1 ? e.rac : (r.racIni || r.b)),
      met: e.met || (r.met ? r.met[0].id : null),
      modo: e.modo === 'fin' ? 'fin' : 'inicio',
      hora: /^\d{2}:\d{2}$/.test(e.hora || '') ? e.hora : null,
      hechos: Array.isArray(e.hechos) ? e.hechos : [],
      tengo: Array.isArray(e.tengo) ? e.tengo : []
    };
  }
  function guarda(r, e) { store.set('r:' + r.id, e); }

  /* ---------- Tiempo ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function aMin(h) { var m = /^(\d{1,2}):(\d{2})/.exec(h || ''); return m ? +m[1] * 60 + +m[2] : null; }
  function hhmm(min) { min = ((Math.round(min) % 1440) + 1440) % 1440; return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function dia(min) {
    var d = Math.floor(Math.round(min) / 1440);
    if (!d) return '';
    if (d === -1) return 'víspera';
    if (d < -1) return (-d) + ' días antes';
    return d === 1 ? 'día siguiente' : d + ' días después';
  }
  function hora(min) { var d = dia(min); return hhmm(min) + (d ? ' · ' + d : ''); }
  function durTxt(min) { min = Math.round(min); var h = Math.floor(min / 60), m = min % 60; return h ? (m ? h + ' h ' + m + ' min' : h + ' h') : m + ' min'; }
  function ahora(redondea) { var d = new Date(), m = d.getHours() * 60 + d.getMinutes(); return redondea ? Math.ceil(m / 5) * 5 : m; }

  /* ---------- Cantidades ---------- */
  function coma(n) { return String(n).replace('.', ','); }
  function aPaso(v, p) { return Math.round(v / p) * p; }
  function medio(v) { var e = Math.floor(v + 1e-9); return v - e > 0.25 ? (e ? e : '') + '½' : String(e); }
  function factor(r, rac) { return (r.fac && r.fac[rac]) || rac / r.b; }
  function valor(r, i, rac) {
    if (i.q === null || i.q === undefined || typeof i.q === 'string') return null;
    var v = i.q * factor(r, rac);
    if (i.u === 'ud') return Math.max(i.r, aPaso(v, i.r));
    if (i.u === 'cda' || i.u === 'cdta') return Math.max(.5, aPaso(v, .5));
    return v;
  }
  function cantidad(r, i, rac) {
    if (typeof i.q === 'string') return i.q;
    var v = valor(r, i, rac);
    if (v === null) return '';
    if (i.u === 'g') { if (v >= 1000) return coma(+(aPaso(v, 50) / 1000).toFixed(2)) + ' kg'; return (v >= 100 ? aPaso(v, 25) : Math.max(5, aPaso(v, 5))) + ' g'; }
    if (i.u === 'ml') { if (v >= 1000) return coma(+(aPaso(v, 100) / 1000).toFixed(1)) + ' l'; return (v >= 100 ? aPaso(v, 25) : Math.max(5, aPaso(v, 5))) + ' ml'; }
    if (i.u === 'cda') return medio(v) + (v > 1 ? ' cdas' : ' cda');
    if (i.u === 'cdta') return medio(v) + (v > 1 ? ' cdtas' : ' cdta');
    return i.r < 1 ? medio(v) : String(v);
  }
  function frase(r, k, rac) {
    var i = r.porK[k];
    if (!i) return k;
    var v = valor(r, i, rac);
    if (v === null) return i.s;
    if (i.u === 'ud') return cantidad(r, i, rac) + ' ' + (v > 1 ? i.p : i.s);
    return cantidad(r, i, rac) + ' de ' + i.s;
  }
  function etiquetaIng(r, i, rac) {
    var v = valor(r, i, rac), t = i.u === 'ud' && v !== null && v > 1 ? i.p : i.s;
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function texto(r, t, rac) {
    return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return r.porK[k] ? '<span class="q" data-i="' + k + '">' + esc(frase(r, k, rac)) + '</span>' : m; });
  }

  /* ---------- Pasos y horario ---------- */
  function metodo(r, e) { if (!r.met) return null; for (var i = 0; i < r.met.length; i++) if (r.met[i].id === e.met) return e.met; return r.met[0].id; }
  function pasosDe(r, met) {
    var out = [];
    r.todos.forEach(function (p) {
      if (p.solo && p.solo.indexOf(met) < 0) return;
      var q = {}, k;
      for (k in p) q[k] = p[k];
      if (p.alt && p.alt[met]) for (k in p.alt[met]) q[k] = p.alt[met][k];
      out.push(q);
    });
    out.forEach(function (p, i) { p.n = i + 1; });
    return out;
  }
  function calcula(r, e, met) {
    var pasos = pasosDe(r, met !== undefined ? met : metodo(r, e)), pre = 0, tot = 0, esp = 0, post = 0;
    pasos.forEach(function (p) { if (p.pre) pre += p.m; else if (p.post) post += p.m; else { tot += p.m; if (p.w) esp += p.m; } });
    var h = aMin(e.hora); if (h === null) h = ahora(true);
    var ini = e.modo === 'fin' ? h - tot : h, t = ini - pre;
    pasos.forEach(function (p) { if (p.pre) { p.ini = t; t += p.m; } });
    t = ini;
    pasos.forEach(function (p) { if (!p.pre && !p.post) { p.ini = t; t += p.m; } });
    pasos.forEach(function (p) { if (p.post) { p.ini = t; t += p.m; } });
    return { pasos: pasos, pre: pre, tot: tot, esp: esp, post: post, ini: ini, fin: ini + tot, h: h };
  }
  function resumenFicha(r) { var e = est(r); return calcula(r, e); }

  /* ---------- Logros ---------- */
  var LOGROS = [
    ['1', 'Primer plato', function (c) { return c.n >= 1; }, 'cocina tu primer plato'],
    ['C', 'Cuchara de palo', function (c) { return c.cat.cuchara >= 3; }, 'cocina tres platos de cuchara'],
    ['P', 'Paciencia de abuela', function (c) { return c.ids.some(function (id) { return resumenFicha(porId[id]).tot >= 180; }); }, 'cocina un plato de tres horas o más'],
    ['V', 'Vuelta y vuelta', function (c) { return !!cocinados.tortilla; }, 'dale la vuelta a la tortilla de patatas'],
    ['S', 'Socarrat', function (c) { return !!cocinados.paella; }, 'haz la paella valenciana'],
    ['G', 'Goloso', function (c) { return c.cat.postre >= 2; }, 'cocina dos postres'],
    ['M', 'De mar', function (c) { return c.cat.mar >= 2; }, 'cocina dos platos de mar'],
    ['I', 'Ca la iaia', function (c) { return !!cocinados.cremacatalana && !!cocinados.xato; }, 'crema catalana y xató, los dos'],
    ['9', 'Media España', function (c) { return c.regs >= 9; }, 'sella nueve comunidades'],
    ['17', 'Vuelta a España', function (c) { return c.regs >= 17; }, 'sella las diecisiete']
  ];
  function cuentas() {
    var ids = Object.keys(cocinados).filter(function (id) { return porId[id]; }), cat = {}, regs = {};
    ids.forEach(function (id) { var r = porId[id]; cat[r.cat] = (cat[r.cat] || 0) + 1; r.regs.forEach(function (g) { if (REG[g]) regs[g] = 1; }); });
    return { ids: ids, n: ids.length, cat: cat, regs: Object.keys(regs).length };
  }
  function recetasDe(g) { return R.filter(function (r) { return r.regs.indexOf(g) > -1; }); }


  /* ---------- Donde comprar: opcion facil y opcion mejor, por tipo de ingrediente ---------- */
  var DONDE = [
    ['embutido', /chorizo|morcilla|jam[oó]n|tocino|panceta|torrezno|cecina|salchicha|longaniza/, 'Súper', 'Charcutería'],
    ['carne', /cordero|lechazo|ternasco|lechal|costilla|morro|callos|pollo|ternera|cerdo|conejo|rabo|lac[oó]n|carne|chuleta|hueso|pavo/, 'Súper', 'Carnicería'],
    ['pescado', /bacalao|at[uú]n|bonito|pulpo|pescado|morralla|anchoa|merluza|calamar|gamba|sepia|mejill/, 'Súper', 'Pescadería'],
    ['legumbre', /garbanzo|alubia|lenteja|almorta|fabes|fabas?\b|fabada|jud[ií]as? seca|habas secas/, 'Súper', 'Tienda a granel o gourmet'],
    ['arroz', /arroz|bomba|fideo|pasta/, 'Súper', 'Tienda gourmet (D.O.)'],
    ['especia', /piment[oó]n|azafr[aá]n|[ñn]ora|laurel|canela|pimienta|guindilla|romero|comino|clavo|tomillo|oreg[aá]no|nuez moscada|c[uú]rcuma/, 'Súper', 'Herbolario o especias'],
    ['aceite', /aceite|vinagre|vino|brandy|jerez|sidra/, 'Súper', 'Cooperativa o bodega'],
    ['huevo', /huevo|yema|leche|nata|mantequilla|queso|yogur/, 'Súper', 'Mercado (de payés)'],
    ['verdura', /cebolla|pimiento|tomate|ajo|patata|papa|calabac|berenjena|berza|col\b|coliflor|puerro|zanahoria|perejil|lim[oó]n|pepino|escarola|jud[ií]a|apio|espinaca|borraja|garrofó|nabo|chirivía|cilantro|jengibre|alcachofa|calabaza|naranja|manzana|uva/, 'Súper', 'Mercado o verdulería'],
    ['despensa', /almendra|avellana|aceituna|olivas?\b|maicena|\bron\b|an[ií]s|nuez|pasas|pi[ñn]ones/, 'Súper', 'Tienda gourmet'],
    ['panaderia', /pan\b|picatoste|harina|az[uú]car|levadura|sobao|galleta|masa/, 'Súper', 'Panadería']
  ];
  var MAPAQ = { embutido: 'charcutería', carne: 'carnicería', pescado: 'pescadería', legumbre: 'tienda de legumbres a granel', arroz: 'tienda gourmet', especia: 'herbolario especias', aceite: 'bodega aceite', huevo: 'mercado huevos', verdura: 'mercado verdulería', despensa: 'tienda gourmet', panaderia: 'panadería' };
  /* Por tu barrio (zona). Solo sitios con fuente: web del Mercat local, Ajuntament/Barcelona + Sostenible, guias locales. */
  var BARRIO = {







  };
  BARRIO.legumbre = BARRIO.especia; BARRIO.arroz = []; BARRIO.aceite = []; BARRIO.despensa = [];
  function barrioHTML(cats) {
    var vistos = {}, h = '';
    cats.forEach(function (c) {
      var l = BARRIO[c]; if (!l || !l.length || vistos[c]) return; vistos[c] = 1;
      h += '<p class="eti">' + esc(DONDE.filter(function (d) { return d[0] === c; })[0][3]) + '</p><ul class="barrio-lista">' + l.map(function (p) {
        return '<li><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p[0] + ' Barcelona') + '" target="_blank" rel="noopener"><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></a></li>';
      }).join('') + '</ul>';
    });
    if (!h) return '';
    return '<details class="barrio"><summary>Por tu barrio (zona)</summary>' + h + '<p class="ayuda">Mercat local: lunes a jueves 8-14 h, viernes 8-19:30 h, sábados 8-14:30 h. Comprueba horarios antes de ir.</p></details>';
  }
  function dondeCat(t) {
    var n = String(t).toLowerCase();
    for (var q = 0; q < DONDE.length; q++) if (DONDE[q][1].test(n)) return DONDE[q];
    return null;
  }
  function dondeTag(t, sinLink) {
    var d = dondeCat(t);
    if (!d) return '';
    var mejor = sinLink ? '<b>' + d[3] + '</b>' : '<a class="donde-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(MAPAQ[d[0]] + ' cerca de mí') + '" target="_blank" rel="noopener">' + d[3] + '</a>';
    return '<span class="donde"><b>' + d[2] + '</b> fácil · ' + mejor + ' mejor</span>';
  }
  function catsDe(textos) { var out = []; textos.forEach(function (t) { var d = dondeCat(t); if (d) out.push(d[0]); }); return out; }

  /* ---------- Piezas comunes ---------- */
  function chipFuego(f) {
    if (typeof f === 'string' && f.charAt(0) === 'h') return '<li class="chip">Horno ' + f.slice(1) + ' °C</li>';
    if (f === 'n') return '<li class="chip"><svg class="icono-frio" viewBox="0 0 14 14" aria-hidden="true"><use href="#e-frio"/></svg>Nevera</li>';
    if (f === 'l') return '<li class="chip">Olla lenta en LOW</li>';
    var d = FUEGO[f] || FUEGO[0], ll = '';
    for (var i = 0; i < d[1]; i++) ll += '<svg viewBox="0 0 10 14"><use href="#e-llama"/></svg>';
    return '<li class="chip">' + (ll ? '<span class="llamas" aria-hidden="true">' + ll + '</span>' : '') + d[0] + '</li>';
  }
  function dif(n) { return '<span class="dif" aria-label="Dificultad ' + ['', 'fácil', 'media', 'con mano'][n] + '">' + '●●●'.slice(0, n) + '<span style="opacity:.25">' + '●●●'.slice(n) + '</span></span> ' + ['', 'Fácil', 'Media', 'Con mano'][n]; }
  function tbarra(c) {
    var a = c.tot - c.esp, tot = a + c.esp + c.pre || 1;
    return '<div class="tbarra" aria-hidden="true"><span class="a" style="flex:' + a + ' 1 0px"></span>' + (c.esp ? '<span class="e" style="flex:' + c.esp + ' 1 0px"></span>' : '') + (c.pre ? '<span class="v" style="flex:' + Math.min(c.pre, tot) + ' 1 0px"></span>' : '') + '</div>';
  }

  /* ---------- Portada ---------- */
  function vistaIndice() {
    var c = cuentas();
    var st = document.getElementById('stats');
    if (st) st.innerHTML = '<b>' + R.length + '</b> platos &nbsp;·&nbsp; <b>17</b> comunidades &nbsp;·&nbsp; <b>' + R.reduce(function (a, r) { return a + r.todos.length; }, 0) + '</b> pasos ilustrados';
    var h = '';
    var sigue = R.filter(function (r) { return !cocinados[r.id] && est(r).hechos.length; })[0];
    if (sigue) h += '<section class="tarjeta" aria-label="Sigue donde lo dejaste"><p class="eti">Sigue donde lo dejaste</p><ul class="filas">' + fila(sigue) + '</ul></section>';
    if (compra.length) {
      var grupos = {}, orden = [];
      compra.forEach(function (c, n) { if (!grupos[c.r]) { grupos[c.r] = []; orden.push(c.r); } grupos[c.r].push([c, n]); });
      h += '<section class="tarjeta" aria-labelledby="t-compra"><div class="seccion-cab"><h2 id="t-compra">La compra</h2><span class="ayuda">' + compra.filter(function (c) { return !c.d; }).length + ' por comprar</span></div>' +
        orden.map(function (rid) { var rr = porId[rid]; return '<p class="eti">' + esc(rr ? rr.n : rid) + '</p><ul class="compra-lista">' + grupos[rid].map(function (p) { return '<li><button type="button" class="compra-it" data-compra="' + p[1] + '" aria-pressed="' + (!!p[0].d) + '">' + esc(p[0].t) + dondeTag(p[0].t, true) + '</button></li>'; }).join('') + '</ul>'; }).join('') +
        barrioHTML(catsDe(compra.map(function (c) { return c.t; }))) + '<p class="reinicio"><button type="button" class="reiniciar" data-vaciar="1">Vaciar la lista</button></p></section>';
    }
    var hoy = new Date(), dnum = Math.floor((hoy.getTime() - hoy.getTimezoneOffset() * 60000) / 86400000);
    var pool = R.filter(function (r) { return !cocinados[r.id]; }); if (!pool.length) pool = R;
    var dia = pool[dnum % pool.length];
    h += '<section class="tarjeta" aria-label="Plato del día"><p class="eti">Plato del día</p><ul class="filas">' + fila(dia) + '</ul></section>';
    h += '<section class="tarjeta" aria-labelledby="t-pas"><div class="seccion-cab"><h2 id="t-pas">Tu pasaporte</h2><span class="ayuda">Cocina un plato y sella su región</span></div>' +
      '<div class="barras"><div class="barra-fila"><span>Platos</span><span class="barra"><i style="width:' + (c.n / R.length * 100).toFixed(1) + '%"></i></span><span class="num">' + c.n + '/' + R.length + '</span></div>' +
      '<div class="barra-fila"><span>Regiones</span><span class="barra"><i style="width:' + (c.regs / 17 * 100).toFixed(1) + '%"></i></span><span class="num">' + c.regs + '/17</span></div></div>' +
      '<ul class="logros">' + LOGROS.map(function (l) { var si = l[2](c); return '<li class="logro' + (si ? ' si' : '') + '" title="' + esc(l[3].charAt(0).toUpperCase() + l[3].slice(1)) + '"><span class="medalla" aria-hidden="true">' + l[0] + '</span>' + l[1] + '<span class="sr-only">' + (si ? ', conseguido' : ', por conseguir: ' + l[3]) + '</span></li>'; }).join('') + '</ul>' +
      (function () { var sig = LOGROS.filter(function (l) { return !l[2](c); })[0]; return '<p class="siguiente">' + (sig ? 'Siguiente sello: <b>' + esc(sig[1]) + '</b>, ' + esc(sig[3]) + '.' : 'Los tienes todos. La abuela estaría orgullosa.') + '</p>'; })() + (Object.keys(cocinados).length ? '<p class="reinicio"><button type="button" class="reiniciar" data-reset="1">Reiniciar pasaporte</button></p>' : '') + '</section>';
    h += '<section class="tarjeta" aria-labelledby="t-mapa"><div class="seccion-cab"><h2 id="t-mapa">El mapa</h2><span class="ayuda">Toca una comunidad</span></div>' +
      '<div class="mapa-caja">' + svgMapa() + '</div>' +
      '<div class="mapa-leyenda"><span><i style="background:var(--region)"></i>Por cocinar</span><span><i style="background:var(--vino)"></i>Sellada</span><span><i style="background:var(--ocre);border-radius:50%"></i>Todos sus platos hechos</span></div>' +
      '<button type="button" class="chip-es" id="ver-espana" aria-pressed="' + (verEspana ? 'true' : 'false') + '">Y de toda España (' + recetasDe('es').length + ')</button>' +
      '<div class="panel-region" id="panel-region">' + panelRegion() + '</div></section>';
    h += '<section aria-labelledby="t-fichas" style="display:grid;gap:14px"><div class="seccion-cab"><h2 id="t-fichas" style="font-size:27px">Todos los platos</h2><span class="ayuda num" id="n-fichas"></span></div>' +
      '<div class="filtros"><label class="sr-only" for="buscar">Buscar un plato o ingrediente</label><input class="buscar" id="buscar" type="search" placeholder="Busca un plato o un ingrediente" value="' + esc(filtro.q) + '">' +
      '<div class="chips-fila" role="group" aria-label="Favoritos"><button type="button" class="filtro" id="ver-favs" aria-pressed="' + filtro.fav + '">♥ Mis favoritos</button></div>' +
      '<div class="chips-fila" role="group" aria-label="Tipo de plato">' + CATS.map(function (c) { return '<button type="button" class="filtro" data-cat="' + c[0] + '" aria-pressed="' + (filtro.cat === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div>' +
      '<div class="chips-fila" role="group" aria-label="Tiempo">' + TIEMPOS.map(function (c) { return '<button type="button" class="filtro" data-tiempo="' + c[0] + '" aria-pressed="' + (filtro.t === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="fichas" id="fichas"></div></section>';
    h += '<p class="ayuda" style="text-align:center">Mapa de elaboración propia. Tiempos orientativos: cada fuego y cada cazuela mandan.</p>';
    $('#vista-indice').innerHTML = h;
    pintaFichas();
  }
  function svgMapa() {
    var cb = MAPA.canarias_caja, s = '<svg class="mapa" viewBox="0 0 ' + MAPA.vb[0] + ' ' + MAPA.vb[1] + '" role="group" aria-label="Mapa de España por comunidades autónomas">' +
      '<path class="pt" d="' + MAPA.portugal + '"/><rect class="caja-cnr" x="' + cb.x + '" y="' + cb.y + '" width="' + cb.w + '" height="' + cb.h + '" rx="6"/>';
    MAPA.regiones.forEach(function (g) {
      s += '<path class="reg-hit" data-reg="' + g.id + '" d="' + g.d + '" aria-hidden="true"/>';
    });
    MAPA.regiones.forEach(function (g) {
      var rs = recetasDe(g.id), hechas = rs.filter(function (r) { return cocinados[r.id]; }).length;
      s += '<path class="reg' + (hechas ? ' cocinada' : '') + (regionSel === g.id ? ' sel' : '') + '" data-reg="' + g.id + '" d="' + g.d + '" tabindex="0" role="button" aria-label="' + esc(g.n) + ': ' + rs.length + (rs.length === 1 ? ' plato' : ' platos') + (hechas ? ', ' + hechas + ' cocinado' + (hechas > 1 ? 's' : '') : '') + '" aria-pressed="' + (regionSel === g.id) + '"><title>' + esc(g.n) + '</title></path>';
    });
    MAPA.regiones.forEach(function (g) {
      var rs = recetasDe(g.id), llena = rs.length && rs.every(function (r) { return cocinados[r.id]; });
      s += '<g class="chapa' + (llena ? ' llena' : '') + '" data-reg="' + g.id + '" transform="translate(' + g.cx + ' ' + g.cy + ')" aria-hidden="true"><circle class="chapa-hit" r="18"/><circle r="7.5"/><text text-anchor="middle" dy="3.2">' + rs.length + '</text></g>';
    });
    return s + '</svg>';
  }
  function fila(r) {
    var c = resumenFicha(r);
    return '<li><a class="fila" href="#' + r.id + '"><span class="mini">' + ESC.svg(r.heroe, '') + '</span><span><b>' + esc(r.n) + '</b><small>' + esc(r.sub) + ' · ' + durTxt(c.tot) + '</small></span>' + (cocinados[r.id] ? '<span class="sello">Hecho</span>' : '<span aria-hidden="true" style="color:var(--anil);font-weight:800">›</span>') + '</a></li>';
  }
  function panelRegion() {
    if (verEspana) return '<h3>De toda España</h3><ul class="filas">' + recetasDe('es').map(fila).join('') + '</ul>';
    if (!regionSel) return '<p class="ayuda">Cada comunidad tiene al menos un plato. Las que vayas cocinando se sellan en color vino.</p>';
    var g = REG[regionSel], rs = recetasDe(regionSel);
    return '<h3>' + esc(g.n) + '</h3><ul class="filas">' + rs.map(fila).join('') + '</ul>';
  }
  function pasaFiltro(r) {
    if (filtro.fav && !favs[r.id]) return false;
    if (filtro.cat !== 'todas' && r.cat !== filtro.cat) return false;
    if (filtro.t !== 'todos') {
      var c = resumenFicha(r);
      if (filtro.t === 'rapido' && !(c.tot <= 60 && !c.pre)) return false;
      if (filtro.t === 'medio' && !(c.tot > 60 && c.tot <= 180)) return false;
      if (filtro.t === 'largo' && !(c.tot > 180)) return false;
      if (filtro.t === 'vispera' && !c.pre) return false;
    }
    if (filtro.q) {
      var q = filtro.q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      var hay = (r.n + ' ' + r.sub + ' ' + r.lugar + ' ' + r.ings.map(function (i) { return i.s || ''; }).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  function pintaFichas() {
    var lista = R.filter(pasaFiltro);
    $('#n-fichas').textContent = lista.length + (lista.length === 1 ? ' plato' : ' platos');
    $('#fichas').innerHTML = lista.length ? lista.map(function (r) {
      var c = resumenFicha(r);
      return '<a class="ficha" href="#' + r.id + '"><div class="ilu">' + ESC.svg(r.heroe, r.n) + (cocinados[r.id] ? '<span class="sello">Hecho</span>' : '') + (favs[r.id] ? '<span class="corazon" aria-label="Favorito">♥</span>' : '') + '</div>' +
        '<div class="cuerpo"><p class="lugar">' + esc(r.lugar) + '</p><h3>' + esc(r.n) + '</h3><p class="sub">' + esc(r.sub) + '</p>' + tbarra(c) +
        '<p class="meta"><span class="num">' + durTxt(c.tot) + '</span><span class="num">' + durTxt(c.tot - c.esp) + ' de trabajo</span>' + (c.pre ? '<span>Empieza la víspera</span>' : '') + '<span>' + dif(r.dif) + '</span></p></div></a>';
    }).join('') : '<p class="vacio">Ningún plato con esos filtros. Prueba con otro tiempo o tipo.</p>';
  }

  /* ---------- Vista de receta ---------- */
  var actual = null;
  function vistaReceta(id) {
    var r = porId[id], e = est(r), met = metodo(r, e), c = calcula(r, e, met);
    actual = r;
    var udN = r.ud ? r.ud.charAt(0).toUpperCase() + r.ud.slice(1) : 'Raciones';
    var h = '<button type="button" class="volver" data-ir="">← Recetario</button>' +
      '<header class="r-cab"><figure class="r-heroe">' + ESC.svg(r.heroe, r.n) + '</figure><p class="eti lugar">' + esc(r.lugar) + '</p>' +
      '<h1>' + esc(r.n) + '<em>' + esc(r.sub) + '</em></h1><p class="intro">' + esc(r.intro) + '</p>' +
      '<dl class="datos"><div><dt>En total</dt><dd class="num" id="d-total"></dd></div><div><dt>Trabajo</dt><dd class="num" id="d-activo"></dd></div><div><dt>' + udN + '</dt><dd class="num" id="d-rac">' + coma(e.rac) + '</dd></div></dl>' +
      '<p class="vispera" id="d-vispera" hidden></p>' +
      '<div class="acciones-r"><button type="button" class="btn sec fav-r" data-fav="1" aria-pressed="' + (!!favs[r.id]) + '">' + (favs[r.id] ? '♥ En favoritos' : '♡ Guardar') + '</button><button type="button" class="btn" data-cocina="1"><svg viewBox="0 0 16 16" aria-hidden="true"><use href="#e-play"/></svg>Cocinar paso a paso</button>' +
      '<button type="button" class="btn sec hecho-r" data-cocinado="1" aria-pressed="' + (!!cocinados[r.id]) + '">' + (cocinados[r.id] ? 'Sellado en el pasaporte' : '¡Lo he cocinado!') + '</button></div></header>';
    // Horario
    h += '<section class="tarjeta" aria-labelledby="t-plan"><h2 id="t-plan">Organiza el día</h2>' +
      '<div class="fila-hora"><fieldset class="seg-fs"><legend class="sr-only">Qué hora quieres fijar</legend><div class="seg">' +
      '<input type="radio" name="modo" id="modo-inicio" value="inicio"' + (e.modo === 'inicio' ? ' checked' : '') + '><label for="modo-inicio">Empiezo a las</label>' +
      '<input type="radio" name="modo" id="modo-fin" value="fin"' + (e.modo === 'fin' ? ' checked' : '') + '><label for="modo-fin">' + (r.listo ? 'Listo a las' : 'Comemos a las') + '</label></div></fieldset>' +
      '<div class="hora-caja"><input type="time" class="campo-hora" id="hora" aria-label="Hora" value="' + hhmm(c.h) + '"><button type="button" class="btn-sec" id="ahora">Ahora</button></div></div>' +
      '<p class="resumen" id="resumen"></p><p class="antes" id="antes" hidden></p><p class="aviso" id="aviso" hidden></p>' +
      '<div class="crono" aria-hidden="true"><div class="crono-barra" id="crono"></div><div class="crono-horas"><span id="c-ini"></span><span id="c-fin"></span></div></div>' +
      '<ol class="leyenda" id="leyenda"></ol>';
    if (r.met) h += '<fieldset class="seg-fs"><legend class="eti">Cómo lo vas a hacer</legend><div class="metodo">' + r.met.map(function (m) {
      return '<input type="radio" name="met" id="met-' + m.id + '" value="' + m.id + '"' + (m.id === met ? ' checked' : '') + '><label for="met-' + m.id + '"><b>' + esc(m.n) + '</b><span>' + esc(m.d) + '</span></label>';
    }).join('') + '</div></fieldset>';
    h += '<label class="interruptor" for="pantalla"><input type="checkbox" id="pantalla" role="switch"' + (bloqueo ? ' checked' : '') + '><span>Mantener la pantalla encendida</span></label>' +
      '<p class="ayuda" id="pantalla-estado">Los temporizadores suenan con la página abierta y la pantalla encendida.</p></section>';
    // Ingredientes
    h += '<section class="tarjeta" aria-labelledby="t-ing"><div class="ing-cab"><h2 id="t-ing">Ingredientes</h2><fieldset class="seg-fs raciones"><legend class="sr-only">' + udN + '</legend><span class="eti" aria-hidden="true">' + udN + '</span><div class="seg">' +
      r.rac.map(function (n) { var id = 'rac-' + String(n).replace('.', '-'); return '<input type="radio" name="rac" id="' + id + '" value="' + n + '"' + (n === e.rac ? ' checked' : '') + '><label for="' + id + '">' + coma(n) + '</label>'; }).join('') + '</div></fieldset></div>' +
      (r.notaRac ? '<p class="nota-rac" id="nota-rac">' + esc(r.notaRac[1]) + '</p>' : '') +
      '<p class="ayuda">Toca cada ingrediente para marcar lo que ya tienes.</p><p class="compra-acc"><button type="button" class="btn sec" data-comprar="1">' + (compra.some(function (c) { return c.r === r.id; }) ? 'Lista de la compra actualizada: añadir de nuevo' : 'Añadir lo que falta a la compra') + '</button></p><ul class="ing-lista">' +
      r.ings.map(function (i) {
        if (i.grupo !== undefined) return '<li class="grupo">' + esc(i.grupo) + '</li>';
        if (i.plano) return '<li><label><input type="checkbox" value="' + i.k + '"' + (e.tengo.indexOf(i.k) > -1 ? ' checked' : '') + '><span class="nom">' + esc(i.s) + '</span>' + dondeTag(i.s) + '</label></li>';
        return '<li><label><input type="checkbox" value="' + i.k + '"' + (e.tengo.indexOf(i.k) > -1 ? ' checked' : '') + '><span class="nom" data-n="' + i.k + '">' + esc(etiquetaIng(r, i, e.rac)) + '</span><span class="cant" data-c="' + i.k + '">' + esc(cantidad(r, i, e.rac) || 'al gusto') + '</span>' + dondeTag(i.s) + '</label></li>';
      }).join('') + '</ul>' + barrioHTML(catsDe(r.ings.filter(function (i) { return i.grupo === undefined; }).map(function (i) { return i.s; }))) + '</section>';
    // Pasos
    h += '<div class="seccion-cab"><h2>Paso a paso</h2><p class="eti num" id="progreso" style="color:var(--ok)"></p></div>';
    r.fases.forEach(function (f, fi) {
      var ps = c.pasos.filter(function (p) { return p.fase === fi; });
      if (!ps.length) return;
      h += '<section class="fase" aria-labelledby="f-' + fi + '"><header class="fase-cab"><p class="eti ' + f.tipo + '">' + (f.tipo === 'previo' ? 'Antes de empezar' : f.tipo === 'despues' ? 'Después' : f.tipo === 'espera' ? 'Casi todo es esperar' : 'Tú en la cocina') + '</p>' +
        '<h3 id="f-' + fi + '">' + esc(f.n) + '</h3><p class="fase-hora" id="fh-' + fi + '"></p></header>' + ps.map(function (p) { return htmlPaso(r, p, e.rac); }).join('') + '</section>';
    });
    // Secretos y cierre
    h += '<section class="tarjeta secretos" aria-labelledby="t-sec"><h2 id="t-sec">Los secretos de la abuela</h2><dl>' + r.secretos.map(function (s) { return '<dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join('') + '</dl></section>';
    var otras = R.filter(function (o) { return o !== r && (o.cat === r.cat || o.regs.some(function (g) { return r.regs.indexOf(g) > -1; })); }).slice(0, 3);
    h += '<section class="final"><button type="button" class="btn hecho-r" data-cocinado="1" aria-pressed="' + (!!cocinados[r.id]) + '">' + (cocinados[r.id] ? 'Sellado en el pasaporte' : '¡Lo he cocinado! Sellar el pasaporte') + '</button></section>';
    if (otras.length) h += '<section class="otras" aria-labelledby="t-otras"><h2 id="t-otras" style="font-size:24px">Para la próxima</h2><ul class="filas">' + otras.map(fila).join('') + '</ul></section>';
    $('#vista-receta').innerHTML = h;
    pintaPlan(); pintaHechos(); pintaTimers();
  }

  function htmlPaso(r, p, rac, pref) {
    var key = r.id + ':' + p.key;
    pref = pref || '';
    var timer = p.tim ? '<div class="temporizador" data-t="' + key + '" data-seg="' + (p.tim * 60) + '" data-estado="parado">' +
      '<button class="t-btn" type="button" data-tb="' + key + '"><svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><use href="#e-play"/></svg><svg class="i-pausa" viewBox="0 0 16 16" aria-hidden="true"><use href="#e-pausa"/></svg><svg class="i-campana" viewBox="0 0 16 16" aria-hidden="true"><use href="#e-campana"/></svg><span class="t-txt"></span></button>' +
      '<span class="t-progreso" hidden><i></i></span><span class="t-extra" hidden><button class="t-mas" type="button" data-tm="' + key + '">+5 min</button><button class="t-reset" type="button" data-tr="' + key + '" hidden>Reiniciar</button><span class="t-est"></span></span></div>' : '';
    return '<article class="paso" id="' + pref + 'p-' + p.key + '" data-key="' + key + '" aria-labelledby="' + pref + 'pt-' + p.key + '">' +
      '<figure class="ilustra">' + ESC.svg(p.e, p.t) + '</figure><div class="paso-cuerpo">' +
      '<div class="paso-cab"><span class="paso-num" aria-hidden="true">' + p.n + '</span><h4 id="' + pref + 'pt-' + p.key + '">' + esc(p.t) + '</h4><span class="paso-hora num" data-h="' + p.key + '">' + (pref ? esc(hora(p.ini)) : '') + '</span></div>' +
      '<ul class="chips"><li class="chip num">' + (p.tim ? '' : '≈ ') + durTxt(p.m) + '</li>' + chipFuego(p.f) + '</ul>' +
      '<p class="texto">' + texto(r, p.x, rac) + '</p>' +
      (p.ab ? '<div class="abuela"><span class="sello-ab" aria-hidden="true">A</span><p><b>Así lo hace la abuela</b>' + texto(r, p.ab, rac) + '</p></div>' : '') +
      '<div class="acciones">' + timer + '<button class="hecho" type="button" data-hecho="' + key + '" aria-pressed="false"><svg class="i-no" viewBox="0 0 16 16" aria-hidden="true"><use href="#e-no"/></svg><svg class="i-ok" viewBox="0 0 16 16" aria-hidden="true"><use href="#e-ok"/></svg>Hecho</button></div></div></article>';
  }

  function pintaPlan() {
    var r = actual; if (!r) return;
    var e = est(r), c = calcula(r, e);
    $('#d-total').textContent = durTxt(c.tot);
    $('#d-activo').textContent = durTxt(c.tot - c.esp);
    var pres = c.pasos.filter(function (p) { return p.pre; });
    var dv = $('#d-vispera');
    dv.hidden = !pres.length;
    if (pres.length) dv.textContent = 'Y antes: ' + pres.map(function (p) { return p.t.toLowerCase() + ' (' + durTxt(p.m) + ')'; }).join(', ') + '.';
    $('#resumen').innerHTML = e.modo === 'inicio'
      ? 'Si empiezas a las <b>' + hhmm(c.ini) + '</b>, ' + (r.listo ? 'está listo' : 'comes') + ' a las <b>' + hora(c.fin) + '</b>.'
      : (r.listo ? 'Para tenerlo listo' : 'Para comer') + ' a las <b>' + hhmm(c.fin) + '</b>, empieza a cocinar a las <b>' + hora(c.ini) + '</b>.';
    var an = $('#antes');
    an.hidden = !pres.length;
    if (pres.length) an.innerHTML = pres.map(function (p) { return '<b>' + esc(p.t) + '</b> a las <b class="num">' + esc(hora(p.ini)) + '</b>'; }).join(' · ');
    var aviso = '';
    if (e.modo === 'fin') {
      var ya = ahora(false);
      if (c.h > ya && c.ini < ya) {
        aviso = 'A esa hora ya no llegas con este método.';
        if (r.met) r.met.forEach(function (m) {
          if (aviso.indexOf('Con ') > -1) return;
          var o = calcula(r, e, m.id);
          if (o.ini >= ya) aviso += ' Con ' + m.n.toLowerCase() + ' sí, si empiezas a las ' + hhmm(o.ini) + '.';
        });
        if (aviso.indexOf('Con ') < 0) aviso += ' Prueba con una hora más tarde o déjalo para mañana.';
      }
    }
    var av = $('#aviso'); av.textContent = aviso; av.hidden = !aviso;
    // barra de tiempo
    var segs = [];
    c.pasos.forEach(function (p) { if (p.pre || p.post) return; var t = p.w ? 'espera' : 'tu'; var u = segs[segs.length - 1]; if (u && u.t === t) u.m += p.m; else segs.push({ t: t, m: p.m }); });
    $('#crono').innerHTML = segs.map(function (s) { return '<span class="' + s.t + (s.m / c.tot < .13 ? ' estrecha' : '') + '" style="flex:' + s.m + ' 1 0px"><b>' + durTxt(s.m) + '</b></span>'; }).join('');
    $('#c-ini').textContent = hhmm(c.ini);
    $('#c-fin').textContent = hhmm(c.fin);
    // leyenda y fases
    var ley = '';
    r.fases.forEach(function (f, fi) {
      var ps = c.pasos.filter(function (p) { return p.fase === fi; });
      if (!ps.length) return;
      var a = ps[0].ini, b = ps[ps.length - 1].ini + ps[ps.length - 1].m, dur = ps.reduce(function (s, p) { return s + p.m; }, 0);
      var rango = hora(a) + ' – ' + hhmm(b), d = dia(a) || (dia(b) ? 'hasta el ' + dia(b) : '');
      ley += '<li><i class="muestra ' + f.tipo + '"></i><span>' + esc(f.n) + '<small>' + (f.tipo === 'previo' ? 'antes de empezar' : f.tipo === 'despues' ? 'después, en frío' : f.tipo === 'espera' ? 'casi todo es esperar' : 'tú en la cocina') + ' · ' + durTxt(dur) + '</small></span><span class="ley-h">' + hhmm(a) + ' – ' + hhmm(b) + (d ? '<small>' + esc(d) + '</small>' : '') + '</span></li>';
      var fh = $('#fh-' + fi); if (fh) fh.textContent = rango + ' · ' + durTxt(dur);
    });
    $('#leyenda').innerHTML = ley;
    c.pasos.forEach(function (p) { $$('[data-h="' + p.key + '"]').forEach(function (el) { el.textContent = hora(p.ini); }); });
    var campo = $('#hora');
    if (campo && document.activeElement !== campo) campo.value = hhmm(c.h);
  }
  function pintaCantidades() {
    var r = actual; if (!r) return;
    var e = est(r);
    $$('[data-i]').forEach(function (el) { el.textContent = frase(r, el.getAttribute('data-i'), e.rac); });
    $$('[data-c]').forEach(function (el) { var i = r.porK[el.getAttribute('data-c')]; el.textContent = cantidad(r, i, e.rac) || 'al gusto'; });
    $$('[data-n]').forEach(function (el) { el.textContent = etiquetaIng(r, r.porK[el.getAttribute('data-n')], e.rac); });
    $('#d-rac').textContent = coma(e.rac);
    var nr = $('#nota-rac'); if (nr) nr.hidden = e.rac !== r.notaRac[0];
  }
  function pintaHechos() {
    var r = actual; if (!r) return;
    var e = est(r), c = calcula(r, e), hechos = 0;
    $$('.paso[data-key]').forEach(function (art) {
      var k = +art.getAttribute('data-key').split(':')[1], on = e.hechos.indexOf(k) > -1;
      art.classList.toggle('hecha', on);
      var b = $('.hecho', art); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    c.pasos.forEach(function (p) { if (e.hechos.indexOf(p.key) > -1) hechos++; });
    var pr = $('#progreso'); if (pr) pr.textContent = hechos + ' de ' + c.pasos.length + ' hechos';
    var nr = $('#nota-rac'); if (nr) nr.hidden = e.rac !== r.notaRac[0];
  }

  /* ---------- Temporizadores ---------- */
  var T = store.get('timers', {}) || {};
  Object.keys(T).forEach(function (k) { var t = T[k]; if (!t || !/^(marcha|pausa|listo)$/.test(t.e) || !porId[k.split(':')[0]]) delete T[k]; });
  var arranque = Date.now();
  Object.keys(T).forEach(function (k) { if (T[k].e === 'marcha' && T[k].fin <= arranque) T[k].e = 'listo'; });
  function guardaT() { store.set('timers', T); }
  function fmt(s) { s = Math.max(0, Math.ceil(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h ? h + ':' + pad(m) + ':' + pad(x) : m + ':' + pad(x); }
  function pasoDeClave(k) {
    var p = k.split(':'), r = porId[p[0]]; if (!r) return null;
    var e = est(r), ps = pasosDe(r, metodo(r, e));
    for (var i = 0; i < ps.length; i++) if (ps[i].key === +p[1]) return { r: r, p: ps[i] };
    return null;
  }
  function restante(k, now, seg) { var t = T[k]; if (!t) return seg * 1000; if (t.e === 'marcha') return Math.max(0, t.fin - now); if (t.e === 'pausa') return t.resto; return 0; }
  var ctx = null, alarmaId = null, alarmaHasta = 0;
  function desbloquea() { try { if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); } if (ctx && ctx.state === 'suspended') ctx.resume(); } catch (e) {} }
  function pitido(t0, f) { try { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f, t0); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.3, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .3); o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + .32); } catch (e) {} }
  function suena() { if (ctx) { var t = ctx.currentTime + .02; pitido(t, 880); pitido(t + .4, 880); pitido(t + .8, 1320); } try { var ua = navigator.userActivation; if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate([250, 120, 250, 120, 500]); } catch (e) {} }
  function hayListos() { return Object.keys(T).some(function (k) { return T[k].e === 'listo'; }); }
  function revisaAlarma() {
    if (hayListos()) {
      if (!alarmaId) { alarmaHasta = Date.now() + 60000; suena(); alarmaId = setInterval(function () { if (!hayListos() || Date.now() > alarmaHasta) { clearInterval(alarmaId); alarmaId = null; return; } suena(); }, 2500); }
    } else if (alarmaId) { clearInterval(alarmaId); alarmaId = null; }
  }
  function pulsa(k, seg) {
    desbloquea();
    var t = T[k], now = Date.now();
    if (!t) { if (!seg) { var pp = pasoDeClave(k); seg = pp && pp.p.tim ? pp.p.tim * 60 : 0; } if (!seg) return; T[k] = { e: 'marcha', fin: now + seg * 1000, total: seg * 1000 }; }
    else if (t.e === 'marcha') { t.e = 'pausa'; t.resto = Math.max(0, t.fin - now); }
    else if (t.e === 'pausa') { t.e = 'marcha'; t.fin = now + t.resto; }
    else delete T[k];
    guardaT(); revisaAlarma(); pintaTimers();
  }
  function mas5(k) { var t = T[k], now = Date.now(); if (!t) return; if (t.e === 'listo') T[k] = { e: 'marcha', fin: now + 300000, total: 300000 }; else if (t.e === 'marcha') { t.fin += 300000; t.total += 300000; } else { t.resto += 300000; t.total += 300000; } guardaT(); revisaAlarma(); pintaTimers(); }
  function reinicia(k) { delete T[k]; guardaT(); revisaAlarma(); pintaTimers(); }
  function pintaTimers() {
    var now = Date.now();
    $$('.temporizador').forEach(function (box) {
      var k = box.getAttribute('data-t'), seg = +box.getAttribute('data-seg'), t = T[k], e = t ? t.e : 'parado', r = restante(k, now, seg);
      box.setAttribute('data-estado', e);
      $('.t-txt', box).textContent = e === 'listo' ? '¡Tiempo!' : fmt(r / 1000);
      $('.t-est', box).textContent = e === 'pausa' ? 'En pausa' : '';
      var lab = e === 'parado' ? 'Iniciar temporizador de ' + durTxt(seg / 60) : e === 'marcha' ? 'Pausar temporizador' : e === 'pausa' ? 'Reanudar temporizador' : 'Parar la alarma';
      var b = $('.t-btn', box); if (b.getAttribute('aria-label') !== lab) b.setAttribute('aria-label', lab);
      $('.t-extra', box).hidden = !t;
      $('.t-reset', box).hidden = !(e === 'marcha' || e === 'pausa');
      $('.t-progreso', box).hidden = !(e === 'marcha' || e === 'pausa');
      if (t && t.total) $('.t-progreso i', box).style.width = Math.max(0, Math.min(100, (1 - r / t.total) * 100)).toFixed(2) + '%';
    });
    pintaDock(now);
  }
  function orden(k) { var t = T[k]; return t.e === 'listo' ? -1 : t.e === 'marcha' ? 1 + t.fin / 1e13 : 2; }
  function pintaDock(now) {
    var ks = Object.keys(T), dock = $('#dock');
    if (!ks.length) { dock.hidden = true; return; }
    ks.sort(function (a, b) { return orden(a) - orden(b); });
    var k = ks[0], t = T[k], info = pasoDeClave(k);
    dock.hidden = false;
    dock.setAttribute('data-estado', t.e); dock.setAttribute('data-k', k);
    $('#dock-paso').textContent = (info ? 'Paso ' + info.p.n + ' · ' + info.r.n : 'Temporizador') + (ks.length > 1 ? ' · y ' + (ks.length - 1) + ' más' : '');
    $('#dock-nombre').textContent = info ? info.p.t : '';
    $('#dock-tiempo').textContent = t.e === 'listo' ? '¡Tiempo!' : fmt((t.e === 'marcha' ? Math.max(0, t.fin - now) : t.resto) / 1000);
    $('#dock-accion').textContent = t.e === 'listo' ? 'Parar' : t.e === 'marcha' ? 'Pausar' : 'Seguir';
  }
  function tick() {
    var now = Date.now(), fin = [];
    Object.keys(T).forEach(function (k) { var t = T[k]; if (t.e === 'marcha' && t.fin <= now) { t.e = 'listo'; fin.push(k); } });
    if (fin.length) {
      guardaT();
      var info = pasoDeClave(fin[0]);
      $('#aviso-vivo').textContent = (info ? info.r.n + ', paso ' + info.p.n + ' (' + info.p.t + ')' : 'Temporizador') + ': se acabó el tiempo.';
      revisaAlarma();
    }
    pintaTimers();
  }

  /* ---------- Pantalla encendida ---------- */
  var bloqueo = null, quiereBloqueo = false;
  function pidePantalla(silencioso) {
    if (!('wakeLock' in navigator)) { if (!silencioso) noPantalla(); return; }
    navigator.wakeLock.request('screen').then(function (l) {
      bloqueo = l; var st = $('#pantalla-estado'); if (st && !silencioso) st.textContent = 'La pantalla no se apagará mientras tengas el recetario abierto.';
      l.addEventListener('release', function () { bloqueo = null; });
    }).catch(function () { if (!silencioso) noPantalla(); });
  }
  function noPantalla() { quiereBloqueo = false; var i = $('#pantalla'); if (i) i.checked = false; var st = $('#pantalla-estado'); if (st) st.textContent = 'Aquí no se puede mantener la pantalla encendida. Alarga el bloqueo automático en los ajustes del móvil.'; }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { if ((quiereBloqueo || cocina) && !bloqueo) pidePantalla(true); tick(); } });

  /* ---------- Modo cocina ---------- */
  var cocina = null;
  function abreCocina(r) {
    var e = est(r), c = calcula(r, e), i = 0;
    for (; i < c.pasos.length; i++) if (e.hechos.indexOf(c.pasos[i].key) < 0) break;
    cocina = { r: r, i: Math.min(i, c.pasos.length - 1) };
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('con-cocina');
    $('#cocina').hidden = false; $('#cocina-nav').hidden = false;
    if (!bloqueo) pidePantalla(true);
    pintaCocina();
    $('.cocina-cerrar').focus();
  }
  function cierraCocina() {
    cocina = null;
    document.documentElement.style.overflow = '';
    document.body.classList.remove('con-cocina');
    $('#cocina').hidden = true; $('#cocina-nav').hidden = true;
    if (bloqueo && !quiereBloqueo) { try { bloqueo.release(); } catch (e) {} bloqueo = null; }
    if (actual) { pintaHechos(); pintaTimers(); }
  }
  function pintaCocina() {
    var r = cocina.r, e = est(r), c = calcula(r, e), p = c.pasos[cocina.i];
    $('#cocina').innerHTML = '<div class="cocina-in"><div class="cocina-cab"><div><b>' + esc(r.n) + '</b><span class="eti num">Paso ' + p.n + ' de ' + c.pasos.length + ' · ' + esc(hora(p.ini)) + '</span></div><button type="button" class="cocina-cerrar">Cerrar</button></div>' +
      '<div class="cocina-progreso" aria-hidden="true">' + c.pasos.map(function (q, i) { return '<i class="' + (i === cocina.i ? 'ahora' : e.hechos.indexOf(q.key) > -1 ? 'ya' : '') + '"></i>'; }).join('') + '</div>' +
      htmlPaso(r, p, e.rac, 'c') + '</div>';
    $('#cocina').scrollTop = 0;
    $('#c-ant').disabled = cocina.i === 0;
    $('#c-sig').textContent = cocina.i === c.pasos.length - 1 ? 'Terminar y sellar' : 'Hecho, siguiente';
    var hk = $('#cocina .paso'); if (hk) { var k = +hk.getAttribute('data-key').split(':')[1]; hk.classList.toggle('hecha', e.hechos.indexOf(k) > -1); var b = $('.hecho', hk); if (b) b.setAttribute('aria-pressed', e.hechos.indexOf(k) > -1 ? 'true' : 'false'); }
    pintaTimers();
  }
  function marcaHecho(r, k, valorForzado) {
    var e = est(r), i = e.hechos.indexOf(k);
    if (valorForzado === true) { if (i < 0) e.hechos.push(k); }
    else if (i > -1) e.hechos.splice(i, 1); else e.hechos.push(k);
    guarda(r, e);
  }
  var toastId = null;
  function aviso(txt) {
    var t = $('#toast');
    if (!t) { document.body.insertAdjacentHTML('beforeend', '<div id="toast" role="status" style="position:fixed;left:50%;top:calc(14px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:50;background:var(--tinta);color:var(--papel);padding:10px 18px;border-radius:999px;font-weight:800;box-shadow:var(--sombra);max-width:calc(100% - 32px);text-align:center"></div>'); t = $('#toast'); }
    t.textContent = txt; t.hidden = false;
    clearTimeout(toastId); toastId = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function sella(r, forzar) {
    if (cocinados[r.id] && !forzar) delete cocinados[r.id];
    else cocinados[r.id] = Date.now();
    store.set('cocinados', cocinados);
    if (cocinados[r.id]) {
      var g = REG[r.regs[0]];
      aviso(g ? '¡Sellado! ' + g.n + ' ya está en tu pasaporte.' : '¡Sellado en tu pasaporte!');
    }
    $$('[data-cocinado]').forEach(function (b) { b.setAttribute('aria-pressed', cocinados[r.id] ? 'true' : 'false'); b.textContent = cocinados[r.id] ? 'Sellado en el pasaporte' : '¡Lo he cocinado!'; });
  }

  /* ---------- Rutas ---------- */
  function ruta() {
    var id = decodeURIComponent(location.hash.slice(1)).replace(/^\//, '');
    if (id.indexOf('receta/') === 0) id = id.slice(7);
    if (cocina) cierraCocina();
    if (id && porId[id]) {
      $('#vista-indice').hidden = true; $('#vista-receta').hidden = false;
      vistaReceta(id); window.scrollTo(0, 0);
    } else {
      actual = null;
      $('#vista-receta').hidden = true; $('#vista-indice').hidden = false;
      vistaIndice();
    }
  }
  function ir(id) { if (('#' + id) === location.hash || (!id && !location.hash)) ruta(); else location.hash = id ? id : ''; }
  window.addEventListener('hashchange', ruta);

  /* ---------- Eventos ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-ir],[data-reg],#ver-espana,[data-cat],[data-tiempo],[data-tb],[data-tm],[data-tr],[data-hecho],[data-cocina],[data-cocinado],[data-reset],[data-comprar],[data-compra],[data-vaciar],[data-fav],#ver-favs,#ahora,.cocina-cerrar,#c-ant,#c-sig,#dock-accion,#dock-ir');
    if (!t) return;
    if (t.hasAttribute('data-ir')) { ir(t.getAttribute('data-ir')); return; }
    if (t.hasAttribute('data-reg')) { var g = t.getAttribute('data-reg'); regionSel = regionSel === g ? null : g; verEspana = false; refrescaMapa(); return; }
    if (t.id === 'ver-espana') { verEspana = !verEspana; regionSel = null; refrescaMapa(); return; }
    if (t.hasAttribute('data-cat')) { filtro.cat = t.getAttribute('data-cat'); $$('[data-cat]').forEach(function (b) { b.setAttribute('aria-pressed', b === t ? 'true' : 'false'); }); pintaFichas(); return; }
    if (t.hasAttribute('data-tiempo')) { filtro.t = t.getAttribute('data-tiempo'); $$('[data-tiempo]').forEach(function (b) { b.setAttribute('aria-pressed', b === t ? 'true' : 'false'); }); pintaFichas(); return; }
    if (t.hasAttribute('data-tb')) { var box = t.closest('.temporizador'); pulsa(t.getAttribute('data-tb'), +box.getAttribute('data-seg')); return; }
    if (t.hasAttribute('data-tm')) { mas5(t.getAttribute('data-tm')); return; }
    if (t.hasAttribute('data-tr')) { reinicia(t.getAttribute('data-tr')); return; }
    if (t.hasAttribute('data-hecho')) { var p = t.getAttribute('data-hecho').split(':'); marcaHecho(porId[p[0]], +p[1]); if (cocina) pintaCocina(); else pintaHechos(); return; }
    if (t.hasAttribute('data-fav')) { if (favs[actual.id]) delete favs[actual.id]; else favs[actual.id] = Date.now(); store.set('favs', favs); t.setAttribute('aria-pressed', !!favs[actual.id]); t.textContent = favs[actual.id] ? '♥ En favoritos' : '♡ Guardar'; return; }
    if (t.id === 'ver-favs') { filtro.fav = !filtro.fav; t.setAttribute('aria-pressed', filtro.fav ? 'true' : 'false'); pintaFichas(); return; }
    if (t.hasAttribute('data-comprar')) {
      var rc = actual, ec = est(rc);
      compra = compra.filter(function (c) { return c.r !== rc.id; });
      rc.ings.forEach(function (i) { if (i.grupo !== undefined || ec.tengo.indexOf(i.k) > -1) return; compra.push({ r: rc.id, t: i.plano ? i.s : frase(rc, i.k, ec.rac) }); });
      store.set('compra', compra);
      aviso('Añadido a la lista de la compra (en la portada).');
      t.textContent = 'Lista de la compra actualizada: añadir de nuevo';
      return;
    }
    if (t.hasAttribute('data-compra')) { var ci = +t.getAttribute('data-compra'); if (compra[ci]) { compra[ci].d = !compra[ci].d; store.set('compra', compra); t.setAttribute('aria-pressed', !!compra[ci].d); } return; }
    if (t.hasAttribute('data-vaciar')) { if (window.confirm('¿Vaciar la lista de la compra?')) { compra = []; store.set('compra', compra); vistaIndice(); } return; }
    if (t.hasAttribute('data-reset')) { if (window.confirm('¿Borrar todos los sellos del pasaporte?')) { cocinados = {}; store.set('cocinados', cocinados); vistaIndice(); } return; }
    if (t.hasAttribute('data-cocina')) { abreCocina(actual); return; }
    if (t.hasAttribute('data-cocinado')) { sella(actual); return; }
    if (t.id === 'ahora') { var r = actual, e = est(r); e.modo = 'inicio'; e.hora = hhmm(ahora(true)); guarda(r, e); $('#modo-inicio').checked = true; $('#hora').value = e.hora; pintaPlan(); return; }
    if (t.classList.contains('cocina-cerrar')) { cierraCocina(); return; }
    if (t.id === 'c-ant') { if (cocina.i > 0) { cocina.i--; pintaCocina(); } return; }
    if (t.id === 'c-sig') {
      var rr = cocina.r, cc = calcula(rr, est(rr)), pp = cc.pasos[cocina.i];
      marcaHecho(rr, pp.key, true);
      if (cocina.i < cc.pasos.length - 1) { cocina.i++; pintaCocina(); }
      else { cierraCocina(); if (!cocinados[rr.id]) sella(rr, true); }
      return;
    }
    if (t.id === 'dock-accion') { pulsa($('#dock').getAttribute('data-k')); return; }
    if (t.id === 'dock-ir') {
      var k = $('#dock').getAttribute('data-k'), info = pasoDeClave(k); if (!info) return;
      if (cocina) cierraCocina();
      var salta = function () { var el = $('#p-' + info.p.key); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
      if (actual !== info.r) { ir(info.r.id); setTimeout(salta, 60); } else salta();
    }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && cocina) { cierraCocina(); return; }
    var t = ev.target;
    if ((ev.key === 'Enter' || ev.key === ' ') && t.classList && t.classList.contains('reg')) { ev.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target, r = actual;
    if (t.name === 'rac' && r) { var e = est(r); e.rac = +t.value; guarda(r, e); pintaCantidades(); return; }
    if (t.name === 'modo' && r) { var e2 = est(r); e2.modo = t.value; guarda(r, e2); pintaPlan(); return; }
    if (t.name === 'met' && r) { var e3 = est(r); e3.met = t.value; guarda(r, e3); var y = window.scrollY; vistaReceta(r.id); window.scrollTo(0, y); return; }
    if (t.id === 'hora' && r) { if (aMin(t.value) !== null) { var e4 = est(r); e4.hora = t.value.slice(0, 5); guarda(r, e4); pintaPlan(); } return; }
    if (t.id === 'pantalla') { desbloquea(); quiereBloqueo = t.checked; if (t.checked) pidePantalla(false); else { if (bloqueo) { try { bloqueo.release(); } catch (e5) {} } bloqueo = null; $('#pantalla-estado').textContent = 'Los temporizadores suenan con la página abierta y la pantalla encendida.'; } return; }
    if (t.type === 'checkbox' && t.closest('.ing-lista') && r) { var e6 = est(r); e6.tengo = $$('.ing-lista input:checked').map(function (x) { return x.value; }); guarda(r, e6); }
  });
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'buscar') { filtro.q = ev.target.value.trim(); pintaFichas(); }
  });
  function refrescaMapa() {
    var caja = $('.mapa-caja'); if (!caja) return;
    caja.innerHTML = svgMapa();
    $('#panel-region').innerHTML = panelRegion();
    $('#ver-espana').setAttribute('aria-pressed', verEspana ? 'true' : 'false');
  }

  fetch('data/recipes.json').then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }).then(function (recetas) {
    R = recetas;
    preparaRecetas();
    ruta();
    setInterval(tick, 250);
  }).catch(function (err) {
    document.getElementById('vista-indice').innerHTML = '<p class="vacio">No se pudieron cargar las recetas (' + esc(err.message) + ').</p>';
  });
})();
