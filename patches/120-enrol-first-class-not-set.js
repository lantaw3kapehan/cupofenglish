// 14 Oct night · Enrolled · paid: First class "Not set yet" (Misty: Ying hasn't agreed a class time yet).
// Ticked → no start date is sent; the server (SERVER-NOSTART paste) leaves ACTIVE's start date empty and makes the
// deadline a formula that fills itself once the first class date is typed into ACTIVE › Purchase Date/1st Class (AW).
require('../tools/lib.js')(process.argv[2], [
["<label>First class</label><input id=\"enS\" class=\"in-t\" type=\"date\" onchange=\"enPrev()\" value=\"' + esc(first || today) + '\"></div></div>' +",
 "<label>First class</label><input id=\"enS\" class=\"in-t\" type=\"date\" onchange=\"enPrev()\" value=\"' + esc(first || today) + '\"><label class=\"small\" style=\"display:flex;gap:6px;align-items:center;margin-top:6px;font-weight:400\"><input type=\"checkbox\" id=\"enSx\" onchange=\"enSxT()\" style=\"width:auto;margin:0\"> Not set yet · the student hasn\\'t agreed a time</label></div></div>' +"],
["window.enOth = function(){",
 "window.enSxT = function(){ const x = $('enSx'), s = $('enS'); if(!x || !s) return; s.disabled = x.checked; s.style.opacity = x.checked ? .45 : 1; enPrev(); };\nwindow.enOth = function(){"],
["  if(x.firstClass && !first){ const s = $('enS'); if(s && !ENS.touched) { s.value = x.firstClass; enPrev(); } } }); }",
 "  if(x.firstClass && !first){ const s = $('enS'); if(s && !ENS.touched && !($('enSx') || {}).checked) { s.value = x.firstClass; enPrev(); } } }); }"],
["Valid ' + (n < 30 ? 4 : n < 60 ? 8 : 12) + ' months from the first class · ' + (enTrFrom()",
 "Valid ' + (n < 30 ? 4 : n < 60 ? 8 : 12) + ' months from the first class' + (($('enSx') || {}).checked ? ' (date set later)' : '') + ' · ' + (enTrFrom()"],
["months from the first class' + (() => { const s = ($('enS') || {}).value; if(!s) return '';",
 "months from the first class' + (() => { const s = ($('enS') || {}).value; if(($('enSx') || {}).checked) return ' · <b>first class date set later</b>'; if(!s) return '';"],
["start: $('enS').value, course:",
 "start: ($('enSx') || {}).checked ? '' : $('enS').value, noStart: !!($('enSx') || {}).checked, course:"],
["(r.deadline ? ' · valid until <b>' + new Date(r.deadline + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</b>' : '') + '</div>",
 "(r.deadline ? ' · valid until <b>' + new Date(r.deadline + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</b>' : '') + (r.noStart ? ' · valid ' + (r.months || '') + ' months from the first class' : f.noStart ? ' · <b style=\"color:#B54708\">the start date was saved as today · the server part for \"Not set yet\" is not installed yet</b>' : '') + '</div>' + (r.noStart ? '<div class=\"small\" style=\"margin-top:6px\">When the first class is agreed, type its date in ACTIVE row ' + r.row + ' › <b>Purchase Date/1st Class</b> · the deadline fills itself.</div>' : '') + '"],
]);
