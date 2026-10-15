// 15 Oct · New class: when Google refuses (e.g. the time is outside the teacher's open hours, which the quick check
// does not see), the reason now stays in the form in a red box with an "Add anyway" button, instead of a short toast
// that is easy to miss (the class then seemed to vanish).
require('../tools/lib.js')(process.argv[2], [
["days: $('cR').checked ? classDays() : [], count: D.length, force: ckForce()};", "days: $('cR').checked ? classDays() : [], count: D.length, force: ckForce() || !!window.CFORCE};"],
["catch(e){ back(); toast(((e&&e.msg)||'Not added') + ' · your details are back in the form'); }\nfinally{ delete BUSY[bk]; }",
 "catch(e){ back(); window.CFORCE = 0; const msg = (e && e.msg) || 'Not added'; toast(msg + ' · your details are back in the form');\n  try{ const g = $('cGo'); if(g){ const o = $('cErr'); if(o) o.remove(); g.insertAdjacentHTML('beforebegin', '<div id=\"cErr\" class=\"mini\" style=\"background:#FFF5F2;border:1px solid #E9B8AC;margin:10px 0\"><b style=\"color:#9A3B22\">Not added yet</b> · ' + esc(msg) + (e && e.conflict ? '<div style=\"margin-top:8px\"><button type=\"button\" class=\"btn sm coral\" onclick=\"window.CFORCE=1;sendClass()\">Add anyway</button></div>' : '') + '</div>'); const x = $('cErr'); if(x && x.scrollIntoView) x.scrollIntoView({ block: 'center' }); } }catch(x){} }\nfinally{ delete BUSY[bk]; window.CFORCE = 0; }"],
]);
