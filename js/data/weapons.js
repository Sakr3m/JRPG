/* Armi corpo a corpo e tipi di nemico (trait). */
(function (R) {
  R.WP = {
    sword: {
      name: 'Spada a una mano', icon: '⚔️', min: 9, max: 11, desc: 'Affidabile e precisa.',
      tech: { name: 'Doppio Fendente', cd: 3, desc: 'Due colpi al 70% ciascuno.' },
      strong: 'Coriacei', weak: 'Corazzati'
    },
    spear: {
      name: 'Lancia', icon: '🔱', min: 8, max: 10, desc: 'Colpisce dove l\'avversario è esposto.',
      tech: { name: 'Affondo Perforante', cd: 3, desc: '150% del danno, ignora la guardia.' },
      strong: 'Agili', weak: 'Spettrali'
    },
    axe: {
      name: 'Ascia bipenne', icon: '🪓', min: 12, max: 16, desc: 'Colpi enormi, ma il 25% delle volte manchi.',
      tech: { name: 'Spaccateschio', cd: 4, desc: '220% del danno, poi sei esposto (+50% danni al prossimo colpo subito).' },
      strong: 'Corazzati', weak: 'Agili'
    },
    scythe: {
      name: 'Falce', icon: '🌙', min: 7, max: 9, desc: 'Ogni colpo provoca Sanguinamento (2 danni per 3 turni).',
      tech: { name: 'Mietitura', cd: 3, desc: '120% del danno, raddoppia se il nemico è sotto il 40% di HP.' },
      strong: 'Spettrali', weak: 'Coriacei'
    }
  };

  // per ogni tipo di nemico: arma a cui è debole (weak) e arma a cui resiste (res)
  R.TRAIT = {
    Agile:     { weak: 'spear',  res: 'axe',    txt: 'Agile' },
    Corazzato: { weak: 'axe',    res: 'sword',  txt: 'Corazzato' },
    Spettrale: { weak: 'scythe', res: 'spear',  txt: 'Spettrale' },
    Coriaceo:  { weak: 'sword',  res: 'scythe', txt: 'Coriaceo' }
  };
})(window.R = window.R || {});
