import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')
def cuenco(cx, cy, rx, col, borde='#3C5C8E'):
    h = rx*0.8
    return (sombra(cx, cy+h+4, rx*0.8, 8, .25) + f'<path d="M{cx-rx} {cy}c2 {h*.75:.0f} {rx*.35:.0f} {h:.0f} {rx} {h:.0f}s{rx-6:.0f}-{h*.25:.0f} {rx} -{h:.0f}z" fill="#F4F0E6"/>'
            f'<path d="M{cx-rx+8} {cy+8}c4 {h*.6:.0f} {rx*.3:.0f} {h*.8:.0f} {rx-8} {h*.8:.0f}s{rx-12:.0f}-{h*.2:.0f} {rx-8} -{h*.8:.0f}" fill="none" stroke="{borde}" stroke-width="3"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{rx*.26:.0f}" fill="#E4DECF"/><ellipse cx="{cx}" cy="{cy+1}" rx="{rx-5}" ry="{rx*.21:.0f}" fill="{col}"/>')
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'

# ---- CALDO DE HUESOS: taza grande de caldo dorado, huesos, zanahoria, jengibre
R = random.Random(41); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a(grad('c', '#F0C155', '#D99A2C').replace('ID', 'ID'))
a('<defs>' + grad('caldo', '#EFC15A', '#D6962B') + '</defs>')
a(cuenco(150, 62, 80, 'url(#IDcaldo)'))
a('<ellipse cx="126" cy="58" rx="26" ry="2.4" fill="#fff" opacity=".4"/>')
for x, y in [(124,66),(156,64),(176,68),(140,70)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="4" ry="1.4" fill="#F7DC8A" opacity=".8"/>')
# hueso
a('<g transform="translate(236 150) rotate(-12) scale(.8)"><rect x="-44" y="-6" width="88" height="12" rx="6" fill="#EADBB8"/><circle cx="-46" cy="-6" r="8" fill="#F1E4C6"/><circle cx="-46" cy="6" r="8" fill="#F1E4C6"/><circle cx="46" cy="-6" r="8" fill="#F1E4C6"/><circle cx="46" cy="6" r="8" fill="#F1E4C6"/><rect x="-36" y="-4" width="70" height="3" rx="1.5" fill="#fff" opacity=".6"/></g>')

a('<g transform="translate(80 150) rotate(-15) scale(.8)"><path d="M-30 -7L22 -3Q30 0 22 3L-30 7Z" fill="#E8812A"/><path d="M-28 -3L18 -1" stroke="#F7B466" stroke-width="2" stroke-linecap="round"/></g>')

escribe('caldo', o)

# ---- FABADA: cazuela de barro con fabes, chorizo, morcilla, panceta
R = random.Random(43); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro', '#C96F40', '#8F4222') + '</defs>')
a(sombra(160, 156, 120, 10, .28))
a('<path d="M44 84c0 46 30 68 116 68s116-22 116-68z" fill="url(#IDbarro)"/><ellipse cx="160" cy="84" rx="116" ry="26" fill="#A9552C"/><ellipse cx="160" cy="86" rx="106" ry="21" fill="#7A3A1E"/>')
a('<rect x="14" y="80" width="34" height="9" rx="4.5" fill="#A9552C"/><rect x="272" y="80" width="34" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="86" rx="100" ry="18" fill="#E8B64A"/>')
for _ in range(95):
    x = 160+R.uniform(-90, 90); y = 86+R.uniform(-14, 14)
    if ((x-160)/92)**2+((y-86)/15)**2 > 1: continue
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4.4" ry="2.8" fill="#F6EBC4" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/><ellipse cx="{x-1:.1f}" cy="{y-1:.1f}" rx="1.6" ry=".9" fill="#fff"/>')
for x, y in [(120,84),(160,90),(200,82)]:
    a(f'<ellipse cx="{x}" cy="{y+2}" rx="17" ry="7.5" fill="#000" opacity=".15"/><ellipse cx="{x}" cy="{y}" rx="17" ry="7.5" fill="#B3341F"/><ellipse cx="{x-3}" cy="{y-2}" rx="10" ry="2" fill="#E27A5E" opacity=".7"/>')
a('<ellipse cx="140" cy="94" rx="14" ry="5.5" fill="#3B1E1A"/><ellipse cx="138" cy="92" rx="7" ry="1.5" fill="#7A4A40" opacity=".7"/>')
a('<path d="M176 94q10-8 24-2 4 6-4 8-12 2-20-6z" fill="#E7B9A0"/><path d="M180 94q8-3 16-1" stroke="#B64A3A" stroke-width="2" fill="none"/>')
escribe('fabada', o)

# ---- LENTEJAS: cuenco/plato hondo con lentejas, chorizo y zanahoria
R = random.Random(47); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + rad('len', '#B5793A', '#7C4A1E') + '</defs>')
a(plato(150, 108, 112, 48))
a('<ellipse cx="150" cy="108" rx="80" ry="32" fill="url(#IDlen)"/>')
for _ in range(180):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 150+math.cos(t)*r*76; y = 108+math.sin(t)*r*28
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="2.6" ry="2.1" fill="{R.choice(["#C48A4A","#A9702F","#D49C5A","#8F5A24"])}"/>')
for x, y in [(130,100),(166,112)]:
    a(f'<ellipse cx="{x}" cy="{y+2}" rx="14" ry="6" fill="#000" opacity=".15"/><ellipse cx="{x}" cy="{y}" rx="14" ry="6.5" fill="#B3341F"/><ellipse cx="{x-3}" cy="{y-2}" rx="8" ry="1.6" fill="#E27A5E" opacity=".7"/>')
for x, y, ro in [(118,114,20),(176,98,-25)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-10" y="-3.5" width="20" height="7" rx="3.5" fill="#E8812A"/><rect x="-8" y="-2.5" width="14" height="2" rx="1" fill="#F7B466"/></g>')
a('<path d="M150 90q8-5 14-1" stroke="#4E9A3F" stroke-width="2" fill="none" stroke-linecap="round"/>')

escribe('lentejas', o)

# ---- CROQUETAS: plato con 5 croquetas doradas, una abierta
R = random.Random(49); o = []; a = o.append
a(mesa(R, ('#E9D6B0', '#CFA874'))); a(DEFS())
a('<defs>' + grad('cr', '#E9A840', '#B8681E') + rad('beb', '#FFF6D8', '#F1DDA2') + '</defs>')
a(plato(160, 108, 118, 50))
def croq(x, y, ro, w=40, h=17):
    return (f'<g transform="translate({x} {y}) rotate({ro})"><ellipse cx="0" cy="{h/2+3:.0f}" rx="{w/2-2}" ry="3.5" fill="#000" opacity=".13"/>'
            f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="{h/2}" fill="url(#IDcr)"/><rect x="{-w/2+5}" y="{-h/2+2}" width="{w-14}" height="3" rx="1.5" fill="#FBD789" opacity=".8"/>'
            + ''.join(f'<circle cx="{R.uniform(-w/2+6,w/2-6):.1f}" cy="{R.uniform(-h/2+3,h/2-3):.1f}" r=".9" fill="#8F4A12" opacity=".5"/>' for _ in range(7)) + '</g>')
for x, y, r in [(112,100,-10),(168,92,5),(220,104,12),(138,124,6),(196,126,-6)]:
    a(croq(x, y, r))
# cortada
a('<g transform="translate(168 92)"></g>')
a('<ellipse cx="226" cy="124" rx="16" ry="9" fill="#E3D6B8"/><ellipse cx="226" cy="123" rx="13" ry="7" fill="url(#IDbeb)"/>')
escribe('croquetas', o)
