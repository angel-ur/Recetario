import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')

# ---- EMPANADA GALLEGA: redonda, con cuña cortada que muestra el sofrito
R = random.Random(109); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + grad('masa', '#EEC072', '#C4883A') + '</defs>')
a(plato(160, 108, 118, 52))
# cuña cortada aparte (a la derecha)
a('<g transform="translate(238 112) rotate(24)"><path d="M0 0 L34 -8 L34 16 L0 22 Z" fill="#C4883A"/>'
  '<path d="M2 3 L32 -4 L32 0 L2 8 Z" fill="#B8582E"/><path d="M4 5q8 -2 14 -3" stroke="#7DAB52" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
  '<path d="M0 0 L34 -8 L30 -12 L-2 -3 Z" fill="#E8B96A"/></g>')
# empanada redonda (con hueco donde salio la cuña)
a('<g transform="translate(148 100)">'
  '<ellipse rx="72" ry="34" fill="url(#IDmasa)"/>'
  '<path d="M20 -30 A72 34 0 0 1 66 -14 L0 2 Z" fill="url(#mesaGrad)"/>'
  '<ellipse rx="72" ry="34" fill="none" stroke="#A96A28" stroke-width="1.6" opacity=".5"/>'
  # borde repulgado
  + ''.join(f'<circle cx="{64*math.cos(t):.1f}" cy="{30*math.sin(t):.1f}" r="3.4" fill="#C4883A"/>' for t in (i*0.35 for i in range(10)) if not (0.2 < t < 1.3))
  # rayas de marcado y chimenea
  + '<path d="M-46 -12 q20 -10 44 -6 M-52 2 q22 -10 50 -6 M-40 14 q18 -8 40 -6" stroke="#B87E3E" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>'
  + '<ellipse cx="-4" cy="0" rx="5" ry="3" fill="#8A5220"/><ellipse cx="-5" cy="-0.6" rx="2.4" ry="1.4" fill="#5E3010"/>'
  + '<ellipse cx="-20" cy="-14" rx="20" ry="3" fill="#fff" opacity=".28"/></g>')
# rodaja de pimiento
a('<g transform="translate(70 142)"><circle r="11" fill="none" stroke="#B3341F" stroke-width="4.5"/><circle r="11" fill="none" stroke="#8E2416" stroke-width="1.2"/></g>')
escribe('empanadagallega', o)

# ---- LECHAZO: fuente de barro con paletilla asada, dorada, con su jugo
R = random.Random(113); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro', '#C96F40', '#8F4222') + rad('lec', '#C88A48', '#9C6228') + '</defs>')
a(sombra(160, 152, 116, 10, .28))
a('<path d="M48 94c0 34 28 52 112 52s112-18 112-52z" fill="url(#IDbarro)"/>')
a('<ellipse cx="160" cy="94" rx="112" ry="25" fill="#A9552C"/><ellipse cx="160" cy="96" rx="102" ry="20" fill="#6E3818"/>')
# jugo del asado
a('<ellipse cx="160" cy="97" rx="92" ry="16" fill="#8A4A20"/>')
for _ in range(16):
    t = R.random()*6.283; r = math.sqrt(R.random())
    a(f'<circle cx="{160+math.cos(t)*r*84:.1f}" cy="{96+math.sin(t)*r*13:.1f}" r="{R.uniform(.8,1.8):.1f}" fill="#B87E3E" opacity=".7"/>')
# paletilla: pieza grande dorada con hueso
a('<g transform="translate(152 88) rotate(-10)"><ellipse rx="48" ry="24" fill="url(#IDlec)"/><ellipse cx="-6" cy="-4" rx="34" ry="15" fill="#D9A05A"/><path d="M-30 -6q16 -8 34 -4" stroke="#B87E3E" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
  '<rect x="38" y="-6" width="26" height="11" rx="5.5" fill="#EFE2C4"/><circle cx="64" cy="-6" r="6.5" fill="#F4EAD2"/><circle cx="64" cy="5" r="6.5" fill="#F4EAD2"/></g>')
# piel crujiente: marcas doradas
a('<path d="M118 82q18-10 40-6" stroke="#8A5220" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>')
# dientes de ajo asados y romero
for x,y in [(208,104),(222,92)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="5" fill="#E8D4A8"/><ellipse cx="{x}" cy="{y-1}" rx="4" ry="2.6" fill="#C8A468"/>')
a('<g transform="translate(100 108) rotate(24)"><rect x="-16" y="-1.2" width="32" height="2.4" fill="#4E6A34"/>' + ''.join(f'<path d="M{x} 0l-3 -5M{x} 0l-3 5" stroke="#5E7E3E" stroke-width="1.6"/>' for x in range(-12,16,6)) + '</g>')
escribe('lechazo', o)

# ---- ROPA VIEJA: cazuela con carne deshebrada, garbanzos y pimiento
R = random.Random(127); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + grad('barro2', '#C96F40', '#8F4222') + rad('rop', '#C2582E', '#9C3E1E') + '</defs>')
a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 90c0 40 28 60 112 60s112-20 112-60z" fill="url(#IDbarro2)"/>')
a('<rect x="22" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="86" width="30" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="90" rx="112" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="102" ry="21" fill="url(#IDrop)"/>')
# carne deshebrada: hebras
for _ in range(16):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*80; y = 92+math.sin(t)*r*15
    ro = R.randint(-50,50)
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({ro})"><path d="M-12 0q6 -3 12 0" stroke="{R.choice(["#8A4A30","#A85838","#7C3C24"])}" stroke-width="4" fill="none" stroke-linecap="round"/></g>')
# garbanzos
for _ in range(16):
    x = 160+R.uniform(-80,80); y = 92+R.uniform(-14,14)
    if ((x-160)/95)**2+((y-92)/17)**2 > 1: continue
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="#E9C77C"/><circle cx="{x-1:.1f}" cy="{y-1:.1f}" r="1" fill="#F7E2AC"/>')
# tiras de pimiento y cebolla
for x,y,ro,col in [(110,88,20,'#B3341F'),(160,98,-25,'#F0E4D0'),(200,86,40,'#4E7A2E'),(140,84,-10,'#B3341F')]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-13" y="-3" width="26" height="6" rx="3" fill="{col}" opacity=".92"/></g>')
a('<ellipse cx="126" cy="82" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
escribe('ropavieja', o)
print('batch8 OK')
