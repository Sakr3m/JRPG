/* Finestra di dialogo stile RPG Maker: ritratto a sinistra, testo che scorre, clic/Invio/Spazio per avanzare. */
(function (R) {
  const $ = R.$;
  R.FAST = false; // true = testo istantaneo (usato nei test)
  R.dialog = {};
  let queue = [], idx = 0, done = null, timer = null, typing = false, current = '';

  R.dialog.active = () => !$('#dialog').hidden;

  R.dialog.play = function (lines, cb) {
    queue = lines; idx = 0; done = cb;
    $('#dialog').hidden = false;
    showLine();
  };

  function showLine() {
    const l = queue[idx];
    $('#dlg-name').textContent = l.who || '';
    $('#dlg-name').style.visibility = l.who ? 'visible' : 'hidden';
    $('#dlg-draft').style.display = R.STORY_DRAFT ? 'inline' : 'none';
    const p = $('#dlg-portrait');
    if (l.portrait) { p.innerHTML = R.imgHtml('portraits', l.portrait, '🧑'); p.style.display = 'block'; }
    else { p.innerHTML = ''; p.style.display = 'none'; }
    current = l.text; typing = true;
    const t = $('#dlg-text'); t.textContent = '';
    $('#dlg-next').style.visibility = 'hidden';
    if (R.FAST) return finishTyping();
    let i = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      i++; t.textContent = current.slice(0, i);
      if (i >= current.length) finishTyping();
    }, 22);
  }
  function finishTyping() {
    clearInterval(timer);
    $('#dlg-text').textContent = current;
    typing = false;
    $('#dlg-next').style.visibility = 'visible';
  }
  R.dialog.advance = function () {
    if (!R.dialog.active()) return;
    if (typing) return finishTyping();
    idx++;
    if (idx >= queue.length) {
      $('#dialog').hidden = true;
      const cb = done; done = null;
      if (cb) cb();
    } else showLine();
  };

  $('#dialog').addEventListener('click', R.dialog.advance);
  document.addEventListener('keydown', (e) => {
    if (R.dialog.active() && (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z')) {
      e.preventDefault(); R.dialog.advance();
    }
  });
})(window.R = window.R || {});
