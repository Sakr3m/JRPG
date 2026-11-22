/* Genera le immagini SEGNAPOSTO (SVG) leggendo i dati del gioco, quindi non va mai aggiornato a mano.
   Uso, dalla cartella principale del progetto:   node tools/make_placeholders.js
   Non sovrascrive i file che esistono gia' (cosi' le tue immagini vere restano al loro posto);
   per rigenerare un segnaposto, cancella prima il file. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
['elements', 'weapons', 'enemies', 'maps'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data/' + f + '.js'), 'utf8'), sandbox));
const R = sandbox.window.R;

const FONT = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
const COLORS = { fire: ['#7a2a14', '#e8643a'], earth: ['#4a3a20', '#a98650'], water: ['#16406a', '#4fa3d9'],
                 air: ['#454577', '#c8b6ff'], none: ['#2c3052', '#9aa3d8'], trunk: ['#33280f', '#8a6b34'] };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function write(rel, content) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) return false;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return true;
}

function sprite(e) {
  const [c1, c2] = COLORS[e.elem] || COLORS.none;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">' +
    '<defs><radialGradient id="g" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="' + c2 + '"/><stop offset="1" stop-color="' + c1 + '"/></radialGradient></defs>' +
    '<ellipse cx="128" cy="236" rx="78" ry="12" fill="#000" opacity=".35"/>' +
    '<rect x="36" y="16" width="184" height="212" rx="26" fill="url(#g)" stroke="#fff" stroke-opacity=".7" stroke-width="4" stroke-dasharray="10 8"/>' +
    '<text x="128" y="132" font-size="104" text-anchor="middle" dominant-baseline="central" font-family="' + FONT + '">' + e.icon + '</text>' +
    '<text x="128" y="196" font-size="15" text-anchor="middle" fill="#fff" font-family="sans-serif">' + esc(e.name) + '</text>' +
    '<text x="128" y="214" font-size="11" text-anchor="middle" fill="#fff" opacity=".8" font-family="sans-serif">SEGNAPOSTO</text></svg>';
}

function background(theme) {
  const [c1, c2] = COLORS[theme] || COLORS.none;
  let roots = '';
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 140, s = (i % 2 ? 1 : -1) * 60;
    roots += '<path d="M' + x + ',0 C' + (x + s) + ',150 ' + (x - s) + ',300 ' + (x + s / 2) + ',540" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="' + (10 + (i % 3) * 6) + '"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540" preserveAspectRatio="xMidYMid slice">' +
    '<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '" stop-opacity=".55"/></linearGradient></defs>' +
    '<rect width="960" height="540" fill="url(#b)"/>' + roots +
    '<rect y="450" width="960" height="90" fill="#000" opacity=".3"/>' +
    '<text x="480" y="500" font-size="22" text-anchor="middle" fill="#fff" opacity=".6" font-family="sans-serif">SFONDO SEGNAPOSTO: ' + theme + '</text></svg>';
}

function portrait(id, emoji, label) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">' +
    '<defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4bb0"/><stop offset="1" stop-color="#151d5c"/></linearGradient></defs>' +
    '<rect width="128" height="128" fill="url(#p)"/>' +
    '<text x="64" y="64" font-size="70" text-anchor="middle" dominant-baseline="central" font-family="' + FONT + '">' + emoji + '</text>' +
    '<text x="64" y="118" font-size="10" text-anchor="middle" fill="#fff" opacity=".8" font-family="sans-serif">' + esc(label) + ' (segnaposto)</text></svg>';
}

let n = 0;
const all = [];
R.ENEMIES.forEach(e => all.push(e));
Object.values(R.DEST).forEach(d => { all.push(d.boss); all.push(d.boss2); });
all.forEach(e => { if (write('assets/enemies/' + e.id + '.svg', sprite(e))) n++; });
['trunk', 'fire', 'earth', 'water', 'air'].forEach(t => { if (write('assets/backgrounds/' + t + '.svg', background(t))) n++; });
if (write('assets/portraits/hero.svg', portrait('hero', '🧑', 'Eroe'))) n++;

console.log('Segnaposto creati: ' + n + ' (quelli gia\' presenti non sono stati toccati)');
