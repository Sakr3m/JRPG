# RADICI

Prototipo di GDR a turni con mappa a radici (stile Slay the Spire, ma non roguelike).
Si apre `index.html` nel browser, non serve installare niente.

## Come si gioca
Scegli un elemento (Fuoco, Acqua, Aria, Terra) e un'arma (spada, lancia, ascia bipenne, falce), entra dal tronco e scendi lungo le radici.
Ogni nodo è uno scontro con un nemico estratto a caso. Ogni radice porta a una destinazione diversa, con il suo boss (Atto I) e una seconda fase dedicata (Atto II).
Dopo 3 vittorie l'elemento si evolve. Il gioco salva da solo nel browser.

## Struttura del progetto

```
index.html            pagina unica, carica i file in ordine
css/style.css         stile "finestre blu" alla RPG Maker
js/data/              SOLO DATI (si modificano senza toccare la logica)
  elements.js           elementi, evoluzioni, chi batte chi
  weapons.js            armi, tecniche, tipi di nemico
  enemies.js            nemici normali
  maps.js               mappe a nodi (Atto I e Atto II), boss, destinazioni
  story.js              TESTI della storia (bozza provvisoria)
  assets.js             dove stanno le immagini e come sostituirle
js/systems/           logica
  state.js              stato della partita e salvataggio
  battle.js             combattimento (non tocca il DOM)
  flow.js               storia, vittorie, sconfitte, passaggio tra atti
js/ui/                interfaccia
  common.js dialog.js create.js map.js battle-ui.js
js/main.js            avvio
assets/               immagini (adesso tutte SEGNAPOSTO in SVG)
  enemies/ backgrounds/ portraits/
tools/make_placeholders.js   rigenera i segnaposto leggendo i dati
```

## Cose da sapere

- **Aggiungere un nemico:** una riga in `js/data/enemies.js`, poi `node tools/make_placeholders.js` per il suo segnaposto.
- **Cambiare la storia:** si modificano solo i testi in `js/data/story.js`. Ogni scena è una lista di battute con nome e ritratto.
- **Sostituire un'immagine:** copia il file vero con lo stesso nome (es. `assets/enemies/lupo-ombra.png`) e cambia l'estensione per quel tipo in `js/data/assets.js`. Se un'immagine manca, il gioco mostra l'emoji.
- **Nuova mappa o nuovo atto:** si aggiunge a `R.MAPS` in `js/data/maps.js`. Il disegno della mappa e gli scontri funzionano per qualsiasi mappa.
- I file sono script classici (niente moduli ES), quindi il gioco funziona anche aprendo `index.html` da disco.
