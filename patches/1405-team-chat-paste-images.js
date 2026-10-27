// 1405: (Misty, 20:33) "on the message box, we cannot paste a photo to send quickly": paste (Ctrl/Cmd+V) or drop pictures into Team Chat;
//   they wait as previews above the box (remove each, add a caption, then Send — never sent by themselves); up to 5 per message, each shrunk
//   to ≤ 300 KB; pasted text stays plain text (a paste with a picture and text keeps both); ignored where the box is off (Time-in,
//   Announcements for teachers, History). Several pictures show as a small gallery.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"var im = S.img ? '<div class=\"ch-q\" style=\"margin-bottom:6px;display:flex;align-items:center;gap:8px\"><img src=\"' + S.img + '\" alt=\"Picture to send\" style=\"height:56px;border-radius:8px\">Picture ready (' + Math.round(S.img.length * 0.75 / 1024) + ' KB) · <button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.noimg()\">Remove</button></div>' : '';",
"var IM = S.imgs || [], im = IM.length ? '<div class=\"ch-thumbs\">' + IM.map(function(u, i){ return '<span class=\"ch-th\"><img src=\"' + u + '\" alt=\"Picture ' + (i + 1) + ' to send\"><button type=\"button\" aria-label=\"Remove picture ' + (i + 1) + '\" onclick=\"chat1400.noimg(' + i + ')\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button></span>'; }).join('') + '<span class=\"ch-note\" style=\"padding:0\">' + IM.length + ' of 5 · type a caption, then Send</span></div>' : '';"
],
[
"file: async function(inp){ var f = inp.files && inp.files[0]; if(!f) return; try{ S.img = await shrink(f, 300000); render(true); }catch(e){ toast2('That picture could not be read'); } },",
"file: async function(inp){ await A.addImgs([].slice.call(inp.files || [])); inp.value = ''; },\n    addImgs: async function(F){ F = F.filter(function(f){ return f && /^image\\//.test(f.type || ''); }); if(!F.length || !document.getElementById('chTx')) return; S.imgs = S.imgs || []; var room = 5 - S.imgs.length; if(room <= 0){ toast2('Up to 5 pictures per message'); return; } if(F.length > room) toast2('Up to 5 pictures per message · added ' + room);\n      var tx = document.getElementById('chTx'), keep = tx ? tx.value : ''; for(var i = 0; i < Math.min(room, F.length); i++){ try{ S.imgs.push(await shrink(F[i], 300000)); }catch(e){ toast2('That picture could not be read'); } } S.img = S.imgs[0] || null; render(true); var t2 = document.getElementById('chTx'); if(t2){ t2.value = keep; t2.focus(); } syncSend(); },\n    paste: function(e){ var it = (e.clipboardData && e.clipboardData.items) || [], F = []; for(var i = 0; i < it.length; i++){ if(it[i].kind === 'file' && /^image\\//.test(it[i].type)){ var f = it[i].getAsFile(); if(f) F.push(f); } } if(!F.length) return; var txt = e.clipboardData.getData('text/plain'); e.preventDefault(); if(txt){ var t = e.target, a = t.selectionStart, b = t.selectionEnd; t.value = t.value.slice(0, a) + txt + t.value.slice(b); } A.addImgs(F); },\n    dov: function(e){ if(!e.dataTransfer || [].slice.call(e.dataTransfer.types || []).indexOf('Files') < 0) return; e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = document.getElementById('chTx') ? 'copy' : 'none'; },\n    drop: function(e){ if(!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return; e.preventDefault(); e.stopPropagation(); if(!document.getElementById('chTx')){ toast2('Pictures can\\'t be sent in this chat'); return; } A.addImgs([].slice.call(e.dataTransfer.files)); },"
],
[
"noimg: function(){ S.img = null; render(true); },",
"noimg: function(i){ S.imgs = S.imgs || []; if(i == null) S.imgs = []; else S.imgs.splice(i, 1); S.img = S.imgs[0] || null; render(true); syncSend(); },"
],
[
"else if(m.img && !m.hidden) inner += '<img src=\"' + esc(m.img) + '\" alt=\"' + (m.kind === 'timein' ? 'Time-in picture' : 'Picture') + '\" loading=\"lazy\" onclick=\"chat1400.zoom(this.src)\">';",
"else if(m.img && !m.hidden) inner += (m.imgs && m.imgs.length > 1 ? '<div class=\"ch-gal\">' + m.imgs.map(function(u, i){ return '<img src=\"' + esc(u) + '\" alt=\"Picture ' + (i + 1) + '\" loading=\"lazy\" onclick=\"chat1400.zoom(this.src)\">'; }).join('') + '</div>' : '<img src=\"' + esc(m.img) + '\" alt=\"' + (m.kind === 'timein' ? 'Time-in picture' : 'Picture') + '\" loading=\"lazy\" onclick=\"chat1400.zoom(this.src)\">');"
],
[
"var img = voice ? null : S.img, rt = S.replyTo, op = S.opt",
"var img = voice ? null : S.img, imgs = voice ? [] : (S.imgs || []).slice(), rt = S.replyTo, op = S.opt"
],
[
"img: voice || img, at:",
"img: voice || img, imgs: imgs.length > 1 ? imgs : null, at:"
],
[
"if(!voice){ t.value = ''; S.img = null; }",
"if(!voice){ t.value = ''; S.img = null; S.imgs = []; }"
],
[
"img: img, voice: voice || null, parent_id: rt ? rt.id : null, cid: cid });",
"img: imgs.length > 1 ? null : img, imgs: imgs.length > 1 ? imgs : null, voice: voice || null, parent_id: rt ? rt.id : null, cid: cid });"
],
[
"<input type=\"file\" id=\"chFile\" accept=\"image/*\"",
"<input type=\"file\" id=\"chFile\" accept=\"image/*\" multiple"
],
[
"<textarea id=\"chTx\" rows=\"1\"",
"<textarea id=\"chTx\" rows=\"1\" onpaste=\"chat1400.paste(event)\""
],
[
"'</div><div class=\"ch-main\">' + head",
"'</div><div class=\"ch-main\" ondragover=\"chat1400.dov(event)\" ondrop=\"chat1400.drop(event)\">' + head"
],
[
"</body>\n</html>",
"<style>\n/* 1405 · paste / drop pictures (Misty 20:33) */\n#v-chat .ch-thumbs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px}\n#v-chat .ch-th{position:relative;width:64px;height:64px;border-radius:10px;overflow:hidden;border:1px solid #DCE1E6;flex:none}\n#v-chat .ch-th img{width:100%;height:100%;object-fit:cover;display:block}\n#v-chat .ch-th button{position:absolute;top:2px;right:2px;width:24px;height:24px;border:0;border-radius:50%;background:rgba(31,29,58,.75);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}\n#v-chat .ch-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-top:4px;max-width:420px}\n#v-chat .ch-gal img{width:100%;height:120px;object-fit:cover;border-radius:8px;margin:0;cursor:zoom-in}\n/* 1405 · laptop header: when the side panel narrows the chat, the buttons show icons only so the title stays on one line */\n#v-chat .ch-main{container-type:inline-size}\n#v-chat .ch-hd .ch-b{position:relative}\n@media(max-width:900px){#v-chat .ch-hd .ch-b span{display:block!important;position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}\n#v-chat .ch-hd>div:nth-child(2){min-width:150px}\n#v-chat .ch-hd .chT{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#v-chat .ch-hd small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}\n@container (max-width:760px){#v-chat .ch-hd .ch-b span{display:block!important;position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#v-chat .ch-hd .ch-b{width:40px;padding:0;justify-content:center}}\n</style>\n</body>\n</html>"
]
]);
