// 15 Oct night · Payroll (patch 204) tidy: the month-now list keeps the phone layout, the header says which month is on top, and the September-only filter chips step aside while September is all paid.
require('../tools/lib.js')(process.argv[2], [
[".py-cur .py-row{grid-template-columns:44px minmax(0,1.4fr) 140px 150px!important}", "@media(min-width:901px){.py-cur .py-row{grid-template-columns:44px minmax(0,1.4fr) 140px 150px!important}}\n.py-now .py-chips{display:none}"],
["      const hero = v.querySelector('.py-hero');\n", "      const hero = v.querySelector('.py-hero'); v.classList.add('py-now'); const sub = v.querySelector('.py-top .sub'); if(sub) sub.textContent = C.label + ' so far · from the PAYROLL tab · ' + ((MO && MO.payMonth) || 'last month') + ' all paid';\n"],
["    }catch(e){ console.warn('payroll current month', e); }", "    }catch(e){ console.warn('payroll current month', e); }\n    finally{ try{ const v = $('v-payroll'); if(v && !$('pyCur')) v.classList.remove('py-now'); }catch(e){} }"],
]);
