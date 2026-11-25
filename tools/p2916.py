p='tools/b2911.js'; s=open(p).read()
def R(a,b,n=1):
  global s
  assert s.count(a)==n, (s.count(a), a[:90]); s=s.replace(a,b)

# ---- Title Case for every label ----
R("'Teachers check their pay', pm + ' pay opens for checking', { s: 'Pay check opens' }","'Teachers Check Their Pay', pm + ' pay opens for checking.', { s: 'Pay Check Opens' }")
R("'Pay day', pm + ' salaries', { due: 1, s: 'Pay day' }","'Pay Day', pm + ' salaries.', { due: 1, s: 'Pay Day' }")
R("'Monthly feedback due', pm + ' reports to parents', { due: 1, s: 'Feedback due' }","'Monthly Feedback Due', pm + ' reports to parents.', { due: 1, s: 'Feedback Due' }")
R("'Monthly feedback opens', tm + ' reports', { s: 'Feedback opens' }","'Monthly Feedback Opens', tm + ' reports.', { s: 'Feedback Opens' }")
R("'13th month pay', 'By 24 December', { due: 1, s: '13th month' }","'13th Month Pay', 'By 24 December.', { due: 1, s: '13th Month' }")
R("s: 'Gov dues' }","s: 'Gov Dues' }",2)
R("'Sunday class incentive starts', 'First Sunday counted', { s: 'Sunday incentive' }","'Sunday Class Incentive Starts', 'The first Sunday counted.', { s: 'Sunday Incentive' }")
R("add(x.day, 'memo', 'Memo sent', x.subject, { s: 'Memo' })","add(x.day, 'memo', 'Memo Sent', x.subject, { s: 'Memo' })")
R("x.name + ' · package ends'","x.name + '’s Package Ends'")
R("s: x.name + ' ends' }","s: x.name + ' Ends' }")
R("x.s.replace(/ ends$/, '')","x.s.replace(/ Ends$/, '')")
R("'Holiday in China'","'Holiday in China.'") if "'Holiday in China'" in s else None
R("'Not recorded'","'Not Recorded'",2) if s.count("'Not recorded'")==2 else None
R("'Nothing past and undone'","'Nothing past and undone.'") if "'Nothing past and undone'" in s else None
R(">Show the month</a>",">Show the Month</a>")
R("'No class booked'","'No class booked yet'") if "'No class booked'" in s else None
R("<small>units left</small></div></div>'; }).join('') + '</div>';","<small>Units Left</small></div></div>'; }).join('') + '</div>';")
R("<small>units left</small></span></button>","<small>Units Left</small></span></button>")
R("'Active</span>'","'Active</span>'") if False else None
R("['all', 'All', F.list.length], ['sib', 'Siblings', sib.length]","['all', 'All', F.list.length], ['sib', 'Siblings', sib.length]")
R("x11-tb x11-back\" style=\"margin-bottom:10px\" onclick=\"fam2911.back()\">' + IC.l + ' All families</button>","x11-tb x11-back\" style=\"margin-bottom:10px\" onclick=\"fam2911.back()\">' + IC.l + ' All Families</button>")
R("x11-st ' + x.st[0] + '\">' + E(x.st[1] === 'Not Recorded' ? 'Overdue' : x.st[1]) + '</span>'","x11-st ' + x.st[0] + '\">' + E(x.st[1] === 'Not Recorded' ? 'Overdue' : x.st[1]) + '</span>'") if "x.st[1] === 'Not Recorded'" in s else R("x.st[1] === 'Not recorded'","x.st[1] === 'Not Recorded'")
R("'Saved'","'Saved'")

# ---- one chip style everywhere (the Birthday / New Book look): white, light grey outline, coloured icon and words ----
R("""    '.x11-back{display:none;""","""    /* 2916 (Misty 16:37): every chip and tag uses the Birthday / New Book look */
    '.x11-chip,#v-mcal .x11-chip,#v-families .x11-chip,#v-families .x11-chip:not(.off),#v-families .x11-chip.off{background:#fff!important;border:1px solid #E4E2EC!important;border-radius:999px;padding:5px 13px;font-size:13.5px;font-weight:600;display:inline-flex;align-items:center;gap:6px;box-shadow:none;opacity:1}',
    '.x11-chip svg{width:15px;height:15px;flex:none}.x11-chip i{display:none!important}#v-mcal .x11-chip.off{opacity:.4}',
    '#v-families .x11-chip.off{color:#6F6B85!important}#v-families .x11-chip.off small{color:#8A879C!important}#v-families .x11-chip:not(.off){color:#0E6F68!important;border-color:#9ADDE3!important}#v-families .x11-chip:not(.off) small{color:#0E6F68!important}',
    '.x11-tag,.x11-low,.x11-st{background:#fff!important;border:1px solid #E4E2EC;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:600}',
    '.x11-tag{color:#0E6F68}.x11-tag.g{color:#3C3489}.x11-low{color:#9A5512}.x11-st.ok{color:#1D7A52}.x11-st.late{color:#B4472F}.x11-st.soon{color:#9A5512}',
    '.x11-back{display:none;""")
# filter chips: kind icon + label + count, coloured words on white
R("""'" style="background:' + KIND[k].bg + ';color:' + KIND[k].c + '" onclick="dl2911.tg(\\'' + k + '\\')"><i style="background:' + KIND[k].c + '"></i>' + KIND[k].l + ' ' + n + '</button>';""",
  """'" style="color:' + KIND[k].c + '" onclick="dl2911.tg(\\'' + k + '\\')">' + KI[k] + KIND[k].l + ' ' + n + '</button>';""")
open(p,'w').write(s); print('ok')
