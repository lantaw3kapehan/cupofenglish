// 14 Oct · Fast layer, step 1 (Misty: "like a website"). Teacher saves (class note, homework, note tag, goals) go to the
// Supabase inbox (≈0.3 s) instead of waiting for Apps Script (3–20 s); Apps Script replays the inbox into the sheet every
// minute (sbDrain), so S-NOTES / S-HOMEWORK / payroll work as before. Only for the teachers in FAST_USERS (Misty, Julia)
// while we test. Safe both ways: if the fast layer says no or can't be reached, the normal save runs exactly as today.
require('../tools/lib.js')(process.argv[2], [
["function api(fn, ...args){\nif(!LIVE) return DEMO_API(fn, ...args);",
 "const FAST_URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', FAST_USERS = ['misty', 'julia'], FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1 };\n" +
 "function fastOn(){ try{ const o = localStorage.getItem('coe.fast'); if(o === '0') return false; if(o === '1') return true; }catch(e){} return !!(D && !D.mgr && D.me && FAST_USERS.indexOf(String(D.me.name || '').trim().toLowerCase()) > -1); }\n" +
 "function fastAns(fn, args){ const t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }), a = args[1] || {};\n" +
 "  if(fn === 'saveNote') return { ok: true, queued: true, note: {}, hw: a.homework ? { time: t, text: String(a.homework) } : null };\n" +
 "  if(fn === 'markHomework') return { ok: true, queued: true, hw: { time: t, text: String(a.text || '') } };\n" +
 "  return { ok: true, queued: true }; }\n" +
 "async function fastWrite(fn, args){ const rid = 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);\n" +
 "  for(let a = 0; a < 2; a++){ try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 6000) : 0;\n" +
 "    const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'write', fn, args, rid }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));\n" +
 "    if(r && r.ok && r.queued) return fastAns(fn, args); break; }catch(e){ if(a) break; await new Promise(z => setTimeout(z, 800)); } }\n" +
 "  return apiNow(fn, ...args); }   /* not ready, not signed in there yet, or no answer → the normal save, exactly as today */\n" +
 "function api(fn, ...args){\nif(!LIVE) return DEMO_API(fn, ...args);\nif(FAST_W[fn] && fastOn()) return fastWrite(fn, args);   /* 14 Oct: fast layer (test users first) */"],
]);
