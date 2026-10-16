// 16 Oct · A renewal status (✓ Sent, Parent replied › Renewing / Paused / Not renewing) saves in about 1 s: coe-mgmt → writes;
// the database's renewal list changes at once (trigger writes_renewal); Google writes ACTIVE within a minute (RENFAST16).
require('../tools/lib.js')(process.argv[2], [
["const FAST_M = { mgmtRenewPaid: 1, mgmtEnrolPaid: 1,", "const FAST_M = { mgmtRenewal: 1, mgmtRenewPaid: 1, mgmtEnrolPaid: 1,"],
["fetch(/^mgmt(Renew|Enrol)Paid$/.test(fn) ? FAST_URL + '-mgmt' : FAST_URL,", "fetch(/^mgmt((Renew|Enrol)Paid|Renewal)$/.test(fn) ? FAST_URL + '-mgmt' : FAST_URL,"],
["  if(fn === 'mgmtRenewPaid' || fn === 'mgmtEnrolPaid'){",
 "  if(fn === 'mgmtRenewal'){ const st = String(args[2] || ''), nt = String(args[3] || '').replace(/\\s+/g, ' ').trim().slice(0, 200), un = String(args[4] || '');\n    try{ Object.keys(SB_FRESH).forEach(k => { if(/mgmtRenewals\\|/.test(k)) delete SB_FRESH[k]; }); }catch(e){}\n    const txt = !st ? '' : st + (st === 'Paused' && un ? ' until ' + un : '') + ' · ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + who + (nt ? ' · ' + nt : '');\n    return { ok: true, queued: true, status: txt, note: (txt ? st : 'Status cleared') + (st === 'Not renewing' ? ' · unticked in ACTIVE within a minute' : '') }; }\n  if(fn === 'mgmtRenewPaid' || fn === 'mgmtEnrolPaid'){"],
["mgmtRenewPaid: 'Renewal', mgmtEnrolPaid: 'Enrolment' };", "mgmtRenewPaid: 'Renewal', mgmtEnrolPaid: 'Enrolment', mgmtRenewal: 'Renewal status' };"],
]);
