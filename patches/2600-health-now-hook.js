// 2600 (fix to 2598): the Messages hook was set before renderMsgs existed, so the "App health now" box never showed. Hook after load.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(function(){ const _r = window.renderMsgs; if(typeof _r === 'function') window.renderMsgs = function(){ const r = _r.apply(this, arguments); try{ hl2598(); }catch(e){} return r; }; })();",
   "window.addEventListener('load', function(){ setTimeout(function(){ const _r = window.renderMsgs; if(typeof _r === 'function' && !_r.__h2598){ const w = function(){ const r = _r.apply(this, arguments); try{ hl2598(); }catch(e){} return r; }; w.__h2598 = 1; window.renderMsgs = w; } }, 0); });   /* 2600 */"],
]);
