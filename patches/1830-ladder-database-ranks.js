// 1830: (Misty 7 Nov "fix the TRAINING screen on management") the Team ladder and the trainings table read every teacher's rank,
//   units and next rank from the database (coe-coach "ladder" → coe_train_ladder, the same rank pay uses) instead of Google's old
//   Performance copy: April Junior, Resa / Dezza Newly Qualified, Christian Starting, Martin Master; only active teachers
//   (Lovely and other past teachers no longer listed); fixed-rate people (Misty, Virgo) under "Fixed rate".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["function teachers(){ const P = (typeof PF !== 'undefined' && PF) || (typeof kept === 'function' && kept('perf')) || null; const T = (P && P.teachers) || [];",
   "function teachers(){ lad1830(); const DB = window._lad1830; if(DB && DB.length) return DB.map(x => ({ name: x.name, ix: x.fixed || !x.rank ? -1 : rix(x.rank), rank: x.rank, life: +x.life || 0, next: x.next ? { name: x.next.name, need: +x.next.need, units: +x.next.units } : null, fixed: !!x.fixed }));\n    const P = (typeof PF !== 'undefined' && PF) || (typeof kept === 'function' && kept('perf')) || null; const T = (P && P.teachers) || [];"],
  ["  async function needPerf(){", "  function lad1830(){ if(window._lad1830p) return; window._lad1830p = 1;   /* 1830 · ranks from the database */\n    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-coach', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'ladder' }) })\n      .then(r => r.json()).then(j => { if(j && j.ok && Array.isArray(j.list) && j.list.length){ window._lad1830 = j.list; try{ paintAll(); }catch(x){} } }).catch(() => {})\n      .finally(() => setTimeout(() => { window._lad1830p = 0; }, 120000)); }\n  async function needPerf(){"],
  ["<div class=\"tq-rk\"><span>Rank not set</span>", "<div class=\"tq-rk\"><span>' + (none.every(x => x.fixed) ? 'Fixed rate' : 'Rank not set') + '</span>"]]);
