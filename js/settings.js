/* Impostazioni (lingua e volumi), salvate nel browser. */
(function (X) {
  const KEY = 'prototipox.settings'; // nome interno vecchio, tenuto uguale per non azzerare le impostazioni gia' salvate
  const DEFAULTS = { lang: 'en', vol: { master: 80, music: 80, sfx: 80 } };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && X.I18N[s.lang]) return { lang: s.lang, vol: Object.assign({}, DEFAULTS.vol, s.vol) };
    } catch (e) { /* ignora */ }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  X.S = load();
  X.saveSettings = function () {
    try { localStorage.setItem(KEY, JSON.stringify(X.S)); } catch (e) { /* ignora */ }
  };
})(window.X = window.X || {});
