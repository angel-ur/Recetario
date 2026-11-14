import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')

# ---- PISTO: sarten baja con verdura confitada y huevo frito
R = random.Random(71); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('sar', '#7A7A84', '#4E4E58') + rad('pis', '#C2582E', '#9C3E1E') + grad('hue', '#F8F4E8', '#EDE4CE') + '</defs>')
a(sombra(150, 148, 110, 10, .28))
a('<path d="M44 96c0 26 26 44 106 44s106-18 106-44z" fill="url(#IDsar)"/><ellipse cx="150" cy="96" rx="106" ry="26" fill="#3C3C44"/><ellipse cx="150" cy="97" rx="95" ry="20" fill="url(#IDpis)"/>')
a('<rect x="256" y="90" width="50" height="11" rx="5.5" fill="#5A5A64"/><circle cx="299" cy="95" r="3" fill="#3C3C44"/>')
# dados de verdura: pimiento verde, rojo, calabacin, cebolla
for _ in range(48):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 150+math.cos(t)*r*86; y = 97+math.sin(t)*r*16.5
    a(f'<rect x="{x:.1f}" y="{y:.1f}" width="{R.uniform(4,7):.1f}" height="{R.uniform(3,5):.1f}" rx="1.5" fill="{R.choice(["#5E8A3C","#7DAB52","#B3341F","#8E2416","#E8D9A0","#D9B84A"])}" opacity=".92" transform="rotate({R.randint(0,90)} {x:.1f} {y:.1f})"/>')
# huevo frito encima
a('<g transform="translate(150 92)"><path d="M-26 -4Q-30 -14 -16 -15 -4 -20 8 -14 24 -16 26 -4 28 8 12 10 0 14 -14 10 -28 6 -26 -4Z" fill="url(#IDhue)" stroke="#E2D4B4" stroke-width="1.2"/><circle cx="0" cy="-2" r="8.5" fill="#F2B41E"/><circle cx="-1.5" cy="-3.5" r="3" fill="#F8D05A"/></g>')
escribe('pisto', o)

# ---- ARROZ CON LECHE: cuenco con arroz cremoso, canela molida y rama
R = random.Random(73); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + rad('arr', '#F8F0DC', '#EAD9AE') + '</defs>')
a(sombra(140, 152, 84, 9, .25))
a('<path d="M64 88c2 40 28 60 76 60s74-20 76-60z" fill="#F4F0E6"/><path d="M72 96c4 30 24 46 68 46s64-16 68-46" fill="none" stroke="#3C5C8E" stroke-width="3"/>')
a('<ellipse cx="140" cy="88" rx="76" ry="20" fill="#E4DECF"/><ellipse cx="140" cy="89" rx="69" ry="16.5" fill="url(#IDarr)"/>')
# granos de arroz
for _ in range(70):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 140+math.cos(t)*r*62; y = 89+math.sin(t)*r*13.5
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="3.4" ry="1.7" fill="{R.choice(["#FBF6E6","#F4EAD0","#EFE2BC"])}" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/>')
# canela molida espolvoreada en el centro
for _ in range(40):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 140+math.cos(t)*r*30; y = 89+math.sin(t)*r*7
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.6,1.3):.1f}" fill="#8A5A28" opacity=".8"/>')
# rama de canela cruzada y piel de limon
a('<g transform="translate(196 78) rotate(28)"><rect x="-22" y="-4.5" width="44" height="9" rx="4.5" fill="#8A4E22"/><rect x="-22" y="-4.5" width="44" height="3.4" rx="1.7" fill="#A86834"/><ellipse cx="-22" cy="0" rx="3.4" ry="4.5" fill="#6E3A16"/></g>')
a('<path d="M84 108q14-10 26-2 4 4-2 8-14 6-26 2-6-4 2-8z" fill="#F2C93C"/><path d="M88 108q10-6 20-1" stroke="#F8E27A" stroke-width="2" fill="none" stroke-linecap="round"/>')
a('<ellipse cx="112" cy="84" rx="20" ry="2.4" fill="#fff" opacity=".4"/>')
escribe('arrozleche', o)

# ---- XATO: plato con escarola, bacalao desmigado, salsa romesco, olivas y anchoas
R = random.Random(79); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + rad('rom', '#C26A34', '#9C4A1E') + '</defs>')
a(plato(160, 108, 118, 50))
# lecho de salsa romesco
a('<ellipse cx="160" cy="106" rx="86" ry="30" fill="url(#IDrom)"/>')
# hojas de escarola (corazon amarillo, puntas verdes)
for i in range(9):
    t = -0.35 + i*0.42
    x = 160+math.cos(t)*52; y = 104+math.sin(t)*20
    col = '#E8E4A0' if i%3==0 else ('#B9C97A' if i%3==1 else '#8FAE52')
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({math.degrees(t)+90:.0f})"><path d="M0 0Q-7 -12 0 -22 7 -12 0 0Z" fill="{col}"/><path d="M0 -2L0 -18" stroke="#6E8A3C" stroke-width="1" opacity=".6"/></g>')
# bacalao desmigado
for x,y in [(130,100),(158,112),(188,98),(146,96)]:
    a(f'<g transform="translate({x} {y}) rotate({R.randint(-25,25)})"><path d="M-12 -4Q0 -8 12 -3 13 3 4 5 -9 6 -12 1Z" fill="#F2E8D8"/><path d="M-8 -1q8-3 16 0" stroke="#D9C6AC" stroke-width="1.4" fill="none"/></g>')
# olivas negras y anchoas
for x,y in [(118,110),(172,92),(196,108)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="6" ry="4.5" fill="#3A3038"/><ellipse cx="{x-1.5}" cy="{y-1.5}" rx="2" ry="1.4" fill="#6A5A66"/>')
for x,y,ro in [(140,106,15),(182,102,-20)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-14" y="-2.5" width="28" height="5" rx="2.5" fill="#8A6A52"/><rect x="-12" y="-1.5" width="24" height="1.6" fill="#B89A7E"/></g>')
escribe('xato', o)
print('batch5 OK')
