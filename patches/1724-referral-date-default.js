// 1724: (Misty, 3 Nov 21:54) referral incentive (+1) not showing for Joy (referred Lucy ST-2026-131) and Lucas (referred Leon ST-2026-135).
//   Cause: ACTIVE › INCENTIVE counts DATABASE › GIVE FREE LESSON (X) only when DATE RECOMMENDED (V) is filled and on/after the referrer's
//   package start. Lucy had X = 1 but no date; Leon had neither. The student form left both to be typed by hand.
//   Fix: when the student came through another student (SOURCE starts with a student code) and the enrollment part is saved,
//   an empty Date recommended takes the start of the enrollment (First class; else today · Misty 21:56) and an empty Free lessons takes 1. A typed value is kept.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!row && !($('sEnr')||{}).open) ['firstClass','lessons','cefrBooks','free','recommended','ended'].forEach(k => delete f[k]);",
   "if(!row && !($('sEnr')||{}).open) ['firstClass','lessons','cefrBooks','free','recommended','ended'].forEach(k => delete f[k]);\n" +
   "try{ if(/^ST-\\d{4}-\\d{3}/i.test(String(f.source || '').trim()) && 'recommended' in f){ let fill = [];   /* 1724: a referral counts for the referrer only with a date */\n" +
   "  if(!f.recommended){ f.recommended = f.firstClass || ymdLocal(new Date()); fill.push('Date recommended ' + f.recommended); }\n" +
   "  if('free' in f && String(f.free).trim() === ''){ f.free = '1'; fill.push('free lesson 1 for the referrer'); }\n" +
   "  if(fill.length) setTimeout(() => { try{ toast('Referral: ' + fill.join(' · ')); }catch(e){} }, 2500); } }catch(e){}"]
]);
