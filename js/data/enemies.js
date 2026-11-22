/* Nemici normali. id = nome del file immagine in assets/enemies/<id>.svg (o .png, vedi assets.js).
   th = tema: 'gen' (ovunque) oppure fire / earth / water / air (solo nelle radici di quel tema). */
(function (R) {
  R.ENEMIES = [
    { id: 'lupo-ombra',         name: "Lupo d'Ombra",           icon: '🐺', hp: 30, atk: 6, elem: 'none',  trait: 'Agile',     th: 'gen' },
    { id: 'scheletro-armato',   name: 'Scheletro Armato',       icon: '💀', hp: 34, atk: 7, elem: 'none',  trait: 'Corazzato', th: 'gen' },
    { id: 'spettro-errante',    name: 'Spettro Errante',        icon: '👻', hp: 26, atk: 7, elem: 'none',  trait: 'Spettrale', th: 'gen' },
    { id: 'troll-palude',       name: 'Troll di Palude',        icon: '🧌', hp: 38, atk: 7, elem: 'none',  trait: 'Coriaceo',  th: 'gen' },

    { id: 'salamandra-rovente', name: 'Salamandra Rovente',     icon: '🦎', hp: 28, atk: 7, elem: 'fire',  trait: 'Agile',     th: 'fire' },
    { id: 'golem-magma',        name: 'Golem di Magma',         icon: '🌋', hp: 40, atk: 8, elem: 'fire',  trait: 'Corazzato', th: 'fire' },
    { id: 'spettro-fiamma',     name: 'Spettro di Fiamma',      icon: '🕯️', hp: 26, atk: 8, elem: 'fire',  trait: 'Spettrale', th: 'fire' },
    { id: 'cinghiale-infuocato',name: 'Cinghiale Infuocato',    icon: '🐗', hp: 36, atk: 8, elem: 'fire',  trait: 'Coriaceo',  th: 'fire' },

    { id: 'scarabeo-minerale',  name: 'Scarabeo Minerale',      icon: '🪲', hp: 28, atk: 6, elem: 'earth', trait: 'Agile',     th: 'earth' },
    { id: 'golem-pietra',       name: 'Golem di Pietra',        icon: '🪨', hp: 42, atk: 7, elem: 'earth', trait: 'Corazzato', th: 'earth' },
    { id: 'spirito-sepolcro',   name: 'Spirito del Sepolcro',   icon: '⚰️', hp: 28, atk: 7, elem: 'earth', trait: 'Spettrale', th: 'earth' },
    { id: 'orso-caverne',       name: 'Orso delle Caverne',     icon: '🐻', hp: 40, atk: 8, elem: 'earth', trait: 'Coriaceo',  th: 'earth' },

    { id: 'serpe-acqua',        name: "Serpe d'Acqua",          icon: '🐍', hp: 28, atk: 7, elem: 'water', trait: 'Agile',     th: 'water' },
    { id: 'granchio-scogliera', name: 'Granchio di Scogliera',  icon: '🦀', hp: 36, atk: 7, elem: 'water', trait: 'Corazzato', th: 'water' },
    { id: 'sirena-spettrale',   name: 'Sirena Spettrale',       icon: '🧜', hp: 26, atk: 8, elem: 'water', trait: 'Spettrale', th: 'water' },
    { id: 'annegato',           name: 'Annegato',               icon: '🧟', hp: 38, atk: 7, elem: 'water', trait: 'Coriaceo',  th: 'water' },

    { id: 'arpia',              name: 'Arpia',                  icon: '🦅', hp: 27, atk: 8, elem: 'air',   trait: 'Agile',     th: 'air' },
    { id: 'cavaliere-vento',    name: 'Cavaliere del Vento',    icon: '🛡️', hp: 34, atk: 8, elem: 'air',   trait: 'Corazzato', th: 'air' },
    { id: 'elementale-tempesta',name: 'Elementale di Tempesta', icon: '🌩️', hp: 26, atk: 8, elem: 'air',   trait: 'Spettrale', th: 'air' },
    { id: 'bufalo-tempestoso',  name: 'Bufalo Tempestoso',      icon: '🐂', hp: 38, atk: 8, elem: 'air',   trait: 'Coriaceo',  th: 'air' }
  ];
})(window.R = window.R || {});
