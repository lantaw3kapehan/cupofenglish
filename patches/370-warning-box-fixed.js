// 20 Oct · The red "Final warning" box listed progress checks already sent (Mayi: ST-2024-144, ST-2026-025, ST-2025-035 — all in PR-DATA) and ignored a plan
// sent from another device (Mayi sent hers 17 Oct). Now: a progress check counts as sent when the student's last check is on/after the request (every device);
// a "⚠ My follow-up plan" message in the last 7 days counts as the plan, from any device; once the plan is in, the box becomes one calm line (Misty: "a clutter").
require('../tools/lib.js')(process.argv[2], [
  ["pcOf(r) && !done[pcOf(r)] && !(t.replies", "pcOf(r) && !done[pcOf(r)] && !(window.pcSentAfter && pcSentAfter(pcOf(r), r.at)) && !(t.replies"],
  ["const sent = plan && plan.sig === R.sig && Date.now() - plan.at < 3 * DAY;",
   "let sent = plan && plan.sig === R.sig && Date.now() - plan.at < 3 * DAY;\n" +
   "    if(!sent){ try{ const P = ((TMSG && TMSG.threads) || []).map(t => t.root).filter(r => r && r.role !== 'mgmt' && /^⚠ My follow-up plan/.test(String(r.text || ''))).map(r => tms(r.at)).filter(x => x && Date.now() - x < 7 * DAY).sort((a, b) => b - a);   /* 370: a plan sent from any device */\n" +
   "      if(P.length){ sent = true; plan = { at: P[0] }; } }catch(e){} }"],
  ["const head = R.level >= 3 ? '⛔ Final warning · management has been told'",
   "const head = sent ? '✓ Your follow-up plan is with management' : R.level >= 3 ? '⛔ Final warning · management has been told'"],
  ["const sub = R.level >= 3 ?", "const sub = sent ? 'Sent ' + sd(plan.at) + ' · management will check it at your next class visit.' : R.level >= 3 ?"],
  ["const box = '<div id=\"ftBox\"><h3>'", "const box = '<div id=\"ftBox\"' + (sent ? ' class=\"ftSent\"' : '') + '><h3>'"],
  ["#ftBox li{margin:3px 0}</style>", "#ftBox li{margin:3px 0}#ftBox.ftSent{border:1px solid #cfe7df;background:#f3faf7;padding:10px 14px}#ftBox.ftSent h3{color:#1E7A55;font-size:15px}#ftBox.ftSent .small{color:#3d6b5e!important}#ftBox.ftSent ul,#ftBox.ftSent>div:last-child,#ftBox.ftSent .ftW{display:none}</style>"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 370 */ window.pcSentAfter = function(code, at){ try{ const st = (D.students || []).concat(D.moved || []).find(s => s.code === code), lc = st && st.lastCheck; return !!(lc && String(lc).slice(0, 10) >= String(at || '').slice(0, 10)); }catch(e){ return false; } };\n</script>\n\n</body>"]
]);
