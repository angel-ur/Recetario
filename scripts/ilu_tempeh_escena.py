"""Genera data/ilustraciones/tempeh.svg (portada rica, 320x180)."""
import random, math
R = random.Random(7)
o = []
a = o.append
a('<defs>'
  '<linearGradient id="IDmesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8CFA0"/><stop offset="1" stop-color="#C79B62"/></linearGradient>'
  '<linearGradient id="IDhoja" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6FA24A"/><stop offset="1" stop-color="#3E7A35"/></linearGradient>'
  '<radialGradient id="IDplato" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4DDCF"/></radialGradient>'
  '<linearGradient id="IDfrito" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0B748"/><stop offset=".55" stop-color="#D98A2B"/><stop offset="1" stop-color="#B2631B"/></linearGradient>'
  '<linearGradient id="IDcara" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF6E6"/><stop offset="1" stop-color="#E9DFC1"/></linearGradient>'
  '<linearGradient id="IDlado" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E3D6B2"/><stop offset="1" stop-color="#C9B88D"/></linearGradient>'
  '<radialGradient id="IDsal" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#E5482F"/><stop offset="1" stop-color="#9E1F14"/></radialGradient>'
  '<filter id="IDgrano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .35  0 0 0 0 .22  0 0 0 0 .08  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>'
  '</defs>')
# mesa
a('<rect width="320" height="180" fill="url(#IDmesa)"/>')
for i in range(9):
    y = 8 + i * 21 + R.random() * 6
    a(f'<path d="M0 {y:.1f}C80 {y-4:.1f} 220 {y+5:.1f} 320 {y-2:.1f}" fill="none" stroke="#A97A46" stroke-opacity=".22" stroke-width="{1+R.random()*1.4:.1f}"/>')
# hoja de platano
a('<path d="M-10 150C20 70 110 20 215 12C170 40 120 80 100 150Z" fill="url(#IDhoja)"/>')
a('<path d="M-6 150C50 96 130 50 212 14" fill="none" stroke="#2F5F2A" stroke-width="2.4" stroke-linecap="round"/>')
for t in range(10):
    x = 10 + t * 19
    y = 138 - t * 10.5
    a(f'<path d="M{x} {y}l-8 -26M{x+3} {y-3}l9 24" stroke="#2F5F2A" stroke-opacity=".45" stroke-width="1" fill="none" stroke-linecap="round"/>')
a('<path d="M40 130C70 92 120 60 190 30" fill="none" stroke="#A9D17F" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>')
# plato
a('<ellipse cx="205" cy="150" rx="108" ry="14" fill="#5A3A18" opacity=".22"/>')
a('<ellipse cx="205" cy="112" rx="104" ry="50" fill="#D9D1C0"/>')
a('<ellipse cx="205" cy="108" rx="104" ry="50" fill="url(#IDplato)"/>')
a('<ellipse cx="205" cy="110" rx="82" ry="38" fill="none" stroke="#C9C0AE" stroke-width="1.5"/>')
a('<ellipse cx="205" cy="111" rx="76" ry="34" fill="#F3EFE6"/>')

def frito(cx, cy, w, h, rot, seed):
    r = random.Random(seed)
    g = [f'<g transform="translate({cx} {cy}) rotate({rot})">']
    # sombra
    g.append(f'<ellipse cx="2" cy="{h/2+5:.1f}" rx="{w/2-4:.1f}" ry="3.5" fill="#000" opacity=".12"/>')
    # lado frontal (corte con granos)
    g.append(f'<rect x="{-w/2}" y="-2" width="{w}" height="{h/2+4:.1f}" rx="5" fill="url(#IDfrito)"/>')
    # cara superior
    g.append(f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h/2+3:.1f}" rx="6" fill="#F2BF55"/>')
    g.append(f'<rect x="{-w/2+2}" y="{-h/2+1.5}" width="{w-4}" height="{h/2-2:.1f}" rx="5" fill="#E9A63C"/>')
    # dorado irregular
    for _ in range(9):
        px = r.uniform(-w/2+5, w/2-5); py = r.uniform(-h/2+3, -2)
        g.append(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="{r.uniform(2,5):.1f}" ry="{r.uniform(1.2,2.6):.1f}" fill="#B9651C" opacity="{r.uniform(.25,.5):.2f}"/>')
    # granos de soja visibles
    for _ in range(11):
        px = r.uniform(-w/2+4, w/2-4); py = r.uniform(-h/2+3, h/2-2)
        g.append(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="2.3" ry="1.7" fill="#FFE29A" opacity=".55" transform="rotate({r.randint(0,180)} {px:.1f} {py:.1f})"/>')
    # brillo
    g.append(f'<path d="M{-w/2+6} {-h/2+3.5}h{w-14}" stroke="#FFF1C2" stroke-width="2" stroke-linecap="round" opacity=".7"/>')
    g.append('</g>')
    return ''.join(g)
for (cx, cy, w, h, rot, s) in [(150, 118, 58, 24, -12, 1), (236, 124, 60, 24, 8, 2), (190, 96, 60, 24, 4, 3), (214, 140, 52, 22, -4, 4)]:
    a(frito(cx, cy, w, h, rot, s))
# sesamo y cebollino
for _ in range(26):
    px = R.uniform(140, 270); py = R.uniform(86, 146)
    a(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="1.4" ry=".8" fill="#FFF8E6" transform="rotate({R.randint(0,180)} {px:.1f} {py:.1f})"/>')
for k in range(5):
    px = 160 + k * 17 + R.uniform(-4, 4); py = 100 + R.uniform(-4, 22)
    a(f'<path d="M{px:.1f} {py:.1f}q6 -4 12 -1" stroke="#4E9A3F" stroke-width="2" stroke-linecap="round" fill="none"/>')
# bloque crudo de tempeh (3/4) sobre la hoja
bx, by = 34, 104
a(f'<ellipse cx="{bx+44}" cy="{by+36}" rx="54" ry="8" fill="#2D4A20" opacity=".35"/>')
a(f'<path d="M{bx} {by}l20 -20h66l-20 20z" fill="#FFFBEF"/>')           # tapa
a(f'<path d="M{bx} {by}h66v32h-66z" fill="url(#IDcara)"/>')              # frente
a(f'<path d="M{bx+66} {by}l20 -20v32l-20 20z" fill="url(#IDlado)"/>')    # lado
# granos en la cara frontal (patron de soja)
for gy in range(5):
    for gx in range(8):
        px = bx + 5 + gx * 8.2 + (4 if gy % 2 else 0) + R.uniform(-1, 1)
        py = by + 5 + gy * 6.3 + R.uniform(-.8, .8)
        a(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="3.2" ry="2.3" fill="#D8C48F" transform="rotate({R.randint(-30,30)} {px:.1f} {py:.1f})"/>')
        a(f'<ellipse cx="{px-.8:.1f}" cy="{py-.7:.1f}" rx="1.4" ry=".9" fill="#FFF6D6" opacity=".9"/>')
# micelio (pelusilla) en la tapa
for _ in range(34):
    px = bx + R.uniform(18, 82) + 0; py = by - R.uniform(2, 18)
    if py < by - 18 + (px - bx) * 0 : pass
    a(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{R.uniform(.6,1.7):.1f}" fill="#FFFFFF" opacity="{R.uniform(.5,.95):.2f}"/>')
for _ in range(9):
    px = bx + R.uniform(14, 70); py = by - R.uniform(4, 16)
    a(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="2.6" ry="1.3" fill="#CDBE95" opacity=".55"/>')
a(f'<path d="M{bx+2} {by+1}h64" stroke="#fff" stroke-width="1.4" opacity=".8"/>')
a(f'<path d="M{bx} {by}h66v32h-66z" fill="none" stroke="#B8A676" stroke-width="1" opacity=".6"/>')
# rodajas crudas apoyadas
for i, (sx, sy) in enumerate([(30, 150), (50, 154)]):
    a(f'<rect x="{sx}" y="{sy}" width="34" height="10" rx="3" fill="url(#IDcara)" stroke="#CDBD90" stroke-width=".8"/>')
    for k in range(5):
        a(f'<circle cx="{sx+5+k*6}" cy="{sy+5}" r="1.6" fill="#D8C48F"/>')
# cuenco de sambal
a('<ellipse cx="288" cy="160" rx="26" ry="5" fill="#000" opacity=".2"/>')
a('<path d="M264 138c2 18 12 24 24 24s22-6 24-24z" fill="#3A5C86"/><path d="M270 144c2 10 8 14 18 14s16-4 18-14z" fill="#4C74A8" opacity=".6"/>')
a('<ellipse cx="288" cy="138" rx="24" ry="7" fill="#2E4A70"/><ellipse cx="288" cy="138" rx="20" ry="5.5" fill="url(#IDsal)"/>')
for _ in range(14):
    px = 288 + R.uniform(-15, 15); py = 138 + R.uniform(-3, 3)
    a(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="1.2" fill="#FFB199" opacity=".7"/>')
# chile y limon
a('<path d="M248 164c10-2 26 0 34 8-10 0-26-2-34-8z" fill="#C7261B"/><path d="M248 164l-5 -3" stroke="#3E7A35" stroke-width="2" stroke-linecap="round"/>')
a('<circle cx="236" cy="168" r="9" fill="#F6E24B"/><circle cx="236" cy="168" r="7" fill="#FBF08A"/>' + ''.join(f'<path d="M236 168L{236+7*math.cos(t):.1f} {168+7*math.sin(t):.1f}" stroke="#F6E24B" stroke-width=".9"/>' for t in [i*math.pi/3 for i in range(6)]))
svg = ''.join(o)
open('data/ilustraciones/tempeh.svg', 'w').write(svg)
print(len(svg))
