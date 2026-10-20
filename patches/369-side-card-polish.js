// 20 Oct · Excellence card in the side menu polished (Misty: "can this be polished, especially the texts"): month and place on one line each,
// the goal as a soft two-line note (what to do · what it brings) instead of a large bold paragraph.
require('../tools/lib.js')(process.argv[2], [
  ['${medal}<div style="min-width:0"><div style="font:800 19px/1.1 var(--brand,inherit);color:var(--ink)">',
   '${medal}<div style="min-width:0;flex:1"><div style="font:800 19px/1.1 var(--brand,inherit);color:var(--ink)">'],
  ['<div style="font-size:12px;color:#7b7b8f;margin-top:3px">${esc(mShort(m.month))}${m.final ? \'\' : \' so far\'}',
   '<div style="font-size:11.5px;color:#8a8a9c;margin-top:3px;white-space:nowrap">${esc(mShort(m.month))}${m.final ? \' · final\' : \' · so far\'}'],
  ['<span style="display:inline-block;margin-top:5px;font-size:11px;font-weight:700;padding:2px 8px;',
   '<span style="display:inline-block;white-space:nowrap;margin-top:6px;font-size:11px;font-weight:700;padding:3px 9px;'],
  ['+ `<div style="font-size:13px;font-weight:700;color:#2a9d8f;margin-top:6px">${gap(me)}</div></div>` : \'\')',
   '+ (g => { const p = String(g).split(/ → | · /), arrow = / → /.test(g); return `<div style="margin-top:10px;padding:8px 10px;border-radius:12px;background:${me.level === \'Gold\' ? \'#fff7e0\' : \'#eef7f5\'};font-size:12px;line-height:1.4;color:${me.level === \'Gold\' ? \'#6b4a00\' : \'#1e6b61\'}"><div style="font-weight:700">${esc(p[0])}</div>${p.length > 1 ? `<div style="opacity:.85;margin-top:1px">${arrow ? \'for \' : \'\'}${esc(p.slice(1).join(\' · \'))}</div>` : \'\'}</div>`; })(gap(me)) + `</div>` : \'\')']
]);
