// 2019 (9 Nov 17:35, Misty: "how about on the teacher's end … is it the same?" → "yes same look"): teachers' Team Chat gets the same
//   clean look as management (2009, 2010, 2015, 2016, 2018): one continuous thread with date lines, Search and ⋯ at the top (mute,
//   members, chat sounds, go to a date), no description line, no member count, the ⋯ message menu, light bubbles. What teachers can do
//   is unchanged: Rename this group stays management-only (the server refuses teachers too), and receipts, pin, hide and Requires reply
//   remain as before. Applies after 2017 and 2018. Held until after classes.
const file = process.argv[2];
require(require('path').join(__dirname, '..', 'tools', 'lib.js'))(file, [
 [
  "if(isMgr() && d && d.day === S.init.today){ ms = ms.replace(",
  "if(d && d.day === S.init.today){ ms = ms.replace("
 ],
 [
  "+ (isMgr() ? hdr2009() : (''",
  "+ (true ? hdr2009() : (''"
 ],
 [
  "isMgr() ? (String(S.gid).indexOf('dm:') === 0 ? 'Private chat' : 'Group chat') : 'Today'",
  "(String(S.gid).indexOf('dm:') === 0 ? 'Private chat' : 'Group chat')"
 ],
 [
  "(S.view === 'search' || isMgr() ? '' :",
  "(true ? '' :"
 ],
 [
  "if(L2.scrollTop < 150 && isMgr() &&",
  "if(L2.scrollTop < 150 &&"
 ],
 [
  "if(!e || e.busy || e.done || !isMgr() || !S.init) return;",
  "if(!e || e.busy || e.done || !S.init) return;"
 ],
 [
  "mid = (isMgr() ? '' : chanDesc()) + pin",
  "mid = '' + pin"
 ],
 [
  "<div class=\"ch-body\">' + (tl && !isMgr() ?",
  "<div class=\"ch-body\">' + (tl && false ?"
 ],
 [
  "(isMgr() ? '<div class=\"ch-bw9\">' : '')",
  "'<div class=\"ch-bw9\">'"
 ],
 [
  "(isMgr() ? (tl ? '<button type=\"button\" class=\"ch-dot9\"",
  "(true ? (tl ? '<button type=\"button\" class=\"ch-dot9\""
 ],
 [
  "(c && String(S.gid).indexOf('dm:') !== 0 ? it('ren9'",
  "(c && isMgr() && String(S.gid).indexOf('dm:') !== 0 ? it('ren9'"
 ],
 [
  "#v-chat .ch:not(.tch) .ch-bub:not(.me){",
  "#v-chat .ch .ch-bub:not(.me){"
 ],
 [
  "#v-chat .ch:not(.tch) #chList .ch-day{",
  "#v-chat .ch #chList .ch-day{"
 ]
]);
