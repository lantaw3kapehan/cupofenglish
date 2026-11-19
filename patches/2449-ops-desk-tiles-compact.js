// 2449 (Misty 16:49 · Celine's Ops Desk: "the boxes are too large and the bottom empty") · the four number tiles are plain boxes
//   (not page buttons, which picked up other screens' button sizes), compact, number and label together.
const file = process.argv[2];
const T = (k, b) => `<button type="button" class="kt" onclick="od2447Show(\\'${k}\\')">${b}`;
const N = (k, b) => `<div role="button" tabindex="0" class="kt" onclick="od2447Show(\\'${k}\\')">${b}`;
const fix = [
  [T('done', "<b>"), N('done', "<b>")],
  [T('found', '<b class="r">'), N('found', '<b class="r">')],
  [T('fixed', '<b class="g">'), N('fixed', '<b class="g">')],
  [T('todo', "<b>"), N('todo', "<b>")],
  ["<span>done today</span></button>", "<span>done today</span></div>"],
  ["<span>problems found</span></button>", "<span>problems found</span></div>"],
  ["<span>fixed and cleared</span></button>", "<span>fixed and cleared</span></div>"],
  ["<span>still to do</span></button>", "<span>still to do</span></div>"],
  ['<script id="b2278">', `<style id="u2449">
#v-mtoday #od2341>.c:first-of-type .k{align-items:start!important;margin-top:10px}
#v-mtoday #od2341>.c:first-of-type .k>.kt{height:auto!important;min-height:0!important;padding:10px 14px!important;justify-content:flex-start!important;gap:0!important;user-select:none}
#v-mtoday #od2341>.c:first-of-type .k>.kt b{display:block;line-height:1.1!important;font-size:26px!important;margin:0!important;padding:0!important;border:0!important;background:none!important}
#v-mtoday #od2341>.c:first-of-type .k>.kt span{display:block;margin:2px 0 0!important;line-height:1.3}
#v-mtoday #od2341>.c:first-of-type .k>.kt:focus-visible{outline:2px solid #00A3AD;outline-offset:2px}
</style>
<script id="b2449">document.addEventListener('keydown', function(e){ var t = e.target; if((e.key === 'Enter' || e.key === ' ') && t && t.classList && t.classList.contains('kt') && t.closest('#od2341')){ e.preventDefault(); t.click(); } });</script>
<script id="b2278">`]
];
require('../tools/lib.js')(file, fix);
