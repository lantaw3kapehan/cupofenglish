// 764: (Misty) teachers give progress-check scores that are too high (Ian: 23/36 = B1 on an A1 book).
// · Under "Book and unit now" the form shows the book's CEFR level and the usual total for it, live as the teacher types the book
//   (also when they write the next book): "📘 OD2 ≈ A1 Beginner · usual total 11–15 / 36".
// · One level above the book → red box, a reason is needed (management sees it), as before.
// · Two or more levels above the book → it cannot be sent: lower the ratings to what the student does on their own,
//   or ask management to change the book first.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const bl = pcBookLv(P.book); if(bl > -1 && lv - bl >= 2) out.push(PCLV[lv] + ' is far above the book now (' + P.book + ' ≈ ' + PCLV[bl] + ' in the CEFR guide)');",
    "const bl = pcBookLv(P.book); if(bl > -1 && lv - bl >= 2) out.push('⛔ ' + PCLV[lv] + ' is ' + (lv - bl) + ' levels above the book (' + P.book + ' ≈ ' + PCLV[bl] + ') · this cannot be sent. Lower the ratings to what the student does on their own, or ask management to change the book first');\n    else if(bl > -1 && lv - bl === 1) out.push(PCLV[lv] + ' is one level above the book (' + P.book + ' ≈ ' + PCLV[bl] + ') · say why in the box below');   /* 764 */");
rep("const iss = pcIssues(); if(iss.length && String(window._pcWhy || '').trim().length < 30)",
    "const iss = pcIssues(); if(iss.some(x => /^⛔/.test(x))) return stop('Too high for the book · lower the ratings (see the red box), or ask management to change the book first', 'pcIss');   /* 764 */\nif(iss.length && String(window._pcWhy || '').trim().length < 30)");
rep(`placeholder="e.g. Oxford Discover 1 - Unit 4" oninput="pcSave()">' +`,
    `placeholder="e.g. Oxford Discover 1 - Unit 4" oninput="pcSave()"><div id="pcBk" class="small" style="margin-top:5px"></div>' +`);
rep("function pcSum(){ const R = P.picks,",
    "function pcBkPaint(){ const el = $('pcBk'); if(!el || !P) return; const bl = pcBookLv(P.book), RG = ['6–10', '11–15', '16–20', '21–25', '26–30', '31–35', '36'], NM = ['Starter', 'Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Mastery'];\n  el.innerHTML = bl < 0 ? (String(P.book || '').trim() ? '<span class=\"mute\">📘 Book level not known · write the book name, e.g. OD2, Wonders 1, RAZ D</span>' : '') : '<span style=\"background:#EEF7F7;color:#00737B;border-radius:8px;padding:4px 8px;display:inline-block\">📘 <b>' + esc(String(P.book).split(/[·,\\-–]/)[0].trim()) + ' ≈ ' + PCLV[bl] + ' ' + NM[bl] + '</b> · usual total <b>' + RG[bl] + '</b> / 36' + (bl < 6 ? ' · up to ' + RG[bl + 1].split('–').pop() + ' needs a reason · higher cannot be sent' : '') + '</span>'; }\nfunction pcSum(){ try{ pcBkPaint(); }catch(e){} const R = P.picks,");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
