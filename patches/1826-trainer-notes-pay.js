// 1826: (Misty 7 Nov) training / coaching pay ₱200 per hour to the teacher who facilitates or coaches (database trigger makes the
//   payslip line) · the coach writes her own coaching notes and uploads the recording; the trainer adds notes + recording to her
//   training session (coe-coach) · coaching minutes kept (§mins) · Schedule a training: separate Date and Time boxes (the single
//   date-and-time box saved nothing when the time was left blank).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1826-trainer-notes-pay.inc.txt', 'utf8');
lib(file, [
  ["t = t.replace(/\\n§(coach|video|file):.*/g, ''); const m = t.split(' — ');", "t = t.replace(/\\n§(coach|video|file|mins):.*/g, ''); const m = t.split(' — ');"],
  ["+ '<div id=\"tcBk\"><label class=\"small mute\">Minutes</label><input type=\"number\" id=\"tcM\" value=\"30\" style=\"width:100%;margin:4px 0 10px\">",
   "+ '<label class=\"small mute\">Minutes</label><input type=\"number\" id=\"tcM\" value=\"60\" style=\"width:100%;margin:4px 0 10px\"><div id=\"tcBk\">"],
  ["note: packN(p, v('tcN').trim(), v('tcC'), v('tcV').trim(), fp) }); }", "note: packN(p, v('tcN').trim(), v('tcC'), v('tcV').trim(), fp) + '\\n§mins:' + (+v('tcM') || 60) }); }"],
  ["mins: +v('tcM') || 30, facilitator: v('tcC')", "mins: +v('tcM') || 60, facilitator: v('tcC')"],
  ["(($('tcV2') || {}).value || '').trim(), fp) });", "(($('tcV2') || {}).value || '').trim(), fp) + '\\n§mins:' + (s.mins || 60) });"],
  ["+ '<label class=\"small mute\">Date and time (PH)</label><input type=\"datetime-local\" id=\"tsD\" value=\"' + dt + '\" style=\"width:100%;margin:4px 0 10px\">'",
   "+ '<div class=\"row\" style=\"gap:10px\"><div class=\"grow\"><label class=\"small mute\">Date</label><input type=\"date\" id=\"tsD0\" value=\"' + (dt ? dt.slice(0, 10) : new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10)) + '\" style=\"width:100%;margin:4px 0 10px\"></div><div class=\"grow\"><label class=\"small mute\">Time (PH)</label><input type=\"time\" id=\"tsD1\" value=\"' + (dt ? dt.slice(11, 16) : '') + '\" style=\"width:100%;margin:4px 0 10px\"></div></div>'"],
  ["window.trSchedSave = async function(sid, cancel){ const v = id => ($(id) || {}).value || ''; if(!v('tsD')) return toast('Pick the date and time');",
   "window.trSchedSave = async function(sid, cancel){ const v = id => ($(id) || {}).value || ''; if(!v('tsD0')) return toast('Pick the date'); if(!v('tsD1')) return toast('Pick the time the training starts'); const tsD = v('tsD0') + 'T' + v('tsD1').slice(0, 5);"],
  ["starts_at: v('tsD') + ':00+08:00', mins: +v('tsM') || 60, facilitator: v('tsF')", "starts_at: tsD + ':00+08:00', mins: +v('tsM') || 60, facilitator: v('tsF')"],
  ["<script>/* 1814 · same-HTML guard", inc + "<script>/* 1814 · same-HTML guard"]]);
