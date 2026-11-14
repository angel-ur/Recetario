import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')
def cuenco(cx, cy, rx, col, borde='#3C5C8E'):
    h = rx*0.8
    return (sombra(cx, cy+h+4, rx*0.8, 8, .25) + f'<path d="M{cx-rx} {cy}c2 {h*.75:.0f} {rx*.35:.0f} {h:.0f} {rx} {h:.0f}s{rx-6:.0f}-{h*.25:.0f} {rx} -{h:.0f}z" fill="#F4F0E6"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{rx*.26:.0f}" fill="#E4DECF"/><ellipse cx="{cx}" cy="{cy+1}" rx="{rx-5}" ry="{rx*.21:.0f}" fill="{col}"/>')

# ---- PAPAS ARRUGADAS: plato con papas negras arrugadas y dos mojos
R = random.Random(83); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + rad('mojo1', '#C03418', '#8E2410') + rad('mojo2', '#4E7A2E', '#355A1C') + '</defs>')
a(plato(140, 106, 112, 48))
# papas negras arrugadas con sal
for x,y,r,ro in [(96,100,17,-15),(132,92,19,10),(168,100,17,30),(112,118,15,45),(152,114,16,-30),(136,110,14,0)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="{r}" ry="{r*.5:.0f}" fill="#000" opacity=".14"/><g transform="translate({x} {y}) rotate({ro})"><ellipse rx="{r}" ry="{r*.68:.0f}" fill="#4A3A2C"/><ellipse rx="{r*.8:.0f}" ry="{r*.52:.0f}" fill="#5C4A38"/>' + ''.join(f'<path d="M{-r*.5+i*r*.34:.0f} {-r*.35:.0f}q2 {r*.35:.0f} 0 {r*.7:.0f}" stroke="#3A2C20" stroke-width="1.1" fill="none" opacity=".7"/>' for i in range(4)) + '</g>')
for _ in range(22):
    t = R.random()*6.283; r = math.sqrt(R.random())
    a(f'<circle cx="{132+math.cos(t)*r*58:.1f}" cy="{104+math.sin(t)*r*22:.1f}" r="{R.uniform(.7,1.3):.1f}" fill="#FBF6E6" opacity=".9"/>')
# cuencos de mojo
a(cuenco(258, 92, 30, 'url(#IDmojo1)'))
a(cuenco(250, 140, 26, 'url(#IDmojo2)'))
a('<ellipse cx="250" cy="90" rx="10" ry="1.6" fill="#fff" opacity=".3"/>')
escribe('papas', o)

# ---- TUMBET: cazuela baja con capas de verdura y tomate por encima
R = random.Random(89); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro', '#C96F40', '#8F4222') + rad('tom', '#C23418', '#96220E') + '</defs>')
a(sombra(160, 152, 116, 10, .28))
a('<path d="M48 92c0 34 28 52 112 52s112-18 112-52z" fill="url(#IDbarro)"/>')
a('<rect x="22" y="88" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="88" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="92" rx="112" ry="26" fill="#A9552C"/>')
a('<ellipse cx="160" cy="92" rx="104" ry="22" fill="url(#IDtom)"/>')
# rodajas de patata y berenjena asomando por los bordes, tomate al centro
for i in range(9):
    t = i*6.283/9
    x = 160+math.cos(t)*82; y = 92+math.sin(t)*16.5
    col = '#F2E0A8' if i%2==0 else '#6A4A5E'
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({math.degrees(t)+90:.0f})"><ellipse rx="16" ry="8.5" fill="{col}"/><ellipse rx="12" ry="5.5" fill="{"#F8ECC0" if col=="#F2E0A8" else "#7E5A70"}"/></g>')
a('<ellipse cx="160" cy="90" rx="64" ry="14" fill="url(#IDtom)"/>')
for _ in range(26):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*94; y = 90+math.sin(t)*r*17
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{R.uniform(3,6):.1f}" ry="{R.uniform(1.4,2.6):.1f}" fill="{R.choice(["#D04828","#A82810","#B83A1C"])}" opacity=".8"/>')
# tiras de pimiento verde y un poco de brillo de aceite
for x,y,ro in [(110,84,20),(150,94,-15),(196,86,40)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-14" y="-3" width="28" height="6" rx="3" fill="#4E7A2E"/><rect x="-12" y="-2" width="24" height="2" rx="1" fill="#6E9A3E"/></g>')
a('<ellipse cx="128" cy="84" rx="22" ry="2.6" fill="#fff" opacity=".3"/>')
escribe('tumbet', o)

# ---- CHILINDRON: cazuela con pollo en salsa de pimientos y tomate
R = random.Random(97); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + grad('barro2', '#C96F40', '#8F4222') + rad('chil', '#B8401E', '#8E2A12') + '</defs>')
a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 90c0 40 28 60 112 60s112-20 112-60z" fill="url(#IDbarro2)"/>')
a('<rect x="22" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="90" rx="112" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="102" ry="21" fill="url(#IDchil)"/>')
# trozos de pollo dorados
for x,y,ro in [(112,88,-15),(158,96,10),(204,86,25)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="19" ry="8" fill="#000" opacity=".14"/><g transform="translate({x} {y}) rotate({ro})"><ellipse rx="19" ry="10" fill="#D9A05A"/><ellipse rx="14" ry="7" fill="#E8BC7E"/><path d="M-8 -2q8-3 16 0" stroke="#C88A48" stroke-width="1.6" fill="none"/></g>')
# tiras de pimiento rojo y verde
for x,y,ro,col in [(96,96,-20,'#B3341F'),(140,84,30,'#4E7A2E'),(186,98,-35,'#B3341F'),(218,94,15,'#4E7A2E')]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-15" y="-3.5" width="30" height="7" rx="3.5" fill="{col}"/><rect x="-13" y="-2.4" width="26" height="2.2" rx="1.1" fill="{ "#D4684E" if col=="#B3341F" else "#6E9A3E" }"/></g>')
# jamon
for x,y in [(126,94),(176,90)]:
    a(f'<rect x="{x}" y="{y}" width="9" height="6" rx="1.5" fill="#C46A5E" transform="rotate({R.randint(0,90)} {x} {y})"/>')
a('<ellipse cx="126" cy="84" rx="22" ry="2.6" fill="#fff" opacity=".28"/>')
escribe('chilindron', o)
print('batch6 OK')
