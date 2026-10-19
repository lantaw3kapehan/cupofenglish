// 19 Oct · 297 · Teacher Excellence tiles show her own facts (Misty): Progress = her students' progress AND her own growth as a teacher
// (did she act on the class-visit "to improve" points: Follow-up Improved / Partly / Not yet); Reliability shows hours taught + hours opened (open slots count as much as time-ins).
require('../tools/lib.js')(process.argv[2], [
  ["p[0] === 'quality' && me.parts ? qsub(me) : p[2]", "me.parts ? (p[0] === 'quality' ? qsub(me) : (psub(p[0], me) || p[2])) : p[2]"],
  ["    const tiles = ", `    const psub = (k, me) => { const x = me.parts || {}, f = me.facts || {}, B = v => '<b style="color:var(--ink)">' + v + '</b>', L = [];
      if(k === 'progress'){
        const st = []; if(f.progressChecks) st.push(f.progressChecks + ' progress check' + (f.progressChecks > 1 ? 's' : '')); if(f.notes) st.push(f.notes + ' class note' + (f.notes > 1 ? 's' : '')); if(f.bookUps3m) st.push(f.bookUps3m + ' new book' + (f.bookUps3m > 1 ? 's' : ''));
        L.push('Your students · ' + (st.length ? st.join(' · ') : 'no progress checks or notes yet'));
        L.push('Your growth · ' + (f.followUps ? B(f.followUpsImproved || 0) + ' of ' + f.followUps + ' visit points improved' : 'no follow-up yet'));
      } else if(k === 'trust'){
        if(f.trials) L.push('Trials · ' + B(f.trialsEnrolled || 0) + ' of ' + f.trials + ' enrolled');
        if(f.keptFrom) L.push('Students still with us · ' + B(f.kept) + ' of ' + f.keptFrom);
        L.push('Recognitions · ' + B(f.recognitions || 0));
      } else if(k === 'reliability'){
        if(f.timeIns) L.push('Time-ins on time · ' + B(f.onTime) + ' of ' + f.timeIns);
        L.push('Hours · ' + B(f.units || 0) + ' taught' + (f.freeHoursMonth != null ? ' + ' + B(Math.round(f.freeHoursMonth)) + ' open (not yet booked)' : ''));
        L.push('Demerits · ' + B(f.demerits || 0));
      }
      return L.join('<br>'); };
    const tiles = `]]);
