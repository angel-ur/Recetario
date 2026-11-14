import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
# ---------- COCIDO ----------
R = random.Random(21); o = []; a = o.append
a(mesa(R, ('#E6D0A4', '#C79B62')))
a('<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + rad('gar', '#E9C77C', '#CFA24C') + grad('cho', '#C8452A', '#8E2A18') + grad('barro', '#C7683A', '#8F4222') + rad('cal', '#F0C860', '#D49B30') + '</defs>')
a(sombra(120, 156, 100, 10, .25))
a('<ellipse cx="120" cy="112" rx="104" ry="44" fill="#D4CCBB"/><ellipse cx="120" cy="108" rx="104" ry="44" fill="url(#IDpl)"/><ellipse cx="120" cy="110" rx="82" ry="32" fill="none" stroke="#CFC7B5" stroke-width="1.5"/>')
a('<ellipse cx="120" cy="108" rx="70" ry="27" fill="url(#IDgar)"/>')
for _ in range(90):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 120+math.cos(t)*r*64; y = 108+math.sin(t)*r*23
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="{R.choice(["#F2D58F","#E5BE6A","#D9AE58"])}"/><circle cx="{x-1:.1f}" cy="{y-1:.1f}" r="1" fill="#FFF3CC" opacity=".8"/>')
for x,y in [(86,96),(112,88),(144,92),(162,106)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="13" ry="5" fill="#000" opacity=".12"/><ellipse cx="{x}" cy="{y}" rx="13" ry="7" fill="url(#IDcho)"/><ellipse cx="{x}" cy="{y}" rx="13" ry="7" fill="none" stroke="#6E1E10" stroke-width="1"/><circle cx="{x-5}" cy="{y-1}" r="1.6" fill="#F0D4B0"/><circle cx="{x+4}" cy="{y+1}" r="1.6" fill="#F0D4B0"/><ellipse cx="{x-3}" cy="{y-3}" rx="6" ry="1.4" fill="#fff" opacity=".35"/>')
a('<path d="M72 118q16-12 34-6 12 4 4 14-18 8-38-8z" fill="#B88A3E"/><path d="M80 118q12-6 24-2" stroke="#E0BC6A" stroke-width="2" fill="none" stroke-linecap="round"/>')
a('<path d="M128 118q18-10 34 0 6 8-4 14-18 4-30-14z" fill="#8F3A2A"/><path d="M134 120q10-6 20-2" stroke="#C26A50" stroke-width="2" fill="none" stroke-linecap="round"/>')
for x,y,ro in [(70,104,-30),(172,114,40)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-12" y="-4" width="24" height="8" rx="4" fill="#E88A2A"/><rect x="-10" y="-3" width="18" height="2.4" rx="1.2" fill="#F8B866"/></g>')
a('<path d="M100 120q14 6 30 2-6 10-22 8-8-2-8-10z" fill="#7DB04F"/><path d="M104 123q10 4 22 1" stroke="#B9DB8B" stroke-width="1.4" fill="none"/>')
# cuenco sopa
a(sombra(262, 150, 50, 7, .25))
a('<path d="M214 104c2 30 18 44 48 44s46-14 48-44z" fill="#F4F0E6"/><path d="M222 112c4 18 16 26 40 26s36-8 40-26" fill="none" stroke="#3C5C8E" stroke-width="3"/>')
a('<ellipse cx="262" cy="104" rx="48" ry="13" fill="#E4DECF"/><ellipse cx="262" cy="105" rx="43" ry="10.5" fill="url(#IDcal)"/>')
for _ in range(16):
    x=262+R.uniform(-34,34); y=105+R.uniform(-6,6)
    a(f'<path d="M{x:.1f} {y:.1f}q5 -3 10 0" stroke="#F6E2A0" stroke-width="1.8" fill="none" stroke-linecap="round"/>')
a('<ellipse cx="248" cy="101" rx="16" ry="2" fill="#fff" opacity=".35"/>')
escribe('cocido', o)

# ---------- GAZPACHO ----------
R = random.Random(33); o = []; a = o.append
a(mesa(R, ('#ECD9B4', '#D2AC78')))
a('<defs>' + grad('gz', '#EE6A3C', '#D4452A') + rad('tom', '#F26A4B', '#C92E1E') + grad('pep', '#78B84A', '#3F8A32') + grad('pepe', '#E4402A', '#A91E14') + '</defs>')
a(sombra(120, 156, 66, 8, .25))
a('<path d="M62 70c2 56 22 84 58 84s56-28 58-84z" fill="#F4F0E6"/><path d="M68 76c4 40 20 66 52 66s48-26 52-66" fill="none" stroke="#3C5C8E" stroke-width="3"/>')
a('<ellipse cx="120" cy="70" rx="58" ry="15" fill="#E4DECF"/><ellipse cx="120" cy="71" rx="52" ry="12" fill="url(#IDgz)"/>')
a('<path d="M84 70q20 6 40 0" stroke="#F8A878" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>')
a('<path d="M104 68c10 6 22 2 30 6" stroke="#D8B640" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M90 74c8-2 14 0 22 3" stroke="#D8B640" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>')
a('<ellipse cx="102" cy="64" rx="16" ry="2" fill="#fff" opacity=".35"/>')
# crutones
for x,y,ro in [(130,70,10),(112,74,-20)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-5" y="-4" width="10" height="8" rx="2" fill="#D9A95A"/><rect x="-3.5" y="-3" width="7" height="3" rx="1.5" fill="#EEC882"/></g>')
# hortalizas
a(sombra(236, 150, 60, 7, .22))
a('<circle cx="212" cy="124" r="25" fill="url(#IDtom)"/><circle cx="205" cy="116" r="7" fill="#fff" opacity=".25"/><path d="M212 100l-8 4 8 -2 8 2z" fill="#3E7A35"/><path d="M204 102l8 6 8-6-8-3z" fill="#4E9A3F"/>')
a('<circle cx="254" cy="134" r="20" fill="url(#IDtom)"/><circle cx="248" cy="127" r="5" fill="#fff" opacity=".25"/><path d="M254 115l-6 3 6-1 6 1z" fill="#3E7A35"/>')
a('<path d="M262 90c18 4 26 22 20 42-4 10-18 8-18-4 0-14 4-18 0-26 -2-8-6-10-2-12z" fill="url(#IDpep)"/><path d="M268 96c8 6 10 16 8 26" stroke="#B9DB8B" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M262 90l-2-8" stroke="#2F6A2A" stroke-width="3" stroke-linecap="round"/>')
a('<g transform="translate(176 150) rotate(-12)"><rect x="-26" y="-7" width="52" height="14" rx="7" fill="#4E9A3F"/><rect x="-24" y="-5" width="48" height="4" rx="2" fill="#8CC565"/><ellipse cx="26" cy="0" rx="2" ry="7" fill="#E6F0C8"/></g>')
escribe('gazpacho', o)
