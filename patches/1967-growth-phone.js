// 1967: (follow-up to 1965, Misty 9 Nov "Go ahead do it now") Growth screen on a phone.
//   · "Qualified to teach" kept its label in a narrow left column, so the badges stacked one per line (a very long card).
//     On phones the label now sits above the badges, which wrap across the full width.
//   · Teacher Excellence scale: "Bronze", "Silver" and "Gold" ran into each other ("BronzeSilver Gold"). On phones "Silver" sits on a
//     second line under its mark.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['<div class="row small mute" style="position:relative;height:16px;margin-top:12px">${[[\'Developing\', 0]',
   '<div class="row small mute t1967" style="position:relative;height:16px;margin-top:12px">${[[\'Developing\', 0]'],
  ['<style id="s1965">/* 1965: website feel */\n',
   '<style id="s1965">/* 1965: website feel */\n@media (max-width:600px){#txGrow{flex-direction:column;align-items:flex-start;gap:8px}#txGrow .tx-bdg{width:100%}.t1967{height:32px!important}.t1967>span:nth-child(3){top:16px}}\n'],
]);
