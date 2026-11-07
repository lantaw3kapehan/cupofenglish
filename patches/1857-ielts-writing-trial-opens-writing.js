// 1857: (Misty 7 Nov "IELTS-Speaking option too or writing") a trial booked with an IELTS book in Schedule (IELTSSpeaking, IELTSWriting,
//   IELTSReading …) opens the IELTS assessment straight away (1855). An IELTSWriting trial opens on the Writing tab.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["time:tm(c.start),ie:/ielts/i.test(c.title||'')})})", "time:tm(c.start),ie:/ielts/i.test(c.title||''),ieW:/ielts\\s*writing/i.test(c.title||'')})})"],
  ["window.as1778.openTrial(r.a); }", "window.as1778.openTrial(r.a); if(q.ieW && !ex){ try{ window.as1778.tab('write'); }catch(e){} } }"]]);
