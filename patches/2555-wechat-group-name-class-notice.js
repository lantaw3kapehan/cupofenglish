// 2555 (Misty 21 Nov 09:23): the last trial step is the Class notice (not "Welcome message"), and before it the WeChat group is
// renamed to the standard name, e.g. 一杯英语Monica-15节课(ST-2026-144). The name is shown with a Copy button on the step and at the
// top of the Class notice sheet, so it no longer has to be looked up on the student's card.
const file = process.argv[2];
const helper = `<script id="b2555">
/* 21 Nov · 2555 · WeChat group name before the Class notice (Misty 09:23) */
window.wx2555 = function(name, code, n){ try{ code = String(code || '').toUpperCase(); if(!code || !window.wxGroup) return ''; let g = wxGroup(name || code, code);
    if(!/节课/.test(g) && +n > 0) g = g.replace(/\\((ST-\\d{4}-\\d{3})\\)$/i, '-' + (Math.round(+n * 10) / 10) + '节课($1)'); return g; }catch(e){ return ''; } };
window.wx2555Copy = function(g){ if(!g) return; const done = () => toast('Copied · in the WeChat group: ··· › Group name › paste › Done'); try{ navigator.clipboard.writeText(g).then(done, () => toast(g)); }catch(e){ toast(g); } };
(function(){
  const box = () => { try{ if(typeof CN === 'undefined' || !CN || !CN.code) return; const b = $('sheetBody'); if(!b || !$('cnPv')) return;
      const m = /([\\d.]+) units?（/.exec(typeof cnText === 'function' ? cnText() : ''), g = wx2555(CN.name, CN.code, m ? +m[1] : 0); if(!g) return;
      let w = $('wx2555'); const h = '<div style="font-weight:700;color:#2B2253">1 · Rename the WeChat group</div><div class="small mute" style="margin:2px 0 8px">In the group: ··· › Group name › paste › Done. Then 2 · copy the notice below into the group.</div>'
        + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b style="color:#0E5E5E;font-size:15px">' + esc(g) + '</b><button type="button" class="btn ghost sm" onclick="wx2555Copy(this.dataset.g)" data-g="' + esc(g) + '">Copy group name</button></div>';
      if(!w){ w = document.createElement('div'); w.id = 'wx2555'; w.style.cssText = 'margin:12px 0 4px;padding:12px 14px;border-radius:14px;background:#F4FAF8;border:1px solid #DCEFEA'; const d = b.querySelector('h1 + .mute') || b.querySelector('h1'); d.after(w); }
      if(w.dataset.g !== g){ w.dataset.g = g; w.innerHTML = h; } }catch(e){} };
  const _p = window.cnPaint; if(typeof _p === 'function') window.cnPaint = cnPaint = function(){ const r = _p.apply(this, arguments); box(); return r; };
  const _v = window.cnPv; if(typeof _v === 'function') window.cnPv = cnPv = function(){ const r = _v.apply(this, arguments); box(); return r; };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["      { k: 'welcome', title: 'Welcome message', done: !!m.welcome, sub: mk('welcome'), undo: 1 }",
   "      { k: 'welcome', title: 'Class notice', done: !!m.welcome, sub: mk('welcome'), undo: 1 }   /* 2555: Class notice (the welcome to the WeChat group) */"],
  ["b.textContent = 'Welcome message'; if(!st.L[9].done) s.textContent = 'Class times, books and the first class · for the WeChat group';",
   "b.textContent = 'Class notice'; if(!st.L[9].done) s.textContent = 'First rename the WeChat group, then copy the class notice into it';\n      { const g = window.wx2555 ? wx2555(t.student || t.code, t.code, st.paid ? (+st.paid.pkg ? +st.paid.pkg + (+st.paid.free || 0) : +st.paid.lessons || 0) : 0) : ''; let w = cn.querySelector('.wx2555');   /* 2555: the group name, right here */\n        if(g){ if(!w){ w = document.createElement('div'); w.className = 'wx2555'; w.style.cssText = 'grid-column:2/-1;font-size:13px;color:#5E5A75;margin-top:2px;display:flex;gap:8px;align-items:center;flex-wrap:wrap'; cn.appendChild(w); }\n          if(w.dataset.g !== g){ w.dataset.g = g; w.innerHTML = 'WeChat group name: <b style=\"color:#2B2253\">' + E(g) + '</b><button type=\"button\" class=\"btn ghost sm\" style=\"padding:3px 10px\">Copy group name</button>'; w.querySelector('button').onclick = ev => { ev.preventDefault(); ev.stopPropagation(); wx2555Copy(g); }; } } else if(w) w.remove(); }"],
  ["agree: 'Agreement', welcome: 'Welcome message' };", "agree: 'Agreement', welcome: 'Class notice' };"],
  ["const w = [...el.querySelectorAll('.tl4-r')].find(r => /^Welcome message$/.test((r.querySelector('.tl4-t b') || {}).textContent || ''));",
   "const w = [...el.querySelectorAll('.tl4-r')].find(r => /^(Welcome message|Class notice)$/.test((r.querySelector('.tl4-t b') || {}).textContent || ''));"],
  ['<script id="b2278">', helper + '<script id="b2278">'],
]);
