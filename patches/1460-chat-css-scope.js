// 1460 · President QA 28 Oct: Team Chat's layout rules (1400, 27 Oct) were written for a bare ".ch" class, so they also reached every
//   other ".ch" in the app (Payroll › Payroll insights chevron, Monitor › Time-ins › System health chips, Sales chart…): those picked up
//   min-height 520 px, a border and a white panel. Payroll showed a 750 px empty box with "Payroll insights" floating in it.
//   Fix: the same rules, scoped with :where(#v-chat) — zero extra specificity, so every Team Chat rule keeps winning exactly as before,
//   and nothing outside Team Chat is touched. Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".ch{display:grid;grid-template-columns:230px minmax(0,1fr) 220px;",
   ":where(#v-chat) .ch{display:grid;grid-template-columns:230px minmax(0,1fr) 220px;"],
  [".ch h2,.ch .chT{",
   ":where(#v-chat) .ch h2,:where(#v-chat) .ch .chT{"],
  ["@media(max-width:900px){.ch{grid-template-columns:200px",
   "@media(max-width:900px){:where(#v-chat) .ch{grid-template-columns:200px"],
  ["}.ch{grid-template-columns:minmax(0,1fr);height:calc(100dvh - 150px)",
   "}:where(#v-chat) .ch{grid-template-columns:minmax(0,1fr);height:calc(100dvh - 150px)"],
]);
