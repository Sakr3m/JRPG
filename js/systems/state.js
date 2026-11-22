/* Stato della partita e salvataggio. R.G = partita, R.B = battaglia in corso. */
(function (R) {
  const KEY = 'radici.save.v1';
  R.G = null;
  R.B = null;

  R.curMap = () => R.MAPS[R.G.map];
  R.curAb = () => (R.G.evolved ? R.EL[R.G.el].evo : R.EL[R.G.el].base);
  R.curIcon = () => (R.G.evolved ? R.EL[R.G.el].evoIcon : R.EL[R.G.el].icon);
  R.curName = () => (R.G.evolved ? R.EL[R.G.el].evoName : R.EL[R.G.el].name);

  R.newGame = function (name, el, wp) {
    R.G = {
      name: name || 'Viandante', el, wp, evolved: false, hp: 70, maxHp: 70, wins: 0, falls: 0,
      map: 'atto1', node: 'S', visited: new Set(['S']), nodeIcon: {}, lastEnemy: null,
      flags: {}, done: []
    };
    R.B = null;
    R.clearSave();
  };

  /* ---- salvataggio (localStorage, con numero di versione per le migrazioni future) ---- */
  R.save = function () {
    if (!R.G) return;
    try {
      const g = Object.assign({}, R.G, { visited: Array.from(R.G.visited) });
      localStorage.setItem(KEY, JSON.stringify({ v: 1, g }));
    } catch (e) { /* storage non disponibile: si gioca lo stesso */ }
  };
  R.hasSave = function () {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  };
  R.load = function () {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (!raw || raw.v !== 1 || !R.MAPS[raw.g.map]) return false;
      raw.g.visited = new Set(raw.g.visited);
      R.G = raw.g; R.B = null;
      return true;
    } catch (e) { return false; }
  };
  R.clearSave = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignora */ }
  };
})(window.R = window.R || {});
