// 1620: (Misty 09:43 "please improve the visual design, layout, labelled colours") design system · step 1 of the app-wide pass: tokens.
// · One set of design tokens (--coe-*) for colour, type, spacing (8 px grid), radii, shadows and control sizes, in <head> so it is
//   there at first paint. Doc: server/DESIGN-SYSTEM-2026-10-29.md.
// · The older token families (--d-* from 1000, --c-* from 1101, --ui-* from 900, --ink / --mute) now point at the same tokens, so
//   every screen that uses them shares one palette. Values are the same or a hair apart (e.g. warning text #9A5B00 → #7A4A00, AA on
//   its tint). One intended change: "info" is now brand teal (was a separate blue) — teal = brand / neutral info everywhere.
// · Focus ring on everything focusable (header, toasts, menus outside #app too), 3 px, AA.
// · Nothing else: no layout, wording, links or data change. html:root:root wins over every later html:root / :root block.
const lib = require('../tools/lib.js'), file = process.argv[2];
const CSS = `<style id="ds1620">/* 1620 · CupOfEnglish design tokens (server/DESIGN-SYSTEM-2026-10-29.md) */
html:root:root{
--coe-teal:#01B0BF;--coe-teal-600:#00838F;--coe-teal-700:#00707A;--coe-teal-800:#005E66;--coe-teal-900:#004E55;--coe-on-tint:#00575F;
--coe-teal-50:#E3F4F5;--coe-teal-100:#CDEBEE;--coe-teal-200:#8CC5CA;
--coe-purple:#2F2752;--coe-purple-600:#4B3D8F;--coe-purple-50:#EEEAF8;--coe-purple-200:#D5CEF0;
--coe-ink:#2B2450;--coe-text:#3A3556;--coe-mute:#5E5A76;--coe-faint:#6B6783;
--coe-line:#E7E5EE;--coe-line-2:#F0EEF5;--coe-line-strong:#CFCBDD;--coe-surface:#FFFFFF;--coe-sunk:#F7F7FA;--coe-page:#FAFAFC;
--coe-ok-fg:#1E6E4C;--coe-ok-bg:#E6F4EC;--coe-ok-bd:#BFE0CE;
--coe-warn-fg:#7A4A00;--coe-warn-bg:#FFF4DE;--coe-warn-bd:#EFD39C;
--coe-bad-fg:#B42318;--coe-bad-bg:#FDECEA;--coe-bad-bd:#F0BDB6;--coe-bad-solid:#B42318;
--coe-info-fg:#00616A;--coe-info-bg:#E3F4F5;--coe-info-bd:#A9D9DD;
--coe-mgmt-fg:#4B3D8F;--coe-mgmt-bg:#EEEAF8;--coe-mgmt-bd:#D5CEF0;
--coe-neutral-fg:#4C4868;--coe-neutral-bg:#F1F0F6;--coe-neutral-bd:#E2E0EA;
--coe-muted-fg:#5E5A76;--coe-muted-bd:#E2E0EA;
--coe-font:Inter,"Noto Sans SC","PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--coe-font-brand:"Fredoka One","Fredoka",var(--coe-font);
--coe-fs-12:.75rem;--coe-fs-13:.8125rem;--coe-fs-14:.875rem;--coe-fs-16:1rem;--coe-fs-18:1.125rem;--coe-fs-20:1.25rem;--coe-fs-24:1.5rem;--coe-fs-28:1.75rem;--coe-fs-32:2rem;
--coe-lh-tight:1.2;--coe-lh:1.5;
--coe-sp-4:4px;--coe-sp-8:8px;--coe-sp-12:12px;--coe-sp-16:16px;--coe-sp-24:24px;--coe-sp-32:32px;--coe-sp-40:40px;--coe-sp-48:48px;
--coe-r-xs:6px;--coe-r-sm:10px;--coe-r-md:14px;--coe-r-lg:20px;--coe-r-pill:999px;
--coe-sh-1:0 1px 2px rgba(43,36,80,.05);--coe-sh-2:0 1px 2px rgba(43,36,80,.05),0 6px 18px -10px rgba(43,36,80,.16);--coe-sh-3:0 12px 32px -12px rgba(43,36,80,.35);
--coe-ring:rgba(0,112,122,.55);
--coe-ctl:40px;--coe-ctl-sm:36px;--coe-chip-h:22px;
/* older families → the same tokens */
--d-ink:var(--coe-ink);--d-text:var(--coe-text);--d-mute:var(--coe-mute);--d-faint:var(--coe-faint);--d-line:var(--coe-line);--d-line2:var(--coe-line-2);
--d-card:var(--coe-surface);--d-sunk:var(--coe-sunk);--d-tint:var(--coe-teal-50);--d-tint2:var(--coe-neutral-bg);--d-teal:var(--coe-teal-600);--d-teal-d:var(--coe-teal-700);--d-purple:var(--coe-purple);
--d-warn-bg:var(--coe-warn-bg);--d-warn:var(--coe-warn-fg);--d-bad-bg:var(--coe-bad-bg);--d-bad:var(--coe-bad-fg);--d-ok-bg:var(--coe-ok-bg);--d-ok:var(--coe-ok-fg);
--d-r:var(--coe-r-md);--d-r-sm:var(--coe-r-sm);--d-sh:var(--coe-sh-2);--d-gap:var(--coe-sp-16);
--c-pri:var(--coe-teal-700);--c-pri-h:var(--coe-teal-800);--c-pri-a:var(--coe-teal-900);--c-ring:var(--coe-ring);
--c-ok:var(--coe-ok-fg);--c-ok-bg:var(--coe-ok-bg);--c-ok-bd:var(--coe-ok-bd);--c-warn:var(--coe-warn-fg);--c-warn-bg:var(--coe-warn-bg);--c-warn-bd:var(--coe-warn-bd);
--c-bad:var(--coe-bad-fg);--c-bad-bg:var(--coe-bad-bg);--c-bad-bd:var(--coe-bad-bd);--c-info:var(--coe-info-fg);--c-info-bg:var(--coe-info-bg);--c-info-bd:var(--coe-info-bd);
--ui-ink:var(--coe-ink);--ui-teal:var(--coe-teal);--ui-teal-d:var(--coe-teal-600);--ui-in:var(--coe-ok-fg);--ui-in-b:var(--coe-ok-bg);--ui-out:var(--coe-bad-fg);--ui-out-b:var(--coe-bad-bg);
--ui-ac:var(--coe-warn-fg);--ui-ac-b:var(--coe-warn-bg);--ui-line:var(--coe-line);--ui-soft:var(--coe-page);--ui-tint:var(--coe-neutral-bg);--ui-mute:var(--coe-faint);--ui-r:var(--coe-r-md);
--ink:var(--coe-ink);--mute:var(--coe-mute);--line:var(--coe-line);--green:var(--coe-ok-fg);--red:var(--coe-bad-fg);
}
@media (max-width:640px),(pointer:coarse){html:root:root{--coe-ctl:44px;--coe-ctl-sm:44px}}
/* a visible focus ring on anything focusable, also outside the screen area (header, menus, toasts) */
:where(a,button,summary,input,select,textarea,[tabindex]):focus-visible{outline:3px solid var(--coe-ring);outline-offset:2px}
/* semantic chip for new work: always text + colour, never colour alone */
.coe-chip{display:inline-flex;align-items:center;gap:4px;min-height:var(--coe-chip-h);padding:0 8px;border-radius:var(--coe-r-pill);font:600 var(--coe-fs-13)/1.2 var(--coe-font);white-space:nowrap;vertical-align:middle;border:0;background:var(--coe-neutral-bg);color:var(--coe-neutral-fg)}
.coe-chip.is-ok{background:var(--coe-ok-bg);color:var(--coe-ok-fg)}.coe-chip.is-warn{background:var(--coe-warn-bg);color:var(--coe-warn-fg)}
.coe-chip.is-bad{background:var(--coe-bad-bg);color:var(--coe-bad-fg)}.coe-chip.is-info{background:var(--coe-info-bg);color:var(--coe-info-fg)}
.coe-chip.is-mgmt{background:var(--coe-mgmt-bg);color:var(--coe-mgmt-fg)}.coe-chip.is-muted{background:transparent;color:var(--coe-muted-fg);box-shadow:inset 0 0 0 1px var(--coe-muted-bd);font-weight:500}
</style>`;
lib(file, [
  ['<script>/* 1111 · finish screens before they are painted (no flicker) */', CSS + '<script>/* 1111 · finish screens before they are painted (no flicker) */'],
]);
