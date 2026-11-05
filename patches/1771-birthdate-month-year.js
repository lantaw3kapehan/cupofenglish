// 1771: (Misty 5 Nov 10:50 "some parents would just send Month and year no day, can we make it flexible but would still see their age?"
//   · 10:52 "it should be directed from supabase database counting, automate")
//   Birthdate can be saved as month + year only ("Only month and year" tick → a month picker, saved as 2018-05, no invented day).
//   The age is counted by the database (coe_age_of on DATABASE › BIRTHDATE, Manila date; month-only = birthday counted from the birth month).
//   Google keeps month-only birthdates as text (mgmtFix / saveStudent, web app 5 Nov 10:55).
const file = process.argv[2];
const tog = (id) => "<label class=\"small\" style=\"display:flex;gap:6px;align-items:center;margin-top:6px\"><input type=\"checkbox\" onchange=\"bd1771('" + id + "', this.checked)\"> Only month and year (parent did not give the day)</label>";
require('../tools/lib.js')(file, [
  ['<label>Birthdate</label><input id="fxV" class="in-t" type="date">',
   '<label>Birthdate</label><input id="fxV" class="in-t" type="date">' + tog('fxV')],
  ["${two(`<label>Birthdate</label>${inp('sBirth',v.birth,'date')}`",
   "${two(`<label>Birthdate</label>${/^\\d{4}-\\d{2}$/.test(String(v.birth||'')) ? inp('sBirth',v.birth,'month') : inp('sBirth',v.birth,'date')}<label class=\"small\" style=\"display:flex;gap:6px;align-items:center;margin-top:6px\"><input type=\"checkbox\" ${/^\\d{4}-\\d{2}$/.test(String(v.birth||'')) ? 'checked' : ''} onchange=\"bd1771('sBirth', this.checked)\"> Only month and year</label>`"],
  ["function fixGo(i, mode){",
   "function bd1771(id, monthOnly){ const el = $(id); if(!el) return; const v = String(el.value || ''); el.type = monthOnly ? 'month' : 'date'; el.value = monthOnly ? v.slice(0, 7) : (/^\\d{4}-\\d{2}$/.test(v) ? '' : v); }   /* 1771 */\nfunction fixGo(i, mode){"],
]);
