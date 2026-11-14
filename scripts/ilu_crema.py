import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
# ---------- CREMA CATALANA ----------
R = random.Random(47); o = []; a = o.append
a(mesa(R))
a('<defs>' + grad('barro', '#C7683A', '#8F4222') + rad('crema', '#F6E3A8', '#E8C476') + grad('costra', '#D89020', '#9A5A10') + grad('hierro', '#6A6A72', '#3A3A42') + '</defs>')
# cazuelita de barro vista desde arriba-lado
a(sombra(140, 152, 92, 9, .25))
a('<path d="M52 96c0 34 40 52 88 52s88-18 88-52z" fill="url(#IDbarro)"/>')
a('<path d="M58 108c10 22 42 34 82 34s72-12 82-34" fill="none" stroke="#7A3618" stroke-width="2" opacity=".5"/>')
a('<ellipse cx="140" cy="96" rx="88" ry="26" fill="#A0522A"/>')
a('<ellipse cx="140" cy="94" rx="88" ry="26" fill="url(#IDbarro)"/>')
a('<ellipse cx="140" cy="94" rx="76" ry="21" fill="url(#IDcrema)"/>')
# costra de azucar quemada: capa ambar con manchas tostadas y grietas
a('<ellipse cx="140" cy="94" rx="76" ry="21" fill="url(#IDcostra)" opacity=".82"/>')
for _ in range(46):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 140+math.cos(t)*r*68; y = 94+math.sin(t)*r*17.5
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{R.uniform(3,9):.1f}" ry="{R.uniform(1.2,3):.1f}" fill="{R.choice(["#B86E14","#8A4E0C","#6E3C08","#C98A28"])}" opacity="{R.uniform(.25,.6):.2f}"/>')
for _ in range(7):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 140+math.cos(t)*r*58; y = 94+math.sin(t)*r*14
    a(f'<path d="M{x:.1f} {y:.1f}q{R.uniform(-8,8):.1f} {R.uniform(-4,4):.1f} {R.uniform(-6,6):.1f} {R.uniform(-6,6):.1f}" stroke="#5E3206" stroke-width="1.1" fill="none" opacity=".7"/>')
a('<ellipse cx="112" cy="87" rx="26" ry="4.5" fill="#FFE9A8" opacity=".38"/>')
# pala de hierro (cremador) apoyada a la derecha
a(sombra(258, 150, 46, 6, .22))
a('<g transform="translate(258 118) rotate(-18)"><rect x="-4" y="-58" width="8" height="58" rx="3.5" fill="#8A5A28"/><rect x="-4" y="-58" width="3" height="58" fill="#B07838" opacity=".8"/><circle cx="0" cy="8" r="20" fill="url(#IDhierro)"/><circle cx="0" cy="8" r="20" fill="none" stroke="#2A2A32" stroke-width="2"/><circle cx="0" cy="8" r="12" fill="none" stroke="#88888F" stroke-width="1.4" opacity=".6"/><ellipse cx="-6" cy="2" rx="6" ry="3" fill="#fff" opacity=".18"/></g>')
# ramita de canela y piel de limon junto a la cazuela
a('<g transform="translate(52 140) rotate(24)"><rect x="-16" y="-4" width="32" height="8" rx="4" fill="#8A4E22"/><rect x="-16" y="-4" width="32" height="3" rx="1.5" fill="#A86834"/><ellipse cx="-16" cy="0" rx="3" ry="4" fill="#6E3A16"/></g>')
a('<path d="M206 148q14-10 26-2 4 4-2 8-14 6-26 2-6-4 2-8z" fill="#F2C93C"/><path d="M210 148q10-6 20-1" stroke="#F8E27A" stroke-width="2" fill="none" stroke-linecap="round"/>')
escribe('cremacatalana', o)
print('cremacatalana.svg escrito')
