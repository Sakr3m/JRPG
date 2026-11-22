/* Funzioni di interfaccia condivise: schermate, finestre modali, barra in alto (HUD). */
(function (R) {
  R.$ = (s) => document.querySelector(s);
  R.esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = R.$;
  R.ui = R.ui || {};

  R.ui.showScreen = function (id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $('#s-' + id).classList.add('active');
    window.scrollTo(0, 0);
  };

  R.ui.modal = function (title, html, buttons) {
    const m = $('#modal');
    m.innerHTML = '<div class="box win"><h2>' + title + '</h2>' + html + '<div class="btns"></div></div>';
    buttons.forEach(([label, fn]) => {
      const b = document.createElement('button');
      b.className = 'btn'; b.textContent = label;
      b.onclick = () => { m.classList.remove('show'); fn(); };
      m.querySelector('.btns').appendChild(b);
    });
    m.classList.add('show');
  };

  R.ui.renderHud = function () {
    const h = $('#hud'), G = R.G;
    if (!G) { h.hidden = true; return; }
    h.hidden = false;
    h.innerHTML =
      '<div class="who"><b>' + R.esc(G.name) + '</b><span>' + R.curIcon() + ' ' + R.curName() + '</span>' +
      '<span>' + R.WP[G.wp].icon + ' ' + R.WP[G.wp].name + '</span></div>' +
      '<div class="bar" style="flex:1;min-width:150px"><i style="width:' + Math.max(0, G.hp) / G.maxHp * 100 + '%"></i>' +
      '<span>' + G.hp + '/' + G.maxHp + ' HP</span></div>' +
      '<div class="prog">' + (G.evolved ? 'Elemento evoluto' : 'Evoluzione ' + Math.min(G.wins, 3) + '/3') +
      ' | Vittorie ' + G.wins + '</div>';
  };

  R.ui.fx = function (target) {
    const el = target === 'enemy' ? $('#e-sprite') : $('#pstat');
    if (!el) return;
    el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');
  };
})(window.R = window.R || {});
