/* 20 Oct · 391 · Student page, minimal and quick (Misty: "more minimal, modern, straightforward, and super convenient").
   · One calm header: name, code, teacher, book chips and three numbers.
   · One action bar: "Send to parent" (pictures, class notice, lesson summary, print) and "Manage" (edit, agreement, book, teacher /
     schedule) · the same buttons as before, only grouped.
   · Tabs under the header: Overview (status, changes, schedule) · Progress (CEFR, feedback, checks, trial) · Notes · Profile.
     The last tab is remembered; print shows everything. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2 .shero{background:#fff;border:1px solid #EEEDF3;box-shadow:none;border-radius:22px;padding:18px 20px}
#sheetBody.stu2 .shero h1{font-size:30px;letter-spacing:-.01em}
#sheetBody.stu2 .shero .av.big{width:64px;height:64px;font-size:26px;border-width:3px}
#sheetBody.stu2 .shero .chip{font-size:12.5px;padding:4px 10px}
#sheetBody.stu2 .kpis>div{box-shadow:none;border:1px solid #EEEDF3;background:#FAFAFC;border-radius:16px}
.stu-bar{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;margin:12px 0 4px}
.stu-bar .grp{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:6px 8px;border:1px solid #EEEDF3;border-radius:16px;background:#fff}
.stu-bar .grp>span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin:0 4px 0 2px;white-space:nowrap}
.stu-bar .btn{padding:7px 12px!important;font-size:13px!important;min-height:0!important;border-radius:999px!important;background:#fff!important;color:#2B2253!important;border:1px solid #E3E1EC!important;box-shadow:none!important;width:auto!important;margin:0!important}
.stu-bar .btn:hover{border-color:#2B2253!important}
.stu-bar .btn svg{width:14px;height:14px}
.stu-tabs{position:sticky;top:-1px;z-index:5;display:flex;gap:4px;margin:12px -4px 6px;padding:6px 4px;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);border-bottom:1px solid #F0EFF5;overflow-x:auto}
.stu-tabs button{border:0;background:none;font:inherit;font-size:14px;font-weight:600;color:#7A768F;padding:8px 14px;border-radius:999px;cursor:pointer;white-space:nowrap}
.stu-tabs button.on{background:#2B2253;color:#fff}
.stu-tabs button i{font-style:normal;font-weight:500;opacity:.7;margin-left:4px;font-size:12px}
#sheetBody.stu2>[data-stab]{margin-top:12px}
#sheetBody.stu2 section.sec{border-radius:20px;box-shadow:none;border:1px solid #EEEDF3}
#sheetBody.stu2 .stu-hide{display:none!important}
#sheetBody.stu2 .stats{gap:8px}
#sheetBody.stu2 .stats .stat{box-shadow:none;border:1px solid #EEEDF3;background:#FAFAFC;border-radius:14px;padding:10px 14px}
#sheetBody.stu2 .stats .stat::before,#sheetBody.stu2 .stats .stat::after{display:none}
#sheetBody.stu2 .stats .stat b{font-size:24px}
#sheetBody.stu2 .btn.teal.block{background:#fff!important;color:#00737B!important;border:1px solid #BFE6E3!important;box-shadow:none!important;font-size:14px}
#sheetBody.stu2 .btn.teal.block:hover{background:#F1FAF9!important}
@media print{.stu-tabs,.stu-bar{display:none!important}#sheetBody.stu2 .stu-hide{display:block!important}}
@media(max-width:620px){.stu-bar .grp{width:100%}.stu-bar .grp>span{width:100%;margin-bottom:2px}#sheetBody.stu2 .shero h1{font-size:24px}}`;
  document.head.appendChild(css);
  let TABK = 'ov'; try{ TABK = localStorage.getItem('coe.stab') || 'ov'; }catch(e){}
  const TABS = [['ov', 'Overview'], ['pr', 'Progress'], ['no', 'Notes'], ['pf', 'Profile']];
  function kind(el){ if(el.id === 'stuStat' || el.id === 'stuRn' || el.id === 'stuSch') return 'ov';
    const h = el.querySelector('h2, summary'), t = (h ? h.textContent : el.textContent.slice(0, 60)).trim();
    if(/^Class notes|Homework/i.test(t)) return 'no';
    if(/^Profile|Contact|Emails|Student details/i.test(t)) return 'pf';
    if(/CEFR|feedback|Skill breakdown|Progress check|^Trial|next level|Level-up|Monthly|Report/i.test(t)) return 'pr';
    return 'ov'; }
  function bar(body){ if(body.querySelector('.stu-bar')) return; const hero = body.querySelector('.shero'); if(!hero) return;
    const rows = []; let n = hero.nextElementSibling; while(n && !n.matches('section, #stuSch, [id^="stu"]') && rows.length < 4){ if(n.querySelector && n.querySelector('button')) rows.push(n); n = n.nextElementSibling; }
    const B = [].concat(...rows.map(r => [...r.querySelectorAll('button')])); if(!B.length) return;
    const send = B.filter(b => /picture|notice|summary|report|print|pdf/i.test(b.textContent)), mng = B.filter(b => send.indexOf(b) < 0);
    const wrap = document.createElement('div'); wrap.className = 'stu-bar noprint';
    const grp = (t, L) => { if(!L.length) return; const g = document.createElement('div'); g.className = 'grp'; g.innerHTML = '<span>' + t + '</span>'; L.forEach(b => g.appendChild(b)); wrap.appendChild(g); };
    grp(D && D.mgr ? 'Send to parent' : 'Write', send.length ? send : []); grp(D && D.mgr ? 'Manage' : 'More', mng);
    rows[0].parentNode.insertBefore(wrap, rows[0]); rows.forEach(r => { if(!r.querySelector('button, input, select')) r.remove(); }); }
  function apply(){ const body = $('sheetBody'); if(!body || !body.querySelector('.shero') || typeof STU === 'undefined' || !STU) { if(body) body.classList.remove('stu2'); return; }
    body.classList.add('stu2'); bar(body);
    let tabs = body.querySelector('.stu-tabs');
    const after = body.querySelector('.stu-bar') || body.querySelector('.shero');
    if(!tabs){ tabs = document.createElement('div'); tabs.className = 'stu-tabs noprint'; after.insertAdjacentElement('afterend', tabs); }
    const kids = [...body.children].filter(el => el !== tabs && !el.classList.contains('shero') && !el.classList.contains('stu-bar') && !el.classList.contains('paper') && el.tagName !== 'H1' && !(el.matches('.row') && el.querySelector('button') && !el.querySelector('section')) && el.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_PRECEDING);
    const cnt = { ov: 0, pr: 0, no: 0, pf: 0 };
    kids.forEach(el => { const k = el.dataset.stab || (el.dataset.stab = kind(el)); cnt[k]++; el.classList.toggle('stu-hide', k !== TABK); });
    if(!cnt[TABK]){ TABK = 'ov'; kids.forEach(el => el.classList.toggle('stu-hide', el.dataset.stab !== 'ov')); }
    const nNotes = ((STU.r && STU.r.notes) || []).length;
    const html = TABS.filter(([k]) => cnt[k] || k === 'ov').map(([k, t]) => '<button type="button" class="' + (k === TABK ? 'on' : '') + '" onclick="stuTab(\'' + k + '\')">' + t + (k === 'no' && nNotes ? '<i>' + nNotes + '</i>' : '') + '</button>').join('');
    if(tabs.innerHTML !== html) tabs.innerHTML = html; }
  window.stuTab = function(k){ TABK = k; try{ localStorage.setItem('coe.stab', k); }catch(e){} apply(); const t = document.querySelector('#sheetBody .stu-tabs'); if(t){ const sh = $('sheet'); try{ const top = t.offsetTop - 8; const sc = t.closest('.sheet, #sheet') || sh; if(sc && sc.scrollTop > top) sc.scrollTop = top; }catch(e){} } };
  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); try{ apply(); }catch(e){} setTimeout(() => { try{ apply(); }catch(e){} }, 30); return r; };
  /* sections added later (status, changes, profile, schedule refresh) take their tab too */
  let t = 0; try{ const sb = $('sheetBody'); if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { try{ if(sb.querySelector('.shero')) apply(); else sb.classList.remove('stu2'); }catch(e){} }, 40); }).observe(sb, { childList: true }); }catch(e){}
})();
