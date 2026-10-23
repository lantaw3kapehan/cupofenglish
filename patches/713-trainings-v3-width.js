// 713: (QA) Trainings v3: wider right column on laptops so group names fit on one line ("Oxford Discover", "Specializations").
require('../tools/lib.js')(process.argv[2], [
[".tx-grid{grid-template-columns:minmax(0,1fr) 330px;align-items:start}", ".tx-grid{grid-template-columns:minmax(0,1.35fr) minmax(330px,1fr);align-items:start}"],
[".tx-gr{display:grid;grid-template-columns:118px 1fr 40px;", ".tx-gr{display:grid;grid-template-columns:auto 1fr 40px;"],
[".tx-gr .n{", ".tx-gr .nm{white-space:nowrap;min-width:92px}.tx-gr .n{"],
]);
