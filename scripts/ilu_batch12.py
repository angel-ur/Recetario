import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from ilu_lib import *

# ---- SANTIAGO: tarta de almendra vista desde arriba, con su cruz
R = random.Random(20261116); o = []; a = o.append
a(mesa(R))
a('<defs>'
  + rad('tarta', '#DDAF6A', '#A0632E')
  + rad('glas', '#FDFBF4', '#EFE6D2')
  + '</defs>')
# fuente con aro azul (estilo casa)
a(sombra(160, 158, 118, 10, .2))
a('<ellipse cx="160" cy="104" rx="128" ry="46" fill="#F7F4EE"/>'
  '<ellipse cx="160" cy="104" rx="128" ry="46" fill="none" style="stroke:var(--anil)" stroke-width="3"/>'
  '<ellipse cx="160" cy="104" rx="112" ry="38" fill="#EFE9DC"/>')
# pared de la tarta (borde tostado) y superficie con azucar glas
a('<path d="M76 96c0 20 38 34 84 34s84-14 84-34v-8c0 20-38 34-84 34s-84-14-84-34z" fill="#9A6534"/>')
a('<ellipse cx="160" cy="92" rx="84" ry="30" fill="url(#IDtarta)"/>')
# textura del borde tostado
for k in range(18):
    ang = k * (2 * math.pi / 18) + .1
    x = 160 + math.cos(ang) * 74; y = 92 + math.sin(ang) * 25
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(1.0, 1.8):.1f}" fill="#8F5E2A" opacity=".5"/>')
a('<ellipse cx="160" cy="92" rx="61" ry="19.5" fill="url(#IDglas)"/>')
# borde irregular del glas
for k in range(16):
    ang = k * (2 * math.pi / 16) + .2
    x = 160 + math.cos(ang) * 59; y = 92 + math.sin(ang) * 18.5
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(1.6, 2.6):.1f}" fill="url(#IDglas)"/>')
# cruz de Santiago (sin azucar: se ve el tostado debajo)
a('<g transform="translate(160 92) scale(1.18)">'
  '<g fill="#96602F">'
  '<path d="M-2.6 -22 L2.6 -22 L2.6 -5 L2.6 11 L0 19 L-2.6 11 L-2.6 -5 Z"/>'
  '<path d="M-19 -10 L-3 -10 L-3 -3.4 L-19 -3.4 Q-23.5 -6.7 -19 -10 Z"/>'
  '<path d="M19 -10 L3 -10 L3 -3.4 L19 -3.4 Q23.5 -6.7 19 -10 Z"/>'
  '<circle cx="0" cy="-23" r="4"/><circle cx="-5" cy="-20.5" r="3"/><circle cx="5" cy="-20.5" r="3"/>'
  '<circle cx="-20.5" cy="-6.7" r="3.2"/><circle cx="20.5" cy="-6.7" r="3.2"/>'
  '</g>'
  '<g fill="#8F5E2A" opacity=".5">'
  '<path d="M-1.2 -20 L1.2 -20 L1.2 10 L0 15.5 L-1.2 10 Z"/>'
  '<path d="M-17 -8.6 L-3 -8.6 L-3 -5 L-17 -5 Q-20 -6.7 -17 -8.6 Z"/>'
  '<path d="M17 -8.6 L3 -8.6 L3 -5 L17 -5 Q20 -6.7 17 -8.6 Z"/>'
  '</g></g>')
# granos de azucar glas caidos en la fuente
for x, y, r in [(64, 110, 1.6), (86, 124, 1.2), (238, 118, 1.5), (254, 104, 1.2), (112, 130, 1.3), (206, 128, 1.4)]:
    a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FDFBF4"/>')
escribe('santiago', o)
print('batch12 OK')
