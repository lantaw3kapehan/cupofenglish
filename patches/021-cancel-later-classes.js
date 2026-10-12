// Cancel: "Stop this schedule" also cancels every later class of the package on the same weekday and time
// (parent stops Fridays for good). Also offered on a class that is already cancelled. Server: editClass forward on cancel.
require('../tools/lib.js')(process.argv[2], [
[
"</div>`}\n<button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"sendEdit(${i},'${e.cancelled?'restore':'cancel'}','${src}')\">${e.cancelled?'Restore class (remove X, RSVP Yes)':'Cancel class (X + RSVP No)'}</button>",
"</div>\n<label class=\"check\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"eStop\" onchange=\"const k=$('eMk');if(k&&this.checked)k.checked=false;const b=$('eCx');if(b)b.textContent=this.checked?'Cancel this and every later ${esc(st.toLocaleDateString('en-GB',{weekday:'long'}))} ${tm(e.start)}':'Cancel class (X + RSVP No)'\"><div><b>Stop this schedule · cancel every later ${esc(st.toLocaleDateString('en-GB',{weekday:'long'}))} ${tm(e.start)} too</b><div class=\"small mute\">When the parent stops this day for good. Later classes of this package on the same day and time get X + RSVP No (nothing deleted, no make-up)</div></div></label>`}\n<button class=\"btn ghost block\" id=\"eCx\" style=\"margin-top:8px\" onclick=\"sendEdit(${i},'${e.cancelled?'restore':'cancel'}','${src}')\">${e.cancelled?'Restore class (remove X, RSVP Yes)':'Cancel class (X + RSVP No)'}</button>${e.cancelled ? `<button class=\"btn ghost block\" style=\"margin-top:8px;color:#9A4330\" onclick=\"if(confirm('Cancel every later ${esc(st.toLocaleDateString('en-GB',{weekday:'long'}))} ${tm(e.start)} class of this package too? They stay on the calendar with X + RSVP No.')){window._cxStop=1;sendEdit(${i},'cancel','${src}')}\">Stop this schedule · cancel every later ${esc(st.toLocaleDateString('en-GB',{weekday:'long'}))} ${tm(e.start)}</button>` : ''}"
],
[
"forward: action==='move' && !!($('eFw') && $('eFw').checked),",
"forward: action==='move' ? !!($('eFw') && $('eFw').checked) : action==='cancel' && (!!($('eStop') && $('eStop').checked) || !!window._cxStop),"
],
[
"if(action==='move' && !/^([01]?\\d|2[0-3]):[0-5]\\d$/.test(f.time)) return toast('Choose a time');",
"if(action==='move' && !/^([01]?\\d|2[0-3]):[0-5]\\d$/.test(f.time)) return toast('Choose a time');\nwindow._cxStop = 0; if(action==='cancel' && e.cancelled && !f.reason) f.reason = cxSplit(e.why).r;"
]
]);
