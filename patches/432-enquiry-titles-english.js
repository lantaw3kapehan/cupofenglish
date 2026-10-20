// 20 Oct · Enquiries toolkit card titles in English only (the Chinese stays inside the pictures and messages).
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 432 · Misty: "remove the Chinese words here since this is management, inside it is the Chinese so it's okay".
   The Pictures & messages card titles drop their Chinese part ("Price list · 课程价格" → "Price list"). The buttons, descriptions and the pictures themselves are unchanged. */
(function(){
  const CJK = /[\\u3400-\\u9fff\\u3000-\\u303f\\uff00-\\uffef]/;
  function clean(root){ root.querySelectorAll('#v-enquiry .eq2-t').forEach(card => {
    if(card.dataset.en32) return; card.dataset.en32 = 1;
    const w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('button, .small.mute') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const T = []; while(w.nextNode()) T.push(w.currentNode);
    T.forEach(n => { if(!CJK.test(n.nodeValue)) return; let v = n.nodeValue.replace(/[\\u3400-\\u9fff\\u3000-\\u303f\\uff00-\\uffef]+/g, '').replace(/(^|\\s)@(\\s|$)/g, ' ').replace(/(\\s*·\\s*)+/g, ' · ').replace(/^\\s*·\\s*|\\s*·\\s*$/g, '');
      n.nodeValue = v; if(!v.trim() && n.parentElement && n.parentElement !== card && !n.parentElement.textContent.trim()) n.parentElement.style.display = 'none'; });
    /* a separator left at the end of the title (e.g. "kids & teens ·") */
    card.querySelectorAll('b, strong').forEach(b => { b.textContent = b.textContent.replace(/\\s*·\\s*$/, ''); });
    const t = T.filter(n => n.nodeValue.trim()); const last = t.filter(n => !(n.parentElement && n.parentElement.closest('.small.mute')))[0]; if(last) last.nodeValue = last.nodeValue.replace(/\\s*·\\s*$/, ''); }); }
  const _r = window.renderEnq; if(_r) window.renderEnq = function(){ const r = _r.apply(this, arguments); try{ clean(document); }catch(e){ console.warn('en32', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') clean(document); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
