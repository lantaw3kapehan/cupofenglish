// 1683: (Misty, 1 Nov 10:31, Yoyo's Schedule calendar) "Can there be a calendar summary like this too? Copy picture to send to
//   parents below this? or what's best."
//   Management's student calendar gets "Copy picture for parent" (beside ‹ ›). It draws the two months shown, in English and Chinese,
//   for the parent's WeChat group: logo, "Class calendar · 上课日历", the student (English + Chinese name, code), the teacher(s),
//   the weekly times, every class as a time on its day (next class dark, coming in teal, done grey, cancelled struck through,
//   make-up ringed), and a line with how many classes are booked, the next one and the last one. China time.
//   Copy picture puts it on the clipboard (WeChat paste); where that is not possible it shows the picture with Save.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.cal28Go = function(d){ OFF = d === 0 ? 0 : OFF + d;",
   "  window._cal28S = () => ({ L: LL || [], off: OFF });   /* 1683 */\n  window.cal28Go = function(d){ OFF = d === 0 ? 0 : OFF + d;"],
  ["'<div class=\"ch8\"><b>Calendar</b><span class=\"sp\"></span>' + ",
   "'<div class=\"ch8\"><b>Calendar</b><span class=\"sp\"></span>' + (D && D.mgr ? '<button type=\"button\" title=\"The two months shown, as a picture for the parent\" onclick=\"calPic1683()\">📅 Copy picture for parent</button>' : '') + "],
  ["  window.swMine1676 = ",
   "  /* 1683 · calendar picture for parents */\n" +
   "  try{ const img1683 = u => new Promise(ok => { if(!u) return ok(null); const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = u; });\n" +
   "    const MEN = ['January','February','March','April','May','June','July','August','September','October','November','December'], WEN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], WZH = ['一','二','三','四','五','六','日'], DEN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], DZH = ['日','一','二','三','四','五','六'];\n" +
   "    const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');\n" +
   "    const tn = t => String(t || '').replace(/^teacher\\s+/i, '').trim(), tcap = t => { t = tn(t); return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''; };\n" +
   "    async function draw1683(){ const st = window._cal28S ? _cal28S() : { L: [], off: 0 }, L = (st.L || []).filter(e => e && e.start && !isNaN(new Date(e.start))), s = (typeof STU !== 'undefined' && STU && STU.s) || {}, code = (STU && STU.code) || '';\n" +
   "      const now = Date.now(), t0 = new Date(), A = new Date(t0.getFullYear(), t0.getMonth() + (st.off || 0), 1), Bm = new Date(A.getFullYear(), A.getMonth() + 1, 1), months = [A, Bm];\n" +
   "      const by = {}; L.forEach(e => { const k = ymd(new Date(e.start)); (by[k] = by[k] || []).push(e); }); Object.keys(by).forEach(k => by[k].sort((a, b) => new Date(a.start) - new Date(b.start)));\n" +
   "      const live = L.filter(e => !e.cancelled && new Date(e.end || e.start) >= now).sort((a, b) => new Date(a.start) - new Date(b.start)), nx = live[0], last = live[live.length - 1];\n" +
   "      const T = [...new Set(L.filter(e => !e.cancelled && e.teacher).map(e => tcap(e.teacher)))].slice(0, 3); if(!T.length && (s.teachers || []).length) T.push(...s.teachers.slice(0, 2).map(tcap));\n" +
   "      const sl = {}; live.slice(0, 12).forEach(e => { const d = new Date(e.start), k = d.getDay() + '|' + hm(d); sl[k] = (sl[k] || 0) + 1; }); const W = Object.keys(sl).filter(k => sl[k] >= 2).map(k => k.split('|')).sort((a, b) => ((+a[0] + 6) % 7) - ((+b[0] + 6) % 7) || a[1].localeCompare(b[1]));\n" +
   "      await Promise.all([document.fonts && document.fonts.load('40px \"Fredoka One\"'), document.fonts && document.fonts.load('20px Inter')].map(p => p && p.catch(() => {})));\n" +
   "      const [logo, tag] = await Promise.all([img1683((document.querySelector('#login img') || {}).src), img1683((document.querySelector('#login .tagl img') || {}).src)]);\n" +
   "      const WD = 1080, SC = 2, BR = '\"Fredoka One\",sans-serif', F = 'Inter,\"PingFang SC\",\"Microsoft YaHei\",sans-serif', NAVY = '#2B2253', TEAL = '#0E7C7B', MUTE = '#6B6880', PAD = 56, CW = (WD - PAD * 2 - 8 * 6) / 7, CH = 86;\n" +
   "      const rowsOf = d => Math.ceil((((new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7) + new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()) / 7);\n" +
   "      const head = 420 + (W.length ? 70 : 0), mH = months.map(d => 120 + rowsOf(d) * (CH + 8)), H = head + mH[0] + mH[1] + 40 + 300;\n" +
   "      const cv = document.createElement('canvas'); cv.width = WD * SC; cv.height = H * SC; const c = cv.getContext('2d'); c.scale(SC, SC);\n" +
   "      const rr = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };\n" +
   "      c.fillStyle = '#F1F5F6'; c.fillRect(0, 0, WD, H); c.fillStyle = '#fff'; rr(24, 24, WD - 48, H - 48, 40); c.fill();\n" +
   "      if(logo){ const lh = 96, lw = lh * logo.width / logo.height; c.drawImage(logo, PAD, 56, lw, lh); } else { c.fillStyle = NAVY; c.font = '400 40px ' + BR; c.fillText('CUPOFENGLISH', PAD, 110); }\n" +
   "      const pill = 'Class calendar · 上课日历'; c.font = '700 26px ' + F; const pw = c.measureText(pill).width + 48; c.fillStyle = '#ECE9F7'; rr(WD - PAD - pw, 70, pw, 60, 30); c.fill(); c.fillStyle = NAVY; c.textBaseline = 'middle'; c.fillText(pill, WD - PAD - pw + 24, 100); c.textBaseline = 'alphabetic';\n" +
   "      c.fillStyle = '#E8E6EF'; c.fillRect(PAD, 182, WD - PAD * 2, 2);\n" +
   "      c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText('Student · 学生', PAD, 232); c.fillStyle = NAVY; c.font = '400 64px ' + BR; c.fillText(s.name || code, PAD, 306);\n" +
   "      c.fillStyle = '#4A4766'; c.font = '400 32px ' + F; c.fillText([s.cn || s.chinese || '', code].filter(Boolean).join('  ·  '), PAD, 356);\n" +
   "      if(T.length){ c.textAlign = 'right'; c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText('Teacher · 老师', WD - PAD, 232); c.fillStyle = NAVY; c.font = '600 32px ' + F; c.fillText(T.map(t => 'Teacher ' + t).join(' · '), WD - PAD, 290); c.fillStyle = '#4A4766'; c.font = '400 28px ' + F; c.fillText(T.map(t => t + '老师').join(' · '), WD - PAD, 334); c.textAlign = 'left'; }\n" +
   "      let y = 400; if(W.length){ c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText('Every week · 每周', PAD, y + 34); let x = PAD + c.measureText('Every week · 每周').width + 20; W.forEach(w => { const lab = DEN[+w[0]] + ' 周' + DZH[+w[0]] + '  ' + w[1]; c.font = '700 26px ' + F; const lw = c.measureText(lab).width + 36; if(x + lw > WD - PAD) return; c.fillStyle = NAVY; rr(x, y, lw, 52, 26); c.fill(); c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(lab, x + 18, y + 27); c.textBaseline = 'alphabetic'; x += lw + 12; }); y += 70; }\n" +
   "      y = head;\n" +
   "      months.forEach((M, mi) => { const yy = M.getFullYear(), mm = M.getMonth(), first = new Date(yy, mm, 1), days = new Date(yy, mm + 1, 0).getDate(), lead = (first.getDay() + 6) % 7; let n = 0;\n" +
   "        for(let d = 1; d <= days; d++) (by[ymd(new Date(yy, mm, d))] || []).forEach(e => { if(!e.cancelled) n++; });\n" +
   "        c.fillStyle = NAVY; c.font = '400 38px ' + BR; c.fillText(MEN[mm] + ' ' + yy, PAD, y + 44); const tw1683 = c.measureText(MEN[mm] + ' ' + yy).width; c.fillStyle = MUTE; c.font = '400 26px ' + F; c.fillText(yy + '年' + (mm + 1) + '月', PAD + tw1683 + 18, y + 44);\n" +
   "        c.textAlign = 'right'; c.fillText(n + ' class' + (n === 1 ? '' : 'es') + ' · ' + n + '节课', WD - PAD, y + 44); c.textAlign = 'center';\n" +
   "        for(let i = 0; i < 7; i++){ c.fillStyle = i >= 5 ? '#8C88A3' : MUTE; c.font = '600 21px ' + F; c.fillText(WEN[i] + ' ' + WZH[i], PAD + i * (CW + 8) + CW / 2, y + 94); }\n" +
   "        let cy = y + 112; for(let k = 0; k < lead + days; k++){ const col = k % 7, row = Math.floor(k / 7), x = PAD + col * (CW + 8), yc = cy + row * (CH + 8); if(k < lead) continue; const d = k - lead + 1, dt = new Date(yy, mm, d), E = by[ymd(dt)] || [], td = ymd(dt) === ymd(new Date());\n" +
   "          c.fillStyle = E.length ? '#F2FAFA' : col >= 5 ? '#F6F5FA' : '#FAFAFC'; rr(x, yc, CW, CH, 12); c.fill(); if(td){ c.strokeStyle = '#00A3AD'; c.lineWidth = 2.5; rr(x + 1, yc + 1, CW - 2, CH - 2, 11); c.stroke(); }\n" +
   "          c.textAlign = 'left'; c.fillStyle = td ? '#00707A' : MUTE; c.font = (td ? '700' : '400') + ' 20px ' + F; c.fillText(String(d), x + 10, yc + 26);\n" +
   "          E.slice(0, 2).forEach((e, j) => { const s0 = new Date(e.start), done = new Date(e.end || e.start) < now, isNx = nx && e === nx, bh = E.length > 1 ? 24 : 32, by0 = yc + CH - 8 - (E.length > 1 ? (2 - j) * (bh + 4) - 4 : bh);\n" +
   "            c.fillStyle = e.cancelled ? '#fff' : isNx ? NAVY : done ? '#C9C7D3' : TEAL; rr(x + 6, by0, CW - 12, bh, 7); c.fill(); if(e.cancelled){ c.strokeStyle = '#F0C9BF'; c.lineWidth = 1.5; rr(x + 6, by0, CW - 12, bh, 7); c.stroke(); } if(e.makeup && !e.cancelled){ c.strokeStyle = '#00A3AD'; c.lineWidth = 2.5; rr(x + 3, by0 - 3, CW - 6, bh + 6, 9); c.stroke(); }\n" +
   "            c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = e.cancelled ? '#AE5041' : '#fff'; c.font = '700 ' + (E.length > 1 ? 17 : 21) + 'px ' + F; c.fillText(hm(s0), x + CW / 2, by0 + bh / 2 + 1); c.textBaseline = 'alphabetic';\n" +
   "            if(e.cancelled){ c.strokeStyle = '#AE5041'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + CW / 2 - 28, by0 + bh / 2); c.lineTo(x + CW / 2 + 28, by0 + bh / 2); c.stroke(); } }); }\n" +
   "        c.textAlign = 'left'; y += mH[mi]; });\n" +
   "      y += 10; const lg = [[NAVY, 'Next class · 下节课'], [TEAL, 'Coming · 待上'], ['#C9C7D3', 'Done · 已上'], ['cx', 'Cancelled · 已取消'], ['mk', 'Make-up · 补课']]; let lx = PAD; c.font = '400 21px ' + F;\n" +
   "      lg.forEach(([col, lab]) => { if(lx + 40 + c.measureText(lab).width > WD - PAD){ lx = PAD; y += 36; } if(col === 'cx'){ c.fillStyle = '#fff'; rr(lx, y, 30, 20, 5); c.fill(); c.strokeStyle = '#F0C9BF'; c.lineWidth = 1.5; rr(lx, y, 30, 20, 5); c.stroke(); } else if(col === 'mk'){ c.fillStyle = TEAL; rr(lx, y, 30, 20, 5); c.fill(); c.strokeStyle = '#00A3AD'; c.lineWidth = 2; rr(lx - 3, y - 3, 36, 26, 7); c.stroke(); } else { c.fillStyle = col; rr(lx, y, 30, 20, 5); c.fill(); }\n" +
   "        c.fillStyle = MUTE; c.fillText(lab, lx + 40, y + 17); lx += 40 + c.measureText(lab).width + 26; });\n" +
   "      y += 60; c.fillStyle = '#EEF7F7'; rr(PAD, y, WD - PAD * 2, 120, 22); c.fill();\n" +
   "      const fd = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + hm(d), fz = d => (d.getMonth() + 1) + '月' + d.getDate() + '日 周' + DZH[d.getDay()] + ' ' + hm(d);\n" +
   "      c.fillStyle = NAVY; c.font = '700 26px ' + F; c.fillText(live.length ? live.length + ' classes booked · next ' + fd(new Date(nx.start)) + ' · last ' + fd(new Date(last.start)) : 'No classes booked yet', PAD + 28, y + 50);\n" +
   "      c.fillStyle = '#4A4766'; c.font = '400 24px ' + F; c.fillText(live.length ? '已约' + live.length + '节课 · 下节课 ' + fz(new Date(nx.start)) + ' · 最后一节 ' + fz(new Date(last.start)) : '暂无已约课程', PAD + 28, y + 92);\n" +
   "      y += 150; c.fillStyle = MUTE; c.font = '400 21px ' + F; c.textAlign = 'center'; c.fillText('China time · 北京时间  ·  As of ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · 截至' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日', WD / 2, y); c.textAlign = 'left';\n" +
   "      if(tag){ const tw = 260, th = tw * tag.height / tag.width; c.drawImage(tag, WD / 2 - tw / 2, H - 40 - th - 20, tw, th); }\n" +
   "      return new Promise(ok => cv.toBlob(ok, 'image/png')); }\n" +
   "    window.calPic1683 = async function(){ if(typeof STU === 'undefined' || !STU) return; const name = 'CupOfEnglish-calendar-' + (STU.code || '') + '.png'; toast('Making the calendar picture…');\n" +
   "      const pb = draw1683();\n" +
   "      try{ if(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){ await navigator.clipboard.write([new ClipboardItem({ 'image/png': pb })]); toast('Calendar picture copied ✓ · paste it in the class WeChat group'); return; } }catch(e){}\n" +
   "      try{ const b = await pb, u = URL.createObjectURL(b); const ov = document.createElement('div'); ov.style.cssText = 'position:fixed;inset:0;background:rgba(20,18,40,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';\n" +
   "        ov.innerHTML = '<div style=\"background:#fff;border-radius:16px;padding:14px;max-width:520px;width:100%;max-height:92vh;overflow:auto\"><img src=\"' + u + '\" alt=\"Class calendar\" style=\"width:100%;border-radius:10px\"><div class=\"row\" style=\"gap:8px;margin-top:10px\"><a class=\"btn teal grow\" download=\"' + name + '\" href=\"' + u + '\">Save picture</a><button type=\"button\" class=\"btn ghost grow\">Close</button></div><div class=\"small mute\" style=\"margin-top:6px\">Copy is not available in this browser · save the picture, or long-press it to copy.</div></div>';\n" +
   "        ov.addEventListener('click', ev => { if(ev.target === ov || ev.target.tagName === 'BUTTON'){ ov.remove(); URL.revokeObjectURL(u); } }); document.body.appendChild(ov); }catch(e){ toast('Could not make the picture'); } }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
