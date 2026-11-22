/* Flusso del gioco: storia, vittorie, sconfitte, passaggio da un atto all'altro. */
(function (R) {
  R.flow = {};

  const fill = (s) => (s || '').replace(/\{nome\}/g, R.G ? R.G.name : '');

  // mostra una scena di storia (una sola volta per partita se once = true), poi chiama done
  R.flow.scene = function (key, done, once) {
    const lines = R.STORY[key];
    if (!lines || (once && R.G.flags[key])) return done();
    if (once) R.G.flags[key] = true;
    R.dialog.play(lines.map(l => ({ who: fill(l.who), portrait: l.portrait, text: fill(l.text) })), done);
  };

  R.flow.begin = function () {
    R.flow.scene('intro', R.ui.goMap, true);
  };

  R.flow.enterNode = function (id) {
    const n = R.curMap().nodes[id];
    const go = () => R.battle.start(id);
    if (n.pre) R.flow.scene(n.pre, go, true); else go();
  };

  R.flow.victory = function () {
    const G = R.G, B = R.B, e = B.e, m = R.curMap(), n = m.nodes[B.target];
    G.wins++;
    const heal = Math.min(20, G.maxHp - G.hp); G.hp += heal;
    G.node = B.target; G.visited.add(G.node); G.nodeIcon[G.node] = e.icon;
    let html = '<p>' + e.icon + ' ' + e.name + ' è stato sconfitto.</p><p class="good">+' + heal + ' HP</p>';
    if (!G.evolved && G.wins >= 3) {
      G.evolved = true; G.maxHp += 10; G.hp = Math.min(G.maxHp, G.hp + 10);
      const el = R.EL[G.el];
      html += '<p><b>Il tuo elemento si evolve!</b><br>' + el.icon + ' ' + el.name + ' diventa ' + el.evoIcon + ' ' + el.evoName + '.</p>' +
        '<p><b>' + el.evo.name + '</b> (' + el.evo.cost + ' ✦): ' + el.evo.desc + '</p><p class="good">+10 HP massimi</p>';
    } else if (!G.evolved) {
      html += '<p class="mute">Evoluzione dell\'elemento: ' + G.wins + '/3 vittorie.</p>';
    }
    const isBoss1 = !!n.dest, isBoss2 = !!n.boss;
    const next = () => {
      R.B = null;
      if (isBoss1) R.flow.afterBoss1(n.dest);
      else if (isBoss2) R.flow.afterBoss2(m.dest);
      else R.ui.goMap();
    };
    R.ui.renderHud();
    setTimeout(() => R.ui.modal(isBoss1 || isBoss2 ? 'Boss sconfitto!' : 'Vittoria!', html, [['Avanti', next]]), R.DELAY ? 250 : 0);
  };

  R.flow.defeat = function () {
    const G = R.G, B = R.B;
    setTimeout(() => R.ui.modal('Sei caduto...',
      '<p>' + B.e.name + ' ti ha messo al tappeto.</p><p class="mute">Puoi rialzarti al nodo precedente con metà dei tuoi HP, oppure ricominciare da zero.</p>',
      [['Rialzati', () => { G.falls++; G.hp = Math.ceil(G.maxHp / 2); R.B = null; R.ui.goMap(); }],
       ['Nuovo personaggio', R.flow.toCreate]]), R.DELAY ? 250 : 0);
  };

  R.flow.toCreate = function () { R.G = null; R.B = null; R.ui.renderHud(); R.ui.showScreen('create'); R.ui.refreshCreate(); };

  /* fine Atto I: si scende nell'Atto II della radice scelta */
  R.flow.afterBoss1 = function (dk) {
    const G = R.G;
    R.flow.scene('bossOutro.' + dk, () => {
      if (G.done.indexOf(dk) < 0) G.done.push(dk);
      G.map = 'atto2_' + dk; G.node = 'S'; G.visited = new Set(['S']); G.nodeIcon = {};
      G.maxHp += 10; G.hp = G.maxHp;
      R.flow.scene('atto2.' + dk + '.enter', R.ui.goMap, false);
    }, false);
  };

  /* fine Atto II: per ora e' la fine del prototipo */
  R.flow.afterBoss2 = function (dk) {
    const G = R.G;
    R.flow.scene('atto2.' + dk + '.end', () => {
      R.ui.modal('Fine della bozza',
        '<p>Hai completato la radice <b>' + R.DEST[dk].name + '</b> in due atti.</p>' +
        '<p class="mute">Nemici sconfitti: ' + G.wins + ' | Cadute: ' + G.falls + ' | Radici completate: ' + G.done.length + '/4</p>',
        [['Torna al tronco (stesso personaggio)', () => {
          G.map = 'atto1'; G.node = 'S'; G.visited = new Set(['S']); G.nodeIcon = {}; G.hp = G.maxHp; R.ui.goMap();
        }], ['Nuovo personaggio', R.flow.toCreate]]);
    }, false);
  };
})(window.R = window.R || {});
