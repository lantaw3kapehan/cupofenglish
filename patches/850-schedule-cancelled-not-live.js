// 850: (audit 25 Oct, finding 4) A cancelled class on Schedule also showed "Live".
// One status order for a class everywhere: Cancelled > Done (ended) > Live (started, not ended) > Coming.
// · Schedule (management) class row: the "Live" chip and the "now" highlight are only for classes that are not cancelled,
//   so a row matches the headline "N live now" (which already left cancelled classes out) and Day at a glance.
// · Older Schedule versions still in the file (By-time slot header "· live now", card) get the same rule, in case they are used.
// · Class visit (Monitor) "● LIVE NOW · Join VooV" bar: never for a cancelled class.
// Display only. Counts, filters and data are unchanged.
require('../tools/lib.js')(process.argv[2], [
  // active renderSchedule (10 Oct+ version) row
  ["    const row = (e, who) => { const on = now >= new Date(e.start) && now < new Date(e.end);",
   "    const row = (e, who) => { const on = !e.cancelled && now >= new Date(e.start) && now < new Date(e.end);   /* 850: cancelled is never live */"],
  // original renderSchedule row (line-start version)
  ["\nconst row = (e, who) => { const on = now >= new Date(e.start) && now < new Date(e.end);",
   "\nconst row = (e, who) => { const on = !e.cancelled && now >= new Date(e.start) && now < new Date(e.end);"],
  // the grouped-card Schedule version
  ["const card = (e, who) => { const on = now >= new Date(e.start) && now < new Date(e.end), i = SC.events.indexOf(e)",
   "const card = (e, who) => { const on = !e.cancelled && now >= new Date(e.start) && now < new Date(e.end), i = SC.events.indexOf(e)"],
  ["on = g.some(e => now >= new Date(e.start) && now < new Date(e.end)), n = g.filter(e => !e.cancelled).length;",
   "on = g.some(e => !e.cancelled && now >= new Date(e.start) && now < new Date(e.end)), n = g.filter(e => !e.cancelled).length;"],
  // class visit "LIVE NOW" bar
  ["nw = Date.now(), live = nw >= st - 5 * 60000 && nw <= en + 10 * 60000,",
   "nw = Date.now(), live = !e.cancelled && nw >= st - 5 * 60000 && nw <= en + 10 * 60000,"],
]);
