// 1828: (Misty 7 Nov) coaching / training recordings: drag-and-drop box like the class videos (or tap to choose), and the
//   "Recording link" fields removed (Misty: "remove the link") — the recording is always uploaded into the app.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1828-recording-drop.inc.txt', 'utf8');
lib(file, [
  ["const fileIn1826 = (id, pid, who) => '<label class=\"small mute\">Or upload the recording (MP4 · private: ' + who + ' and management)</label><input type=\"file\" id=\"' + id + '\" accept=\"video/mp4,video/webm,video/quicktime\" style=\"width:100%;margin-top:4px\"><div id=\"' + pid + '\" class=\"small mute\" style=\"margin-top:4px\"></div>';", "const fileIn1826 = (id, pid, who) => window.vdz1828(id, pid, who);"],
  ["+ '<label class=\"small mute\">Recording link (optional · e.g. Google Drive, shared with the teacher)</label><input id=\"cgV\" placeholder=\"https://…\" style=\"width:100%;margin:4px 0 10px\">' + fileIn1826", "+ fileIn1826"],
  ["+ '<label class=\"small mute\">Recording link (optional · e.g. Google Drive)</label><input id=\"ctV\" placeholder=\"https://…\" style=\"width:100%;margin:4px 0 10px\">' + fileIn1826", "+ fileIn1826"],
  ["const fileIn = (id, pid) => '<label class=\"small mute\">Or upload the recording (MP4 · stays private: only this teacher and management)</label><input type=\"file\" id=\"' + id + '\" accept=\"video/mp4,video/webm,video/quicktime\" style=\"width:100%;margin-top:4px\"><div id=\"' + pid + '\" class=\"small mute\" style=\"margin-top:4px\"></div>';", "const fileIn = (id, pid) => window.vdz1828(id, pid, 'this teacher');"],
  ["<label class=\"small mute\">Recording link (optional · e.g. Google Drive, shared with the teacher)</label><input id=\"tcV\" placeholder=\"https://…\" style=\"width:100%;margin:4px 0 10px\">", ""],
  ["<label class=\"small mute\">Recording link (optional · e.g. Google Drive, shared with the teacher)</label><input id=\"tcV2\" placeholder=\"https://…\" style=\"width:100%;margin:4px 0 10px\">", ""],
  ["'<label class=\"small mute\" style=\"display:block;margin-top:12px\">Or a link (e.g. Google Drive, shared with the teacher)</label><input id=\"tcV3\" placeholder=\"https://…\" style=\"width:100%;margin-top:4px\">", "'"],
  ["return toast('Choose a video or paste a link')", "return toast('Drag the video in, or tap to choose it')"],
  ["<script>/* 1826 · (Misty 7 Nov)", inc + "<script>/* 1826 · (Misty 7 Nov)"]]);
