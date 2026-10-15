// 15 Oct · Source tags use clean line icons (same style as the menu) instead of emojis (Misty: "professional … instead of
// generic icons"): briefcase = partner / agent, people = student referral, cup = CupOfEnglish, alert = not set.
const ic = p => `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const BRIEF = ic('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>');
const PEOPLE = ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18.5 14.3A6.5 6.5 0 0 1 21.5 20"/>');
const CUP = ic('<path d="M4 9h13v4a7 7 0 0 1-7 7h1a7 7 0 0 1-7-7z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H16.5"/><path d="M8 3.5v2.5M12 3.5v2.5"/>');
const ALERT = ic('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>');
const q = s => s.replace(/'/g, "\\'");
require('../tools/lib.js')(process.argv[2], [
["title=\"Add the source in ACTIVE › SOURCE\">Source not set</span>'", "title=\"Add the source in ACTIVE › SOURCE\">" + q(ALERT) + "Source not set</span>'"],
["title=\"Student referral\">👥 Referred by '", "title=\"Student referral\">" + q(PEOPLE) + "Referred by '"],
["title=\"Came to CupOfEnglish directly\">☕ '", "title=\"Came to CupOfEnglish directly\">" + q(CUP) + "'"],
["title=\"Partner / agent\">🤝 '", "title=\"Partner / agent\">" + q(BRIEF) + "'"],
[".sa-src.none{background:#FBEAE5;color:#B4513B}", ".sa-src.none{background:#FBEAE5;color:#B4513B}\n.sa-src svg{flex:none;opacity:.85}"],
]);
