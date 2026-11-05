// 1781: (Misty 5 Nov 13:15 "and name can also be easily editable? especially if i need to go back") Walk-in assessment: "✎ Edit" beside her
//   name opens her details on any tab — name, phone / email / WeChat, purpose and assessor — saved at once (the result link and picture use it).
//   The same fields, plus name and assessor, are on the Result tab.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [String.raw`<h1 style="font-size:20px">' + E(a.name) + '</h1>' + chip(a) + '<span class="as-st" id="as-st">' + E(S.saved) + '</span></div>' + scrBar() +`,
   String.raw`<h1 style="font-size:20px" id="as-hn">' + E(a.name) + '</h1><button class="btn ghost sm" onclick="as1778.edit()" title="Edit her name and details">✎ Edit</button>' + chip(a) + '<span class="as-st" id="as-st">' + E(S.saved) + '</span></div><div id="as-ed"></div>' + scrBar() +`],
  [String.raw`'<h3>Details (optional)</h3><input class="as-in" data-f="contact"`,
   String.raw`'<h3>Her details</h3>' + nameIn() + '<input class="as-in" style="margin-top:6px" data-f="contact"`],
  [String.raw`oninput="as1778.put(\'purpose\',this.value)"></div>' +`,
   String.raw`oninput="as1778.put(\'purpose\',this.value)">' + asrIn() + '</div>' +`],
  ['  function show(k){', String.raw`  /* 1781 · edit her name and details */
  const nameIn = () => '<input class="as-in" data-f="name" placeholder="Full name" value="' + E(S.a.name || '') + '" oninput="as1778.nm(this.value)">';
  const asrIn = () => '<input class="as-in" style="margin-top:6px" data-f="assessor" placeholder="Assessor" value="' + E(S.a.assessor || '') + '" oninput="as1778.put(\'assessor\',this.value)">';
  function nm(v){ put('name', v); const h = document.getElementById('as-hn'); if(h) h.textContent = v || '(no name)'; const L = (S.list || []).find(x => x.id === S.a.id); if(L) L.name = v; }
  function edit(){ const d = document.getElementById('as-ed'); if(!d) return; if(d.innerHTML){ flush(); d.innerHTML = ''; return; }
    d.innerHTML = '<div class="as-card"><h2>Her details</h2><div class="as-m">Saved as you type; her result link and picture show the change.</div><div style="display:grid;gap:6px;margin-top:8px">' + nameIn() +
      '<input class="as-in" data-f="contact" placeholder="Phone / email / WeChat" value="' + E(S.a.contact || '') + '" oninput="as1778.put(\'contact\',this.value)"><input class="as-in" data-f="purpose" placeholder="Purpose" value="' + E(S.a.purpose || '') + '" oninput="as1778.put(\'purpose\',this.value)">' + asrIn().replace('margin-top:6px', '') +
      '</div><div class="as-row"><button class="btn teal sm" onclick="as1778.edit()">Done</button></div></div>';
    const i = d.querySelector('[data-f="name"]'); if(i) i.focus(); }
  function show(k){`],
  ['  window.as1778 = { show, scrOpen,', '  window.as1778 = { nm, edit, show, scrOpen,'],
  // the list shows the new name when going back
  ["  function back(){ flush(); S.a = null;", "  function back(){ flush(); try{ const L = (S.list || []).find(x => S.a && x.id === S.a.id); if(L) Object.assign(L, { name: S.a.name, sp_band: S.a.sp_band, wr_band: S.a.wr_band, cefr: S.a.cefr }); }catch(e){} S.a = null;"],
]);
