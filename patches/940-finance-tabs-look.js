// 940: (audit 25 Oct, phase 2 · D4) Finance › Payroll, Sales & costs and Wallets take the Finance › Overview look (patch 823 `.fx`,
//      tokens from 900). CSS only, scoped to #v-payroll, #v-money and #v-wallets. No markup, figure, handler or permission changes.
// · Page titles 26px (brand font, ink), header buttons 34px, sub text 13px muted — as Finance › Overview.
// · One card style: white, 1px #E9E7F0 line, 14px radius, no shadow, 14px 16px padding (lists, charts, history, insights, wallet card).
// · Card / section titles: 15px / 700 in the system sans (the brand font is kept for page titles only).
// · Sales & costs: the sub-tabs (Overview · Months & years · Income & spending · Dues & checks) become the segmented control used by
//   Transactions; "The picture" tiles become one KPI strip like Overview (11.5px uppercase muted label, 22px/700 tabular figure, green
//   for profit / red for loss, no tinted backgrounds or coloured side bars); "Checks to do" / "Insights" cards lose the coloured side
//   bar and the lift on hover, their icon becomes a light tint of the same colour.
// · Payroll: search 38px with a 1px line (no shadow), filter chips 34px (selected = ink, as Transactions' "All months"), list rows a
//   little tighter; the "so far" row's pace line wraps instead of running under the amount (it overlapped the amount and the status
//   at 1280 and 390 px); status pills 11px; history month titles in the sans; the per-teacher colour strip is calmer.
// · Wallets: tiles white with the wallet's colour kept on the dot and label; balances in the sans with tabular numerals.
// · Wallets tab: the card's own "Wallets 钱包" heading is hidden there (the page title says it); its total line stays.
// · Phone (≤640px): Payroll history month rows wrap (amounts were cut off and overlapped the change %), the per-teacher strip is
//   hidden there (it is on each month when opened … tap the month); the 12-month bar labels (which overlapped) hide, month and change % stay;
//   tiles one per row; ≤900px two per row.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 940 · Finance tabs: Overview look (Payroll, Sales & costs, Wallets) */
(function(){ if(window.__940) return; window.__940 = 1;
  var F = 'var(--ui-font,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif)', INK = 'var(--ui-ink,#2f2752)', MU = 'var(--ui-mute,#6B6782)', LN = 'var(--ui-line,#E9E7F0)';
  var V = ['#v-payroll', '#v-money', '#v-wallets'], all = function(sel){ return V.map(function(v){ return sel.split(',').map(function(x){ return v + ' ' + x.trim(); }).join(','); }).join(','); };
  var css = [
    /* page titles + header buttons */
    '#v-money .mx-top{align-items:center;gap:8px;margin:4px 0 12px}',
    '#v-money .mx-top h1,#v-wallets .lead h1,#v-payroll .py-top h1{font-family:var(--ui-brand,"Fredoka One",sans-serif)!important;font-weight:400!important;font-size:26px!important;letter-spacing:0!important;color:' + INK + '!important;margin:0!important;line-height:1.25}',
    '#v-money .mx-top .sub,#v-wallets .lead .mute{font-family:' + F + ';font-size:13px!important;color:' + MU + '!important;margin-top:2px}',
    '#v-wallets .lead{margin:4px 0 12px}',
    '#v-money .mx-act{align-self:center}#v-money .mx-act .btn,' + all('.wl-act .btn') + ',#v-payroll .py-act .btn{height:34px!important;min-height:34px!important;padding:0 14px!important;font-size:13px!important;box-shadow:none!important}',
    /* one card */
    '#v-money .x73 .cd,#v-money .mx-c,#v-money .mx-t,' + all('.wl') + ',#v-payroll .py-list,#v-payroll details.py-h,#v-payroll .pm60,#v-payroll details.pi824,#v-payroll details.py-done{border-radius:var(--ui-r,14px)!important;box-shadow:none!important;border:1px solid ' + LN + '!important}',
    '#v-money .x73 .cd,#v-money .mx-c,' + all('.wl') + '{padding:var(--ui-pad,14px 16px)!important}',
    '#v-money .def831{font-size:12.5px;margin:0 0 12px}',
    /* card / section titles */
    '#v-money .x73 .cap h3,#v-money .mx-cap h3,#v-money .mx-h h3,#v-money .x73 .hero h2,#v-money .cd>summary h3,#v-money .x73 .cd h3,#v-money .mx-yr .y,' + all('.wl870>summary h2,.wl870s h2,.wl-top h2') + ',#v-payroll .py-cap h3,#v-payroll details.py-h>summary b,#v-payroll details.py-done>summary b{font-family:' + F + '!important;font-weight:700!important;font-size:15px!important;color:' + INK + '!important;letter-spacing:0}',
    '#v-money .x73 .cap{margin:18px 2px 8px}#v-money .x73 .cap span,#v-money .mx-h .c,#v-money .mx-cap span{font-family:' + F + ';font-size:12.5px;color:' + MU + '}',
    /* Sales & costs · sub-tabs = segmented control */
    '#v-money .x73 .tabs{background:#F1F0F6;border:0;box-shadow:none;padding:2px;gap:2px;border-radius:10px}',
    '#v-money .x73 .tabs button{height:30px;padding:0 12px;border-radius:8px;font:700 13px ' + F + ';color:' + MU + '}',
    '#v-money .x73 .tabs button.on{background:#fff;color:' + INK + ';box-shadow:0 1px 2px rgba(47,39,82,.12)}#v-money .x73 .tabs button b,#v-money .x73 .tabs button.on b{background:var(--ui-out-b,#FBEDEA);color:var(--ui-out,#B5533C)}',
    '#v-money .x73 .tabs button:focus-visible{outline:2px solid var(--ui-teal,#01b0bf);outline-offset:1px}',
    /* Sales & costs · "The picture" = one KPI strip */
    '#v-money .x73 .kp{gap:0;background:#fff;border:1px solid ' + LN + ';border-radius:var(--ui-r,14px);overflow:hidden}',
    '#v-money .x73 .kp>div{background:#fff!important;border:0!important;border-left:1px solid ' + LN + '!important;border-radius:0!important;padding:12px 16px!important}#v-money .x73 .kp>div:first-child{border-left:0!important}',
    '#v-money .x73 .kp>div:hover{transform:none;background:var(--ui-soft,#FAFAFD)!important}',
    '#v-money .x73 .kp span{font:700 11.5px/1.35 ' + F + ';letter-spacing:.04em;color:' + MU + '}',
    '#v-money .x73 .kp b,#v-money .x73 .t3 b,#v-money .mx-t b{font-family:' + F + '!important;font-weight:700!important;font-size:22px!important;font-variant-numeric:tabular-nums;color:' + INK + '}',
    '#v-money .x73 .kp .t-ok b,#v-money .x73 .t3 .t-ok b{color:var(--ui-in,#2E7D5B)}#v-money .x73 .kp .t-bad b,#v-money .x73 .t3 .t-bad b{color:var(--ui-out,#B5533C)}',
    '#v-money .x73 .kp small,#v-money .x73 .t3 small{font-family:' + F + ';font-size:12px;color:' + MU + '}',
    '#v-money .x73 .sc{background:#F1F0F6}',
    '#v-money .x73 .t3>div{background:#fff;border:1px solid ' + LN + ';border-radius:12px}#v-money .x73 .t3 span{font:700 11.5px ' + F + ';letter-spacing:.04em;color:' + MU + '}',
    /* Sales & costs · checks and insights */
    '#v-money .x73 .todo .ac{border:1px solid ' + LN + '!important;border-radius:var(--ui-r,14px);box-shadow:none;padding:12px 14px}',
    '#v-money .x73 .todo .ac:hover{transform:none;background:var(--ui-soft,#FAFAFD)}',
    '@supports (background:color-mix(in srgb,red 10%,white)){#v-money .x73 .ac .ic{background:color-mix(in srgb,var(--c) 14%,#fff);color:var(--c);border-radius:8px}}',
    '#v-money .x73 .ac b{font-size:13.5px}',
    /* wallets */
    all('.wl-t') + '{background:#fff!important;border:1px solid ' + LN + ';border-radius:12px;min-height:0}',
    all('.wl-t b') + '{font:700 22px/1.25 ' + F + '!important;font-variant-numeric:tabular-nums;color:' + INK + '}',
    all('.wl-t small,.wl-last') + '{font-family:' + F + ';font-size:12px}',
    all('.wl-h') + '{font-family:' + F + '}',
    /* payroll */
    '#v-payroll .py-find{padding:6px 0 8px}#v-payroll .py-find .search{height:38px;min-height:0;border:1px solid ' + LN + ';border-radius:10px;box-shadow:none;font:13.5px ' + F + ';background-color:#fff}',
    '#v-payroll .py-chips{margin-top:8px}#v-payroll .py-chips button{height:34px;padding:0 12px;border:1px solid ' + LN + ';border-radius:10px;font:700 13px ' + F + ';color:' + MU + '}',
    '#v-payroll .py-chips button.on{background:' + INK + ';border-color:' + INK + ';color:#fff}#v-payroll .py-chips button.on b{color:#fff}',
    '#v-payroll .py-cap{margin:16px 2px 8px!important}#v-payroll .py-cap span{font-family:' + F + ';font-size:12.5px;color:' + MU + '}',
    '#v-payroll .py-row{font-family:' + F + '}#v-payroll .py-n b{font-size:14px;font-weight:700}#v-payroll .py-net{font-size:15px!important;font-family:' + F + '}',
    '#v-payroll .py-av{width:32px!important;height:32px!important;font-size:11.5px!important}#v-payroll .py-cur .py-av{background:#ECEAF4!important;color:' + INK + '!important}',
    '#v-payroll .py-st span{font:700 11px/1.6 ' + F + '!important;padding:1px 8px!important}',
    '#pyCur .py-n{min-width:0}#pyCur .r65{flex-wrap:wrap;white-space:normal!important;row-gap:2px}#pyCur .r65 .tb{width:84px}',
    '#v-payroll details.py-h>summary{padding:10px 16px!important}#v-payroll details.py-h>summary .t{font-size:15px!important;font-family:' + F + '}',
    '#v-payroll .hb62 .sg{filter:saturate(.55) brightness(1.08)}',
    '#v-payroll details.py-done{margin-top:12px!important}#v-payroll details.py-done>summary{padding:12px 16px!important}#v-payroll .py-pill{font:700 11px/1.6 ' + F + ';padding:1px 8px}',
    '#v-money .x73 .pfc{margin-right:72px}',
    /* Wallets tab: the page title already says Wallets — the card does not repeat it (its total stays) */
    '#v-wallets .wl870s h2{display:none}',
    /* responsive */
    '@media(max-width:900px){#v-money .x73 .kp{grid-template-columns:1fr 1fr!important}#v-money .x73 .kp>div:nth-child(odd){border-left:0!important}#v-money .x73 .kp>div:nth-child(n+3){border-top:1px solid ' + LN + '!important}}',
    '@media(max-width:640px){#v-payroll details.py-h>summary{display:flex!important;flex-wrap:wrap;align-items:center;gap:2px 10px}#v-payroll details.py-h>summary>div{flex:1 1 60%;min-width:0}#v-payroll details.py-h>summary .hb62{display:none!important}#v-payroll details.py-h>summary .t{margin-left:auto;white-space:nowrap}#v-payroll details.py-h>summary small.s{display:none}#v-payroll .pm60 .cs b{display:none}}',
    '@media(max-width:640px){#v-money .mx-top h1,#v-wallets .lead h1,#v-payroll .py-top h1{font-size:22px!important}#v-money .x73 .kp{grid-template-columns:1fr!important}#v-money .x73 .kp>div{border-left:0!important}#v-money .x73 .kp>div+div{border-top:1px solid ' + LN + '!important}',
    '#v-money .x73 .kp b,#v-money .x73 .t3 b{font-size:18px!important}#v-money .x73 .todo{grid-template-columns:1fr}#v-money .mx-act .btn{flex:1}' + all('.wl-act') + '{margin-left:0;width:100%}' + all('.wl-act .btn') + '{flex:1 1 auto}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui940'; st.textContent = css; document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
