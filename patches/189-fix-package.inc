/* 15 Oct · ACTIVE › a package › "✏️ Fix this package" (management). The package record in the database changes at once
   (lessons left, finished, deadline worked out again); Google then writes the same cells in the ACTIVE sheet row, like a
   hand fix, so the sheet, To do and Excel Daily stay the same. Replaces fixing ACTIVE by hand. */
FAST_M.mgmtPkgFix = 1;
const PKF_MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
function pkfMonthKey(lbl){ const m = String(lbl || '').match(/^([A-Za-z]{3})\s+(\d{2})$/); return m && PKF_MON[m[1]] ? '20' + m[2] + '-' + String(PKF_MON[m[1]]).padStart(2, '0') + '-01' : ''; }
function pkfHtml(row){
  const C = {}; AT.cols.forEach((c, i) => C[c] = i); const r = AT.rows.find(x => x[0] === row); if(!r) return '';
  const f = (id, label, v, type) => `<div><label class="small">${label}</label><input id="${id}" class="in-t" type="${type || 'number'}" step="0.5" value="${esc(v == null ? '' : v)}" data-was="${esc(v == null ? '' : v)}"></div>`;
  const M = (AT.months || []).map((lbl, i) => ({ lbl, key: pkfMonthKey(lbl), v: (r[C.months] || [])[i] })).filter(x => x.key && x.key >= '2025-01-01');
  return `<details id="pkfBox" style="margin-top:12px"><summary class="small"><b>✏️ Fix this package</b> <span class="mute">(instead of typing in the ACTIVE sheet)</span></summary>
  <div class="grid2" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:8px">
  ${f('pkfEn', 'Enrolled lessons', r[C.enrolled])}${f('pkfCa', 'Carry over', r[C.carry])}${f('pkfTr', 'Transfer out', r[C.transfer])}${f('pkfIn', 'Incentive', r[C.incentive])}
  ${f('pkfBuy', 'Purchase / 1st class', r[C.start], 'date')}${f('pkfDl', 'Deadline', r[C.deadline], 'date')}</div>
  ${M.length ? `<div class="small mute" style="margin-top:10px">Lessons finished by month · change a month only if the count is wrong</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:6px;margin-top:6px">${M.map(x => `<div><label class="small">${esc(x.lbl)}</label><input class="in-t pkfM" data-m="${x.key}" type="number" step="0.5" value="${esc(x.v === 0 ? '' : x.v)}" data-was="${esc(x.v === 0 ? '' : x.v)}"></div>`).join('')}</div>` : ''}
  <button class="btn teal block" style="margin-top:10px" onclick="pkfSave(${row},'${esc(r[C.code])}')">Save fix</button>
  <div class="small mute" style="margin-top:4px">Saved in the database at once · the sheet row is updated within about a minute.</div></details>`;
}
async function pkfSave(row, code){
  const ch = {}, num = id => { const el = $(id); if(!el || el.value === el.dataset.was) return; ch[{ pkfEn: 'enrolled', pkfCa: 'carry', pkfTr: 'transfer', pkfIn: 'incentive' }[id]] = el.value === '' ? '' : +el.value; };
  ['pkfEn', 'pkfCa', 'pkfTr', 'pkfIn'].forEach(num);
  [['pkfBuy', 'buy'], ['pkfDl', 'deadline']].forEach(([id, k]) => { const el = $(id); if(el && el.value !== el.dataset.was) ch[k] = el.value; });
  const months = {}; document.querySelectorAll('#pkfBox .pkfM').forEach(el => { if(el.value !== el.dataset.was) months[el.dataset.m] = el.value === '' ? 0 : +el.value; });
  if(Object.keys(months).length) ch.months = months;
  if(!Object.keys(ch).length) return toast('Nothing changed');
  toast('Saving fix…');
  try{ const r = await api('mgmtPkgFix', TOKEN, row, code, ch); if(r && r.ok === false) throw r;
    toast('✓ Fixed · numbers updated'); MS = null; setTimeout(async () => { try{ await loadActive(true); if($('sheet').classList.contains('on')) activeRow(row); }catch(e){} }, 1500); }
  catch(e){ toast((e && e.msg) || 'Not saved. Try again.'); }
}
(function(){ const base = window.activeRow; window.activeRow = function(row){ const r = base.apply(this, arguments);
  try{ if(D && D.mgr){ const h = Array.from(document.querySelectorAll('#sheetBody h2')).find(x => /Lessons by month/.test(x.textContent)); const html = pkfHtml(row); if(html){ if(h) h.insertAdjacentHTML('beforebegin', html); else $('sheetBody').insertAdjacentHTML('beforeend', html); } } }catch(e){}
  return r; }; })();
