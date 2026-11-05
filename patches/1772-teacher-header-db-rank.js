// 1772: (Christian's screen 5 Nov 11:01 showed "Newly Hired · ₱150/lesson" in the header after his rank-up to Starting Teacher ₱155)
//   The header line under the teacher's name is redrawn as soon as the database rank arrives (same rank and rate as Pay).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  Object.assign(D.me, { rate: +k.rate || D.me.rate, lifetime: +k.lifetime, rankWaiting: k.waiting || '' }); }catch(e){} }",
   "  Object.assign(D.me, { rate: +k.rate || D.me.rate, lifetime: +k.lifetime, rankWaiting: k.waiting || '' });\n" +
   "  try{ const h = $('hRank'); if(h) h.innerHTML = esc([D.me.rank, D.me.rate ? peso(D.me.rate) + '/lesson' : ''].filter(Boolean).join(' · ')); }catch(e){}   /* 1772 */ }catch(e){} }"],
]);
