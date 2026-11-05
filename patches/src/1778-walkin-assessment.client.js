<style>
#v-assess{padding-bottom:60px}
.as-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 12px}.as-h h1{margin:0}.as-h .grow{flex:1}
.as-card{background:#fff;border:1px solid var(--coe-line,#E7E5EE);border-radius:16px;padding:14px 16px;margin:0 0 12px}
.as-card h2{font-size:16px;margin:0 0 4px}.as-card h3{font-size:14px;margin:14px 0 6px;color:var(--coe-ink,#2B2450)}
.as-m{color:var(--coe-mute,#5E5A76);font-size:13px;line-height:1.45}
.as-li{display:flex;gap:12px;align-items:center;padding:12px 14px;border-top:1px solid #F1F0F6;cursor:pointer}.as-li:first-child{border-top:0}
.as-li .grow{flex:1;min-width:0}.as-li b{font-weight:700}
.as-k{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:3px 9px;background:#F1F0F6;color:#4C4868;margin-left:4px;white-space:nowrap}
.as-k.ok{background:#E6F4EC;color:#1E6E4C}.as-k.t{background:#E3F4F5;color:#00616A}.as-k.w{background:#FFF4DE;color:#7A4A00}
.as-tabs{display:flex;gap:6px;overflow-x:auto;margin:0 0 12px;border-bottom:1px solid var(--coe-line,#E7E5EE);padding-bottom:8px;scrollbar-width:none}
.as-tabs button{flex:none;border:0;background:none;padding:8px 14px;border-radius:10px;font:inherit;font-size:14px;font-weight:600;color:#4C4868;cursor:pointer}
.as-tabs button.on{background:#2B2450;color:#fff}
.as-q{padding:10px 0;border-top:1px dashed #E6E4EE}.as-q:first-of-type{border-top:0}
.as-q p{margin:0 0 6px;font-weight:600;color:#2B2450;font-size:14.5px;line-height:1.4}
.as-q textarea,.as-ta{width:100%;box-sizing:border-box;border:1px solid #D8D5E3;border-radius:10px;padding:8px 10px;font:inherit;font-size:14px;min-height:40px;resize:vertical;background:#FCFCFE}
.as-q textarea:focus,.as-ta:focus,.as-in:focus{outline:2px solid rgba(0,112,122,.45);border-color:#00707A;background:#fff}
.as-in{border:1px solid #D8D5E3;border-radius:10px;padding:9px 10px;font:inherit;font-size:14px;width:100%;box-sizing:border-box}
.as-cue{background:#EEF7F7;border-radius:14px;padding:14px 16px;margin:8px 0}.as-cue b{display:block;font-size:16px;color:#2B2253;margin-bottom:6px}
.as-cue ul{margin:6px 0 6px 18px;padding:0}.as-cue li{margin:2px 0}
.as-tm{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;margin:6px 0}
.as-tm .clk{font-variant-numeric:tabular-nums;font-weight:800;font-size:20px;color:#2B2253;min-width:62px}.as-tm .clk.end{color:#B42318}
.as-tm button{border:1px solid #D8D5E3;background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;color:#2B2450}
.as-tm button.go{background:#00707A;border-color:#00707A;color:#fff}
.as-cr{padding:10px 0;border-top:1px solid #F1F0F6}.as-cr:first-child{border-top:0}
.as-cr .t{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.as-cr .t b{font-size:14.5px}.as-cr .t .as-m{font-size:12.5px}
.as-bands{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
.as-bands button{width:38px;height:38px;border-radius:10px;border:1px solid #D8D5E3;background:#fff;font:inherit;font-weight:800;font-size:15px;color:#2B2450;cursor:pointer}
.as-bands button.on{background:#2B2253;border-color:#2B2253;color:#fff}
.as-bl{font-size:12px;color:#00616A;font-weight:700;margin-top:4px;min-height:15px}
.as-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:4px 0 2px}
.as-sum div{background:#F7F7FA;border-radius:12px;padding:10px 12px}.as-sum .n{font-family:var(--coe-font-brand,'Fredoka One');font-size:28px;color:#2B2253;line-height:1.1}
.as-sum .l{font-size:12px;color:#5E5A76;font-weight:600}.as-sum .c{font-size:12.5px;color:#00616A;font-weight:700}
.as-ess{white-space:pre-wrap;background:#FCFCFE;border:1px solid #E7E5EE;border-radius:12px;padding:12px 14px;font-size:14.5px;line-height:1.6;max-height:420px;overflow:auto;color:#2B2450}
.as-tbl{width:100%;border-collapse:collapse;font-size:13px}.as-tbl td,.as-tbl th{padding:7px 8px;border-top:1px solid #F1F0F6;text-align:left;vertical-align:top}
.as-tbl th{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#8A86A0}.as-tbl tr.on td{background:#E3F4F5;font-weight:700;color:#00575F}
.as-path{display:flex;flex-direction:column;gap:6px;margin-top:6px}.as-path button{text-align:left;border:1px solid #D8D5E3;background:#fff;border-radius:12px;padding:10px 12px;font:inherit;font-size:14px;cursor:pointer;color:#2B2450}
.as-path button.on{border-color:#00707A;background:#E3F4F5;font-weight:700;color:#00575F}
.as-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.as-st{font-size:12px;color:#8A86A0;margin-left:auto}
.as-link{font-size:12.5px;word-break:break-all;background:#F7F7FA;border-radius:10px;padding:8px 10px;margin-top:6px;color:#2B2450}
@media(max-width:560px){.as-sum{grid-template-columns:1fr 1fr}.as-bands button{width:34px;height:34px}}
</style>
<script>
/* 1778 · Walk-in assessment (IELTS-aligned): Speaking 3 parts + Academic Writing Task 2, scored by IELTS criteria. Everything saves to the
   database at once (coe-assess); the bands, the Speaking + Writing estimate and CEFR are counted by the database. The applicant can write the
   essay on her own phone through a link (seen here live), and the result goes to her as a link or a picture with the CupOfEnglish logo. */
(function(){
  if(window.__1778 || typeof NAV_M === 'undefined' || typeof VIEWS === 'undefined') return; window.__1778 = 1;
  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-assess', SITE = 'https://app.cupofenglishatph.com/assess/';
  const E = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const call = (op, o) => fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op, token: TOKEN }, o || {})) }).then(r => r.json());
  const Q_A = ['Could you introduce yourself and tell me a little about your educational background?', 'In what situations do you usually communicate in English?', 'What do you find most challenging about expressing yourself in English?', 'Do you prefer communicating through speaking or writing? Why?', 'How important do you think effective communication is in academic or professional life?'];
  const CUE = { t: 'Describe a situation when you had difficulty expressing your ideas clearly.', say: ['What the situation was', 'Who you were communicating with', 'Why you found it difficult', 'How you handled the situation'], end: 'And explain what you learned from the experience.' };
  const Q_C = ['Why do some educated individuals still struggle to communicate their ideas clearly?', 'Do you think effective communication is more important than grammatical accuracy?', 'How can schools help students develop stronger communication skills?', 'What are the advantages and disadvantages of using artificial intelligence to improve academic writing?', 'Should universities place greater emphasis on students’ communication skills?'];
  const ESSAY = 'Some people believe that universities should focus primarily on providing students with academic knowledge, while others argue that developing practical skills, such as communication and critical thinking, is equally important.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.';
  const SP = [['fc', 'Fluency and Coherence', 'Speaks at length without much effort; ideas are linked and easy to follow'], ['lr', 'Lexical Resource', 'Range and precision of vocabulary; can paraphrase; natural word choice'], ['gra', 'Grammatical Range and Accuracy', 'Variety of sentence structures; how often errors appear and whether they block meaning'], ['p', 'Pronunciation', 'Clear sounds, word and sentence stress, intonation; easy to understand']];
  const WR = [['tr', 'Task Response', 'Discusses both views and gives a clear opinion; ideas developed and supported with examples'], ['cc', 'Coherence and Cohesion', 'Clear paragraphs and progression; linking words used naturally, not mechanically'], ['lr', 'Lexical Resource', 'Range and accuracy of academic vocabulary; spelling and word formation'], ['gra', 'Grammatical Range and Accuracy', 'Mix of simple and complex sentences; accuracy and punctuation']];
  const BN = ['Did not attempt', 'Non-user', 'Intermittent user', 'Extremely limited user', 'Limited user', 'Modest user', 'Competent user', 'Good user', 'Very good user', 'Expert user'];
  const GUIDE = [[4, 4.5, '4.0–4.5', 'Limited communication; frequent language difficulties', 'B1 range'], [5, 5.5, '5.0–5.5', 'Developing communication; noticeable limitations in accuracy and complexity', 'B1–B2'], [6, 6.5, '6.0–6.5', 'Generally effective communication; some inconsistencies', 'B2'], [7, 7.5, '7.0–7.5', 'Good command; can communicate complex ideas effectively', 'C1 range'], [8, 9, '8.0–9.0', 'Very good to expert command', 'C1–C2']];
  const PATHS = ['Integrated Speaking and Academic Writing', 'Speaking and Communication Skills', 'Academic Writing Development'];
  const S = { list: null, a: null, tab: 'speak', pend: {}, t: 0, busy: 0, saved: '', tm: {}, poll: 0, typeEssay: false };
  const b1 = v => v == null || v === '' ? '—' : (+v).toFixed(1);
  // ---------- nav ----------
  try{ if(!NAV_M.some(x => x[0] === 'assess')){ const r = NAV_M.findIndex(x => x[0] === 'reports'); NAV_M.splice(r > -1 ? r + 1 : NAV_M.length - 1, 0, ['assess', 'Walk-in assessment', 'star', 1, 'People']); }
    if(VIEWS.indexOf('assess') < 0) VIEWS.push('assess');
    if(!document.getElementById('v-assess')){ const d = document.createElement('div'); d.id = 'v-assess'; d.className = 'hide'; const ref = document.getElementById('v-more'); ref.parentNode.insertBefore(d, ref); } }catch(e){ console.warn('1778 nav', e); }
  const V = () => document.getElementById('v-assess');
  // ---------- list ----------
  async function loadList(){ try{ const r = await call('list'); if(r && r.ok){ S.list = r.list; if(VIEW === 'assess' && !S.a) paintList(); } }catch(e){} }
  function chip(a){ return a.shared_at ? '<span class="as-k ok">Result sent</span>' : a.status === 'final' ? '<span class="as-k t">Final</span>' : '<span class="as-k w">In progress</span>'; }
  function paintList(){ const L = S.list;
    V().innerHTML = '<div class="as-h"><h1>Walk-in assessment</h1><span class="grow"></span><button class="btn teal" onclick="as1778.newForm()">+ New walk-in</button></div>' +
      '<div class="as-m" style="margin:-4px 0 12px">IELTS-aligned diagnostic · Speaking (15 min, 3 parts) and Academic Writing Task 2 (40 min) · scored by the IELTS criteria · saved to the database as you go.</div>' +
      '<div id="as-new"></div>' +
      (L == null ? '<div class="as-card">Loading…</div>' : !L.length ? '<div class="as-card as-m">No walk-in assessments yet. Tap “+ New walk-in” when she arrives.</div>' :
      '<div class="as-card" style="padding:0">' + L.map(a => '<div class="as-li" onclick="as1778.open(\'' + a.id + '\')"><div class="grow"><b>' + E(a.name) + '</b>' + chip(a) +
        '<div class="as-m">' + E(new Date(a.assess_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })) + (a.purpose ? ' · ' + E(a.purpose) : '') + (a.assessor ? ' · ' + E(a.assessor) : '') + '</div></div>' +
        '<div style="text-align:right;font-size:13px"><div>Speaking <b>' + b1(a.sp_band) + '</b></div><div>Writing <b>' + b1(a.wr_band) + '</b></div>' + (a.cefr ? '<div class="as-m">' + E(a.cefr) + '</div>' : '') + '</div></div>').join('') + '</div>'); }
  function newForm(){ const n = document.getElementById('as-new'); if(!n) return;
    n.innerHTML = '<div class="as-card"><h2>New walk-in</h2><div style="display:grid;gap:8px;margin-top:8px"><input class="as-in" id="as-nn" placeholder="Full name"><input class="as-in" id="as-nc" placeholder="Phone / email / WeChat (optional)"><input class="as-in" id="as-np" placeholder="Purpose, e.g. IELTS plan, study abroad, work (optional)"></div>' +
      '<div class="as-row"><button class="btn teal" id="as-nb" onclick="as1778.create()">Start assessment</button><button class="btn ghost" onclick="document.getElementById(\'as-new\').innerHTML=\'\'">Cancel</button></div></div>';
    setTimeout(() => { const i = document.getElementById('as-nn'); if(i) i.focus(); }, 50); }
  async function create(){ const nm = (document.getElementById('as-nn') || {}).value || ''; if(!nm.trim()) return toast('Type her name first');
    const b = document.getElementById('as-nb'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    try{ const r = await call('new', { name: nm.trim(), contact: (document.getElementById('as-nc') || {}).value || '', purpose: (document.getElementById('as-np') || {}).value || '' });
      if(!r || !r.ok) throw new Error(r && (r.msg || r.error) || 'Not saved'); S.a = r.a; S.tab = 'speak'; (S.list = S.list || []).unshift(r.a); paint(); }
    catch(e){ toast(String(e.message || e)); if(b){ b.disabled = false; b.textContent = 'Start assessment'; } } }
  async function open(id){ const c = (S.list || []).find(x => x.id === id); S.a = c ? Object.assign({ sp: {}, wr: {}, notes: {} }, c) : null; S.tab = 'speak'; S.typeEssay = false; if(S.a) paint(); else V().innerHTML = '<div class="as-card">Loading…</div>';
    try{ const r = await call('get', { id }); if(r && r.ok){ S.a = r.a; paint(); } else toast('Could not open'); }catch(e){ toast('Could not open · check the connection'); } }
  function back(){ flush(); S.a = null; clearTimers(); paintList(); loadList(); }
  // ---------- saving ----------
  function put(path, val){ const a = S.a; if(!a) return; const [k, sub] = path.split('.');
    if(sub){ a[k] = Object.assign({}, a[k] || {}, { [sub]: val }); S.pend[k] = Object.assign({}, S.pend[k] || {}, { [sub]: val }); } else { a[k] = val; S.pend[k] = val; }
    status('Saving…'); clearTimeout(S.t); S.t = setTimeout(flush, 500); }
  async function flush(){ clearTimeout(S.t); const a = S.a; if(!a || !Object.keys(S.pend).length) return; if(S.busy){ S.t = setTimeout(flush, 300); return; }
    const patch = S.pend; S.pend = {}; S.busy = 1;
    try{ const r = await call('save', { id: a.id, patch }); if(!r || !r.ok) throw new Error(r && r.msg || 'Not saved');
      if(S.a && S.a.id === r.a.id){ merge(r.a); } status('Saved · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })); }
    catch(e){ Object.keys(patch).forEach(k => { if(S.pend[k] === undefined) S.pend[k] = patch[k]; else if(typeof patch[k] === 'object') S.pend[k] = Object.assign({}, patch[k], S.pend[k]); }); status('Not saved · retrying'); S.t = setTimeout(flush, 3000); }
    S.busy = 0; }
  function status(t){ S.saved = t; const s = document.getElementById('as-st'); if(s) s.textContent = t; }
  // server copy → screen, without touching what is being typed
  function merge(n){ const a = S.a; ['sp_band', 'wr_band', 'combined', 'cefr', 'cefr_sp', 'cefr_wr', 'status', 'shared_at', 'essay_words', 'essay_started_at', 'essay_submitted_at', 'rkey', 'wkey', 'updated_at'].forEach(k => a[k] = n[k]);
    const foc = document.activeElement;
    ['strengths', 'improve', 'pathway', 'name', 'contact', 'purpose'].forEach(k => { if(S.pend[k] === undefined) a[k] = n[k]; });
    ['sp', 'wr', 'notes'].forEach(k => { const p = S.pend[k] || {}; a[k] = Object.assign({}, n[k] || {}, p); });
    if(!(S.typeEssay && S.pend.essay !== undefined)) a.essay = n.essay;
    document.querySelectorAll('#v-assess [data-f]').forEach(el => { if(el === foc) return; const f = el.dataset.f, [k, sub] = f.split('.'), v = sub ? (a[k] || {})[sub] : a[k]; if(el.value !== (v == null ? '' : String(v))) el.value = v == null ? '' : v; });
    paintLive(); }
  // ---------- timers ----------
  function clearTimers(){ Object.values(S.tm).forEach(t => clearInterval(t.iv)); S.tm = {}; }
  function timerHtml(id, steps){ return '<div class="as-tm" id="as-tm-' + id + '"><span class="clk" id="as-clk-' + id + '">' + fmt(steps[0][1] * 60) + '</span>' + steps.map(s => '<button onclick="as1778.tStart(\'' + id + '\',' + s[1] + ',\'' + E(s[0]) + '\')">' + E(s[0]) + '</button>').join('') + '<button onclick="as1778.tStop(\'' + id + '\')">Stop</button><span class="as-m" id="as-tl-' + id + '"></span></div>'; }
  const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function tStart(id, min, label){ tStop(id); const end = Date.now() + min * 60000, t = { end, iv: 0 }; S.tm[id] = t; const lab = document.getElementById('as-tl-' + id); if(lab) lab.textContent = label;
    const tick = () => { const c = document.getElementById('as-clk-' + id); const left = (t.end - Date.now()) / 1000; if(c){ c.textContent = fmt(left); c.classList.toggle('end', left <= 0); } if(left <= 0){ clearInterval(t.iv); toast(label + ' · time is up'); try{ navigator.vibrate && navigator.vibrate(300); }catch(e){} } };
    t.iv = setInterval(tick, 500); tick(); }
  function tStop(id){ const t = S.tm[id]; if(t){ clearInterval(t.iv); delete S.tm[id]; } const c = document.getElementById('as-clk-' + id); if(c) c.classList.remove('end'); }
  // ---------- editor ----------
  const note = (k, ph) => '<textarea data-f="notes.' + k + '" rows="2" placeholder="' + E(ph || 'Notes: what she said, errors, good language') + '" oninput="as1778.put(this.dataset.f,this.value)">' + E((S.a.notes || {})[k] || '') + '</textarea>';
  function crit(sk, C){ const v = S.a[sk] || {}; return C.map(([k, t, h]) => '<div class="as-cr"><div class="t"><b>' + E(t) + '</b><span class="as-m">' + E(h) + '</span></div><div class="as-bands" data-sk="' + sk + '" data-k="' + k + '">' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => '<button class="' + (v[k] === n ? 'on' : '') + '" onclick="as1778.band(\'' + sk + '\',\'' + k + '\',' + n + ')">' + n + '</button>').join('') + '</div><div class="as-bl" id="as-bl-' + sk + k + '">' + (v[k] != null ? 'Band ' + v[k] + ' · ' + BN[v[k]] : '') + '</div></div>').join(''); }
  function band(sk, k, n){ const cur = (S.a[sk] || {})[k]; const val = cur === n ? '' : n; put(sk + '.' + k, val === '' ? null : val);
    document.querySelectorAll('#v-assess .as-bands[data-sk="' + sk + '"][data-k="' + k + '"] button').forEach((b, i) => b.classList.toggle('on', i === val));
    const l = document.getElementById('as-bl-' + sk + k); if(l) l.textContent = val === '' ? '' : 'Band ' + val + ' · ' + BN[val]; }
  function sumHtml(){ const a = S.a; return '<div class="as-sum"><div><div class="l">Speaking</div><div class="n">' + b1(a.sp_band) + '</div><div class="c">' + E(a.cefr_sp || '') + '</div></div><div><div class="l">Writing Task 2</div><div class="n">' + b1(a.wr_band) + '</div><div class="c">' + E(a.cefr_wr || '') + '</div></div><div><div class="l">Speaking + Writing</div><div class="n">' + b1(a.combined) + '</div><div class="c">' + E(a.cefr || '') + '</div></div></div>' +
    '<div class="as-m" style="margin-top:6px">Counted by the database: the four criteria averaged and rounded down to the half band; Speaking + Writing averaged to the nearest half band (as IELTS does for the overall). An internal estimate, not an official IELTS result.</div>'; }
  function paintLive(){ const s = document.getElementById('as-sum'); if(s) s.innerHTML = sumHtml(); const e = document.getElementById('as-ess'); if(e) e.innerHTML = essayLive(); const g = document.getElementById('as-guide'); if(g) g.innerHTML = guideHtml(); const sh = document.getElementById('as-share'); if(sh) sh.innerHTML = shareHtml(); }
  function essayLive(){ const a = S.a, st = a.essay_started_at ? Date.parse(a.essay_started_at) : 0, sub = a.essay_submitted_at;
    let state = !st && !a.essay ? 'Not started yet. Send her the writing link, or type / paste her paper essay below.' : sub ? 'Submitted at ' + new Date(sub).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : st ? 'Writing · ' + fmt(Math.max(0, 40 * 60 - (Date.now() - st) / 1000)) + ' of 40:00 left' : '';
    const w = a.essay_words || 0;
    return '<div class="as-row" style="margin:0 0 8px;align-items:center"><span class="as-k ' + (w >= 250 ? 'ok' : 'w') + '">' + w + ' words' + (w < 250 ? ' · under 250' : '') + '</span><span class="as-m">' + E(state) + '</span></div>' +
      (S.typeEssay ? '' : '<div class="as-ess">' + (a.essay ? E(a.essay) : '<span class="as-m">Her essay appears here as she types.</span>') + '</div>'); }
  function guideHtml(){ const c = S.a.combined; return '<table class="as-tbl"><tr><th>IELTS band</th><th>General interpretation</th><th>Approx. CEFR</th></tr>' + GUIDE.map(g => '<tr class="' + (c != null && +c >= g[0] && +c <= g[1] ? 'on' : '') + '"><td>' + g[2] + '</td><td>' + E(g[3]) + '</td><td>' + E(g[4]) + '</td></tr>').join('') + '</table><div class="as-m" style="margin-top:6px">CEFR comparisons are approximate and are not exact conversions. IELTS band 4.0 can also overlap A2/B1 depending on the skill.</div>'; }
  function shareHtml(){ const a = S.a, link = SITE + '?r=' + a.rkey;
    return a.shared_at ? '<div class="as-m"><b style="color:#1E6E4C">Result link is on.</b> She sees the latest scores and notes whenever she opens it.</div><div class="as-link">' + E(link) + '</div><div class="as-row"><button class="btn teal" onclick="as1778.copy(\'' + link + '\',\'Result link copied\')">Copy result link</button><button class="btn ghost" onclick="as1778.copy(as1778.msg(),\'Message copied\')">Copy message</button><button class="btn ghost" onclick="window.open(\'' + link + '\',\'_blank\')">Open</button><button class="btn ghost" onclick="as1778.unshare()">Turn link off</button></div>'
      : '<div class="as-m">When the scores and notes are ready, tap Share. She gets a page with the CupOfEnglish logo, her bands, what they mean and the recommended pathway.</div><div class="as-row"><button class="btn teal" onclick="as1778.share()"' + (a.sp_band == null && a.wr_band == null ? ' disabled title="Score at least one skill first"' : '') + '>Share result</button></div>'; }
  function paint(){ const a = S.a; if(!a) return paintList(); clearTimers();
    const tabs = [['speak', '1 · Speaking'], ['write', '2 · Writing'], ['result', '3 · Result']];
    let h = '<div class="as-h"><button class="btn ghost sm" onclick="as1778.back()">‹ All</button><h1 style="font-size:20px">' + E(a.name) + '</h1>' + chip(a) + '<span class="as-st" id="as-st">' + E(S.saved) + '</span></div>' +
      '<div class="as-tabs">' + tabs.map(t => '<button class="' + (S.tab === t[0] ? 'on' : '') + '" onclick="as1778.tab(\'' + t[0] + '\')">' + t[1] + '</button>').join('') + '</div>';
    if(S.tab === 'speak'){
      h += '<div class="as-card"><h2>Part 1 — Introduction and interview <span class="as-m">(4–5 min)</span></h2><div class="as-m">Ask naturally; no written answers prepared.</div>' + timerHtml('a', [['5 min', 5]]) + Q_A.map((q, i) => '<div class="as-q"><p>' + (i + 1) + '. ' + E(q) + '</p>' + note('a' + (i + 1)) + '</div>').join('') + '</div>' +
        '<div class="as-card"><h2>Part 2 — Individual long turn <span class="as-m">(3–4 min)</span></h2><div class="as-cue"><b>' + E(CUE.t) + '</b>You should say:<ul>' + CUE.say.map(s => '<li>' + E(s) + '</li>').join('') + '</ul>' + E(CUE.end) + '<div class="as-m" style="margin-top:6px">Preparation: 1 minute · Speaking: 1–2 minutes</div></div>' +
        timerHtml('b', [['Prepare 1:00', 1], ['Speak 2:00', 2]]) + '<div class="as-q">' + note('b', 'Notes on her long turn') + '</div></div>' +
        '<div class="as-card"><h2>Part 3 — Discussion <span class="as-m">(4–5 min)</span></h2>' + timerHtml('c', [['5 min', 5]]) + Q_C.map((q, i) => '<div class="as-q"><p>' + (i + 1) + '. ' + E(q) + '</p>' + note('c' + (i + 1)) + '</div>').join('') + '</div>' +
        '<div class="as-card"><h2>Speaking scoring</h2><div class="as-m">A band from 0 to 9 for each criterion; the four carry equal weight. Tap again to clear.</div>' + crit('sp', SP) + '<div id="as-sum" style="margin-top:10px">' + sumHtml() + '</div></div>';
    } else if(S.tab === 'write'){
      const wl = SITE + '?w=' + a.wkey;
      h += '<div class="as-card"><h2>Academic Writing · Task 2 <span class="as-m">(40 min · at least 250 words)</span></h2><div class="as-cue" style="white-space:pre-wrap">' + E(ESSAY) + '</div>' +
        '<h3>Her writing link</h3><div class="as-m">Open it on her phone or a laptop. The 40 minutes start when she taps Start; it saves as she types and you see it below live.</div><div class="as-link">' + E(wl) + '</div>' +
        '<div class="as-row"><button class="btn teal" onclick="as1778.copy(\'' + wl + '\',\'Writing link copied\')">Copy writing link</button><button class="btn ghost" onclick="window.open(\'' + wl + '\',\'_blank\')">Open here</button>' +
        (a.essay_submitted_at ? '<button class="btn ghost" onclick="as1778.essayOpen()">Let her write again</button>' : a.essay_started_at ? '<button class="btn ghost" onclick="as1778.essayClose()">End writing now</button>' : '') + '</div></div>' +
        '<div class="as-card"><h2>Her essay</h2><div id="as-ess">' + essayLive() + '</div>' +
        (S.typeEssay ? '<textarea class="as-ta" data-f="essay" rows="14" placeholder="Type or paste her essay here" oninput="as1778.put(\'essay\',this.value)">' + E(a.essay || '') + '</textarea><div class="as-row"><button class="btn ghost sm" onclick="as1778.typeEssay(0)">Done typing</button></div>'
          : '<div class="as-row"><button class="btn ghost sm" onclick="as1778.typeEssay(1)">Type or paste a paper essay instead</button></div>') +
        '<h3>Writing notes</h3>' + note('w', 'Strong points, repeated errors, structure') + '</div>' +
        '<div class="as-card"><h2>Writing scoring</h2><div class="as-m">Whole bands 0–9 by the IELTS Writing descriptors. This is Task 2 only; a full IELTS Writing score also includes Task 1 (Task 2 counts double).</div>' + crit('wr', WR) + '<div id="as-sum" style="margin-top:10px">' + sumHtml() + '</div></div>';
    } else {
      h += '<div class="as-card"><h2>Scores</h2><div id="as-sum">' + sumHtml() + '</div></div>' +
        '<div class="as-card"><h2>What the bands mean</h2><div id="as-guide">' + guideHtml() + '</div></div>' +
        '<div class="as-card"><h2>Final diagnostic record</h2><h3>Observed strengths</h3><textarea class="as-ta" data-f="strengths" rows="3" oninput="as1778.put(\'strengths\',this.value)">' + E(a.strengths || '') + '</textarea>' +
        '<h3>Areas for improvement</h3><textarea class="as-ta" data-f="improve" rows="3" oninput="as1778.put(\'improve\',this.value)">' + E(a.improve || '') + '</textarea>' +
        '<h3>Recommended learning pathway</h3><div class="as-path">' + PATHS.map(p => '<button class="' + (a.pathway === p ? 'on' : '') + '" onclick="as1778.path(this,\'' + E(p) + '\')">' + E(p) + '</button>').join('') + '</div>' +
        '<h3>Details (optional)</h3><input class="as-in" data-f="contact" placeholder="Phone / email / WeChat" value="' + E(a.contact || '') + '" oninput="as1778.put(\'contact\',this.value)"><input class="as-in" style="margin-top:6px" data-f="purpose" placeholder="Purpose" value="' + E(a.purpose || '') + '" oninput="as1778.put(\'purpose\',this.value)"></div>' +
        '<div class="as-card"><h2>Send to her</h2><div id="as-share">' + shareHtml() + '</div><div class="as-row"><button class="btn ghost" id="as-pic" onclick="as1778.pic()">Copy picture</button><button class="btn ghost" onclick="as1778.pic(1)">' + (navigator.share ? 'Share · save picture' : 'Save picture') + '</button></div>' +
        '<div class="as-row" style="margin-top:16px"><button class="btn ghost sm" style="color:#B42318" onclick="as1778.del()">Remove this assessment</button></div></div>';
    }
    V().innerHTML = h; }
  function tab(t){ flush(); S.tab = t; S.typeEssay = false; paint(); window.scrollTo(0, 0); }
  function path(btn, p){ const val = S.a.pathway === p ? '' : p; put('pathway', val); document.querySelectorAll('#v-assess .as-path button').forEach(b => b.classList.toggle('on', b.textContent === val)); }
  async function act(op, extra){ flush(); try{ const r = await call(op, Object.assign({ id: S.a.id }, extra || {})); if(!r || !r.ok) throw new Error(r && r.msg || 'Not saved'); merge(r.a); return r; }catch(e){ toast(String(e.message || e)); } }
  async function share(){ const r = await act('share'); if(r){ copy(SITE + '?r=' + S.a.rkey, 'Result link copied · send it to her'); paint(); } }
  async function unshare(){ if(await act('unshare')) paint(); }
  async function essayOpen(){ if(await act('save', { patch: { essay_open: 1 } })) paint(); }
  async function essayClose(){ if(await act('save', { patch: { essay_close: 1 } })) paint(); }
  async function del(){ if(!window.confirm || !confirm('Remove ' + S.a.name + '’s assessment? Her links stop working.')) return; if(await act('del')){ S.list = (S.list || []).filter(x => x.id !== S.a.id); S.a = null; paintList(); toast('Removed'); } }
  function copy(t, msg){ const ok = () => toast(msg || 'Copied'); const fb = () => { const x = document.createElement('textarea'); x.value = t; document.body.appendChild(x); x.select(); try{ document.execCommand('copy'); ok(); }catch(e){} x.remove(); };
    if(navigator.clipboard) navigator.clipboard.writeText(t).then(ok, fb); else fb(); }
  function msg(){ const a = S.a, f = String(a.name || '').split(' ')[0]; return 'Hi ' + f + ', thank you for taking the CupOfEnglish English Proficiency Assessment today.\n\nSpeaking: ' + b1(a.sp_band) + (a.cefr_sp ? ' (' + a.cefr_sp + ')' : '') + '\nAcademic Writing Task 2: ' + b1(a.wr_band) + (a.cefr_wr ? ' (' + a.cefr_wr + ')' : '') + (a.pathway ? '\nRecommended pathway: ' + a.pathway : '') + '\n\nYour full result, with what each band means: ' + SITE + '?r=' + a.rkey; }
  // ---------- picture (same design as the calendar / payslip pictures) ----------
  const img = u => new Promise(ok => { if(!u) return ok(null); const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = u; });
  async function fonts(){ try{ await Promise.race([Promise.all([['COE Card Fredoka', 'fonts/card-fredoka-one.woff2', '400'], ['COE Card Inter', 'fonts/card-inter-var.woff2', '100 900']].map(x => { const f = new FontFace(x[0], 'url(' + x[1] + ') format("woff2")', { weight: x[2] }); document.fonts.add(f); return f.load(); })), new Promise(z => setTimeout(z, 5000))]); }catch(e){} }
  async function drawPic(){ await fonts(); const a = S.a, NAVY = '#2B2253', TEAL = '#0E7C7B', MUTE = '#6B6880', WD = 1080, PAD = 72;
    const F = "'COE Card Inter',Inter,'PingFang SC',system-ui,sans-serif", BR = "'COE Card Fredoka','Fredoka One',Inter,sans-serif";
    const [logo, tag] = await Promise.all([img((document.querySelector('#login img') || {}).src), img((document.querySelector('#login .tagl img') || {}).src)]);
    const run = (cv) => { const c = cv.getContext('2d');
    const rr = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
    const wrap = (t, x, y, w, lh) => { String(t || '').split(/\n/).forEach(par => { let line = ''; par.split(' ').forEach(wd => { const tt = line ? line + ' ' + wd : wd; if(c.measureText(tt).width > w && line){ c.fillText(line, x, y); y += lh; line = wd; } else line = tt; }); c.fillText(line, x, y); y += lh; }); return y; };
    c.fillStyle = '#F1F5F6'; c.fillRect(0, 0, WD, cv.height); c.fillStyle = '#fff'; rr(24, 24, WD - 48, cv.height - 48, 40); c.fill();
    if(logo){ const lh = 96, lw = lh * logo.width / logo.height; c.drawImage(logo, PAD, 64, lw, lh); }
    const pill = 'English Assessment'; c.font = '700 26px ' + F; const pw = c.measureText(pill).width + 48; c.fillStyle = '#ECE9F7'; rr(WD - PAD - pw, 82, pw, 60, 30); c.fill(); c.fillStyle = NAVY; c.textBaseline = 'middle'; c.fillText(pill, WD - PAD - pw + 24, 112); c.textBaseline = 'alphabetic';
    c.fillStyle = '#E8E6EF'; c.fillRect(PAD, 196, WD - PAD * 2, 2);
    c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText('Initial English Proficiency Assessment · IELTS-aligned', PAD, 248);
    c.fillStyle = NAVY; c.font = '400 64px ' + BR; c.fillText(a.name || '', PAD, 324);
    c.fillStyle = '#4A4766'; c.font = '400 28px ' + F; c.fillText([new Date(a.assess_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), a.assessor ? 'Assessor: ' + a.assessor : ''].filter(Boolean).join('  ·  '), PAD, 372);
    let y = 420; const tw = (WD - PAD * 2 - 24) / 2;
    [['Speaking', a.sp_band, a.cefr_sp, '#EEF7F7'], ['Academic Writing · Task 2', a.wr_band, a.cefr_wr, '#F2F0FA']].forEach((t, i) => { const x = PAD + i * (tw + 24); c.fillStyle = t[3]; rr(x, y, tw, 220, 28); c.fill();
      c.fillStyle = MUTE; c.font = '600 24px ' + F; c.fillText(t[0], x + 32, y + 50); c.fillStyle = NAVY; c.font = '400 104px ' + BR; c.fillText(b1(t[1]), x + 30, y + 160);
      if(t[2]){ c.fillStyle = TEAL; c.font = '700 26px ' + F; c.fillText('CEFR ' + t[2], x + 32, y + 198); } });
    y += 250;
    if(a.combined != null){ c.fillStyle = NAVY; rr(PAD, y, WD - PAD * 2, 92, 24); c.fill(); c.fillStyle = '#fff'; c.font = '600 28px ' + F; c.textBaseline = 'middle'; c.fillText('Speaking + Writing estimate', PAD + 32, y + 46); c.textAlign = 'right'; c.font = '400 44px ' + BR; c.fillText(b1(a.combined) + (a.cefr ? '  ·  ' + a.cefr : ''), WD - PAD - 32, y + 48); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; y += 124; }
    const bars = (title, C, v, top) => { c.fillStyle = NAVY; c.font = '700 28px ' + F; c.fillText(title, PAD, top); top += 22;
      C.forEach(([k, t]) => { c.fillStyle = '#4A4766'; c.font = '400 24px ' + F; c.fillText(t, PAD, top + 32); const bx = PAD + 470, bw = WD - PAD - bx - 70; c.fillStyle = '#EEEDF3'; rr(bx, top + 12, bw, 24, 12); c.fill();
        if(v[k] != null){ c.fillStyle = TEAL; rr(bx, top + 12, Math.max(24, bw * v[k] / 9), 24, 12); c.fill(); } c.fillStyle = NAVY; c.font = '700 26px ' + F; c.textAlign = 'right'; c.fillText(v[k] != null ? String(v[k]) : '—', WD - PAD, top + 34); c.textAlign = 'left'; top += 52; }); return top + 18; };
    y = bars('Speaking criteria', SP, a.sp || {}, y + 20); y = bars('Writing criteria', WR, a.wr || {}, y + 20);
    const block = (label, text, bg) => { if(!String(text || '').trim()) return; c.font = '400 26px ' + F; const lines = []; const test = document.createElement('canvas').getContext('2d'); test.font = c.font;
      let hh = 0; String(text).split(/\n/).forEach(par => { let line = ''; par.split(' ').forEach(wd => { const tt = line ? line + ' ' + wd : wd; if(test.measureText(tt).width > WD - PAD * 2 - 64 && line){ hh++; line = wd; } else line = tt; }); hh++; });
      const h = 76 + hh * 38; c.fillStyle = bg; rr(PAD, y, WD - PAD * 2, h, 24); c.fill(); c.fillStyle = MUTE; c.font = '700 22px ' + F; c.fillText(label.toUpperCase(), PAD + 32, y + 44); c.fillStyle = NAVY; c.font = '400 26px ' + F; wrap(text, PAD + 32, y + 88, WD - PAD * 2 - 64, 38); y += h + 20; };
    y += 10; block('Observed strengths', a.strengths, '#EEF7F7'); block('Areas for improvement', a.improve, '#FFF6E8'); block('Recommended learning pathway', a.pathway, '#F2F0FA');
    y += 10; c.fillStyle = MUTE; c.font = '400 21px ' + F; c.textAlign = 'center'; y = wrap('Internal estimate aligned with IELTS band descriptors · not an official IELTS result · CEFR levels are approximate', WD / 2, y + 10, WD - PAD * 2, 30); c.textAlign = 'left';
    if(tag){ const tw2 = 260, th = tw2 * tag.height / tag.width; c.drawImage(tag, WD / 2 - tw2 / 2, y + 20, tw2, th); y += th + 40; }
    return y; };
    const m = document.createElement('canvas'); m.width = WD; m.height = 4000; const H = Math.ceil(run(m) + 64);
    const out = document.createElement('canvas'); out.width = WD; out.height = H; run(out); return out; }
  async function pic(save){ const b = document.getElementById('as-pic'); flush(); if(b){ b.disabled = true; b.textContent = 'Making the picture…'; }
    try{ const cv = await drawPic(), blob = await new Promise(z => cv.toBlob(z, 'image/png')), name = 'Assessment-' + String(S.a.name || '').replace(/\s+/g, '-') + '.png';
      if(!save && window.ClipboardItem){ try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Picture copied · paste it in the chat'); return; }catch(x){} }
      const f = new File([blob], name, { type: 'image/png' }); if(navigator.canShare && navigator.canShare({ files: [f] })){ try{ await navigator.share({ files: [f] }); return; }catch(x){ if(x && x.name === 'AbortError') return; } }
      const l = document.createElement('a'); l.href = URL_.createObjectURL(blob); l.download = name; document.body.appendChild(l); l.click(); l.remove(); toast('Picture saved'); }
    catch(e){ console.warn(e); toast('Could not make the picture · try again'); } finally { if(b){ b.disabled = false; b.textContent = 'Copy picture'; } } }
  const URL_ = window.URL;
  // ---------- live: the essay and the other person's changes come in every few seconds ----------
  async function poll(){ if(VIEW !== 'assess' || !S.a || document.hidden || S.busy || Object.keys(S.pend).length) return; try{ const r = await call('get', { id: S.a.id }); if(r && r.ok && S.a && r.a.id === S.a.id && !Object.keys(S.pend).length){ const ch = r.a.updated_at !== S.a.updated_at; merge(r.a); if(ch && S.tab === 'result'){ const p = document.querySelectorAll('#v-assess .as-path button'); p.forEach(b => b.classList.toggle('on', b.textContent === S.a.pathway)); } } }catch(e){} }
  setInterval(poll, 4000); setInterval(() => { if(VIEW === 'assess' && S.a && S.tab === 'write'){ const e = document.getElementById('as-ess'); if(e && S.a.essay_started_at && !S.a.essay_submitted_at) e.innerHTML = essayLive(); } }, 1000);
  window.as1778 = { newForm, create, open, back, put, band, tab, path, share, unshare, essayOpen, essayClose, del, copy, msg, pic, tStart, tStop, typeEssay: v => { S.typeEssay = !!v; flush(); paint(); } };
  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'assess'){ if(S.a) paint(); else { paintList(); loadList(); } } else if(S.a) flush(); }catch(e){} return r; };
  const w0 = () => { if(typeof D !== 'undefined' && D && D.mgr){ try{ buildNav(); }catch(e){} if(VIEW === 'assess') go('assess'); } else setTimeout(w0, 1500); }; setTimeout(w0, 1200);
})();
</script>
