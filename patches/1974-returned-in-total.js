// 1974: (Misty 9 Nov 13:28 "the final should be 72, since we have +0.5 returned and kind of giving them extra since the teacher was absent"
//   · 13:34 "yes a teacher who cancelled within the 2 hour window"; database 1973 adds the lesson to the package's RETURNED)
//   Lesson Summary pictures: the package total now includes RETURNED lessons and says so: "72 · Shared package total (68 + 3.5 carried
//   + 0.5 returned) · 共享课程包总课时（含退回 0.5 课时）". The single-child summary already counted it (total = completed + remaining) and now
//   names it too. RETURNED per student comes from docs sys:returned (ret), which also lists the dated returns shown under the total.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  let R = null, at = 0; try{ R = JSON.parse(localStorage.getItem('coe.ret1969') || 'null'); }catch(e){}",
   "  let R = null, RT = null, at = 0; try{ R = JSON.parse(localStorage.getItem('coe.ret1969') || 'null'); RT = JSON.parse(localStorage.getItem('coe.ret1974') || 'null'); }catch(e){}\n" +
   "  window.retTot1974 = function(G, C, code){ if(!RT) return 0; const up = x => String(x || '').trim().toUpperCase(), ks = new Set(); ((G && G.members) ? G.members.concat(G.owner ? [G.owner] : []) : []).forEach(x => ks.add(up(x[C.code]))); if(code) ks.add(up(code)); let t = 0; ks.forEach(k => { t += +RT[k] || 0; }); return Math.round(t * 10) / 10; };"],
  ["if(d && d.by){ R = d.by; try{ localStorage.setItem('coe.ret1969', JSON.stringify(R)); }catch(e){} }",
   "if(d && d.by){ R = d.by; RT = d.ret || {}; try{ localStorage.setItem('coe.ret1969', JSON.stringify(R)); localStorage.setItem('coe.ret1974', JSON.stringify(RT)); }catch(e){} }"],
  ["tot = n1(enrolled + carry + trf + inc), done =",
   "rt1974 = (() => { try{ return window.retTot1974 ? retTot1974(G, C, code) : 0; }catch(e){ return 0; } })(), tot = n1(enrolled + carry + trf + inc + rt1974), done ="],
  ["const totX = (carry || trf || inc) ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (trf ? ' ' + (trf > 0 ? '+ ' : '− ') + Math.abs(trf) + ' transferred' : '') + (inc ? ' + ' + inc + ' free' : '') + ')' : '';",
   "const totX = (carry || trf || inc || rt1974) ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (trf ? ' ' + (trf > 0 ? '+ ' : '− ') + Math.abs(trf) + ' transferred' : '') + (inc ? ' + ' + inc + ' free' : '') + (rt1974 ? ' + ' + rt1974 + ' returned' : '') + ')' : '';"],
  ["Shared package total${totX}<br>共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>",
   "Shared package total${totX}<br>共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}${rt1974 ? '（含退回 ' + rt1974 + ' 课时）' : ''}</div>"],
  ["Current package total${carry || inc ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (inc ? ' + ' + inc + ' free' : '') + ')' : ''}<br>当前课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>",
   "${(rt => `Current package total${carry || inc || rt ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (inc ? ' + ' + inc + ' free' : '') + (rt ? ' + ' + rt + ' returned' : '') + ')' : ''}<br>当前课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}${rt ? '（含退回 ' + rt + ' 课时）' : ''}`)((() => { try{ return window.retTot1974 ? retTot1974(G, C, code) : 0; }catch(e){ return 0; } })())}</div>"],
]);
