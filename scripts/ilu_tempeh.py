"""Portada de tempeh en el estilo de la casa: fondo crema, plato con aro azul, tempeh frito en lonchas y sambal."""
import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
from ilu_batch3 import plato, DEFS, cuenco
R = random.Random(11); o = []; a = o.append
a(mesa(R)); a(DEFS())
a('<defs>' + grad('fr', '#E8B04A', '#B8741F') + grad('ce', '#FBF6E4', '#E8DDBC') + rad('sam', '#E5482F', '#A52418') + '</defs>')
a(plato(150, 108, 112, 50))
def loncha(x, y, ro, w=46, h=22, frito=True):
    s = f'<g transform="translate({x} {y}) rotate({ro})"><ellipse cx="0" cy="{h/2+3:.0f}" rx="{w/2-3}" ry="3.5" fill="#000" opacity=".14"/>'
    s += f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="5" fill="url(#IDfr)"/>'
    s += f'<rect x="{-w/2+3}" y="{-h/2+2.5}" width="{w-6}" height="{h-6}" rx="3.5" fill="url(#IDce)" opacity="{.55 if frito else 1}"/>'
    if frito:
        s += f'<rect x="{-w/2+1}" y="{-h/2}" width="{w-2}" height="{h*.45:.1f}" rx="5" fill="#F4C766" opacity=".35"/>'
    for _ in range(11):
        s += f'<ellipse cx="{R.uniform(-w/2+7,w/2-7):.1f}" cy="{R.uniform(-h/2+5,h/2-6):.1f}" rx="2.3" ry="1.7" fill="#EAD9A6" stroke="#BFA25E" stroke-width=".5"/>'
    return s + '</g>'
for x, y, r in [(100, 104, -8), (150, 96, 4), (198, 104, 9), (122, 128, 3), (176, 129, -5)]:
    a(loncha(x, y, r, frito=True))
a(cuenco(252, 90, 26, 'url(#IDsam)'))
a('<ellipse cx="246" cy="86" rx="8" ry="1.8" fill="#fff" opacity=".35"/>')
a(lima(60, 140, 10))
escribe('tempeh', o)
