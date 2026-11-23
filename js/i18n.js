/* Testi del gioco in inglese (lingua di partenza) e italiano.
   Per aggiungere una frase: stessa chiave nei due blocchi. {nome} = valore inserito dal codice. */
(function (X) {
  X.I18N = {
    en: {
      noMobile: 'Mobile version not available yet.<br>Please open the game on a computer.',
      clickToStart: 'Click to start', newGame: 'New Game', loadGame: 'Load Game', options: 'Options',
      language: 'Language', volume: 'Volume', vMaster: 'Master', vMusic: 'Music', vSfx: 'Effects', back: 'Back',
      menu: '‹ Menu',
      team: 'Team', attack: 'Attack', flee: 'Flee', continue: 'Continue', lv: 'Lv', empty: 'Empty slot',
      'monster.dustHound': 'Dust Hound',
      appears: 'A {m} appears!',
      yourTurn: 'What will {who} do?',
      playerHit: '{who} attacks! {dmg} damage.',
      monsterHit: '{m} attacks {who}! {dmg} damage.',
      win: 'Victory! The level is complete.',
      lost: '{who} has fallen... The level is not complete.',
      toastWin: 'Level complete!',
      toastFled: 'You fled. The level is not complete.',
      toastLost: 'You were defeated. The level is not complete.'
    },
    it: {
      noMobile: 'Versione mobile non ancora disponibile.<br>Apri il gioco da un computer.',
      clickToStart: 'Clicca per iniziare', newGame: 'Nuova partita', loadGame: 'Carica partita', options: 'Opzioni',
      language: 'Lingua', volume: 'Volume', vMaster: 'Generale', vMusic: 'Musica', vSfx: 'Effetti', back: 'Indietro',
      menu: '‹ Menu',
      team: 'Squadra', attack: 'Attacca', flee: 'Fuggi', continue: 'Continua', lv: 'Liv', empty: 'Posto libero',
      'monster.dustHound': 'Segugio di polvere',
      appears: 'Appare un {m}!',
      yourTurn: 'Cosa farà {who}?',
      playerHit: '{who} attacca! {dmg} danni.',
      monsterHit: '{m} attacca {who}! {dmg} danni.',
      win: 'Vittoria! Livello completato.',
      lost: '{who} è caduto... Il livello non è completato.',
      toastWin: 'Livello completato!',
      toastFled: 'Sei fuggito. Il livello non è completato.',
      toastLost: 'Sei stato sconfitto. Il livello non è completato.'
    }
  };

  X.t = function (key, vars) {
    const lang = (X.S && X.S.lang) || 'en';
    let s = X.I18N[lang][key];
    if (s === undefined) s = X.I18N.en[key];
    if (s === undefined) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };
})(window.X = window.X || {});
