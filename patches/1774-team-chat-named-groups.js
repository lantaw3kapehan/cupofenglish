// 1774: (Misty 5 Nov 11:51 "make groupchats with teachers for example, Pam and Rose for training … easy to add and remove, and we should also
//   can name the groupchat" · 11:53 "also … INTERVIEW … easy to coordinate through the app")
//   Team Chat › GROUPS › "+ New group" (management): name it, tick the people (teachers and staff), Save. The group shows only for those people
//   and management. In the group, "Edit group" renames it, adds or removes people, or closes it (messages are kept). Each change is written in
//   the group ("CupOfEnglish added Teacher Rose"). Data: coe-chat v18 actions gsave / garchive (chat_groups.members).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return '<div class=\"ch-sec\">GROUPS</div>' + g1.map(it).join('')",
   "return '<div class=\"ch-sec\">GROUPS' + (isMgr() ? ' <button type=\"button\" class=\"ch-b sm\" style=\"float:right;margin-top:-4px;font-size:12px\" onclick=\"chat1400.gEdit()\" title=\"Make a group for chosen people\">+ New group</button>' : '') + '</div>' + g1.map(it).join('')"],
  ["' people can read this chat</div>' + (isMgr() ? '<button type=\"button\" class=\"ch-b sm\" style=\"margin:4px 0 2px\" onclick=\"chat1400.roster()\">Manage members</button>' : '')",
   "' people can read this chat</div>' + (isMgr() ? (((S.init && S.init.groups) || []).some(function(g){ return g.id === S.gid && g.custom; }) ? '<button type=\"button\" class=\"ch-b sm\" style=\"margin:4px 0 2px\" onclick=\"chat1400.gEdit(\\'' + esc(S.gid) + '\\')\">Edit group</button>' : '<button type=\"button\" class=\"ch-b sm\" style=\"margin:4px 0 2px\" onclick=\"chat1400.roster()\">Manage members</button>') : '')"],
  ["  function chanDesc(){ var t = S.gid && S.gid.indexOf('dm:') === 0 ?",
   "  function chanDesc(){ var cg1774 = ((S.init && S.init.groups) || []).find(function(g){ return g.id === S.gid && g.custom; }); var t = cg1774 ? 'Group chat with ' + (cg1774.people || []).join(', ') + ' and management. Only these people can read it.' : S.gid && S.gid.indexOf('dm:') === 0 ?"],
  ["    roster: async function(){ var r = await post('roster');",
   "    /* 1774 · named groups (management) */\n" +
   "    gEdit: function(gid){ if(!isMgr() || typeof openSheet !== 'function') return; var g = gid ? ((S.init && S.init.groups) || []).find(function(x){ return x.id === gid; }) : null;\n" +
   "      var sel = (g && g.people || []).map(function(x){ return String(x).toLowerCase(); }), P = ((S.init && S.init.members) || []).filter(function(m){ return !m.mgmt; }).sort(function(a, b){ return String(a.name).localeCompare(String(b.name)); });\n" +
   "      var box = function(m){ var on = sel.indexOf(String(m.name).toLowerCase()) > -1; return '<label style=\"display:flex;gap:8px;align-items:center;padding:7px 4px;border-bottom:1px solid #EEF0F4\"><input type=\"checkbox\" value=\"' + esc(m.name) + '\"' + (on ? ' checked' : '') + '><span>' + esc(m.name) + '</span><span class=\"ch-note\" style=\"padding:0;margin-left:auto\">' + esc(m.kind === 'staff' ? (m.team || 'Staff') + (m.des ? ' · ' + m.des : '') : 'Teacher') + '</span></label>'; };\n" +
   "      var T = P.filter(function(m){ return m.kind !== 'staff'; }), St = P.filter(function(m){ return m.kind === 'staff'; });\n" +
   "      openSheet('<h2 style=\"font-family:\\'Fredoka One\\',sans-serif;font-weight:400;margin:0 0 4px\">' + (g ? 'Edit group' : 'New group') + '</h2><div style=\"color:#5E6272;font-size:13px;margin-bottom:10px\">Only the people you tick (and management) can see this group. For example: Training · Pam &amp; Rose, or Interview.</div>'\n" +
   "        + '<label>Group name</label><input id=\"cg1774N\" class=\"in-t\" maxlength=\"60\" placeholder=\"e.g. Training · Pam &amp; Rose\" value=\"' + esc(g ? g.name : '') + '\">'\n" +
   "        + '<div id=\"cg1774L\" style=\"margin-top:10px;max-height:46vh;overflow:auto\">' + (T.length ? '<div class=\"ch-sec\" style=\"padding-left:0\">TEACHERS</div>' + T.map(box).join('') : '') + (St.length ? '<div class=\"ch-sec\" style=\"padding-left:0\">STAFF</div>' + St.map(box).join('') : '') + '</div>'\n" +
   "        + '<button type=\"button\" class=\"btn block\" style=\"margin-top:14px\" onclick=\"chat1400.gSave(\\'' + esc(g ? g.id : '') + '\\', this)\">' + (g ? 'Save changes' : 'Make the group') + '</button>'\n" +
   "        + (g ? '<button type=\"button\" class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"chat1400.gClose(\\'' + esc(g.id) + '\\', this)\">Close this group</button><p class=\"small mute\" style=\"margin-top:6px\">Closing hides the group for everyone; its messages stay in the database.</p>' : '')); },\n" +
   "    gSave: async function(gid, el){ var n = ((document.getElementById('cg1774N') || {}).value || '').trim(); if(n.length < 2){ toast2('Name the group'); return; }\n" +
   "      var ppl = [].map.call(document.querySelectorAll('#cg1774L input:checked'), function(x){ return x.value; }); if(!ppl.length){ toast2('Tick at least one person'); return; }\n" +
   "      if(el) el.disabled = true; var r = await post('gsave', { gid: gid || '', name: n, people: ppl }).catch(function(){ return null; }); if(el) el.disabled = false;\n" +
   "      if(!r || !r.ok){ toast2((r && r.error) || 'Not saved · check the internet and try again'); return; }\n" +
   "      try{ closeSheet(); }catch(e){} toast2(gid ? 'Group saved' : 'Group made: ' + r.name); var i0 = await post('init'); if(i0 && i0.ok && !i0.off) S.init = i0; S.mem = null; A.open(r.gid); },\n" +
   "    gClose: async function(gid, el){ if(el && !el.dataset.sure){ el.dataset.sure = '1'; el.textContent = 'Tap again to close the group'; return; }\n" +
   "      var r = await post('garchive', { gid: gid }).catch(function(){ return null; }); if(!r || !r.ok){ toast2((r && r.error) || 'Not closed'); return; }\n" +
   "      try{ closeSheet(); }catch(e){} toast2('Group closed'); var i0 = await post('init'); if(i0 && i0.ok && !i0.off) S.init = i0; S.mem = null; A.open('all'); },\n" +
   "    roster: async function(){ var r = await post('roster');"],
]);
