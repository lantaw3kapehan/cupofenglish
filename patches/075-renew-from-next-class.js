// Renewed · paid (Misty, 13 Oct): validity counts from the NEXT CLASS after the payment, not the paid date (same rule as new students).
// The preview reads the student's booked classes: "Valid until … · 8 months from the next class (Tue 20 Oct)". Trial (-TC) and cancelled classes are skipped.
// Needs the server change (mgmtRenewPaid → renewStart_) so the saved deadline matches.
require('../tools/lib.js')(process.argv[2], [
["RPS.info = r; if(r.prev && r.prev.pkg){",
 "RPS.info = r; RPS.cls = Array.isArray(cl) ? cl : []; if(r.prev && r.prev.pkg){"],
["function rpDl(){ const d = new Date(($('rpD') || {}).value + 'T12:00:00');",
 "function rpNc(){ const p = ($('rpD') || {}).value; if(!p) return null; const t0 = new Date(p + 'T00:00:00').getTime(), L = ((RPS && RPS.cls) || []).filter(c => !c.cancelled && !/-TC\\s*$/i.test(String(c.title || '').replace(/\\s+X$/i, '')) && new Date(c.start).getTime() >= t0).sort((a, b) => new Date(a.start) - new Date(b.start)); return L.length ? new Date(L[0].start) : null; }\nfunction rpDl(){ const n = rpNc(), d = n ? new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12) : new Date(($('rpD') || {}).value + 'T12:00:00');"],
["t < 60 ? '8' : '12'} months from the paid date</div>",
 "t < 60 ? '8' : '12'} months from ${(() => { const n = rpNc(); return n ? 'the next class (' + n.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ')' : 'the paid date (no class booked yet)'; })()}</div>"]
]);
