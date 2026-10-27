// 1280: (Misty, 27 Oct 11:23 "opening the Parent reports is too slow") After sign-in the app quietly pre-loads several screens in the
//   background (Parent reports, Trials, ACTIVE…). Those background reads wait in a queue behind slow Google calls (reminders, pay checks,
//   night summary: 4–10 s each). When you then OPENED Parent reports, the app saw "already loading" and simply waited for that queued
//   background read — so the screen sat on grey lines for many seconds even though the database copy was there.
//   Now a read you open yourself never waits behind a background read: it shows the database copy at once (as every other screen does)
//   and takes the background answer when it arrives (repainting only if something changed). Same for every screen, not just reports.
//   The main cause (found in the preview): 1170's "keep the finished screen when nothing changed" step compares the new drawing with
//   the LAST drawing of that screen. The background pre-load had already drawn Parent reports once; when you opened it, the screen
//   first showed the grey "loading" lines, then the same reports were drawn again — identical to last time — so 1170 put back what was
//   on screen just before: the grey loading lines. They stayed until the data next changed (often minutes). Now the old screen is only
//   put back when it really is the finished copy of that same drawing. This also affected Students, ACTIVE, Finance, Schedule,
//   Monitor, Performance, Payroll, Actions and Overview whenever a background refresh had drawn them before you opened them.
//   No data, permissions or calculations change.
require('../tools/lib.js')(process.argv[2], [
  ["const k = fn + '|' + JSON.stringify(args); if(API_FLY[k]) return API_FLY[k];",
   "const k = fn + '|' + JSON.stringify(args), _uiNow = Date.now() - (window._ui || 0) < 1500, _fly = API_FLY[k]; if(_fly && (_fly._ui || !_uiNow)) return _fly;   /* 1280: a tap never waits behind a queued background read */"],
  ["  const real = () => ui || /^(getBootstrap|mgmtOverview|mgmtRenewals|mgmtTrialFus)$/.test(fn) ? go() : new Promise((res, rej) => { API_Q.push(() => go().then(res, rej)); apiPump(); });",
   "  const real = () => _fly ? _fly : ui || /^(getBootstrap|mgmtOverview|mgmtRenewals|mgmtTrialFus)$/.test(fn) ? go() : new Promise((res, rej) => { API_Q.push(() => go().then(res, rej)); apiPump(); });"],
  ["  const sp = sbRead(fn, args, real, ui); API_FLY[k] = sp; sp.then(() => delete API_FLY[k], () => delete API_FLY[k]); return sp; }",
   "  const sp = sbRead(fn, args, real, ui); sp._ui = ui; API_FLY[k] = sp; const _dl = () => { if(API_FLY[k] === sp) delete API_FLY[k]; }; sp.then(_dl, _dl); return sp; }"],
  ["API_FLY[k] = p; p.then(() => delete API_FLY[k], () => delete API_FLY[k]); return p;",
   "p._ui = _uiNow; API_FLY[k] = p; const _dl = () => { if(API_FLY[k] === p) delete API_FLY[k]; }; p.then(_dl, _dl); return p;"],
  ["    try{ if(el2 === el){ var post = el.innerHTML; if(post !== pre){ if(post === el.__raw1170 && kids.length){ el.replaceChildren.apply(el, kids); if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); } else el.__raw1170 = post; } } }catch(e){}",
   "    try{ if(el2 === el){ var post = el.innerHTML; if(post !== pre){ if(post === el.__raw1170 && kids.length && kids[0] === el.__fc1170){ el.replaceChildren.apply(el, kids); if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); } else el.__raw1170 = post; } el.__fc1170 = el.firstChild; } }catch(e){}   /* 1280: put the old screen back only if it is our own finished drawing, never a loading placeholder */"]]);
