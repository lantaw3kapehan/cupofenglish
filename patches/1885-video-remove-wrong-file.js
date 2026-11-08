// 1885: (Misty 8 Nov 10:20 "Mayi uploaded the wrong video so how to fix this easily? must we do it manually, or?")
//   Overview › Videos to check: "Wrong file · remove" on every video (waiting or reviewed). After a confirm it calls Google's
//   mgmtVidRemove: the wrong file goes to Drive's Trash (renamed REMOVED-…), the class's video record and check are cleared,
//   and the teacher gets a message to upload the right video. She can then upload again as usual.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["      '<a class=\"btn sm ghost\" href=\"' + esc(x.url) + '\" target=\"_blank\">Open</a>' + (x.st === 'open' ?",
   "      '<a class=\"btn sm ghost\" href=\"' + esc(x.url) + '\" target=\"_blank\">Open</a><button class=\"btn sm ghost\" style=\"color:#B03A2E;border-color:#E9B8AE\" onclick=\"vcRemove1885(\\'' + esc(x.id) + '\\')\">Wrong file · remove</button>' + (x.st === 'open' ?"],
  ["  window.vcSet = (id, st) => { if(st !== 'action') return vcSave(id, st, '');",
   `  /* 1885 · remove a wrong upload so the teacher can upload the right file */
  window.vcRemove1885 = id => { const x = (MF || []).find(y => y.id === id); if(!x) return;
    const who = typeof tName === 'function' ? tName(x.teacher) : x.teacher, when = dd(x.start, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
    window._vcRm = async () => { const b = $('vcRmGo'); if(b){ b.disabled = true; b.textContent = 'Removing…'; }
      let r = null; try{ r = await apiNow('mgmtVidRemove', TOKEN, { id: x.id, ds: x.ds || String(x.start || '').slice(0, 10) }); }catch(e){ r = { ok: false, msg: e.message }; }
      if(!r || !r.ok){ if(b){ b.disabled = false; b.textContent = 'Remove the wrong video'; } return toast((r && r.msg) || 'Not removed · try again'); }
      closeSheet(); MF = (MF || []).filter(y => y.id !== id); try{ localStorage.setItem('coe.vflagsm', JSON.stringify(MF)); }catch(e){} mPaint();
      toast('Removed ✓ · ' + who + ' was asked to upload the right video'); };
    openSheet('<h3 style="margin:0 0 6px">Remove this video?</h3><div class="small mute">' + esc(who) + ' · ' + esc(x.student || x.code) + ' · ' + esc(when) + '</div>'
      + '<div style="background:#FFF6E6;border:1.5px solid #F0D29A;border-radius:14px;padding:12px 14px;margin-top:10px;color:#7A5410;line-height:1.5">The video goes to Drive\\'s Trash (it can be restored for 30 days), the class shows <b>no video</b> again, and ' + esc(who) + ' gets a message in the app to upload the right file. Her new upload counts as a late upload.</div>'
      + '<button class="btn block" id="vcRmGo" style="margin-top:12px;background:#B03A2E;color:#fff;border-color:#B03A2E" onclick="_vcRm()">Remove the wrong video</button><button class="btn ghost block" style="margin-top:8px" onclick="closeSheet()">Cancel</button>'); };
  window.vcSet = (id, st) => { if(st !== 'action') return vcSave(id, st, '');`],
]);
