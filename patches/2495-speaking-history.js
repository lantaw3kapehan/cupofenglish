// 2495 (Misty 11:42: "1. yes let's do it · 2. no need for partner to see it"): a "Speaking history" card in the student's profile.
//   Teacher notes from IELTS Speaking and Free talk class screens, one line per class: date, set, teacher, the four marks,
//   phrases used and the comment. Internal: teachers (their own students) and management; never partners or parents.
//   Shown only when the student has at least one saved class. Data: coe-talk op speakList (table coe_speak).
const file = process.argv[2];
const CSS = `<style id="u2495">
.sp2495 .row{display:grid;grid-template-columns:92px minmax(0,1fr);gap:4px 14px;padding:10px 0;border-top:1px solid #EEECF3}.sp2495 .row:first-of-type{border-top:0}
.sp2495 .d{font-size:12.5px;color:#6B6880;line-height:1.4}.sp2495 .t{font-weight:600;color:#2B2253;font-size:14px}
.sp2495 .mk{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}.sp2495 .mk span{font-size:12px;border-radius:8px;padding:2px 8px;background:#F1F0F6;color:#4A4566}
.sp2495 .mk span.needs{background:#FCEDE8;color:#B5432C}.sp2495 .mk span.ok{background:#FFF1D6;color:#8A5A00}.sp2495 .mk span.good{background:#E4F4F1;color:#1E6F5C}.sp2495 .mk span.strong{background:#EEEDFE;color:#3C3489}
.sp2495 .ph{font-size:12.5px;color:#4A4566}.sp2495 .cm{font-size:13px;color:#2B2253;margin-top:2px}
</style>`;
const JS = String.raw`<script id="b2495">
(function(){ const C = {}, NM = { fluency: 'Fluency', lexical: 'Vocabulary', grammar: 'Grammar', pron: 'Pronunciation' }, LV = { needs: 'Needs work', ok: 'OK', good: 'Good', strong: 'Strong' };
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const day = s => { try{ const d = new Date(s); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Manila' }) + '<br>' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(x){ return ''; } };
  function html(R){ return '<h2>Speaking history <span class="c">' + R.length + ' class' + (R.length === 1 ? '' : 'es') + ' · teachers and management only</span></h2>'
    + R.map(r => '<div class="row"><div class="d">' + day(r.created_at) + '</div><div><div class="t">' + e(r.set_title || (r.kind === 'ielts' ? 'IELTS Speaking' : 'Free talk')) + (r.minutes ? ' · ' + r.minutes + ' min' : '') + ' · Teacher ' + e(r.teacher) + '</div>'
      + (Object.keys(r.marks || {}).length ? '<div class="mk">' + ['fluency', 'lexical', 'grammar', 'pron'].filter(k => r.marks[k]).map(k => '<span class="' + e(r.marks[k]) + '">' + NM[k] + ' · ' + (LV[r.marks[k]] || '') + '</span>').join('') + '</div>' : '')
      + ((r.used || []).length ? '<div class="ph">Used: ' + r.used.map(e).join(' · ') + '</div>' : '') + ((r.practise || []).length ? '<div class="ph">To practise: ' + r.practise.slice(0, 8).map(e).join(' · ') + '</div>' : '')
      + (r.comment ? '<div class="cm">' + e(r.comment) + '</div>' : '') + '</div></div>').join(''); }
  function place(code){ const box = document.getElementById('stuSpk'), R = C[code]; if(!box) return; if(!R || !R.length){ box.remove(); return; } box.innerHTML = html(R); }
  function load(code){ fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-talk', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'speakList', token: TOKEN, code }) })
    .then(r => r.json()).then(j => { if(j && j.ok){ C[code] = j.rows || []; place(code); } }).catch(() => {}); }
  const sr = window.stuRender; if(typeof sr !== 'function') return;
  window.stuRender = function(){ const r = sr.apply(this, arguments);
    try{ if(typeof STU !== 'undefined' && STU && STU.code && typeof TOKEN !== 'undefined' && TOKEN && !document.getElementById('stuSpk')){ const code = String(STU.code).toUpperCase();
        const fb = [...document.querySelectorAll('section.sec h2')].find(h => /^Teacher feedback/.test(h.textContent || '')), anchor = fb ? fb.closest('section') : document.getElementById('stuSch');
        if(anchor){ anchor.insertAdjacentHTML('afterend', '<section class="sec sp2495" id="stuSpk"></section>'); if(C[code]) place(code); else document.getElementById('stuSpk').style.display = 'none'; if(!C[code]) load(code); else load(code); } } }catch(x){}
    return r; };
  const pl0 = place; place = function(code){ const b = document.getElementById('stuSpk'); if(b) b.style.display = ''; pl0(code); };
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + JS + '<script id="b2278">']]);
