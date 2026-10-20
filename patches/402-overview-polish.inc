/* 20 Oct · 402 · Overview polish (Misty: "still unsatisfied"). Style only, same numbers and buttons.
   · Read top to bottom: what needs you (alert) → today at a glance (hero) → four numbers → last week → decide now.
   · Hero: shorter, the three tiles show two full lines instead of cutting text ("Nothing urgent · 1 to l…").
   · Four number cards in the app's card style: small label on top, big number, thin bar, one line of detail; the whole card opens its screen.
   · "May not renew" alert: white card with a coral edge; Phone alerts: a quiet thin line; Last week: the normal card (no teal outline).
   · "Live · 15:12" without the extra "H". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.ov2{gap:20px!important}
.ov2 .o2-hero{padding:22px 26px!important;border-radius:var(--r-lg)!important;gap:18px!important}
.ov2 .o2-hero h1{font-size:30px!important;margin:4px 0 2px!important}
.ov2 .o2-s{padding:12px 14px!important;border-radius:var(--r-md)!important}
.ov2 .o2-s small{white-space:normal!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.35}
.ov2 .o2-kpi{gap:14px!important}
.ov2 .o2-k{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important;padding:16px 18px!important;gap:8px!important;cursor:pointer}
.ov2 .o2-k:hover{transform:none!important;box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)!important}
.ov2 .o2-kl{font-size:11.5px!important;letter-spacing:.08em!important;text-transform:uppercase;color:#8A86A0!important;font-weight:600}
.ov2 .o2-kv b{font-size:36px!important}
.ov2 .o2-kv small{font-size:13px!important}
.ov2 .ov-stack{height:6px!important;border-radius:4px!important}
.ov2 .o2-kf{font-size:12.5px!important}
.ov2 .ov-card,.ov2 section.ov-card[style]{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important}
.ov2 .o2-hd h2,.ov2 .ov-hd h2{color:var(--ink)}
#rnWarn{background:#fff!important;border:1px solid var(--line)!important;border-left:4px solid #D4705A!important;border-radius:var(--r-md)!important;box-shadow:var(--sh1)!important;padding:12px 16px!important;cursor:pointer}
#rnWarn:hover{background:#FFFBFA!important}
#pushAl{background:#fff!important;border:1px solid var(--line)!important;border-radius:var(--r-md)!important;box-shadow:none!important;padding:8px 14px!important;font-size:13px!important}`;
  document.head.appendChild(css);
})();
