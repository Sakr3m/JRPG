/* Dati del gioco: personaggi, mostri, mappa. Si cambiano qui senza toccare la logica. */
(function (X) {

  /* ---- personaggi giocabili (nel team ne entrano al massimo 3) ---- */
  X.TEAM_MAX = 3;
  X.CHARACTERS = {
    xeron: { name: 'Xeron', lvl: 1, maxHp: 50, atk: [7, 11] } // atk = danno minimo e massimo
  };

  /* ---- mostri ---- */
  X.MONSTERS = {
    dustHound: { id: 'dustHound', hp: 40, atk: [3, 6], art: 'dustHound' }
  };

  /* ---- mappa ad albero: ogni nodo ha un padre (da dove si arriva). I figli sono le strade davanti.
          Il giocatore vede solo il nodo in cui si trova, la strada dietro e i nodi subito davanti: il resto resta nascosto. ---- */
  X.WORLD = {
    start: 'A',
    nodes: {
      A: { parent: null, type: 'start' },
      B: { parent: 'A', type: 'fight', monster: 'dustHound' },
      C: { parent: 'B', type: 'fight', monster: 'dustHound' },
      D: { parent: 'B', type: 'fight', monster: 'dustHound' },
      E: { parent: 'C', type: 'fight', monster: 'dustHound' }
    }
  };

  /* ---- grafica provvisoria dei mostri (SVG) ---- */
  X.ART = {
    dustHound:
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="hb" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#6b5443"/><stop offset="1" stop-color="#2a201a"/></radialGradient></defs>' +
      '<ellipse cx="100" cy="184" rx="64" ry="9" fill="#000" opacity=".4"/>' +
      '<polygon points="50,74 60,28 80,66" fill="#5a4636" stroke="#1a1411" stroke-width="3" stroke-linejoin="round"/>' +
      '<polygon points="84,60 100,10 116,60" fill="#5a4636" stroke="#1a1411" stroke-width="3" stroke-linejoin="round"/>' +
      '<polygon points="120,66 140,28 150,74" fill="#5a4636" stroke="#1a1411" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="50" y="142" width="26" height="40" rx="9" fill="#2c231f" stroke="#1a1411" stroke-width="3"/>' +
      '<rect x="124" y="142" width="26" height="40" rx="9" fill="#2c231f" stroke="#1a1411" stroke-width="3"/>' +
      '<path d="M38,122 C38,56 162,56 162,122 C162,162 140,174 100,174 C60,174 38,162 38,122 Z" fill="url(#hb)" stroke="#1a1411" stroke-width="4"/>' +
      '<path d="M70,86 L84,100 M130,86 L116,100" stroke="#1a1411" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="108" rx="15" ry="11" fill="#140a06"/><ellipse cx="128" cy="108" rx="15" ry="11" fill="#140a06"/>' +
      '<circle cx="72" cy="108" r="7" fill="#ffb347"/><circle cx="128" cy="108" r="7" fill="#ffb347"/>' +
      '<circle cx="74" cy="108" r="3" fill="#2a0e00"/><circle cx="126" cy="108" r="3" fill="#2a0e00"/>' +
      '<path d="M62,140 Q100,128 138,140 L138,146 Q100,134 62,146 Z" fill="#140a06"/>' +
      '<polygon points="66,142 74,156 82,141 90,157 98,141 106,157 114,141 122,156 130,141 136,146 64,146" fill="#efe6d2" stroke="#1a1411" stroke-width="2" stroke-linejoin="round"/>' +
      '</svg>'
  };
})(window.X = window.X || {});
