(function (root, factory) {
  'use strict';
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.SectionModel = model;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const transitions = {
    opensight: {label:'CARRY THE CONTEXT', kind:'bridge', path:'M0 20H200V65H370V112H605', layer:'M200 65L370 112L470 65L300 18Z'},
    vt: {label:'RAISE THE NEXT ITERATION', kind:'stair', path:'M0 20H120V42H240V65H360V88H480V112H605', layer:'M240 65L480 130L605 60L365-5Z'},
    nomic: {label:'ENTER THE EMBEDDING FIELD', kind:'field', path:'M0 20H180V55H360V112H605', layer:'M180 55L430 125L605 25L355-45Z'},
    production: {label:'NARROW THE WAIT', kind:'compression', path:'M0 20H230L430 112H605', layer:'M40 35H230L430 126H605M40 2H230L430 98H605'},
    wildfire: {label:'CROSS THE OBSERVATION CUT', kind:'terrain', path:'M0 20H120Q180 20 220 65T350 95T480 112H605', layer:'M120 65Q180 10 260 65T420 90L605 112V148H120Z'},
    algae: {label:'ARRIVE AT THE MEASUREMENT', kind:'assay', path:'M0 20H180V112H605', layer:'M260 102V126M310 97V126M360 102V126M410 97V126M460 102V126M510 97V126M560 102V126'}
  };
  function orderedKeys(route, known) {
    const unique = [...new Set(String(route || '').split(',').filter(key => known.includes(key)))];
    return unique.concat(known.filter(key => !unique.includes(key)));
  }
  function progressAt(cutY, top, height) {
    return clamp((cutY - top) / Math.max(1, height));
  }
  function makeThread(start, axisX, rooms, end) {
    const points = [];
    const add = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw new TypeError('Thread coordinates must be finite');
      const previous = points[points.length - 1];
      if (!previous || previous.x !== x || previous.y !== y) points.push({x, y});
    };
    add(start.x, start.y);
    add(start.x, start.y + 20);
    add(axisX, start.y + 20);
    for (const room of rooms) {
      if (room.passage) {
        const p = room.passage;
        add(axisX, p.y);
        add(p.x, p.y);
        add(p.x, p.bottom);
        add(axisX, p.bottom);
      }
      const nodes = room.nodes.slice().sort((a, b) => a.y - b.y);
      for (const node of nodes) {
        const previous = points[points.length - 1];
        add(previous.x, node.y);
        add(node.x, node.y);
      }
      const last = points[points.length - 1];
      add(last.x, room.bottom);
      add(axisX, room.bottom);
    }
    add(axisX, end.y);
    add(end.x, end.y);
    return {points, d:points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')};
  }
  function intersectionAtY(points, y) {
    if (!points.length) return {x:0,y:0};
    let found = points[0];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (a.y === b.y) {
        if (Math.abs(y - b.y) < .5) found = b;
        continue;
      }
      if (y >= Math.min(a.y, b.y) && y <= Math.max(a.y, b.y)) {
        const t = (y - a.y) / (b.y - a.y);
        found = {x:a.x + (b.x - a.x) * t, y};
      }
    }
    return y > points[points.length - 1].y ? points[points.length - 1] : found;
  }
  return {clamp, transitions, orderedKeys, progressAt, makeThread, intersectionAtY};
});
