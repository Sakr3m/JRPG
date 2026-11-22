/* Logica di combattimento. Non tocca il DOM: parla con l'interfaccia solo tramite R.ui
   (log, fx, renderBattle) e con la storia tramite R.flow (victory, defeat). */
(function (R) {
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  R.DELAY = 650; // pausa prima della mossa del nemico (0 nei test)

  /* ---- nemici ---- */
  function pickEnemy(n) {
    const pool = [];
    R.ENEMIES.forEach(e => {
      if (e.th === 'gen') pool.push(e);
      else if (n.themes && n.themes.includes(e.th)) { pool.push(e); pool.push(e); }
    });
    let e, t = 0;
    do { e = pick(pool); t++; } while (e.name === R.G.lastEnemy && t < 6);
    return e;
  }
  function makeEnemy(base, row, map, boss) {
    const s = Math.max(0, row - 1), sc = map.scale;
    const hp = boss ? base.hp : Math.round(base.hp * (sc.hp[0] + sc.hp[1] * s));
    const atk = boss ? base.atk : Math.round(base.atk * (sc.atk[0] + sc.atk[1] * s));
    return Object.assign({}, base, {
      hp, maxHp: hp, atk, boss: !!boss, burn: null, bleed: null, skip: null,
      guard: false, intent: null, lastGuard: false
    });
  }
  function rollIntent(e, turn) {
    const r = Math.random(); let t;
    if (e.boss) t = (turn % 3 === 0) ? 'heavy' : (r < 0.72 ? 'atk' : 'guard');
    else t = r < 0.6 ? 'atk' : (r < 0.8 ? 'heavy' : 'guard');
    if (t === 'guard' && e.lastGuard) t = 'atk';
    e.lastGuard = (t === 'guard');
    const dmg = Math.round(e.atk * rand(0.9, 1.1) * (t === 'heavy' ? 1.6 : 1));
    e.intent = { t, dmg };
    e.guard = (t === 'guard');
  }
  // sfondo: l'elemento del nemico se ce l'ha, altrimenti il tema del nodo, altrimenti il tronco
  function bgFor(n, e) {
    if (e.elem && e.elem !== 'none') return e.elem;
    return (n.themes && n.themes[0]) || 'trunk';
  }

  /* ---- avvio ---- */
  R.battle = {};
  R.battle.start = function (id) {
    const G = R.G, m = R.curMap(), n = m.nodes[id];
    const isBoss = !!(n.dest || n.boss);
    const base = n.dest ? R.DEST[n.dest].boss : (n.boss ? n.boss : pickEnemy(n));
    const e = makeEnemy(base, n.row, m, isBoss);
    G.lastEnemy = e.name;
    R.B = { e, target: id, turn: 1, ess: 3, cd: 0, shield: 0, defending: false, dodge: false,
            exposed: false, busy: false, over: false, bg: bgFor(n, e) };
    rollIntent(e, 1);
    R.ui.clearLog();
    R.ui.log(isBoss ? e.name + ' ti sbarra la strada!' : e.name + ' appare sul sentiero.', 's');
    R.ui.showBattle();
    R.ui.renderBattle();
  };

  /* ---- calcolo danni ---- */
  function calcWeapon(mult, opts) {
    opts = opts || {};
    const G = R.G, e = R.B.e, w = R.WP[G.wp], tr = R.TRAIT[e.trait];
    let d = rand(w.min, w.max) * mult, note = '';
    if (tr.weak === G.wp) { d *= 1.4; note = 'weak'; }
    else if (tr.res === G.wp) { d *= 0.7; note = 'res'; }
    if (e.guard && !opts.pierce) d *= 0.5;
    return { d: Math.max(1, Math.round(d)), note };
  }
  function calcElem(power, opts) {
    opts = opts || {};
    const G = R.G, e = R.B.e; let m = 1, note = '';
    if (e.elem !== 'none') {
      if (R.BEATS[G.el] === e.elem) { m = 1.5; note = 'weak'; }
      else if (e.elem === G.el) { m = 0.5; note = 'res'; }
      else if (R.BEATS[e.elem] === G.el) { m = 0.75; note = 'res'; }
    }
    let d = power * m * rand(0.92, 1.08);
    if (e.guard && !opts.pierce) d *= 0.5;
    return { d: Math.max(1, Math.round(d)), note };
  }
  const noteTxt = (n) => n === 'weak' ? ' È super efficace!' : (n === 'res' ? ' È poco efficace...' : '');
  function hitEnemy(d, txt, note) {
    const e = R.B.e;
    e.hp = Math.max(0, e.hp - d);
    R.ui.log(txt + ': ' + d + ' danni.' + noteTxt(note) + (e.guard ? ' (la guardia attutisce)' : ''), 'p');
    R.ui.fx('enemy');
  }
  function applyBleed() { const e = R.B.e; if (e.hp > 0) e.bleed = { dmg: 2, turns: 3 }; }

  /* ---- azioni del giocatore ---- */
  R.battle.attack = function () {
    const B = R.B, G = R.G; if (B.busy || B.over) return;
    const w = R.WP[G.wp];
    if (G.wp === 'axe' && Math.random() < 0.25) {
      R.ui.log('Cali l\'ascia con tutta la forza ma manchi il bersaglio!', 'p');
      return afterPlayer();
    }
    const r = calcWeapon(1);
    hitEnemy(r.d, 'Colpisci con ' + w.name, r.note);
    if (G.wp === 'scythe') applyBleed();
    afterPlayer();
  };
  R.battle.tech = function () {
    const B = R.B, G = R.G; if (B.busy || B.over || B.cd > 0) return;
    const w = R.WP[G.wp];
    B.cd = w.tech.cd;
    if (G.wp === 'sword') {
      const a = calcWeapon(0.7), b = calcWeapon(0.7);
      hitEnemy(a.d + b.d, 'Doppio Fendente (' + a.d + ' + ' + b.d + ')', a.note);
    } else if (G.wp === 'spear') {
      const r = calcWeapon(1.5, { pierce: true });
      hitEnemy(r.d, 'Affondo Perforante', r.note);
    } else if (G.wp === 'axe') {
      const r = calcWeapon(2.2);
      hitEnemy(r.d, 'Spaccateschio', r.note);
      B.exposed = true; R.ui.log('Il colpo ti lascia scoperto.', 's');
    } else {
      const e = B.e, low = e.hp / e.maxHp < 0.4;
      const r = calcWeapon(low ? 2.4 : 1.2);
      hitEnemy(r.d, low ? 'Mietitura (colpo di grazia)' : 'Mietitura', r.note);
      applyBleed();
    }
    afterPlayer();
  };
  R.battle.element = function () {
    const B = R.B, G = R.G, ab = R.curAb();
    if (B.busy || B.over || B.ess < ab.cost) return;
    B.ess -= ab.cost;
    const e = B.e, ev = G.evolved;
    if (G.el === 'fire') {
      const r = calcElem(ev ? 22 : 12);
      hitEnemy(r.d, ab.name, r.note);
      if (e.hp > 0) e.burn = ev ? { dmg: 4, turns: 2 } : { dmg: 3, turns: 3 };
      if (ev) { G.hp = Math.max(1, G.hp - 5); R.ui.log('L\'esplosione ti ferisce di 5 HP.', 'e'); }
    } else if (G.el === 'water') {
      const r = calcElem(ev ? 12 : 9);
      hitEnemy(r.d, ab.name, r.note);
      if (!ev) { const h = Math.min(8, G.maxHp - G.hp); G.hp += h; R.ui.log('Ti curi di ' + h + ' HP.', 'p'); }
      else if (e.hp > 0) {
        if (Math.random() < (e.boss ? 0.3 : 0.6)) { e.skip = 'frozen'; R.ui.log(e.name + ' si congela!', 'p'); }
        else R.ui.log(e.name + ' resiste al congelamento.', 's');
      }
    } else if (G.el === 'air') {
      const r = calcElem(ev ? 15 : 10, { pierce: ev });
      hitEnemy(r.d, ab.name, r.note);
      if (!ev) { B.dodge = true; R.ui.log('Il vento ti avvolge: 65% di schivare il prossimo attacco.', 's'); }
      else if (e.hp > 0 && Math.random() < (e.boss ? 0.2 : 0.4)) { e.skip = 'stunned'; R.ui.log(e.name + ' è stordito dalla scarica!', 'p'); }
    } else {
      const r = calcElem(ev ? 13 : 9);
      hitEnemy(r.d, ab.name, r.note);
      const s = ev ? 10 : 4; B.shield += s; R.ui.log('Ottieni uno scudo da ' + s + '.', 'p');
    }
    afterPlayer();
  };
  R.battle.defend = function () {
    const B = R.B; if (B.busy || B.over) return;
    B.defending = true; B.ess = Math.min(5, B.ess + 1);
    R.ui.log('Alzi la guardia e riprendi fiato (+1 ✦).', 'p');
    afterPlayer();
  };

  /* ---- turno del nemico ---- */
  function afterPlayer() {
    R.ui.renderBattle();
    if (R.B.e.hp <= 0) return win();
    R.B.busy = true; R.ui.renderBattle();
    setTimeout(enemyPhase, R.DELAY);
  }
  function win() { R.B.over = true; R.flow.victory(); }
  function lose() { R.B.over = true; R.flow.defeat(); }

  function enemyPhase() {
    const G = R.G, B = R.B, e = B.e;
    [['burn', 'La bruciatura'], ['bleed', 'Il sanguinamento']].forEach(([k, nm]) => {
      const s = e[k];
      if (s && e.hp > 0) {
        e.hp = Math.max(0, e.hp - s.dmg);
        R.ui.log(nm + ' infligge ' + s.dmg + ' danni a ' + e.name + '.', 'p');
        s.turns--; if (s.turns <= 0) e[k] = null;
      }
    });
    if (e.hp <= 0) { R.ui.renderBattle(); return win(); }
    if (e.skip) {
      R.ui.log(e.name + (e.skip === 'frozen' ? ' è congelato' : ' è stordito') + ' e salta il turno.', 'p');
      e.skip = null;
    } else {
      const it = e.intent;
      if (it.t === 'guard') R.ui.log(e.name + ' mantiene la guardia.', 's');
      else {
        let d = it.dmg;
        if (B.exposed) d = Math.round(d * 1.5);
        if (B.defending) d = Math.round(d * 0.5);
        if (B.dodge && Math.random() < 0.65) { R.ui.log('Schivi l\'attacco di ' + e.name + '!', 'p'); d = 0; }
        else {
          const ab = Math.min(B.shield, d); B.shield -= ab; d -= ab;
          G.hp = Math.max(0, G.hp - d);
          R.ui.log(e.name + (it.t === 'heavy' ? ' sferra un colpo pesante' : ' attacca') + ': ' + d + ' danni' +
            (ab > 0 ? ' (scudo assorbe ' + ab + ')' : '') + '.', 'e');
          R.ui.fx('player');
        }
      }
    }
    e.guard = false;
    B.exposed = false; B.dodge = false; B.defending = false;
    if (G.hp <= 0) { R.ui.renderBattle(); return lose(); }
    B.turn++;
    B.ess = Math.min(5, B.ess + 1);
    if (B.cd > 0) B.cd--;
    rollIntent(e, B.turn);
    B.busy = false;
    R.ui.renderBattle();
  }
})(window.R = window.R || {});
