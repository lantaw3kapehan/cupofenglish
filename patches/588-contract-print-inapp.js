// 22 Oct · 587 follow-up: the printable contract opens inside the app (works on phones and the home-screen app, no pop-up),
// with Print / Save as PDF; tick text in normal weight with the short document name; Agreement and Annex A say "On file".
const fs = require('fs'); const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "  window.ctPrint = async function(id){", B = "  /* Today banner (teacher)";
const i = s.indexOf(A), j = s.indexOf(B);
if(i < 0 || j < 0 || j < i || s.indexOf(A, i + 1) >= 0){ console.error('ctPrint block not found once'); process.exit(1); }
const NEW = `  window.ctPrint = async function(id){
    const back = $('sheetBody') ? $('sheetBody').innerHTML : '';
    openSheet('<div class="ct"><div class="row2" style="margin:0 0 10px"><button class="btn sm ghost" id="ctPB">‹ Back</button><button class="btn sm teal" id="ctPP" disabled>Print or save as PDF</button></div><div class="sub" id="ctPS">Preparing the printable copy…</div><iframe id="ctPF" title="Printable contract" style="width:100%;height:72vh;border:1px solid #ECEAF1;border-radius:14px;background:#fff"></iframe></div>');
    $('sheet').classList.add('wide');
    $('ctPB').onclick = () => { if(back){ $('sheetBody').innerHTML = back; try{ if(CUR) paintDoc(); }catch(x){} } else closeSheet(); };
    try{ const j = await call('record', { id }); const r = j.row, d = j.doc;
      const sigBlock = (who, name, sig, at, ip, loc) => '<td style="width:50%;vertical-align:top;padding:10px;border:1px solid #ccc"><div style="font-size:11px;color:#555">' + who + '</div>' +
        (sig ? '<img src="' + sig + '" style="height:60px;display:block;margin:6px 0">' : '<div style="height:60px"></div>') + '<div style="border-top:1px solid #333;padding-top:4px"><b>' + e(name || '') + '</b></div>' +
        '<div style="font-size:11px;color:#555">' + (at ? 'Signed in the App ' + e(phT(at)) + ' (Philippine time)' : 'Not signed yet') + (ip ? '<br>IP ' + e(ip) : '') + (loc && loc.allowed ? '<br>Location ' + e(loc.place || ((+loc.lat).toFixed(4) + ', ' + (+loc.lng).toFixed(4))) : at ? '<br>Location not shared' : '') + '</div></td>';
      const line = (a, b) => '<table style="margin-top:6px"><tr><td style="height:46px;border-bottom:1px solid #333">' + a + '</td><td style="width:40px"></td><td style="border-bottom:1px solid #333">' + b + '</td></tr></table>';
      const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + e(d.title) + ' · ' + e(r.typed_name || r.teacher) + '</title><style>body{font-family:Georgia,serif;color:#111;max-width:760px;margin:24px auto;padding:0 18px;font-size:13.5px;line-height:1.55}h2{font-size:20px}h3{font-size:15px;margin-top:18px}h4{font-size:13.5px}table{border-collapse:collapse;width:100%}.ct-t th,.ct-t td{border:1px solid #bbb;padding:5px 7px;font-size:12px;text-align:left}p.ct-ai{padding-left:18px;text-indent:-18px}</style></head><body>' +
        '<div style="font-size:11px;color:#555">CupOfEnglish Online Tutorial Services OPC · ' + e(d.title) + ' · version ' + e(d.version) + ' · confidential</div>' + md(d.body) +
        '<h3>Signatures</h3><table><tr>' + sigBlock('Independent Contractor', r.typed_name || r.teacher, r.sig, r.signed_at, r.ip, r.loc) + sigBlock('For CupOfEnglish Online Tutorial Services OPC · President', r.pres_name || 'Misty T. Dagyapen', r.pres_sig, r.pres_at, r.pres_ip, r.pres_loc) + '</tr></table>' +
        '<p style="font-size:11px;color:#555;margin-top:8px">Document fingerprint (SHA-256 of the text signed): ' + e(r.filled_hash || d.hash) + '. Sent ' + e(phT(r.sent_at)) + (r.opened_at ? ' · opened ' + e(phT(r.opened_at)) : '') + '.</p>' +
        '<h3>Signed in the presence of</h3>' + line('', '') + '<table><tr><td>Witness</td><td style="width:40px"></td><td>Witness</td></tr></table>' +
        '<h3>Acknowledgment</h3><p>REPUBLIC OF THE PHILIPPINES )<br>CITY OF URDANETA ) S.S.</p><p>BEFORE ME, a Notary Public, for and in the City of Urdaneta, personally appeared the aforementioned parties, whom I have identified through competent evidence of identity, who presented this instrument, which they signed electronically in the App on the dates stated above and confirm by their signatures below, and declared that it is their free and voluntary act and deed.</p>' +
        line(e(r.typed_name || ''), e(r.pres_name || 'Misty T. Dagyapen')) + '<table><tr><td>Independent Contractor · ID ____________</td><td style="width:40px"></td><td>President · ID ____________</td></tr></table>' +
        '<p style="margin-top:24px">Doc. No. ____ ; Page No. ____ ; Book No. ____ ; Series of ' + new Date().getFullYear() + '.</p><p style="margin-top:30px;border-top:1px solid #333;width:260px;padding-top:4px">Notary Public</p></body></html>';
      const f = $('ctPF'); if(!f) return; f.srcdoc = html; $('ctPS').textContent = d.title + ' · ' + (r.typed_name || r.teacher) + ' · with the signing record and lines for witnesses and the notary';
      const pp = $('ctPP'); pp.disabled = false; pp.onclick = () => { try{ f.contentWindow.focus(); f.contentWindow.print(); }catch(x){ toast('Could not open printing on this device'); } };
    }catch(x){ const s2 = $('ctPS'); if(s2) s2.textContent = x.message || 'Could not load'; } };

`;
s = s.slice(0, i) + NEW + s.slice(j);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
[`.ct .sign label.tick{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5;margin-bottom:12px}`, `.ct .sign label.tick{display:flex;gap:10px;align-items:flex-start;font-size:14px;font-weight:400;line-height:1.5;margin-bottom:12px}`],
[`'<label class="tick"><input type="checkbox" id="ctTick"><span>I have read and received ' + e(CUR.d.title) +`, `'<label class="tick"><input type="checkbox" id="ctTick"><span>I have read and received ' + e(CUR.d.title.split(' · ')[0]) +`],
[`function statusPill(r, d){ if(!r) return d.needs_sign ? '<span class="pill p-grey">Reference</span>' : '';`, `function statusPill(r, d){ if(!r) return d.needs_sign ? '<span class="pill p-grey">On file</span>' : '';`],
]);
