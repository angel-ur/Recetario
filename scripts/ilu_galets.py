import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from ilu_lib import *

# ---- GALETS: cuenco blanco con aro azul, caldo dorado y galets (caracolas) con vapor
R = random.Random(20261225); o = []; a = o.append
a(mesa(R))
a('<defs>'
  + grad('cuenco', '#FBF7EC', '#E7DEC9')
  + rad('caldog', '#EFC25E', '#D2A03A')
  + '</defs>')

def galet(x, y, ro, s=1.0):
    # galet visto desde arriba: caracola dorada con su espiral
    return (f'<g transform="translate({x} {y}) rotate({ro}) scale({s})">'
            '<ellipse rx="15" ry="11" fill="#E9C26F" stroke="#C08F34" stroke-width="1.6"/>'
            '<ellipse cy="1" rx="11" ry="7.6" fill="#F2D48C"/>'
            '<path d="M-8 0a8 5.4 0 0 1 16 0a8 5.4 0 0 1 -13 4" fill="none" stroke="#C08F34" stroke-width="1.5" stroke-linecap="round"/>'
            '<path d="M-3.4 .6a3.6 2.6 0 0 1 7 0" fill="none" stroke="#C08F34" stroke-width="1.3" stroke-linecap="round"/>'
            '<path d="M-13 -4q4 -3 9 -3" fill="none" stroke="#F7E3A8" stroke-width="1.6" stroke-linecap="round"/></g>')

# sombra y cuenco
a(sombra(160, 158, 108, 9, .26))
a('<path d="M52 92c3 40 30 62 108 62s105-22 108-62z" fill="url(#IDcuenco)"/>')
a('<path d="M66 118c12 22 44 30 94 30s82-8 94-30" fill="none" stroke="#DCD2BA" stroke-width="4" stroke-linecap="round" opacity=".7"/>')
a('<ellipse cx="160" cy="92" rx="108" ry="25" fill="#F3ECDB"/>')
# aro azul de la casa
a('<path d="M57 96a108 25 0 0 0 206 0" fill="none" style="stroke:var(--anil)" stroke-width="5" stroke-linecap="round"/>')
# caldo
a('<ellipse cx="160" cy="94" rx="97" ry="20" fill="url(#IDcaldog)"/>')
a('<ellipse cx="160" cy="92" rx="97" ry="18" fill="#EDC763" opacity=".55"/>')
# galets flotando
a('<ellipse cx="116" cy="97" rx="16" ry="6" fill="#8A5A18" opacity=".18"/>')
a(galet(116, 94, -8))
a('<ellipse cx="162" cy="101" rx="16" ry="6" fill="#8A5A18" opacity=".18"/>')
a(galet(162, 98, 14, 1.05))
a('<ellipse cx="206" cy="93" rx="16" ry="6" fill="#8A5A18" opacity=".18"/>')
a(galet(206, 90, -18, .95))
a(galet(140, 88, 24, .8))
# brillo del caldo
a('<ellipse cx="128" cy="86" rx="24" ry="2.8" fill="#fff" opacity=".32"/>')
a('<ellipse cx="196" cy="99" rx="16" ry="2" fill="#fff" opacity=".22"/>')
# vapor: tres hilos
for dx, amp in [(-26, 5), (0, 6), (26, 5)]:
    a(f'<path d="M{160+dx} 74q{amp} -10 0 -18q{-amp} -8 0 -16" fill="none" stroke="#B9C2C4" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>')
escribe('galets', o)
print('galets OK')
