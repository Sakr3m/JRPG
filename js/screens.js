/* Schermate e interfaccia: titolo, menu, opzioni, mappa, combattimento. */
(function (X) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TURN_DELAY = 800;   // pausa tra un'azione e l'altra in combattimento
  const MOVE_MS = 520;      // durata dello spostamento sulla mappa
  let G = null;             // partita in corso (null = nessuna)

  /* ---------- schermate ---------- */
  function navItems() {
    const a = $('.screen.active');
    return a ? Array.from(a.querySelectorAll('.item')).filter(b => !b.disabled && !b.closest('[hidden]')) : [];
  }
  X.show = function (id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $('#s-' + id).classList.add('active');
    if (id === 'title') return;
    const first = navItems()[0] || $('#s-' + id + ' .btn');
    if (first) first.focus({ preventScroll: true });
  };

  X.applyLang = function () {
    document.documentElement.lang = X.S.lang;
    $$('[data-i18n]').forEach(el => { el.innerHTML = X.I18N[X.S.lang][el.dataset.i18n]; }); // testi nostri, nessun input utente
    $$('[data-lang]').forEach(b => b.classList.toggle('sel', b.dataset.lang === X.S.lang));
  };
  function applyVolumes() {
    $$('[data-vol]').forEach(inp => {
      const k = inp.dataset.vol;
      inp.value = X.S.vol[k];
      inp.parentElement.querySelector('.val').textContent = X.S.vol[k];
    });
  }

  /* ---------- titolo, menu, opzioni ---------- */
  $('#s-title').addEventListener('click', () => X.show('menu'));
  $$('#s-menu .item').forEach(b => b.addEventListener('mouseenter', () => b.focus({ preventScroll: true })));
  $('#b-new').addEventListener('click', newGame);
  // "Carica partita" per ora non fa nulla
  $('#b-options').addEventListener('click', () => X.show('options'));
  $('#b-back').addEventListener('click', () => X.show('menu'));
  $('#w-menu').addEventListener('click', () => X.show('menu'));

  $$('[data-lang]').forEach(b => b.addEventListener('click', () => { X.S.lang = b.dataset.lang; X.saveSettings(); X.applyLang(); }));
  $$('[data-vol]').forEach(inp => inp.addEventListener('input', () => {
    X.S.vol[inp.dataset.vol] = +inp.value;
    inp.parentElement.querySelector('.val').textContent = inp.value;
    X.saveSettings();
  }));

  document.addEventListener('keydown', (e) => {
    const active = ($('.screen.active') || {}).id;
    if (active === 's-title' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); X.show('menu'); return; }
    if (e.key === 'Escape' && (active === 's-options' || active === 's-world')) { X.show('menu'); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const b = navItems(); if (!b.length) return;
      e.preventDefault();
      const i = b.indexOf(document.activeElement);
      b[(i + (e.key === 'ArrowDown' ? 1 : -1) + b.length) % b.length].focus();
    }
  });

  /* ---------- nuova partita ---------- */
  function makeMember(id) {
    const c = X.CHARACTERS[id];
    return { id, name: c.name, lvl: c.lvl, hp: c.maxHp, maxHp: c.maxHp, atk: c.atk };
  }
  function newGame() {
    G = { party: [makeMember('xeron')], pos: X.WORLD.start, done: {}, moving: false, bt: null };
    renderWorld();
    X.show('world');
  }
  const healAll = () => G.party.forEach(m => { m.hp = m.maxHp; }); // provvisorio: dopo ogni scontro si torna in forma

  /* ---------- mappa ---------- */
  function adjacent(a, b) { return X.WORLD.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }

  function renderWorld() {
    const W = X.WORLD; let h = '';
    W.edges.forEach(([a, b]) => {
      const A = W.nodes[a], B = W.nodes[b];
      h += '<line class="w-edge" x1="' + A.x + '" y1="' + A.y + '" x2="' + B.x + '" y2="' + B.y + '"/>';
    });
    Object.entries(W.nodes).forEach(([id, n]) => {
      const done = !!G.done[id], go = id !== G.pos && adjacent(G.pos, id);
      h += '<g class="w-node' + (done ? ' done' : '') + (go ? ' go' : '') + '" data-id="' + id + '">' +
        '<circle class="base" cx="' + n.x + '" cy="' + n.y + '" r="30"/>' +
        '<text x="' + n.x + '" y="' + (n.y + 1) + '">' + (done ? '✔' : id) + '</text></g>';
    });
    const p = W.nodes[G.pos];
    h += '<g id="marker" style="transform:translate(' + p.x + 'px,' + p.y + 'px)">' +
      '<circle class="ring" r="42"/><polygon class="dot" points="-9,-66 9,-66 0,-52"/></g>';
    $('#world').innerHTML = h;
  }

  $('#world').addEventListener('click', (e) => {
    const g = e.target.closest('.w-node.go');
    if (g && G && !G.moving) moveTo(g.dataset.id);
  });

  function moveTo(id) {
    const n = X.WORLD.nodes[id];
    G.moving = true;
    $('#marker').style.transform = 'translate(' + n.x + 'px,' + n.y + 'px)';
    setTimeout(() => {
      const prev = G.pos;
      G.pos = id; G.moving = false;
      if (n.type === 'fight' && !G.done[id]) startBattle(id, prev);
      else renderWorld();
    }, MOVE_MS);
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }
  function backToWorld(msg) {
    G.bt = null;
    renderWorld();
    X.show('world');
    if (msg) toast(msg);
  }

  /* ---------- combattimento ---------- */
  const say = (msg) => { $('#b-msg').textContent = msg; };
  const mName = () => X.t('monster.' + G.bt.b.monster.id);
  function flash(sel, cls) {
    const el = $(sel); if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 450);
  }
  function setCmds(on) {
    G.bt.busy = !on;
    $('#c-attack').disabled = !on; $('#c-flee').disabled = !on;
    if (on) $('#c-attack').focus({ preventScroll: true });
  }

  function renderBars() {
    const m = G.bt.b.monster;
    $('#m-hpbar').style.width = (m.hp / m.maxHp * 100) + '%';
    $('#m-hptxt').textContent = m.hp + '/' + m.maxHp;
  }
  function renderTeam() {
    let h = '';
    for (let i = 0; i < X.TEAM_MAX; i++) {
      const m = G.party[i];
      if (m) {
        h += '<div class="trow" data-i="' + i + '"><div class="avatar">' + esc(m.name[0]) + '</div><div class="tinfo">' +
          '<div class="tname">' + esc(m.name) + '<span class="lv">' + X.t('lv') + ' ' + m.lvl + '</span></div>' +
          '<div class="bar"><i style="width:' + (m.hp / m.maxHp * 100) + '%"></i><span>' + m.hp + '/' + m.maxHp + '</span></div></div></div>';
      } else {
        h += '<div class="trow empty"><div class="avatar">·</div><div class="tinfo">' + X.t('empty') + '</div></div>';
      }
    }
    $('#team').innerHTML = h;
  }
  const firstAlive = () => G.party.find(m => m.hp > 0);

  function startBattle(id, prev) {
    const node = X.WORLD.nodes[id];
    G.bt = { id, prev, b: X.Battle.create(G.party, X.MONSTERS[node.monster]), busy: true, result: null };
    $('#m-art').className = 'monster';
    $('#m-art').innerHTML = X.ART[G.bt.b.monster.art];
    $('#m-name').textContent = mName();
    $('#cmd-main').hidden = false; $('#cmd-end').hidden = true;
    renderBars(); renderTeam();
    say(X.t('appears', { m: mName() }));
    X.show('battle');
    setCmds(false);
    setTimeout(() => { say(X.t('yourTurn', { who: firstAlive().name })); setCmds(true); }, TURN_DELAY);
  }

  function attack() {
    const bt = G && G.bt; if (!bt || bt.busy) return;
    setCmds(false);
    const who = firstAlive();
    const r = X.Battle.playerAttack(bt.b, who);
    say(X.t('playerHit', { who: who.name, dmg: r.dmg }));
    flash('#m-art', 'hit'); renderBars();
    if (X.Battle.isWon(bt.b)) return setTimeout(win, TURN_DELAY);
    setTimeout(monsterTurn, TURN_DELAY);
  }
  function monsterTurn() {
    const bt = G.bt;
    const r = X.Battle.monsterAttack(bt.b);
    say(X.t('monsterHit', { m: mName(), who: r.target.name, dmg: r.dmg }));
    renderTeam();
    flash('.trow[data-i="' + G.party.indexOf(r.target) + '"]', 'hurt');
    if (X.Battle.isLost(bt.b)) return setTimeout(lose, TURN_DELAY);
    setTimeout(() => { say(X.t('yourTurn', { who: firstAlive().name })); setCmds(true); }, TURN_DELAY);
  }
  function showEnd() {
    $('#cmd-main').hidden = true; $('#cmd-end').hidden = false;
    $('#c-continue').focus({ preventScroll: true });
  }
  function win() {
    G.bt.result = 'win';
    $('#m-art').classList.add('dead');
    say(X.t('win'));
    showEnd();
  }
  function lose() {
    G.bt.result = 'lose';
    say(X.t('lost', { who: G.party[0].name }));
    showEnd();
  }
  // fuga: riesce sempre, ma il livello non viene considerato completato
  function flee() {
    const bt = G && G.bt; if (!bt || bt.busy) return;
    G.pos = bt.prev;
    backToWorld(X.t('toastFled'));
  }
  function goOn() {
    const bt = G.bt; if (!bt || !bt.result) return;
    if (bt.result === 'win') { G.done[bt.id] = true; G.pos = bt.id; healAll(); backToWorld(X.t('toastWin')); }
    else { G.pos = bt.prev; healAll(); backToWorld(X.t('toastLost')); }
  }

  $('#c-attack').addEventListener('click', attack);
  $('#c-flee').addEventListener('click', flee);
  $('#c-continue').addEventListener('click', goOn);
  $$('.item.cmd').forEach(b => b.addEventListener('mouseenter', () => { if (!b.disabled) b.focus({ preventScroll: true }); }));

  /* ---------- avvio ---------- */
  X.applyLang();
  applyVolumes();
})(window.X = window.X || {});
