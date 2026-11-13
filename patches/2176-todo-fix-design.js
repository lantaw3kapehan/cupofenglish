// 2176 (13 Nov · Misty 19:42 "in management access … enhance To do visual and design" · "we don't usually call parents … we chat or
// send a message to their WeChat group chat"): To do › Fix these is grouped by kind (Wi-Fi checks · Data to check · Renewals · Students
// at risk · Trial follow-ups), each group with an icon, colour, count and one-line hint, collapsible (remembered on this device). Each item
// shows the student's name in bold, the code and teacher as small tags, the reasons as chips and one clear next step in a full sentence
// (no "·" inside sentences). "At risk" is a WeChat message, not a call: Copy message (English + Chinese) and "Messaged ✓".
// Same buttons and handlers as before (o2091ok / o2091go by index); nothing is removed.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["(it.length ? 'Fix these · ' + it.length : 'Fix these')", "('Fix these' + (it.length ? ' <span class=\"fx-cnt\">' + it.length + '</span>' : ''))"],
  ["return h + it.map(function(x, i){ return '<div class=\"o91-it\"><div class=\"o91-tx\">' + E(x.text) + '</div><div class=\"o91-bt\">' +",
   "return h + (window.fx2176Group || function(L, f){ return L.map(f).join(''); })(it, function(x, i){ return '<div class=\"o91-it k-' + String(x.kind || '').replace(/[^a-z0-9-]/g, '') + '\">' + (window.fx2176Head ? fx2176Head(x) : '<div class=\"o91-tx\">' + E(x.text) + '</div>') + '<div class=\"o91-bt\">' + (x.kind === 'risk' ? '<button type=\"button\" data-s=\"' + String(x.text || '').replace(/^At risk · /, '').split(' (')[0].replace(/[\"<>&]/g, '') + '\" onclick=\"rk2176(this)\">Copy message</button>' : '') +"],
  ["'</button></div></div>'); }).join('') + '</div>'; }", "'</button></div></div>'); }) + '</div>'; }"],
  ["x.kind === 'risk' ? 'Called ✓'", "x.kind === 'risk' ? 'Messaged ✓'"],
  ["x.kind === 'risk' ? '✓ Noted · it comes back next week only if still at risk'", "x.kind === 'risk' ? '✓ Noted. It comes back next week only if the student is still at risk.'"],
  ["</script>\n</body>\n</html>", `</script>
<style id="css2176">
#o91fix h2 .fx-cnt{display:inline-block;min-width:26px;padding:1px 9px;margin-left:6px;border-radius:999px;background:#F1EFF8;color:#2B2253;font:600 14px Inter,sans-serif;vertical-align:3px;text-align:center}
#o91fix .fx-g{margin-top:14px;border:1px solid #ECEAF2;border-radius:14px;overflow:hidden;background:#fff}
#o91fix .fx-gh{display:flex;align-items:center;gap:10px;padding:11px 14px;cursor:pointer;user-select:none;background:var(--fx-bg);border-bottom:1px solid #ECEAF2}
#o91fix .fx-g.shut .fx-gh{border-bottom:0}
#o91fix .fx-ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:#fff;color:var(--fx-c);flex:none;box-shadow:0 0 0 1px var(--fx-ring)}
#o91fix .fx-gh b{font:600 16px Inter,sans-serif;color:#2B2253}
#o91fix .fx-n{padding:1px 9px;border-radius:999px;background:var(--fx-c);color:#fff;font:600 13px Inter,sans-serif}
#o91fix .fx-hint{flex:1;min-width:0;font-size:14px;color:#5E5A72}
#o91fix .fx-car{color:#8A86A0;transition:transform .15s;margin-left:auto;flex:none}#o91fix .fx-g.shut .fx-car{transform:rotate(-90deg)}
#o91fix .fx-g.shut .o91-it{display:none}
#o91fix .fx-g .o91-it{margin:0;padding:12px 14px 12px 16px;border-top:1px solid #F3F2F8;border-left:3px solid var(--fx-c)}
#o91fix .fx-g .o91-it:first-of-type{margin-top:0;border-top:0}
#o91fix .fx-hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 8px}
#o91fix .fx-nm{font:600 16px Inter,sans-serif;color:#2B2253}
#o91fix .fx-tag{font-size:13px;color:#5E5A72;background:#F6F5FA;border-radius:6px;padding:1px 7px}
#o91fix .fx-ch{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
#o91fix .fx-ch span{font-size:13px;line-height:1.35;color:var(--fx-t);background:var(--fx-bg);border:1px solid var(--fx-ring);border-radius:8px;padding:3px 8px}
#o91fix .fx-do{margin-top:6px;font-size:14px;color:#3D3760}
#o91fix .fx-do b{color:var(--fx-t);font-weight:600}
#o91fix .fx-wifi{--fx-c:#C2553C;--fx-bg:#FDF3F0;--fx-ring:#F2D3CA;--fx-t:#9A3F2B}
#o91fix .fx-data{--fx-c:#5B4FC4;--fx-bg:#F4F2FD;--fx-ring:#DCD7F6;--fx-t:#45399E}
#o91fix .fx-renew{--fx-c:#C98A12;--fx-bg:#FFF8E9;--fx-ring:#F2DFB2;--fx-t:#7A5300}
#o91fix .fx-risk{--fx-c:#D0566C;--fx-bg:#FDF2F4;--fx-ring:#F3CFD6;--fx-t:#9C2F45}
#o91fix .fx-trial{--fx-c:#00808B;--fx-bg:#EEF8F8;--fx-ring:#C9E7E9;--fx-t:#005F66}
@media(max-width:640px){#o91fix .fx-hint{display:none}#o91fix .fx-g .o91-it{flex-direction:column}}
</style>
<script id="x2176">
/* 2176 · To do › Fix these: groups, names, reason chips, one next step */
(function(){
  if(window.__x2176) return; window.__x2176 = 1;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const IC = {
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>',
    data: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    renew: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    risk: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    trial: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'
  };
  const G = [
    ['wifi', 'Wi-Fi checks', 'Look at the picture and decide.', k => /^(wifi|wifi5|shot)$/.test(k)],
    ['data', 'Data to check', 'Payments, partners and classes that do not match.', k => !/^(wifi|wifi5|shot|renew|risk|tfu|tagain)$/.test(k)],
    ['renew', 'Renewals', 'Remind or follow up in WeChat today.', k => k === 'renew'],
    ['risk', 'Students at risk', 'Send the parent a friendly WeChat message this week.', k => k === 'risk'],
    ['trial', 'Trial follow-ups', 'Send the next message or close the trial.', k => k === 'tfu' || k === 'tagain']
  ];
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const shut = () => { try{ return JSON.parse(localStorage.getItem('coe.fx2176') || '{}') || {}; }catch(e){ return {}; } };
  window.fx2176Toggle = function(el){ try{ const g = el.closest('.fx-g'); g.classList.toggle('shut'); const s = shut(); s[g.dataset.g] = g.classList.contains('shut') ? 1 : 0; localStorage.setItem('coe.fx2176', JSON.stringify(s)); }catch(e){} };
  window.fx2176Group = function(L, f){
    try{ const S = shut();
      return G.map(([id, nm, hint, test]) => { const rows = []; L.forEach((x, i) => { if(test(String(x.kind || ''))) rows.push(f(x, i)); }); if(!rows.length) return '';
        return '<section class="fx-g fx-' + id + (S[id] ? ' shut' : '') + '" data-g="' + id + '"><div class="fx-gh" onclick="fx2176Toggle(this)"><span class="fx-ic"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[id] + '</svg></span><b>' + nm + '</b><span class="fx-n">' + rows.length + '</span><span class="fx-hint">' + hint + '</span><svg class="fx-car" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></div>' + rows.join('') + '</section>'; }).join('');
    }catch(e){ return L.map(f).join(''); } };
  window.fx2176Head = function(x){
    try{
      const t = String(x.text || ''), m = t.match(/^(Renewal|At risk|Trial follow-up overdue|Try again) · (.+?) \\((.+?)\\)(?: · | )(.*)$/);
      if(!m){ const p = t.split(' · '); return '<div class="o91-tx"><div class="fx-hd"><span class="fx-nm">' + E(p[0]) + '</span></div>' + (p.length > 1 ? '<div class="fx-do">' + E((p.slice(1).map(cap).join('. ') + '.').replace(/\\.\\.+/g, '.')) + '</div>' : '') + '</div>'; }
      const tags = m[3].split(', ').map(s => '<span class="fx-tag">' + E(s) + '</span>').join('');
      let rest = m[4], chips = [], step = '';
      if(m[1] === 'At risk'){ step = (rest.match(/[^.]*\\.\\s*$/) || [''])[0].trim(); const r0 = rest.slice(0, rest.length - step.length).replace(/\\.\\s*$/, ''); chips = r0.split(' · ').map(cap); }
      else if(m[1] === 'Renewal'){ const a = rest.split('. '); chips = [a.shift().replace(/\\.$/, '')]; const r1 = a.join('. '); const q = r1.split(' · '); if(q.length > 1){ chips.push(q[0]); step = cap(q.slice(1).join(', ').replace(/^no answer yet: (.)/i, (a, c) => 'No answer yet. ' + c.toUpperCase())); } else step = r1; }
      else if(m[1] === 'Trial follow-up overdue'){ const a = rest.split('. '); chips = [cap(a.shift().replace(/^· /, ''))]; step = a.join('. '); }
      else { const a = rest.split('. '); chips = [cap(a.shift().replace(/^said /, 'Said '))]; step = a.join('. ').replace(/^One friendly message: copy it, send in WeChat, then Sent ✓\\./, 'Copy the message, send it in WeChat, then tap Sent ✓.'); }
      return '<div class="o91-tx"><div class="fx-hd"><span class="fx-nm">' + E(m[2]) + '</span>' + tags + '</div>' + (chips.length ? '<div class="fx-ch">' + chips.map(c => '<span>' + E(c) + '</span>').join('') + '</div>' : '') + (step ? '<div class="fx-do"><b>Next:</b> ' + E(step) + '</div>' : '') + '</div>';
    }catch(e){ return '<div class="o91-tx">' + E(x.text) + '</div>'; }
  };
  window.rk2176 = function(b){ try{
    const n = String((b && b.dataset.s) || 'your child').trim();
    const msg = 'Hello! We noticed ' + n + ' has missed some classes recently. We hope everything is well. If a different class time would suit you better, we are happy to arrange it. Thank you!\\n'
      + '您好！我们注意到' + n + '最近缺了几节课，希望一切都好。如果需要调整上课时间，我们很乐意为您安排。谢谢！';
    const ok = () => { try{ toast('Copied. Paste it in the WeChat group, then tap Messaged ✓.'); }catch(e){} };
    const show = () => { try{ openSheet('<h1>Message</h1><p class="small" style="white-space:pre-line">' + E(msg) + '</p>'); }catch(e){} };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(ok, show); else show();
  }catch(e){} };
})();
</script>
</body>
</html>`],
]);
