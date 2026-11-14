import random, math, sys
sys.path.insert(0, 'scripts')
from ilu_lib import *
DEFS = lambda: '<defs>' + rad('pl', '#FFFFFF', '#E1D9C8') + '</defs>'

# ---- PULPO A FEIRA: tabla redonda de madera con rodajas de pulpo, pimenton, aceite y cachelos
R = random.Random(53); o = []; a = o.append
a(mesa(R, ('#E9D5AE', '#CDA672'))); a(DEFS())
a('<defs>' + grad('mad', '#C89A5E', '#A0713C') + rad('pul', '#F7EDE4', '#E8CFC0') + '</defs>')
a(sombra(160, 150, 118, 10, .28))
# tabla de madera
a('<ellipse cx="160" cy="104" rx="116" ry="46" fill="#8A5E30"/><ellipse cx="160" cy="100" rx="116" ry="46" fill="url(#IDmad)"/>')
a('<ellipse cx="160" cy="100" rx="96" ry="36" fill="none" stroke="#8A5E30" stroke-width="2" opacity=".6"/>')
for _ in range(8):
    a(f'<path d="M{60+R.uniform(0,30):.0f} {92+R.uniform(-8,16):.0f}q60 {R.uniform(-10,10):.0f} 180 {R.uniform(-6,10):.0f}" stroke="#96693A" stroke-width="1" fill="none" opacity=".5"/>')
# cachelos al lado
for x,y in [(84,116),(108,122),(96,104)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="15" ry="6" fill="#000" opacity=".12"/><ellipse cx="{x}" cy="{y}" rx="15" ry="9" fill="#F2E3B0"/><ellipse cx="{x-3}" cy="{y-2}" rx="8" ry="4" fill="#FAF0CC"/>')
# rodajas de pulpo en corona
for i in range(10):
    t = i*6.283/10
    x = 178+math.cos(t)*58; y = 98+math.sin(t)*22
    a(f'<g transform="translate({x:.1f} {y:.1f}) rotate({R.randint(-20,20)})"><ellipse rx="17" ry="10" fill="#B0485A"/><ellipse rx="13.5" ry="7.5" fill="url(#IDpul)"/><ellipse cx="-2" cy="-1" rx="5" ry="2.6" fill="#FBF7F0"/><circle cx="5" cy="2" r="1.6" fill="#D8B8A8"/><circle cx="-6" cy="2.5" r="1.3" fill="#D8B8A8"/></g>')
# pimenton por encima
for _ in range(60):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 178+math.cos(t)*r*62; y = 98+math.sin(t)*r*23
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(.7,1.4):.1f}" fill="{R.choice(["#B3341F","#8E2416","#C8462A"])}" opacity=".85"/>')
# hilo de aceite
a('<path d="M130 92q24-8 48 0t44 4" stroke="#E8B83A" stroke-width="2.4" fill="none" opacity=".85" stroke-linecap="round"/>')
# sal gorda
for _ in range(14):
    t = R.random()*6.283; r = math.sqrt(R.random())
    a(f'<rect x="{178+math.cos(t)*r*60:.1f}" y="{98+math.sin(t)*r*22:.1f}" width="2" height="2" fill="#fff" opacity=".9" transform="rotate({R.randint(0,90)} {178+math.cos(t)*r*60:.1f} {98+math.sin(t)*r*22:.1f})"/>')
escribe('pulpo', o)

# ---- MARMITAKO: cazuela baja con patatas y bonito en caldo anaranjado
R = random.Random(59); o = []; a = o.append
a(mesa(R, ('#E4D0A6', '#C49A62'))); a(DEFS())
a('<defs>' + grad('barro', '#C96F40', '#8F4222') + rad('cal', '#E8963C', '#C86E22') + '</defs>')
a(sombra(160, 154, 116, 10, .28))
a('<path d="M48 88c0 42 28 64 112 64s112-22 112-64z" fill="url(#IDbarro)"/>')
a('<rect x="20" y="84" width="32" height="9" rx="4.5" fill="#A9552C"/><rect x="268" y="84" width="32" height="9" rx="4.5" fill="#A9552C"/>')
a('<ellipse cx="160" cy="88" rx="112" ry="26" fill="#A9552C"/><ellipse cx="160" cy="90" rx="102" ry="21" fill="url(#IDcal)"/>')
# patatas chascadas
for x,y,ro in [(104,86,-15),(150,94,10),(196,84,25),(128,78,40),(178,96,-30)]:
    a(f'<ellipse cx="{x}" cy="{y+3}" rx="17" ry="7" fill="#000" opacity=".12"/><g transform="translate({x} {y}) rotate({ro})"><ellipse rx="17" ry="9" fill="#F2E0A8"/><path d="M-8 -3q8-4 16 0" stroke="#E2C87E" stroke-width="2" fill="none" stroke-linecap="round"/></g>')
# bonito
for x,y,ro in [(120,92,-10),(170,80,15)]:
    a(f'<g transform="translate({x} {y}) rotate({ro})"><path d="M-16 -6Q0 -10 16 -5 18 4 8 7 -8 9 -16 3Z" fill="#E9A88E"/><path d="M-12 -2q12-4 24-1" stroke="#C97A5E" stroke-width="2" fill="none" stroke-linecap="round"/></g>')
# puntos de pimiento choricero y verde de guindilla/perejil
for _ in range(10):
    x = 160+R.uniform(-80,80); y = 90+R.uniform(-14,14)
    if ((x-160)/95)**2+((y-90)/17)**2 > 1: continue
    a(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4" ry="1.8" fill="#B3341F" opacity=".8"/>')
for _ in range(12):
    x = 160+R.uniform(-80,80); y = 90+R.uniform(-14,14)
    if ((x-160)/95)**2+((y-90)/17)**2 > 1: continue
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.3" fill="#5E8A3C"/>')
a('<ellipse cx="120" cy="82" rx="24" ry="3" fill="#fff" opacity=".3"/>')
escribe('marmitako', o)

# ---- MIGAS: sarten con migas doradas, chorizo y uvas al lado
R = random.Random(67); o = []; a = o.append
a(mesa(R, ('#E8D3AA', '#CCA46E'))); a(DEFS())
a('<defs>' + rad('mig', '#E8C06A', '#C89238') + grad('sar', '#7A7A84', '#4E4E58') + '</defs>')
a(sombra(140, 148, 108, 10, .28))
# sarten
a('<path d="M36 94c0 26 26 44 104 44s104-18 104-44z" fill="url(#IDsar)"/><ellipse cx="140" cy="94" rx="104" ry="25" fill="#3C3C44"/><ellipse cx="140" cy="95" rx="94" ry="20" fill="url(#IDmig)"/>')
a('<rect x="244" y="88" width="52" height="11" rx="5.5" fill="#5A5A64"/><circle cx="288" cy="93" r="3" fill="#3C3C44"/>')
# textura de migas
for _ in range(120):
    t = R.random()*6.283; r = math.sqrt(R.random())
    x = 140+math.cos(t)*r*86; y = 93+math.sin(t)*r*17
    a(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R.uniform(1.2,2.6):.1f}" fill="{R.choice(["#F0D08A","#DCA84E","#B87E2E","#C89238"])}"/>')
# chorizo y panceta dentro
for x,y in [(108,90),(152,98),(178,88)]:
    a(f'<ellipse cx="{x}" cy="{y}" rx="11" ry="5" fill="#A8321F"/><ellipse cx="{x-2}" cy="{y-1}" rx="6" ry="2" fill="#D4684E" opacity=".7"/>')
# pimiento frito
a('<path d="M188 96q14-6 22 2 2 6-6 6-12 0-16-8z" fill="#5E8A3C"/><path d="M192 97q8-3 14 1" stroke="#7DAB52" stroke-width="1.6" fill="none"/>')
# uvas al lado
a(sombra(272, 150, 34, 5, .22))
for x,y in [(262,138),(274,134),(284,140),(268,146),(280,148),(258,148)]:
    a(f'<circle cx="{x}" cy="{y}" r="7" fill="#7A4A8E"/><circle cx="{x-2}" cy="{y-2}" r="2.2" fill="#A878B8" opacity=".8"/>')
a('<path d="M272 128q4-6 10-8" stroke="#5E8A3C" stroke-width="2.4" fill="none" stroke-linecap="round"/>')
escribe('migas', o)
print('batch4 OK')
