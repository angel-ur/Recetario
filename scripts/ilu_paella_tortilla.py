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
for _ in range(330):
    t = R.random() * 6.283; r = math.sqrt(R.random())
    x = 160 + math.cos(t) * r * 112; y = 106 + math.sin(t) * r * 37
    c = R.choice(['#FFE38A', '#F7C94A', '#EDB635', '#FFF0B0'])
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="2.4" ry=".9" fill="{c}" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/>')
# judias verdes
for (x, y, r) in [(80,100,-20),(120,76,10),(205,70,-5),(236,96,25),(150,126,5),(100,120,-30),(250,112,15),(185,128,-15)]:
    a(f'<path d="M{x} {y}q16 -7 32 {r/4:.0f}" stroke="#4E9A3F" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M{x+2} {y-1}q14 -6 28 {r/4:.0f}" stroke="#8CC565" stroke-width="1.4" stroke-linecap="round" fill="none"/>')
# garrofo (alubias blancas)
for _ in range(11):
    x = R.uniform(70, 250); y = R.uniform(84, 128)
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4.6" ry="3" fill="#F4EEDC" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/><ellipse cx="{x-1:.1f}" cy="{y-1:.1f}" rx="1.8" ry="1" fill="#fff"/>')
# trozos de pollo/conejo
def trozo(x, y, rot, w=44, h=22):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><ellipse cx="0" cy="{h/2:.0f}" rx="{w/2}" ry="5" fill="#000" opacity=".15"/>'
            f'<ellipse cx="0" cy="0" rx="{w/2}" ry="{h/2}" fill="#A9511C"/><ellipse cx="-2" cy="-2" rx="{w/2-4}" ry="{h/2-4}" fill="#C8782F"/>'
            f'<ellipse cx="-6" cy="-5" rx="{w/4}" ry="3" fill="#E7A55A" opacity=".8"/><ellipse cx="8" cy="2" rx="6" ry="2.4" fill="#8C3E12" opacity=".6"/></g>')
for (x, y, r) in [(120,104,-15),(205,92,10),(238,110,30),(160,112,0),(96,92,-35)]:
    a(trozo(x, y, r))
# romero y pimiento
a('<path d="M170 88l24 -6M178 84l8 -10M184 83l10 -8" stroke="#3E7A35" stroke-width="2.2" stroke-linecap="round"/>')
for (x, y) in [(140, 90), (222, 120)]:
    a(f'<path d="M{x} {y}q14 -8 28 0" stroke="#C7261B" stroke-width="5" stroke-linecap="round" fill="none"/>')
# limones
for (x, y, ro) in [(24, 150, -20), (296, 152, 15)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-17 0a17 17 0 0 1 34 0z" fill="#F4D93A"/><path d="M-13 0a13 13 0 0 1 26 0z" fill="#FBF08A"/>' + ''.join(f'<path d="M0 0L{13*math.cos(math.pi+t*math.pi/4):.1f} {13*math.sin(math.pi+t*math.pi/4):.1f}" stroke="#F0D63A" stroke-width=".9"/>' for t in range(1,4)) + '</g>')
escribe('paella', o)

# ---------- TORTILLA ----------
R = random.Random(5); o = []; a = o.append
a(mesa(R, ('#EBD7B0', '#CFA874')))
a('<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + grad('tor', '#F4C94B', '#D79A2C') + rad('yema', '#FFD33A', '#F0A71A') + grad('int', '#F9DE7A', '#EDC55B') + '</defs>')
# trapo
a('<path d="M-5 120L90 150L40 190H-5z" fill="#D8E0EA"/><path d="M-5 128L80 156" stroke="#3C5C8E" stroke-width="3" opacity=".8"/><path d="M-5 138L66 162" stroke="#3C5C8E" stroke-width="3" opacity=".8"/>')
a(sombra(168, 156, 124, 12, .25))
a('<ellipse cx="168" cy="112" rx="124" ry="54" fill="#D4CCBB"/><ellipse cx="168" cy="108" rx="124" ry="54" fill="url(#IDpl)"/><ellipse cx="168" cy="110" rx="96" ry="40" fill="none" stroke="#CFC7B5" stroke-width="1.5"/>')
# tortilla (cupula)
a('<ellipse cx="168" cy="114" rx="92" ry="38" fill="#B9791F"/>')
a('<path d="M76 108C80 70 120 56 168 56S256 70 260 108C240 134 100 134 76 108Z" fill="url(#IDtor)"/>')
a('<ellipse cx="168" cy="92" rx="84" ry="28" fill="#E8B23E"/>')
a('<ellipse cx="164" cy="88" rx="70" ry="22" fill="#F2C650"/>')
for _ in range(16):
    x = 168 + R.uniform(-70, 70); y = 90 + R.uniform(-18, 16)
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{R.uniform(4,10):.1f}" ry="{R.uniform(1.5,3.5):.1f}" fill="#C27C1F" opacity="{R.uniform(.2,.4):.2f}"/>')
a('<path d="M96 84C120 66 170 62 220 70" fill="none" stroke="#FFF1B8" stroke-width="3.5" stroke-linecap="round" opacity=".75"/>')
# cuna cortada
a('<path d="M168 108L120 70C140 52 196 50 228 66Z" fill="#8B5A12" opacity=".0"/>')
a('<path d="M168 112L222 74C240 92 244 112 236 122C214 134 186 128 168 112Z" fill="url(#IDint)"/>')
a('<path d="M168 112L222 74" stroke="#C48A24" stroke-width="3"/><path d="M168 112C186 128 214 134 236 122" stroke="#C48A24" stroke-width="3" fill="none"/>')
# interior: patata, cebolla, huevo meloso
for _ in range(20):
    x = R.uniform(180, 232); y = R.uniform(94, 124)
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{R.uniform(4,7):.1f}" ry="{R.uniform(2,3.5):.1f}" fill="#F7E7A0" stroke="#D9B253" stroke-width=".7" transform="rotate({R.randint(-40,40)} {x:.1f} {y:.1f})"/>')
for _ in range(7):
    x = R.uniform(188, 230); y = R.uniform(98, 122)
    a(f'<path d="M{x:.1f} {y:.1f}q5 -3 9 0" stroke="#F0B64E" stroke-width="1.6" fill="none" stroke-linecap="round"/>')
a('<ellipse cx="212" cy="112" rx="14" ry="6" fill="url(#IDyema)" opacity=".85"/><ellipse cx="208" cy="110" rx="5" ry="2" fill="#FFF3B0" opacity=".7"/>')
a('<path d="M190 126C204 130 224 128 236 122" stroke="#F3C32A" stroke-width="3" stroke-linecap="round" opacity=".8" fill="none"/>')
# perejil, tenedor, cebolleta
a(f'<g fill="#4E9A3F">' + ''.join(f'<ellipse cx="{x}" cy="{y}" rx="2.6" ry="1.4" transform="rotate({r} {x} {y})"/>' for x,y,r in [(120,80,20),(135,74,-10),(100,96,40)]) + '</g>')
a('<g transform="translate(268 130) rotate(-62)"><rect x="-3" y="0" width="6" height="58" rx="3" fill="#B9BCC4"/><rect x="-9" y="-22" width="18" height="24" rx="4" fill="#C9CCD3"/>' + ''.join(f'<rect x="{x}" y="-30" width="2.6" height="14" rx="1.3" fill="#C9CCD3"/>' for x in (-8,-3,2,6)) + '</g>')
# huevo crudo al lado
a('<ellipse cx="46" cy="156" rx="15" ry="19" fill="#E9C9A0"/><ellipse cx="41" cy="150" rx="5" ry="8" fill="#F8E6C8" opacity=".8"/>')
escribe('tortilla', o)
