// 1721: (Misty, 3 Nov 14:39) "a little bit slow" · "I already removed but it's still here"
//   · The removal had worked (Google TC&SUB row deleted, APP-EDITS logged), but Lessons counted kept showing the copy it had loaded earlier.
//     Now: Lessons counted reloads from the database when its copy is over 1 minute old, and after every Fix it forgets its copy.
//   · Trial/sub Fix saves in the background: the sheet closes at once with a "Saving…" bar that turns ✓ (or shows why it was refused).
//   · Google side (Version 458): a fixed TC&SUB is copied to the database every 2 minutes for 40 minutes, so the list catches up in ~2–4 min.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let IDX = null, DET = {};", "let IDX = null, DET = {}, AT17 = 0; window.u17reset = () => { IDX = null; DET = {}; AT17 = 0; };"],
  ["if(IDX && (view === 'grid' || DET[ym])) return paint();", "if(IDX && (view === 'grid' || DET[ym]) && Date.now() - AT17 < 60000) return paint(); if(Date.now() - AT17 >= 60000){ IDX = null; DET = {}; }"],
  ["if(d['mgmt:tunits']) IDX = d['mgmt:tunits'].data;", "if(d['mgmt:tunits']) IDX = d['mgmt:tunits'].data; AT17 = Date.now();"],
  ["const n = await resync([day]); toast('✓ ' + (action === 'cancel' ? 'Not counted' : 'Counted')", "const n = await resync([day]); try{ u17reset(); }catch(x){} toast('✓ ' + (action === 'cancel' ? 'Not counted' : 'Counted')"],
  ["const n = await resync([d]); toast('✓ Class added", "const n = await resync([d]); try{ u17reset(); }catch(x){} toast('✓ Class added"],
  ["    toast('Saving…');\n    try{\n      if(mode === 'remove'){",
   "    const lbl = H(x.name || x.code) + ' · ' + H(dd(day)) + ' ' + H(x.t || ''), pk = typeof svPill === 'function' ? svPill(null, '⏳ ' + (mode === 'dup' ? 'Removing the duplicate' : 'Removing') + ' <b>' + lbl + '</b> in Google…', 'wait') : null;\n    closeSheet(); if(!pk) toast('Saving…');\n    try{\n      if(mode === 'remove'){"],
  ["toast('✓ ' + (r.note || 'Done') + ' · pay and Lessons counted update in a few minutes'); closeSheet(); }\n    catch(e){ toast((e && (e.msg || e.message)) || 'Not saved. Try again.'); } };",
   "try{ u17reset(); }catch(x){} const okH = '✓ <b>' + H(r.note || 'Done') + '</b> · ' + lbl + ' · Lessons counted and pay update in about 2–4 minutes'; if(pk) svPill(pk, okH, 'ok'); else toast('✓ ' + (r.note || 'Done')); }\n    catch(e){ const m = (e && (e.msg || e.message)) || 'Not saved. Try again.'; if(pk) svPill(pk, '✗ <b>Not saved</b> · ' + lbl + ' · ' + H(m), 'bad'); else toast(m); } };"]
]);
