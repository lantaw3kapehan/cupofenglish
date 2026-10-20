// 20 Oct · Payroll: "Copy for WeChat" next to "Pay checked by teachers" — a message with a link that opens the teacher's Pay screen, where she taps ✓ This is correct.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 471 · Misty: "not necessarily a notification, but I can forward and they check · like they click a button".
   Payroll › the "Pay checked by teachers" line gets a button "Copy for WeChat". The copied message:
   "Hi teachers! 😊 Your September 2026 pay is ready to check. Tap the link, check your amount and press ✓ This is correct (or Something's wrong): https://app.cupofenglishatph.com/#pay"
   The link opens the app on Pay with the check card and its two buttons. */
(function(){
  window.pay71Copy = function(){ const m = (typeof MO !== 'undefined' && MO && MO.payMonth) || 'last month';
    const t = 'Hi teachers! 😊 Your ' + m + ' pay is ready to check.\\nTap the link, check your amount and press ✓ This is correct (or Something\\'s wrong):\\nhttps://app.cupofenglishatph.com/#pay';
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Copied · paste it in the teachers\\' WeChat group'), () => { openSheet('<h1>Message for WeChat</h1><textarea class="in-t" rows="5" style="width:100%">' + esc(t) + '</textarea>'); }); };
  function run(){ document.querySelectorAll('#v-payroll .mini').forEach(m => { if(m.dataset.c71 || !/Pay checked by teachers/.test(m.textContent)) return; m.dataset.c71 = 1;
      m.insertAdjacentHTML('beforeend', '<button class="btn sm teal" onclick="pay71Copy()" title="A message with a link to their Pay screen">Copy for WeChat</button>'); }); }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ run(); }catch(e){} }); }).observe(document.body, { childList: true, subtree: true });
})();
` + "</script>\n\n</body>"]]);
