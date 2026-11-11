/* 2082 (11 Nov, Misty: "CANCELLING A LESSON DOES NOT FEEL INSTANT" · "CAN YOU DO IT NOW INSTEAD?"). The class itself is saved in about
   half a second; the wait was the parent notice: the parent's Chinese message → English (trEn) and the English reason → Chinese (trZh)
   went through the Google Apps Script, 4–5 s each. The app now asks the same translation engine directly from this browser
   (about 0.6 s). If that does not answer in 5 s, the Apps Script is asked as before, so a translation is never lost. */
(function(){
  if(window.__2082) return; window.__2082 = 1;
  async function fast(fn, text){
    const t = String(text || '').trim(); if(!t || t.length > 2000) return null;
    const [sl, tl] = fn === 'trEn' ? ['zh-CN', 'en'] : ['en', 'zh-CN'];
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 5000) : 0;
    try{
      const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=' + sl + '&tl=' + tl + '&q=' + encodeURIComponent(t), { signal: ac ? ac.signal : undefined });
      if(!r.ok) return null;
      const j = await r.json(), out = (Array.isArray(j) && Array.isArray(j[0]) ? j[0] : []).map(p => Array.isArray(p) ? String(p[0] || '') : '').join('').trim();
      if(!out) return null;
      return fn === 'trEn' ? { ok: true, en: out, fast: true } : { ok: true, zh: out, fast: true };
    }catch(e){ return null; } finally{ clearTimeout(tid); } }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, all = arguments;
      if((fn === 'trEn' || fn === 'trZh') && a[0] && typeof TOKEN !== 'undefined' && a[0] === TOKEN)
        return fast(fn, a[1]).then(r => r || base.apply(self, all));
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2082 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
