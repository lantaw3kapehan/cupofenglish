// 2329 (Misty 18 Nov): the Chinese reason on the cancel / reschedule picture was guessed from keywords ("They will start next week" →
// 学生身体不适, because "will" contains "ill"). Now the reason is translated by our parent translator (coe-tr trZhParent, Claude),
// the same as Give homework; the old quick translator is only the fallback. No keyword guessing any more.
const file = process.argv[2];
const inc = `<script id="b2329">
/* 18 Nov · 2329 · class-change reasons in native Chinese (coe-tr trZhParent), never guessed from keywords */
window.cxTr2329 = async function(text){ try{ const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 14000);
    const r = await fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-tr', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, signal: ac.signal,
      body: JSON.stringify({ token: TOKEN, fn: 'trZhParent', text }) }).then(x => x.json()).finally(() => clearTimeout(tid));
    if(r && r.ok && r.zh) return { zh: String(r.zh).trim().replace(/[。.]$/, '') + '。' }; }catch(e){}
  try{ return await api('trZh', TOKEN, text); }catch(e){ return null; } };
</script>
`;
require('../tools/lib.js')(file, [
['<script id="b2278">', inc + '<script id="b2278">'],
["CXP = { kind: 'cancel', e, why: w.r, by: w.by, zh: cxZh(w.r), cn: cxCnOf(e.code), url: '' };", "CXP = { kind: 'cancel', e, why: w.r, by: w.by, zh: '', cn: cxCnOf(e.code), url: '' };   /* 2329: translated, not guessed */"],
["CXP.zh=cxZh(this.value);$('cxZh').value=CXP.zh;", "CXP.zh='';$('cxZh').value='';"],
["api('trZh', TOKEN, w).then(r => { if(CXP !== P || P.why !== w || P.zhEdit || !r || !r.zh) return;", "(window.cxTr2329 ? cxTr2329(w) : api('trZh', TOKEN, w)).then(r => { if(CXP !== P || P.why !== w || P.zhEdit || !r || !r.zh) return;"]
]);
