import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')

# ---- SOPA CASTELLANA: cazuelita de barro, caldo de ajo, pan, jamon y huevo pochado
R = random.Random(131); o = []; a = o.append
a(mesa(R, ('#E7D2A8', '#C89E66'))); a(DEFS())
a('<defs>' + grad('barro3', '#C96F40', '#8F4222') + rad('caldo', '#D8A34E', '#B07A2E') + '</defs>')
a(sombra(160, 154, 110, 10, .28))
a('<path d="M56 92c0 36 26 56 104 56s104-20 104-56z" fill="url(#IDbarro3)"/>')
a('<ellipse cx="160" cy="92" rx="104" ry="24" fill="#A9552C"/><ellipse cx="160" cy="94" rx="94" ry="19" fill="url(#IDcaldo)"/>')
# rebanadas de pan en el caldo
for x,y,ro in [(120,92,-14),(168,98,8),(204,90,-6)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-20" y="-8" width="40" height="16" rx="6" fill="#E3C084"/><rect x="-20" y="-8" width="40" height="16" rx="6" fill="none" stroke="#B8863E" stroke-width="1.6"/><path d="M-12 -2h24M-12 3h24" stroke="#C89A4E" stroke-width="1.4"/></g>')
# trocitos de jamon
for _ in range(9):
    x = 160+R.uniform(-76,76); y = 94+R.uniform(-13,13)
    if ((x-160)/88)**2+((y-94)/16)**2 > 1: continue
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({R.randint(-40,40)})"><rect x="-5" y="-3" width="10" height="6" rx="2" fill="#B34434"/><rect x="-5" y="-3" width="10" height="2" rx="1" fill="#E8A888"/></g>')
# huevo pochado coronando
a('<g transform="translate(160 88)"><ellipse rx="22" ry="12" fill="#FBF6E8"/><circle r="7" fill="#E9A02E"/><circle cx="-2" cy="-2" r="2.6" fill="#F7C25E"/></g>')
# pimenton: motitas
for _ in range(10):
    x = 160+R.uniform(-70,70); y = 94+R.uniform(-12,12)
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.7,1.3):.1f}" fill="#9C2E1E" opacity=".8"/>')
a('<ellipse cx="130" cy="82" rx="20" ry="2.4" fill="#fff" opacity=".25"/>')
# dientes de ajo al lado, en la mesa
a('<g transform="translate(266 130)"><ellipse rx="12" ry="9" fill="#F0E4CC"/><path d="M-8 -2q4 -8 8 -10M0 -3q4 -7 8 -8" stroke="#D8C4A0" stroke-width="1.6" fill="none"/><path d="M-4 -8l2 -4M2 -9l2 -4" stroke="#C8B088" stroke-width="1.4"/></g>')
escribe('sopacastellana', o)

# ---- ZARANGOLLO: cazuela baja con revuelto de calabacin, cebolla y huevo
R = random.Random(137); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + grad('barro4', '#C96F40', '#8F4222') + rad('zar', '#E8C86A', '#C89A3E') + '</defs>')
a(sombra(160, 150, 116, 10, .26))
a('<path d="M52 94c0 30 28 46 108 46s108-16 108-46z" fill="url(#IDbarro4)"/>')
a('<ellipse cx="160" cy="94" rx="108" ry="24" fill="#A9552C"/><ellipse cx="160" cy="96" rx="98" ry="19" fill="url(#IDzar)"/>')
# revuelto: grumos de huevo
for _ in range(18):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*82; y = 96+math.sin(t)*r*14
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{R.uniform(6,11):.1f}" ry="{R.uniform(3.5,6):.1f}" fill="{R.choice(["#F2D87E","#E9C86A","#F6E2A0"])}" transform="rotate({R.randint(-30,30)} {x:.1f} {y:.1f})"/>')
# rodajas/ medias lunas de calabacin
for x,y,ro in [(116,92,-18),(150,100,10),(188,90,-8),(214,98,24),(140,88,40)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><circle r="8" fill="#7DA05A"/><circle r="5.6" fill="#B9D09A"/></g>')
# cebolla pochada: hebras doradas
for x,y,ro in [(128,98,14),(170,90,-22),(198,94,30),(106,100,-34)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-11 0q5 -4 11 0" stroke="#F6EBC8" stroke-width="3" fill="none" stroke-linecap="round"/></g>')
a('<ellipse cx="128" cy="86" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
# calabacin entero en la mesa
a('<g transform="translate(42 138) rotate(-18)"><rect x="-26" y="-7" width="52" height="14" rx="7" fill="#4E7A38"/><rect x="-26" y="-7" width="52" height="6" rx="3" fill="#6A9A4E"/><rect x="-28" y="-3" width="6" height="6" rx="3" fill="#3E6228"/></g>')
escribe('zarangollo', o)

# ---- CHULETILLAS: fuente con chuletas de cordero a la brasa, marcas de parrilla
R = random.Random(139); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a(plato(160, 110, 120, 50))
def chuleta(x, y, ro):
    p = [f'<g transform="translate({x} {y}) rotate({ro})">']
    p.append('<ellipse rx="24" ry="15" fill="#B87E4A"/>')
    p.append('<ellipse cx="-2" cy="-2" rx="17" ry="10" fill="#CE9256"/>')
    # marcas de parrilla
    for dx in (-9, -2, 5):
        p.append(f'<path d="M{dx} -8l4 16" stroke="#7C4A22" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>')
    # hueso
    p.append('<rect x="18" y="-4" width="20" height="7" rx="3.5" fill="#F0E4CC"/><circle cx="38" cy="-4" r="4.6" fill="#F6EEDB"/><circle cx="38" cy="3" r="4.6" fill="#F6EEDB"/>')
    p.append('</g>')
    return ''.join(p)
a(chuleta(112, 100, -14)); a(chuleta(158, 116, 6)); a(chuleta(200, 98, 18))
# sarmientos / brasa: ramitas bajo la fuente? no: unas ramas al lado
a('<g transform="translate(56 142) rotate(10)"><path d="M-24 0q12 -6 24 -2M-20 4q10 -4 22 -1" stroke="#8A6A44" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>')
# romero
a('<g transform="translate(254 136) rotate(-30)"><rect x="-16" y="-1.2" width="32" height="2.4" fill="#4E6A34"/>' + ''.join(f'<path d="M{x} 0l-3 -5M{x} 0l-3 5" stroke="#5E7E3E" stroke-width="1.6"/>' for x in range(-12,16,6)) + '</g>')
escribe('chuletillas', o)
print('batch9 OK')
