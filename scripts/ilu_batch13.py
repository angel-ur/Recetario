import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from ilu_lib import *

# ---- SUQUET: cazuela de barro con caldo de azafran, rodajas de pescado, patata y langostino
R = random.Random(20261117); o = []; a = o.append
a(mesa(R))
a('<defs>'
  + grad('barro', '#C96F40', '#8F4222')
  + rad('caldo', '#E8B84E', '#C98F2E')
  + '</defs>')

def rodaja(x, y, ro, s=1.0):
    # rodaja de pescado: carne blanca con piel grisaceo-azulada
    return (f'<g transform="translate({x} {y}) rotate({ro}) scale({s})">'
            '<ellipse rx="21" ry="10" fill="#E9E4D8"/>'
            '<path d="M-21 0a21 10 0 0 1 42 0l-2 1.4a19 8.6 0 0 0-38 0z" fill="#7C8B96"/>'
            '<ellipse cy="1.4" rx="17" ry="7.4" fill="#F4F0E4"/>'
            '<path d="M-6 -2q6 -2 12 0M-8 2q8 -3 16 0" stroke="#DAD2BE" stroke-width="1.4" fill="none"/></g>')

def patata(x, y, ro):
    return (f'<g transform="translate({x} {y}) rotate({ro})">'
            '<ellipse rx="15" ry="9" fill="#E9C979"/>'
            '<ellipse cy="-1" rx="12" ry="6.6" fill="#F2DA9A"/>'
            '<circle cx="-3" cy="-1" r="1" fill="#D9B264"/><circle cx="4" cy="1" r=".9" fill="#D9B264"/></g>')

def langostino(x, y, ro, s=1.0):
    return (f'<g transform="translate({x} {y}) rotate({ro}) scale({s})">'
            '<path d="M-16 2Q-10 -10 2 -10Q16 -10 16 0Q16 8 6 8L2 8Q8 4 6 0Q4 -4 -2 -4Q-10 -4 -12 4Z" fill="#E8763E"/>'
            '<path d="M-12 -2l4 3M-8 -6l4 3M-3 -8.4l4 3M2 -9l4 3M7 -8.6l4 3" stroke="#C94F22" stroke-width="1.5" fill="none"/>'
            '<path d="M16 0l7 -3M16 1.6l7 -1M15 3l6 2" stroke="#E8763E" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
            '<circle cx="-13" cy="-3" r="1.1" fill="#8A2E12"/></g>')

a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 90c0 40 28 60 112 60s112-20 112-60z" fill="url(#IDbarro)"/>')
a('<rect x="22" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="90" rx="112" ry="26" fill="#A9552C"/>')
a('<ellipse cx="160" cy="92" rx="102" ry="21" fill="url(#IDcaldo)"/>')
# contenido
a('<ellipse cx="112" cy="95" rx="21" ry="8" fill="#4A2E10" opacity=".12"/>')
a(patata(112, 92, -12))
a('<ellipse cx="158" cy="99" rx="20" ry="8" fill="#4A2E10" opacity=".12"/>')
a(rodaja(158, 95, 8))
a('<ellipse cx="206" cy="93" rx="20" ry="8" fill="#4A2E10" opacity=".12"/>')
a(rodaja(206, 89, -14, .92))
a(patata(140, 86, 20))
a(patata(228, 98, 14))
a(langostino(96, 84, -24, .9))
# perejil por encima
for x, y, ro in [(128, 100, 30), (176, 87, -40), (214, 101, 70), (148, 96, 100)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M0 -4C3 -3 3 2 0 4-3 2-3 -3 0 -4z" fill="#4E7A2E"/></g>')
a('<ellipse cx="126" cy="84" rx="22" ry="2.6" fill="#fff" opacity=".30"/>')
escribe('suquet', o)
print('batch13 OK')
