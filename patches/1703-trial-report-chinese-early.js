// 1703: (Misty, 2 Nov 10:24, Becky's trial report) "this part doesn't have Chinese translation?" · Teacher's observations and
//   recommendations had no Chinese. The report was made ahead (806) from the teacher's submission before Google's TR-DATA row was in
//   the app's copy; that path only translated the comments when the TR-DATA row was there, and the report without Chinese was kept.
//   Now the comments are translated on that path too, a report whose comments have no Chinese is never kept (it is made again next
//   time), and kept reports move to v6 so Becky's (and any other like it) is made again with the Chinese.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    else if(f.picks){ pts = f.picks.map(p => 4 - Number(p)); comm = (f.texts || [])[0]; next = (f.texts || [])[1]; cefr = f.cefr; }",
   "    else if(f.picks){ pts = f.picks.map(p => 4 - Number(p)); comm = (f.texts || [])[0]; next = (f.texts || [])[1]; cefr = f.cefr; commZh = f.commZh1703 || ''; nextZh = f.nextZh1703 || ''; }"],
  ["    if(d && d[25] && !d[27]){ try{ const z = await api('mgmtZh', TOKEN, [d[25], d[26] || ''], [t.student, t.cn || '']); if(z && z.ok && z.zh){ d[27] = z.zh[0] || ''; d[28] = z.zh[1] || ''; } }catch(e){} }",
   "    if(d && d[25] && !d[27]){ try{ const z = await api('mgmtZh', TOKEN, [d[25], d[26] || ''], [t.student, t.cn || '']); if(z && z.ok && z.zh){ d[27] = z.zh[0] || ''; d[28] = z.zh[1] || ''; } }catch(e){} }\n" +
   "    let noZh1703 = !!(d && d[25] && !d[27]);\n" +
   "    if(!d && r.sub && r.sub.f && Array.isArray(r.sub.f.texts) && r.sub.f.texts[0]){ const sf = r.sub.f; noZh1703 = true;   /* 1703: the teacher's submission (before Google's row) gets its Chinese too */\n" +
   "      try{ const z = await api('mgmtZh', TOKEN, [sf.texts[0], sf.texts[1] || ''], [t.student, t.cn || '']); if(z && z.ok && z.zh && z.zh[0]){ sf.commZh1703 = z.zh[0]; sf.nextZh1703 = z.zh[1] || ''; noZh1703 = false; } }catch(e){} }"],
  ["      await put(k, { blob: doc.output('blob'), name, at: Date.now() }); }",
   "      if(!noZh1703) await put(k, { blob: doc.output('blob'), name, at: Date.now() }); }   /* 1703: a report without the Chinese is not kept */"],
  ["(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v5';", "(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v6';"]
]);
