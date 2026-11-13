/* Motor de ilustraciones del recetario: biblioteca de dibujos (ingredientes, recipientes,
   utensilios) y escenas compuestas a partir de una descripción corta de cada paso. */
(function () {
  'use strict';

  /* ---------- Biblioteca de dibujos ---------- */
  var S = function (id, vb, cuerpo, libre) {
    return '<symbol id="e-' + id + '" viewBox="' + vb + '"' + (libre ? '' : ' preserveAspectRatio="none"') + '>' + cuerpo + '</symbol>';
  };
  var SIMBOLOS = [
    // Recipientes
    S('v-cazuela', '0 0 220 104',
      '<path d="M8 31c-7 1-8 11-1 13l11 0-2-13z" fill="#8E4426"/><path d="M212 31c7 1 8 11 1 13l-11 0 2-13z" fill="#8E4426"/>' +
      '<path d="M14 28C18 72 52 100 110 100S202 72 206 28Z" fill="#B45E38"/>' +
      '<path d="M26 42C38 68 66 84 110 86S182 68 194 42" fill="none" stroke="#CB7A50" stroke-width="5" stroke-linecap="round" opacity=".6"/>' +
      '<ellipse cx="110" cy="28" rx="97" ry="17" fill="#8E4426"/><ellipse cx="110" cy="28" rx="88" ry="13" style="fill:var(--contenido,#5B1B1F)"/>', 1),
    S('v-olla', '0 0 200 120',
      '<rect x="0" y="30" width="16" height="10" rx="4" fill="#5E6678"/><rect x="184" y="30" width="16" height="10" rx="4" fill="#5E6678"/>' +
      '<path d="M14 24V102q0 14 14 14H172q14 0 14-14V24Z" fill="#A9B1C2"/><path d="M24 30V104" stroke="#C9CFDB" stroke-width="7" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M14 92H186" stroke="#8F98AA" stroke-width="2"/>' +
      '<ellipse cx="100" cy="24" rx="86" ry="14" fill="#8790A3"/><ellipse cx="100" cy="24" rx="80" ry="12" style="fill:var(--contenido,#C9A24A)"/>', 1),
    S('v-sarten', '0 0 250 64',
      '<rect x="196" y="23" width="54" height="10" rx="5" fill="#2E2A2A"/><path d="M10 18Q14 52 40 56H170Q196 52 200 18Z" fill="#3A3F4D"/>' +
      '<ellipse cx="105" cy="18" rx="95" ry="13" fill="#2B2F3A"/><ellipse cx="105" cy="18" rx="88" ry="11" style="fill:var(--contenido,#E2BF5A)"/>', 1),
    S('v-paellera', '0 0 290 60',
      '<path d="M2 22c-3 0-3 8 2 9l14 0 0-9z" fill="#5F6672"/><path d="M288 22c3 0 3 8-2 9l-14 0 0-9z" fill="#5F6672"/>' +
      '<path d="M18 22Q20 46 40 48H250Q270 46 272 22Z" fill="#7C838F"/>' +
      '<ellipse cx="145" cy="22" rx="128" ry="17" fill="#5F6672"/><ellipse cx="145" cy="22" rx="121" ry="15" style="fill:var(--contenido,#E5B54C)"/>', 1),
    S('v-lenta', '0 0 210 124',
      '<rect x="0" y="34" width="16" height="10" rx="4" fill="#3A3F4D"/><rect x="194" y="34" width="16" height="10" rx="4" fill="#3A3F4D"/>' +
      '<rect x="38" y="110" width="24" height="12" rx="3" fill="#3A3F4D"/><rect x="148" y="110" width="24" height="12" rx="3" fill="#3A3F4D"/>' +
      '<path d="M14 26V84Q14 114 46 116H164Q196 114 196 84V26Z" fill="#B7BECB"/><path d="M26 36V92" stroke="#D5DAE3" stroke-width="7" stroke-linecap="round" opacity=".8"/>' +
      '<rect x="70" y="76" width="70" height="24" rx="8" fill="#2E3240"/><circle cx="86" cy="88" r="7" fill="#C9CFDB"/><path d="M86 88l-4-5" stroke="#2E3240" stroke-width="2" stroke-linecap="round"/>' +
      '<text x="111" y="92" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="10" fill="#F2A65A">LOW</text><circle cx="130" cy="88" r="2.6" fill="#F2A65A"/>' +
      '<ellipse cx="105" cy="26" rx="92" ry="15" fill="#8790A3"/><ellipse cx="105" cy="26" rx="86" ry="13" fill="#5B3A2C"/><ellipse cx="105" cy="27" rx="80" ry="11" style="fill:var(--contenido,#C9A24A)"/>', 1),
    // Carne y embutidos
    S('rabo', '-22 -22 44 44',
      '<path d="M-20 1c-1-11 9-19 20-19s20 8 20 19-9 19-20 19-19-8-20-19z" style="fill:var(--grasa,#E9CDBB)"/>' +
      '<path d="M-15 1c-1-8 7-14 15-14s15 6 15 14-7 14-15 14-14-6-15-14z" style="fill:var(--carne,#B03A33)"/>' +
      '<path d="M0-13v7M-14 5l8-2M14 6l-8-3M-6 13l3-6" style="stroke:var(--grasa,#E9CDBB)" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
      '<circle cx="0" cy="1" r="6.2" style="fill:var(--hueso,#F2E6D0)"/><circle cx="0" cy="1" r="2.6" style="fill:var(--tuetano,#C79A70)"/>'),
    S('chorizo', '-8 -8 16 16', '<circle r="7.4" fill="#A83228" stroke="#7E2219" stroke-width="1"/><g fill="#E59A86"><circle cx="-3" cy="-2" r="1.2"/><circle cx="2.5" cy="-3.2" r="1"/><circle cx="3" cy="2.5" r="1.3"/><circle cx="-1.5" cy="3.4" r="1"/><circle cx="0" cy="0" r=".8"/></g>'),
    S('morcilla', '-8 -8 16 16', '<circle r="7.4" fill="#3B1C21" stroke="#22100F" stroke-width="1"/><g fill="#9C7A6A"><circle cx="-3" cy="-1" r="1"/><circle cx="2" cy="-3" r=".9"/><circle cx="2.8" cy="2.4" r="1.1"/><circle cx="-1.2" cy="3" r=".8"/></g>'),
    S('tocino', '-11 -6 22 12', '<rect x="-10" y="-5" width="20" height="10" rx="2" fill="#F3DCD3"/><path d="M-10-1.5h20M-10 2.2h20" stroke="#D98C86" stroke-width="1.8"/><path d="M-10-4.3h20" stroke="#C9A16E" stroke-width="1.4"/>'),
    S('jamon', '-5 -5 10 10', '<rect x="-4.5" y="-4" width="9" height="8" rx="1.6" fill="#C2444C"/><path d="M3.2-4v8" stroke="#F2D6CF" stroke-width="2"/>'),
    S('pollo', '-14 -10 28 20', '<path d="M-12 2C-12-6-4-9 3-8S13-3 12 3 5 9-2 9-12 9-12 2Z" style="fill:var(--piel,#E2B27A);stroke:var(--piel2,#C98E50)" stroke-width="1.2"/><path d="M-6 0c3-3 8-3 11-1" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" opacity=".35"/>'),
    S('carne', '-12 -9 24 18', '<path d="M-11 1C-11-6-3-8 4-7S12-2 11 3 4 8-2 8-11 7-11 1Z" fill="#8E2F28" stroke="#6E211C" stroke-width="1"/><path d="M-6-2c3 1 6 0 9 2M-4 3c3-1 6 0 8 1" fill="none" stroke="#C9706A" stroke-width="1.2" stroke-linecap="round"/>'),
    S('hueso', '-13 -6 26 12', '<path d="M-9-3a3 3 0 1 1 3-1.5h12a3 3 0 1 1 3 1.5v6a3 3 0 1 1-3 1.5H-6a3 3 0 1 1-3-1.5z" style="fill:var(--hueso,#F1E8D6);stroke:var(--hueso2,#D3C3A6)" stroke-width="1"/>'),
    S('tuetano', '-9 -9 18 18', '<circle r="8.2" style="fill:var(--hueso,#F1E8D6);stroke:var(--hueso2,#D3C3A6)" stroke-width="1"/><circle r="4.8" style="fill:var(--tuetano,#E2B48A)"/><circle cx="-1.4" cy="-1.5" r="1.5" fill="#FFFFFF" opacity=".35"/>'),
    S('oreja', '-12 -10 24 20', '<path d="M-10 6C-12-2-6-9 2-9S12-4 11 2 4 9-2 9-9 9-10 6Z" fill="#EBB3A8" stroke="#D08F86" stroke-width="1"/><path d="M-5 4C-6-1-2-5 3-5S8-1 6 3" fill="none" stroke="#D08F86" stroke-width="1.6" stroke-linecap="round"/>'),
    S('manita', '-15 -6 31 12', '<path d="M-14 0c0-4 3-5 6-5H8v10H-8c-3 0-6-1-6-5z" fill="#EFC4B6" stroke="#D49C8E" stroke-width="1"/><path d="M8-5h3c3 0 4 2 4 5s-1 5-4 5H8z" fill="#8E6A5A"/><path d="M8 0h7" stroke="#6B4E42" stroke-width="1"/>'),
    S('patapollo', '-8 -12 16 24', '<g fill="none" stroke="#E2AE5C" stroke-linecap="round" stroke-linejoin="round"><path d="M0 11V-1" stroke-width="3.4"/><path d="M0-1L-6-9M0-1V-11M0-1L6-9" stroke-width="2.6"/></g>'),
    // Pescado y mar
    S('bonito', '-7 -6 14 12', '<rect x="-6.5" y="-5.5" width="13" height="11" rx="2.4" fill="#E9B9A6" stroke="#CC917C" stroke-width=".9"/><path d="M-4-2h8M-4 1.5h8" stroke="#F5D6CB" stroke-width="1.2"/>'),
    S('bacalao', '-9 -5 18 10', '<path d="M-8 1c0-4 5-6 9-5s8 2 7 5-5 5-9 4-7-1-7-4z" fill="#F4F0E8" stroke="#D3CABA" stroke-width=".9"/><path d="M-4-1l7 1M-3 2l7 0" stroke="#E2DACB" stroke-width="1"/>'),
    S('anchoa', '-12 -3 24 6', '<path d="M-11 0C-6-3 5-3 9 0 5 3-6 3-11 0Z" fill="#8B6A55"/><path d="M9 0l3-2.6v5.2z" fill="#6E5242"/><path d="M-8 0h14" stroke="#C9B3A2" stroke-width=".9"/>'),
    S('atun', '-7 -5 14 10', '<path d="M-6 1c0-4 4-5 7-4s5 2 5 4-3 4-7 3-5-1-5-3z" fill="#C9937A" stroke="#AD7860" stroke-width=".8"/>'),
    S('pulpo', '-8 -8 16 16', '<circle r="7.4" fill="#B35A6E"/><circle r="4.6" fill="#F2E6E4"/><g fill="#E9C4CC"><circle cx="-5.6" cy="2.4" r="1.2"/><circle cx="-3.6" cy="5" r="1.1"/><circle cx="0" cy="6.2" r="1"/></g>'),
    // Huerta
    S('zanahoria', '-10 -10 20 20', '<circle r="9.2" fill="#E2702A"/><circle r="5.4" fill="#F29A52"/><circle r="1.6" fill="#E2702A" opacity=".5"/>'),
    S('cebolla', '-12 -7 24 14', '<path d="M-11 4c3-12 19-12 22 0-5-5-17-5-22 0z" style="fill:var(--cebolla,#EFE2C4)" stroke="#D2BC8E" stroke-width=".8"/>'),
    S('pimiento', '-11 -4 22 8', '<rect x="-10" y="-3.2" width="20" height="6.4" rx="3.2" style="fill:var(--pim,#3F8434)"/><path d="M-7-1h12" style="stroke:var(--pim2,#6CB055)" stroke-width="1.4" stroke-linecap="round"/>'),
    S('puerro', '-9 -9 18 18', '<circle r="7" fill="none" stroke="#D3E3AE" stroke-width="3.2"/><circle r="3.4" fill="none" stroke="#8FB653" stroke-width="2"/>'),
    S('apio', '-7 -5 14 10', '<path d="M-6-2C-6 4 6 4 6-2H3.6C3.6 1.6-3.6 1.6-3.6-2Z" fill="#9CC46A" stroke="#7BA34A" stroke-width=".8"/>'),
    S('jengibre', '-12 -8 24 16', '<path d="M-11 2c-1-4 2-6 5-5 1-3 5-3 6 0 2-2 6-1 6 2 3 0 5 3 3 5-1 2-4 2-6 1-2 2-6 2-8 0-3 1-6 0-6-3z" fill="#D9B37A" stroke="#B98F55" stroke-width="1"/><path d="M-6 2c3 1 6 1 9 0" fill="none" stroke="#C59E64" stroke-width="1"/>'),
    S('pimienta', '-3 -3 6 6', '<circle r="2.5" fill="#3A2C25"/><circle cx="-.8" cy="-.8" r=".8" fill="#7A6457"/>'),
    S('azafran', '-6 -3 12 6', '<path d="M-5 1C-2-2 1 2 5-1" fill="none" stroke="#C8321F" stroke-width="1.2" stroke-linecap="round"/>'),
    S('ajo', '-7 -9 14 18', '<path d="M0-8c4 3 6 7 5.5 10.5S2.5 8 0 8s-5-2-5.5-5.5S-4-5 0-8z" fill="#F6F0E1" stroke="#D3C3A3" stroke-width="1"/>'),
    S('tomate', '-10 -10 20 20', '<circle r="9" fill="#D53A2A"/><path d="M-4.5-6.5 0-4.3 4.5-6.5 2.4-3.2 0-2.4-2.4-3.2Z" fill="#3E7D2E"/><ellipse cx="-3.6" cy="-.5" rx="2" ry="3" fill="#FFFFFF" opacity=".25"/>'),
    S('patata', '-9 -8 18 16', '<path d="M-8-2-3-7 6-6 8 1 3 7-6 5Z" fill="#EDD08C" stroke="#D2AC60" stroke-width="1" stroke-linejoin="round"/><path d="M-3-7l1 5 6-1" fill="none" stroke="#F7E3B2" stroke-width="1.2" opacity=".8"/>'),
    S('papa', '-9 -7 18 14', '<ellipse rx="8.2" ry="6.2" fill="#B9874F"/><path d="M-5-2c2 1 3-1 5 0M-2 3c2-1 4 1 6-1M2-4c1 1 3 0 3 1" fill="none" stroke="#8B6034" stroke-width=".9"/><g fill="#FFFFFF"><circle cx="-3" cy="-3" r=".7"/><circle cx="3" cy="-1" r=".6"/><circle cx="-1" cy="2" r=".7"/><circle cx="5" cy="2.5" r=".5"/></g>'),
    S('calabacin', '-8 -8 16 16', '<circle r="7.4" fill="#4F8A3C"/><circle r="5.8" fill="#E9EFC4"/><g fill="#C9D58E"><circle cx="-1.6" cy="-1" r=".8"/><circle cx="1.6" cy="-1" r=".8"/><circle cx="0" cy="1.8" r=".8"/></g>'),
    S('berenjena', '-8 -8 16 16', '<circle r="7.4" fill="#4B2A57"/><circle r="6" fill="#EDE3CB"/><g fill="#C9B98C"><circle cx="-2" cy="-1.4" r=".7"/><circle cx="2" cy="-1" r=".7"/><circle cx="-.4" cy="2" r=".7"/><circle cx="2.6" cy="2.4" r=".6"/></g>'),
    S('pepino', '-8 -8 16 16', '<circle r="7" fill="#3F7D3A"/><circle r="5.4" fill="#DCEBBE"/><g fill="#B5CC86"><circle cx="-1.4" cy="-1" r=".8"/><circle cx="1.4" cy="-1" r=".8"/><circle cx="0" cy="1.6" r=".8"/></g>'),
    S('judia', '-12 -3 24 6', '<rect x="-11" y="-2.5" width="22" height="5" rx="2.5" fill="#4D9A3B"/><path d="M-7 0h3M0 0h3M6 0h2" stroke="#7CC26A" stroke-width="1.6" stroke-linecap="round"/>'),
    S('garrofo', '-7 -5 14 10', '<ellipse rx="6.2" ry="4.2" fill="#ECE5C7" stroke="#C9BA8E" stroke-width=".9"/><path d="M-3 0c2-1 4-1 6 0" fill="none" stroke="#D9CCA4" stroke-width=".8"/>'),
    S('escarola', '-15 -10 30 20', '<path d="M-14 4c-2-6 3-6 4-9 1 3 4-3 6-1 1-3 5-2 6 0 2-2 5 1 6 1 3 0 5 3 4 6 2 2-1 6-4 6-1 2-6 2-8 1-2 2-6 1-7-1-4 1-7-1-7-3z" fill="#9CC14F"/><path d="M-9 4c4-3 10-4 18-2" fill="none" stroke="#E2EFAF" stroke-width="2" stroke-linecap="round"/>'),
    S('perejil', '-14 -14 28 28', '<path d="M0 13V2M0 6l-6-6M0 4l6-7" stroke="#2F6E2C" stroke-width="1.6" stroke-linecap="round" fill="none"/><g fill="#3F8A3A"><circle cx="-7" cy="-2" r="4"/><circle cx="-3" cy="-7" r="4"/><circle cx="3" cy="-8" r="4"/><circle cx="7" cy="-4" r="4"/><circle cx="0" cy="-2" r="3.5"/></g>', 1),
    S('laurel', '-16 -6 32 12', '<path d="M-15 0c8-8 22-8 30 0-8 8-22 8-30 0z" fill="#5F7F35"/><path d="M-13 0h25" stroke="#43601F" stroke-width="1.1" stroke-linecap="round"/>'),
    S('romero', '-13 -5 26 10', '<path d="M-12 0H12" stroke="#5A7A3A" stroke-width="1.2"/><g stroke="#4E7A43" stroke-width="1.6" stroke-linecap="round"><path d="M-9 0l-2-4M-9 0l-2 4M-5 0l-2-4M-5 0l-2 4M-1 0l-2-4M-1 0l-2 4M3 0l-2-4M3 0l-2 4M7 0l-2-4M7 0l-2 4M11 0l-2-3M11 0l-2 3"/></g>'),
    S('guindilla', '-8 -3 16 6', '<path d="M-7 0c3-3 9-3 13-1l-1 2c-4 1-9 1-12-1z" fill="#C62D1F"/><path d="M6-1l2-1" stroke="#4E7A2E" stroke-width="1.4" stroke-linecap="round"/>'),
    S('nora', '-8 -8 16 16', '<circle r="7.2" fill="#7E2216"/><path d="M-4-3c2 2 5 2 7 0M-4 2c2 2 6 2 8 0" fill="none" stroke="#5E160D" stroke-width="1"/><path d="M0-7v-1.5" stroke="#6B5A2E" stroke-width="2" stroke-linecap="round"/>'),
    S('limon', '-8 -8 16 16', '<circle r="7.4" fill="#F2D23A"/><circle r="6" fill="#FBEA8B"/><path d="M0-6V6M-5.2-3 5.2 3M-5.2 3 5.2-3" stroke="#FFF7CC" stroke-width="1"/>'),
    S('piel', '-11 -4 22 8', '<path d="M-10 2c5-5 14-5 20-2l-1 2c-5-2-12-2-17 2z" fill="#F2C93A"/>'),
    S('aceituna', '-5 -4 10 8', '<ellipse rx="4.4" ry="3.3" fill="#7C8B3B"/><ellipse cx="-1.3" cy="-1" rx="1.2" ry=".8" fill="#FFFFFF" opacity=".35"/>'),
    S('almendra', '-5 -4 10 8', '<path d="M-4.5 0C-3-3 2-4 4.5-1 3 2-2 3.5-4.5 0z" fill="#C2925D" stroke="#A27443" stroke-width=".7"/>'),
    S('avellana', '-5 -5 10 10', '<circle cy=".6" r="4.2" fill="#9C6A3A"/><path d="M-4-1c2-3 6-3 8 0" fill="#C49A6C"/>'),
    // Legumbres y granos
    S('garbanzo', '-5 -5 10 10', '<circle r="4.3" fill="#E4C27E" stroke="#C9A25A" stroke-width=".6"/><path d="M-1-3c1 1 1 2 0 3" fill="none" stroke="#C9A25A" stroke-width=".7"/>'),
    S('lenteja', '-4 -3 8 6', '<ellipse rx="3.4" ry="2.5" fill="#8A5A3A"/><circle cx="-.8" cy="-.4" r=".7" fill="#A97A55"/>'),
    S('faba', '-7 -5 14 10', '<path d="M-6 0c0-4 4-5 7-4 3 1 5 3 5 5s-3 3-5 2c-2-1-3 1-5 1-1 0-2-2-2-4z" fill="#F4EEE2" stroke="#D2C6B0" stroke-width=".8"/>'),
    S('arroz', '-3 -2 6 4', '<ellipse rx="2.6" ry="1.3" fill="#FBF7EC" stroke="#E4D8BC" stroke-width=".4"/>'),
    S('fideo', '-7 -3 14 6', '<path d="M-6 0c2-3 4 3 6 0s4 3 6 0" fill="none" stroke="#E9CF8A" stroke-width="1.2"/>'),
    // Pan, huevos y dulce
    S('pan', '-12 -8 24 16', '<rect x="-11" y="-7" width="22" height="14" rx="4" fill="#C3833F"/><rect x="-8.6" y="-4.8" width="17.2" height="9.6" rx="2.6" fill="#F1DCAA"/><g fill="#E2C287"><circle cx="-3" cy="-1" r=".8"/><circle cx="2" cy="1" r=".7"/><circle cx="4" cy="-2" r=".6"/></g>'),
    S('picatoste', '-5 -5 10 10', '<rect x="-4" y="-4" width="8" height="8" rx="1.6" fill="#E0B05E" stroke="#C58F3E" stroke-width=".8"/>'),
    S('huevo', '-8 -10 16 20', '<ellipse rx="7" ry="9" fill="#F4EBDD" stroke="#D9CBB5" stroke-width="1"/><ellipse cx="-2.4" cy="-3.6" rx="1.6" ry="2.4" fill="#FFFFFF" opacity=".7"/>'),
    S('huevofrito', '-14 -10 28 20', '<path d="M-12 1c-1-6 5-9 10-8 4-3 11 0 12 4 3 3 0 9-5 9-3 3-9 2-11 0-4 1-7-2-6-5z" fill="#FBF8F1" stroke="#E7DDCB" stroke-width=".8"/><circle cx="1" cy="0" r="4.6" fill="#F2A922"/><circle cx="-.5" cy="-1.4" r="1.2" fill="#FFFFFF" opacity=".6"/>'),
    S('yema', '-6 -6 12 12', '<circle r="5" fill="#F2B233"/><circle cx="-1.4" cy="-1.6" r="1.3" fill="#FFFFFF" opacity=".6"/>'),
    S('croqueta', '-11 -6 22 12', '<rect x="-10" y="-5.5" width="20" height="11" rx="5.5" fill="#CF8E37"/><g fill="#E8B866"><circle cx="-5" cy="-2" r=".8"/><circle cx="0" cy="-3" r=".7"/><circle cx="4" cy="-1" r=".8"/><circle cx="-2" cy="2" r=".7"/><circle cx="6" cy="2.4" r=".6"/></g>'),
    S('sobao', '-13 -9 26 18', '<path d="M-11-2h22l-2 10h-18z" fill="#F7F3EA" stroke="#D6CBB8" stroke-width=".9"/><path d="M-11-2c0-5 5-7 11-7s11 2 11 7z" fill="#D99A3E"/><path d="M-6-5c3-1.5 8-1.5 11 0" fill="none" stroke="#EDBB6A" stroke-width="1.4" stroke-linecap="round"/>'),
    S('canela', '-12 -3.5 24 7', '<rect x="-11" y="-3" width="22" height="6" rx="3" fill="#8A5A2E"/><path d="M-11-.8h22" stroke="#A97445" stroke-width="1.1"/>'),
    S('azucar', '-3 -3 6 6', '<rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx=".8" fill="#FFFFFF" stroke="#DCD6CC" stroke-width=".4"/>'),
    S('mantequilla', '-9 -6 18 12', '<rect x="-8" y="-5" width="16" height="10" rx="2" fill="#F3D66E"/><path d="M-8-2h16" stroke="#F9E7A3" stroke-width="2"/>'),
    S('uva', '-8 -8 16 16', '<g fill="#6B2A55"><circle cx="-3" cy="-3" r="3"/><circle cx="3" cy="-3" r="3"/><circle cx="0" cy="1.6" r="3"/><circle cx="-3.2" cy="4.6" r="2.6"/><circle cx="3.2" cy="4.6" r="2.6"/></g><path d="M0-6V-8" stroke="#5B6B2E" stroke-width="1.4"/>'),
    // Iconos de interfaz
    S('llama', '0 0 10 14', '<path d="M5 0C8 4 10 6.5 10 9.2A5 5 0 0 1 0 9.2C0 6.5 2 4 5 0Z" fill="currentColor"/>', 1),
    S('frio', '0 0 14 14', '<path d="M7 1v12M1.8 4l10.4 6M1.8 10l10.4-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>', 1),
    S('play', '0 0 16 16', '<path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5Z" fill="currentColor"/>', 1),
    S('pausa', '0 0 16 16', '<rect x="3" y="2" width="3.6" height="12" rx="1" fill="currentColor"/><rect x="9.4" y="2" width="3.6" height="12" rx="1" fill="currentColor"/>', 1),
    S('campana', '0 0 16 16', '<path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5v3L2 11.5h12L12.5 9V6A4.5 4.5 0 0 0 8 1.5Z" fill="currentColor"/><path d="M6.2 13a1.9 1.9 0 0 0 3.6 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>', 1),
    S('ok', '0 0 16 16', '<path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', 1),
    S('no', '0 0 16 16', '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/>', 1),
    // Azulejo de la portada
    '<pattern id="azulejo" width="40" height="40" patternUnits="userSpaceOnUse">' +
      '<rect width="40" height="40" style="fill:var(--papel)"/>' +
      '<path d="M20 4c4 6 4 10 0 16-4-6-4-10 0-16zM20 36c4-6 4-10 0-16-4 6-4 10 0 16zM4 20c6-4 10-4 16 0-6 4-10 4-16 0zM36 20c-6-4-10-4-16 0 6 4 10 4 16 0z" style="fill:var(--anil)"/>' +
      '<circle cx="20" cy="20" r="3.2" style="fill:var(--ocre)"/>' +
      '<path d="M0 0h10M0 0v10M40 0h-10M40 0v10M0 40h10M0 40v-10M40 40h-10M40 40v-10" style="stroke:var(--anil)" stroke-width="3" fill="none"/>' +
      '<circle cx="0" cy="0" r="5" style="fill:var(--ocre)"/><circle cx="40" cy="0" r="5" style="fill:var(--ocre)"/><circle cx="0" cy="40" r="5" style="fill:var(--ocre)"/><circle cx="40" cy="40" r="5" style="fill:var(--ocre)"/>' +
      '<rect x=".5" y=".5" width="39" height="39" fill="none" style="stroke:var(--linea)"/>' +
    '</pattern>'
  ];
  var SPRITE = '<svg id="esc-sprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + SIMBOLOS.join('') + '</defs></svg>';

  /* Tamaño por defecto de cada dibujo dentro de una escena */
  var TAM = {
    rabo: [30, 19], chorizo: [15, 13], morcilla: [15, 13], tocino: [20, 10], jamon: [9, 8], pollo: [26, 18], carne: [24, 17],
    hueso: [24, 11], bonito: [14, 12], bacalao: [18, 10], anchoa: [22, 6], atun: [13, 9], pulpo: [16, 15],
    zanahoria: [15, 13], cebolla: [22, 12], pimiento: [20, 7], puerro: [15, 13], ajo: [10, 13], tomate: [18, 17], patata: [16, 14],
    papa: [18, 14], calabacin: [16, 14], berenjena: [17, 15], pepino: [15, 13], judia: [24, 6], garrofo: [13, 9], escarola: [30, 20],
    perejil: [16, 16], laurel: [24, 8], romero: [26, 10], guindilla: [16, 6], nora: [16, 15], limon: [16, 15], piel: [22, 8],
    aceituna: [9, 7], almendra: [10, 7], avellana: [9, 9], garbanzo: [8, 7], lenteja: [6, 5], faba: [11, 8], arroz: [5, 3],
    fideo: [14, 6], pan: [24, 16], picatoste: [9, 8], huevo: [14, 18], huevofrito: [30, 20], yema: [12, 11], croqueta: [22, 12],
    sobao: [26, 18], canela: [24, 7], azucar: [5, 5], mantequilla: [18, 12], uva: [16, 16],
    tuetano: [16, 16], oreja: [22, 18], manita: [27, 10], patapollo: [13, 20], apio: [12, 8], jengibre: [20, 13], pimienta: [5, 5], azafran: [10, 5]
  };
  var GIRA = { pimiento: 1, judia: 1, laurel: 1, romero: 1, anchoa: 1, guindilla: 1, piel: 1, canela: 1, croqueta: 1, fideo: 1, cebolla: 1, bacalao: 1, arroz: 1, tocino: 1,
    manita: 1, patapollo: 1, azafran: 1, jengibre: 1 };

  /* ---------- Utilidades ---------- */
  function semilla(txt) { var h = 2166136261; for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function azar(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  function uso(s, x, y, w, h, extra) { return '<use href="#e-' + s + '" x="' + f1(x - w / 2) + '" y="' + f1(y - h / 2) + '" width="' + f1(w) + '" height="' + f1(h) + '"' + (extra || '') + '/>'; }
  function lista(i) {
    var out = [];
    (i || []).forEach(function (it) {
      if (typeof it === 'string') it = [it, 1];
      var s = it[0], n = it[1] || 1, k = it[2] || 1, cls = it[3] || '', t = TAM[s] || [12, 10];
      for (var j = 0; j < n; j++) out.push({ s: s, w: t[0] * k, h: t[1] * k, cls: cls });
    });
    return out;
  }
  /* Reparte dibujos dentro de una elipse sin que se monten demasiado */
  function esparce(rnd, el, items, plano) {
    var colocados = [];
    items.slice().sort(function (a, b) { return b.w * b.h - a.w * a.h; }).forEach(function (it) {
      var mejor = null, mejorD = -1;
      for (var t = 0; t < 40; t++) {
        var a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
        var x = el.cx + Math.cos(a) * r * Math.max(2, el.rx - it.w / 2);
        var y = el.cy + Math.sin(a) * r * Math.max(1, el.ry - it.h * (plano ? .25 : .45));
        var dmin = 9;
        colocados.forEach(function (p) {
          var dx = (x - p.x) / ((it.w + p.w) / 2), dy = (y - p.y) / ((it.h + p.h) / 2);
          dmin = Math.min(dmin, Math.sqrt(dx * dx + dy * dy));
        });
        if (dmin > 1.05) { mejor = [x, y]; break; }
        if (dmin > mejorD) { mejorD = dmin; mejor = [x, y]; }
      }
      it.x = mejor[0]; it.y = mejor[1];
      it.rot = GIRA[it.s] ? Math.round((rnd() - .5) * 70) : 0;
      colocados.push(it);
    });
    colocados.sort(function (a, b) { return a.y - b.y; });
    return colocados.map(function (it) {
      var ex = (it.cls ? ' class="' + it.cls + '"' : '') + (it.rot ? ' transform="rotate(' + it.rot + ' ' + f1(it.x) + ' ' + f1(it.y) + ')"' : '');
      return uso(it.s, it.x, it.y, it.w, it.h, ex);
    }).join('');
  }
  function vapor(cx, cy, n, alto) {
    var d = '', paso = 26;
    for (var i = 0; i < n; i++) {
      var x = cx + (i - (n - 1) / 2) * paso, y = cy;
      d += 'M' + x + ' ' + y + 'c-6-8 4-12-2-20s4-12-2-20' + (alto ? 's4-12-2-20' : '');
    }
    return '<path d="' + d + '" fill="none" style="stroke:var(--vapor)" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>';
  }
  function llamas(cx, base, nivel, ancho) {
    if (!nivel) return '';
    var cfg = [null, [3, 8, 'azul'], [3, 10, 'naranja'], [4, 14, 'naranja'], [5, 18, 'naranja'], [5, 22, 'naranja']][nivel];
    var n = cfg[0] + (ancho ? 2 : 0), h = cfg[1], sep = ancho ? 30 : 24, ext = '', int_ = '';
    for (var i = 0; i < n; i++) {
      var x = cx + (i - (n - 1) / 2) * sep, w = h * .28;
      ext += '<path d="M' + f1(x) + ' ' + base + 'c' + f1(-w) + ' ' + f1(-h * .35) + ' ' + f1(-w * .9) + ' ' + f1(-h * .7) + ' 0 ' + (-h) + ' ' + f1(w * .9) + ' ' + f1(h * .3) + ' ' + f1(w) + ' ' + f1(h * .65) + ' 0 ' + h + 'z"/>';
      int_ += '<path d="M' + f1(x) + ' ' + base + 'c' + f1(-w * .5) + ' ' + f1(-h * .2) + ' ' + f1(-w * .45) + ' ' + f1(-h * .4) + ' 0 ' + f1(-h * .55) + ' ' + f1(w * .45) + ' ' + f1(h * .15) + ' ' + f1(w * .5) + ' ' + f1(h * .35) + ' 0 ' + f1(h * .55) + 'z"/>';
    }
    var azul = cfg[2] === 'azul';
    return '<g fill="' + (azul ? '#4C7DE0' : '#EE7B2C') + '">' + ext + '</g><g fill="' + (azul ? '#C7DAFF' : '#F7C548') + '">' + int_ + '</g>' +
      '<rect x="' + (cx - (ancho ? 112 : 68)) + '" y="' + base + '" width="' + (ancho ? 224 : 136) + '" height="6" rx="3" style="fill:var(--hierro)"/>';
  }
  function reloj(txt, frac, x, y) {
    x = x || 282; y = y || 34;
    var r = 20, a = (frac || .33) * 2 * Math.PI, ex = x + r * Math.sin(a), ey = y - r * Math.cos(a);
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--papel);stroke:var(--tinta-2)" stroke-width="2.5"/>' +
      '<path d="M' + x + ' ' + y + 'L' + x + ' ' + (y - r) + 'A' + r + ' ' + r + ' 0 ' + ((frac || .33) > .5 ? 1 : 0) + ' 1 ' + f1(ex) + ' ' + f1(ey) + 'Z" style="fill:var(--vino)" opacity=".9"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="2.4" style="fill:var(--tinta)"/>' +
      '<text x="' + x + '" y="' + (y + 38) + '" text-anchor="middle" style="fill:var(--tinta);font:800 15px var(--f-texto)">' + txt + '</text>';
  }
  var LIQ = { vino: ['botella', '#1F3A2B', '#6E1424'], vinoblanco: ['botella', '#4F6E3A', '#EAD98A'], aceite: ['botella', '#7E8A2E', '#E3BC4A'], vinagre: ['botella', '#5B3A1E', '#B9894A'],
    agua: ['jarra', '#9CC8EA', '#8EC5EA'], leche: ['jarra', '#F6F3EC', '#FBF8F2'], caldo: ['jarra', '#E7C27A', '#D9A54A'],
    huevo: ['jarra', '#F6F3EC', '#F3C43B'], tomate: ['jarra', '#F6F3EC', '#C8322B'], bechamel: ['jarra', '#F6F3EC', '#F3E8CF'] };
  function vierte(tipo, mx, my, hasta) {
    var c = LIQ[tipo] || LIQ.agua, s = '';
    if (c[0] === 'botella') {
      s += '<g transform="translate(' + f1(mx + 53.9) + ' ' + f1(my - 26.3) + ') rotate(244)"><g fill="' + c[1] + '" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="1.4">' +
        '<rect x="-6" y="-57" width="12" height="25"/><path d="M-6-34C-6-26-16-25-16-15H16C16-25 6-26 6-34Z"/><rect x="-16" y="-16" width="32" height="56" rx="5"/></g>' +
        '<rect x="-7" y="-62" width="14" height="6" rx="2" fill="#1A1A1A" opacity=".5"/><rect x="-12" y="2" width="24" height="24" rx="2" fill="#F1ECE0"/><rect x="-12" y="8" width="24" height="4" fill="#8C1D2C"/></g>';
    } else {
      s += '<g transform="translate(' + f1(mx - 206.6) + ' ' + f1(my - 51.8) + ')"><g transform="rotate(-38 238 40)">' +
        '<path d="M206 30h64c0 20-14 32-32 32s-32-12-32-32z" fill="' + (tipo === 'agua' ? '#E8F2FA' : '#F6F3EC') + '"/>' +
        '<path d="M210 41c6 9 15 13 28 13s22-4 28-13" fill="none" style="stroke:var(--anil)" stroke-width="3.5" stroke-linecap="round"/>' +
        '<ellipse cx="238" cy="30" rx="32" ry="8" fill="' + (tipo === 'agua' ? '#E8F2FA' : '#F6F3EC') + '"/><ellipse cx="238" cy="30.5" rx="28" ry="6" fill="' + c[2] + '"/></g></g>';
    }
    s += '<path d="M' + f1(mx) + ' ' + f1(my) + 'C' + f1(mx - 3) + ' ' + f1(my + 6) + ' ' + f1(mx - 6) + ' ' + f1(hasta - 6) + ' ' + f1(mx - 8) + ' ' + f1(hasta) + '" fill="none" stroke="' + c[2] + '" stroke-width="6" stroke-linecap="round"' + (tipo === 'leche' || tipo === 'bechamel' ? ' style="filter:drop-shadow(0 0 1px rgba(0,0,0,.25))"' : '') + '/>';
    return s;
  }
  function tapa(s, tipo, entreabierta) {
    var vidrio = tipo === 'lenta', metal = tipo === 'olla' || vidrio;
    var base = vidrio ? '#8C97AA' : metal ? '#8790A3' : '#8E4426', cupula = vidrio ? '#DCE6F2' : metal ? '#A9B1C2' : '#A9562F', brillo = vidrio ? '#FFFFFF' : metal ? '#D3D8E2' : '#C47248';
    var g = '<ellipse cx="' + s.cx + '" cy="' + s.cy + '" rx="' + (s.rx + 5) + '" ry="' + (s.ry + 2) + '" fill="' + base + '"/>' +
      '<path d="M' + (s.cx - s.rx - 3) + ' ' + s.cy + 'C' + (s.cx - s.rx + 5) + ' ' + (s.cy - 24) + ' ' + (s.cx - 42) + ' ' + (s.cy - 34) + ' ' + s.cx + ' ' + (s.cy - 34) + 'S' + (s.cx + s.rx - 5) + ' ' + (s.cy - 24) + ' ' + (s.cx + s.rx + 3) + ' ' + s.cy + 'Z" fill="' + cupula + '"' + (vidrio ? ' fill-opacity=".72" stroke="#8C97AA" stroke-width="2"' : '') + '/>' +
      '<path d="M' + (s.cx - s.rx + 22) + ' ' + (s.cy - 12) + 'C' + (s.cx - s.rx + 34) + ' ' + (s.cy - 23) + ' ' + (s.cx - 34) + ' ' + (s.cy - 29) + ' ' + (s.cx - 12) + ' ' + (s.cy - 30) + '" fill="none" stroke="' + brillo + '" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="' + s.cx + '" cy="' + (s.cy - 33) + '" rx="14" ry="6" fill="' + (vidrio ? '#2E3240' : metal ? '#4E5567' : '#7B3A21') + '"/>';
    if (entreabierta) return '<g transform="rotate(-7 ' + (s.cx + s.rx) + ' ' + s.cy + ') translate(0 -5)">' + g + '</g>';
    return g;
  }
  /* Tarro de cristal con caldo: grasa cuajada arriba (grasa), aspecto de gelatina (gel) y tapa (tapa) */
  function tarro(x, y0, y1, w, nivel, e) {
    var l = x - w / 2, c = e.c || '#D9A54A', s = '';
    s += '<rect x="' + l + '" y="' + y0 + '" width="' + w + '" height="' + (y1 - y0) + '" rx="8" style="fill:var(--vidrio)" opacity=".5"/>';
    s += '<rect x="' + (l + 3) + '" y="' + nivel + '" width="' + (w - 6) + '" height="' + (y1 - nivel - 3) + '" rx="6" fill="' + c + '"/>';
    if (e.grasa) s += '<rect x="' + (l + 3) + '" y="' + nivel + '" width="' + (w - 6) + '" height="7" rx="3" fill="#F1DFA6"/>';
    if (e.gel) s += '<path d="M' + (l + 9) + ' ' + (nivel + (e.grasa ? 14 : 8)) + 'q' + (w / 2 - 9) + ' -4 ' + (w - 18) + ' 0" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".55"/>';
    s += '<path d="M' + (l + 8) + ' ' + (y0 + 10) + 'V' + (y1 - 12) + '" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".45"/>';
    s += '<rect x="' + l + '" y="' + y0 + '" width="' + w + '" height="' + (y1 - y0) + '" rx="8" fill="none" style="stroke:var(--vapor)" stroke-width="2"/>';
    if (e.tapa) s += '<rect x="' + (l + 2) + '" y="' + (y0 - 8) + '" width="' + (w - 4) + '" height="10" rx="3" fill="#9AA3B5"/>';
    return s;
  }

  /* ---------- Escenas ---------- */
  var VAS = {
    cazuela: { sym: 'v-cazuela', x: 50, y: 50, w: 220, h: 104, s: { cx: 160, cy: 78, rx: 88, ry: 13 }, fondo: 150 },
    olla: { sym: 'v-olla', x: 60, y: 38, w: 200, h: 120, s: { cx: 160, cy: 62, rx: 80, ry: 12 }, fondo: 154 },
    sarten: { sym: 'v-sarten', x: 28, y: 84, w: 250, h: 64, s: { cx: 133, cy: 102, rx: 88, ry: 11 }, fondo: 140 },
    paellera: { sym: 'v-paellera', x: 15, y: 76, w: 290, h: 60, s: { cx: 160, cy: 98, rx: 121, ry: 15 }, fondo: 124 },
    lenta: { sym: 'v-lenta', x: 55, y: 40, w: 210, h: 124, s: { cx: 160, cy: 67, rx: 80, ry: 11 }, fondo: 158 }
  };

  function escenaFuego(e, rnd) {
    var v = VAS[e.v || 'cazuela'], s = v.s, out = '';
    var base = v.fondo + 14;
    out += llamas(e.v === 'sarten' ? s.cx - 8 : s.cx, base, e.f || 0, e.v === 'paellera');
    if (!e.f && e.salvamanteles !== 0) out += '<ellipse cx="' + s.cx + '" cy="' + (v.fondo + 4) + '" rx="' + (s.rx + 6) + '" ry="8" fill="#000" opacity=".1"/>';
    out += '<use href="#e-' + v.sym + '" x="' + v.x + '" y="' + v.y + '" width="' + v.w + '" height="' + v.h + '" style="--contenido:' + (e.c || '#C9A24A') + '"/>';
    if (e.tapa && e.tapa !== 2) {
      out += tapa(s, e.v);
      if (e.vapor) out += vapor(s.cx - 70, s.cy - 6, 1) + vapor(s.cx + 70, s.cy - 6, 1);
    } else {
      if (e.malla) out += '<ellipse cx="' + (s.cx - 18) + '" cy="' + s.cy + '" rx="34" ry="' + (s.ry * .6) + '" fill="#E4C27E"/><path d="M' + (s.cx - 48) + ' ' + s.cy + 'h60M' + (s.cx - 40) + ' ' + (s.cy - 4) + 'h44M' + (s.cx - 40) + ' ' + (s.cy + 4) + 'h44M' + (s.cx - 34) + ' ' + (s.cy - 7) + 'v14M' + (s.cx - 18) + ' ' + (s.cy - 8) + 'v16M' + (s.cx - 2) + ' ' + (s.cy - 7) + 'v14" stroke="#C8372B" stroke-width="1.2"/>';
      var el = { cx: s.cx, cy: s.cy, rx: s.rx * .84, ry: s.ry * .62 };
      out += esparce(rnd, el, lista(e.i), true);
      if (e.espuma) {
        out += '<g fill="#F4ECDC" opacity=".9"><ellipse cx="' + (s.cx - 30) + '" cy="' + (s.cy - 2) + '" rx="16" ry="4"/><ellipse cx="' + (s.cx + 8) + '" cy="' + (s.cy + 3) + '" rx="20" ry="4.5"/><ellipse cx="' + (s.cx + 40) + '" cy="' + (s.cy - 3) + '" rx="12" ry="3.5"/></g>' +
          '<path d="M' + (s.cx + 92) + ' ' + (s.cy - 56) + 'L' + (s.cx + 40) + ' ' + (s.cy - 6) + '" stroke="#9AA3B5" stroke-width="4" stroke-linecap="round"/><ellipse cx="' + (s.cx + 34) + '" cy="' + (s.cy - 2) + '" rx="14" ry="5" fill="#C9CFDB"/><g fill="#8F98AA"><circle cx="' + (s.cx + 30) + '" cy="' + (s.cy - 2) + '" r="1"/><circle cx="' + (s.cx + 36) + '" cy="' + (s.cy - 3) + '" r="1"/><circle cx="' + (s.cx + 40) + '" cy="' + (s.cy - 1) + '" r="1"/></g>';
      }
      if (e.burbujas) {
        var bc = e.burbujas === 1 ? 'rgba(255,255,255,.55)' : e.burbujas, b = '';
        for (var k = 0; k < 7; k++) b += '<circle cx="' + f1(s.cx + (rnd() - .5) * s.rx * 1.5) + '" cy="' + f1(s.cy + (rnd() - .5) * s.ry * 1.1) + '" r="' + f1(1.6 + rnd() * 1.6) + '"/>';
        out += '<g fill="none" stroke="' + bc + '" stroke-width="1.3">' + b + '</g>';
      }
      if (e.polvo) {
        var pd = '';
        for (var q = 0; q < 26; q++) pd += '<circle cx="' + f1(s.cx + (rnd() - .5) * s.rx * 1.4) + '" cy="' + f1(s.cy + (rnd() - .5) * s.ry * 1.1) + '" r=".9"/>';
        out += '<g fill="' + e.polvo + '">' + pd + '</g>';
      }
      if (e.chisp) {
        var ch = '';
        for (var z = 0; z < 5; z++) { var xx = s.cx + (z - 2) * 30 + (rnd() - .5) * 10; ch += 'M' + f1(xx) + ' ' + (s.cy - 22) + 'q3-5 0-10'; }
        out += '<path d="' + ch + '" fill="none" style="stroke:var(--vapor)" stroke-width="2.2" stroke-linecap="round"/>';
      }
      if (e.tapa === 2) out += tapa(s, e.v, true) + vapor(s.cx + s.rx - 14, s.cy - 12, 1);
      else if (e.vapor) out += vapor(s.cx, s.cy - 16, 3);
      if (e.cuchara) out += '<path d="M' + (s.cx + 86) + ' ' + (s.cy - 64) + 'L' + (s.cx + 28) + ' ' + (s.cy - 4) + '" stroke="#B98652" stroke-width="7" stroke-linecap="round"/><ellipse cx="' + (s.cx + 25) + '" cy="' + (s.cy - 1) + '" rx="13" ry="6" fill="#A57142" transform="rotate(-46 ' + (s.cx + 25) + ' ' + (s.cy - 1) + ')"/>';
      if (e.batidora) out += '<g transform="translate(' + (s.cx - 188) + ' ' + (s.cy - 86) + ') rotate(18 222 40)"><rect x="216" y="50" width="13" height="36" rx="3" fill="#B7BECC"/><path d="M209 86h27l-4 9h-19z" fill="#8F97A8"/><rect x="208" y="2" width="29" height="52" rx="11" fill="#4E5567"/><rect x="218" y="14" width="9" height="14" rx="3" fill="#D0545E"/></g>' +
        '<path d="M' + (s.cx - 34) + ' ' + (s.cy + 1) + 'c12-7 48-7 60 0-12 6-44 6-52 0" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.4" stroke-linecap="round"/>';
      if (e.vierte) out += vierte(e.vierte, s.cx + s.rx * .5, s.cy - 18, s.cy - 2);
      if (e.cae) {
        var caen = lista(e.cae), trazo = '';
        caen.forEach(function (it, n) {
          var x = s.cx - 40 + n * (80 / Math.max(1, caen.length - 1)), y = s.cy - 46 + (n % 2) * 10;
          out += uso(it.s, x, y, it.w, it.h, GIRA[it.s] ? ' transform="rotate(' + (n % 2 ? 30 : -25) + ' ' + f1(x) + ' ' + f1(y) + ')"' : '');
          trazo += 'M' + f1(x) + ' ' + f1(y - it.h / 2 - 3) + 'v-8';
        });
        out += '<path d="' + trazo + '" style="stroke:var(--vapor)" stroke-width="2" stroke-linecap="round"/>';
      }
    }
    if (e.agita) out += '<g fill="none" style="stroke:var(--anil)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M' + (v.x - 2) + ' ' + (s.cy + 30) + 'c-12-8-12-22 0-30m-7 1 7-1-1 7"/><path d="M' + (v.x + v.w + 2) + ' ' + (s.cy + 30) + 'c12-8 12-22 0-30m7 1-7-1 1 7"/></g>';
    if (e.reloj) out += reloj(e.reloj, e.rf, 286, 30);
    if (e.luna) out += luna(e.luna);
    return out;
  }

  function escenaTabla(e, rnd) {
    var out = '<ellipse cx="160" cy="160" rx="132" ry="9" fill="#000" opacity=".08"/><rect x="34" y="58" width="252" height="100" rx="16" fill="#B08150"/>' +
      '<rect x="34" y="50" width="252" height="100" rx="16" fill="#D2A46A"/><circle cx="266" cy="66" r="6" style="fill:var(--lienzo)"/>' +
      '<path d="M56 72h40M190 140h70M60 142h52M206 60h28" stroke="#C39258" stroke-width="2" stroke-linecap="round"/>';
    var grupos = (e.i || []).map(function (g) { return typeof g === 'string' ? [g, 4] : g; });
    var n = grupos.length || 1, ancho = 210 / n;
    grupos.forEach(function (g, k) {
      var cx = 58 + ancho * (k + .5) - (e.cuchillo === 0 ? 0 : 6), el = { cx: cx, cy: 88, rx: Math.min(30, ancho / 2 - 2), ry: 22 };
      out += esparce(rnd, el, lista([g]), false);
    });
    if (e.cuchillo !== 0) out += '<path d="M120 122H218V136H158C142 136 128 131 120 122Z" fill="#D5DBE4"/><path d="M126 124H214" stroke="#F1F4F8" stroke-width="2" stroke-linecap="round"/><rect x="216" y="121" width="58" height="16" rx="6" fill="#3B2A22"/><circle cx="232" cy="129" r="2" fill="#C9CFD9"/><circle cx="256" cy="129" r="2" fill="#C9CFD9"/>';
    return out;
  }

  function escenaBol(e, rnd) {
    var out = '<ellipse cx="160" cy="154" rx="84" ry="7" fill="#000" opacity=".09"/>' +
      '<path d="M76 74C80 124 112 150 160 150S240 124 244 74Z" fill="#F6F3EC"/>' +
      '<path d="M84 96C98 120 126 132 160 132S222 120 236 96" fill="none" style="stroke:var(--anil)" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="160" cy="74" rx="84" ry="17" fill="#ECE6DA"/><ellipse cx="160" cy="75" rx="77" ry="14" fill="' + (e.c || '#F2E3B5') + '"/>';
    out += esparce(rnd, { cx: 160, cy: 75, rx: 62, ry: 8 }, lista(e.i), true);
    if (e.varillas) out += '<g transform="rotate(-32 200 40)"><rect x="196" y="-6" width="8" height="40" rx="4" fill="#4E5567"/><path d="M200 34c-14 8-14 34 0 44 14-10 14-36 0-44zM200 34c-6 8-6 34 0 44 6-10 6-36 0-44z" fill="none" stroke="#B7BECC" stroke-width="2.2"/></g>';
    if (e.tenedor) out += '<g transform="rotate(-30 210 50)"><rect x="207" y="0" width="6" height="52" rx="3" fill="#B7BECC"/><path d="M203 52v18M208 52v18M213 52v18M218 52v18M203 52h15" stroke="#B7BECC" stroke-width="2" stroke-linecap="round"/></g>';
    if (e.colador) out += '<path d="M104 60h112c0 22-25 34-56 34S104 82 104 60z" fill="#C9CFDB" opacity=".9"/><path d="M216 60h52" stroke="#8F98AA" stroke-width="5" stroke-linecap="round"/><g fill="#8F98AA"><circle cx="140" cy="72" r="1.2"/><circle cx="152" cy="78" r="1.2"/><circle cx="166" cy="76" r="1.2"/><circle cx="180" cy="70" r="1.2"/><circle cx="160" cy="68" r="1.2"/></g>';
    if (e.vierte) out += vierte(e.vierte, 214, 54, 72);
    if (e.cae) out += escenaCae(e.cae, 160, 70);
    return out;
  }
  function escenaCae(c, cx, cy) {
    var caen = lista(c), out = '', trazo = '';
    caen.forEach(function (it, n) {
      var x = cx - 34 + n * (68 / Math.max(1, caen.length - 1)), y = cy - 40 + (n % 2) * 8;
      out += uso(it.s, x, y, it.w, it.h, '');
      trazo += 'M' + f1(x) + ' ' + f1(y - it.h / 2 - 3) + 'v-8';
    });
    return out + '<path d="' + trazo + '" style="stroke:var(--vapor)" stroke-width="2" stroke-linecap="round"/>';
  }

  function platoBase(v, c) {
    if (v === 'cuenco') return { svg: '<ellipse cx="160" cy="154" rx="88" ry="7" fill="#000" opacity=".09"/><path d="M70 82C74 128 108 150 160 150S246 128 250 82Z" fill="#F6F3EC"/><path d="M80 104C94 126 124 136 160 136S226 126 240 104" fill="none" style="stroke:var(--anil)" stroke-width="4" stroke-linecap="round"/><ellipse cx="160" cy="82" rx="90" ry="18" fill="#ECE6DA"/><ellipse cx="160" cy="83" rx="83" ry="15" fill="' + (c || '#C9A24A') + '"/>', el: { cx: 160, cy: 83, rx: 68, ry: 9 } };
    if (v === 'madera') return { svg: '<ellipse cx="150" cy="154" rx="116" ry="10" fill="#000" opacity=".09"/><ellipse cx="150" cy="114" rx="122" ry="44" fill="#B98A55"/><ellipse cx="150" cy="111" rx="114" ry="39" fill="#D4A970"/><path d="M70 104c30-8 120-10 160 2" fill="none" stroke="#C39258" stroke-width="2"/>', el: { cx: 150, cy: 110, rx: 92, ry: 26 } };
    if (v === 'fuente') return { svg: '<ellipse cx="150" cy="152" rx="122" ry="10" fill="#000" opacity=".09"/><ellipse cx="150" cy="112" rx="130" ry="40" fill="#F7F4EE"/><ellipse cx="150" cy="112" rx="121" ry="35.5" fill="none" style="stroke:var(--anil)" stroke-width="3"/><ellipse cx="150" cy="112" rx="110" ry="30" fill="#EFEAE0"/>', el: { cx: 150, cy: 110, rx: 96, ry: 22 } };
    if (v === 'cazuela') return { svg: '<ellipse cx="160" cy="153" rx="104" ry="9" fill="#C79A64"/><use href="#e-v-cazuela" x="50" y="50" width="220" height="104" style="--contenido:' + (c || '#5B1B1F') + '"/>', el: { cx: 160, cy: 78, rx: 74, ry: 8 } };
    if (v === 'sarten') return { svg: '<ellipse cx="160" cy="150" rx="104" ry="8" fill="#000" opacity=".1"/><use href="#e-v-sarten" x="28" y="84" width="250" height="64" style="--contenido:' + (c || '#C99A5A') + '"/>', el: { cx: 133, cy: 102, rx: 74, ry: 7 } };
    if (v === 'paellera') return { svg: '<ellipse cx="160" cy="132" rx="132" ry="9" fill="#000" opacity=".1"/><use href="#e-v-paellera" x="15" y="76" width="290" height="60" style="--contenido:' + (c || '#E5B54C') + '"/>', el: { cx: 160, cy: 98, rx: 104, ry: 10 } };
    if (v === 'cazuelitas') return { svg: '<ellipse cx="95" cy="138" rx="62" ry="6" fill="#000" opacity=".1"/><ellipse cx="225" cy="146" rx="62" ry="6" fill="#000" opacity=".1"/><use href="#e-v-cazuela" x="30" y="72" width="130" height="61.5" style="--contenido:' + (c || '#F1D27A') + '"/><use href="#e-v-cazuela" x="160" y="80" width="130" height="61.5" style="--contenido:' + (c || '#F1D27A') + '"/>', el: { cx: 225, cy: 96.5, rx: 40, ry: 4 } };
    // plato llano
    return { svg: '<ellipse cx="150" cy="152" rx="118" ry="11" fill="#000" opacity=".09"/><ellipse cx="150" cy="114" rx="122" ry="44" fill="#F7F4EE"/><ellipse cx="150" cy="114" rx="111" ry="39" fill="none" style="stroke:var(--anil)" stroke-width="4"/><ellipse cx="150" cy="114" rx="104" ry="36" fill="none" style="stroke:var(--anil)" stroke-width="1.2" opacity=".6"/><ellipse cx="150" cy="114" rx="90" ry="30" fill="#EEE9DF"/>' +
      (c ? '<path d="M70 114c2-16 72-22 104-9 16 6 10 22-14 26-34 6-92 1-90-17z" fill="' + c + '"/>' : ''), el: { cx: 140, cy: 110, rx: 64, ry: 17 } };
  }

  function escenaPlato(e, rnd) {
    var out = '';
    if (e.v === 'vaso') {
      out += '<ellipse cx="150" cy="154" rx="40" ry="5" fill="#000" opacity=".1"/><path d="M118 40h64l-8 112h-48z" style="fill:var(--vidrio)" opacity=".55"/>' +
        '<path d="M121 62h58l-6.4 88h-45.2z" fill="' + (e.c || '#E0552F') + '"/><path d="M118 40h64l-8 112h-48z" fill="none" style="stroke:var(--vapor)" stroke-width="2"/>' +
        '<path d="M128 70l-1 66" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".35"/>';
      out += esparce(rnd, { cx: 150, cy: 64, rx: 20, ry: 3 }, lista(e.i), true);
      if (e.guarn) out += '<ellipse cx="248" cy="150" rx="46" ry="6" fill="#000" opacity=".08"/><path d="M204 118c2 22 20 32 44 32s42-10 44-32z" fill="#F6F3EC"/><ellipse cx="248" cy="118" rx="44" ry="10" fill="#ECE6DA"/>' + esparce(rnd, { cx: 248, cy: 116, rx: 34, ry: 5 }, lista(e.guarn), true);
      return out;
    }
    if (e.v === 'tarros') {
      [104, 160, 216].forEach(function (x, n) {
        var y0 = n === 1 ? 58 : 66, nivel = y0 + 16, gira = e.gel && n === 0 ? ' transform="rotate(-20 ' + (x - 24) + ' 146)"' : '';
        out += '<ellipse cx="' + x + '" cy="149" rx="30" ry="4" fill="#000" opacity=".08"/><g' + gira + '>' + tarro(x, y0, 146, 48, nivel, gira ? { c: e.c, gel: 1, tapa: e.tapa } : e) + '</g>';
      });
      if (e.cuchara) out += '<path d="M276 22L232 66" stroke="#9AA3B5" stroke-width="5" stroke-linecap="round"/><ellipse cx="227" cy="71" rx="13" ry="6" fill="#C9CFDB" transform="rotate(-42 227 71)"/><ellipse cx="226" cy="70" rx="9" ry="3.6" fill="#F1DFA6" transform="rotate(-42 226 70)"/>';
      if (e.vapor) out += vapor(160, 50, 3);
      return out;
    }
    if (e.v === 'taza') {
      out += '<ellipse cx="146" cy="152" rx="70" ry="7" fill="#000" opacity=".09"/><ellipse cx="252" cy="150" rx="30" ry="4" fill="#000" opacity=".08"/>' +
        '<path d="M186 88c20-6 32 4 30 17s-14 21-32 19" fill="none" stroke="#ECE6DA" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M90 70V126q0 22 24 22H162q24 0 24-22V70Z" fill="#F6F3EC"/><path d="M90 104H186" style="stroke:var(--anil)" stroke-width="5"/><path d="M90 112H186" style="stroke:var(--anil)" stroke-width="1.6" opacity=".6"/>' +
        '<path d="M101 80V130" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
        '<ellipse cx="138" cy="70" rx="48" ry="11" fill="#ECE6DA"/><ellipse cx="138" cy="71" rx="43" ry="8.5" fill="' + (e.c || '#D9A54A') + '"/>' +
        '<g transform="rotate(-14 228 146)">' + tarro(252, 92, 146, 42, 104, { c: '#C99A3E', gel: 1, tapa: 1 }) + '</g>';
      out += vapor(138, 56, 3);
      return out;
    }
    var b = platoBase(e.v, e.c);
    out += b.svg;
    if (e.tortilla) {
      out += '<ellipse cx="150" cy="110" rx="76" ry="25" fill="#C98A34"/><ellipse cx="150" cy="106" rx="74" ry="23" fill="#E9B44E"/>' +
        '<path d="M150 106 L224 104 A74 23 0 0 1 196 124 Z" fill="#F7E2A6"/><g fill="#EBCB7D"><circle cx="190" cy="112" r="2"/><circle cx="206" cy="110" r="1.6"/><circle cx="182" cy="117" r="1.4"/><circle cx="198" cy="118" r="1.8"/></g>' +
        '<path d="M100 98c14-6 34-8 52-6" fill="none" stroke="#F6D387" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
    }
    out += esparce(rnd, b.el, lista(e.i), true);
    if (e.guarn) out += esparce(rnd, { cx: 206, cy: 112, rx: 24, ry: 14 }, lista(e.guarn), false);
    if (e.polvo) {
      var pd = '';
      for (var q = 0; q < 34; q++) pd += '<circle cx="' + f1(b.el.cx + (rnd() - .5) * b.el.rx * 1.7) + '" cy="' + f1(b.el.cy + (rnd() - .5) * b.el.ry * 1.6) + '" r=".95"/>';
      out += '<g fill="' + e.polvo + '">' + pd + '</g>';
    }
    if (e.mojos) out += '<path d="M222 134c1 9 9 14 19 14s18-5 19-14z" fill="#F6F3EC"/><ellipse cx="241" cy="134" rx="19" ry="5" fill="#B83A22"/><path d="M262 120c1 9 9 14 19 14s18-5 19-14z" fill="#F6F3EC"/><ellipse cx="281" cy="120" rx="19" ry="5" fill="#5E8C2E"/>';
    if (e.salsera) out += '<path d="M232 128c1 10 10 16 21 16s20-6 21-16z" fill="#F6F3EC"/><ellipse cx="253" cy="128" rx="21" ry="5.5" fill="' + e.salsera + '"/>';
    if (e.hierro) out += '<path d="M306 6 L246 68" stroke="#4E5567" stroke-width="5" stroke-linecap="round"/><circle cx="238" cy="80" r="17" fill="#F2994A" opacity=".35"/><ellipse cx="236" cy="82" rx="13" ry="5" fill="#C0392B"/><path d="M226 66c-4-6 3-9-1-14M244 64c-4-6 3-9-1-14" fill="none" style="stroke:var(--vapor)" stroke-width="2" stroke-linecap="round"/>';
    if (e.pan) out += uso('pan', 38, 150, 46, 30, ' transform="rotate(-12 38 150)"');
    if (e.vino) out += '<path d="M274 50h30c-1 10-7 18-15 18s-14-8-15-18z" fill="#6E1424"/><path d="M272 36h34c0 18-7 32-17 32s-17-14-17-32z" fill="none" style="stroke:var(--vapor)" stroke-width="1.6"/><path d="M289 68v32" style="stroke:var(--vapor)" stroke-width="3" stroke-linecap="round"/><ellipse cx="289" cy="102" rx="14" ry="4" style="fill:var(--vidrio);stroke:var(--vapor)" stroke-width="1.6"/>';
    if (e.cuchara) out += '<path d="M284 150 L250 112" stroke="#B98652" stroke-width="6" stroke-linecap="round"/><ellipse cx="246" cy="107" rx="11" ry="6" fill="#A57142" transform="rotate(48 246 107)"/>';
    if (e.vapor) out += vapor(b.el.cx, b.el.cy - 14, 3);
    return out;
  }

  function escenaHorno(e, rnd) {
    var out = '<rect x="66" y="14" width="188" height="156" rx="10" fill="#2F3442"/><rect x="76" y="24" width="168" height="18" rx="4" fill="#3B4152"/>' +
      '<circle cx="92" cy="33" r="5" fill="#9AA3B5"/><circle cx="110" cy="33" r="5" fill="#9AA3B5"/><rect x="196" y="27" width="40" height="12" rx="3" fill="#1B1F2A"/>' +
      '<text x="216" y="36.5" text-anchor="middle" style="fill:#F2A65A;font:800 9px var(--f-texto)">' + (e.t || '180 °C') + '</text>' +
      '<rect x="96" y="46" width="128" height="5" rx="2.5" fill="#9AA3B5"/><rect x="84" y="56" width="152" height="100" rx="7" fill="#1D2130"/>' +
      '<rect x="90" y="62" width="140" height="88" rx="5" fill="#F2A65A" opacity=".32"/>' +
      '<path d="M112 76q6-5 12 0t12 0M148 76q6-5 12 0t12 0M184 76q6-5 12 0t12 0" fill="none" stroke="#F7C88A" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M92 132H228" stroke="#6E7487" stroke-width="2"/>';
    if (e.d === 'cazuela') out += '<use href="#e-v-cazuela" x="104" y="96" width="112" height="53" style="--contenido:' + (e.c || '#B5402F') + '"/>' + esparce(rnd, { cx: 160, cy: 110, rx: 38, ry: 4 }, lista(e.i), true);
    else {
      out += '<rect x="100" y="124" width="120" height="8" rx="2" fill="#8A909E"/>';
      out += esparce(rnd, { cx: 160, cy: 116, rx: 48, ry: 4 }, lista(e.i), false);
    }
    return out;
  }

  function escenaNevera(e, rnd) {
    var copia = {}; for (var k in e) copia[k] = e[k];
    copia.k = 'plato'; copia.v = e.v || 'fuente'; copia.vapor = 0;
    var out = escenaPlato(copia, rnd);
    out += '<path d="M90 92l40-12M110 120l70-20M190 112l40-12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".55"/>';
    out += '<g transform="translate(26 18)" style="color:var(--anil)"><use href="#e-frio" x="0" y="0" width="30" height="30"/></g>';
    out += e.luna ? luna(e.t || '24 h') : reloj(e.t || '4 h', e.rf || .33, 286, 30);
    return out;
  }
  function luna(txt) {
    return '<circle cx="272" cy="34" r="15" fill="#F2D36B"/><circle cx="279" cy="29" r="13" style="fill:var(--lienzo)"/>' +
      '<g fill="#F2D36B"><circle cx="246" cy="22" r="1.6"/><circle cx="296" cy="52" r="1.4"/><circle cx="254" cy="50" r="1.2"/></g>' +
      '<text x="272" y="76" text-anchor="middle" style="fill:var(--tinta);font:800 15px var(--f-texto)">' + txt + '</text>';
  }

  function escenaRemojo(e, rnd) {
    var out = '<ellipse cx="160" cy="154" rx="86" ry="7" fill="#000" opacity=".08"/><path d="M78 66C82 126 112 150 160 150S238 126 242 66Z" fill="#E8F2FA"/>';
    out += esparce(rnd, { cx: 160, cy: 120, rx: 56, ry: 16 }, lista(e.i), false);
    out += '<path d="M80 80C86 128 114 148 160 148S234 128 240 80Z" fill="#8EC5EA" opacity=".3"/><ellipse cx="160" cy="80" rx="80" ry="13" fill="#BFDDF2" opacity=".7"/>' +
      '<ellipse cx="160" cy="66" rx="82" ry="15" fill="none" style="stroke:var(--vapor)" stroke-width="2"/><path d="M78 66C82 126 112 150 160 150S238 126 242 66" fill="none" style="stroke:var(--vapor)" stroke-width="2"/>';
    out += luna(e.t || '12 h');
    return out;
  }

  function escenaMortero(e, rnd) {
    var out = '<ellipse cx="160" cy="154" rx="66" ry="6" fill="#000" opacity=".1"/><path d="M100 78C104 130 128 150 160 150S216 130 220 78Z" fill="#C9A06A"/>' +
      '<path d="M108 98C116 124 134 134 160 134S204 124 212 98" fill="none" stroke="#B48A55" stroke-width="3"/>' +
      '<ellipse cx="160" cy="78" rx="62" ry="13" fill="#B48A55"/><ellipse cx="160" cy="79" rx="54" ry="10" fill="' + (e.c || '#D9C38A') + '"/>';
    out += esparce(rnd, { cx: 160, cy: 79, rx: 40, ry: 5 }, lista(e.i), true);
    out += '<path d="M206 18 L170 74" stroke="#9A6B3C" stroke-width="13" stroke-linecap="round"/><circle cx="208" cy="15" r="9" fill="#9A6B3C"/>';
    if (e.fuera) out += esparce(rnd, { cx: 64, cy: 138, rx: 36, ry: 10 }, lista(e.fuera), false) + esparce(rnd, { cx: 262, cy: 140, rx: 34, ry: 9 }, lista(e.fuera2 || e.fuera), false);
    if (e.vierte) out += vierte(e.vierte, 214, 60, 76);
    return out;
  }

  function escenaVolteo() {
    return '<ellipse cx="150" cy="150" rx="110" ry="8" fill="#000" opacity=".08"/><use href="#e-v-sarten" x="28" y="96" width="250" height="64" style="--contenido:#E9B44E"/>' +
      '<path d="M78 112c20-6 60-8 96-4" fill="none" stroke="#F6D387" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
      '<ellipse cx="133" cy="70" rx="104" ry="13" fill="#E7E1D4"/><ellipse cx="133" cy="66" rx="104" ry="13" fill="#F7F4EE"/><ellipse cx="133" cy="66" rx="94" ry="10" fill="none" style="stroke:var(--anil)" stroke-width="3"/>' +
      '<g fill="none" style="stroke:var(--anil)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M262 112c34-14 36-58 4-76"/><path d="M276 34l-10 2 4 9"/></g>';
  }

  function escenaFormar(e, rnd) {
    return '<ellipse cx="78" cy="92" rx="60" ry="22" fill="#F7F4EE"/><ellipse cx="78" cy="92" rx="52" ry="18" fill="#EAD7B0"/><path d="M48 90c10-6 30-8 50-4" fill="none" stroke="#F4E6C6" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M140 70c2 14 12 22 26 22s24-8 26-22z" fill="#F6F3EC"/><ellipse cx="166" cy="70" rx="26" ry="7" fill="#F3C43B"/>' +
      '<ellipse cx="250" cy="82" rx="50" ry="17" fill="#F7F4EE"/><ellipse cx="250" cy="81" rx="42" ry="13" fill="#D9B26F"/>' + esparce(rnd, { cx: 250, cy: 81, rx: 34, ry: 8 }, lista([['picatoste', 10, .45]]), false) +
      '<rect x="60" y="128" width="210" height="26" rx="6" fill="#8A909E"/>' + [96, 132, 168, 204, 240].map(function (x, n) { return uso('croqueta', x, 136, 30, 15, n === 4 ? ' opacity=".55"' : ''); }).join('');
  }

  var TIPOS = { fuego: escenaFuego, tabla: escenaTabla, bol: escenaBol, plato: escenaPlato, horno: escenaHorno, nevera: escenaNevera,
    remojo: escenaRemojo, mortero: escenaMortero, volteo: escenaVolteo, formar: escenaFormar };

  function svg(e, etiqueta) {
    e = e || { k: 'plato' };
    var rnd = azar(semilla(JSON.stringify(e)));
    var cuerpo = (TIPOS[e.k] || escenaPlato)(e, rnd);
    return '<svg viewBox="0 0 320 180" role="img" aria-label="' + (etiqueta || '').replace(/"/g, '&quot;') + '">' + cuerpo + '</svg>';
  }

  window.ESC = {
    instala: function () { if (!document.getElementById('esc-sprite')) document.body.insertAdjacentHTML('afterbegin', SPRITE); },
    svg: svg
  };
})();
