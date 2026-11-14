import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')
def grano(R, n, cx, cy, rx, ry, col=('#F2E0A8','#E8CC8A','#F6E8BC')):
    s = []
    for _ in range(n):
        t = R.random()*6.283; r = math.sqrt(R.random())
        x = cx+math.cos(t)*r*rx; y = cy+math.sin(t)*r*ry
        s.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="2.6" ry="1.8" fill="{R.choice(col)}" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/>')
    return ''.join(s)

# ---- ARROZ AL HORNO: cazuela baja de barro con arroz, garbanzos, morcilla, costilla y cabeza de ajos
R = random.Random(149); o = []; a = o.append
a(mesa(R, ('#E7D2A8', '#C89E66'))); a(DEFS())
a('<defs>' + grad('barro5', '#C96F40', '#8F4222') + rad('arr', '#E8C06A', '#C08A34') + '</defs>')
a(sombra(160, 152, 114, 10, .28))
a('<path d="M50 92c0 34 28 52 110 52s110-18 110-52z" fill="url(#IDbarro5)"/>')
a('<ellipse cx="160" cy="92" rx="110" ry="25" fill="#A9552C"/><ellipse cx="160" cy="94" rx="100" ry="20" fill="url(#IDarr)"/>')
a(grano(R, 40, 160, 94, 88, 15))
# garbanzos
for _ in range(10):
    x = 160+R.uniform(-78,78); y = 94+R.uniform(-13,13)
    if ((x-160)/92)**2+((y-94)/17)**2 > 1: continue
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="#E9C77C"/><circle cx="{x-1:.1f}" cy="{y-1:.1f}" r="1" fill="#F7E2AC"/>')
# rodajas de morcilla y tomate asado encima
for x,y,ro in [(118,88,-10),(196,92,14)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><circle r="9" fill="#5E3226"/><circle r="9" fill="none" stroke="#7C4A38" stroke-width="1.6"/></g>')
a('<g transform="translate(158 84)"><circle r="8" fill="#C04834"/><circle r="5" fill="#D86A4E"/></g>')
# costilla: tira con huesitos
a('<g transform="translate(216 100) rotate(24)"><rect x="-16" y="-5" width="32" height="10" rx="5" fill="#B87E4A"/><circle cx="-10" cy="0" r="3" fill="#F0E4CC"/><circle cx="0" cy="0" r="3" fill="#F0E4CC"/><circle cx="10" cy="0" r="3" fill="#F0E4CC"/></g>')
# cabeza de ajos asada, clasica, en el centro-borde
a('<g transform="translate(80 102)"><circle r="10" fill="#EFE0C2"/><path d="M-6 -2q3 -6 6 -8M0 -3q3 -5 6 -7M-2 3q4 2 8 0" stroke="#D8BC8E" stroke-width="1.6" fill="none"/><circle r="2" fill="#C8A468"/></g>')
escribe('arrozhorno', o)

# ---- CALDERO: arroz caldoso oscuro del Mar Menor con pescado y nora
R = random.Random(151); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + grad('barro6', '#C96F40', '#8F4222') + rad('cald', '#B07838', '#8A5424') + '</defs>')
a(sombra(160, 154, 112, 10, .28))
a('<path d="M54 92c0 38 26 58 106 58s106-20 106-58z" fill="url(#IDbarro6)"/>')
a('<ellipse cx="160" cy="92" rx="106" ry="25" fill="#A9552C"/><ellipse cx="160" cy="94" rx="96" ry="20" fill="url(#IDcald)"/>')
a(grano(R, 34, 160, 94, 82, 14, ('#E0C088','#D4B078','#EACC9C')))
# burbujas del caldo
for _ in range(10):
    x = 160+R.uniform(-72,72); y = 94+R.uniform(-12,12)
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.8,1.8):.1f}" fill="#F0DCA8" opacity=".7"/>')
# pescado de roca: pieza con cabeza
a('<g transform="translate(150 90) rotate(-8)"><path d="M-30 0q4 -12 22 -12q22 0 26 12q-4 12 -26 12q-18 0 -22 -12z" fill="#9AA8B2"/><path d="M18 0l14 -8l-2 8l2 8z" fill="#82909A"/><circle cx="-20" cy="-3" r="2.2" fill="#2E3A42"/><path d="M-12 -6q10 -4 20 0" stroke="#C8D2DA" stroke-width="1.8" fill="none"/></g>')
# gambita
a('<g transform="translate(206 98) rotate(20)"><path d="M-10 2q0 -10 10 -10q8 0 8 7" stroke="#E89060" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="10" cy="-2" r="1.6" fill="#8A4020"/></g>')
# nora seca al lado
a('<g transform="translate(56 132) rotate(-14)"><path d="M-10 0q0 -14 10 -14q10 0 10 14q0 8 -10 8q-10 0 -10 -8z" fill="#7C2E1E"/><path d="M-4 -14l4 -6" stroke="#4E6A34" stroke-width="2.4"/></g>')
escribe('caldero', o)

# ---- RIOJANA: cazuela con patatas rotas, chorizo y pimiento choricero
R = random.Random(157); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + grad('barro7', '#C96F40', '#8F4222') + rad('rio', '#D88A42', '#B06428') + '</defs>')
a(sombra(160, 154, 114, 10, .28))
a('<path d="M52 90c0 40 28 60 108 60s108-20 108-60z" fill="url(#IDbarro7)"/>')
a('<ellipse cx="160" cy="90" rx="108" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="98" ry="21" fill="url(#IDrio)"/>')
# patatas rotas: cascos irregulares
for _ in range(8):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*74; y = 92+math.sin(t)*r*14; ro = R.randint(-30,30)
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({ro})"><path d="M-11 -2l4 -7l8 2l5 -3l4 8l-5 6l-9 1z" fill="#F2DEA0"/><path d="M-11 -2l4 -7l8 2l5 -3l4 8l-5 6l-9 1z" fill="none" stroke="#C8A45E" stroke-width="1.2"/></g>')
# chorizo: rodajas en cuña
for x,y,ro in [(118,88,-16),(150,96,8),(192,88,-6),(216,96,26),(170,84,40)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><circle r="8" fill="#B34434"/><circle r="8" fill="none" stroke="#8E2E22" stroke-width="1.4"/>'
      + ''.join(f'<circle cx="{R.uniform(-4,4):.1f}" cy="{R.uniform(-4,4):.1f}" r="1.3" fill="#E8A06A"/>' for _ in range(3))
      + '</g>')
# salsa: brillo y pimenton
a('<ellipse cx="126" cy="82" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
# pimiento choricero seco al lado
a('<g transform="translate(268 130) rotate(16)"><path d="M-8 0q0 -18 8 -18q8 0 8 18q0 10 -8 10q-8 0 -8 -10z" fill="#8E3A22"/><path d="M-2 -18l2 -8" stroke="#5E4A2E" stroke-width="2.4"/></g>')
escribe('riojana', o)
print('batch10 OK')
