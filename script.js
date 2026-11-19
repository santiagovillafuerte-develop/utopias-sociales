// ===== Configuración: cuánto hay que ver para abrir el cuestionario =====
const REQ = {lect:7, red:8, tl:8};
const vis = {lect:new Set(), red:new Set(), tl:new Set()};
const $ = s => document.querySelector(s);

// ===== Red histórica =====
// tipos: c=causa, a=actor, e=acontecimiento, s=consecuencia
const N = [
 ['ind','c','Revolución Industrial','Cambió la economía de Europa: fábricas, ciudades y una clase obrera con salarios bajos y jornadas largas. Fue el terreno donde nació la crítica socialista.'],
 ['utop','c','Socialismo utópico','Saint-Simon, Fourier y Owen imaginaron comunidades ideales, sin explotación. Marx y Engels los criticaron por no basarse en la lucha de clases.'],
 ['zar','c','Autocracia zarista','Régimen donde el zar concentraba el poder y casi no había libertades políticas. Cerraba los caminos de reforma pacífica.'],
 ['camp','c','Problema campesino','La mayoría de los rusos eran campesinos con poca tierra y deudas desde la abolición de la servidumbre (1861). Querían tierra.'],
 ['guerra','c','1ª Guerra Mundial','Derrotas, millones de muertos, hambre e inflación. Terminó de desgastar al zar y después al Gobierno Provisional.'],
 ['marx','a','Marx y Engels','Autores del Manifiesto Comunista (1848) y de El Capital. Plantearon la lucha de clases y el comunismo como meta.'],
 ['lenin','a','Lenin','Líder bolchevique. Defendió un partido de revolucionarios profesionales y adaptó el marxismo a Rusia. Dirigió el primer gobierno soviético.'],
 ['bol','a','Bolcheviques','Fracción del partido socialdemócrata ruso liderada por Lenin. Tomaron el poder en octubre de 1917.'],
 ['gp','a','Gob. Provisional','Gobierno liberal que reemplazó al zar en 1917. Siguió en la guerra y no resolvió el tema de la tierra, por eso perdió apoyo.'],
 ['nic','a','Nicolás II','Último zar de Rusia. Abdicó en 1917 y fue ejecutado en 1918.'],
 ['troz','a','Trotsky','Dirigente bolchevique. Organizó la toma del poder en octubre y después creó el Ejército Rojo.'],
 ['sta','a','Stalin','Se impuso tras la muerte de Lenin (1924). Impulsó la industrialización forzada, la colectivización y el Gran Terror.'],
 ['sov','a','Soviets','Consejos de obreros, soldados y campesinos. Aparecieron en 1905 y fueron la base del poder revolucionario en 1917.'],
 ['man','e','Manifiesto (1848)','Texto de Marx y Engels que resume su teoría: la historia es lucha de clases y el proletariado debe hacer la revolución.'],
 ['r05','e','Revolución de 1905','Huelgas, soviets y el Domingo Sangriento tras la derrota ante Japón. El zar concedió una Duma, pero conservó el poder.'],
 ['feb','e','Rev. de Febrero 1917','Protestas en Petrogrado, soldados que se suman y abdicación de Nicolás II. Termina el zarismo.'],
 ['oct','e','Rev. de Octubre 1917','Los bolcheviques toman el Palacio de Invierno y derriban al Gobierno Provisional. Decretan paz y reparto de tierras.'],
 ['civil','e','Guerra civil rusa','Entre 1918 y 1921, rojos contra blancos. Se aplicó el comunismo de guerra y la Cheka reprimió a opositores.'],
 ['ps','s','Estado de partido único','El Partido Comunista controló todo el Estado y los soviets perdieron poder real. Es lo contrario de un comunismo sin Estado.'],
 ['nep','s','NEP (1921)','Nueva Política Económica: permitió pequeño comercio y propiedad campesina para recuperar la economía tras la guerra civil.'],
 ['col','s','Colectivización forzada','Desde 1929 Stalin obligó a los campesinos a entrar en granjas colectivas y a industrializar a toda velocidad. Hubo hambrunas muy graves.'],
 ['terr','s','Gran Terror','Purgas y juicios entre 1936 y 1938 con cientos de miles de ejecutados y muchos más enviados a campos de trabajo.'],
 ['fria','s','Guerra Fría','La URSS se convirtió en superpotencia y en modelo para otros países, enfrentada a Estados Unidos y al capitalismo.']
];
const E = [['ind','utop'],['ind','marx'],['utop','marx'],['marx','man'],['marx','lenin'],['zar','r05'],['camp','r05'],['zar','nic'],['nic','r05'],['r05','feb'],['guerra','feb'],['nic','feb'],['feb','gp'],['feb','sov'],['sov','oct'],['gp','oct'],['lenin','bol'],['bol','oct'],['troz','oct'],['camp','oct'],['oct','civil'],['bol','civil'],['troz','civil'],['civil','nep'],['lenin','nep'],['civil','ps'],['ps','sta'],['sta','col'],['sta','terr'],['col','terr'],['ps','fria'],['oct','fria']];
const colores = {c:'#c9d6e8',a:'#f3d9a4',e:'#e8b4b4',s:'#bfe0c4'};
const nombres = {c:'Causa',a:'Actor',e:'Acontecimiento',s:'Consecuencia'};
const X = {c:10,a:232,e:454,s:676}, W = 174, H = 38, pos = {};
['c','a','e','s'].forEach(t => {
  const l = N.filter(n => n[1] == t), gap = 540 / l.length;
  l.forEach((n,i) => pos[n[0]] = {x:X[t], y:10 + i*gap + (gap-H)/2});
});
const cx = id => pos[id].x + W/2, cy = id => pos[id].y + H/2;
let html = E.map(e => `<line data-a="${e[0]}" data-b="${e[1]}" x1="${cx(e[0])}" y1="${cy(e[0])}" x2="${cx(e[1])}" y2="${cy(e[1])}"/>`).join('');
html += N.map(n => `<g class="nodo" data-id="${n[0]}"><rect x="${pos[n[0]].x}" y="${pos[n[0]].y}" width="${W}" height="${H}" rx="6" fill="${colores[n[1]]}"/><text x="${cx(n[0])}" y="${cy(n[0])+4}" text-anchor="middle">${n[2]}</text></g>`).join('');
$('#svg').innerHTML = html;

function elegir(id) {
  const n = N.find(x => x[0] == id);
  const vecinos = new Set([id]);
  E.forEach(e => { if (e[0]==id) vecinos.add(e[1]); if (e[1]==id) vecinos.add(e[0]); });
  document.querySelectorAll('.nodo').forEach(g => {
    g.classList.toggle('dim', !vecinos.has(g.dataset.id));
    g.classList.toggle('sel', g.dataset.id == id);
  });
  document.querySelectorAll('line').forEach(l => {
    const on = l.dataset.a == id || l.dataset.b == id;
    l.classList.toggle('on', on);
    l.classList.toggle('dim', !on);
  });
  const rel = [...vecinos].filter(v => v != id).map(v => N.find(x => x[0]==v)[2]).join(', ');
  $('#info').innerHTML = `<b>${n[2]}</b> (${nombres[n[1]]})<br>${n[3]}<br><small><b>Se conecta con:</b> ${rel}</small>`;
  vis.red.add(id); avance();
}
document.querySelectorAll('.nodo').forEach(g => g.onclick = () => elegir(g.dataset.id));

// ===== Lectura =====
document.querySelectorAll('#lectura details').forEach((d,i) => d.addEventListener('toggle', () => { if (d.open) { vis.lect.add(i); avance(); } }));

// ===== Línea de tiempo =====
const T = [
 ['1825','Owen funda New Harmony','El empresario Robert Owen intentó crear en Estados Unidos una comunidad ideal. Fracasó en pocos años, pero es de los ejemplos más conocidos de utopía social.'],
 ['1848','Manifiesto Comunista','Marx y Engels publican el Manifiesto en un año de revoluciones en Europa.'],
 ['1861','Fin de la servidumbre','El zar Alejandro II abole la servidumbre, pero los campesinos siguen con deudas y poca tierra.'],
 ['1864','Primera Internacional','Se crea la Asociación Internacional de los Trabajadores, donde participó Marx.'],
 ['1867','El Capital','Marx publica el primer tomo de El Capital, donde explica la plusvalía.'],
 ['1903','Bolcheviques y mencheviques','El partido socialdemócrata ruso se divide por cómo debía organizarse el partido.'],
 ['1905','Revolución de 1905','Domingo Sangriento, huelgas y primeros soviets. El zar acepta crear una Duma.'],
 ['1914','Primera Guerra Mundial','Rusia entra a la guerra y sufre derrotas, hambre y crisis.'],
 ['Feb 1917','Cae el zar','Protestas en Petrogrado y abdicación de Nicolás II. Se forma el Gobierno Provisional.'],
 ['Abr 1917','Tesis de Abril','Lenin vuelve a Rusia y propone "Paz, pan y tierra" y todo el poder a los soviets.'],
 ['Oct 1917','Toma del poder','Los bolcheviques toman el Palacio de Invierno (7 de noviembre en calendario gregoriano).'],
 ['1918','Brest-Litovsk y guerra civil','Rusia sale de la guerra con una paz muy dura y empieza la guerra civil entre rojos y blancos.'],
 ['1921','Kronstadt y NEP','Rebelión de marineros en Kronstadt y cambio a la Nueva Política Económica.'],
 ['1922','Nace la URSS','Se funda la Unión de Repúblicas Socialistas Soviéticas.'],
 ['1924','Muere Lenin','Empieza la lucha por la sucesión entre Stalin y Trotsky, entre otros.'],
 ['1929','Colectivización','Stalin lanza la colectivización forzada y los planes quinquenales (el primero desde 1928).'],
 ['1936','Gran Terror','Purgas y juicios que duran hasta 1938.'],
 ['1991','Fin de la URSS','La Unión Soviética se disuelve y termina la Guerra Fría.']
];
$('#tl').innerHTML = T.map((t,i) => `<button data-i="${i}"><b>${t[0]}</b><br>${t[1]}</button>`).join('');
document.querySelectorAll('#tl button').forEach(b => b.onclick = () => {
  const t = T[b.dataset.i];
  document.querySelectorAll('#tl button').forEach(x => x.classList.remove('act'));
  b.classList.add('act','vis');
  $('#tinfo').innerHTML = `<b>${t[0]}: ${t[1]}</b><br>${t[2]}`;
  vis.tl.add(+b.dataset.i); avance();
});

// ===== Avance y cuestionario =====
let abierto = false;
function avance() {
  const v = $('#vidchk').checked;
  const items = [
    ['Lectura: ' + vis.lect.size + ' de ' + REQ.lect + ' secciones', vis.lect.size >= REQ.lect],
    ['Red: ' + vis.red.size + ' de ' + REQ.red + ' nodos', vis.red.size >= REQ.red],
    ['Videos: marcar que ya los viste', v],
    ['Línea de tiempo: ' + vis.tl.size + ' de ' + REQ.tl + ' fechas', vis.tl.size >= REQ.tl]
  ];
  $('#prog').innerHTML = items.map(i => `<li>${i[1] ? '✅' : '⬜'} ${i[0]}</li>`).join('');
  if (!abierto && items.every(i => i[1])) { abierto = true; $('#lock').hidden = true; $('#quizbox').hidden = false; armarQuiz(); }
}
$('#vidchk').onchange = avance;
avance();

const Q = [
 ['Según el libro, ¿quién "bautizó" como utópicos a Owen y a Saint-Simon?',['Engels','Lenin','Proudhon','Bismarck'],0],
 ['¿Qué obra de Marx y Engels, escrita con motivo de la revolución de 1848, termina con "Proletarios de todos los países: uníos"?',['El Capital','Manifiesto Comunista','Qué hacer','Miseria de la filosofía'],1],
 ['¿Qué significa "bolchevique"?',['Mayoritario','Minoritario','Campesino','Consejo obrero'],0],
 ['Según Hubeñák, ¿qué pretendió el "golpe de estado" de febrero de 1917?',['Instaurar la dictadura del proletariado','Conformar una monarquía constitucional','Crear la URSS','Volver a la servidumbre'],1],
 ['¿Quiénes lideraron la revolución de octubre de 1917, según el libro?',['Lenin y Trotski','Stalin y Kruschov','Bakunin y Proudhon','Lassalle y Bismarck'],0],
 ['¿Qué medida impulsó Stalin en el campo?',['Reparto de tierras privadas','Colectivización forzada','Vuelta a la servidumbre','Cooperativas voluntarias'],1],
 ['¿En qué año se creó la URSS?',['1905','1917','1922','1936'],2]
];
let puntos = 0, resp = 0;
function armarQuiz() {
  const box = $('#quizbox');
  box.innerHTML = Q.map((q,i) => `<div class="q"><b>${i+1}. ${q[0]}</b>` + q[1].map((o,j) => `<button class="op" data-q="${i}" data-o="${j}">${o}</button>`).join('') + `<small id="f${i}"></small></div>`).join('') + '<div class="caja" id="res"></div>';
  box.querySelectorAll('.op').forEach(b => b.onclick = () => {
    const i = +b.dataset.q, j = +b.dataset.o, bien = Q[i][2];
    box.querySelectorAll(`[data-q="${i}"]`).forEach(x => { x.disabled = true; if (+x.dataset.o == bien) x.classList.add('ok'); });
    if (j == bien) { puntos++; $('#f'+i).textContent = '¡Correcto!'; } else { b.classList.add('mal'); $('#f'+i).textContent = 'Incorrecto, revisá la lectura.'; }
    if (++resp == Q.length) $('#res').innerHTML = `<b>Sacaste ${puntos} de ${Q.length}.</b> ${puntos >= 5 ? 'Muy bien, ya podés pasar a las conclusiones.' : 'Volvé a la lectura y a la línea de tiempo, y probá de nuevo recargando la página.'}`;
  });
}
