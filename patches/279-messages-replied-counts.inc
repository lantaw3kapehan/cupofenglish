/* 19 Oct · 279 · Messages (Misty): a teacher who REPLIED to a message has acted on it, the same as tapping a one-tap answer.
   · "Not acting on feedback": a replied message is no longer listed. One that was only opened says so
     ("Seen 10/16 21:59 · no reply") and still counts; one never opened says "not opened".
   · The counts on a notice put replied with answered; "seen" means opened with no answer. */
(function(){
  const DAY = 864e5, START = Date.parse('2026-10-15T12:00:00+08:00');
  const tms = s => { s = String(s || ''); const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/); return m ? Date.parse(m[1] + 'T' + (m[2] || '12:00') + ':00+08:00') : 0; };
  const late = t => t ? Math.floor((Date.now() - Math.max(t, START)) / DAY) : 0;
  const isTask = r => !!r && r.role === 'mgmt' && r.kind !== 'memo' && /^📌\s*Task/.test(String(r.text || ''));
  const pcOf = r => /progress check\s*\((ST-\d{4}-\d{3})\)/i.test(String((r && r.text) || ''));
  const replied = t => !!t && (t.replies || []).some(x => x && x.role !== 'mgmt');
  const isMsg = r => !!r && r.role === 'mgmt' && !isTask(r) && r.kind !== 'memo' && !pcOf(r);
  const at2 = s => typeof msgAt === 'function' ? msgAt(s) : String(s || '');
  window.msgReplied = replied;
  const _ft = window.ftCheck;
  if(_ft) window.ftCheck = function(visits, threads, opt){
    const T = (threads || []).map(t => (t && t.root && isMsg(t.root) && t.root.need && !t.root.ack && replied(t)) ? Object.assign({}, t, { root: Object.assign({}, t.root, { ack: 'replied' }) }) : t);
    const R = _ft.call(this, visits, T, opt);
    try{ const left = T.filter(t => t && t.root && isMsg(t.root) && t.root.need && !t.root.ack && late(tms(t.root.at)) >= 2); let i = 0;
      R.items.forEach(x => { if(x.kind !== 'Message') return; const t = left[i++]; if(!t) return; const r = t.root;
        x.text = r.seen ? x.text.replace(/ not answered since /, ' on ').replace(/^Message from /, 'Seen ' + at2(r.seen) + ' · no reply · message from ')
                        : x.text.replace(/ not answered since /, ' not opened since '); });
    }catch(e){ console.warn('279', e); }
    return R; };
  const _ta = window.msgTally;
  if(_ta) window.msgTally = function(g){ if(!g || !g.length || isTask(g[0].root) || g[0].root.kind === 'memo') return _ta.apply(this, arguments);
    const done = t => t.root.ack || replied(t);
    const a = g.filter(done).length, q = g.filter(t => /^🙋/.test(t.root.react || '')).length, s = g.filter(t => !done(t) && t.root.seen).length; return { a, q, s, n: g.length - a - s }; };
})();
