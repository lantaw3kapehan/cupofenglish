// Renewed · paid: payment method in one tap (Alipay / WeChat Pay / Bank transfer / Cash).
// Pre-filled from the student's last payment (server); if that is blank, from the last method used on this device.
require('../tools/lib.js')(process.argv[2], [
[
"<input id=\"rpM\" class=\"in-t\" value=\"${esc(r.method || '')}\" placeholder=\"e.g. WeChat Pay\">",
"<input id=\"rpM\" class=\"in-t\" value=\"${esc(r.method || (() => { try{ return localStorage.getItem('coe.rpM') || ''; }catch(e){ return ''; } })())}\" placeholder=\"e.g. WeChat Pay\"><div class=\"skc\" style=\"margin-top:6px\">${['Alipay','WeChat Pay','Bank transfer','Cash'].map(x => `<button type=\"button\" class=\"${x === (r.method || '') ? 'on' : ''}\" onclick=\"$('rpM').value='${x}';this.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===this))\">${x}</button>`).join('')}</div>"
],
[
"method: $('rpM').value.trim(),",
"method: (() => { const v = $('rpM').value.trim(); try{ if(v) localStorage.setItem('coe.rpM', v); }catch(e){} return v; })(),"
]
]);
