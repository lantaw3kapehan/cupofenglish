// 2353 (Misty 18 Nov: 'when I click Lates nothing to decide, it is not clicked or opened'): the Lates line opens Time-ins; on Operations' Overview other cards stay under her summary while it loads.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["var t = om.querySelector('.tiles'); if(!t) return;", "var t = om.querySelector('.tiles'); if(!t){ var bef = []; for(var n = om.previousElementSibling; n; n = n.previousElementSibling) bef.unshift(n); bef.forEach(function(c){ c.classList.add('om2345x'); v.appendChild(c); }); return; }   /* 2353: while her summary loads, other cards wait under it, not above */"],
["<b class=\"grow\">\u23f1 Lates \u00b7 nothing to decide</b>", "<a class=\"grow\" style=\"font-weight:700;color:inherit;cursor:pointer\" title=\"See today\\'s time-ins\" onclick=\"go(\\'team\\')\">\u23f1 Lates \u00b7 nothing to decide \u00b7 <span style=\"font-weight:600;color:#2D7A78\">see time-ins \u203a</span></a>"]
]);
