// 2117 (12 Nov 13:50, Misty: the shared package total line "should be translated to Chinese so parents understand").
// The Chinese line under "Shared package total (…)" only said 共享课程包总课时（含赠送 2 课时）. It now gives the same breakdown in Chinese:
// 2116 case: （报名 33 课时中剩余 6.5 课时 + 转入 59 课时 + 赠送 2 课时）; otherwise （报名 33 课时 + 结转 6.5 课时 + 转入 59 课时 + 赠送 2 课时 …）.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}${cp1975 ? '（含补偿 ' + cp1975 + ' 课时）' : ''}${ro1975 ? '（含退回 ' + ro1975 + ' 课时）' : ''}",
   "共享课程包总课时${(() => { const L = [], k = ' 课时'; if(typeof in2116 !== 'undefined' && in2116){ L.push('报名 ' + enrolled + k + (carry ? '中剩余 ' + carry + k : '')); L.push('转入 ' + trf + k); if(inc) L.push('赠送 ' + inc + k); return '（' + L.join(' + ') + '）'; }   /* 2117 */\n" +
   "  if(!(carry || trf || inc || cp1975 || ro1975)) return ''; L.push('报名 ' + enrolled + k); if(carry) L.push('结转 ' + carry + k); if(trf > 0) L.push('转入 ' + trf + k); if(inc) L.push('赠送 ' + inc + k); if(cp1975) L.push('补偿 ' + cp1975 + k); if(ro1975) L.push('退回 ' + ro1975 + k);\n" +
   "  let s = L.join(' + '); if(trf < 0) s += ' − 转出 ' + Math.abs(trf) + k; return '（' + s + '）'; })()}"],
]);
