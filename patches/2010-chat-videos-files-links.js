// 2010 (9 Nov 17:00, Misty: "on our teachers chat on team chat, if we wanted to share videos later on or links, from different apps, it's also
//   easy for us to share it there · like a communication app like WeChat · because I'm gonna disable the WeChat teachers group now"):
//   everyone's Team Chat (teachers and management).
//   · Links in messages open in a new tab (http, https, www).
//   · Paperclip button: share a video (mp4, mov, webm) or a file (PDF, Word, Excel, PowerPoint, text, csv, zip), up to 50 MB.
//     Uploads straight to storage with a one-time link from coe-chat v22 (upurl), with progress, then posts it; the text box becomes the caption.
//     Videos play in the chat; files open in a new tab. Not in teachers' Time-in (pictures only, as before).
//   · Management (Misty 17:03 "remove this notes below it as well, irrelevant"): the description line under the chat name is gone.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "  function body(m){ var t = esc(m.body);",
  "\n  /* 2010 · videos and files in Team Chat (Misty: \"share videos later on or links, from different apps … like WeChat\") */\n  function size2010(n){ n = +n || 0; return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }\n  function file2010(m){ var f = (m.meta && m.meta.file) || {}, nm = esc(f.name || (m.kind === 'video' ? 'Video' : 'File'));\n    if(m.kind === 'video') return '<video class=\"ch-vid\" controls preload=\"metadata\" playsinline src=\"' + esc(m.img) + '\"></video><div class=\"ch-fsz\">' + nm + (f.size ? ' · ' + size2010(f.size) : '') + ' · <a href=\"' + esc(m.img) + '\" target=\"_blank\" rel=\"noopener\">Open</a></div>';\n    return '<a class=\"ch-fl9\" href=\"' + esc(m.img) + '\" target=\"_blank\" rel=\"noopener\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"/><path d=\"M14 3v6h6\"/></svg><span><b>' + nm + '</b><small>' + (f.size ? size2010(f.size) + ' · ' : '') + 'Open</small></span></a>'; }\n  function link2010(t){ return t.replace(/(^|[\\s(])((?:https?:\\/\\/|www\\.)[^\\s<]+)/g, function(x, pre, u){ var tail = ''; while(/[.,!?;:)\\]]$/.test(u)){ tail = u.slice(-1) + tail; u = u.slice(0, -1); } return pre + '<a class=\"ch-lnk\" href=\"' + (/^www\\./i.test(u) ? 'https://' : '') + u + '\" target=\"_blank\" rel=\"noopener\">' + u + '</a>' + tail; }); }\n  function body(m){ var t = esc(m.body);"
 ],
 [
  "      t = t.replace(re, function(x){ var me = n.toLowerCase() === meLc() || n === 'All' || n === AL()[S.init.me]; return '<span class=\"ch-at' + (me ? ' me' : '') + '\">' + x + '</span>'; }); });\n    return t; }",
  "      t = t.replace(re, function(x){ var me = n.toLowerCase() === meLc() || n === 'All' || n === AL()[S.init.me]; return '<span class=\"ch-at' + (me ? ' me' : '') + '\">' + x + '</span>'; }); });\n    return link2010(t); }   /* 2010: links open in a new tab */"
 ],
 [
  "' + I.pic + '</button>'",
  "' + I.pic + '</button>' + (S.gid === 'timein' && !isMgr() ? '' : '<input type=\"file\" id=\"chFile9\" accept=\"video/*,.mp4,.mov,.webm,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip\" hidden onchange=\"chat1400.file9(this)\"><button type=\"button\" class=\"ch-ib\" aria-label=\"Share a video or file\" title=\"Share a video or file (up to 50 MB)\" onclick=\"document.getElementById(\\'chFile9\\').click()\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5\"/></svg></button>')   /* 2010 */"
 ],
 [
  "if(m.kind === 'voice' && m.img && !m.hidden) inner = '<audio controls",
  "if((m.kind === 'video' || m.kind === 'file') && m.img && !m.hidden) inner = file2010(m) + (m.body ? '<div style=\"margin-top:6px\">' + body(m) + '</div>' : ''); else if(m.kind === 'voice' && m.img && !m.hidden) inner = '<audio controls"
 ],
 [
  "    m2009: function(k){",
  "    file9: async function(inp){ var f = inp && inp.files && inp.files[0]; if(inp) inp.value = ''; if(!f) return; var g = S.gid;   /* 2010 */\n      if(f.size > 50 * 1048576){ toast2('The file is too large. Files up to 50 MB can be shared.'); return; }\n      var ty = f.type || ({ mov: 'video/quicktime', mp4: 'video/mp4', pdf: 'application/pdf', csv: 'text/csv', txt: 'text/plain', zip: 'application/zip' })[String(f.name.split('.').pop()).toLowerCase()] || '';\n      var u = await post('upurl', { gid: g, name: f.name, type: ty, size: f.size }).catch(function(){ return null; }); if(!u || !u.ok){ toast2((u && u.error) || 'Not sent · check the internet and try again'); return; }\n      var t = document.getElementById('chTx'), cap = t ? t.value.trim() : ''; if(t) t.value = ''; syncSend();\n      var ok = await new Promise(function(res){ var x = new XMLHttpRequest(), fd = new FormData(); fd.append('cacheControl', '3600'); fd.append('', f); x.open('PUT', u.url); x.setRequestHeader('x-upsert', 'false');\n        x.upload.onprogress = function(e){ if(e.lengthComputable) toast2('Uploading ' + f.name + ' · ' + Math.round(e.loaded / e.total * 100) + '%'); };\n        x.onload = function(){ res(x.status >= 200 && x.status < 300); }; x.onerror = function(){ res(false); }; x.send(fd); });\n      if(!ok){ toast2('The upload did not finish. Check the internet and try again.'); if(t && cap) t.value = cap; return; }\n      var r = await post('send', { gid: g, body: cap, mentions: [], file: { path: u.path, name: f.name, type: ty, size: f.size }, cid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }).catch(function(){ return null; });\n      if(r && r.ok){ toast2(/^video\\//.test(ty) ? 'Video sent' : 'File sent'); if(r.cls) try{ focus2008(r.cls); }catch(e){} if(g === S.gid) load(true); } else toast2((r && r.error) || 'Not sent · check the internet and try again'); },\n    m2009: function(k){"
 ],
 [
  "<style id=\"css2009\">",
  "<style id=\"css2010\">\n/* 2010 · videos, files and links in Team Chat */\n#v-chat .ch-vid{display:block;max-width:min(440px,100%);max-height:320px;border-radius:12px;background:#000}\n#v-chat .ch-fsz{font-size:12.5px;color:#5E6272;margin-top:4px}\n#v-chat .ch-fl9{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid #E3E7EB;border-radius:12px;background:#fff;color:#2D2A4A;text-decoration:none;max-width:360px}\n#v-chat .ch-fl9 span{display:flex;flex-direction:column;min-width:0}\n#v-chat .ch-fl9 b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#v-chat .ch-fl9 small{font-size:12.5px;color:#2B7F80}\n#v-chat .ch-lnk{color:#2B7F80;text-decoration:underline;overflow-wrap:anywhere}\n</style>\n<style id=\"css2009\">"
 ],
 [
  "mid = chanDesc() + pin + op + ",
  "mid = (isMgr() ? '' : chanDesc()) + pin + op + "
 ]
]);
