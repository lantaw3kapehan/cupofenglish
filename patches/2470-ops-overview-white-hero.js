// 2470 (Misty 19:00 "this color on Celine, make it follow our current and chosen design") · Celine's Overview header card is the white
//   aligned card used on To do (white, thin line, navy text) instead of the navy block · the two buttons are light cards with a line ·
//   the Ops Desk number keeps its coral circle (green once she has done something).
const file = process.argv[2];
const CSS = `<style id="u2470">
#om2344 .ov-hero{background:var(--u-card,#fff)!important;color:var(--u-ink,#2B2253)!important;border:1px solid var(--u-line,#ECEAF2)!important;border-radius:var(--u-r,16px)!important;box-shadow:0 1px 2px rgba(43,34,83,.04)!important;padding:22px 26px!important}
#om2344 .ov-hero::before,#om2344 .ov-hero::after{display:none!important}
#om2344 .ov-hero h1{color:var(--u-ink,#2B2253)!important}
#om2344 .ov-hero .ov-eye{color:var(--u-mute,#6B6880)!important}
#om2344 .ov-hero .ov-tag{color:var(--u-mute,#6B6880)!important}
#om2344 .ov-hero .ov-cap{background:#fff!important;border:1px solid #CFE3E5!important;color:var(--u-ink,#2B2253)!important}
#om2344 .ov-hero .ov-cap:hover{border-color:#9AD3D6!important;background:#F7FBFB!important}
#om2344 .ov-hero .ov-cap small{color:var(--u-mute,#6B6880)!important}
#om2344 .ov-hero .ov-cap.ghost{background:#F7F6FA!important;border:1px solid var(--u-line,#ECEAF2)!important;color:var(--u-ink,#2B2253)!important}
#om2344 .ov-hero .ov-cap.ghost small{color:var(--u-mute,#6B6880)!important}
#om2344 .ov-hero .ov-n.ok{background:#1E7A4F!important}
</style>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + '<script id="b2278">']]);
