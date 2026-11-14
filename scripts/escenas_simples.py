"""Escenas por paso para las recetas que no tienen version ilustrada en enriquecido.json.
Genera data/escenas_simples.json: { id_receta: [escena_del_paso_1, escena_del_paso_2, ...] } en el orden del md."""
import json
F = lambda v, f, c, i=None, **k: dict(k='fuego', v=v, f=f, c=c, i=i or [], **k)
B = lambda c, i=None, **k: dict(k='bol', c=c, i=i or [], **k)
T = lambda i: dict(k='tabla', i=i)
P = lambda i=None, v='llano', c=None, **k: dict(k='plato', v=v, **({'c': c} if c else {}), i=i or [], **k)
H = lambda t, d, i, c=None: dict(k='horno', t=t, d=d, i=i, **({'c': c} if c else {}))
N = lambda i, t, c='#E9D9B0', v='fuente': dict(k='nevera', v=v, c=c, i=i, t=t)
R = lambda i, t: dict(k='remojo', i=i, t=t)
E = {
 'arrozhorno': [F('cazuela', 4, '#C99A3A', [['costilla', 4, 1, 'r-dorado'], ['morcilla', 2]], chisp=1),
                F('cazuela', 3, '#B9482F', [['tomate', 3], ['ajo', 3], ['azafran', 2]], polvo='#C8402B'),
                F('cazuela', 5, '#E3C062', [['arroz', 26], ['garbanzo', 8], ['costilla', 3]], vierte='agua', burbujas=1),
                P([['arroz', 12], ['costilla', 2], ['morcilla', 2]], 'cuenco', '#D9A441', vapor=1)],
 'caldereta': [F('cazuela', 4, '#C99A3A', [['cordero', 5, 1, 'r-dorado']], chisp=1),
               F('cazuela', 3, '#D3A548', [['cebolla', 6, 1, 'o-pochada'], ['pimiento', 3], ['ajo', 3]], cuchara=1),
               F('cazuela', 3, '#8E1B13', [['cebolla', 3]], vierte='vino', polvo='#8E1B13'),
               F('cazuela', 1, '#B9482F', [['cordero', 5], ['laurel', 1]], tapa=1, vapor=1, reloj='80 min', rf=0.5)],
 'caldero': [F('olla', 2, '#E8E0C8', [['pescado', 4]], burbujas=1, espuma=1),
             F('sarten', 3, '#C8402B', [['nora', 3], ['ajo', 3], ['tomate', 3]], cuchara=1),
             dict(k='mortero', c='#C8402B', i=[['nora', 3], ['ajo', 3]]),
             F('paellera', 4, '#E5B54C', [['arroz', 30], ['azafran', 2]], vierte='agua', burbujas=1),
             P([['pescado', 3], ['arroz', 12]], 'llano', '#E5B54C', vapor=1)],
 'callos': [B('#BFDDF2', [['callo', 6]]),
            F('olla', 2, '#D9C8A0', [['callo', 8], ['laurel', 2]], espuma=1, burbujas=1),
            F('cazuela', 3, '#B9482F', [['cebolla', 5, 1, 'o-pochada'], ['ajo', 3], ['jamon', 3]], cuchara=1, polvo='#8E1B13'),
            F('cazuela', 1, '#A83A22', [['callo', 8], ['chorizo', 3], ['morcilla', 2], ['guindilla', 1]], tapa=1, vapor=1, reloj='1 h', rf=0.4)],
 'chuletillas': [F('sarten', 5, '#6A4A2A', [['romero', 3]], chisp=1),
                 P([['chuleta', 6]], 'llano', None, polvo='#FFFFFF'),
                 F('sarten', 5, '#C99A3A', [['chuleta', 6, 1, 'r-dorado']], chisp=1),
                 P([['chuleta', 6], ['pimiento', 2, 1, 'rojo']], 'llano', None, vapor=1)],
 'cocidomontanes': [R([['faba', 20]], '90 min'),
                    F('olla', 2, '#9CC8EA', [['berza', 8]], burbujas=1),
                    F('sarten', 2, '#C8402B', [['ajo', 4]], polvo='#8E1B13', cuchara=1),
                    F('olla', 2, '#9A5A32', [['faba', 20], ['patata', 4], ['chorizo', 3], ['morcilla', 2]], tapa=2)],
 'empanadagallega': [B('#F3E7C6', [], tenedor=1),
                     B('#F3E7C6'),
                     F('sarten', 2, '#E3C062', [['cebolla', 9, 1, 'o-pochada'], ['pimiento', 5]], cuchara=1),
                     B('#E6C39A', [['atun', 4], ['huevo', 3]], tenedor=1),
                     dict(k='formar'),
                     H('200 °C', 'bandeja', [['empanada', 1]], '#D9A441')],
 'gachas': [F('sarten', 2, '#E3C062', [['ajo', 5]], cuchara=1, burbujas='#F7DC8F'),
            F('sarten', 3, '#D8B96A', [['almendra', 1]], vierte='agua', polvo='#8E1B13'),
            F('cazuela', 2, '#D9C58E', [], cuchara=1, burbujas=1),
            F('sarten', 5, '#C99A3A', [['tocino', 5, 1, 'r-dorado']], chisp=1)],
 'lechazo': [P([['cordero', 3]], 'cazuela', None, polvo='#FFFFFF'),
             F('cazuela', 0, '#E9D6B0', [['laurel', 1]], vierte='agua'),
             H('220 °C', 'cazuela', [['cordero', 3]], '#B5402F')],
 'pilpil': [F('cazuela', 2, '#E3C062', [['ajo', 4], ['guindilla', 1]], burbujas='#F7DC8F'),
            F('cazuela', 0, '#E3C062', []),
            F('cazuela', 1, '#E3C062', [['bacalao', 4]], burbujas='#F7DC8F'),
            F('cazuela', 0, '#EFD9A0', [['bacalao', 4]], agita=1)],
 'ropavieja': [F('sarten', 2, '#D3A548', [['cebolla', 5, 1, 'o-pochada'], ['pimiento', 3], ['ajo', 3], ['tomate', 3]], cuchara=1),
               F('sarten', 0, '#B9482F', [], polvo='#8E1B13', vierte='vinagre'),
               F('sarten', 2, '#C0743A', [['garbanzo', 14], ['carne', 5], ['patata', 4]], cuchara=1),
               P([['garbanzo', 12], ['carne', 4], ['patata', 3]], 'cuenco', '#C0743A', vapor=1)],
 'sopasmallorquinas': [F('cazuela', 2, '#D3A548', [['cebolla', 5, 1, 'o-pochada'], ['pimiento', 3], ['ajo', 3]], cuchara=1),
                       F('cazuela', 0, '#B9482F', [['tomate', 3]], polvo='#8E1B13'),
                       F('cazuela', 2, '#C0743A', [['berza', 6]], vierte='agua', burbujas=1),
                       F('cazuela', 1, '#A3552F', [['pan', 12]], tapa=2, cuchara=1)],
 'tempeh': [R([['garbanzo', 24]], '12 h'),
            B('#BFDDF2', [['garbanzo', 18]], cae=None),
            F('olla', 2, '#C9D9E8', [['garbanzo', 24]], burbujas=1, espuma=1),
            P([['garbanzo', 20]], 'llano', '#F5F1E8'),
            B('#F2E3B5', [['garbanzo', 18]], tenedor=1),
            dict(k='formar'),
            H('30 °C', 'bandeja', [['tempeh', 3]], '#E9D9B0'),
            N([['tempeh', 3]], '3 días')],
 'ternasco': [P([['cordero', 3], ['ajo', 4]], 'llano', None, polvo='#FFFFFF'),
              H('200 °C', 'bandeja', [['cordero', 3], ['patata', 6]], '#C0743A')],
}
if __name__ == '__main__':
    json.dump(E, open('data/escenas_simples.json', 'w'), ensure_ascii=False, indent=1)
    print(len(E), 'recetas', sum(len(v) for v in E.values()), 'escenas')
