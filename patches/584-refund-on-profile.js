// 22 Oct · Misty: "once refunded, it's not showing on their profile?"
// Student page (management): a coral "Refunded" pill beside the name and one line under the details:
//   ↩ Refunded R-1 · 3 Oct 2026 · 7 paid lessons · ¥525 · to the family · via Alipay   [Open]
// Open shows the refund (message to copy, refund note picture, sheet status). Void refunds are not shown.
require('../tools/lib.js')(process.argv[2], [
["  /* Refund note picture */",
 `  /* 584 · the refund on the student's page */
  const RFC = {};   /* code → { at, list } */
  const live = L => (L || []).filter(x => x.status !== 'void');
  function fromRec(code, x){ return { code, name: x.name || code, cn: x.cn || '', teacher: x.teacher || '', left: +x.left_lessons, free: +x.free_lessons, rate: +x.rate, adjust: +x.adjust || 0, reason: x.adjust_reason || '',
    payTo: x.pay_to || 'Family', wallet: x.wallet || '', day: x.day, sale: { invoice: x.sale_invoice || '', partner: x.partner || '' }, done: x, sheetOk: x.status === 'done', sheetNote: x.sheet_note || (x.status === 'sheet?' ? 'not confirmed' : ''), past: [] }; }
  window.rfView = async function(code, no){ try{ const c = RFC[code]; const L = c ? c.list : (await call('refund_list', { code })).refunds || []; const x = L.find(y => y.no === no) || live(L)[0]; if(!x) return toast('No refund found');
      R = fromRec(code, x); R.msg = msg(); window._stuOpen = null; openSheet('<div class="rf"></div>'); paint(); }catch(e2){ toast(e2.message || 'Could not open'); } };
  function heroRefund(){ try{ if(!(D && D.mgr) || typeof STU === 'undefined' || !STU || !STU.code) return; const code = STU.code, b = $('sheetBody'); if(!b) return; const hero = b.querySelector('.shero'); if(!hero) return;
      const c = RFC[code]; if(!c || Date.now() - c.at > 6e4){ if(!(c && c.busy)){ RFC[code] = Object.assign(c || { list: [] }, { busy: 1 }); call('refund_list', { code }).then(j => { RFC[code] = { at: Date.now(), list: j.refunds || [] }; heroRefund(); }).catch(() => { RFC[code] = { at: Date.now(), list: (c && c.list) || [] }; }); } if(!c || !c.at) return; }
      const L = live(RFC[code].list); const g = hero.querySelector('.grow'); if(!g) return; const old = g.querySelector('.rf-line'), h1 = hero.querySelector('h1'), op = h1 && h1.querySelector('.rf-pill');
      if(!L.length){ if(old) old.remove(); if(op) op.remove(); return; }
      const x = L[0], txt = '↩ Refunded R-' + x.no + ' · ' + fd(x.day) + ' · ' + n1(x.refund_lessons) + ' paid lessons · ' + yen(x.amount) + (x.pay_to && x.pay_to !== 'Family' ? ' · to ' + x.pay_to : ' · to the family') + (x.wallet ? ' · via ' + x.wallet : '') + (L.length > 1 ? ' · ' + L.length + ' refunds' : '');
      if(!old || old.dataset.t !== txt){ if(old) old.remove(); const d = document.createElement('div'); d.className = 'rf-line'; d.dataset.t = txt;
        d.innerHTML = '<span>' + e(txt) + '</span><button type="button" onclick="rfView(\\'' + e(code) + '\\',' + x.no + ')">Open</button>'; g.appendChild(d); }
      if(h1 && !op) h1.insertAdjacentHTML('beforeend', '<span class="rf-pill">Refunded</span>'); }catch(e2){} }
  const css2 = document.createElement('style'); css2.textContent = '#sheetBody .shero .rf-line{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;background:#FBECE8;color:#9A3A26;border-radius:12px;padding:8px 12px;font-size:13.5px;font-weight:600}' +
    '#sheetBody .shero .rf-line button{border:1px solid #F0C9BF;background:#fff;color:#9A3A26;border-radius:999px;padding:4px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}' +
    '#sheetBody .shero h1 .rf-pill{font-size:11.5px;font-weight:700;line-height:1;font-family:inherit;padding:5px 9px;border-radius:999px;background:#FBECE8;color:#B4442F;letter-spacing:.02em}#sheetBody .shero h1:has(.rf-pill) .stp,#sheetBody .shero h1:has(.rf-pill) .vn{display:none}';
  document.head.appendChild(css2);
  /* Refund note picture */`],
["  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); addBtn(); setTimeout(addBtn, 200); return r; };",
 "  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); addBtn(); setTimeout(addBtn, 200); heroRefund(); setTimeout(heroRefund, 500); return r; };\n  /* 584: a refund just recorded shows on the page at once */\n  const _rs = window.rfSheet; window.rfSheet = async function(){ const r = await _rs.apply(this, arguments); try{ if(R && R.code) delete RFC[R.code]; }catch(e2){} return r; };"],
]);
