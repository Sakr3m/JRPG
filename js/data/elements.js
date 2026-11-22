/* Elementi del gioco. Per aggiungerne uno: nuova voce in EL e in BEATS. */
(function (R) {
  // chi batte chi: la chiave batte il valore
  R.BEATS = { fire: 'earth', water: 'fire', air: 'water', earth: 'air' };

  R.EL = {
    fire: {
      name: 'Fuoco', icon: '🔥', color: '#e8643a', evoName: 'Esplosione', evoIcon: '💥',
      base: { name: 'Fiammata', cost: 2, desc: '12 danni + Bruciatura (3 danni per 3 turni).' },
      evo:  { name: 'Esplosione', cost: 3, desc: '22 danni + Bruciatura (4 danni per 2 turni). Ti ferisci di 5 HP.' }
    },
    water: {
      name: 'Acqua', icon: '💧', color: '#4fa3d9', evoName: 'Ghiaccio', evoIcon: '🧊',
      base: { name: 'Onda', cost: 2, desc: '9 danni e ti curi di 8 HP.' },
      evo:  { name: 'Tempesta di Ghiaccio', cost: 3, desc: '12 danni + Congelamento: il nemico salta il turno (60%, 30% sui boss).' }
    },
    air: {
      name: 'Aria', icon: '🌪️', color: '#c8b6ff', evoName: 'Elettro', evoIcon: '⚡',
      base: { name: 'Raffica', cost: 2, desc: '10 danni e 65% di schivare il prossimo attacco.' },
      evo:  { name: 'Fulmine', cost: 3, desc: '15 danni, ignora la guardia, 40% di stordire (20% sui boss).' }
    },
    earth: {
      name: 'Terra', icon: '🪨', color: '#a98650', evoName: 'Roccia', evoIcon: '⛰️',
      base: { name: 'Frana', cost: 2, desc: '9 danni e ottieni uno scudo da 4.' },
      evo:  { name: 'Colata di Roccia', cost: 3, desc: '13 danni e ottieni uno scudo da 10.' }
    }
  };
})(window.R = window.R || {});
