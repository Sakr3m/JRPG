/* TESTI DELLA STORIA (BOZZA PROVVISORIA).
   Ogni chiave e' una scena: un elenco di battute { who, portrait, text }.
   - who: nome mostrato (usa {nome} per il nome del personaggio, vuoto = narratore senza nome)
   - portrait: id del ritratto in assets/portraits/<id>.svg (null = nessun ritratto)
   Le scene con "once" (vedi flow.js) si vedono una sola volta per partita.
   Sostituisci i testi quando la storia e' decisa: il codice non va toccato. */
(function (R) {
  R.STORY_DRAFT = true; // mostra l'etichetta "bozza" nei dialoghi

  const N = (text) => ({ who: '', portrait: null, text });
  const H = (text) => ({ who: '{nome}', portrait: 'hero', text });

  R.STORY = {
    intro: [
      N('Un albero immenso, vecchio quanto il mondo, e sotto di lui un intreccio di radici che nessuno ha mai attraversato.'),
      H('Si dice che ogni radice porti da qualche parte. Voglio scoprire dove.'),
      N('Il sentiero comincia dal tronco.')
    ],
    'trunk': [
      N('Il tronco è scavato da gallerie. L\'aria sa di terra umida e di cose dimenticate.'),
      H('Qualcosa si muove là davanti.')
    ],

    /* arrivo alla prima tappa di ogni radice */
    'approach.D1': [N('La roccia si scalda sotto i piedi. In fondo alla radice, un bagliore rosso.')],
    'approach.D2': [N('Le pareti si stringono, e la pietra porta incisi nomi che nessuno ricorda.')],
    'approach.D3': [N('L\'acqua sale lungo la radice, fredda e silenziosa, fino alle caviglie.')],
    'approach.D4': [N('Il vento fischia tra le radici. Più si sale, più il cielo sembra vicino.')],

    /* boss Atto I */
    'bossIntro.D1': [N('Nella Fornace Dimenticata, un trono di cenere. Qualcuno vi siede ancora.')],
    'bossIntro.D2': [N('Al centro della cripta, una statua si alza lentamente dal suo piedistallo.')],
    'bossIntro.D3': [N('Le acque si aprono. Qualcosa di enorme risale dal fondo del lago.')],
    'bossIntro.D4': [N('Sulle cime, le nuvole si dividono. Un\'ombra con le ali si abbassa su di te.')],
    'bossOutro.D1': [H('La cenere si posa. Ma la radice continua a scendere, più in basso.')],
    'bossOutro.D2': [H('La pietra tace. Sotto il sarcofago, un passaggio che prima non c\'era.')],
    'bossOutro.D3': [H('Il lago si calma. Là sotto, la radice prosegue nel buio.')],
    'bossOutro.D4': [H('Il vento si placa. Oltre la tempesta, le radici si spingono ancora più in alto.')],

    /* Atto II */
    'atto2.D1.enter': [N('ATTO II. Il calore cresce. Il Cuore della Fornace pulsa sotto i tuoi piedi.')],
    'atto2.D2.enter': [N('ATTO II. Le Gallerie Sepolte si aprono, buie e senza fine.')],
    'atto2.D3.enter': [N('ATTO II. Gli Abissi Neri ti inghiottono, e la luce resta indietro.')],
    'atto2.D4.enter': [N('ATTO II. Oltre la Tempesta, il cielo è calmo e sbagliato.')],
    'atto2.D1.bossIntro': [N('Il Custode della Brace sorveglia ciò che arde in fondo.')],
    'atto2.D2.bossIntro': [N('Il Guardiano del Sepolcro non ha mai lasciato il suo posto.')],
    'atto2.D3.bossIntro': [N('Il Sovrano degli Abissi ti osserva da molto prima del tuo arrivo.')],
    'atto2.D4.bossIntro': [N('L\'Araldo della Tempesta annuncia la fine del cammino.')],
    'atto2.D1.end': [H('Il cuore dell\'albero batte più forte. Questa radice non finisce qui.'), N('(fine della bozza della storia)')],
    'atto2.D2.end': [H('Le gallerie si chiudono alle mie spalle. Ho visto abbastanza, per ora.'), N('(fine della bozza della storia)')],
    'atto2.D3.end': [H('Il buio si ritira. Qualcosa, in fondo, mi chiama per nome.'), N('(fine della bozza della storia)')],
    'atto2.D4.end': [H('Il cielo si apre. C\'è ancora molto da scoprire.'), N('(fine della bozza della storia)')]
  };
})(window.R = window.R || {});
