/* Immagini del gioco.
   Convenzione: assets/<tipo>/<id>.<estensione>
     enemies/      sprite dei nemici e dei boss (id in enemies.js e maps.js)
     backgrounds/  sfondi di battaglia: trunk, fire, earth, water, air
     portraits/    ritratti per i dialoghi e la finestra di stato: hero, ...
   Adesso sono tutti SEGNAPOSTO in SVG. Per usare un'immagine vera, copiala con lo stesso nome
   (es. assets/enemies/lupo-ombra.png) e cambia l'estensione qui sotto per quel tipo.
   Se un file manca, il gioco ripiega sull'emoji, quindi non si rompe mai. */
(function (R) {
  R.ASSET_EXT = { enemies: 'svg', backgrounds: 'svg', portraits: 'svg' };

  // eccezioni per singoli file: R.ASSET_OVERRIDE['enemies/arpia'] = 'assets/custom/arpia.webp';
  R.ASSET_OVERRIDE = {};

  R.assetPath = function (kind, id) {
    const key = kind + '/' + id;
    if (R.ASSET_OVERRIDE[key]) return R.ASSET_OVERRIDE[key];
    return 'assets/' + kind + '/' + id + '.' + (R.ASSET_EXT[kind] || 'svg');
  };

  // <img> con ripiego sull'emoji se il file non esiste
  R.imgHtml = function (kind, id, emoji, cls) {
    cls = cls || '';
    return '<img class="' + cls + '" src="' + R.assetPath(kind, id) + '" alt="" ' +
      'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">' +
      '<span class="fb" style="display:none">' + (emoji || '') + '</span>';
  };
})(window.R = window.R || {});
