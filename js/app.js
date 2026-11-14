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
  /* Mundo: paises de Natural Earth. Una receta de fuera de España lleva region: w-ISO3 (p. ej. w-IDN para Indonesia). */
  var ESPREG = {}, MUND = {}, MUNDO = window.MUNDO || { vb: [720, 284], paises: [] };
  MAPA.regiones.forEach(function (g) { ESPREG[g.id] = 1; });
  MUNDO.paises.forEach(function (g) { REG[g.id] = g; MUND[g.id] = g; });
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
  var regionSel = null, verEspana = false, vistaMapa = 'es', pasaporteAbierto = false;
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
  var GLOSA = [];
  var LET = 'A-Za-zÁÉÍÓÚÜáéíóúüñÑ';
  function glosa(html, usados) {
    if (!GLOSA.length) return html;
    return html.split(/(<[^>]+>)/).map(function (seg, n) {
      if (n % 2) return seg;
      GLOSA.forEach(function (g) {
        if (usados[g.id]) return;
        seg = seg.replace(g.re, function (m, pre, w) {
          if (usados[g.id]) return m;
          usados[g.id] = 1;
          return pre + '<button type="button" class="term" data-term="' + g.id + '">' + w + '</button>';
        });
      });
      return seg;
    }).join('');
  }
  function termsDe(r) {
    var vistos = {}, out = [];
    r.todos.forEach(function (p) { var h = glosa(esc((p.x || '') + ' ' + (p.ab || '')), {}); h.replace(/data-term="(\w+)"/g, function (m, id) { if (!vistos[id]) { vistos[id] = 1; out.push(id); } }); });
    return out;
  }
  function abreGlosa(id) {
    var g = GLOSA.filter(function (x) { return x.id === id; })[0]; if (!g) return;
    var d = document.getElementById('glosa');
    if (!d) { d = document.createElement('div'); d.id = 'glosa'; document.body.appendChild(d); }
    d.innerHTML = '<div class="glosa-vela" data-glosa-x="1"></div><div class="glosa-hoja" role="dialog" aria-modal="true" aria-labelledby="glosa-t"><h3 id="glosa-t">' + esc(g.t) + '</h3>' +
      '<p><b>Qué es</b>' + esc(g.q) + '</p><p><b>Por qué se hace</b>' + esc(g.p) + '</p><button type="button" class="btn" data-glosa-x="1">Entendido</button></div>';
    d.hidden = false;
  }
  fetch('data/glosario.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (j) {
    GLOSA = j.map(function (g) { g.re = new RegExp('(^|[^' + LET + '])(' + g.f + ')(?![' + LET + '])', 'i'); return g; });
    if (actual && document.getElementById('vista-receta') && !document.getElementById('vista-receta').hidden && actual.id) { try { var y = window.scrollY; vistaReceta(actual.id); window.scrollTo(0, y); } catch (e) {} }
  }).catch(function () {});
  document.addEventListener('click', function (ev) {
    var tm = ev.target.closest('.term'); if (tm) { abreGlosa(tm.getAttribute('data-term')); return; }
    if (ev.target.closest('[data-glosa-x]')) { var d = document.getElementById('glosa'); if (d) d.hidden = true; }
  });
  var CANT = /(\d+(?:[.,]\d+)?(?:[-–]\d+(?:[.,]\d+)?)?)(\s(?:kg|g|ml|cl|litros?|l|cucharad(?:as?|itas?)|cdas?|cdtas?|vasos?|dientes?)\b)/g;
  function negrita(h) { return h.replace(CANT, '<span class="q q-t">$1$2</span>'); }
  function texto(r, t, rac, usados) {
    return glosa(negrita(esc(t)).replace(/\{(\w+)\}/g, function (m, k) { return r.porK[k] ? '<span class="q" data-i="' + k + '">' + esc(frase(r, k, rac)) + '</span>' : m; }), usados || {});
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
    // Pasos que caben mientras otro sigue solo (par): los siguientes cuyo tiempo suma menos que la espera
    out.forEach(function (p, i) {
      if (!p.par || !p.tim) return;
      var acu = 0, lista = [], j, q;
      for (j = i + 1; j < out.length; j++) {
        q = out[j];
        if (q.w || q.post || acu + (q.m || 0) > p.tim) break;
        acu += q.m || 0; lista.push(q);
      }
      if (!lista.length) return;
      p.cons = lista.map(function (q) { return { n: q.n, t: q.t, m: q.m, key: q.key }; });
      lista.forEach(function (q) { q.enpar = { n: p.n, t: p.t, tim: p.tim }; });
    });
    return out;
  }
  function calcula(r, e, met) {
    var pasos = pasosDe(r, met !== undefined ? met : metodo(r, e)), pre = 0, tot = 0, esp = 0, post = 0;
    pasos.forEach(function (p) { if (p.pre) pre += p.m; else if (p.post) post += p.m; else { tot += p.m; if (p.w) esp += p.m; } });
    var h = aMin(e.hora); if (h === null) h = ahora(true);
    var ss = typeof SES !== 'undefined' && SES[r.id], ini, t;
    if (ss) { var di = new Date(ss.ini); h = di.getHours() * 60 + di.getMinutes(); ini = h; }
    else ini = e.modo === 'fin' ? h - tot : h;
    t = ini - pre;
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
    ids.forEach(function (id) { var r = porId[id]; cat[r.cat] = (cat[r.cat] || 0) + 1; r.regs.forEach(function (g) { if (ESPREG[g]) regs[g] = 1; }); });
    return { ids: ids, n: ids.length, cat: cat, regs: Object.keys(regs).length };
  }
  function recetasDe(g) { return R.filter(function (r) { return r.regs.indexOf(g) > -1; }); }


  /* ---------- Donde comprar: opcion facil y opcion mejor, por tipo de ingrediente ---------- */
  var DONDE = [
    ['embutido', /chorizo|morcilla|jam[oó]n|tocino|panceta|torrezno|cecina|salchicha|longaniza/, 'Súper', 'Charcutería'],
    ['carne', /cordero|lechazo|ternasco|lechal|costilla|morro|callos|pollo|ternera|cerdo|conejo|rabo|lac[oó]n|carne|chuleta|hueso|pavo/, 'Súper', 'Carnicería'],
    ['pescado', /bacalao|at[uú]n|bonito|pulpo|pescado|morralla|anchoa|merluza|calamar|gamba|sepia|mejill/, 'Súper', 'Pescadería'],
    ['legumbre', /soja|garbanzo|alubia|lenteja|almorta|fabes|fabas?\b|fabada|jud[ií]as? seca|habas secas/, 'Súper', 'Tienda a granel o gourmet'],
    ['arroz', /arroz|bomba|fideo|pasta/, 'Súper', 'Tienda gourmet (D.O.)'],
    ['especia', /piment[oó]n|azafr[aá]n|[ñn]ora|laurel|canela|pimienta|guindilla|romero|comino|clavo|tomillo|oreg[aá]no|nuez moscada|c[uú]rcuma/, 'Súper', 'Herbolario o especias'],
    ['aceite', /aceite|vinagre|vino|brandy|jerez|sidra/, 'Súper', 'Cooperativa o bodega'],
    ['huevo', /huevo|yema|leche|nata|mantequilla|queso|yogur/, 'Súper', 'Mercado (de payés)'],
    ['verdura', /cebolla|pimiento|tomate|ajo|patata|papa|calabac|berenjena|berza|col\b|coliflor|puerro|zanahoria|perejil|lim[oó]n|pepino|escarola|jud[ií]a|apio|espinaca|borraja|garrofó|nabo|chirivía|cilantro|jengibre|alcachofa|calabaza|naranja|manzana|uva/, 'Súper', 'Mercado o verdulería'],
    ['despensa', /almendra|avellana|aceituna|olivas?\b|maicena|\bron\b|an[ií]s|nuez|pasas|pi[ñn]ones/, 'Súper', 'Tienda gourmet'],
    ['panaderia', /pan\b|picatoste|harina|az[uú]car|levadura|sobao|galleta|masa/, 'Súper', 'Panadería']
  ];
  var MAPAQ = { embutido: 'charcutería', carne: 'carnicería', pescado: 'pescadería', legumbre: 'tienda de legumbres a granel', arroz: 'tienda gourmet', especia: 'herbolario especias', aceite: 'bodega aceite', huevo: 'mercado huevos', verdura: 'mercado verdulería', despensa: 'tienda gourmet', panaderia: 'panadería' };
  /* Por tu barrio: listas curadas por zona. Para anadir una zona: un objeto en ZONAS con su caja (lat/lon) y sus sitios verificados. */
  var ZONAS = [];
  var zona = store.get('zona', null); // { id: null, nombre: 'texto' }, sin coordenadas
  var geoEstado = ''; // '', 'buscando', 'denegada', 'error'
  function zonaCurada() { return zona && zona.id ? ZONAS.filter(function (z) { return z.id === zona.id; })[0] || null : null; }
  function barrioInner(cats) {
    var z = zonaCurada();
    if (!z) {
      var msg = geoEstado === 'buscando' ? 'Buscando dónde estás…' : geoEstado === 'denegada' ? 'Sin tu ubicación no puedo saber tu barrio. Los enlaces «mejor» de cada ingrediente abren Google Maps cerca de ti igualmente.' : geoEstado === 'error' ? 'No he podido saber tu zona ahora. Los enlaces «mejor» de cada ingrediente abren Google Maps cerca de ti.' : 'Si me dejas usar tu ubicación, te enseño tiendas de tu barrio cuando tengamos una lista verificada para tu zona.';
      return '<p class="ayuda">' + msg + '</p>' + (geoEstado === 'buscando' ? '' : '<button type="button" class="btn sec" data-geo="1">Usar mi ubicación</button>');
    }
    var vistos = {}, h = '';
    cats.forEach(function (c) {
      var l = z.lugares[c]; if (!l || !l.length || vistos[c]) return; vistos[c] = 1;
      h += '<p class="eti">' + esc(DONDE.filter(function (d) { return d[0] === c; })[0][3]) + '</p><ul class="barrio-lista">' + l.map(function (p) {
        return '<li><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p[0] + ' ' + z.nombre) + '" target="_blank" rel="noopener"><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></a></li>';
      }).join('') + '</ul>';
    });
    return (h || '<p class="ayuda">Para esto usa el enlace «mejor» de cada ingrediente (Google Maps).</p>') + '<p class="ayuda">' + esc(z.nota) + '</p><button type="button" class="reiniciar" data-geo="1">Actualizar mi ubicación</button>';
  }
  var MOSTRAR_BARRIO = true; // la lista curada solo sale si la ubicacion cae en una zona verificada
  function barrioHTML(cats) {
    if (!MOSTRAR_BARRIO) return '';
    var uniq = cats.filter(function (c, n) { return cats.indexOf(c) === n; });
    if (!uniq.length) return '';
    if (zona && !zonaCurada()) return ''; // zona conocida sin lista verificada: solo enlaces a Maps
    var z = zonaCurada();
    return '<details class="barrio" data-cats="' + uniq.join(',') + '"><summary>' + (z ? 'Por tu barrio (' + esc(z.nombre) + ')' : 'Tiendas cerca de ti') + '</summary><div class="barrio-cuerpo">' + barrioInner(uniq) + '</div></details>';
  }
  function barrioRepinta() {
    $$('.barrio').forEach(function (d) {
      var z = zonaCurada();
      if (zona && !z) { d.remove(); return; }
      d.querySelector('summary').textContent = z ? 'Por tu barrio (' + z.nombre + ')' : 'Tiendas cerca de ti';
      d.querySelector('.barrio-cuerpo').innerHTML = barrioInner(d.getAttribute('data-cats').split(','));
    });
  }
  function nombreZona(lat, lon) {
    return fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&accept-language=es&lat=' + lat + '&lon=' + lon)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (j) { var a = (j && j.address) || {}; return a.suburb || a.neighbourhood || a.city_district || a.quarter || a.town || a.village || a.city || ''; })
      .catch(function () { return ''; });
  }
  function ubica() {
    if (!navigator.geolocation) { geoEstado = 'error'; barrioRepinta(); return; }
    geoEstado = 'buscando'; barrioRepinta();
    navigator.geolocation.getCurrentPosition(function (pos) {
      var la = pos.coords.latitude, lo = pos.coords.longitude;
      var z = ZONAS.filter(function (q) { return la >= q.caja[0] && lo >= q.caja[1] && la <= q.caja[2] && lo <= q.caja[3]; })[0] || null;
      nombreZona(la, lo).then(function (n) {
        zona = { id: z ? z.id : null, nombre: z ? z.nombre : (n || 'tu zona') };
        store.set('zona', zona); geoEstado = '';
        barrioRepinta();
        if (!z) aviso('Aún no tengo una lista verificada para ' + zona.nombre + '. Usa los enlaces «mejor» para buscar cerca de ti.');
      });
    }, function (err) { geoEstado = err && err.code === 1 ? 'denegada' : 'error'; barrioRepinta(); }, { timeout: 10000, maximumAge: 600000 });
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


  /* ---------- La compra: por receta o como ruta por tiendas ---------- */
  var FRESCO = { embutido: 1, carne: 1, pescado: 1, verdura: 1, huevo: 1, panaderia: 1 };
  var ORDEN_TOUR = ['super', 'especia', 'legumbre', 'arroz', 'aceite', 'despensa', 'panaderia', 'verdura', 'huevo', 'carne', 'embutido', 'pescado']; // lo que no se enfria primero; pescado, lo ultimo
  var cvista = store.get('cvista', 'receta');
  var tprefs = store.get('tprefs', {}) || {};
  var casa = store.get('casa', null); // {lat, lon} solo en este movil
  function normT(t) { return String(t).toLowerCase().replace(/\s+/g, ' ').trim(); }
  function prefDe(cat) { return tprefs[cat] || (FRESCO[cat] ? 'mejor' : 'facil'); }
  function paradaDe(c) {
    var d = dondeCat(c.t);
    if (!d) return { id: 'super', nombre: 'Súper', cat: null };
    var p = prefDe(d[0]);
    if (c.x) p = p === 'mejor' ? 'facil' : 'mejor'; // plan B: la otra opcion
    return p === 'facil' ? { id: 'super', nombre: 'Súper', cat: d[0] } : { id: d[0], nombre: d[3], cat: d[0] };
  }
  function lugarCurado(cat) {
    var z = zonaCurada();
    return z && z.lugares[cat] && z.lugares[cat][0] ? { n: z.lugares[cat][0][0], zona: z.nombre } : null;
  }
  function enlaceParada(p) {
    var lc = p.id !== 'super' ? lugarCurado(p.id) : null;
    var q = lc ? lc.n + ' ' + lc.zona : (p.id === 'super' ? 'supermercado cerca de mí' : MAPAQ[p.id] + ' cerca de mí');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }
  function rutaCompleta(paradas) {
    if (!casa) return '';
    var pts = paradas.filter(function (p) { return p.id !== 'super' && lugarCurado(p.id); }).map(function (p) { var l = lugarCurado(p.id); return l.n + ' ' + l.zona; });
    var u = 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=' + casa.lat + ',' + casa.lon;
    if (pts.length) u += '&origin=' + encodeURIComponent('Mi ubicación') + '&waypoints=' + encodeURIComponent(pts.join('|'));
    return u;
  }

  /* Ruta dentro de la app: tienda mas cercana de cada tipo (Nominatim/OpenStreetMap), ruta a pie (OSRM) y mapa Leaflet */
  var BUSCA = { super: '[shop=supermarket]', especia: '[shop=spices]', legumbre: '[shop=supermarket]', arroz: '[shop=supermarket]', aceite: '[shop=deli]', despensa: '[shop=supermarket]', panaderia: '[shop=bakery]', verdura: '[shop=greengrocer]', huevo: '[shop=greengrocer]', carne: '[shop=butcher]', embutido: '[shop=deli]', pescado: '[shop=seafood]', mk: '[amenity=marketplace]' };
  var cerradas = store.get('cerradas', []) || [];
  var COMPRA_MK = { panaderia: 1, verdura: 1, huevo: 1, carne: 1, embutido: 1, pescado: 1 };
  var rutaCalc = null; // { estado:'buscando'|'lista'|'error', msg, ... }
  function metros(a, b, c, d) { var R0 = 6371000, r = Math.PI / 180, dl = (c - a) * r, dn = (d - b) * r; var x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dn / 2) * Math.sin(dn / 2); return 2 * R0 * Math.asin(Math.sqrt(x)); }
  function conTope(p, ms) { return new Promise(function (ok, ko) { var t = setTimeout(function () { ko(new Error('tiempo')); }, ms); p.then(function (v) { clearTimeout(t); ok(v); }, function (e) { clearTimeout(t); ko(e); }); }); }
  var DIAS = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 0 };
  function diasDe(s) {
    var set = {}, ok = true;
    s.split(',').forEach(function (p) {
      var m = p.trim().match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/);
      if (!m) { ok = false; return; }
      var a0 = DIAS[m[1]], b0 = m[2] ? DIAS[m[2]] : a0, i = a0;
      for (var n = 0; n < 8; n++) { set[i] = 1; if (i === b0) break; i = (i + 1) % 7; }
    });
    return ok ? set : null;
  }
  /* true = abierta ahora, false = cerrada ahora, null = sin datos fiables */
  function abiertaAhora(oh, d) {
    if (!oh) return null; d = d || new Date();
    if (/^\s*24\/7\s*$/.test(oh)) return true;
    var dia = d.getDay(), min = d.getHours() * 60 + d.getMinutes(), hoy = null, algo = false;
    var reglas = oh.split(';');
    for (var i = 0; i < reglas.length; i++) {
      var r = reglas[i].trim(); if (!r) continue;
      if (/PH|SH|week|\[|sunrise|sunset|"/.test(r)) return null;
      var m = r.match(/^([A-Za-z,\-]+)\s+(.+)$/); if (!m) return null;
      var ds = diasDe(m[1]); if (!ds) return null; algo = true;
      if (!ds[dia]) continue;
      if (/^(off|closed)$/i.test(m[2].trim())) { hoy = []; continue; }
      var tr = [];
      var ok = m[2].split(',').every(function (t) { var q = t.trim().match(/^(\d{1,2}):(\d\d)-(\d{1,2}):(\d\d)$/); if (!q) return false; var s0 = +q[1] * 60 + +q[2], e0 = +q[3] * 60 + +q[4]; if (e0 <= s0) e0 = 24 * 60; tr.push([s0, e0]); return true; });
      if (!ok) return null; hoy = tr;
    }
    if (!algo) return null;
    if (hoy === null) return false;
    return hoy.some(function (t) { return min >= t[0] && min < t[1]; });
  }
  function claveT(c) { return c.n + '|' + c.lat.toFixed(3) + '|' + c.lon.toFixed(3); }
  function buscaCaja(id, la, lo, k) {
    var kk = k * 1.33;
    var u = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=40&bounded=1&extratags=1&accept-language=es&q=' + encodeURIComponent(BUSCA[id]) + '&viewbox=' + (lo - kk) + ',' + (la + k) + ',' + (lo + kk) + ',' + (la - k);
    return conTope(fetch(u).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); }), 9000).then(function (arr) {
      var out = [], vistos = {};
      (arr || []).forEach(function (e) {
        var y = +e.lat, x = +e.lon, n = e.name || '';
        if (!n || isNaN(y) || isNaN(x)) return;
        var c = { n: n, lat: y, lon: x, m: Math.round(metros(la, lo, y, x)), oh: (e.extratags && e.extratags.opening_hours) || '' };
        var cl = claveT(c); if (vistos[cl]) return; vistos[cl] = 1;
        out.push(c);
      });
      return out;
    });
  }
  /* quita las descartadas, ordena por distancia y deja las cerradas ahora al final */
  function ordena(arr) {
    var ahora = new Date();
    return arr.filter(function (c) { return cerradas.indexOf(claveT(c)) < 0; }).map(function (c) { c.ab = abiertaAhora(c.oh, ahora); return c; })
      .sort(function (p, q) { return ((p.ab === false) - (q.ab === false)) || (p.m - q.m); });
  }
  /* cajas crecientes: asi el limite de resultados de Nominatim no esconde las tiendas mas cercanas */
  function candidatas(id, la, lo) {
    var cajas = [0.005, 0.01, 0.02];
    function paso(i) {
      return buscaCaja(id, la, lo, cajas[i]).then(function (r) {
        if (r.length >= 5 || i === cajas.length - 1) return r;
        return dormir(1100).then(function () { return paso(i + 1); });
      });
    }
    return paso(0);
  }
  function paradasActivas() {
    var vistos = {}, out = [];
    compra.forEach(function (c) { if (c.d) return; var p = paradaDe(c); if (!vistos[p.id]) { vistos[p.id] = p; } });
    ORDEN_TOUR.forEach(function (id) { if (vistos[id]) out.push(vistos[id]); });
    return out;
  }
  function dormir(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function calculaRuta() {
    if (!navigator.geolocation) { rutaCalc = { estado: 'error', msg: 'Este navegador no da la ubicación.' }; repintaCompra(); return; }
    rutaCalc = { estado: 'buscando', msg: 'Buscando tu ubicación…' }; repintaCompra();
    var tope = setTimeout(function () { if (rutaCalc && rutaCalc.estado === 'buscando' && !rutaCalc.ya) { rutaCalc = { estado: 'error', msg: 'La ubicación tarda demasiado. Mira que el navegador tenga permiso de ubicación para esta web.' }; repintaCompra(); } }, 15000);
    navigator.geolocation.getCurrentPosition(function (pos) {
      clearTimeout(tope);
      var la = Math.round(pos.coords.latitude * 1e5) / 1e5, lo = Math.round(pos.coords.longitude * 1e5) / 1e5;
      var ps = paradasActivas(), res = [], mio = rutaCalc = { estado: 'buscando', ya: true, msg: 'Buscando las tiendas más cercanas…' };
      var hayMk = ps.filter(function (p) { return COMPRA_MK[p.id]; }).length >= 2, total = ps.length + (hayMk ? 1 : 0), hechos = 0, mkRaw = [];
      repintaCompra();
      var cadena = Promise.resolve();
      var avanza = function () { hechos++; if (rutaCalc === mio) { mio.msg = 'Buscando las tiendas más cercanas… (' + hechos + '/' + total + ')'; var el = document.getElementById('ruta-msg'); if (el) el.textContent = mio.msg; } };
      if (hayMk) cadena = cadena.then(function () { return candidatas('mk', la, lo); }).then(function (r) { mkRaw = r; }, function () { mkRaw = []; }).then(avanza);
      ps.forEach(function (p) {
        cadena = cadena.then(function () { return dormir(1100); }).then(function () { return candidatas(p.id, la, lo); }).then(function (r) { return r; }, function () { return []; }).then(function (r) {
          res.push({ id: p.id, nombre: p.nombre, raw: r, alts: [], sel: 0 }); avanza();
        });
      });
      cadena.then(function () {
        if (rutaCalc !== mio) return;
        if (!res.some(function (s) { return s.raw.length; }) && !mkRaw.length) { rutaCalc = { estado: 'error', msg: 'No he encontrado ninguna de esas tiendas cerca de ti. Prueba desde otra zona.' }; repintaCompra(); return; }
        construyeRuta(la, lo, { res: res, mk: { raw: mkRaw, alts: [], sel: 0 }, usaMk: true }, mio);
      });
    }, function (err) { clearTimeout(tope); rutaCalc = { estado: 'error', msg: err && err.code === 1 ? 'Sin permiso de ubicación. En el iPhone: Ajustes > Privacidad y seguridad > Localización > tu navegador > «Al usar la app», y recarga.' : 'No he podido ver tu ubicación ahora. Inténtalo de nuevo.' }; repintaCompra(); }, { timeout: 12000, maximumAge: 60000 });
  }
  /* ordena candidatas, decide si el mercado resuelve varias paradas y calcula el camino a pie */
  function construyeRuta(la, lo, datos, mio) {
    var res = datos.res, mk = datos.mk;
    res.forEach(function (s) { var antes = s.alts[s.sel]; s.alts = ordena(s.raw).slice(0, 6); var ix = antes ? s.alts.map(claveT).indexOf(claveT(antes)) : -1; s.sel = ix > -1 ? ix : 0; });
    var antesM = mk.alts[mk.sel]; mk.alts = ordena(mk.raw).slice(0, 6); var im = antesM ? mk.alts.map(claveT).indexOf(claveT(antesM)) : -1; mk.sel = im > -1 ? im : 0;
    var cubre = res.filter(function (s) { return COMPRA_MK[s.id]; });
    var mkOk = datos.usaMk && mk.alts.length && mk.alts[mk.sel].ab !== false && mk.alts[mk.sel].m <= 1500 && cubre.length >= 2;
    var ents = [], puesto = false;
    res.forEach(function (s) {
      if (mkOk && COMPRA_MK[s.id]) { if (!puesto) { puesto = true; ents.push({ obj: mk, nombre: 'mercado', cubre: cubre.map(function (x) { return { panaderia: 'pan', verdura: 'verdura y fruta', huevo: 'huevos', carne: 'carne', embutido: 'embutidos', pescado: 'pescado' }[x.id]; }).filter(function (v, i, a2) { return a2.indexOf(v) === i; }), mercado: true }); } return; }
      ents.push({ obj: s, nombre: s.nombre, cubre: null });
    });
    var con = [];
    ents.forEach(function (e, i) { var c = e.obj.alts[e.obj.sel]; e.i = i; if (c) con.push({ i: i, nombre: e.nombre, cubre: e.cubre, mercado: !!e.mercado, lugar: c.n, lat: c.lat, lon: c.lon, m: c.m, ab: c.ab, oh: c.oh }); });
    var pts = [{ lat: la, lon: lo }].concat(con);
    if (casa) pts.push({ lat: casa.lat, lon: casa.lon });
    var mi = mio || rutaCalc;
    var hayMkAlt = mk.alts.length && mk.alts[mk.sel].ab !== false && mk.alts[mk.sel].m <= 1500 && cubre.length >= 2;
    var pidePts = pts.length > 1;
    var go = function (rt) {
      if (rutaCalc !== mi) return;
      rutaCalc = { estado: 'lista', la: la, lo: lo, datos: datos, ents: ents, con: con, casa: !!casa, pts: pts, ruta: rt, cambiando: -1, mkOk: mkOk, hayMkAlt: !!hayMkAlt };
      repintaCompra(); pintaMapaRuta();
    };
    if (!pidePts) { go(null); return Promise.resolve(); }
    var url = 'https://router.project-osrm.org/route/v1/foot/' + pts.map(function (q) { return q.lon + ',' + q.lat; }).join(';') + '?overview=full&geometries=geojson';
    return conTope(fetch(url).then(function (r) { return r.ok ? r.json() : Promise.reject(); }), 10000).then(function (j2) { return j2 && j2.code === 'Ok' ? j2.routes[0] : null; }, function () { return null; }).then(go);
  }
  function recalcula(fn) {
    if (!rutaCalc || rutaCalc.estado !== 'lista') return;
    var d = rutaCalc.datos, la = rutaCalc.la, lo = rutaCalc.lo;
    fn(d);
    var mio = rutaCalc = { estado: 'buscando', ya: true, msg: 'Recalculando la ruta…' };
    repintaCompra(); construyeRuta(la, lo, d, mio);
  }
  function cambiaParada(i, j2) { recalcula(function () { var e = rutaCalc.ents[i]; if (e && e.obj.alts[j2]) e.obj.sel = j2; }); }
  function descartaParada(i) {
    recalcula(function () { var e = rutaCalc.ents[i]; if (!e) return; var c = e.obj.alts[e.obj.sel]; if (c) { cerradas.push(claveT(c)); store.set('cerradas', cerradas); } });
  }
  function cargaLeaflet() {
    if (window.L) return Promise.resolve();
    return new Promise(function (ok, ko) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l);
      var s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = ok; s.onerror = function () { ko(new Error('leaflet')); }; document.head.appendChild(s);
    });
  }
  var mapaRuta = null;
  function pintaMapaRuta() {
    var cont = document.getElementById('mapa-ruta'); if (!cont || !rutaCalc || rutaCalc.estado !== 'lista') return;
    cargaLeaflet().then(function () {
      if (mapaRuta) { mapaRuta.remove(); mapaRuta = null; }
      var cont2 = document.getElementById('mapa-ruta'); if (!cont2) return;
      var m = mapaRuta = L.map(cont2, { tap: false, zoomControl: true, attributionControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
      var pts = rutaCalc.pts, lls = pts.map(function (q) { return [q.lat, q.lon]; });
      var linea = rutaCalc.ruta ? rutaCalc.ruta.geometry.coordinates.map(function (c) { return [c[1], c[0]]; }) : lls;
      L.polyline(linea, { color: '#2e4f9e', weight: 5, opacity: .85, dashArray: rutaCalc.ruta ? null : '6 8' }).addTo(m);
      pts.forEach(function (q, i) {
        var ultimo = i === pts.length - 1, esCasa = rutaCalc.casa && ultimo, txt = i === 0 ? 'Tú' : esCasa ? '⌂' : String(i);
        L.marker([q.lat, q.lon], { icon: L.divIcon({ className: '', html: '<span class="pin' + (i === 0 || esCasa ? ' pin-x' : '') + '">' + txt + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] }), keyboard: false }).addTo(m).bindTooltip(i === 0 ? 'Tú' : esCasa ? 'Casa' : (q.lugar || ''));
      });
      m.fitBounds(L.latLngBounds(linea), { padding: [28, 28] });
      setTimeout(function () { m.invalidateSize(); m.fitBounds(L.latLngBounds(linea), { padding: [28, 28] }); }, 250);
    }, function () { var c3 = document.getElementById('mapa-ruta'); if (c3) c3.innerHTML = '<p class="ayuda aviso-err">No he podido cargar el mapa. Las indicaciones de abajo valen igual.</p>'; });
  }
  function fmtD(m) { return m < 1000 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(1).replace('.', ',') + ' km'; }
  function etAb(c) { return c.ab === true ? '<span class="ab-si">Abierta ahora</span>' : c.ab === false ? '<span class="ab-no">Cerrada ahora</span>' : '<span class="ab-na">Sin horario</span>'; }
  function rutaHTML() {
    var h = '<div class="vuelta"><p class="eti">Tu ruta</p>';
    if (!rutaCalc) return h + '<p class="ayuda">Busca la tienda más cercana de cada tipo desde donde estás y te enseña la ruta en un mapa' + (casa ? ', con la vuelta a casa' : '') + '. Si hay un mercado cerca, lo usa para varias paradas a la vez.</p><button type="button" class="btn sec" data-ruta="1">Ver la ruta en el mapa</button>' + (cerradas.length ? '<button type="button" class="reiniciar" data-nocerradas="1">Volver a mostrar las tiendas que descarté (' + cerradas.length + ')</button>' : '') + '</div>';
    if (rutaCalc.estado === 'buscando') return h + '<p class="ayuda" id="ruta-msg">' + esc(rutaCalc.msg) + '</p></div>';
    if (rutaCalc.estado === 'error') return h + '<p class="ayuda aviso-err">' + esc(rutaCalc.msg) + '</p><button type="button" class="btn sec" data-ruta="1">Reintentar</button></div>';
    var legs = rutaCalc.ruta ? rutaCalc.ruta.legs : [], pasos = [];
    rutaCalc.con.forEach(function (s, i) {
      var lg = legs[i], ab = rutaCalc.cambiando === s.i, e = rutaCalc.ents[s.i];
      var li = '<li>Ve ' + (s.mercado ? 'al mercado ' : 'a ') + '<b>' + esc(s.lugar) + '</b> (' + (s.mercado ? esc(s.cubre.join(', ')) : esc(s.nombre.toLowerCase())) + ')' + (lg ? ' · ' + fmtD(lg.distance) + ', ' + Math.max(1, Math.round(lg.distance / 80)) + ' min a pie' : ' · a ' + fmtD(s.m) + ' en línea recta') + ' ' + etAb(s) +
        '<span class="fila-ac"><button type="button" class="cambia" data-cambia="' + s.i + '" aria-expanded="' + ab + '">' + (ab ? 'Cerrar' : 'Cambiar') + '</button><button type="button" class="cambia" data-cerrada="' + s.i + '">Ya no existe o está cerrada</button></span>';
      if (ab) li += '<ul class="alts">' + (e.obj.alts.length > 1 ? e.obj.alts.map(function (c, q) { return '<li><button type="button" class="alt" data-alt="' + s.i + '|' + q + '" aria-pressed="' + (q === e.obj.sel) + '">' + esc(c.n) + '<span>a ' + fmtD(c.m) + ' · ' + (c.ab === true ? 'abierta' : c.ab === false ? 'cerrada ahora' : 'sin horario') + '</span></button></li>'; }).join('') : '<li class="ayuda">No hay otras opciones cerca.</li>') + '</ul>';
      pasos.push(li + '</li>');
    });
    if (rutaCalc.casa) { var lc = legs[rutaCalc.con.length]; pasos.push('<li>Vuelve a <b>casa</b>' + (lc ? ' · ' + fmtD(lc.distance) + ', ' + Math.max(1, Math.round(lc.distance / 80)) + ' min a pie' : '') + '</li>'); }
    var sin = rutaCalc.ents.filter(function (e) { return !e.obj.alts.length; });
    var tot = rutaCalc.ruta ? '<p class="ayuda">En total: ' + fmtD(rutaCalc.ruta.distance) + ', unos ' + Math.max(1, Math.round(rutaCalc.ruta.distance / 80)) + ' min andando, sin contar las colas.</p>' : '<p class="ayuda">No he podido calcular el camino exacto; la línea punteada une las tiendas.</p>';
    return h + '<div id="mapa-ruta" class="mapa-ruta" aria-label="Mapa de la ruta"></div>' + tot + '<ol class="ruta-res">' + pasos.join('') + '</ol>' +
      (sin.length ? '<p class="ayuda">No he encontrado cerca: ' + sin.map(function (e) { return esc(e.nombre.toLowerCase()); }).join(', ') + '.</p>' : '') +
      '<p class="ayuda">Los horarios vienen de OpenStreetMap y pueden estar desfasados. Si una tienda ya no existe, descártala y no volverá a salir.</p>' +
      (rutaCalc.hayMkAlt ? '<button type="button" class="reiniciar" data-usamk="1">' + (rutaCalc.mkOk ? 'Prefiero tiendas sueltas, no el mercado' : 'Usar el mercado para varias paradas') + '</button>' : '') +
      (rutaCalc.casa ? '' : '<p class="ayuda">Guarda tu casa (abajo) y la ruta termina allí.</p>') +
      '<button type="button" class="reiniciar" data-ruta="1">Recalcular desde donde estoy</button>' + (cerradas.length ? '<button type="button" class="reiniciar" data-nocerradas="1">Volver a mostrar las tiendas que descarté (' + cerradas.length + ')</button>' : '') + '</div>';
  }
  function notasTienda(c) {
    var rr = porId[c.r]; if (!rr || !rr.tienda) return '';
    var t = String(c.t).toLowerCase();
    var ns = rr.tienda.filter(function (n) { return n[2] && n[2].split('|').some(function (k) { return t.indexOf(k.toLowerCase()) > -1; }); });
    return ns.length ? '<div class="nota-t"><b>En la tienda</b>' + ns.map(function (n) { return '<p>' + esc(n[1]) + '</p>'; }).join('') + '</div>' : '';
  }
  /* Consolidar la compra: mismo producto de varias recetas = una linea con el total */
  var UNID = { kg: ['m', 1000], g: ['m', 1], l: ['v', 1000], ml: ['v', 1], cdta: ['cdta', 1], cdtas: ['cdta', 1], cucharadita: ['cdta', 1], cucharaditas: ['cdta', 1], cda: ['cda', 1], cdas: ['cda', 1], cucharada: ['cda', 1], cucharadas: ['cda', 1], vaso: ['vaso', 1], vasos: ['vaso', 1], diente: ['diente', 1], dientes: ['diente', 1], hoja: ['hoja', 1], hojas: ['hoja', 1], rama: ['rama', 1], ramas: ['rama', 1], ramita: ['rama', 1], ramitas: ['rama', 1], pizca: ['pizca', 1], trozo: ['trozo', 1], trozos: ['trozo', 1] };
  var ADJ = /\b(grandes?|peque[nñ]os?|peque[nñ]as?|medianos?|medianas?|maduros?|maduras?|frescos?|frescas?|enteros?|enteras?|limpios?|limpias?)\b/g;
  function sinTildes(s) { return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s; }
  function singular(w) { return w.length > 4 && /es$/.test(w) && /(r|l|n)es$/.test(w) ? w.slice(0, -2) : w.length > 3 && /s$/.test(w) ? w.slice(0, -1) : w; }
  function parseIng(t) {
    var s = String(t).toLowerCase().trim(), q = null, u = '';
    var m = s.match(/^(\d+(?:[.,]\d+)?)\s*/);
    if ((m = s.match(/^½\s*/))) { q = 0.5; s = s.slice(m[0].length); }
    else if (m = s.match(/^(\d+(?:[.,]\d+)?)\s*/)) { q = parseFloat(m[1].replace(',', '.')); s = s.slice(m[0].length); }
    else if ((m = s.match(/^(medio|media)\s+/))) { q = 0.5; s = s.slice(m[0].length); }
    else if ((m = s.match(/^(un|una)\s+/))) { q = 1; s = s.slice(m[0].length); }
    var w = s.match(/^([a-zñáéíóú]+)\b\s*/);
    if (q !== null && w && UNID[w[1]]) { u = UNID[w[1]][0]; q = q * UNID[w[1]][1]; s = s.slice(w[0].length); }
    s = s.replace(/^de\s+/, '').split(/[,(]| en | con /)[0].replace(ADJ, ' ').replace(/\s+/g, ' ').trim();
    var key = sinTildes(s).split(' ').map(singular).join(' ');
    return { q: q, u: u, nom: s, key: key };
  }
  function fmtCant(f) {
    var out = [];
    if (f.m) out.push(f.m >= 1000 ? (Math.round(f.m / 10) / 100).toString().replace('.', ',') + ' kg' : Math.round(f.m) + ' g');
    if (f.v) out.push(f.v >= 1000 ? (Math.round(f.v / 10) / 100).toString().replace('.', ',') + ' l' : Math.round(f.v) + ' ml');
    ['cda', 'cdta', 'vaso', 'diente', 'hoja', 'rama', 'pizca', 'trozo'].forEach(function (k) { if (!f[k]) return; var nn = Math.round(f[k] * 100) / 100, pl = nn !== 1; out.push(String(nn).replace('.', ',') + ' ' + { cda: 'cda', cdta: 'cdta', vaso: pl ? 'vasos' : 'vaso', diente: pl ? 'dientes' : 'diente', hoja: pl ? 'hojas' : 'hoja', rama: pl ? 'ramas' : 'rama', pizca: pl ? 'pizcas' : 'pizca', trozo: pl ? 'trozos' : 'trozo' }[k]); });
    if (f.n) out.push(String(Math.ceil(f.n - 0.001)).replace('.', ','));
    return out.join(' + ');
  }
  function agrupaCompra(its) {
    var gs = [], mapa = {};
    its.forEach(function (x) {
      var p = parseIng(x[0].t), k = p.key || normT(x[0].t);
      if (!mapa[k]) { mapa[k] = { idx: [], items: [], ps: [] }; gs.push(mapa[k]); }
      mapa[k].idx.push(x[1]); mapa[k].items.push(x[0]); mapa[k].ps.push(p);
    });
    gs.forEach(function (g) {
      g.multi = g.items.length > 1 && g.items.some(function (c) { return c.r !== g.items[0].r || normT(c.t) !== normT(g.items[0].t); });
      if (!g.multi) { g.texto = g.items[0].t; return; }
      var f = {}, sin = false;
      g.ps.forEach(function (p) { if (p.q === null) { sin = true; return; } var k = p.u === 'm' ? 'm' : p.u === 'v' ? 'v' : p.u || 'n'; f[k] = (f[k] || 0) + p.q; });
      var noms = g.ps.map(function (p) { return p.nom; }).sort(function (a, b) { return a.length - b.length; });
      var tot = Object.keys(f).reduce(function (a, k) { return a + f[k]; }, 0);
      var nom = (f.n && !Object.keys(f).some(function (k) { return k !== 'n'; }) && f.n > 1) ? noms[noms.length - 1] : (g.ps[0].u ? noms[0] : (f.n > 1 ? noms[noms.length - 1] : noms[0]));
      var cant = fmtCant(f);
      g.texto = (cant ? cant + ' ' : '') + ((cant && (f.m || f.v || f.cda || f.cdta || f.vaso || f.diente || f.hoja || f.rama || f.pizca || f.trozo) && !f.n) ? 'de ' : '') + nom;
      if (!cant) g.texto = nom;
    });
    return gs;
  }
  function trazaGrupo(g) {
    if (!g.multi) return '';
    var porR = {}, ord = [];
    g.items.forEach(function (c) { var rr = porId[c.r]; var n = rr ? rr.n : c.r; if (!porR[n]) { porR[n] = []; ord.push(n); } porR[n].push(c.t); });
    return '<span class="traza">' + ord.map(function (n) { return esc(n) + ': ' + esc(porR[n].join(' + ')); }).join(' · ') + '</span>';
  }
  function notasGrupo(g) {
    var vistos = {}, h = '';
    g.items.forEach(function (c) { var n = notasTienda(c); if (n && !vistos[n]) { vistos[n] = 1; h += n; } });
    return h;
  }
  /* Precios orientativos (referencia por pais; hoy solo Espana) */
  var PRECIOS = null;
  fetch('data/precios.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { PRECIOS = j && j.ES ? j.ES : null; if (PRECIOS && document.getElementById('compra-tarjeta')) repintaCompra(); }).catch(function () {});
  function precioDe(g) {
    if (!PRECIOS) return null;
    var key = parseIng(g.items[0].t).key;
    for (var i = 0; i < PRECIOS.productos.length; i++) {
      var p = PRECIOS.productos[i];
      if (new RegExp(p.re).test(key)) {
        var r = function (x) { return (Math.round(x / 0.05) * 0.05).toFixed(2).replace('.', ','); };
        return { txt: r(p.mayor * PRECIOS.margen[0]) + ' a ' + r(p.mayor * PRECIOS.margen[1]) + ' €/' + p.u };
      }
    }
    return null;
  }
  /* ---------- Mis precios: historial personal ---------- */
  var HIST = store.get('historial', []);
  var STOP = { de: 1, del: 1, la: 1, el: 1, en: 1, al: 1, los: 1, las: 1 };
  function eur(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
  function hkey(n) { return parseIng(n).key; }
  function palabras(k) { return k.split(' ').filter(function (w) { return w && !STOP[w]; }); }
  function coincide(compraKey, histKey) {
    var wc = palabras(compraKey), wh = palabras(histKey);
    if (!wc.length || !wh.length) return false;
    var hEnC = wh.every(function (w) { return wc.indexOf(w) > -1; });
    if (hEnC) return true;
    var cEnH = wc.every(function (w) { return wh.indexOf(w) > -1; });
    return cEnH && wh.length - wc.length <= 1;
  }
  function fechaCorta(f) { var p = String(f).split('-'); return p.length === 3 ? p[2] + '/' + p[1] : f; }
  function grupoHist() {
    var gs = {}, ord = [];
    HIST.forEach(function (e) {
      var k = e.key + '|' + e.u;
      if (!gs[k]) { gs[k] = { k: k, key: e.key, u: e.u, es: [] }; ord.push(gs[k]); }
      gs[k].es.push(e);
    });
    ord.forEach(function (g) {
      g.es.sort(function (a, b) { return a.f < b.f ? 1 : a.f > b.f ? -1 : (b.t || 0) - (a.t || 0); });
      var ps = g.es.map(function (e) { return e.eur / e.cant; });
      g.n = ps.length; g.last = ps[0]; g.min = Math.min.apply(null, ps); g.media = ps.reduce(function (a, b) { return a + b; }, 0) / ps.length;
      g.minE = g.es[ps.indexOf(g.min)];
      g.nombre = g.es[0].prod;
      var porT = {};
      g.es.forEach(function (e) { if (!(e.tienda in porT)) porT[e.tienda] = e.eur / e.cant; });
      g.tiendas = Object.keys(porT).map(function (t) { return [t, porT[t]]; }).sort(function (a, b) { return a[1] - b[1]; });
      g.senal = senalDe(g.last, g);
    });
    ord.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    return ord;
  }
  function senalDe(p, g) {
    if (g.n < 2) return ['nuevo', 'Primer registro'];
    if (p <= g.min + 0.0001) return ['minimo', 'Tu mínimo'];
    if (p <= g.media * 0.93) return ['buen', 'Buen precio'];
    if (p >= g.media * 1.1) return ['caro', 'Caro para ti'];
    return ['normal', 'Normal'];
  }
  function guardaHist() { store.set('historial', HIST); }
  function propioDe(g0) {
    if (!HIST.length) return null;
    var key = parseIng(g0.items[0].t).key, mejor = null;
    grupoHist().forEach(function (g) { if (coincide(key, g.key) && (!mejor || g.n > mejor.n)) mejor = g; });
    return mejor;
  }
  function cantTxt(e) {
    var c = e.cant, u = e.u;
    if (u === 'kg' && c < 1) { c = Math.round(c * 1000); u = 'g'; } else if (u === 'l' && c < 1) { c = Math.round(c * 1000); u = 'ml'; }
    return String(c).replace('.', ',') + ' ' + (u === 'ud' ? 'ud' : u);
  }
  function htmlPropio(g) {
    var p = propioDe(g); if (!p) return '';
    var rango = p.min === p.last && p.n === 1 ? eur(p.last) : (p.n > 1 ? eur(p.min) + ' a ' + eur(Math.max.apply(null, p.es.map(function (e) { return e.eur / e.cant; }))) : eur(p.last));
    return '<div class="precio-p">Tu precio: <b>' + rango + ' €/' + p.u + '</b>' + (p.n > 1 ? ' · media ' + eur(p.media) : '') + (p.tiendas.length > 1 ? ' · más barato en ' + esc(p.tiendas[0][0]) : ' · ' + esc(p.tiendas[0][0])) + ' · última: ' + eur(p.es[0].eur) + ' € por ' + cantTxt(p.es[0]) + '</div>';
  }
  function tiendasConocidas() { var m = {}; HIST.forEach(function (e) { m[e.tienda] = 1; }); return Object.keys(m).sort(); }
  function preciosHTML() {
    var gs = grupoHist(), hoy = new Date(), iso = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
    var buenos = gs.filter(function (g) { return g.n > 1 && (g.senal[0] === 'minimo' || g.senal[0] === 'buen'); });
    var h = '<section class="tarjeta" id="sec-precios" aria-labelledby="t-precios"><div class="seccion-cab"><h2 id="t-precios">Mis precios</h2><span class="ayuda">' + gs.length + ' producto' + (gs.length === 1 ? '' : 's') + '</span></div>' +
      '<p class="ayuda">Apunta lo que pagas y te aviso cuándo está barato, comparando con tus propias compras. Se guarda en este móvil.</p>' +
      (buenos.length ? '<p class="pr-buenos"><b>Ahora con buen precio:</b> ' + buenos.map(function (g) { return esc(g.nombre) + ' (' + eur(g.last) + ' €/' + g.u + ')'; }).join(', ') + '</p>' : '') +
      '<button type="button" class="btn" data-pr="forma" aria-expanded="false">Apuntar un precio</button>' +
      '<form class="pr-form" id="pr-form" hidden autocomplete="off">' +
      '<label>Producto<input name="prod" type="text" list="pr-prods" required placeholder="Ej.: rabo de toro"></label>' +
      '<datalist id="pr-prods">' + gs.map(function (g) { return '<option value="' + esc(g.nombre) + '">'; }).join('') + '</datalist>' +
      '<label>Tienda<input name="tienda" type="text" list="pr-tiendas" required placeholder="Ej.: Carnicería de la esquina"></label>' +
      '<datalist id="pr-tiendas">' + tiendasConocidas().map(function (t) { return '<option value="' + esc(t) + '">'; }).join('') + '</datalist>' +
      '<div class="pr-fila"><label>Pagué (€)<input name="eur" type="text" inputmode="decimal" required placeholder="3,50"></label>' +
      '<label>Por<input name="cant" type="text" inputmode="decimal" required placeholder="0,5"></label>' +
      '<label>Unidad<select name="u"><option value="kg">kg</option><option value="g">g</option><option value="l">litro</option><option value="ml">ml</option><option value="ud">unidad</option></select></label></div>' +
      '<label>Fecha<input name="f" type="date" value="' + iso + '" required></label>' +
      '<p class="pr-msg" id="pr-msg" role="status"></p><button type="submit" class="btn">Guardar</button></form>';
    if (!gs.length) return h + '<p class="ayuda" style="margin-top:12px">Todavía no hay precios apuntados.</p></section>';
    h += '<ul class="pr-lista">' + gs.map(function (g) {
      var s = g.senal;
      return '<li class="pr-it"><button type="button" class="pr-cab" data-pr="det" aria-expanded="false"><span class="pr-n">' + esc(g.nombre) + '</span>' +
        '<span class="pr-u num">' + eur(g.last) + ' €/' + g.u + '</span><span class="pr-badge ' + s[0] + '">' + s[1] + '</span>' +
        '<span class="pr-sub">' + esc(g.es[0].tienda) + (g.n > 1 ? ' · mín ' + eur(g.min) + ' · media ' + eur(g.media) + ' · ' + g.n + ' registros' : '') + (g.tiendas.length > 1 ? ' · más barato: ' + esc(g.tiendas[0][0]) + ' ' + eur(g.tiendas[0][1]) : '') + '</span></button>' +
        '<div class="pr-det" hidden><ul>' + g.es.map(function (e) {
          return '<li><span>' + fechaCorta(e.f) + ' · ' + esc(e.tienda) + '<br><small>' + eur(e.eur) + ' € por ' + String(e.cant).replace('.', ',') + ' ' + e.u + ' = ' + eur(e.eur / e.cant) + ' €/' + e.u + (e.nota ? ' · ' + esc(e.nota) : '') + '</small></span><button type="button" class="pr-borra" data-pr="del" data-id="' + esc(e.id) + '" aria-label="Borrar este precio">Borrar</button></li>';
        }).join('') + '</ul></div></li>';
    }).join('') + '</ul></section>';
    return h;
  }
  function repintaPrecios() { var s = document.getElementById('sec-precios'); if (s) s.outerHTML = preciosHTML(); }
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-pr]'); if (!t) return;
    var a = t.getAttribute('data-pr');
    if (a === 'forma') { var f = document.getElementById('pr-form'); f.hidden = !f.hidden; t.setAttribute('aria-expanded', f.hidden ? 'false' : 'true'); if (!f.hidden) f.querySelector('input').focus(); return; }
    if (a === 'det') { var d = t.nextElementSibling; d.hidden = !d.hidden; t.setAttribute('aria-expanded', d.hidden ? 'false' : 'true'); return; }
    if (a === 'del') {
      var id = t.getAttribute('data-id');
      if (t.getAttribute('data-sure') !== '1') { t.setAttribute('data-sure', '1'); t.textContent = 'Seguro'; return; }
      HIST = HIST.filter(function (e) { return e.id !== id; }); guardaHist(); repintaPrecios(); repintaCompra();
    }
  });
  document.addEventListener('submit', function (ev) {
    var f = ev.target; if (f.id !== 'pr-form') return;
    ev.preventDefault();
    var num = function (v) { return parseFloat(String(v).replace(',', '.')); };
    var m = f.elements, e = num(m.eur.value), c = num(m.cant.value), u = m.u.value, msg = document.getElementById('pr-msg');
    if (!(e > 0) || !(c > 0) || !m.prod.value.trim() || !m.tienda.value.trim()) { msg.textContent = 'Falta el producto, la tienda, el importe o la cantidad.'; return; }
    if (u === 'g') { c = c / 1000; u = 'kg'; } else if (u === 'ml') { c = c / 1000; u = 'l'; }
    var prod = m.prod.value.trim(), key = hkey(prod);
    var previo = grupoHist().filter(function (g) { return g.key === key && g.u === u; })[0];
    var nuevo = { id: 'u' + Date.now().toString(36), t: Date.now(), prod: prod, key: key, tienda: m.tienda.value.trim(), eur: e, cant: c, u: u, nota: '', f: m.f.value };
    var unit = e / c, aviso;
    if (!previo) aviso = 'Guardado. Es el primer precio de ' + prod + ': ' + eur(unit) + ' €/' + u + '.';
    else {
      var s = senalDe(unit, { n: previo.n + 1, min: Math.min(previo.min, unit), media: (previo.media * previo.n + unit) / (previo.n + 1) });
      aviso = 'Guardado: ' + eur(unit) + ' €/' + u + '. ' + (s[0] === 'minimo' ? 'Es tu precio más bajo hasta ahora (antes ' + eur(previo.min) + ').' : s[0] === 'buen' ? 'Por debajo de tu media (' + eur(previo.media) + ').' : s[0] === 'caro' ? 'Más caro que tu media (' + eur(previo.media) + ').' : 'Cerca de tu media (' + eur(previo.media) + ').');
    }
    HIST.push(nuevo); guardaHist(); repintaPrecios(); repintaCompra();
    var mm = document.getElementById('pr-msg'); if (mm) mm.textContent = aviso;
    var bf = document.querySelector('[data-pr="forma"]'); if (bf) { bf.setAttribute('aria-expanded', 'true'); }
    var ff = document.getElementById('pr-form'); if (ff) ff.hidden = false;
  });
  
  /* ---------- Cocinar a la vez: plan combinado ---------- */
  function esEspera(p) { return !!(p.w || (p.m >= 30 && p.e && (p.e.k === 'horno' || p.e.k === 'nevera')) || (p.f === 1 && p.m >= 45)); }
  function pasosPlan(r, met) {
    return pasosDe(r, met).filter(function (p) { return !p.pre && !p.post; }).map(function (p) {
      var esp = esEspera(p), m = p.m || 0, a = esp ? 0 : m, cola = 0;
      if (esp) cola = m; else if (p.par && p.tim && p.tim > m) cola = p.tim - m;
      return { t: p.t, key: p.key, n: p.n, m: m, a: a, cola: cola, esp: esp, par: !!p.par && !esp, enlaza: !!p.enlaza, tras: p.tras, durante: p.durante, horno: typeof p.f === 'string' && p.f.charAt(0) === 'h' || !!(p.e && p.e.k === 'horno') };
    });
  }
  function planVarias(sel, ini, ext) {
    // Planificador por dependencias: cada paso espera a los que necesita (por defecto, el anterior;
    // «tras» lo cambia, «durante» lo hace a la vez que otro), el horno es uno solo y la persona también.
    var rs = sel.map(function (s) {
      var d = s.split('|'), r = porId[d[0]], x0 = ext && ext[d[0]], ps = pasosPlan(r, d[1] || undefined), todos = ps.slice();
      if (x0) {
        ps = ps.filter(function (p) { return x0.h.indexOf(p.key) < 0; });
        if (ps.length && x0.el > 0) { var q0 = ps[0]; q0.m = Math.max(0, q0.m - x0.el); q0.cola = Math.max(0, q0.cola - x0.el); q0.a = q0.esp ? 0 : Math.max(1, q0.a - x0.el); }
      }
      var porN = {}; ps.forEach(function (p, i) { p.idx = i; p.ini = null; porN[p.n] = p; });
      return { r: r, pasos: ps, porN: porN, left: ps.length };
    });
    var out = [], libre = ini, hornoLibre = ini, guard = 0, ultimo = null;
    function dur(p) { return p.esp ? p.m : p.a + p.cola; }
    function fin(p) { return p.ini + dur(p); }
    function deps(x, p) {
      var l = [], i = p.idx, k;
      if (p.tras) p.tras.forEach(function (n) { if (x.porN[n]) l.push([x.porN[n], 1]); });
      else if (p.durante && x.porN[p.durante]) { var tg = x.porN[p.durante]; if (tg.idx > 0) l.push([x.pasos[tg.idx - 1], tg.idx - 1 === i - 1 ? 0 : 1]); }
      else if (i > 0) l.push([x.pasos[i - 1], 0]);
      for (k = 0; k < i - 1; k++) if (x.pasos[k].par) l.push([x.pasos[k], 1]);
      for (k = 0; k < i; k++) { var q = x.pasos[k]; if (q.durante && x.porN[q.durante] && !p.durante && !p.tras) l.push([x.porN[q.durante], 1]); }
      return l;
    }
    function listoEn(x, p) {
      var t = ini, ds = deps(x, p), j;
      for (j = 0; j < ds.length; j++) {
        var d = ds[j][0], full = ds[j][1] || !d.par || d.idx !== p.idx - 1;
        if (d.ini === null) return null;
        t = Math.max(t, full ? fin(d) : d.ini + d.a);
      }
      if (p.durante && x.porN[p.durante]) { var tg = x.porN[p.durante]; if (tg.ini === null) return null; t = Math.max(t, tg.ini, fin(tg) - dur(p)); }
      if (p.horno) t = Math.max(t, hornoLibre);
      return t;
    }
    function restante(x) { var t = 0; x.pasos.forEach(function (p) { if (p.ini === null) t += dur(p); }); return t; }
    while (guard++ < 1000) {
      var cand = [];
      rs.forEach(function (x) { x.pasos.forEach(function (p) { if (p.ini !== null) return; var t = listoEn(x, p); if (t !== null) cand.push({ x: x, p: p, t: t }); }); });
      if (!cand.length) break;
      var ya = cand.filter(function (c) { return c.t <= libre + 0.001; });
      if (!ya.length) { libre = Math.min.apply(null, cand.map(function (c) { return c.t; })); continue; }
      var esperas = ya.filter(function (c) { return c.p.esp; });
      var enl = ya.filter(function (c) { return c.p.idx > 0 && c.x.pasos[c.p.idx - 1].enlaza && ultimo === c.x.pasos[c.p.idx - 1]; });
      var c = esperas.length ? esperas[0] : enl.length ? enl[0] : ya.sort(function (u, v) { return restante(v.x) - restante(u.x); })[0];
      var p = c.p, t0 = Math.max(libre, c.t);
      p.ini = t0;
      out.push({ r: c.x.r, t: p.t, key: p.key, ini: t0, a: p.a, cola: p.cola, esp: p.esp, enlaza: p.enlaza });
      if (p.horno) hornoLibre = t0 + dur(p);
      if (!p.esp) libre = t0 + p.a;
      ultimo = p;
    }
    out.sort(function (a, b) { return a.ini - b.ini; });
    var fn = {}; out.forEach(function (o) { fn[o.r.id] = Math.max(fn[o.r.id] || 0, o.ini + (o.esp ? o.cola + (o.a || 0) : o.a + o.cola)); });
    return { pasos: out, fin: fn };
  }
  function opcionesPlan() {
    var o = '<option value="">Elige una receta</option>';
    R.slice().sort(function (a, b) { return a.n.localeCompare(b.n, 'es'); }).forEach(function (r) {
      if (r.met && r.met.length) r.met.forEach(function (m) { o += '<option value="' + r.id + '|' + m.id + '">' + esc(r.n) + ' · ' + esc(m.n) + '</option>'; });
      else o += '<option value="' + r.id + '|">' + esc(r.n) + '</option>';
    });
    return o;
  }
  function planHTML() {
    var h = ahora(true), ho = hhmm(h);
    return '<section class="tarjeta" id="sec-plan" aria-labelledby="t-plan"><div class="seccion-cab"><h2 id="t-plan">Cocinar a la vez</h2></div>' +
      '<p class="ayuda">Elige dos o tres platos y te monto un solo orden: qué hacer primero y qué dejar al fuego mientras haces lo otro.</p>' +
      '<form class="pr-form" id="plan-form" autocomplete="off">' +
      [1, 2, 3].map(function (n) { return '<label>Plato ' + n + (n === 3 ? ' (opcional)' : '') + '<select name="p' + n + '">' + opcionesPlan() + '</select></label>'; }).join('') +
      '<label>Empiezo a las<input name="h" type="time" value="' + ho + '" required></label>' +
      '<p class="pr-msg" id="plan-msg" role="status"></p><button type="submit" class="btn">Montar el plan</button></form><div id="plan-res"></div></section>';
  }
  function planResultado(sel, ini) {
    var pl = planVarias(sel, ini), colores = {}, k = 0;
    var h = '<ol class="plan-lista">';
    pl.pasos.forEach(function (o) {
      if (colores[o.r.id] === undefined) colores[o.r.id] = k++;
      var fin = o.ini + o.a + o.cola;
      h += '<li class="plan-it c' + colores[o.r.id] + '"><span class="plan-h num">' + hhmm(o.ini) + '</span><div><b>' + esc(o.t) + '</b><small>' + esc(o.r.n) + ' · ' + (o.esp ? 'esperar ' + durTxt(o.cola) + ' (puedes hacer otra cosa)' : durTxt(o.a) + ' contigo' + (o.cola ? ', sigue solo ' + durTxt(o.cola) + ' más' : '')) + '</small></div></li>';
    });
    h += '</ol><p class="plan-fin">' + Object.keys(pl.fin).map(function (id) { return '<b>' + esc(porId[id].n) + '</b> listo hacia las <b>' + hhmm(pl.fin[id]) + '</b>'; }).join(' · ') + '.</p>';
    h += '<p class="ayuda">Orden orientativo: cada fuego y cada cazuela mandan. Si algo se alarga, retrasa lo siguiente.</p>';
    return h;
  }
  document.addEventListener('submit', function (ev) {
    var f = ev.target; if (f.id !== 'plan-form') return;
    ev.preventDefault();
    var sel = ['p1', 'p2', 'p3'].map(function (n) { return f.elements[n].value; }).filter(Boolean);
    var msg = document.getElementById('plan-msg');
    if (sel.length < 2) { msg.textContent = 'Elige al menos dos platos.'; return; }
    msg.textContent = '';
    document.getElementById('plan-res').innerHTML = planResultado(sel, aMin(f.elements.h.value) || ahora(true));
    document.getElementById('plan-res').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  document.addEventListener('click', function (ev) {
    var ir = ev.target.closest('[data-ir-paso]');
    if (ir) { var dest = document.getElementById(ir.getAttribute('data-ir-paso')); if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var t = ev.target.closest('[data-plan-con]'); if (!t) return;
    var id = t.getAttribute('data-plan-con');
    var go = function () {
      var f = document.getElementById('plan-form'); if (!f) return;
      var o = Array.prototype.filter.call(f.elements.p1.options, function (x) { return x.value.indexOf(id + '|') === 0; });
      if (o.length) f.elements.p1.value = o[o.length > 1 ? 1 : 0].value;
      document.getElementById('sec-plan').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    if (location.hash && location.hash !== '#') { location.hash = ''; setTimeout(go, 150); } else go();
  });
  function compraPorReceta() {
    var grupos = {}, orden = [];
    compra.forEach(function (c, n) { if (!grupos[c.r]) { grupos[c.r] = []; orden.push(c.r); } grupos[c.r].push([c, n]); });
    return orden.map(function (rid) { var rr = porId[rid]; return '<p class="eti">' + esc(rr ? rr.n : rid) + '</p><ul class="compra-lista">' + grupos[rid].map(function (p) { return '<li><button type="button" class="compra-it" data-compra="' + p[1] + '" aria-pressed="' + (!!p[0].d) + '">' + esc(p[0].t) + dondeTag(p[0].t, true) + '</button>' + (p[0].d ? '' : notasTienda(p[0])) + '</li>'; }).join('') + '</ul>'; }).join('') +
      barrioHTML(catsDe(compra.map(function (c) { return c.t; })));
  }
  function compraPorTienda() {
    var paradas = {}, cats = {};
    compra.forEach(function (c, n) {
      var p = paradaDe(c);
      if (!paradas[p.id]) paradas[p.id] = { p: p, its: [] };
      paradas[p.id].its.push([c, n]);
      var d = dondeCat(c.t); if (d) cats[d[0]] = d;
    });
    var ids = ORDEN_TOUR.filter(function (id) { return paradas[id]; });
    var h = '<p class="ayuda">Un recorrido: lo que no se enfría primero, el pescado al final. Toca para marcar comprado; si una tienda no lo tiene, «Plan B» lo pasa a la otra opción.</p><ol class="ruta">';
    var plist = [], k = 0, hayPrecio = false;
    ids.forEach(function (id) {
      var P = paradas[id], pend = P.its.filter(function (x) { return !x[0].d; });
      plist.push(P.p);
      var hecha = !pend.length; if (!hecha) k++;
      h += '<li class="parada' + (hecha ? ' hecha' : '') + '"><div class="parada-cab"><span class="parada-n">' + (hecha ? '✓' : k) + '</span><h3>' + esc(P.p.nombre) + '</h3><a class="donde-link" href="' + enlaceParada(P.p) + '" target="_blank" rel="noopener">Mapa</a></div>' +
        '<ul class="compra-lista">' + agrupaCompra(P.its).map(function (g) {
          var c = g.items[0], ids = g.idx.join(','), hecho = g.items.every(function (z) { return z.d; }), px = g.items.some(function (z) { return z.x; });
          return '<li class="pit"><button type="button" class="compra-it" data-compra="' + ids + '" aria-pressed="' + hecho + '">' + esc(g.texto) + (px ? '<span class="donde"><b>Plan B</b></span>' : '') + '</button>' + (hecho ? '' : '<button type="button" class="planb" data-planb="' + ids + '" aria-label="Plan B para ' + esc(g.texto) + '">' + (px ? 'Volver' : 'No lo tienen') + '</button>') + (function () { var pr = precioDe(g); if (pr) hayPrecio = true; return htmlPropio(g) + (pr ? '<div class="precio-o">Precio orientativo: <b>' + pr.txt + '</b></div>' : ''); })() + (g.multi ? '<button type="button" class="desglose" data-desglose="1" aria-expanded="false">De qué recetas ▾</button><div class="desglose-box" hidden>' + trazaGrupo(g) + '</div>' : '') + (hecho ? '' : notasGrupo(g)) + '</li>';
        }).join('') + '</ul></li>';
    });
    h += '</ol>';
    if (hayPrecio && PRECIOS) h += '<p class="aviso-precio">Precios orientativos, ' + esc(PRECIOS.ambito) + ': precio mayorista de ' + esc(PRECIOS.fuente) + ', ' + esc(PRECIOS.semana) + ' (consultado el ' + esc(PRECIOS.consultado) + '), más un margen típico de tienda (×' + String(PRECIOS.margen[0]).replace('.', ',') + ' a ×' + String(PRECIOS.margen[1]).replace('.', ',') + '). Es una estimación, no un precio oficial: un mercado, una tienda de barrio o un producto ecológico pueden salirse del rango.</p>';
    var cl = Object.keys(cats);
    if (cl.length) h += '<details class="elige"><summary>Dónde compro cada cosa</summary><div class="elige-cuerpo">' + cl.map(function (c) {
      var d = cats[c], p = prefDe(c);
      return '<div class="elige-fila"><span>' + esc(d[3].replace(/^Tienda /, 'tienda ').toLowerCase()) + '</span><span class="seg"><button type="button" data-tpref="' + c + '|facil" aria-pressed="' + (p === 'facil') + '">Súper</button><button type="button" data-tpref="' + c + '|mejor" aria-pressed="' + (p === 'mejor') + '">' + esc(d[3]) + '</button></span></div>';
    }).join('') + '</div></details>';
    h += rutaHTML();
    h += '<div class="vuelta">' + (casa ? '<p class="ayuda">Tu casa está guardada en este móvil.</p><button type="button" class="reiniciar" data-casa="1">Cambiar mi casa</button>' : '<p class="eti">Vuelta a casa</p><p class="ayuda">Guarda dónde vives estando en casa y la ruta termina allí. Se queda solo en este móvil.</p><button type="button" class="btn sec" data-casa="1">Guardar mi casa aquí</button>') + '</div>';
    return h;
  }
  function compraVacia() {
    return '<section class="tarjeta" id="compra-tarjeta" aria-labelledby="t-compra"><div class="seccion-cab"><h2 id="t-compra">La compra</h2></div><p class="ayuda">Tu lista está vacía. Abre una receta y toca «Añadir lo que falta a la compra»: aquí saldrá todo junto, y también ordenado por tiendas con la ruta.</p></section>';
  }
  /* Estimacion de bolsas: peso aproximado de lo que falta por comprar */
  function pesoItem(t) {
    var s = String(t).toLowerCase().replace(',', '.');
    var m = s.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/);
    if (m) { var n = parseFloat(m[1]), u = m[2]; return u === 'kg' ? n : u === 'g' ? n / 1000 : u === 'l' ? n : n / 1000; }
    if (/(cdta|cda|cucharad|pizca|hebra|hoja|rama|diente|chorrito|al gusto|sal\b|ramita)/.test(s)) return 0.02;
    m = s.match(/^(\d+(?:\.\d+)?)/);
    return m ? Math.min(parseFloat(m[1]), 12) * 0.2 : 0.2;
  }
  function bolsasInfo() {
    var pend = compra.filter(function (c) { return !c.d; });
    if (!pend.length) return null;
    var kg = 0, vol = 0;
    pend.forEach(function (c) { var w = pesoItem(c.t); kg += w; vol += w < 0.05 ? 0.1 : 1; });
    var n = Math.max(1, Math.ceil(Math.max(kg / 4, vol / 10)));
    var peso = kg < 1 ? 'menos de 1 kg' : 'unos ' + (Math.round(kg * 2) / 2).toString().replace('.', ',') + ' kg';
    var txt = kg >= 12 ? 'Es una compra grande (' + peso + '): lleva un carrito o una mochila grande, además de bolsas.' :
      n === 1 ? 'Te cabe en una bolsa (' + peso + ').' : 'Llévate unas ' + n + ' bolsas' + (n >= 4 ? ' o una mochila' : '') + ' (' + peso + ').';
    return { n: n, kg: kg, txt: txt };
  }
  function compraHTML() {
    if (!compra.length) return compraVacia();
    var v = cvista === 'tienda' ? 'tienda' : 'receta';
    return '<section class="tarjeta" id="compra-tarjeta" aria-labelledby="t-compra"><div class="seccion-cab"><h2 id="t-compra">La compra</h2><span class="ayuda">' + compra.filter(function (c) { return !c.d; }).length + ' por comprar</span></div>' +
      '<div class="seg seg-g" role="group" aria-label="Ver la compra"><button type="button" data-cvista="receta" aria-pressed="' + (v === 'receta') + '">Por receta</button><button type="button" data-cvista="tienda" aria-pressed="' + (v === 'tienda') + '">Por tienda</button></div>' +
      (function () { var b = bolsasInfo(); return b ? '<p class="bolsas"><span aria-hidden="true">🛍️</span> ' + esc(b.txt) + '</p>' : ''; })() +
      (v === 'tienda' ? compraPorTienda() : compraPorReceta()) +
      '<p class="reinicio"><button type="button" class="reiniciar" data-vaciar="1">Vaciar la lista</button></p></section>';
  }
  function repintaCompra() { var s = document.getElementById('compra-tarjeta'); if (s) s.outerHTML = compraHTML(); }
  /* ---------- Portada ---------- */
  function vistaIndice() {
    var c = cuentas();
    var st = document.getElementById('stats');
    if (st) st.innerHTML = '<b>' + R.length + '</b> platos &nbsp;·&nbsp; <b>17</b> comunidades &nbsp;·&nbsp; <b>' + R.reduce(function (a, r) { return a + r.todos.length; }, 0) + '</b> pasos ilustrados';
    var h = '', hp = '', hm = '', hf = '';
    var sigue = R.filter(function (r) { return !cocinados[r.id] && est(r).hechos.length; })[0];
    if (sigue) h += '<section class="tarjeta" aria-label="Sigue donde lo dejaste"><p class="eti">Sigue donde lo dejaste</p><ul class="filas">' + fila(sigue) + '</ul></section>';
    h += compraHTML();
    h += preciosHTML();
    var hoy = new Date(), dnum = Math.floor((hoy.getTime() - hoy.getTimezoneOffset() * 60000) / 86400000);
    var pool = R.filter(function (r) { return !cocinados[r.id]; }); if (!pool.length) pool = R;
    var dia = pool[dnum % pool.length];
    h += '<section class="tarjeta" aria-label="Plato del día"><p class="eti">Plato del día</p><ul class="filas">' + fila(dia) + '</ul></section>';
    hp += '<section class="tarjeta" aria-labelledby="t-pas"><div class="seccion-cab"><h2 id="t-pas">Tu pasaporte</h2><span class="ayuda">Cocina un plato y sella su región</span></div>' +
      '<div class="barras"><div class="barra-fila"><span>Platos</span><span class="barra"><i style="width:' + (c.n / R.length * 100).toFixed(1) + '%"></i></span><span class="num">' + c.n + '/' + R.length + '</span></div>' +
      '<div class="barra-fila"><span>Regiones</span><span class="barra"><i style="width:' + (c.regs / 17 * 100).toFixed(1) + '%"></i></span><span class="num">' + c.regs + '/17</span></div></div>' +
      '<ul class="logros">' + LOGROS.map(function (l) { var si = l[2](c); return '<li class="logro' + (si ? ' si' : '') + '" title="' + esc(l[3].charAt(0).toUpperCase() + l[3].slice(1)) + '"><span class="medalla" aria-hidden="true">' + l[0] + '</span>' + l[1] + '<span class="sr-only">' + (si ? ', conseguido' : ', por conseguir: ' + l[3]) + '</span></li>'; }).join('') + '</ul>' +
      (function () { var sig = LOGROS.filter(function (l) { return !l[2](c); })[0]; return '<p class="siguiente">' + (sig ? 'Siguiente sello: <b>' + esc(sig[1]) + '</b>, ' + esc(sig[3]) + '.' : 'Los tienes todos. La abuela estaría orgullosa.') + '</p>'; })() + (Object.keys(cocinados).length ? '<p class="reinicio"><button type="button" class="reiniciar" data-reset="1">Reiniciar pasaporte</button></p>' : '') + '</section>';
    hm += '<section class="tarjeta" aria-labelledby="t-mapa" id="sec-mapa"><div class="seccion-cab"><h2 id="t-mapa">El mapa</h2><span class="ayuda" id="ayuda-mapa">' + (vistaMapa === 'mundo' ? 'Toca un país' : 'Toca una comunidad') + '</span></div>' +
      '<div class="vista-mapa" role="group" aria-label="Qué mapa ver"><button type="button" class="filtro" data-vista="es" aria-pressed="' + (vistaMapa === 'es') + '">España</button><button type="button" class="filtro" data-vista="mundo" aria-pressed="' + (vistaMapa === 'mundo') + '">Mundo</button></div>' +
      '<div class="mapa-caja">' + svgMapa() + '</div>' +
      '<div class="mapa-leyenda"><span><i style="background:var(--region)"></i>Por cocinar</span><span><i style="background:var(--vino)"></i>Sellada</span><span><i style="background:var(--ocre);border-radius:50%"></i>Todos sus platos hechos</span></div>' +
      '<button type="button" class="chip-es" id="ver-espana"' + (vistaMapa === 'mundo' ? ' hidden' : '') + ' aria-pressed="' + (verEspana ? 'true' : 'false') + '">Y de toda España (' + recetasDe('es').length + ')</button>' +
      '<div class="panel-region" id="panel-region">' + panelRegion() + '</div></section>';
    hf += '<section aria-labelledby="t-fichas" id="sec-fichas" style="display:grid;gap:14px"><div class="seccion-cab"><h2 id="t-fichas" style="font-size:27px">Todos los platos</h2><span class="ayuda num" id="n-fichas"></span></div>' +
      '<div class="filtros"><label class="sr-only" for="buscar">Buscar un plato o ingrediente</label><input class="buscar" id="buscar" type="search" placeholder="Busca un plato o un ingrediente" value="' + esc(filtro.q) + '">' +
      '<div class="chips-fila cats" role="group" aria-label="Tipo de plato">' + CATS.map(function (c) { return '<button type="button" class="filtro" data-cat="' + c[0] + '" aria-pressed="' + (filtro.cat === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div>' +
      '<div class="filtros-mas"><button type="button" class="filtro" id="mas-filtros" aria-expanded="false" aria-controls="filtros-extra">Más filtros</button><button type="button" class="filtro" id="ver-favs" aria-pressed="' + filtro.fav + '">♥ Favoritos</button><button type="button" class="quita" id="quita-filtros" hidden>Quitar filtros</button></div>' +
      '<div class="chips-fila" id="filtros-extra" role="group" aria-label="Tiempo" hidden>' + TIEMPOS.map(function (c) { return '<button type="button" class="filtro" data-tiempo="' + c[0] + '" aria-pressed="' + (filtro.t === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="fichas" id="fichas"></div></section>';
    hf += '<p class="ayuda" style="text-align:center">Tiempos orientativos: cada fuego y cada cazuela mandan.</p>';
    var pas = '<div id="sec-pasaporte"' + (pasaporteAbierto ? '' : ' hidden') + '>' + hp + '<p class="reinicio"><button type="button" class="reiniciar" data-menu="cierra-pas">Cerrar el pasaporte</button></p></div>';
    $('#vista-indice').innerHTML = pas + h + hf + hm;
    pintaFichas();
  }
  function svgMundo() {
    var s = '<svg class="mapa mundo" viewBox="0 0 ' + MUNDO.vb[0] + ' ' + MUNDO.vb[1] + '" role="group" aria-label="Mapa del mundo por países">', con = [];
    MUNDO.paises.forEach(function (g) {
      var rs = g.id === 'w-ESP' ? [] : recetasDe(g.id);
      if (rs.length) con.push(g);
      var hechas = rs.filter(function (r) { return cocinados[r.id]; }).length;
      if (rs.length) s += '<path class="reg-hit" data-reg="' + g.id + '" d="' + g.d + '" aria-hidden="true"/>';
      s += '<path class="reg' + (rs.length ? '' : ' vacia') + (hechas ? ' cocinada' : '') + (regionSel === g.id ? ' sel' : '') + '" data-reg="' + g.id + '" d="' + g.d + '"' + (rs.length || g.id === 'w-ESP' ? ' tabindex="0" role="button"' : ' aria-hidden="true"') + ' aria-label="' + esc(g.n) + (rs.length ? ': ' + rs.length + (rs.length === 1 ? ' plato' : ' platos') : '') + '"><title>' + esc(g.n) + '</title></path>';
    });
    con.forEach(function (g) {
      var rs = recetasDe(g.id), llena = rs.every(function (r) { return cocinados[r.id]; });
      s += '<g class="chapa' + (llena ? ' llena' : '') + '" data-reg="' + g.id + '" transform="translate(' + g.cx + ' ' + g.cy + ')" aria-hidden="true"><circle class="chapa-hit" r="26"/><circle r="9"/><text text-anchor="middle" dy="3.4">' + rs.length + '</text></g>';
    });
    return s + '</svg>';
  }
  function svgMapa() {
    if (vistaMapa === 'mundo') return svgMundo();
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
  function panelMundo() {
    var con = MUNDO.paises.filter(function (g) { return g.id !== 'w-ESP' && recetasDe(g.id).length; });
    var chips = con.length ? '<div class="chips-fila" role="group" aria-label="Países con platos">' + con.map(function (g) { return '<button type="button" class="filtro" data-reg="' + g.id + '" aria-pressed="' + (regionSel === g.id) + '">' + esc(g.n) + ' (' + recetasDe(g.id).length + ')</button>'; }).join('') + '</div>' : '';
    if (!regionSel) return '<p class="ayuda">Los países con platos llevan su número. Toca uno, o toca España para volver al mapa de comunidades.</p>' + chips;
    var g = MUND[regionSel], rs = recetasDe(regionSel);
    if (!g) return chips;
    return chips + '<h3>' + esc(g.n) + '</h3>' + (rs.length ? '<ul class="filas">' + rs.map(fila).join('') + '</ul>' : '<p class="ayuda">Todavía no hay ningún plato de ' + esc(g.n) + '. Llegará.</p>');
  }
  function panelRegion() {
    if (vistaMapa === 'mundo') return panelMundo();
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
    var activos = (filtro.cat !== 'todas') + (filtro.t !== 'todos') + !!filtro.q + !!filtro.fav;
    var qb = $('#quita-filtros'); if (qb) qb.hidden = !activos;
    var mb = $('#mas-filtros'); if (mb) mb.textContent = filtro.t !== 'todos' ? 'Más filtros (1)' : 'Más filtros';
    $('#n-fichas').textContent = lista.length + (lista.length === 1 ? ' plato' : ' platos');
    $('#fichas').innerHTML = lista.length ? lista.map(function (r) {
      var c = resumenFicha(r);
      return '<a class="ficha" href="#' + r.id + '"><div class="ilu">' + ESC.svg(r.heroe, r.n) + (cocinados[r.id] ? '<span class="sello">Hecho</span>' : '') + (favs[r.id] ? '<span class="corazon" aria-label="Favorito">♥</span>' : '') + '</div>' +
        '<div class="cuerpo"><p class="lugar">' + esc(r.lugar) + '</p><h3>' + esc(r.n) + '</h3><p class="sub">' + esc(r.sub) + '</p>' + tbarra(c) +
        '<p class="meta"><span class="num">' + durTxt(c.tot) + '</span><span class="num">' + durTxt(c.tot - c.esp) + ' de trabajo</span>' + (c.pre ? '<span>Empieza la víspera</span>' : '') + '<span>' + dif(r.dif) + '</span></p></div></a>';
    }).join('') : '<p class="vacio">' + (filtro.fav && !Object.keys(favs).length ? 'Todavía no has guardado ningún favorito. Abre un plato y toca «♡ Guardar».' : 'Ningún plato con esos filtros. Toca «Quitar filtros» para verlos todos.') + '</p>';
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
      '<div class="acciones-r"><button type="button" class="btn sec fav-r" data-fav="1" aria-pressed="' + (!!favs[r.id]) + '">' + (favs[r.id] ? '♥ En favoritos' : '♡ Guardar') + '</button><button type="button" class="btn" data-cocina="1"><svg viewBox="0 0 16 16" aria-hidden="true"><use href="#e-play"/></svg>' + (SES[r.id] ? 'Seguir cocinando' : 'Empezar a cocinar') + '</button>' +
      '<button type="button" class="btn sec hecho-r" data-cocinado="1" aria-pressed="' + (!!cocinados[r.id]) + '">' + (cocinados[r.id] ? 'Sellado en el pasaporte' : '¡Lo he cocinado!') + '</button></div></header>';
    // Horario
    var metHTML = r.met ? '<section class="tarjeta" aria-label="Cómo lo vas a hacer"><fieldset class="seg-fs"><legend class="eti">Cómo lo vas a hacer</legend><div class="metodo">' + r.met.map(function (m) {
      return '<input type="radio" name="met" id="met-' + m.id + '" value="' + m.id + '"' + (m.id === met ? ' checked' : '') + '><label for="met-' + m.id + '"><b>' + esc(m.n) + '</b><span>' + esc(m.d) + '</span></label>';
    }).join('') + '</div></fieldset></section>' : '';
    h += metHTML;
    h += '<details class="tarjeta plan" id="plan"><summary><h2 id="t-plan">Organiza el día</h2><span class="resumen-mini" id="resumen-mini">A qué hora empezar</span></summary>' +
      '<div class="fila-hora"><fieldset class="seg-fs"><legend class="sr-only">Qué hora quieres fijar</legend><div class="seg">' +
      '<input type="radio" name="modo" id="modo-inicio" value="inicio"' + (e.modo === 'inicio' ? ' checked' : '') + '><label for="modo-inicio">Empiezo a las</label>' +
      '<input type="radio" name="modo" id="modo-fin" value="fin"' + (e.modo === 'fin' ? ' checked' : '') + '><label for="modo-fin">' + (r.listo ? 'Listo a las' : 'Comemos a las') + '</label></div></fieldset>' +
      '<div class="hora-caja"><input type="time" class="campo-hora" id="hora" aria-label="Hora" value="' + hhmm(c.h) + '"><button type="button" class="btn-sec" id="ahora">Ahora</button></div></div>' +
      '<p class="resumen" id="resumen"></p><p class="antes" id="antes" hidden></p><p class="aviso" id="aviso" hidden></p>' +
      '<div class="crono" aria-hidden="true"><div class="crono-barra" id="crono"></div><div class="crono-horas"><span id="c-ini"></span><span id="c-fin"></span></div></div>' +
      '<ol class="leyenda" id="leyenda"></ol>';
    h += '<label class="interruptor" for="pantalla"><input type="checkbox" id="pantalla" role="switch"' + (bloqueo ? ' checked' : '') + '><span>Mantener la pantalla encendida</span></label>' +
      '<p class="ayuda" id="pantalla-estado">Los temporizadores suenan con la página abierta y la pantalla encendida.</p></details>';
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
    // En la tienda
    if (r.tienda && r.tienda.length) h += '<section class="tarjeta secretos tienda" aria-labelledby="t-tienda"><h2 id="t-tienda">En la tienda</h2><p class="ayuda">Qué pedir en el mostrador.</p><dl>' + r.tienda.map(function (s) { return '<dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join('') + '</dl></section>';
    // Pasos
    h += '<div class="seccion-cab"><h2>Paso a paso</h2><p class="eti num" id="progreso" style="color:var(--ok)"></p></div>';
    r.fases.forEach(function (f, fi) {
      var ps = c.pasos.filter(function (p) { return p.fase === fi; });
      if (!ps.length) return;
      h += '<section class="fase" aria-labelledby="f-' + fi + '"><header class="fase-cab"><p class="eti ' + f.tipo + '">' + (f.tipo === 'previo' ? 'Antes de empezar' : f.tipo === 'despues' ? 'Después' : f.tipo === 'espera' ? 'Casi todo es esperar' : 'Tú en la cocina') + '</p>' +
        '<h3 id="f-' + fi + '">' + esc(f.n) + '</h3><p class="fase-hora" id="fh-' + fi + '"></p></header>' + ps.map(function (p) { return htmlPaso(r, p, e.rac); }).join('') + '</section>';
    });
    var tt = termsDe(r);
    if (tt.length) h += '<section class="tarjeta tecnicas" aria-labelledby="t-tec"><h2 id="t-tec">Técnicas de esta receta</h2><ul class="tec-lista">' + tt.map(function (id) { var g = GLOSA.filter(function (x) { return x.id === id; })[0]; return '<li><button type="button" class="term term-lista" data-term="' + id + '">' + esc(g.t) + '</button></li>'; }).join('') + '</ul></section>';
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
      '<ul class="chips">' + (esEspera(p) && p.m >= 20 ? '<li class="chip libre">Tiempo libre</li>' : '') + (p.enpar ? '<li class="chip libre">A la vez que el paso ' + p.enpar.n + '</li>' : '') + '<li class="chip num">' + (p.tim ? '' : '≈ ') + durTxt(p.m) + '</li>' + chipFuego(p.f) + '</ul>' +
      '<p class="texto">' + texto(r, p.x, rac) + '</p>' +
      (p.ab ? '<div class="abuela"><span class="sello-ab" aria-hidden="true">A</span><p><b>Así lo hace la abuela</b>' + texto(r, p.ab, rac) + '</p></div>' : '') +
      (esEspera(p) && p.m >= 20 ? '<div class="mientras"><b>Mientras tanto</b><p>Tienes unos ' + durTxt(p.m) + ' libres: no hace falta estar encima. Empieza otra receta desde su botón «Empezar a cocinar» y los pasos de las dos se entrelazan solos.</p><button type="button" class="mientras-btn" data-ir="">Elegir otra receta</button></div>' : (p.par ? '<div class="mientras"><b>Mientras tanto</b><p>Esto sigue solo ' + durTxt(p.tim || p.m) + '. ' + (p.cons ? 'En ese hueco te da tiempo a:</p><ol class="mientras-lista">' + p.cons.map(function (q) { return '<li><button type="button" class="ir-paso" data-ir-paso="' + (pref || '') + 'p-' + q.key + '">Paso ' + q.n + ': ' + esc(q.t) + '</button> <span class="num">' + durTxt(q.m) + '</span></li>'; }).join('') + '</ol>' : 'Puedes pasar ya al siguiente paso.</p>') + '</div>' : '')) +
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
    $('#resumen').innerHTML = SES[r.id] ? 'Empezaste a las <b>' + hhmm(c.ini) + '</b>, ' + (r.listo ? 'está listo' : 'comes') + ' hacia las <b>' + hora(c.fin) + '</b>.' : e.modo === 'inicio'
      ? 'Si empiezas a las <b>' + hhmm(c.ini) + '</b>, ' + (r.listo ? 'está listo' : 'comes') + ' a las <b>' + hora(c.fin) + '</b>.'
      : (r.listo ? 'Para tenerlo listo' : 'Para comer') + ' a las <b>' + hhmm(c.fin) + '</b>, empieza a cocinar a las <b>' + hora(c.ini) + '</b>.';
    var rm = $('#resumen-mini'); if (rm) rm.textContent = $('#resumen').textContent;
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
    pintaBarra();
    $('.cocina-cerrar').focus();
  }
  function cierraCocina() {
    cocina = null;
    document.documentElement.style.overflow = '';
    document.body.classList.remove('con-cocina');
    $('#cocina').hidden = true; $('#cocina-nav').hidden = true;
    if (bloqueo && !quiereBloqueo) { try { bloqueo.release(); } catch (e) {} bloqueo = null; }
    if (actual) { pintaHechos(); pintaTimers(); }
    pintaBarra();
  }
  function pintaCocina() {
    var r = cocina.r, e = est(r), c = calcula(r, e), p = c.pasos[cocina.i];
    $('#cocina').innerHTML = '<div class="cocina-in"><div class="cocina-cab"><div><b>' + esc(r.n) + '</b><span class="eti num">Paso ' + p.n + ' de ' + c.pasos.length + ' · ' + esc(hora(p.ini)) + '</span></div>' + (sesIds(true).length > 1 ? '<button type="button" class="cocina-ses" data-ses="abre">Ahora</button>' : '') + '<button type="button" class="cocina-cerrar">Cerrar</button></div>' +
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
    sesToca(r.id);
    if (sesAbierta) pintaAhora(true);
  }
  var toastId = null;
  function aviso(txt) {
    var t = $('#toast');
    if (!t) { document.body.insertAdjacentHTML('beforeend', '<div id="toast" role="status" style="position:fixed;left:50%;top:calc(14px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:50;background:var(--tinta);color:var(--papel);padding:10px 18px;border-radius:999px;font-weight:800;box-shadow:var(--sombra);max-width:calc(100% - 32px);text-align:center"></div>'); t = $('#toast'); }
    t.textContent = txt; t.hidden = false;
    clearTimeout(toastId); toastId = setTimeout(function () { t.hidden = true; }, 3200);
  }
  /* ---------- Sesiones de cocina ---------- */
  var SES = store.get('sesiones', {}) || {}, SES_MAX = 3, HORA = 3600000, sesUndo = null, sesAbierta = false, ultAhora = '', ultBarra = '';
  function guardaSes() { store.set('sesiones', SES); }
  function sesPasos(r, s) { return pasosDe(r, s.met || undefined).filter(function (p) { return !p.pre && !p.post; }); }
  function sesLimite(r, s) { var m = 0; sesPasos(r, s).forEach(function (p) { m += p.m || 0; }); return Math.max(6 * HORA, (m + 120) * 60000); }
  function sesIds(todas) { return Object.keys(SES).filter(function (id) { return porId[id] && (todas || !SES[id].pausa); }); }
  function sesTerminada(r, s) { var h = est(r).hechos; return sesPasos(r, s).every(function (p) { return h.indexOf(p.key) > -1; }); }
  function sesToca(id) { var s = SES[id]; if (s) { s.toque = Date.now(); s.desde = Date.now(); guardaSes(); } }
  function sesInicia(r) {
    var e = est(r); e.hechos = []; guarda(r, e);
    var usados = sesIds(true).map(function (i) { return SES[i].c; }), c0 = 0; while (usados.indexOf(c0) > -1) c0++;
    SES[r.id] = { ini: Date.now(), toque: Date.now(), desde: Date.now(), met: e.met || '', pausa: 0, c: c0 % 3 };
    guardaSes();
  }
  function sesCierra(id, conUndo) {
    var s = SES[id], r = porId[id]; if (!s) return;
    if (conUndo && r) sesUndo = { id: id, s: s, h: est(r).hechos.slice(), t: Date.now() };
    delete SES[id]; guardaSes();
    if (r) { var e = est(r); e.hechos = []; guarda(r, e); }
  }
  function sesPurga() {
    var n = Date.now();
    Object.keys(SES).forEach(function (id) {
      var r = porId[id], s = SES[id];
      if (!r) { delete SES[id]; guardaSes(); return; }
      if (n - s.toque > sesLimite(r, s)) sesCierra(id);
    });
  }
  function minAhora() { var d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; }
  function sesPlan(extra) {
    var sel = [], ext = {};
    sesIds().forEach(function (id) {
      var s = SES[id], r = porId[id]; if (sesTerminada(r, s)) return;
      sel.push(id + '|' + (s.met || '')); ext[id] = { h: est(r).hechos, el: (Date.now() - s.desde) / 60000 };
    });
    if (extra) { sel.push(extra.id + '|' + (extra.met || '')); ext[extra.id] = { h: [], el: 0 }; }
    return sel.length ? planVarias(sel, minAhora(), ext) : null;
  }
  function sesNombre(id) { return porId[id] ? porId[id].n : id; }
  function sesColor(id) { var s = SES[id]; return s && typeof s.c === 'number' ? s.c : 0; }
  function refrescaBtnSes() {
    $$('[data-cocina]').forEach(function (b) { if (actual && b.lastChild && b.lastChild.nodeType === 3) b.lastChild.textContent = SES[actual.id] ? 'Seguir cocinando' : 'Empezar a cocinar'; });
  }
  function empieza(r) {
    if (SES[r.id]) { sesToca(r.id); abreCocina(r); return; }
    var n = sesIds(true).length;
    if (n >= SES_MAX) { aviso('Ya cocinas ' + SES_MAX + ' platos a la vez. Termina o deja uno.'); return; }
    if (n === 0) { sesInicia(r); refrescaBtnSes(); abreCocina(r); return; }
    var e = est(r), antes = sesPlan(), con = sesPlan({ id: r.id, met: e.met || '' }), lin = '';
    Object.keys(con.fin).forEach(function (id) {
      if (id === r.id) { lin += '<li><b>' + esc(r.n) + '</b> listo hacia las <b>' + hhmm(con.fin[id]) + '</b></li>'; return; }
      var d = antes && antes.fin[id] !== undefined ? Math.round(con.fin[id] - antes.fin[id]) : 0;
      lin += '<li><b>' + esc(sesNombre(id)) + '</b> hacia las <b>' + hhmm(con.fin[id]) + '</b>' + (d >= 5 ? ' <span class="ses-retraso">(se retrasa ' + d + ' min)</span>' : '') + '</li>';
    });
    var nombres = sesIds(true).map(sesNombre).join(' y ');
    $('#ses-hoja').innerHTML = '<div class="ses-vel" data-ses="no-hoja"></div><div class="ses-hoja-in" role="dialog" aria-modal="true" aria-label="Cocinar varios platos"><h2>Ya estás cocinando ' + esc(nombres) + '</h2>' +
      '<p>Si empiezas también ' + esc(r.n) + ', los pasos se entrelazan solos: mientras uno se hace solo, haces el otro.</p><ul class="ses-fin">' + lin + '</ul>' +
      '<button type="button" class="btn" data-ses="empieza-tambien" data-id="' + esc(r.id) + '">Empezar ' + esc(r.n) + ' también</button>' +
      '<button type="button" class="btn sec" data-ses="no-hoja">Ahora no, solo leer</button>' +
      '<p class="ses-nota">Máximo ' + SES_MAX + ' platos a la vez.</p></div>';
    $('#ses-hoja').hidden = false;
  }
  function sesNotaPaso(p) { return p.enlaza ? 'sigue sin parar: mismo aceite o cazuela' : ''; }
  function pintaAhora(forzar) {
    if (!sesAbierta) return;
    var ids = sesIds(true), pl = sesPlan(), ah = '', ahora0 = Date.now();
    ah += '<div class="ses-cab"><h2>Ahora</h2><span class="ses-n">' + ids.length + (ids.length === 1 ? ' plato' : ' platos') + '</span><button type="button" class="cocina-cerrar" data-ses="cierra">Cerrar</button></div>';
    if (sesUndo && ahora0 - sesUndo.t < 8000) ah += '<p class="ses-undo">Has dejado ' + esc(sesNombre(sesUndo.id)) + '. <button type="button" data-ses="undo">Deshacer</button></p>';
    else sesUndo = null;
    ids.forEach(function (id) {
      var s = SES[id], r = porId[id], lim = sesLimite(r, s);
      if (ahora0 - s.toque > lim - 2 * HORA) {
        ah += '<div class="ses-aviso"><b>' + esc(r.n) + ' · ¿sigues con esto?</b><p>Hace ' + Math.floor((ahora0 - s.toque) / HORA) + ' h que no la tocas. Si no respondes, se cierra sola a las ' + hhmm(new Date(s.toque + lim).getHours() * 60 + new Date(s.toque + lim).getMinutes()) + ' y no se guarda nada.</p><div><button type="button" class="ses-p ok" data-ses="sigo" data-id="' + id + '">Sigo cocinando</button><button type="button" class="ses-p" data-ses="deja" data-id="' + id + '">La cierro</button></div></div>';
      }
      if (sesTerminada(r, s)) ah += '<div class="ses-listo ses-c' + sesColor(id) + '"><b>' + esc(r.n) + ' está listo</b><div><button type="button" class="ses-p ok" data-ses="sella" data-id="' + id + '">' + (cocinados[id] ? 'Cerrar' : 'Sellar en el pasaporte') + '</button></div></div>';
    });
    var items = pl ? pl.pasos : [], ahoraIt = null, mient = [], sig = [];
    var curKey = {};
    ids.forEach(function (id) { var s = SES[id], r = porId[id]; if (sesTerminada(r, s)) return; var h = est(r).hechos, p0 = sesPasos(r, s).filter(function (p) { return h.indexOf(p.key) < 0; })[0]; if (p0) curKey[id] = p0; });
    items.forEach(function (o) {
      var id = o.r.id, c0 = curKey[id];
      if (o.esp && o.ini <= minAhora() + 0.75) { mient.push(o); return; }
      if (!ahoraIt && !o.esp) { ahoraIt = o; return; }
      sig.push(o);
    });
    if (ahoraIt && ahoraIt.ini > minAhora() + 0.75) { sig.unshift(ahoraIt); ahoraIt = null; }
    if (ahoraIt) {
      var ra = ahoraIt.r, pa = pasosDe(ra, SES[ra.id].met || undefined).filter(function (p) { return p.key === ahoraIt.key; })[0], ea = est(ra);
      ah += '<div class="ses-ahora ses-c' + sesColor(ra.id) + '"><span class="ses-nom">' + esc(ra.n) + ' · paso ' + pa.n + '</span><h3>' + esc(pa.t) + '</h3><p class="ses-txt">' + texto(ra, pa.x, ea.rac) + '</p>' +
        (pa.ab ? '<p class="ses-ab"><b>Así lo hace la abuela</b> ' + texto(ra, pa.ab, ea.rac) + '</p>' : '') +
        '<div class="ses-acc"><button type="button" class="btn" data-ses="hecho" data-id="' + ra.id + '" data-k="' + pa.key + '">✓ Hecho</button><button type="button" class="btn sec" data-ses="ver" data-id="' + ra.id + '">Paso a paso</button></div></div>';
    } else if (items.length) {
      var prox = items.filter(function (o) { return !o.esp; })[0];
      ah += '<div class="ses-ahora"><span class="ses-nom">Ahora toca descansar</span><h3>Todo se hace solo</h3><p class="ses-txt">' + (prox ? 'Lo siguiente es a las ' + hhmm(prox.ini) + ': ' + esc(prox.t) + ' (' + esc(prox.r.n) + ').' : 'Cuando termine la espera, marca «Ya está».') + '</p></div>';
    }
    mient.forEach(function (o) {
      var id = o.r.id, s = SES[id], tot = Math.max(1, (porId[id] ? sesPasos(porId[id], s).filter(function (p) { return p.key === o.key; })[0].m : 1)), rem = Math.max(0, o.cola), pct = Math.min(100, Math.round((1 - rem / tot) * 100));
      ah += '<div class="ses-solo ses-c' + sesColor(id) + '"><span class="ses-nom">Mientras · se hace solo</span><p><b>' + esc(o.t) + '</b> · ' + esc(o.r.n) + '</p><div class="ses-barra-p"><i style="width:' + pct + '%"></i></div><small>' + (rem > 0.5 ? 'Quedan ' + durTxt(rem) + ' · listo hacia las ' + hhmm(o.ini + rem) : 'Ya puede estar: míralo y marca «Ya está»') + '</small><div class="ses-acc"><button type="button" class="ses-p ok" data-ses="hecho" data-id="' + id + '" data-k="' + o.key + '">Ya está</button></div></div>';
    });
    if (sig.length) {
      ah += '<p class="eti ses-et">Lo siguiente</p><ul class="ses-sig">' + sig.slice(0, 10).map(function (o) { return '<li class="ses-c' + sesColor(o.r.id) + '"><span class="num">' + hhmm(o.ini) + '</span><div><b>' + esc(o.t) + '</b><small>' + esc(o.r.n) + (o.esp ? ' · se hace solo ' + durTxt(o.cola) : '') + (sesNotaPaso(o) ? ' · ' + sesNotaPaso(o) : '') + '</small></div></li>'; }).join('') + '</ul>';
    }
    if (pl) ah += '<p class="ses-fins">' + Object.keys(pl.fin).map(function (id) { return '<b>' + esc(sesNombre(id)) + '</b> listo hacia las <b>' + hhmm(pl.fin[id]) + '</b>'; }).join(' · ') + '. Se recalcula con lo que vas marcando.</p>';
    ah += '<p class="eti ses-et">Tus platos</p>';
    ids.forEach(function (id) {
      var s = SES[id], r = porId[id], ps = sesPasos(r, s), h = est(r).hechos, k = ps.filter(function (p) { return h.indexOf(p.key) > -1; }).length, lim = sesLimite(r, s), cad = new Date(s.toque + lim);
      ah += '<div class="ses-plato ses-c' + sesColor(id) + '"><b>' + esc(r.n) + '</b><small>' + (s.pausa ? 'En pausa · ' : '') + k + ' de ' + ps.length + ' pasos<br><label class="ses-emp">Empecé a las <input type="time" class="ses-hora" data-id="' + id + '" value="' + hhmm(new Date(s.ini).getHours() * 60 + new Date(s.ini).getMinutes()) + '"></label><br>Se cierra sola a las ' + hhmm(cad.getHours() * 60 + cad.getMinutes()) + (cad.getDate() !== new Date().getDate() ? ' (mañana)' : '') + ' si no la tocas</small><div><button type="button" class="ses-p" data-ses="ver" data-id="' + id + '">Paso a paso</button><button type="button" class="ses-p" data-ses="' + (s.pausa ? 'reanuda' : 'pausa') + '" data-id="' + id + '">' + (s.pausa ? 'Reanudar' : 'Pausar') + '</button><button type="button" class="ses-p mal" data-ses="deja" data-id="' + id + '">Dejar de cocinarlo</button></div></div>';
    });
    if (!ids.length) ah += '<p class="vacio">No estás cocinando nada ahora mismo.</p>';
    var el = $('#ses-ahora');
    if (forzar || ah !== ultAhora) { var sc = el.scrollTop; el.innerHTML = ah; el.scrollTop = sc; ultAhora = ah; }
  }
  function abreAhora() {
    if (cocina) cierraCocina();
    sesAbierta = true; ultAhora = '';
    document.documentElement.style.overflow = 'hidden';
    $('#ses-ahora').hidden = false; $('#ses-ahora').scrollTop = 0;
    pintaAhora(true); pintaBarra();
  }
  function cierraAhora() {
    sesAbierta = false;
    document.documentElement.style.overflow = '';
    $('#ses-ahora').hidden = true;
    pintaBarra();
  }
  function pintaBarra() {
    var b = $('#ses-barra'); if (!b) return;
    sesPurga();
    var ids = sesIds(true), oculta = !ids.length || sesAbierta || !!cocina || !$('#ses-hoja').hidden;
    if (oculta) { b.hidden = true; ultBarra = ''; return; }
    var pl = sesPlan(), txt;
    if (ids.length === 1) {
      var r = porId[ids[0]], s = SES[ids[0]], ps = sesPasos(r, s), h = est(r).hechos, k = ps.filter(function (p) { return h.indexOf(p.key) > -1; }).length;
      txt = '<b>Cocinando: ' + esc(r.n) + '</b><small>' + (sesTerminada(r, s) ? 'Listo: toca para cerrarlo' : 'Paso ' + Math.min(k + 1, ps.length) + ' de ' + ps.length + (pl && pl.fin[ids[0]] ? ' · listo hacia las ' + hhmm(pl.fin[ids[0]]) : '')) + '</small>';
    } else {
      txt = '<b>Cocinando: ' + ids.length + ' platos</b><small>' + (pl ? Object.keys(pl.fin).map(function (id) { return esc(sesNombre(id)) + ' ~' + hhmm(pl.fin[id]); }).join(' · ') : 'Toca para ver') + '</small>';
    }
    var html = '<span class="ses-puntos">' + ids.map(function (id) { return '<i class="ses-c' + sesColor(id) + '"></i>'; }).join('') + '</span><span class="ses-barra-t">' + txt + '</span><span aria-hidden="true">›</span>';
    b.style.bottom = (!$('#dock').hidden ? 78 : 14) + 'px';
    if (html !== ultBarra) { b.innerHTML = html; ultBarra = html; }
    b.hidden = false;
  }
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-ses],#ses-barra'); if (!t) return;
    if (t.id === 'ses-barra') { abreAhora(); return; }
    var a = t.getAttribute('data-ses'), id = t.getAttribute('data-id'), r = id ? porId[id] : null;
    if (a === 'abre') abreAhora();
    else if (a === 'cierra') cierraAhora();
    else if (a === 'no-hoja') { $('#ses-hoja').hidden = true; pintaBarra(); }
    else if (a === 'empieza-tambien' && r) { sesInicia(r); $('#ses-hoja').hidden = true; refrescaBtnSes(); abreAhora(); }
    else if (a === 'hecho' && r) { marcaHecho(r, +t.getAttribute('data-k'), true); if (SES[id] && sesTerminada(r, SES[id])) aviso('¡' + r.n + ' está listo!'); pintaAhora(true); }
    else if (a === 'pausa' && SES[id]) { SES[id].pausa = 1; guardaSes(); pintaAhora(true); }
    else if (a === 'reanuda' && SES[id]) { SES[id].pausa = 0; sesToca(id); pintaAhora(true); }
    else if (a === 'sigo' && SES[id]) { sesToca(id); pintaAhora(true); }
    else if (a === 'deja' && SES[id]) { sesCierra(id, true); refrescaBtnSes(); if (!sesIds(true).length && !sesUndo) cierraAhora(); pintaAhora(true); }
    else if (a === 'undo' && sesUndo) { var u = sesUndo; sesUndo = null; SES[u.id] = u.s; u.s.toque = Date.now(); u.s.desde = Date.now(); guardaSes(); var ee = est(porId[u.id]); ee.hechos = u.h; guarda(porId[u.id], ee); refrescaBtnSes(); pintaAhora(true); }
    else if (a === 'sella' && r) { if (!cocinados[id]) sella(r, true); sesCierra(id); refrescaBtnSes(); if (!sesIds(true).length) cierraAhora(); else pintaAhora(true); }
    else if (a === 'ver' && r) { cierraAhora(); sesToca(id); if (actual !== r) { ir(r.id); setTimeout(function () { abreCocina(r); }, 80); } else abreCocina(r); }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target; if (!t.classList || !t.classList.contains('ses-hora')) return;
    var s = SES[t.getAttribute('data-id')], m = aMin(t.value); if (!s || m === null) return;
    var d = new Date(); d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    if (d.getTime() > Date.now()) d = new Date(Date.now() - 60000);
    s.ini = d.getTime(); s.desde = Math.min(s.desde, s.ini); guardaSes(); pintaAhora(true); if (actual) pintaPlan();
  });
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
      $('.hero').hidden = true; $('#vista-indice').hidden = true; $('#vista-receta').hidden = false;
      vistaReceta(id); window.scrollTo(0, 0);
    } else {
      actual = null;
      $('.hero').hidden = false; $('#vista-receta').hidden = true; $('#vista-indice').hidden = false;
      vistaIndice();
    }
  }
  function menuAbre(v) { var m = $('#menu'); m.hidden = !v; $('#menu-btn').setAttribute('aria-expanded', v ? 'true' : 'false'); }
  function menuAccion(a) {
    menuAbre(false);
    if (a === 'cierra-pas') { pasaporteAbierto = false; var sp = $('#sec-pasaporte'); if (sp) sp.hidden = true; return; }
    var vaA = function () {
      if (a === 'pasaporte') { pasaporteAbierto = true; var sp2 = $('#sec-pasaporte'); if (sp2) sp2.hidden = false; }
      if (a === 'recetas' && filtro.fav) { filtro.fav = false; var bf0 = $('#ver-favs'); if (bf0) bf0.setAttribute('aria-pressed', 'false'); pintaFichas(); }
      if (a === 'favs') { filtro.fav = true; var bf = $('#ver-favs'); if (bf) bf.setAttribute('aria-pressed', 'true'); pintaFichas(); }
      var dest = { recetas: '#sec-fichas', favs: '#sec-fichas', mapa: '#sec-mapa', compra: '#t-compra', precios: '#t-precios', plan: '#t-plan', pasaporte: '#sec-pasaporte' }[a];
      var el = dest && $(dest); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    if (location.hash && location.hash !== '#') { location.hash = ''; setTimeout(vaA, 80); } else vaA();
  }
  function ir(id) { if (('#' + id) === location.hash || (!id && !location.hash)) ruta(); else location.hash = id ? id : ''; }
  window.addEventListener('hashchange', ruta);

  /* ---------- Eventos ---------- */
  document.addEventListener('click', function (ev) {
    if (!$('#menu').hidden && !ev.target.closest('#menu,#menu-btn')) menuAbre(false);
    var t = ev.target.closest('[data-ir],[data-menu],#mas-filtros,#quita-filtros,[data-reg],[data-vista],#ver-espana,[data-cat],[data-tiempo],[data-tb],[data-tm],[data-tr],[data-hecho],[data-cocina],[data-cocinado],[data-geo],[data-reset],[data-comprar],[data-compra],[data-desglose],[data-cvista],[data-ruta],[data-cerrada],[data-usamk],[data-nocerradas],[data-cambia],[data-alt],[data-planb],[data-tpref],[data-casa],[data-vaciar],[data-fav],#ver-favs,#ahora,.cocina-cerrar,#c-ant,#c-sig,#dock-accion,#dock-ir');
    if (!t) return;
    if (t.hasAttribute('data-ir')) { ir(t.getAttribute('data-ir')); return; }
    if (t.hasAttribute('data-menu')) { var ma = t.getAttribute('data-menu'); if (ma === 'abre') { menuAbre($('#menu').hidden); return; } menuAccion(ma); return; }
    if (t.hasAttribute('data-vista')) { vistaMapa = t.getAttribute('data-vista'); regionSel = null; verEspana = false; refrescaMapa(); return; }
    if (t.hasAttribute('data-reg') && t.getAttribute('data-reg') === 'w-ESP') { vistaMapa = 'es'; regionSel = null; verEspana = false; refrescaMapa(); return; }
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
    if (t.id === 'mas-filtros') { var ex = $('#filtros-extra'); ex.hidden = !ex.hidden; t.setAttribute('aria-expanded', ex.hidden ? 'false' : 'true'); return; }
    if (t.id === 'quita-filtros') { filtro.cat = 'todas'; filtro.t = 'todos'; filtro.q = ''; filtro.fav = false; var bq = $('#buscar'); if (bq) bq.value = ''; $$('[data-cat]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === 'todas' ? 'true' : 'false'); }); $$('[data-tiempo]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tiempo') === 'todos' ? 'true' : 'false'); }); $('#ver-favs').setAttribute('aria-pressed', 'false'); pintaFichas(); return; }
    if (t.hasAttribute('data-comprar')) {
      var rc = actual, ec = est(rc);
      compra = compra.filter(function (c) { return c.r !== rc.id; });
      rc.ings.forEach(function (i) { if (i.grupo !== undefined || ec.tengo.indexOf(i.k) > -1) return; compra.push({ r: rc.id, t: i.plano ? i.s : frase(rc, i.k, ec.rac) }); });
      store.set('compra', compra);
      aviso('Añadido a la lista de la compra (en la portada).');
      t.textContent = 'Lista de la compra actualizada: añadir de nuevo';
      return;
    }
    if (t.hasAttribute('data-compra')) {
      var cis = t.getAttribute('data-compra').split(',').map(Number), ci = cis[0];
      if (compra[ci]) { var nv = !compra[ci].d, nts = cis.map(function (k) { return compra[k] ? normT(compra[k].t) : ''; }); compra.forEach(function (c, k) { if (cis.indexOf(k) > -1 || nts.indexOf(normT(c.t)) > -1) c.d = nv; }); store.set('compra', compra); rutaCalc = null; if (cvista === 'tienda') repintaCompra(); else $$('[data-compra]').forEach(function (b) { var cc = compra[+b.getAttribute('data-compra')]; if (cc) b.setAttribute('aria-pressed', !!cc.d); }); }
      return;
    }
    if (t.hasAttribute('data-desglose')) { var bx = t.nextElementSibling, ab = bx.hidden; bx.hidden = !ab; t.setAttribute('aria-expanded', String(ab)); t.textContent = ab ? 'Ocultar recetas ▴' : 'De qué recetas ▾'; return; }
    if (t.hasAttribute('data-ruta')) { var bi = bolsasInfo(); if (bi) aviso('🛍️ ' + bi.txt); calculaRuta(); return; }
    if (t.hasAttribute('data-cambia')) { var ci2 = +t.getAttribute('data-cambia'); if (rutaCalc && rutaCalc.estado === 'lista') { rutaCalc.cambiando = rutaCalc.cambiando === ci2 ? -1 : ci2; repintaCompra(); pintaMapaRuta(); } return; }
    if (t.hasAttribute('data-cerrada')) { descartaParada(+t.getAttribute('data-cerrada')); return; }
    if (t.hasAttribute('data-usamk')) { recalcula(function (d) { d.usaMk = !rutaCalc.mkOk; }); return; }
    if (t.hasAttribute('data-nocerradas')) { cerradas = []; store.set('cerradas', cerradas); if (rutaCalc && rutaCalc.estado === 'lista') recalcula(function () {}); else repintaCompra(); return; }
    if (t.hasAttribute('data-alt')) { var pa = t.getAttribute('data-alt').split('|'); cambiaParada(+pa[0], +pa[1]); return; }
    if (t.hasAttribute('data-cvista')) { cvista = t.getAttribute('data-cvista'); store.set('cvista', cvista); repintaCompra(); return; }
    if (t.hasAttribute('data-planb')) { var pis = t.getAttribute('data-planb').split(',').map(Number), pi = pis[0]; if (compra[pi]) { var nx = !compra[pi].x; pis.forEach(function (k) { if (compra[k]) compra[k].x = nx; }); store.set('compra', compra); rutaCalc = null; repintaCompra(); } return; }
    if (t.hasAttribute('data-tpref')) { var tp = t.getAttribute('data-tpref').split('|'); tprefs[tp[0]] = tp[1]; store.set('tprefs', tprefs); rutaCalc = null; compra.forEach(function (c) { delete c.x; }); store.set('compra', compra); repintaCompra(); var dd = document.querySelector('.elige'); if (dd) dd.open = true; return; }
    if (t.hasAttribute('data-casa')) {
      if (!navigator.geolocation) { aviso('Tu navegador no da la ubicación.'); return; }
      aviso('Buscando dónde estás…');
      navigator.geolocation.getCurrentPosition(function (pos) { casa = { lat: Math.round(pos.coords.latitude * 1e4) / 1e4, lon: Math.round(pos.coords.longitude * 1e4) / 1e4 }; store.set('casa', casa); rutaCalc = null; repintaCompra(); aviso('Casa guardada en este móvil.'); }, function () { aviso('No he podido ver tu ubicación. Revisa el permiso.'); }, { timeout: 10000, maximumAge: 60000 });
      return;
    }
    if (t.hasAttribute('data-vaciar')) { if (window.confirm('¿Vaciar la lista de la compra?')) { compra = []; store.set('compra', compra); vistaIndice(); } return; }
    if (t.hasAttribute('data-geo')) { ubica(); return; }
    if (t.hasAttribute('data-reset')) { if (window.confirm('¿Borrar todos los sellos del pasaporte?')) { cocinados = {}; store.set('cocinados', cocinados); vistaIndice(); } return; }
    if (t.hasAttribute('data-cocina')) { empieza(actual); return; }
    if (t.hasAttribute('data-cocinado')) { sella(actual); return; }
    if (t.id === 'ahora') { var r = actual, e = est(r); e.modo = 'inicio'; e.hora = hhmm(ahora(true)); guarda(r, e); $('#modo-inicio').checked = true; $('#hora').value = e.hora; pintaPlan(); return; }
    if (t.classList.contains('cocina-cerrar')) { cierraCocina(); return; }
    if (t.id === 'c-ant') { if (cocina.i > 0) { cocina.i--; pintaCocina(); } return; }
    if (t.id === 'c-sig') {
      var rr = cocina.r, cc = calcula(rr, est(rr)), pp = cc.pasos[cocina.i];
      marcaHecho(rr, pp.key, true);
      if (cocina.i < cc.pasos.length - 1) { cocina.i++; pintaCocina(); }
      else { cierraCocina(); if (!cocinados[rr.id]) sella(rr, true); if (SES[rr.id]) { sesCierra(rr.id); refrescaBtnSes(); } }
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
  var yAnt = 0;
  window.addEventListener('scroll', function () {
    var a = $('#arriba'); if (a) a.hidden = window.scrollY < 700;
    var mb = $('#menu-btn'), y = window.scrollY;
    if (mb) { var baja = y > yAnt + 6 && y > 120, sube = y < yAnt - 6 || y <= 120; if (baja && $('#menu').hidden) mb.classList.add('oculto'); else if (sube) mb.classList.remove('oculto'); }
    yAnt = y;
  }, { passive: true });
  document.addEventListener('click', function (ev) { if (ev.target.closest('#arriba')) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'buscar') { filtro.q = ev.target.value.trim(); pintaFichas(); }
  });
  function refrescaMapa() {
    var caja = $('.mapa-caja'); if (!caja) return;
    caja.innerHTML = svgMapa();
    $('#panel-region').innerHTML = panelRegion();
    $('#ver-espana').setAttribute('aria-pressed', verEspana ? 'true' : 'false');
    $('#ver-espana').hidden = vistaMapa === 'mundo';
    $('#ayuda-mapa').textContent = vistaMapa === 'mundo' ? 'Toca un país' : 'Toca una comunidad';
    $$('[data-vista]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-vista') === vistaMapa ? 'true' : 'false'); });
  }

  fetch('data/recipes.json').then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }).then(function (recetas) {
    R = recetas;
    preparaRecetas();
    sesPurga();
    ruta();
    setInterval(tick, 250);
    setInterval(function () { pintaBarra(); if (sesAbierta) pintaAhora(); }, 2000);
    pintaBarra();
  }).catch(function (err) {
    document.getElementById('vista-indice').innerHTML = '<p class="vacio">No se pudieron cargar las recetas (' + esc(err.message) + ').</p>';
  });
})();
