import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'
def plato(cx=160, cy=108, rx=118, ry=50):
    return (sombra(cx, cy+46, rx-8, 10, .25) + f'<ellipse cx="{cx}" cy="{cy+4}" rx="{rx}" ry="{ry}" fill="#D4CCBB"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#IDpl)"/><ellipse cx="{cx}" cy="{cy+2}" rx="{rx-24}" ry="{ry-14}" fill="none" style="stroke:var(--anil)" stroke-width="3.5"/>')

# ---- COCIDO MONTANES: cazuela de alubias blancas con berza y compango
R = random.Random(163); o = []; a = o.append
a(mesa(R, ('#E7D2A8', '#C89E66'))); a(DEFS())
a('<defs>' + grad('barro8', '#C96F40', '#8F4222') + rad('alub', '#D9AE5E', '#B8863A') + '</defs>')
a(sombra(160, 154, 114, 10, .28))
a('<path d="M52 90c0 40 28 60 108 60s108-20 108-60z" fill="url(#IDbarro8)"/>')
a('<ellipse cx="160" cy="90" rx="108" ry="26" fill="#A9552C"/><ellipse cx="160" cy="92" rx="98" ry="21" fill="url(#IDalub)"/>')
# alubias blancas
for _ in range(22):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 160+math.cos(t)*r*80; y = 92+math.sin(t)*r*14
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4" ry="2.8" fill="#F4EAD2" transform="rotate({R.randint(0,180)} {x:.1f} {y:.1f})"/><circle cx="{x-1:.1f}" cy="{y-.8:.1f}" r="1" fill="#E0CCA6"/>')
# berza: hojas verdes
for x,y,ro in [(120,88,-20),(168,96,15),(206,90,-8)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-14 0q7 -10 14 0q-7 6 -14 0z" fill="#4E7A38"/><path d="M-10 0q5 -6 10 0" stroke="#3E6228" stroke-width="1.2" fill="none"/></g>')
# compango: chorizo y morcilla
for x,y in [(140,86),(190,96)]:
    a(f'<g transform="translate({x} {y}) rotate({R.randint(-20,20)})"><circle r="7.5" fill="#B34434"/><circle r="7.5" fill="none" stroke="#8E2E22" stroke-width="1.4"/></g>')
a('<g transform="translate(100 96) rotate(12)"><circle r="8" fill="#5E3226"/><circle r="8" fill="none" stroke="#7C4A38" stroke-width="1.5"/></g>')
a('<ellipse cx="128" cy="82" rx="22" ry="2.6" fill="#fff" opacity=".25"/>')
escribe('cocidomontanes', o)

# ---- GACHAS: sarten/ cazuela con gachas doradas, torreznos y ajo
R = random.Random(167); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('hierro', '#5A5E66', '#3A3E46') + rad('gach', '#E8C06A', '#C08A34') + '</defs>')
a(sombra(160, 148, 112, 10, .28))
a('<path d="M52 94c0 26 28 40 108 40s108-14 108-40z" fill="url(#IDhierro)"/>')
a('<rect x="264" y="92" width="52" height="13" rx="6.5" fill="#4A4E56"/><circle cx="306" cy="98" r="3" fill="#33373E"/>')
a('<ellipse cx="160" cy="94" rx="108" ry="24" fill="#4A4E56"/><ellipse cx="160" cy="96" rx="98" ry="20" fill="url(#IDgach)"/>')
# textura de gachas: ondas
for dy in (-8, 0, 8):
    a(f'<path d="M{100} {96+dy}q30 {6 if dy==0 else -5} 60 0q30 {-6 if dy==0 else 5} 60 0" stroke="#C89A4E" stroke-width="2" fill="none" opacity=".7"/>')
# torreznos
for x,y,ro in [(124,90,-14),(158,100,6),(196,92,18)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-13" y="-7" width="26" height="14" rx="4" fill="#B8642E"/><rect x="-13" y="-7" width="26" height="4" rx="2" fill="#E8985A"/><path d="M-8 0h16M-8 3h16" stroke="#8A4420" stroke-width="1.4"/></g>')
# pimenton y ajos dorados
for _ in range(8):
    x = 160+R.uniform(-70,70); y = 96+R.uniform(-12,12)
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.8,1.4):.1f}" fill="#9C2E1E" opacity=".8"/>')
for x,y in [(140,102),(212,100)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="6" ry="4" fill="#E8C88A"/>')
escribe('gachas', o)

# ---- SOPAS MALLORQUINAS: cazuela/ greixonera con capas de pan moreno y verduras
R = random.Random(173); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + grad('greix', '#B85838', '#8A3C24') + rad('sopm', '#C89248', '#A06A28') + '</defs>')
a(sombra(160, 152, 112, 10, .28))
a('<path d="M54 92c0 34 26 52 106 52s106-18 106-52z" fill="url(#IDgreix)"/>')
a('<ellipse cx="160" cy="92" rx="106" ry="25" fill="#9C4428"/><ellipse cx="160" cy="94" rx="96" ry="20" fill="url(#IDsopm)"/>')
# verduras: col, coliflor, cebolleta
for x,y,ro,col in [(112,90,-14,'#5E8E42'),(150,96,10,'#7DAB52'),(192,88,-24,'#4E7A38'),(222,96,18,'#6A9A4E')]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-12 0q6 -9 12 0q-6 5 -12 0z" fill="{col}"/></g>')
for x,y in [(132,98),(176,86)]:
    a(f'<g transform="translate({x} {y})"><circle r="6" fill="#F0E8D0"/>' + ''.join(f'<circle cx="{a_:.1f}" cy="{b_:.1f}" r="2.2" fill="#FAF4E4"/>' for a_,b_ in [(-3,-2),(3,-2),(0,3)]) + '</g>')
# rebanadas de pan moreno asomando
for x,y,ro in [(104,98,-20),(204,100,12)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><rect x="-16" y="-6" width="32" height="12" rx="5" fill="#8A5E34"/><rect x="-16" y="-6" width="32" height="12" rx="5" fill="none" stroke="#6E4624" stroke-width="1.4"/></g>')
# pimenton: polvo rojo
for _ in range(12):
    x = 160+R.uniform(-72,72); y = 94+R.uniform(-12,12)
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.7,1.3):.1f}" fill="#9C2E1E" opacity=".75"/>')
a('<ellipse cx="128" cy="84" rx="20" ry="2.4" fill="#fff" opacity=".25"/>')
escribe('sopasmallorquinas', o)

# ---- TERNASCO: fuente con paletilla de cordero joven, patatas panadera y jugo
R = random.Random(179); o = []; a = o.append
a(mesa(R, ('#E7D2A8', '#C89E66'))); a(DEFS())
a(plato(160, 112, 122, 50))
a('<defs>' + rad('ter', '#C88A48', '#9C6228') + '</defs>')
# jugo
a('<ellipse cx="160" cy="112" rx="96" ry="30" fill="#B0742E" opacity=".85"/>')
# patatas panadera: laminas
for x,y,ro in [(100,104,-14),(124,122,8),(206,118,-20),(232,102,14),(142,126,-4)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><ellipse rx="13" ry="8" fill="#F2DEA0"/><ellipse rx="13" ry="8" fill="none" stroke="#C8A45E" stroke-width="1.4"/></g>')
# paletilla encima
a('<g transform="translate(162 96) rotate(-8)"><ellipse rx="46" ry="22" fill="url(#IDter)"/><ellipse cx="-6" cy="-4" rx="32" ry="14" fill="#D9A05A"/>'
  '<rect x="36" y="-5" width="22" height="10" rx="5" fill="#EFE2C4"/><circle cx="58" cy="-5" r="5.6" fill="#F4EAD2"/><circle cx="58" cy="4" r="5.6" fill="#F4EAD2"/></g>')
# dientes de ajo y romero
for x,y in [(96,124),(222,126)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="5" fill="#E8D4A8"/><ellipse cx="{x}" cy="{y-1}" rx="4" ry="2.6" fill="#C8A468"/>')
a('<g transform="translate(252 90) rotate(40)"><rect x="-14" y="-1.2" width="28" height="2.4" fill="#4E6A34"/>' + ''.join(f'<path d="M{x} 0l-3 -5M{x} 0l-3 5" stroke="#5E7E3E" stroke-width="1.5"/>' for x in range(-10,14,6)) + '</g>')
escribe('ternasco', o)

# ---- SOBAOS: tabla con sobaos pasiegos, uno mordido, vaso de leche
R = random.Random(181); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
# tabla de madera
a('<g transform="translate(150 112)"><rect x="-120" y="-34" width="240" height="68" rx="10" fill="#B8926A"/><rect x="-120" y="-34" width="240" height="68" rx="10" fill="none" stroke="#9A7452" stroke-width="2"/>'
  '<path d="M-100 -18h200M-104 0h208M-100 18h200" stroke="#A67E58" stroke-width="1.6"/></g>')
a(sombra(150, 158, 100, 8, .2))
def sobao(x, y, ro, mordido=False):
    p = [f'<g transform="translate({x} {y}) rotate({ro})">']
    p.append('<rect x="-24" y="-16" width="48" height="32" rx="6" fill="#E8B45E"/>')
    p.append('<rect x="-24" y="-16" width="48" height="10" rx="5" fill="#F0C87E"/>')
    p.append('<path d="M-14 -12q4 -4 8 0M2 -13q4 -3 8 0" stroke="#D89A46" stroke-width="1.6" fill="none"/>')
    if mordido:
        p.append('<path d="M24 -16q-10 4 -6 12q-6 6 2 12l4 8z" fill="url(#IDmesaGrad)"/>')
        p.append('<path d="M22 -14q-8 4 -5 10q-5 5 2 10" stroke="#C8944A" stroke-width="1.6" fill="none"/>')
    p.append('</g>')
    return ''.join(p)
a(sobao(140, 102, -8)); a(sobao(196, 118, 4)); a(sobao(246, 96, 12, mordido=True))
# un sobao en su papel de estraza, de pie a la izquierda
a('<g transform="translate(52 100)">'
  '<rect x="-18" y="-8" width="36" height="34" rx="3" fill="#F4EBD8"/>'
  '<path d="M-18 -2l6 -6M18 -2l-6 -6" stroke="#E0D2B8" stroke-width="1.6"/>'
  '<rect x="-14" y="-24" width="28" height="20" rx="4" fill="#E8B45E"/>'
  '<rect x="-14" y="-24" width="28" height="7" rx="3.5" fill="#F0C87E"/>'
  '<rect x="-18" y="-8" width="36" height="34" rx="3" fill="none" stroke="#D8C8AC" stroke-width="1.8"/>'
  '<path d="M-12 4h24M-12 10h24M-12 16h24" stroke="#E4D6BC" stroke-width="1.2"/></g>')
escribe('sobaos', o)
print('batch11 OK')
