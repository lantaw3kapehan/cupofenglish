// Learner type on the trial report: teacher picks it (pre-filled from the enquiry age/goal); management can change it in Trials (the PDF is remade).
require('../tools/lib.js')(process.argv[2], [
 [
  "function trPaint(){",
  "const TR_GRP = [['Young learner (≤10)', 'Young learner · ≤10'], ['Teen (11–17)', 'Teen · 11–17'], ['Adult (18+)', 'Adult · 18+']];\nconst TR_GOAL = [['Adult (18+)', 'Daily speaking & free talk'], ['Adult · work English', 'English for work'], ['Adult · business English', 'Business English']];\nfunction trGrpGuess(){ const f = TRF.family || {}, a = parseInt(f.age, 10), g = String(f.goal || '') + ' ' + String(f.details || ''); if(!(a > 0)) return ''; if(a <= 10) return TR_GRP[0][0]; if(a < 18) return TR_GRP[1][0]; return /business|商务/i.test(g) ? TR_GOAL[2][0] : /\\bwork\\b|job|office|职场|工作/i.test(g) ? TR_GOAL[1][0] : TR_GOAL[0][0]; }\nfunction trGrpBox(){ if(TRS.group == null) TRS.group = trGrpGuess(); const g = TRS.group || '', ad = /^Adult/.test(g);\nreturn `<section class=\"sec\" id=\"trGrp\"><h2>Learner type <span class=\"c\">学员类型</span></h2><div class=\"small mute\">Sets the roadmap and books on the parent PDF${g && g === trGrpGuess() ? ' · filled from the enquiry, change it if needed' : ''}.</div>\n<div class=\"seg\" style=\"flex-wrap:wrap;margin-top:8px\">${TR_GRP.map(x => `<button class=\"${(x[0] === g || (ad && x[0] === TR_GRP[2][0])) ? 'on' : ''}\" onclick=\"trGrp('${x[0]}')\">${x[1]}</button>`).join('')}</div>\n${ad ? `<div class=\"small\" style=\"margin-top:10px\"><b>Adult goal</b> <span class=\"mute\">· same books as the Course plan</span></div><div class=\"seg\" style=\"flex-wrap:wrap\">${TR_GOAL.map(x => `<button class=\"${x[0] === g ? 'on' : ''}\" onclick=\"trGrp('${x[0]}')\">${x[1]}</button>`).join('')}</div>` : ''}</section>`; }\nfunction trGrp(v){ TRS.group = v; try{ trSave(); }catch(e){} const el = $('trGrp'); if(el) el.outerHTML = trGrpBox(); }\nfunction trPaint(){"
 ],
 [
  "h += `<div class=\"small mute\" style=\"margin-top:8px\">Rate each line from what you saw in the trial class.",
  "h += trGrpBox();\nh += `<div class=\"small mute\" style=\"margin-top:8px\">Rate each line from what you saw in the trial class."
 ],
 [
  "const b = $('trGo'); b.disabled = true; b.textContent = 'Sending…';",
  "if(!TRS.group){ toast('Pick the learner type · young learner, teen or adult'); const el = $('trGrp'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); return; }\nconst b = $('trGo'); b.disabled = true; b.textContent = 'Sending…';"
 ],
 [
  "{ picks: TRS.picks, texts: TRS.texts, cefr: '' }",
  "{ picks: TRS.picks, texts: TRS.texts, cefr: '', group: TRS.group || '' }"
 ],
 [
  "${x.group||x.enrolled?`<div class=\"small mute\" style=\"margin-top:6px\">${esc([x.group, x.enrolled && 'Enrolled? ' + x.enrolled].filter(Boolean).join(' · '))}</div>`:''}",
  "${tlGrpBox(x)}${x.enrolled?`<div class=\"small mute\" style=\"margin-top:6px\">Enrolled? ${esc(x.enrolled)}</div>`:''}"
 ],
 [
  "function tlPaint(){",
  "const TL_GRPS = [['Young learner (≤10)', 'Young learner'], ['Teen (11–17)', 'Teen'], ['Adult (18+)', 'Adult · daily speaking'], ['Adult · work English', 'Adult · work'], ['Adult · business English', 'Adult · business']];\nfunction tlGrpBox(x){ return `<div class=\"small\" style=\"margin-top:10px\" id=\"tlGrp\"><b>Learner type</b> <span class=\"mute\">· sets the roadmap and books on the PDF${x.group ? '' : ' · not set yet'}</span><div class=\"seg\" style=\"flex-wrap:wrap;margin-top:6px\">${TL_GRPS.map((g, i) => `<button class=\"${x.group === g[0] ? 'on' : ''}\" onclick=\"tlGrp(${i})\">${g[1]}</button>`).join('')}</div></div>`; }\nasync function tlGrp(i){ const x = TLD, g = TL_GRPS[i][0]; if(!x || x.group === g) return;\nif(x.pdf && !confirm('Change to ' + TL_GRPS[i][1] + '? The parent PDF is made again with the new roadmap (a few minutes).')) return;\ntry{ const r = await api('mgmtTrialGroup', TOKEN, x.date, x.student, g); if(!r.ok) throw r; x.group = g;\nif(r.remade){ x.pdf = ''; x.status = 'Making PDF'; TLB = null; tlPaint(); toast('Saved · the new PDF is being made (a few minutes)'); }\nelse { const el = $('tlGrp'); if(el) el.outerHTML = tlGrpBox(x); toast('Saved · ' + TL_GRPS[i][1]); } }catch(e){ toast((e && e.msg) || 'Not saved. Try again.'); } }\nfunction tlPaint(){"
 ]
]);
