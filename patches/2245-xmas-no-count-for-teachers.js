// 2245 (Misty): the Christmas sign-up form no longer shows teachers how many people joined ("9 joined so far").
// Management still sees the numbers in its own Christmas list.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "(m.joined ? '<div class=\"small mute\" style=\"margin-top:8px\">' + m.joined + ' joined so far</div>' : '')",
 "(m.joined && typeof D !== 'undefined' && D && D.mgr ? '<div class=\"small mute\" style=\"margin-top:8px\">' + m.joined + ' joined so far</div>' : '')"
]]);
