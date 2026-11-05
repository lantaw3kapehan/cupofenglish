// 1787: (Misty 5 Nov 20:34 "fix the texts that are crowding") Tidy two crowded spots.
//   1. To do › Lessons to confirm: the number box was too narrow for "LESSONS" (it ran into the text), and the lone count "1" dropped
//      onto its own line under the heading. The box is wider, and the heading line now carries the short explanation like the other
//      sections (the "Show · 1" button already shows the count).
//   2. Menu: "Walk-in assessment" wrapped onto two centred lines; the menu label is now "Walk-in test" (the page title stays).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['<h2>Lessons to confirm <span class="c">${L.length}</span></h2><div class="small mute" style="margin:-4px 0 8px">Classes taught before the package\'s recorded purchase date. Check with the records before the lesson summary goes to parents.</div>',
   '<h2>Lessons to confirm <span class="c">classes before the package\'s purchase date · check before the lesson summary goes to parents</span></h2>'],
  ['.tdr.closed{opacity:.6}', '#td-pkgchk .tdr .tdn{width:66px}#td-pkgchk .tdr .tdn span{letter-spacing:.03em}\n.tdr.closed{opacity:.6}'],
  ["['assess', 'Walk-in assessment', 'star', 1, 'People']", "['assess', 'Walk-in test', 'star', 1, 'People']"],
]);
