// 2021 (9 Nov 17:56, Misty: "these part on the chat [Requires reply, Requires acknowledgement, Pin message, Templates, Create formal
//   notice] can be hidden too unless we need to click"): management. The row is hidden; a "Message options" button (sliders) next to the
//   emoji button shows or hides it. It stays visible while one of the options is switched on for the message being written.
//   Held: released with tomorrow morning's batch (no releases during class hours).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "      + '<button type=\"button\" class=\"ch-ib' + (S.emoOpen && S.emoMode !== 'react' ? ' on' : '') + '\" id=\"chEmoB\"",
  "      + (M ? '<button type=\"button\" class=\"ch-ib' + (S.opt9 ? ' on' : '') + '\" aria-label=\"Message options\" title=\"Message options: requires reply, acknowledgement, pin, templates, formal notice\" aria-expanded=\"' + !!S.opt9 + '\" onclick=\"chat1400.opt9()\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0\"/><circle cx=\"16\" cy=\"6\" r=\"2\"/><circle cx=\"10\" cy=\"12\" r=\"2\"/><circle cx=\"18\" cy=\"18\" r=\"2\"/></svg></button>' : '')   /* 2021 */\n      + '<button type=\"button\" class=\"ch-ib' + (S.emoOpen && S.emoMode !== 'react' ? ' on' : '') + '\" id=\"chEmoB\""
 ],
 [
  "    var rp = S.replyTo ? '<div class=\"ch-q\" style=\"margin-bottom:6px\">Replying to '",
  "    if(M && opts && !S.opt9 && !(o.nr || o.cf || o.pin)) opts = '';   /* 2021: hidden until Message options is tapped (or one of them is on) */\n    var rp = S.replyTo ? '<div class=\"ch-q\" style=\"margin-bottom:6px\">Replying to '"
 ],
 [
  "    m2009: function(k){",
  "    opt9: function(){ S.opt9 = !S.opt9; var tx = document.getElementById('chTx'), v = tx ? tx.value : ''; render(true); var t2 = document.getElementById('chTx'); if(t2){ t2.value = v; t2.focus(); } },   /* 2021 */\n    m2009: function(k){"
 ]
]);
