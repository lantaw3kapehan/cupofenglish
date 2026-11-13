// 2168 (13 Nov · Misty 18:09 "7 … enhancement, not repeated"): measured first (last 60 days: 38 trials, 29 enrolled, 8 closed "Not now",
// Day 3 / Day 14 steps used): the gaps were (a) an open trial nobody contacted for weeks (Lewis, 25 days) and (b) "Not now" trials are
// never tried again. To do › Fix these now lists (a) "Trial follow-up overdue" (no contact 7+ days, Open = Trials, Done today) and
// (b) "Try again" 30–60 days after "Not now" with Copy message (EN + 中文) and Sent ✓ (coe_trial_gaps in coe_ops_check, coe-ops v6).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["(x.go ? '<button type=\"button\" class=\"go\" onclick=\"o2091go(' + i + ')\">Open</button>' : '')",
   "(x.kind === 'tagain' ? '<button type=\"button\" data-s=\"' + String(x.student || '').replace(/[\"<>&]/g, '') + '\" data-t=\"' + String(x.teacher || '').replace(/[\"<>&]/g, '') + '\" onclick=\"tg2168(this)\">Copy message</button>' : '') + (x.go ? '<button type=\"button\" class=\"go\" onclick=\"o2091go(' + i + ')\">Open</button>' : '')"],
  ["x.kind === 'risk' ? 'Called ✓' : 'It\\'s correct'", "x.kind === 'risk' ? 'Called ✓' : x.kind === 'tfu' ? 'Done today' : x.kind === 'tagain' ? 'Sent ✓' : 'It\\'s correct'"],
  ["toast(x.kind === 'risk' ? '✓ Noted", "toast(x.kind === 'tagain' ? '✓ Marked as sent' : x.kind === 'tfu' ? '✓ Done for today · it comes back tomorrow if still no contact' : x.kind === 'risk' ? '✓ Noted"],
  ["</script>\n</body>\n</html>", `</script>
<script id="x2168">
/* 2168 · "Try again" message for a trial that said Not now a month ago */
window.tg2168 = function(b){ try{
  const n = String((b && b.dataset.s) || 'your child').trim(), t = String((b && b.dataset.t) || '').trim();
  const msg = 'Hello! It has been a month since ' + n + '\\'s trial class' + (t ? ' with Teacher ' + t : '') + '. We have class times open this month. Would ' + n + ' like to start English lessons with us? We are happy to help anytime. — CupOfEnglish\\n'
    + '您好！' + n + (t ? '和' + t + '老师' : '') + '的试听课已经过去一个月啦。这个月我们有合适的上课时间，请问' + n + '想开始上英语课吗？有任何问题随时联系我们。— CupOfEnglish';
  const ok = () => { try{ toast('Copied · paste it in the parent\\'s WeChat, then tap Sent ✓'); }catch(e){} };
  const show = () => { try{ openSheet('<h1>Message</h1><p class="small" style="white-space:pre-line">' + esc(msg) + '</p>'); }catch(e){} };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(ok, show); else show();
}catch(e){} };
</script>
</body>
</html>`],
]);
