// 2014 (9 Nov 17:15, Misty: "for the group of ALL TEACHERS, allow me to edit its group name"): management · More › "Rename this group"
//   for any group (All Teachers, Time-in, Substitutes and the named groups). coe-chat v23 grename saves it and posts a short "renamed" line.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "it('hist', 'Go to a date') + '</div>'",
  "it('hist', 'Go to a date') + (c && String(S.gid).indexOf('dm:') !== 0 ? it('ren9', 'Rename this group') : '') + '</div>'"
 ],
 [
  "    m2009: function(k){",
  "    ren9: function(){ var g = (S.init.groups || []).find(function(x){ return x.id === S.gid; }) || {}; if(typeof openSheet !== 'function') return;   /* 2014 */\n      openSheet('<h2 style=\"font-family:\\'Fredoka One\\',sans-serif;font-weight:400;margin:0 0 10px\">Rename this group</h2><label for=\"chRen9\" style=\"display:block;font-size:14px;color:#5E6272;margin-bottom:6px\">Group name</label><input id=\"chRen9\" maxlength=\"60\" value=\"' + esc(g.name || '') + '\" style=\"width:100%;box-sizing:border-box;font-size:16px;padding:10px 12px;border:1px solid #D9DEE3;border-radius:10px\" onkeydown=\"if(event.key===\\'Enter\\')chat1400.ren9s()\"><div style=\"font-size:13.5px;color:#5E6272;margin-top:8px\">Everyone in the group sees the new name. A short line in the chat says it was renamed.</div><div id=\"chRen9e\" role=\"alert\" style=\"color:#9B2C1F;font-size:14px;margin-top:6px\"></div><button type=\"button\" class=\"btn teal\" style=\"margin-top:12px;width:100%\" onclick=\"chat1400.ren9s()\">Save name</button>');\n      setTimeout(function(){ var i = document.getElementById('chRen9'); if(i){ i.focus(); i.select(); } }, 60); },\n    ren9s: async function(){ var i = document.getElementById('chRen9'), e = document.getElementById('chRen9e'), nm = i ? i.value.trim() : '', gid = S.gid; if(nm.length < 2){ if(e) e.textContent = 'Type a name of at least 2 letters.'; return; }\n      var r = await post('grename', { gid: gid, name: nm }).catch(function(){ return null; }); if(!r || !r.ok){ if(e) e.textContent = (r && r.error) || 'Not saved. Check the internet and try again.'; return; }\n      (S.init.groups || []).forEach(function(x){ if(x.id === gid) x.name = r.name; }); if(typeof closeSheet === 'function') closeSheet(); toast2('Group renamed to ' + r.name); render(true); load(true); },\n    m2009: function(k){"
 ]
]);
