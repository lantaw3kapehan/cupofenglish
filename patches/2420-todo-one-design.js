// 2420 (Misty 19 Nov 13:39–13:41: "from that [Option A], ensure designs are aligned and centralized to all … organized and systematic")
//   One design layer for every box on To do (all management roles): the "Your tasks" card is the standard —
//   white card, 1px line, 16px corners, 14×18 padding, 14px gap between boxes, 17px bold navy titles, 13px grey sub-lines,
//   pill count badges, 6px colour labels, pill buttons. Symbols in titles replaced with line icons.
const file = process.argv[2];
const CSS = [
  // tokens
  ':root{--u-card:#fff;--u-line:#ECEAF2;--u-r:16px;--u-pad:14px 18px;--u-gap:14px;--u-ink:#2B2253;--u-mute:#6B6880;--u-sh:0 1px 2px rgba(43,34,83,.04)}',
  // every box on To do: same card, same gap
  '#v-mtoday>:not(.lead):not(script):not(style){margin:0 0 var(--u-gap)!important}',
  '#v-mtoday>.lead{margin-bottom:12px!important}',
  '#v-mtoday :is(#tdFocus,#o91fix,#vid1882,#enqTd,#sr2320>.card,#od2341 .c,#v-mtoday>section.sec,#v-mtoday>.card){background:var(--u-card)!important;border:1px solid var(--u-line)!important;border-radius:var(--u-r)!important;padding:var(--u-pad)!important;box-shadow:var(--u-sh)!important;margin-top:0!important}',
  '#v-mtoday #myTask2418{margin:0 0 var(--u-gap)!important;border-radius:var(--u-r)!important;box-shadow:var(--u-sh)}',
  '#v-mtoday #tdFocus{border-left:5px solid #00A3AD!important;background:var(--u-card)!important}',
  '#v-mtoday #od2341{gap:var(--u-gap)!important;margin:0 0 var(--u-gap)!important}',
  '#v-mtoday #sr2320{background:none!important;border:0!important;padding:0!important}',
  '#v-mtoday #sr2320>.card{margin:0!important}',
  // titles: one size, one weight, one colour, one font
  '#v-mtoday :is(#tdFocus h2,#o91fix h2,#sr2320 h3,#vid1882>b,section.sec>h2,#od2341 h3,#enqTd .grow>b,#enqTd>div>b:not(.tdn b)){font-family:var(--ui-font)!important;font-size:17px!important;font-weight:700!important;color:var(--u-ink)!important;letter-spacing:0!important;line-height:1.3!important;margin:0 0 4px!important}',
  '#v-mtoday section.sec>h2{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;margin:4px 0 8px!important}',
  // sub-lines
  '#v-mtoday section.sec>h2 .c,#v-mtoday #vid1882>.small,#v-mtoday #o91fix .o91-wk{font-size:13px!important;font-weight:400!important;color:var(--u-mute)!important}',
  // count badges: coral pill like "Your tasks"
  '#v-mtoday #o91fix .fx-cnt{display:inline-block;background:#D4705A!important;color:#fff!important;border-radius:999px!important;padding:1px 10px!important;font:700 13px/1.5 var(--ui-font)!important;vertical-align:3px;margin-left:6px}',
  // number tiles (Enquiries "1 TO CALL" and the summary tiles): same tile
  '#v-mtoday .tdr .tdn{border-radius:12px!important;background:#F4F2F8!important}',
  '#v-mtoday #enqTd{display:flex;align-items:center;gap:14px;border-top:1px solid var(--u-line)!important}',
  '#v-mtoday .tdsum a{border-radius:var(--u-r)!important;border:1px solid var(--u-line)!important;box-shadow:var(--u-sh)}',
  '#v-mtoday .tdsum{margin:0 0 var(--u-gap)!important}',
  // labels and buttons
  '#v-mtoday .u-lb{display:inline-block;border-radius:6px;padding:1px 8px;font:600 12px/1.6 var(--ui-font)}',
  '#v-mtoday .okc{display:inline-block;background:#E4F4F1;color:#1E6F5C!important;border-radius:6px;padding:1px 8px;font-weight:600}',
  '#v-mtoday .btn.sm{border-radius:999px!important}',
  // ── Overview: same system
  '#om2344{gap:var(--u-gap)!important}',
  '#om2344>*{margin:0!important}',
  '#om2344 .ov-hero{border-radius:var(--u-r)!important}',
  '#om2344 .tiles{gap:12px!important}',
  '#om2344 :is(.tiles .tile,.two>.cd,#om2344>.cd,#x21c,#fd1806,.cn95,#lqmBox .lqm,#my2360){background:var(--u-card)!important;border:1px solid var(--u-line)!important;border-radius:var(--u-r)!important;padding:var(--u-pad)!important;box-shadow:var(--u-sh)!important;margin:0!important}',
  '#om2344 .two{gap:var(--u-gap)!important}',
  '#om2344 #x21c{border-left:5px solid #D4705A!important}',
  '#om2344 #lqmBox{padding:0!important;border:0!important;background:none!important}',
  '#om2344 :is(#x21c b:first-of-type,.fd-h b,.cn95 h3,#my2360 h3,.cd>h2,.cd h2,#lqmBox .lqm>b,#lqmBox .lqm b.grow){font-family:var(--ui-font)!important;font-size:17px!important;font-weight:700!important;color:var(--u-ink)!important;letter-spacing:0!important;text-transform:none!important;line-height:1.3!important}',
  '#om2344 .tiles .tile b{color:var(--u-ink)!important}',
  '#om2344 .btn.sm{border-radius:999px!important}',
  ':is(#om2344,#v-mtoday) .u-ic{vertical-align:-3px;margin-right:6px;flex:none}'
].join('\n');
const PLAY = "<svg class=\"u-ic\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"#00838C\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"M10 9.5v5l4.5-2.5z\"/></svg>";
const CLK = "<svg class=\"u-ic\" viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"#B5432C\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M12 9v4l2.5 2M9 2h6\"/></svg>";
require('../tools/lib.js')(file, [
  ['<b>▶ Class videos</b>', '<b>' + PLAY + 'Class videos</b>'],
  ["'<small class=\"okc\">✓ all clear</small>'", "'<small class=\"okc\">All clear</small>'"],
  ['<b>⏱ Lates to decide</b>', '<b>' + CLK + 'Lates to decide</b>'],
  ["go(\\'team\\')\">⏱ Lates · nothing", "go(\\'team\\')\">" + CLK + "Lates · nothing"],
  ['<b class="grow">⏱ Lates to decide · ', '<b class="grow">' + CLK + 'Lates to decide · '],
  ['<script id="b2278">', '<style id="u2420">\n' + CSS + '\n</style>\n<script id="b2278">']
]);
