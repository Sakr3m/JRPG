/* Avvio. Versione mobile: per ora disattivata. Metti MOBILE_ENABLED = true per riattivarla. */
(function (X) {
  const MOBILE_ENABLED = false;
  const isMobile = () => !!window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (!MOBILE_ENABLED && isMobile()) document.documentElement.classList.add('no-mobile');
})(window.X = window.X || {});
