// 21 Oct · Browser translation (Chrome) was changing the Chinese on Misty's screen; the payment confirmation and its form are marked translate="no",
// so the preview, PDF and picture always keep the exact Chinese wording.
require('../tools/lib.js')(process.argv[2], [
["return `<div class=\"ivp\">", "return `<div class=\"ivp notranslate\" translate=\"no\">"],
["close(); const m = document.createElement('div'); m.id = 'ivM';", "close(); const m = document.createElement('div'); m.id = 'ivM'; m.setAttribute('translate', 'no'); m.className = 'notranslate';"]
]);
