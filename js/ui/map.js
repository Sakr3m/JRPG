/* Mappa a nodi (SVG). Funziona per qualsiasi mappa di R.MAPS. */
(function (R) {
  const $ = R.$;

  R.ui.goMap = function () {
    R.save();
    R.ui.renderHud();
    R.ui.renderMap();
    R.ui.showScreen('map');
  };

  function nodeIcon(id, n, G) {
    if (n.icon && id === 'S') return n.icon;
    if (G.visited.has(id)) return G.nodeIcon[id] || '✔';
    if (n.dest) return R.DEST[n.dest].icon;
    if (n.boss) return n.boss.icon;
    return '❓';
  }
  function nodeLabel(n) {
    if (n.dest) return R.DEST[n.dest].name;
    if (n.boss) return n.boss.name;
    return '';
  }

  R.ui.renderMap = function () {
    const G = R.G, m = R.curMap();
    const avail = new Set(m.nodes[G.node].kids);
    $('#map-title').textContent = m.title;
    $('#mapsvg').setAttribute('viewBox', '0 0 ' + m.w + ' ' + m.h);
    let edges = '', nodes = '';
    for (const [id, n] of Object.entries(m.nodes)) {
      for (const k of n.kids) {
        const t = m.nodes[k], my = (n.y + t.y) / 2;
        const taken = G.visited.has(id) && G.visited.has(k);
        const av = (id === G.node && avail.has(k));
        const w = n.row <= m.trunkRows ? 11 : (n.row <= 4 && m.trunkRows ? 7 : 5);
        edges += '<path class="edge' + (taken ? ' taken' : '') + (av ? ' av' : '') + '" stroke-width="' + w + '" d="M' + n.x + ',' + n.y +
          ' C' + n.x + ',' + my + ' ' + t.x + ',' + my + ' ' + t.x + ',' + t.y + '"/>';
      }
    }
    for (const [id, n] of Object.entries(m.nodes)) {
      const vis = G.visited.has(id), cur = id === G.node, av = avail.has(id);
      const big = !!(n.dest || n.boss), r = big ? 32 : 24;
      const cls = ['node'];
      if (vis) cls.push('visited'); if (cur) cls.push('cur');
      if (av) cls.push('avail'); if (!vis && !av) cls.push('future');
      nodes += '<g class="' + cls.join(' ') + '" data-id="' + id + '"><circle cx="' + n.x + '" cy="' + n.y + '" r="' + r + '"/>' +
        '<text x="' + n.x + '" y="' + (n.y + 1) + '" font-size="' + (big ? 28 : 22) + '">' + nodeIcon(id, n, G) + '</text>';
      if (cur) nodes += '<text class="mk" x="' + n.x + '" y="' + (n.y - r - 10) + '">▼</text>';
      if (nodeLabel(n)) nodes += '<text class="dlabel" x="' + n.x + '" y="' + (n.y + r + 22) + '">' + R.esc(nodeLabel(n)) + '</text>';
      if (id === 'S') nodes += '<text class="dlabel" x="' + (n.x + 75) + '" y="' + n.y + '">' + R.esc(n.name) + '</text>';
      nodes += '</g>';
    }
    $('#mapsvg').innerHTML = edges + nodes;

    $('#legend').innerHTML = G.map === 'atto1'
      ? Object.values(R.DEST).map(d => '<div class="win"><b>' + d.icon + ' ' + d.name + '</b><br><span class="mute">' + d.desc + '</span></div>').join('')
      : '<div class="win"><span class="mute">Due strade, una sola meta: il boss in fondo alla radice.</span></div>';
  };

  $('#mapsvg').addEventListener('click', (e) => {
    const g = e.target.closest('.node.avail');
    if (g && R.G && !R.B && !R.dialog.active()) R.flow.enterNode(g.dataset.id);
  });
})(window.R = window.R || {});
