/* Schermata di creazione del personaggio: elemento + arma + nome. */
(function (R) {
  const $ = R.$;
  let selEl = null, selWp = null;
  R.ui.createSel = () => ({ el: selEl, wp: selWp });
  R.ui.setCreateSel = (el, wp) => { selEl = el; selWp = wp; };

  function sel(root, c) {
    document.querySelectorAll(root + ' .card').forEach(x => x.classList.remove('sel'));
    c.classList.add('sel');
  }
  function check() { $('#start').disabled = !(selEl && selWp); }

  R.ui.buildCreate = function () {
    $('#el-cards').innerHTML = Object.entries(R.EL).map(([k, v]) =>
      '<div class="card win" data-el="' + k + '" style="--c:' + v.color + '"><div class="big">' + v.icon + '</div><h3>' + v.name + '</h3>' +
      '<div class="evo">Evolve in ' + v.evoIcon + ' ' + v.evoName + '</div>' +
      '<p><b>' + v.base.name + '</b> (' + v.base.cost + ' ✦): ' + v.base.desc + '</p>' +
      '<p class="mute">Forte contro ' + R.EL[R.BEATS[k]].name + '.</p></div>').join('');
    $('#wp-cards').innerHTML = Object.entries(R.WP).map(([k, v]) =>
      '<div class="card win" data-wp="' + k + '"><div class="big">' + v.icon + '</div><h3>' + v.name + '</h3>' +
      '<p>Danno ' + v.min + '-' + v.max + '. ' + v.desc + '</p>' +
      '<p><b>' + v.tech.name + '</b>: ' + v.tech.desc + '</p>' +
      '<p class="mute">Forte contro i ' + v.strong + ', soffre i ' + v.weak + '.</p></div>').join('');
    document.querySelectorAll('#el-cards .card').forEach(c => c.onclick = () => { selEl = c.dataset.el; sel('#el-cards', c); check(); });
    document.querySelectorAll('#wp-cards .card').forEach(c => c.onclick = () => { selWp = c.dataset.wp; sel('#wp-cards', c); check(); });
    $('#start').onclick = () => {
      R.newGame($('#pname').value.trim(), selEl, selWp);
      R.ui.renderHud();
      R.flow.begin();
    };
    $('#continue').onclick = () => {
      if (R.load()) { R.ui.goMap(); }
    };
    R.ui.refreshCreate();
  };

  R.ui.refreshCreate = function () {
    $('#continue').hidden = !R.hasSave();
    check();
  };
})(window.R = window.R || {});
