// 20 Oct · Recognition texts written as proper sentences, no "·" inside a sentence (Misty: "proper punctuation, especially we are an English language institution").
const R = [
  // header pill (368)
  ["return { c: 'g', t: '🏆 Teacher of the Month · ' + mon(f.month), s: '🏆 Teacher of the Month' };", "return { c: 'g', t: '🏆 You are our Teacher of the Month for ' + mon(f.month) + '!', s: '🏆 Teacher of the Month' };"],
  ["return { c: 'g', t: '🥇 Gold Excellence · ' + mon(f.month), s: '🥇 Gold Excellence' };", "return { c: 'g', t: '🥇 Gold Excellence for ' + mon(f.month) + '. Congratulations!', s: '🥇 Gold Excellence' };"],
  ["t: '✨ Gold standard so far · hold it to the end of ' + mon(lv.month), s: '✨ Gold so far' }", "t: '✨ You are at Gold so far. Hold it to the end of ' + mon(lv.month) + '.', s: '✨ Gold so far' }"],
  ["t: '🥇 Leading the team this month · ' + ((me.level === 'Silver') ? 'finish strong to be Teacher of the Month' : 'reach Silver to be Teacher of the Month'), s: '🥇 Leading the team' }",
   "t: '🥇 You are leading the team this month. ' + ((me.level === 'Silver') ? 'Finish strong to become Teacher of the Month!' : 'Reach Silver to become Teacher of the Month.'), s: '🥇 Leading the team' }"],
  ["t: '⭐ ' + pts + ' points to ' + nx[0] + ' · within reach this month', s: '⭐ ' + pts + ' to ' + nx[0] }", "t: '⭐ Only ' + pts + ' points to ' + nx[0] + '. It is within reach this month!', s: '⭐ ' + pts + ' to ' + nx[0] }"],
  // goal line (367): "|" marks where the side card breaks the line; elsewhere it is a space
  ["if(me.rank === 1 && (me.level === 'Silver' || me.level === 'Gold')) return 'Keep ' + me.level + ' and 1st place → Teacher of the Month';", "if(me.rank === 1 && (me.level === 'Silver' || me.level === 'Gold')) return 'Keep ' + me.level + ' and first place|to become Teacher of the Month.';"],
  ["if(!nx) return 'Gold · keep it to the end of the month';", "if(!nx) return 'You are at Gold.|Keep it to the end of the month.';"],
  ["if(pts <= 3) return pts + ' points to ' + nx[0] + ' · within reach this month';", "if(pts <= 3) return 'Only ' + pts + ' points to ' + nx[0] + '.|It is within reach this month.';"],
  ["return 'Path to ' + nx[0] + (low ? ' · biggest step: ' + NM[low] + ' (' + Math.round(P[low]) + ')' : ' · step by step'); }catch(e){ return gap0(me); } };",
   "return 'Your path to ' + nx[0] + ':|' + (low ? 'grow ' + NM[low] + ' (' + Math.round(P[low]) + ') first.' : 'one step at a time.'); }catch(e){ return gap0(me); } };\n  const gapT = me => String(gap(me)).replace('|', ' ');"],
  ["${MED[me.level] || ''} ${esc(me.level || '')} · ${gap(me)} · ${when}", "${MED[me.level] || ''} ${esc(me.level || '')} · ${gapT(me)} · ${when}"],
  ["${me.rank ? `<div style=\"text-align:center;color:#2a9d8f;font-weight:700;margin:2px 0 0\">${gap(me)}</div>` : ''}", "${me.rank ? `<div style=\"text-align:center;color:#2a9d8f;font-weight:700;margin:2px 0 0\">${esc(gapT(me))}</div>` : ''}"],
  // side card (369): break at "|"
  ["const p = String(g).split(/ → | · /), arrow = / → /.test(g);", "const p = String(g).split('|'), arrow = false;"],
  // My growth note (366)
  ["✨ <b>Gold standard so far.</b> Hold it to the end of ${esc(end)} for the Gold Excellence commendation${me.rank === 1 ? ', and you are leading the team too' : ''}.", "✨ <b>You are at Gold so far.</b> Hold it to the end of ${esc(end)} to earn the Gold Excellence commendation${me.rank === 1 ? '. You are also leading the team!' : '.'}"],
  ["🥇 <b>You are leading the team this month.</b> ${UP[me.level] ? 'Finish strong to be Teacher of the Month for ' + esc(end) + '.' : 'Reach Silver (78) by the end of ' + esc(end) + ' to be Teacher of the Month.'}", "🥇 <b>You are leading the team this month.</b> ${UP[me.level] ? 'Finish strong to become Teacher of the Month for ' + esc(end) + '!' : 'Reach Silver (78) by the end of ' + esc(end) + ' to become Teacher of the Month.'}"],
  // commendation cards (366)
  ["<div class=\"cm-k\">Gold Excellence · ${esc(m.label)}</div>", "<div class=\"cm-k\">Gold Excellence — ${esc(m.label)}</div>"],
  ["<div class=\"cm-sig\">With pride and gratitude · CupOfEnglish management</div>", "<div class=\"cm-sig\">With pride and gratitude, CupOfEnglish Management</div>"],
  ["<div class=\"cm-k\">Teacher of the Month · ${esc(m.label)}</div>\n<h3>Congratulations · you are our Teacher of the Month!</h3>", "<div class=\"cm-k\">Teacher of the Month — ${esc(m.label)}</div>\n<h3>Congratulations! You are our Teacher of the Month.</h3>"],
  ["<div class=\"cm-sig\">With thanks · CupOfEnglish management</div>", "<div class=\"cm-sig\">With thanks, CupOfEnglish Management</div>"],
  ["<div class=\"cm-k\">Teacher of the Month · ${esc(m.label)}</div>\n<h3>Congratulations, ${esc(T(w.name))}!</h3>", "<div class=\"cm-k\">Teacher of the Month — ${esc(m.label)}</div>\n<h3>Congratulations, ${esc(T(w.name))}!</h3>"],
  ["<div class=\"cm-sig\">${m.top.map((t, i) => ['1st', '2nd', '3rd'][i] + ' · ' + esc(T(t.name)) + (t.level ? ' (' + esc(t.level) + ')' : '')).join(' · ')}</div>", "<div class=\"cm-sig\">${m.top.map((t, i) => ['First', 'Second', 'Third'][i] + ': ' + esc(T(t.name)) + (t.level ? ' (' + esc(t.level) + ')' : '')).join('; ')}</div>"]
];
require('../tools/lib.js')(process.argv[2], R);
