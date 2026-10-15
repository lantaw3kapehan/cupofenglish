(function(){
  // Fairer warnings (after Misty saw Kat's first list):
  //  · the "ignored" clock starts when this started (15 Oct, noon) — nobody is late for days before they could see it;
  //  · unread class visits are one line ("3 class visits not read"), not one line each;
  //  · "Not fixed" / "Same issue" only count when the teacher had READ the earlier visit before the next one
  //    (seen but nothing changed). If she never read it, it is "not read", not "not fixed";
  //  · the same follow-up written on several visits counts once.
  const DAY = 864e5, START = Date.parse('2026-10-15T12:00:00+08:00'), MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tms = s => { s = String(s || ''); const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/); return m ? Date.parse(m[1] + 'T' + (m[2] || '12:00') + ':00+08:00') : 0; };
  const ackT = (a, ymd) => { const m = String(a || '').match(/^(\d{1,2}) (\w{3}) (\d{2}):(\d{2})/); if(!m) return a ? 1 : 0; const mi = MON.indexOf(m[2]); if(mi < 0) return 1;
    return Date.parse(String(ymd).slice(0, 4) + '-' + String(mi + 1).padStart(2, '0') + '-' + m[1].padStart(2, '0') + 'T' + m[3] + ':' + m[4] + ':00+08:00'); };
  const sd = t => t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
  const late = t => t ? Math.floor((Date.now() - Math.max(t, START)) / DAY) : 0;
  const isTask = r => !!r && r.role === 'mgmt' && r.kind !== 'memo' && /^📌\s*Task/.test(String(r.text || ''));
  const pcOf = r => { const m = String((r && r.text) || '').match(/progress check\s*\((ST-\d{4}-\d{3})\)/i); return m ? m[1].toUpperCase() : ''; };
  const short = s => { s = String(s || '').replace(/^📌\s*Task\s*[·:-]?\s*/, '').replace(/\s+/g, ' ').trim(); return s.length > 80 ? s.slice(0, 78) + '…' : s; };
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 60);
  window.ftCheck = function(visits, threads, opt){ opt = opt || {}; const items = [], acked = opt.acked || {}, done = opt.pcDone || {};
    (threads || []).forEach(t => { const r = t.root; if(!r || r.role !== 'mgmt') return; const at = tms(r.at), a = late(at);
      if(isTask(r)){ if(!/^✅/.test(r.react || '') && a >= 2) items.push({ kind: 'Task', text: 'Task from ' + r.from + ' not done since ' + sd(at) + ' · ' + short(r.text), days: a, overdue: 1 }); return; }
      if(r.kind === 'memo'){ if(!r.ack && a >= 1) items.push({ kind: 'Memorandum', text: 'Memorandum ' + (r.memoNo || '') + ' not acknowledged since ' + sd(at), days: a, overdue: 1 }); return; }
      if(pcOf(r)){ if(!done[pcOf(r)] && a >= 3) items.push({ kind: 'Progress check', text: 'Progress check (' + pcOf(r) + ') asked ' + sd(at) + ', not sent yet', days: a, overdue: 1 }); return; }
      if(r.need && !r.ack && a >= 2) items.push({ kind: 'Message', text: 'Message from ' + r.from + ' not answered since ' + sd(at) + ' · ' + short(r.text), days: a, overdue: 1 }); });
    const V = (visits || []).filter(v => v && v.date).slice().sort((a, b) => String(b.date + (b.time || '')).localeCompare(String(a.date + (a.time || ''))));
    const seenAt = v => acked[v.id] ? 1 : ackT(v.ack, v.date);
    const unread = V.filter(v => !seenAt(v) && late(tms(v.date + ' ' + (v.time || ''))) >= 2);
    if(unread.length){ const ds = [...new Set(unread.map(v => sd(tms(v.date))))]; items.push({ kind: 'QA visit', text: (unread.length === 1 ? '1 class visit' : unread.length + ' class visits') + ' not read (' + ds.slice(0, 4).join(', ') + (ds.length > 4 ? '…' : '') + ') · open each and tap Got it', days: Math.max(...unread.map(v => late(tms(v.date)))), overdue: 1 }); }
    let repeat = 0; const since = Date.now() - 30 * DAY, fu = {};
    V.forEach(v => { const t = tms(v.date + ' ' + (v.time || '')); if(t < since) return; const m = String(v.note || '').match(/Follow-up on (\S+)\s*\(([\s\S]*?)\):\s*(Not yet|Partly)\b/); if(!m) return;
      const before = V.filter(x => x.date === m[1]); if(!before.some(x => { const s = seenAt(x); return s && s <= t; })) return;   // not read before this visit → not "seen but not acted"
      const k = norm(m[2]); if(fu[k]) return; fu[k] = 1; const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w;
      items.push({ kind: 'Not fixed', text: '“' + short(m[2]) + '” · raised ' + sd(tms(m[1])) + ', still ' + m[3].toLowerCase() + ' on ' + sd(t), days: 0, weight: w }); });
    const area = {}; V.filter(v => tms(v.date) >= since).forEach(v => String(v.checks || '').split(' · ').forEach(c => { const m = c.match(/^(.*?):\s*(Needs work|Not yet)$/); if(m) (area[m[1]] = area[m[1]] || []).push(v); }));
    Object.keys(area).forEach(k => { const L = area[k]; for(let i = 0; i < L.length - 1; i++){ const later = L[i], earlier = L[i + 1], s = seenAt(earlier);
      if(earlier.date !== later.date && s && s <= tms(later.date + ' ' + (later.time || ''))){ repeat += 1; items.push({ kind: 'Same issue', text: k + ' “Needs work” on ' + sd(tms(earlier.date)) + ' and again on ' + sd(tms(later.date)) + ' after you read it', days: 0, weight: 1 }); break; } } });
    const od = items.filter(x => x.overdue), maxd = od.reduce((m, x) => Math.max(m, x.days), 0);
    const level = (repeat >= 2 || maxd >= 5 || od.length >= 3) ? 3 : (od.length || repeat >= 1) ? 2 : 0;
    return { level, items, repeat }; };
})();
