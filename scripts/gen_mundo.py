"""Genera js/mundo.js a partir de Natural Earth 110m (dominio publico).
Uso: python3 scripts/gen_mundo.py /ruta/ne_110m_admin_0_countries.geojson"""
import json, sys, math
d = json.load(open(sys.argv[1]))
S = 2.0; LAT0 = 84.0; LON0 = -180.0
def P(lon, lat): return ((lon - LON0) * S, (LAT0 - lat) * S)
def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1e-9
    m, k = 0, 0
    for i in range(1, len(pts) - 1):
        dd = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
        if dd > m: m, k = dd, i
    if m > eps: return dp(pts[:k + 1], eps)[:-1] + dp(pts[k:], eps)
    return [pts[0], pts[-1]]
paises = []
for f in d['features']:
    p = f['properties']; iso = p['ISO_A3_EH'] if p['ISO_A3'] == '-99' else p['ISO_A3']
    if iso in ('ATA', '-99'): continue
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    path = []; best = None
    for poly in polys:
        ring = [P(*c) for c in poly[0]]
        if len(ring) > 8:
            h = len(ring) // 2
            ring = dp(ring[:h + 1], 0.35)[:-1] + dp(ring[h:], 0.35)
        if len(ring) < 3: continue
        xs = [a for a, b in ring]; ys = [b for a, b in ring]
        area = (max(xs) - min(xs)) * (max(ys) - min(ys))
        if area < 1.2: continue
        path.append('M' + 'L'.join('%.0f %.0f' % q for q in ring) + 'Z')
        if not best or area > best[0]: best = (area, (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)
    if not path: continue
    paises.append({'id': 'w-' + iso, 'n': p.get('NAME_ES') or p['NAME'], 'd': ''.join(path), 'cx': round(best[1], 1), 'cy': round(best[2], 1)})
out = {'vb': [720, 284], 'paises': paises}
open('js/mundo.js', 'w').write('/* Paises del mundo, trazado simplificado de Natural Earth 110m (dominio publico). Generado por scripts/gen_mundo.py */\nwindow.MUNDO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(paises))
