// 1622: design system · step 3: shared components (server/DESIGN-SYSTEM-2026-10-29.md › Components). Style only, in <head>.
// · Buttons: one height everywhere — 40 px on a laptop, 44 px on a phone / touch screen (was 30–46 px, 6 variants); pill shape;
//   14 px text; primary (solid teal) semibold, secondary (outline) and destructive keep their 1101 colours. Text links and the
//   "More actions" menu items are not buttons and keep their look.
// · Filter pills and segmented choices: 36 px on a laptop, 44 px on a phone.
// · Form fields (every text, date, time, number field and select, outside tables): 40 px laptop / 44 px phone, 16 px text (no
//   phone zoom), 10 px corners on the app's field style. Text areas keep their height. The sign-in page keeps its 48 px fields.
// · Status chips: one size (13 px semibold, 2 × 8 px padding, pill) — were 11–14 px.
// · Section headings (h2 in a screen): 18 px semibold (were 18/600 and 20/700).
// · Dialog close button: 40 px (44 phone), same place, same look in every dialog. Empty-list text: 14 px muted, 24 px padding.
// · Not touched (other agents are working there today): the student card header (.shero / .stu-bar) and the trial dialog
//   actions (#tlAct). Parent pictures and the payment confirmation are drawn outside these areas and are unchanged.
const lib = require('../tools/lib.js'), file = process.argv[2];
const A = ':is(#app,#sheet,body>[id$="M"])';
const NOT = ':not(:where(#wxG,.stu-bar,.shero,#tlAct,.rp-act,.m1000-p) .btn):not(.lk):not([class*="link"])';
const CSS = `<style id="ds1622">/* 1622 · shared components (server/DESIGN-SYSTEM-2026-10-29.md) */
${A} .btn${NOT}:not(#z1622){min-height:var(--coe-ctl)!important;height:auto!important;padding-top:0!important;padding-bottom:0!important;border-radius:var(--coe-r-pill)!important;font-size:var(--coe-fs-14)!important;line-height:1.2!important;font-weight:500!important}
${A} .btn${NOT}:not(.ghost):not(.x1101-sec):not(.x1101-dz):not(.coral):not(.on):not(#z1622):not(#y1622){font-weight:600!important}
${A} .btn.sm${NOT}:not(#z1622){padding-left:14px!important;padding-right:14px!important}
${A} :is(.seg,.tx-seg,.bl-chips,.py-chips,.ex-ch,.mo-who)>button:not(#z1622){min-height:var(--coe-ctl-sm)!important;height:auto!important}
${A} :is(input.in-t:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),select.in-t):not(#z1622){height:var(--coe-ctl)!important;min-height:0!important;border-radius:var(--coe-r-sm)!important;font-size:var(--coe-fs-16)!important;border-color:var(--coe-line-strong)}
${A} :is(input:is([type=text],[type=date],[type=time],[type=number],[type=email],[type=tel],[type=search],:not([type])),select):not(.in-t):not(:where(.shero,.stu-bar,table,#login) *):not(#z1622){height:var(--coe-ctl)!important;min-height:0!important;font-size:var(--coe-fs-16)!important}
${A} textarea.in-t:not(#z1622){border-radius:var(--coe-r-sm)!important;font-size:var(--coe-fs-16)!important;border-color:var(--coe-line-strong)}
${A} span.chip:not(:where(.shero,.stu-bar) *):not(#z1622){font-size:var(--coe-fs-13)!important;font-weight:600!important;line-height:1.35!important;padding:2px 8px!important;border-radius:var(--coe-r-pill)!important}
#app h2:not(:where(.shero,.stu-bar) *):not(#z1622){font-size:var(--coe-fs-18)!important;font-weight:600!important;letter-spacing:0!important;text-transform:none!important}
.sheet>.x:not(#z1622){width:var(--coe-ctl)!important;height:var(--coe-ctl)!important;border-radius:var(--coe-r-pill)!important;background:var(--coe-sunk)!important;color:var(--coe-text)!important}
.sheet>.x:hover{background:var(--coe-neutral-bg)!important}
${A} .empty:not(#z1622){color:var(--coe-mute)!important;font-size:var(--coe-fs-14)!important;padding:var(--coe-sp-24) var(--coe-sp-16)!important}
</style>`;
lib(file, [
  ['<script>/* 1111 · finish screens before they are painted (no flicker) */', CSS + '<script>/* 1111 · finish screens before they are painted (no flicker) */'],
]);
