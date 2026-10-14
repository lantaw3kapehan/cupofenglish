// 14 Oct · Lesson summary (Misty, Ellery ST-2026-067): show free lessons from incentives (ACTIVE › column I, e.g. a referral),
// so "34 + 2 carried over" adds up to the 37 total: "+ 1 free · incentive 奖励". Needs server mgmtActive_ with the 'incentive' column.
require('../tools/lib.js')(process.argv[2], [
["const done = n1(rows0.reduce((a, x) => a + (+x[C.finished] || 0), 0)), enrolled = +o[C.enrolled] || 0, carry = +o[C.carry] || 0;",
 "const done = n1(rows0.reduce((a, x) => a + (+x[C.finished] || 0), 0)), enrolled = +o[C.enrolled] || 0, carry = +o[C.carry] || 0, incRaw = C.incentive != null ? o[C.incentive] : '', inc = +incRaw || 0, incTx = !inc && incRaw !== '' && incRaw != null ? String(incRaw) : '';   /* 14 Oct: ACTIVE › I incentive */"],
["${carry ? `<div style=\"font-size:12px;font-weight:400\">+ ${carry} carried over · 结转</div>` : ''}</td></tr></table>",
 "${carry ? `<div style=\"font-size:12px;font-weight:400\">+ ${carry} carried over · 结转</div>` : ''}${inc ? `<div style=\"font-size:12px;font-weight:400;color:#1E7A55\">+ ${inc} free · incentive 奖励赠送</div>` : incTx ? `<div style=\"font-size:12px;font-weight:400;color:#1E7A55\">Incentive 奖励: ${esc(incTx)}</div>` : ''}</td></tr></table>"],
["Current package total${carry ? ' (' + enrolled + ' + ' + carry + ' carried)' : ''}<br>当前课程包总课时",
 "Current package total${carry || inc ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (inc ? ' + ' + inc + ' free' : '') + ')' : ''}<br>当前课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}"],
]);
