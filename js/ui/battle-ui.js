/* Schermata di battaglia in stile RPG Maker: scena con sfondo e sprite, finestre per comandi, stato e messaggi. */
(function (R) {
  const $ = R.$;
  let spriteFor = null;

  R.ui.clearLog = function () { $('#log').innerHTML = ''; spriteFor = null; };
  R.ui.log = function (t, c) {
    const d = document.createElement('div'); d.className = c || ''; d.textContent = t;
    const l = $('#log'); l.appendChild(d); l.scrollTop = l.scrollHeight;
  };
  R.ui.showBattle = function () { R.ui.showScreen('battle'); };

  function intentText(e) {
    if (e.skip === 'frozen') return '❄️ Congelato: salta il turno';
    if (e.skip === 'stunned') return '⚡ Stordito: salta il turno';
    const it = e.intent;
    if (it.t === 'atk') return '⚔️ Intende attaccare (' + it.dmg + ')';
    if (it.t === 'heavy') return '💥 Prepara un colpo pesante (' + it.dmg + ')';
    return '🛡️ In guardia: subisce metà danni (Affondo e Fulmine la ignorano)';
  }

  R.ui.renderBattle = function () {
    const G = R.G, B = R.B, e = B.e;
    R.ui.renderHud();

    // scena
    $('#stage').style.backgroundImage = 'url("' + R.assetPath('backgrounds', B.bg) + '")';
    $('#stage').className = 'stage bg-' + B.bg;
    if (spriteFor !== B) {
      $('#e-sprite').innerHTML = R.imgHtml('enemies', e.id, e.icon, 'sprite');
      spriteFor = B;
    }
    $('#e-sprite').classList.toggle('dead', e.hp <= 0);

    // finestra nemico
    $('#e-name').textContent = e.name + (e.boss ? ' (Boss)' : '');
    $('#e-hpbar').style.width = (e.hp / e.maxHp * 100) + '%';
    $('#e-hptext').textContent = e.hp + '/' + e.maxHp;
    const tr = R.TRAIT[e.trait];
    let chips = '';
    if (e.elem !== 'none') {
      const weakE = Object.keys(R.BEATS).find(k => R.BEATS[k] === e.elem);
      chips += '<span class="chip">' + R.EL[e.elem].icon + ' ' + R.EL[e.elem].name + '</span><span class="chip">Debole a ' + R.EL[weakE].icon + ' ' + R.EL[weakE].name + '</span>';
    } else chips += '<span class="chip">🌑 Neutro</span>';
    chips += '<span class="chip">' + tr.txt + '</span><span class="chip">Debole a ' + R.WP[tr.weak].icon + ' ' + R.WP[tr.weak].name + '</span><span class="chip">Resiste a ' + R.WP[tr.res].icon + ' ' + R.WP[tr.res].name + '</span>';
    if (e.burn) chips += '<span class="chip">🔥 Bruciatura ' + e.burn.dmg + ' x' + e.burn.turns + '</span>';
    if (e.bleed) chips += '<span class="chip">🩸 Sanguinamento ' + e.bleed.dmg + ' x' + e.bleed.turns + '</span>';
    if (e.guard) chips += '<span class="chip">🛡️ Guardia</span>';
    $('#e-chips').innerHTML = chips;
    $('#e-intent').textContent = intentText(e);

    // finestra stato eroe
    $('#p-portrait').innerHTML = R.imgHtml('portraits', 'hero', '🧑', 'portrait');
    $('#p-name').textContent = G.name;
    $('#p-pips').textContent = '✦'.repeat(B.ess) + '◇'.repeat(5 - B.ess);
    let pc = '';
    if (B.shield > 0) pc += '<span class="chip">🧱 Scudo ' + B.shield + '</span>';
    if (B.exposed) pc += '<span class="chip">⚠️ Esposto</span>';
    if (B.dodge) pc += '<span class="chip">💨 Schivata pronta</span>';
    $('#p-chips').innerHTML = pc;
    $('#p-turn').textContent = 'Turno ' + B.turn;

    // comandi
    const w = R.WP[G.wp], ab = R.curAb(), dis = B.busy || B.over, ready = B.cd === 0;
    $('#actions').innerHTML =
      '<button class="act" id="a1" ' + (dis ? 'disabled' : '') + '><b>1. ' + w.icon + ' Attacco</b><small>' + w.min + '-' + w.max + ' danni' +
        (G.wp === 'axe' ? ', 25% di mancare' : '') + (G.wp === 'scythe' ? ', applica Sanguinamento' : '') + '</small></button>' +
      '<button class="act" id="a2" ' + ((dis || B.ess < ab.cost) ? 'disabled' : '') + '><b>2. ' + R.curIcon() + ' ' + ab.name + ' (' + ab.cost + ' ✦)</b><small>' + ab.desc + '</small></button>' +
      '<button class="act" id="a3" ' + ((dis || !ready) ? 'disabled' : '') + '><b>3. ' + w.icon + ' ' + w.tech.name + '</b><small>' + (ready ? w.tech.desc : 'Ricarica: ' + B.cd + ' turni') + '</small></button>' +
      '<button class="act" id="a4" ' + (dis ? 'disabled' : '') + '><b>4. 🛡️ Difesa</b><small>Dimezza i danni subiti questo turno, +1 ✦.</small></button>';
    $('#a1').onclick = R.battle.attack; $('#a2').onclick = R.battle.element;
    $('#a3').onclick = R.battle.tech; $('#a4').onclick = R.battle.defend;
  };

  document.addEventListener('keydown', (e) => {
    const B = R.B;
    if (!B || B.busy || B.over || R.dialog.active() || $('#modal').classList.contains('show')) return;
    const id = ({ '1': '#a1', '2': '#a2', '3': '#a3', '4': '#a4' })[e.key];
    if (id && $(id) && !$(id).disabled) $(id).click();
  });
})(window.R = window.R || {});
