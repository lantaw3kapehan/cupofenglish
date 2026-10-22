// 22 Oct · Misty: refunds ("case-to-case, not often, but when it happens efficient and convenient … to avoid dispute, stress").
// Rules (Misty): lessons left − ALL free lessons of the package = paid lessons refunded; rate actually paid (SALES amount ÷ paid lessons,
// so partner students use the partner price and are refunded to the partner); no fee; a case-by-case adjustment needs a reason.
// Student page › Manage › Refund (President):
//   1 the numbers fill in by themselves from ACTIVE + SALES (Apps Script mgmtRefund dry) — each can be changed
//   2 the message for the family/partner (Chinese first) — Copy message
//   3 Record refund (one tap): number R-n (coe-invoice refund_issue) → SALES minus line + ACTIVE lessons to 0 + "Refunded" status + student log
//     (Apps Script mgmtRefund) → wallets go down by themselves (Alipay/WeChat through SALES; CCB as a wallet "out")
//   4 Refund note picture (REFUNDED stamp) to send, and the student's past refunds.
require('../tools/lib.js')(process.argv[2], [
["</body>", `<script>
/* 22 Oct · 582 · Refunds */
(function(){
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-invoice';
  const call = async (action, body) => { const r = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, action }, body || {})) });
    let j = null; try{ j = await r.json(); }catch(x){} if(!j) throw new Error('No answer from the server. Check the internet and try again.'); if(!j.ok) throw new Error(j.error || 'Could not save'); return j; };
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n1 = x => { x = Math.round((+x || 0) * 100) / 100; return String(x); };
  const yen = x => '¥' + (Math.round((+x || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fd = d => { const m = String(d || '').match(/^(\\d{4})-(\\d{2})-(\\d{2})/); return m ? +m[3] + ' ' + MON[+m[2] - 1] + ' ' + m[1] : String(d || ''); };
  const isCoe = p => !p || /^(coe|cupofenglish)\\b/i.test(String(p).trim());
  const WALLETS = ['Alipay', 'WeChat', 'CCB'];
  const css = document.createElement('style');
  css.textContent = \`
.rf{--rf:#B4442F;--rfT:#FBECE8}
.rf h1{margin:0 0 2px} .rf .sub{color:#6F6B85;font-size:13.5px;margin-bottom:14px}
.rf .box{background:#fff;border:1px solid var(--line,#EEEDF3);border-radius:18px;padding:16px 18px;margin-bottom:12px}
.rf .box h3{margin:0 0 10px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}
.rf .calc{display:grid;grid-template-columns:1fr auto;gap:8px 14px;align-items:center;font-size:15px}
.rf .calc label{color:#4A4566} .rf .calc small{display:block;color:#8A86A0;font-size:12px}
.rf .calc input{width:96px;text-align:right;font:inherit;font-weight:700;padding:7px 10px;border:1px solid #E3E1EC;border-radius:10px;background:#FAFAFC}
.rf .calc .eq{font-weight:800;text-align:right;padding-right:11px}
.rf .calc .tot{border-top:1px solid #EEEDF3;padding-top:10px;margin-top:2px;font-weight:800;font-size:17px}
.rf .calc .tot b{color:var(--rf);font-size:22px}
.rf .ch{display:flex;gap:6px;flex-wrap:wrap} .rf .ch button{border:1px solid #E3E1EC;background:#fff;border-radius:999px;padding:7px 13px;font:inherit;font-size:13.5px;font-weight:600;color:#4A4566;cursor:pointer}
.rf .ch button.on{background:#2B2253;border-color:#2B2253;color:#fff}
.rf .two{display:grid;grid-template-columns:1fr 1fr;gap:12px} @media(max-width:620px){.rf .two{grid-template-columns:1fr}}
.rf textarea{width:100%;min-height:210px;font:inherit;font-size:13.5px;line-height:1.5;border:1px solid #E3E1EC;border-radius:12px;padding:10px 12px;background:#FAFAFC;box-sizing:border-box}
.rf .in{width:100%;box-sizing:border-box;font:inherit;padding:8px 10px;border:1px solid #E3E1EC;border-radius:10px}
.rf .go{width:100%;background:var(--rf)!important;border-color:var(--rf)!important;color:#fff!important;font-size:15px;padding:12px}
.rf .go[disabled]{opacity:.5}
.rf .pol{font-size:12.5px;color:#6F6B85;line-height:1.5}
.rf .past{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #F0EFF5;font-size:13.5px} .rf .past:first-of-type{border-top:0}
.rf .past.v{opacity:.5;text-decoration:line-through}
.rf .ok{background:#E8F6EE;color:#1E7A50;border-radius:14px;padding:12px 14px;font-weight:600;margin-bottom:12px}
.rf .warn{background:#FDF4E3;color:#8A5A12;border-radius:14px;padding:12px 14px;margin-bottom:12px}
#rfNote{position:fixed;left:-9999px;top:0;width:760px;background:#fff;font-family:Rockwell,"Rockwell Nova",Georgia,serif;color:#2B2253;padding:44px 48px;box-sizing:border-box}
#rfNote .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}
#rfNote .hd img{width:150px} #rfNote .co{font-size:12px;line-height:1.5;color:#4A4566;text-align:right}
#rfNote .tt{margin:26px 0 4px;font-size:30px;font-weight:800} #rfNote .tt span{font-size:18px;color:#6F6B85;margin-left:8px}
#rfNote .mt{font-size:14px;color:#4A4566;line-height:1.6}
#rfNote table{width:100%;border-collapse:collapse;margin-top:18px;font-size:15px}
#rfNote td{padding:10px 0;border-bottom:1px solid #EEEDF3} #rfNote td.n{text-align:right;font-weight:700}
#rfNote tr.t td{border-bottom:0;border-top:2px solid #2B2253;font-size:19px;font-weight:800;padding-top:14px} #rfNote tr.t td.n{color:#B4442F;font-size:24px}
#rfNote .st{display:inline-block;margin-top:22px;border:3px solid #B4442F;color:#B4442F;border-radius:12px;padding:8px 16px;font-weight:800;font-size:20px;letter-spacing:.08em;transform:rotate(-4deg)}
#rfNote .st small{display:block;font-size:12px;letter-spacing:0;font-weight:600}
#rfNote .ft{margin-top:26px;font-size:11.5px;color:#6F6B85;line-height:1.6;border-top:1px solid #EEEDF3;padding-top:12px}
\`;
  document.head.appendChild(css);

  let R = null;   /* the refund being made */
  const calc = () => { const left = +R.left || 0, free = +R.free || 0, n = Math.max(0, Math.round((left - free) * 100) / 100), base = Math.round(n * (+R.rate || 0) * 100) / 100;
    return { n, base, amount: Math.max(0, Math.round((base + (+R.adjust || 0)) * 100) / 100) }; };
  function msg(){ const c = calc(), nm = R.name || R.code, zh = R.cn || nm, adj = +R.adjust || 0, partner = R.payTo && R.payTo !== 'Family' ? R.payTo : '';
    return '您好！关于' + zh + '的退款，明细如下：\\n' +
      '剩余课时：' + n1(R.left) + ' 节\\n扣除赠送课时：' + n1(R.free) + ' 节\\n可退付费课时：' + n1(c.n) + ' 节\\n原付费单价：' + yen(R.rate) + '/节\\n' +
      (adj ? '调整：' + (adj > 0 ? '+' : '−') + yen(Math.abs(adj)) + (R.reason ? '（' + R.reason + '）' : '') + '\\n' : '') +
      '退款金额：' + yen(c.amount) + '\\n' + (partner ? '款项将退至' + partner + '，由其与您结算。\\n' : '') +
      '\\n感谢您一直以来对一杯英语的信任与支持，祝' + zh + '学习进步、一切顺利！\\n\\n' +
      'Hello! Here is the refund for ' + nm + ':\\n' +
      'Remaining lessons: ' + n1(R.left) + '\\nLess complimentary lessons: ' + n1(R.free) + '\\nPaid lessons refunded: ' + n1(c.n) + '\\nOriginal paid rate: ' + yen(R.rate) + '/lesson\\n' +
      (adj ? 'Adjustment: ' + (adj > 0 ? '+' : '−') + yen(Math.abs(adj)) + (R.reason ? ' (' + R.reason + ')' : '') + '\\n' : '') +
      'Refund: ' + yen(c.amount) + '\\n' + (partner ? 'The refund is paid to ' + partner + ', who will settle it with you.\\n' : '') +
      '\\nThank you for your trust in CupOfEnglish. We wish ' + nm + ' all the best.\\n\\n一杯英语 CupOfEnglish'; }
  const POLICY = 'Refund policy 退款说明 · Unused lessons are refunded at the rate actually paid, after deducting the complimentary (free) lessons of the package. No processing fee. Students enrolled through a partner are refunded through the partner. 未上课时按实际付费单价退还，先扣除该课程包的赠送课时，不收取手续费；通过合作机构报名的学员，退款退至合作机构。';

  function paint(){ const b = $('sheetBody'); if(!b || !R) return; const c = calc(), S = R.sale || {}, P = isPres();
    const past = (R.past || []).map(x => '<div class="past' + (x.status === 'void' ? ' v' : '') + '"><span><b>R-' + x.no + '</b> · ' + e(fd(x.day)) + ' · ' + n1(x.refund_lessons) + ' lessons · ' + e(x.wallet || '') + (x.pay_to ? ' · to ' + e(x.pay_to) : '') + (x.status === 'sheet?' ? ' · <span style="color:#B05A16">sheet not updated</span>' : '') + '</span><span><b>' + yen(x.amount) + '</b>' +
      (P && x.status !== 'void' ? ' <a href="javascript:void 0" onclick="rfVoid(' + x.no + ')" style="color:#B4442F;margin-left:8px;font-size:12.5px">Void</a>' : '') + '</span></div>').join('');
    if(R.done){ const d = R.done;
      b.innerHTML = '<div class="rf"><h1>Refund R-' + d.no + ' recorded</h1><div class="sub">' + e(R.name) + ' ' + e(R.cn || '') + ' · ' + e(R.code) + '</div>' +
        (R.sheetOk ? '<div class="ok">✓ ' + e(R.sheetNote || 'Saved') + '<br>SALES has a minus line, lessons left are 0, the status says Refunded, and the ' + e(R.wallet) + ' wallet goes down by ' + yen(d.amount) + '.</div>'
          : '<div class="warn">The refund number is saved, but the sheet was not updated: ' + e(R.sheetNote || '') + '<br><button class="btn sm" style="margin-top:8px" onclick="rfSheet()">Try the sheet again</button></div>') +
        '<div class="box"><h3>Send to ' + (R.payTo && R.payTo !== 'Family' ? e(R.payTo) : 'the family') + '</h3><textarea id="rfMsg">' + e(R.msg) + '</textarea>' +
        '<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn teal" onclick="rfCopy()">Copy message 复制消息</button><button class="btn" onclick="rfPic()">Refund note picture</button><button class="btn ghost" onclick="closeSheet();setTimeout(()=>openStudent(\\'' + e(R.code) + '\\'),150)">Back to ' + e(R.name) + '</button></div></div></div>';
      return; }
    const pt = isCoe(S.partner) ? ['Family'] : [S.partner, 'Family'];
    b.innerHTML = '<div class="rf"><h1>Refund</h1><div class="sub">' + e(R.name) + ' ' + e(R.cn || '') + ' · ' + e(R.code) + ' · Teacher ' + e(R.teacher || '') + '</div>' +
      (/Refunded /.test(R.status || '') ? '<div class="warn">ACTIVE already says: ' + e(R.status) + '</div>' : '') +
      '<div class="box"><h3>How much</h3><div class="calc">' +
      '<label>Lessons left<small>ACTIVE · ' + n1(R.enrolled) + ' in the package, ' + n1(R.finished) + ' done' + (R.carry ? ', ' + n1(R.carry) + ' carried over' : '') + '</small></label><input type="number" step="0.5" min="0" value="' + n1(R.left) + '" oninput="rfSet(\\'left\\',this.value)">' +
      '<label>Less free lessons<small>all the free lessons of this package' + (S.invoice ? ' (' + e(S.invoice.replace(/\\.pdf$/i, '')) + ': ' + n1(S.pkg) + ' + ' + n1(S.free) + ' free)' : '') + '</small></label><input type="number" step="0.5" min="0" value="' + n1(R.free) + '" oninput="rfSet(\\'free\\',this.value)">' +
      '<label>Paid lessons to refund</label><div class="eq" id="rfN">' + n1(c.n) + '</div>' +
      '<label>Rate actually paid, per lesson<small>' + (S.amount ? e(yen(S.amount)) + ' for ' + n1(S.pkg) + ' lessons · ' + e(fd(S.date)) + (isCoe(S.partner) ? '' : ' · partner price (' + e(S.partner) + ')') : 'not found in SALES · type it') + '</small></label><input type="number" step="0.01" min="0" value="' + n1(R.rate) + '" oninput="rfSet(\\'rate\\',this.value)">' +
      '<label>Adjustment ¥ (optional)<small>case by case · + or − · needs a reason</small></label><input type="number" step="1" value="' + (R.adjust ? n1(R.adjust) : '') + '" placeholder="0" oninput="rfSet(\\'adjust\\',this.value)">' +
      '<div style="grid-column:1/-1;' + (+R.adjust ? '' : 'display:none') + '" id="rfWhy"><input class="in" placeholder="Reason for the adjustment" value="' + e(R.reason || '') + '" oninput="rfSet(\\'reason\\',this.value,1)"></div>' +
      '<label class="tot">Refund</label><div class="tot" style="text-align:right"><b id="rfAmt">' + yen(c.amount) + '</b></div></div></div>' +
      '<div class="two"><div class="box"><h3>Refund goes to</h3><div class="ch">' + pt.map(x => '<button type="button" class="' + (R.payTo === x ? 'on' : '') + '" onclick="rfPick(\\'payTo\\',\\'' + e(x) + '\\')">' + (x === 'Family' ? 'The family' : e(x)) + '</button>').join('') + '</div>' +
      (isCoe(S.partner) ? '' : '<div class="pol" style="margin-top:8px">Partner student: refunded at the partner price to the partner, who settles with the family.</div>') + '</div>' +
      '<div class="box"><h3>Paid from</h3><div class="ch">' + WALLETS.map(x => '<button type="button" class="' + (R.wallet === x ? 'on' : '') + '" onclick="rfPick(\\'wallet\\',\\'' + x + '\\')">' + x + '</button>').join('') + '</div>' +
      '<div class="row" style="gap:8px;margin-top:10px;align-items:center"><span class="small mute">Date</span><input class="in" type="date" style="width:auto" value="' + e(R.day) + '" onchange="rfSet(\\'day\\',this.value,1)"></div></div></div>' +
      '<div class="box"><h3>Message</h3><textarea id="rfMsg" oninput="R_MSG_EDIT(this.value)">' + e(R.msgEdited ? R.msg : msg()) + '</textarea><div class="row" style="gap:8px;margin-top:8px"><button class="btn sm" onclick="rfCopy()">Copy message 复制消息</button><span class="small mute">You can send it first and record the refund once it is agreed.</span></div></div>' +
      (P ? '<button class="btn go" id="rfGo" onclick="rfSave()"' + (c.amount > 0 || c.n > 0 ? '' : ' disabled') + '>Record refund · ' + yen(c.amount) + ' from ' + e(R.wallet) + '</button><div class="small mute" style="text-align:center;margin:8px 0 14px">Records R-' + '… · SALES minus line · lessons left to 0 · status Refunded · wallet goes down</div>'
        : '<div class="warn">Only the President records refunds. You can copy the message.</div>') +
      '<div class="box"><h3>Policy</h3><div class="pol">' + e(POLICY) + '</div></div>' +
      (past ? '<div class="box"><h3>Past refunds</h3>' + past + '</div>' : '') + '</div>'; }
  function upd(){ const c = calc(); const a = $('rfAmt'), n = $('rfN'), g = $('rfGo'), m = $('rfMsg'), w = $('rfWhy');
    if(a) a.textContent = yen(c.amount); if(n) n.textContent = n1(c.n); if(g){ g.textContent = 'Record refund · ' + yen(c.amount) + ' from ' + R.wallet; g.disabled = !(c.amount > 0 || c.n > 0); }
    if(w) w.style.display = +R.adjust ? '' : 'none'; if(m && !R.msgEdited) m.value = msg(); }
  window.R_MSG_EDIT = v => { if(R){ R.msg = v; R.msgEdited = true; } };
  window.rfSet = (k, v, quiet) => { if(!R) return; R[k] = k === 'reason' || k === 'day' ? v : (v === '' ? 0 : +v); upd(); };
  window.rfPick = (k, v) => { if(!R) return; R[k] = v; paint(); };
  window.rfCopy = async () => { const t = ($('rfMsg') || {}).value || msg(); try{ await navigator.clipboard.writeText(t); toast('Message copied · paste it in WeChat'); }catch(x){ toast('Select the text and copy it'); } };

  window.rfOpen = async function(code){ code = String(code || (STU && STU.code) || '').toUpperCase(); if(!code) return;
    window._stuOpen = null;
    openSheet('<div class="rf"><h1>Refund</h1><div class="sub">Reading ACTIVE and SALES…</div><div class="sk"></div><div class="sk"></div></div>');
    try{
      const [info, past] = await Promise.all([api('mgmtRefund', TOKEN, { code, dry: 1 }), call('refund_list', { code }).catch(() => ({ refunds: [] }))]);
      if(!info || info.ok === false) throw new Error((info && (info.msg || info.error)) || 'Could not read the package');
      const S = info.sale || {};
      R = Object.assign({}, info, { code, free: S.free || 0, rate: S.rate || 0, adjust: 0, reason: '', day: today(),
        payTo: isCoe(S.partner) ? 'Family' : S.partner, wallet: WALLETS.indexOf(S.method) >= 0 ? S.method : (/wechat|微信/i.test(S.method || '') ? 'WeChat' : 'Alipay'), past: past.refunds || [] });
      paint();
    }catch(x){ $('sheetBody').innerHTML = '<div class="rf"><h1>Refund</h1><div class="warn">' + e(x.message || x) + '</div></div>'; } };

  window.rfSave = async function(){ if(!R || R.busy) return; const c = calc();
    if(+R.adjust && !String(R.reason || '').trim()) return toast('Add a reason for the adjustment');
    if(!confirm('Record refund for ' + R.name + '?\\n\\n' + n1(c.n) + ' paid lessons × ' + yen(R.rate) + (+R.adjust ? ' ' + (R.adjust > 0 ? '+' : '−') + yen(Math.abs(R.adjust)) : '') + ' = ' + yen(c.amount) + '\\nPaid from ' + R.wallet + (R.payTo !== 'Family' ? ' to ' + R.payTo : ' to the family') + '\\n\\nLessons left become 0 and the status becomes Refunded.')) return;
    R.busy = 1; const g = $('rfGo'); if(g){ g.disabled = true; g.textContent = 'Recording…'; }
    R.msg = ($('rfMsg') || {}).value || msg();
    try{
      const S = R.sale || {};
      const j = await call('refund_issue', { r: { code: R.code, name: R.name, cn: R.cn, teacher: R.teacher, sale_invoice: S.invoice, sale_row: S.row, left: R.left, free: R.free, lessons: c.n, rate: R.rate,
        adjust: R.adjust, reason: R.reason, amount: c.amount, partner: S.partner, pay_to: R.payTo === 'Family' ? 'Family' : R.payTo, wallet: R.wallet, day: R.day } });
      R.done = j.refund; await rfSheet(true);
    }catch(x){ R.busy = 0; toast(x.message || 'Could not record'); if(g){ g.disabled = false; upd(); } } };
  window.rfSheet = async function(first){ if(!R || !R.done) return; const d = R.done, c = calc();
    try{ const r = await api('mgmtRefund', TOKEN, { code: R.code, teacher: R.teacher, no: 'R-' + d.no, lessons: d.refund_lessons, free: d.free_lessons, amount: d.amount, rate: d.rate, adjust: d.adjust, reason: d.adjust_reason || '',
        wallet: d.wallet, payTo: d.pay_to === 'Family' ? '' : d.pay_to, partner: (R.sale || {}).partner || '', date: d.day, force: first ? 0 : 1 });
      R.sheetOk = !!(r && r.ok); R.sheetNote = (r && (r.note || r.msg)) || '';
      call('refund_done', { no: d.no, ok: R.sheetOk, sheet_row: r && r.saleRow, note: R.sheetNote }).catch(() => {});
    }catch(x){ R.sheetOk = false; R.sheetNote = x.message || String(x); call('refund_done', { no: d.no, ok: false, note: R.sheetNote }).catch(() => {}); }
    try{ delete STUC[R.code]; }catch(x){}
    paint(); };
  window.rfVoid = async function(no){ const why = prompt('Void refund R-' + no + '?\\n\\nThe record stays (crossed out). A CCB wallet entry is undone. The SALES minus line and the ACTIVE change stay in the sheet: fix those by hand if needed.\\n\\nReason:'); if(!why) return;
    try{ await call('refund_void', { no, reason: why }); toast('R-' + no + ' voided'); const p = await call('refund_list', { code: R.code }); R.past = p.refunds || []; paint(); }catch(x){ toast(x.message); } };

  /* Refund note picture */
  window.rfPic = async function(){ if(!R || !R.done) return; const d = R.done, S = R.sale || {};
    const lg = (() => { const i = document.querySelector('#login img, .tagl img, img[alt*="CupOfEnglish" i]'); return i ? i.src : ''; })();
    const to = d.pay_to && d.pay_to !== 'Family' ? d.pay_to : 'Family of ' + (R.name || '') + (R.cn ? ' ' + R.cn : '');
    const row = (a, b) => '<tr><td>' + a + '</td><td class="n">' + b + '</td></tr>';
    let el = $('rfNote'); if(!el){ el = document.createElement('div'); el.id = 'rfNote'; document.body.appendChild(el); }
    el.innerHTML = '<div class="hd">' + (lg ? '<img src="' + lg + '" alt="">' : '<b>CupOfEnglish</b>') + '<div class="co"><b>CupOfEnglish Philippines</b><br>MS2 102&amp;103 Bayani Hall Centrale, San Vicente East<br>Urdaneta, Pangasinan, Philippines 2428<br>works@cupofenglishatph.com</div></div>' +
      '<div class="tt">Refund Note R-' + d.no + '<span>退款单</span></div>' +
      '<div class="mt">Date 日期: <b>' + e(fd(d.day)) + '</b><br>To 收款方: <b>' + e(to) + '</b><br>Student 学员: <b>' + e(R.name) + ' ' + e(R.cn || '') + '</b> · ' + e(R.code) +
      (S.invoice ? '<br>Original payment 原付款: ' + e(S.invoice.replace(/\\.pdf$/i, '').replace(/_/g, ' ')) + ' · ' + e(fd(S.date)) + ' · ' + n1(S.pkg) + ' + ' + n1(S.free) + ' free lessons' : '') + '</div>' +
      '<table>' + row('Remaining lessons 剩余课时', n1(d.left_lessons)) + row('Less complimentary lessons 扣除赠送课时', '−' + n1(d.free_lessons)) + row('Paid lessons refunded 可退付费课时', n1(d.refund_lessons)) +
      row('Original paid rate 原付费单价', yen(d.rate) + ' / lesson') + (+d.adjust ? row('Adjustment 调整' + (d.adjust_reason ? ' · ' + e(d.adjust_reason) : ''), (d.adjust > 0 ? '+' : '−') + yen(Math.abs(d.adjust))) : '') +
      '<tr class="t"><td>Refund 退款金额</td><td class="n">' + yen(d.amount) + '</td></tr></table>' +
      '<div class="st">REFUNDED 已退款<small>R-' + d.no + ' · ' + e(fd(d.day)) + ' · via ' + e(d.wallet || '') + '</small></div>' +
      '<div class="ft">' + e(POLICY) + '<br>Thank you for your trust in CupOfEnglish. 感谢您对一杯英语的信任与支持。</div>';
    toast('Making the picture…');
    try{ const H = await h2c(); const cv = await H(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
      const blob = await new Promise(ok => cv.toBlob(ok, 'image/png'));
      try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Picture copied · paste it in WeChat'); }
      catch(x){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'CupOfEnglish-Refund-R-' + d.no + '-' + (R.name || '') + '.png'; a.click(); toast('Picture saved'); }
    }catch(x){ toast('Could not make the picture: ' + (x.message || x)); } };

  /* Manage › Refund (President) */
  const IC = '<svg class="lic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';
  function addBtn(){ try{ if(!isPres() || typeof STU === 'undefined' || !STU || !STU.code) return; const b = $('sheetBody'); if(!b || b.querySelector('.rf-btn')) return;
    const g = b.querySelectorAll('.stu-bar .grp'); const mg = g[g.length - 1]; if(!mg) return;
    const pr = [...mg.querySelectorAll('.btn')].find(x => /Print/i.test(x.textContent));
    const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'btn sm rf-btn'; bt.innerHTML = IC + 'Refund'; bt.title = 'Refund unused lessons'; bt.onclick = () => rfOpen(STU.code);
    if(pr) mg.insertBefore(bt, pr); else mg.appendChild(bt); }catch(x){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); addBtn(); setTimeout(addBtn, 200); return r; };
})();
</script>
</body>`],
]);
