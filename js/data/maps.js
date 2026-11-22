/* Mappe a nodi. Ogni mappa e' un albero: S = nodo di partenza, kids = nodi successivi.
   Atto I  (atto1): dal tronco alle 4 radici, ognuna con la sua destinazione e il suo boss.
   Atto II (atto2_D1..D4): una mappa per ogni radice, generata dal modello qui sotto.
   Per i nodi: themes = temi dei nemici estraibili, pre = chiave della storia da mostrare prima dello scontro,
   dest = nodo boss dell'Atto I, boss = nodo boss dell'Atto II. */
(function (R) {

  /* ---- Destinazioni (fine Atto I) ed estensioni per l'Atto II ---- */
  R.DEST = {
    D1: {
      name: 'Fornace Dimenticata', icon: '🌋', theme: 'fire', desc: 'Boss di Fuoco, debole all\'Acqua.',
      boss:  { id: 're-cenere', name: 'Re della Cenere', icon: '👑', hp: 90, atk: 9, elem: 'fire', trait: 'Spettrale' },
      name2: 'Il Cuore della Fornace',
      boss2: { id: 'custode-brace', name: 'Custode della Brace', icon: '🔥', hp: 100, atk: 10, elem: 'fire', trait: 'Corazzato' }
    },
    D2: {
      name: 'Cripta di Pietra', icon: '🗿', theme: 'earth', desc: 'Boss di Terra, debole al Fuoco.',
      boss:  { id: 'colosso-granito', name: 'Colosso di Granito', icon: '🗿', hp: 95, atk: 9, elem: 'earth', trait: 'Corazzato' },
      name2: 'Le Gallerie Sepolte',
      boss2: { id: 'guardiano-sepolcro', name: 'Guardiano del Sepolcro', icon: '🏛️', hp: 105, atk: 10, elem: 'earth', trait: 'Coriaceo' }
    },
    D3: {
      name: 'Laghi Sommersi', icon: '🐙', theme: 'water', desc: 'Boss di Acqua, debole all\'Aria.',
      boss:  { id: 'leviatano', name: 'Leviatano delle Profondità', icon: '🐙', hp: 90, atk: 9, elem: 'water', trait: 'Coriaceo' },
      name2: 'Gli Abissi Neri',
      boss2: { id: 'sovrano-abissi', name: 'Sovrano degli Abissi', icon: '🦈', hp: 100, atk: 10, elem: 'water', trait: 'Agile' }
    },
    D4: {
      name: 'Cime Tempestose', icon: '🐲', theme: 'air', desc: 'Boss di Aria, debole alla Terra.',
      boss:  { id: 'signore-venti', name: 'Signore dei Venti', icon: '🐲', hp: 85, atk: 10, elem: 'air', trait: 'Agile' },
      name2: 'Oltre la Tempesta',
      boss2: { id: 'araldo-tempesta', name: 'Araldo della Tempesta', icon: '🌩️', hp: 95, atk: 11, elem: 'air', trait: 'Spettrale' }
    }
  };

  /* ---- Atto I ---- */
  const atto1 = {
    id: 'atto1', title: 'Atto I: Le Radici', w: 800, h: 790, start: 'S', trunkRows: 2,
    scale: { hp: [1, 0.07], atk: [1, 0.05] }, // moltiplicatore = base + passo * (riga - 1)
    nodes: {
      S:   { x: 400, y: 50,  row: 0, kids: ['T1'], name: 'Il Tronco', icon: '🌳' },
      T1:  { x: 400, y: 145, row: 1, kids: ['T2'], themes: [], pre: 'trunk' },
      T2:  { x: 400, y: 240, row: 2, kids: ['L', 'R'], themes: [] },
      L:   { x: 230, y: 335, row: 3, kids: ['L1'], themes: ['fire', 'earth'] },
      R:   { x: 570, y: 335, row: 3, kids: ['R1'], themes: ['water', 'air'] },
      L1:  { x: 230, y: 430, row: 4, kids: ['LA', 'LB'], themes: ['fire', 'earth'] },
      R1:  { x: 570, y: 430, row: 4, kids: ['RA', 'RB'], themes: ['water', 'air'] },
      LA:  { x: 115, y: 525, row: 5, kids: ['LA1'], themes: ['fire'],  pre: 'approach.D1' },
      LB:  { x: 345, y: 525, row: 5, kids: ['LB1'], themes: ['earth'], pre: 'approach.D2' },
      RA:  { x: 455, y: 525, row: 5, kids: ['RA1'], themes: ['water'], pre: 'approach.D3' },
      RB:  { x: 685, y: 525, row: 5, kids: ['RB1'], themes: ['air'],   pre: 'approach.D4' },
      LA1: { x: 115, y: 620, row: 6, kids: ['D1'], themes: ['fire'] },
      LB1: { x: 345, y: 620, row: 6, kids: ['D2'], themes: ['earth'] },
      RA1: { x: 455, y: 620, row: 6, kids: ['D3'], themes: ['water'] },
      RB1: { x: 685, y: 620, row: 6, kids: ['D4'], themes: ['air'] },
      D1:  { x: 115, y: 725, row: 7, kids: [], dest: 'D1', pre: 'bossIntro.D1' },
      D2:  { x: 345, y: 725, row: 7, kids: [], dest: 'D2', pre: 'bossIntro.D2' },
      D3:  { x: 455, y: 725, row: 7, kids: [], dest: 'D3', pre: 'bossIntro.D3' },
      D4:  { x: 685, y: 725, row: 7, kids: [], dest: 'D4', pre: 'bossIntro.D4' }
    }
  };

  /* ---- Atto II: modello comune, una copia per radice ---- */
  function atto2(key) {
    const d = R.DEST[key], th = d.theme;
    return {
      id: 'atto2_' + key, title: 'Atto II: ' + d.name2, dest: key, w: 800, h: 560, start: 'S', trunkRows: 0,
      scale: { hp: [1.3, 0.05], atk: [1.2, 0.04] },
      nodes: {
        S:  { x: 400, y: 50,  row: 0, kids: ['A'], name: d.name, icon: '🚪' },
        A:  { x: 400, y: 150, row: 1, kids: ['B1', 'B2'], themes: [th] },
        B1: { x: 250, y: 250, row: 2, kids: ['C1'], themes: [th] },
        B2: { x: 550, y: 250, row: 2, kids: ['C2'], themes: [] },
        C1: { x: 250, y: 350, row: 3, kids: ['F'],  themes: [th] },
        C2: { x: 550, y: 350, row: 3, kids: ['F'],  themes: [] },
        F:  { x: 400, y: 470, row: 4, kids: [], boss: d.boss2, pre: 'atto2.' + key + '.bossIntro' }
      }
    };
  }

  R.MAPS = { atto1: atto1 };
  ['D1', 'D2', 'D3', 'D4'].forEach(k => { R.MAPS['atto2_' + k] = atto2(k); });
})(window.R = window.R || {});
