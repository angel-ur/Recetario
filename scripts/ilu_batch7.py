import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'

# ---- PIL-PIL: cazuelita de barro con bacalao en su gelatina, ajos y guindilla
R = random.Random(101); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro', '#C96F40', '#8F4222') + rad('pil', '#F0E2B0', '#D9BE78') + '</defs>')
a(sombra(150, 152, 106, 10, .28))
a('<path d="M48 92c0 38 26 56 102 56s102-18 102-56z" fill="url(#IDbarro)"/>')
a('<ellipse cx="150" cy="92" rx="102" ry="25" fill="#A9552C"/><ellipse cx="150" cy="94" rx="92" ry="20" fill="url(#IDpil)"/>')
# burbujas de la gelatina
for _ in range(30):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 150+math.cos(t)*r*84; y = 94+math.sin(t)*r*17
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.8,2):.1f}" fill="none" stroke="#C8A860" stroke-width=".8" opacity=".7"/>')
# lomos de bacalao blancos rosados
for x,y,ro in [(112,90,-12),(152,98,8),(188,88,20)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="20" ry="8" fill="#000" opacity=".12"/><g transform="translate({x} {y}) rotate({ro})"><rect x="-19" y="-7" width="38" height="14" rx="7" fill="#F4E9DC"/><rect x="-19" y="-7" width="38" height="5" rx="2.5" fill="#E4C4B0"/><path d="M-12 1q10 3 24 0" stroke="#D9C6B2" stroke-width="1.4" fill="none"/></g>')
# rodajas de ajo doradas y guindillas
for x,y,ro in [(96,96,20),(140,84,-30),(196,98,45),(168,92,0)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><circle r="4.5" fill="#F2E3B0"/><circle r="3.2" fill="#D9BE78"/></g>')
for x,y,ro in [(128,100,-25),(180,80,35)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-10 0Q0 -4 10 0 8 3 0 3 -8 3 -10 0Z" fill="#A8321F"/><path d="M10 0l5 -3" stroke="#5E8A3C" stroke-width="2" stroke-linecap="round"/></g>')
a('<ellipse cx="116" cy="86" rx="20" ry="2.4" fill="#fff" opacity=".35"/>')
escribe('pilpil', o)

# ---- CALDERETA: cazuela de guiso de cordero con patatas y caldo oscuro
R = random.Random(103); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + grad('barro2', '#C96F40', '#8F4222') + rad('cald', '#A8542A', '#7C3816') + '</defs>')
a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 90c0 40 28 60 112 60s112-20 112-60z" fill="url(#IDbarro2)"/>')
a('<rect x="22" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="90" rx="112" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="102" ry="21" fill="url(#IDcald)"/>')
# trozos de cordero con hueso
for x,y,ro in [(110,88,-18),(158,96,12)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="20" ry="8" fill="#000" opacity=".14"/><g transform="translate({x} {y}) rotate({ro})"><ellipse rx="18" ry="10" fill="#8A5A34"/><ellipse cx="-2" cy="-2" rx="12" ry="6" fill="#A87044"/><rect x="10" y="-3" width="12" height="6" rx="3" fill="#EFE2C4"/><circle cx="22" cy="-3" r="3.5" fill="#F4EAD2"/><circle cx="22" cy="3" r="3.5" fill="#F4EAD2"/></g>')
# patatas
for x,y,ro in [(200,90,20),(140,84,-8)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><ellipse rx="13" ry="8" fill="#F2E0A8"/><path d="M-6 -2q6-3 12 0" stroke="#E2C87E" stroke-width="1.6" fill="none"/></g>')
# zanahoria y guisantes
for x,y,ro in [(90,96,30),(186,100,-20)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-10" y="-3.5" width="20" height="7" rx="3.5" fill="#E8812A"/><rect x="-8" y="-2.4" width="16" height="2.2" rx="1.1" fill="#F4A24E"/></g>')
for _ in range(10):
    x = 160+R.uniform(-80,80); y = 94+R.uniform(-13,13)
    if ((x-160)/95)**2+((y-94)/17)**2 > 1: continue
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.6" fill="#6E9A3E"/><circle cx="{x-0.8:.1f}" cy="{y-0.8:.1f}" r=".9" fill="#9CC265"/>')
a('<ellipse cx="126" cy="84" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
escribe('caldereta', o)

# ---- CALLOS: cazuela con callos, chorizo, morcilla y garbanzos en salsa roja
R = random.Random(107); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro3', '#C96F40', '#8F4222') + rad('cal2', '#B8401E', '#8E2A12') + '</defs>')
a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 90c0 40 28 60 112 60s112-20 112-60z" fill="url(#IDbarro3)"/>')
a('<rect x="22" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="90" rx="112" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="102" ry="21" fill="url(#IDcal2)"/>')
# cintas de callos (blanquecinas, rizadas)
for _ in range(8):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*78; y = 92+math.sin(t)*r*15
    ro = R.randint(-40,40)
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({ro})"><path d="M-14 0q4 -5 8 0t8 0" stroke="#F0E4D0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-14 0q4 -5 8 0t8 0" stroke="#D9C2A8" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>')
# chorizo y morcilla
for x,y in [(112,86),(176,96),(208,88)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="12" ry="6" fill="#B3341F"/><ellipse cx="{x-2}" cy="{y-1.5}" rx="7" ry="2.4" fill="#E27A5E" opacity=".7"/>')
a('<ellipse cx="146" cy="86" rx="12" ry="6" fill="#3B1E1A"/><ellipse cx="144" cy="84.5" rx="6" ry="2" fill="#7A4A40" opacity=".7"/>')
# garbanzos
for _ in range(14):
    x = 160+R.uniform(-80,80); y = 92+R.uniform(-14,14)
    if ((x-160)/95)**2+((y-92)/17)**2 > 1: continue
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="#E9C77C"/><circle cx="{x-1:.1f}" cy="{y-1:.1f}" r="1" fill="#F7E2AC"/>')
a('<ellipse cx="126" cy="82" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
escribe('callos', o)
print('batch7 OK')
