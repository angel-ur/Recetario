import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *

# ---------- PAELLA ----------
R = random.Random(11); o = []; a = o.append
a(mesa(R, ('#E2C896', '#BF9156')))
a('<defs>' + grad('met', '#6C6C70', '#2E2E32') + rad('arroz', '#F6CE55', '#E2A62B') + grad('lat', '#8E8E94', '#4A4A50') + '</defs>')
a(sombra(160, 158, 140, 12, .28))
# asas
a('<rect x="8" y="98" width="34" height="8" rx="4" fill="#3A3A3E"/><rect x="278" y="98" width="34" height="8" rx="4" fill="#3A3A3E"/>')
# paellera
a('<ellipse cx="160" cy="112" rx="136" ry="52" fill="url(#IDlat)"/>')
a('<ellipse cx="160" cy="106" rx="136" ry="52" fill="url(#IDmet)"/>')
a('<ellipse cx="160" cy="106" rx="124" ry="45" fill="#201F22"/>')
a('<ellipse cx="160" cy="106" rx="118" ry="41" fill="url(#IDarroz)"/>')
a('<ellipse cx="160" cy="106" rx="118" ry="41" fill="none" stroke="#8A4A12" stroke-width="5" opacity=".55"/>')  # socarrat
a('<path d="M40 100C60 66 120 56 170 58" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>')
# granos de arroz
for _ in range(260):
    t = R.random() * 6.283; r = math.sqrt(R.random())
    x = 160 + math.cos(t) * r * 112; y = 106 + math.sin(t) * r * 37
    c = R.choice(['#FFE38A', '#F7C94A', '#EDB635', '#FFF0B0'])
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="2.4" ry=".9" fill="{c}" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/>')
# judias verdes
for (x, y, r) in [(120,76,10),(236,96,25),(100,120,-30),(185,128,-15)]:
    a(f'<path d="M{x} {y}q16 -7 32 {r/4:.0f}" stroke="#4E9A3F" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M{x+2} {y-1}q14 -6 28 {r/4:.0f}" stroke="#8CC565" stroke-width="1.4" stroke-linecap="round" fill="none"/>')
# garrofo (alubias blancas)
for _ in range(4):
    x = R.uniform(70, 250); y = R.uniform(84, 128)
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4.6" ry="3" fill="#F4EEDC" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/><ellipse cx="{x-1:.1f}" cy="{y-1:.1f}" rx="1.8" ry="1" fill="#fff"/>')
# trozos de pollo/conejo
def trozo(x, y, rot, w=44, h=22):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><ellipse cx="0" cy="{h/2:.0f}" rx="{w/2}" ry="5" fill="#000" opacity=".15"/>'
            f'<ellipse cx="0" cy="0" rx="{w/2}" ry="{h/2}" fill="#A9511C"/><ellipse cx="-2" cy="-2" rx="{w/2-4}" ry="{h/2-4}" fill="#C8782F"/>'
            f'<ellipse cx="-6" cy="-5" rx="{w/4}" ry="3" fill="#E7A55A" opacity=".8"/><ellipse cx="8" cy="2" rx="6" ry="2.4" fill="#8C3E12" opacity=".6"/></g>')
def muslo(x, y, rot):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><ellipse cx="0" cy="14" rx="30" ry="4" fill="#000" opacity=".15"/>'
            '<rect x="14" y="-3" width="24" height="6" rx="3" fill="#F3E7CC"/><circle cx="40" cy="-3" r="4" fill="#F7EEDA"/><circle cx="40" cy="3" r="4" fill="#F7EEDA"/>'
            '<ellipse cx="0" cy="0" rx="22" ry="13" fill="#A9511C"/><ellipse cx="-2" cy="-2" rx="18" ry="9.5" fill="#C8782F"/><ellipse cx="-7" cy="-5" rx="9" ry="3" fill="#EBB066" opacity=".85"/><ellipse cx="6" cy="3" rx="7" ry="2.4" fill="#8C3E12" opacity=".55"/></g>')
for (x, y, r) in [(118,100,-20),(212,92,12),(158,118,185)]:
    a(muslo(x, y, r))
a('<path d="M176 86l26 -8M184 82l9 -10M192 81l9 -9M200 79l5 -9" stroke="#3E7A35" stroke-width="2.4" stroke-linecap="round"/>')
for (x, y) in [(232, 116), (96, 114)]:
    a(f'<path d="M{x} {y}q12 -7 24 0" stroke="#C7261B" stroke-width="5" stroke-linecap="round" fill="none"/>')
# romero y pimiento

for (x, y) in []:
    a(f'<path d="M{x} {y}q14 -8 28 0" stroke="#C7261B" stroke-width="5" stroke-linecap="round" fill="none"/>')
# limones
for (x, y, ro) in [(296, 152, 15)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-17 0a17 17 0 0 1 34 0z" fill="#F4D93A"/><path d="M-13 0a13 13 0 0 1 26 0z" fill="#FBF08A"/>' + ''.join(f'<path d="M0 0L{13*math.cos(math.pi+t*math.pi/4):.1f} {13*math.sin(math.pi+t*math.pi/4):.1f}" stroke="#F0D63A" stroke-width=".9"/>' for t in range(1,4)) + '</g>')
escribe('paella', o)

# ---------- TORTILLA ----------
R = random.Random(5); o = []; a = o.append
a(mesa(R))
a('<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + grad('tor', '#F4C94B', '#D79A2C') + grad('corte', '#C98A2A', '#9A6516') + rad('yema', '#FFE060', '#FFB81A') + '</defs>')
a(sombra(160, 156, 126, 11, .22))
a('<ellipse cx="160" cy="112" rx="126" ry="54" fill="#D4CCBB"/><ellipse cx="160" cy="108" rx="126" ry="54" fill="url(#IDpl)"/><ellipse cx="160" cy="110" rx="102" ry="42" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')
# tortilla entera detras (izquierda)
a('<ellipse cx="108" cy="104" rx="64" ry="26" fill="#B9791F"/><path d="M46 98C50 72 80 62 108 62S166 72 170 98C156 116 62 116 46 98Z" fill="url(#IDtor)"/><ellipse cx="108" cy="86" rx="58" ry="19" fill="#EDB942"/><ellipse cx="104" cy="83" rx="46" ry="14" fill="#F4CB58"/><path d="M66 82C82 70 120 68 150 74" fill="none" stroke="#FFF1B8" stroke-width="3" stroke-linecap="round" opacity=".7"/>')
# porcion cortada delante-derecha, vista de lado: corteza dorada y corte grande
a('<ellipse cx="226" cy="132" rx="62" ry="9" fill="#000" opacity=".12"/>')
a('<path d="M170 128L186 70Q226 52 280 76L262 132Q220 142 170 128Z" fill="url(#IDcorte)"/>')   # corteza
a('<path d="M177 124L191 76Q226 62 272 80L257 126Q220 134 177 124Z" fill="#F3D869"/>')           # interior huevo
# capas de patata
for (x, y, w, ro) in [(196,92,20,-8),(224,86,22,4),(250,96,20,12),(206,110,22,6),(238,112,22,-6),(188,118,14,-4),(262,116,12,8)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="{w/2}" ry="5.4" fill="#FFF0B8" stroke="#E2B54F" stroke-width="1.2" transform="rotate({ro} {x} {y})"/>')
for (x, y) in [(212,100),(244,102),(230,120),(200,124)]:
    a(f'<path d="M{x} {y}q7 -4 13 0" stroke="#F0B13C" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
# huevo meloso brillante
a('<path d="M214 104C222 98 246 100 250 110C256 122 236 128 222 124C208 120 206 110 214 104Z" fill="url(#IDyema)"/>')
a('<path d="M222 106C230 103 240 104 244 108" stroke="#FFFBD0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>')
# hilo de huevo cayendo al plato
a('<path d="M236 126C238 136 232 142 238 146C250 150 262 146 256 140C250 138 252 130 250 124Z" fill="#FFC826"/><path d="M242 136c2 3 6 4 10 3" stroke="#FFF3A0" stroke-width="2" stroke-linecap="round" fill="none"/>')
# tenedor
a('<g transform="translate(150 140) rotate(-72)"><rect x="-3" y="0" width="6" height="52" rx="3" fill="#B9BCC4"/><rect x="-9" y="-22" width="18" height="24" rx="4" fill="#C9CCD3"/>' + ''.join(f'<rect x="{x}" y="-30" width="2.6" height="14" rx="1.3" fill="#C9CCD3"/>' for x in (-8,-3,2,6)) + '</g>')
escribe('tortilla', o)
