// 1825: (App health 6 Nov) leave proof starts loading when a leave request is opened (and for the 3 newest pending ones when the
//   Leave list loads), so "View proof" doesn't wait 3–9 s on Google Drive. "View proof" reuses a fetch already under way.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1825-leave-proof-ready.inc.txt', 'utf8');
lib(file, [
  ["r = (window.__lp1616 = window.__lp1616 || {})[k1616] || await api('mgmtLeaveProof', TOKEN, id, i)", "r = (window.__lp1616 = window.__lp1616 || {})[k1616] || await ((window.__lpq1825 || {})[k1616] || api('mgmtLeaveProof', TOKEN, id, i))   /* 1825 */"],
  ["<script>/* 1814 · same-HTML guard", inc + "<script>/* 1814 · same-HTML guard"]]);
