import random, math
def mesa(R, tono=None):
    return ('<defs><radialGradient id="IDfondo" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#FFFBF0"/><stop offset="1" stop-color="#F1E8D4"/></radialGradient></defs>'
            '<rect width="320" height="180" fill="url(#IDfondo)"/>')
def grad(i, a, b, v=True):
    x2, y2 = ('0', '1') if v else ('1', '0')
    return f'<linearGradient id="ID{i}" x1="0" y1="0" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
def rad(i, a, b):
    return f'<radialGradient id="ID{i}" cx=".42" cy=".35" r=".8"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></radialGradient>'
def sombra(cx, cy, rx, ry, op=.2):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#4A2E10" opacity="{op}"/>'
def lima(cx, cy, r=9):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#F6E24B"/><circle cx="{cx}" cy="{cy}" r="{r-2}" fill="#FBF08A"/>' + ''.join(f'<path d="M{cx} {cy}L{cx+(r-2)*math.cos(t):.1f} {cy+(r-2)*math.sin(t):.1f}" stroke="#F0D63A" stroke-width=".9"/>' for t in [i*math.pi/3 for i in range(6)])
def escribe(nombre, partes):
    svg = ''.join(partes)
    open(f'data/ilustraciones/{nombre}.svg', 'w').write(svg)
