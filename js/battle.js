/* Regole del combattimento. Solo logica: niente schermo, niente DOM (cosi' si puo' testare da sola).
   Il danno dell'attacco e' provvisorio: si cambia nei dati (atk) dei personaggi e dei mostri. */
(function (X) {
  const roll = (r) => r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  X.Battle = {
    create(party, monsterDef) {
      return { party, monster: { id: monsterDef.id, hp: monsterDef.hp, maxHp: monsterDef.hp, atk: monsterDef.atk, art: monsterDef.art }, over: null };
    },
    // attacco di un membro del team: ritorna il danno inflitto
    playerAttack(b, member) {
      const dmg = roll(member.atk);
      b.monster.hp = Math.max(0, b.monster.hp - dmg);
      return { dmg };
    },
    // attacco del mostro contro un membro del team ancora in piedi
    monsterAttack(b) {
      const target = pick(b.party.filter(m => m.hp > 0));
      const dmg = roll(b.monster.atk);
      target.hp = Math.max(0, target.hp - dmg);
      return { target, dmg };
    },
    isWon(b) { return b.monster.hp <= 0; },
    isLost(b) { return b.party.every(m => m.hp <= 0); }
  };
})(window.X = window.X || {});
