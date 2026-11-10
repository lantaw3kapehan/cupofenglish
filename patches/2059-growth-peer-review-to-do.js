// 2059 (10 Nov 14:16, Misty: "how come Kat has to ask where she sees the peer review"). A teacher's peer review to write was
//   shown only on Today › Needs your action; Growth › Peer feedback (where teachers look for peer reviews) now lists it too, with Open.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[
"if(!L.length) return `<section class=\"sec\"><h2>Peer feedback <span class=\"c\">from fellow teachers</span></h2><div class=\"mute small\">",
"if(!L.length) return `<section class=\"sec\"><h2>Peer feedback <span class=\"c\">from fellow teachers</span></h2>${mgr ? '' : (window.pr2059 ? pr2059() : '')}<div class=\"mute small\">"
],
[
"return `<section class=\"sec\"><h2>Peer feedback <span class=\"c\">from fellow teachers · ${L.length}</span></h2>${sum}",
"return `<section class=\"sec\"><h2>Peer feedback <span class=\"c\">from fellow teachers · ${L.length}</span></h2>${mgr ? '' : (window.pr2059 ? pr2059() : '')}${sum}"
],
[
"仍保留在课程包中。</div>'; };\n})();\n</script>\n<style id=\"st2058\">",
"仍保留在课程包中。</div>'; };\n})();\n</script>\n<script>\n/* 2059 (10 Nov 14:16, Misty: \"how come Kat has to ask where she sees the peer review\"): the peer review a teacher still has to\n   write was only on Today › Needs your action. Growth › Peer feedback (where teachers look for peer reviews) now shows it too,\n   at the top, with an Open button (the same form). */\nwindow.pr2059 = function(){ try{ const P = (typeof D !== 'undefined' && D && !D.mgr && Array.isArray(D.peer)) ? D.peer : []; if(!P.length) return '';\n  const me = String((D.me && D.me.name) || '').toLowerCase(), e = x => String(x == null ? '' : x).replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' })[c]);\n  const mo = m => { const d = new Date(String(m || '').slice(0, 7) + '-15T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { month: 'long' }) + ' '; };\n  return '<div class=\"pr2059\">' + P.map(x => '<div class=\"li\" style=\"cursor:pointer\" onclick=\"peerSheet(\\'' + e(x.id) + '\\')\"><span class=\"chip teal\">To do</span><div class=\"grow ell\"><b>' + e(mo(x.month)) + 'peer review</b> · ' +\n    (String(x.teacher || '').toLowerCase() === me ? 'your own class' : 'Teacher ' + e(x.teacher) + '\\'s class') + (x.student ? ' with ' + e(x.student) : '') + '</div><button type=\"button\" class=\"btn teal sm\" onclick=\"event.stopPropagation();peerSheet(\\'' + e(x.id) + '\\')\">Open</button></div>').join('') + '</div>';\n  }catch(err){ return ''; } };\n</script>\n<style id=\"st2058\">"
]
]);
