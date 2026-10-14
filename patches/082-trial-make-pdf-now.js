// 14 Oct · Trial reports: "Make PDF now" for management while a report is still waiting for its PDF (the sheet's job only
// runs hourly). The server (mgmtTrialPdfNow) adds the Chinese, makes the same two-page PDF and saves it like the sheet does.
require('../tools/lib.js')(process.argv[2], [
["The PDF is being made'} · usually a few minutes after the teacher sends the report. Pull to refresh later.</div>`}</div>",
 "The PDF is being made'} · usually a few minutes after the teacher sends the report. Pull to refresh later.</div><button class=\"btn teal sm\" id=\"tlNow\" style=\"margin-top:8px\" onclick=\"tlPdfNow()\">Make PDF now</button>`}</div>"],
["function tlPaint(){",
 "async function tlPdfNow(){ const x = TLD, b = $('tlNow'); if(!x || !x.label || !b || b.disabled) return; b.disabled = true; b.textContent = 'Making the PDF… about 30–60 s';\n" +
 "try{ const r = await api('mgmtTrialPdfNow', TOKEN, x.label); if(!r || !r.ok) throw r; x.pdf = r.url; if(x.status !== 'Sent') x.status = 'Ready'; TRL = TRL || {}; const i = (TRL.rows || []).indexOf(x); toast('✓ PDF made · ' + x.student); if(i > -1) tlOpen(i); else tlPaint(); try{ loadTrials(); }catch(e){} }\n" +
 "catch(e){ b.disabled = false; b.textContent = 'Make PDF now'; toast((e && (e.msg || e.message)) || 'Could not make the PDF. Try again.'); } }   /* 14 Oct */\n" +
 "function tlPaint(){"],
]);
