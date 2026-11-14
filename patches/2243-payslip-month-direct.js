// 2243: 2240/2241 follow-up. Management "Payslip" buttons open the payslip directly (1747) on MO.payMonth, so the per-teacher rule
// never ran. Now: the teacher's last-month pay is marked paid → the payslip opens on this month (so far); not paid → last month.
// payslipNow (the "this month" list) always opens on this month.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), (typeof MO !== 'undefined' && MO && MO.payMonth) || '');\n    return p0.apply(this, arguments); };",
  "if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), ps2243Month(name));\n    return p0.apply(this, arguments); };\n  window.ps2243Month = function(name){ try{ const pm = (typeof MO !== 'undefined' && MO && MO.payMonth) || '', P = (typeof MO !== 'undefined' && MO && MO.payroll) || [], k = String(name || '').toLowerCase();\n    const r = P.find(p => String(p.name || '').toLowerCase() === k || String(p.code || '').toLowerCase() === k), now = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });\n    return !pm ? now : (r ? (r.paid ? now : pm) : (P.length && P.every(p => p.paid) ? now : pm)); }catch(e){ return (typeof MO !== 'undefined' && MO && MO.payMonth) || ''; } };"],
 ["if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), (typeof MO !== 'undefined' && MO && MO.payMonth) || '');\n    return n0.apply(this, arguments); };",
  "if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));\n    return n0.apply(this, arguments); };"]
]);
