// 1764: (Misty 4 Nov 20:19–21:00 · ranks in the database, "ensure to follow our rule in ranking" → units + trainings) Teacher › Pay shows
//   the rank, rate and lifetime units from the database (coe_rank_cur via coe-payedit mypay) and, when the units are reached but a
//   rank's mandatory trainings are not done yet, "Junior Teacher · units reached · waiting for: Phonology, Grammar Refresher".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  if(r && r.ok && r.check){ window.MYPAY1763 = { pay: r.pay || [], at: Date.now() }; try{ if(typeof D !== 'undefined' && D && !D.mgr) D.pay = r.pay || []; }catch(e){}",
   "  if(r && r.ok && r.check){ window.MYPAY1763 = { pay: r.pay || [], rank: r.rank || null, at: Date.now() }; try{ if(typeof D !== 'undefined' && D && !D.mgr){ D.pay = r.pay || []; rank1764(); } }catch(e){}"],
  ["function renderPay(){ try{ if(window.MYPAY1763 && typeof D !== 'undefined' && D && !D.mgr) D.pay = MYPAY1763.pay; }catch(e){}",
   "function rank1764(){ try{ const k = window.MYPAY1763 && MYPAY1763.rank; if(!k || !D || !D.me || D.mgr) return; if(!k.fixed && k.rank) Object.assign(D.me, { rank: k.rank, rankDate: k.rankDate || D.me.rankDate });   /* 1764 */\n" +
   "  Object.assign(D.me, { rate: +k.rate || D.me.rate, lifetime: +k.lifetime, rankWaiting: k.waiting || '' }); }catch(e){} }\n" +
   "function renderPay(){ try{ if(window.MYPAY1763 && typeof D !== 'undefined' && D && !D.mgr){ D.pay = MYPAY1763.pay; rank1764(); } }catch(e){}"],
  ["${me.rankDate?' · since '+esc(me.rankDate):''}</div></div>`;",
   "${me.rankDate?' · since '+esc(me.rankDate):''}</div>${me.rankWaiting ? '<div class=\"small\" style=\"margin-top:6px;color:#8A5A00\">' + esc(me.rankWaiting) + ' · ask Operations to schedule them</div>' : ''}</div>`;"],
]);
