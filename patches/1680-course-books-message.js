// 1680: (Misty, 31 Oct 23:10) "Like for Lucy, she just enrolled so we wanted to say that" — the Course Books picture gets a
//   ready message to send with it, in English and Chinese, and the right one is chosen by itself:
//   · New student (first regular class in the last 30 days or still to come): welcome + the books to prepare.
//   · New book (just saved with Change book): moving on to the new book + the new books to prepare.
//   · Otherwise: the books used in class.
//   Adults (Students list learner type "Adults") are written to directly ("you"). A small switch changes the kind; Copy message.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.swMine1676 = ",
   "  /* 1680 · Course Books: a message to send with the picture */\n" +
   "  try{ let ctx1680 = { t: 0 }, last1680 = null;\n" +
   "    const _api1680 = window.api; if(_api1680) window.api = function(fn){ const p = _api1680.apply(this, arguments); if(fn === 'mgmtSetBook') Promise.resolve(p).then(r => { if(r && r.ok && !r.same) ctx1680 = { t: Date.now(), code: arguments[2] }; }).catch(() => {}); return p; };\n" +
   "    const _bb1680 = window.bbOpen; if(_bb1680) window.bbOpen = function(book, en, cn){ last1680 = { book: String(book || ''), en: String(en || ''), code: STU && STU.code || '' }; return _bb1680.apply(this, arguments); };\n" +
   "    const kind1680 = () => { const code = last1680 && last1680.code; if(Date.now() - ctx1680.t < 60000) return 'book';\n" +
   "      try{ const L = (STU && STU.code === code && Array.isArray(STU.cls) ? STU.cls : []).filter(c => c && !c.cancelled && !/-TC\\b|trial/i.test(String(c.title || ''))).map(c => +new Date(c.start)).sort((a, b) => a - b);\n" +
   "        if(L.length && L[0] > Date.now() - 30 * 864e5) return 'new'; }catch(e){} return 'cur'; };\n" +
   "    const adult1680 = () => { try{ const c = last1680 && last1680.code; const s = ((typeof MS !== 'undefined' && MS) || []).find(x => x.code === c) || (STU && STU.s) || {}; return s.adult === true || s.band === 'adult'; }catch(e){ return false; } };\n" +
   "    const msg1680 = (k, title) => { const nm = (last1680 && last1680.en) || '', ad = adult1680(), bk = title || (last1680 && last1680.book) || '';\n" +
   "      if(ad){ const hi = 'Hello' + (nm ? ' ' + nm : '') + '! ', hz = (nm ? nm : '') + '您好！';\n" +
   "        if(k === 'new') return hi + 'Welcome to CupOfEnglish 🎉 You will start with ' + bk + '. Please prepare the books in the picture. You can buy them on Taobao: search the words on the picture, or photo-search the cover (拍立淘). Please check the cover and the edition. See you in class! 😊\\n\\n' + hz + '欢迎加入一杯英语🎉 您将从《' + bk + '》开始学习。请准备图中的教材，可在淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索。请认准封面和版本。课堂上见！😊';\n" +
   "        if(k === 'book') return hi + 'Great news 🎉 You are moving on to ' + bk + '. Please prepare the new books in the picture (Taobao: search the words on the picture, or photo-search the cover). Please check the cover and the edition. Thank you! 😊\\n\\n' + hz + '好消息🎉 您即将开始学习《' + bk + '》。请准备图中的新教材（淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索）。请认准封面和版本。谢谢！😊';\n" +
   "        return hi + 'Here are the books we use in class: ' + bk + '. You can find them on Taobao by the words on the picture, or by photo-searching the cover. Thank you! 😊\\n\\n' + hz + '这是我们课堂使用的教材：《' + bk + '》。可在淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索。谢谢！😊'; }\n" +
   "      const who = nm || 'your child', whz = nm || '孩子';\n" +
   "      if(k === 'new') return 'Hello! Welcome to CupOfEnglish 🎉 ' + who + ' will start with ' + bk + '. Please prepare the books in the picture before the first class if you can. You can buy them on Taobao: search the words on the picture, or photo-search the cover (拍立淘). Please check the cover and the edition. Thank you! 😊\\n\\n您好！欢迎加入一杯英语🎉 ' + whz + '将从《' + bk + '》开始学习。如方便，请在第一节课前准备好图中的教材，可在淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索。请认准封面和版本。谢谢！😊';\n" +
   "      if(k === 'book') return 'Hello! Great news 🎉 ' + who + ' is moving on to ' + bk + '. Please prepare the new books in the picture. You can buy them on Taobao: search the words on the picture, or photo-search the cover (拍立淘). Please check the cover and the edition. Thank you! 😊\\n\\n您好！好消息🎉 ' + whz + '即将开始学习《' + bk + '》。请准备图中的新教材，可在淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索。请认准封面和版本。谢谢！😊';\n" +
   "      return 'Hello! Here are the books ' + who + ' uses in class: ' + bk + '. You can find them on Taobao by the words on the picture, or by photo-searching the cover (拍立淘). Thank you! 😊\\n\\n您好！这是' + whz + '课堂使用的教材：《' + bk + '》。可在淘宝搜索图片上的关键词，或用「拍立淘」拍封面搜索。谢谢！😊'; };\n" +
   "    let T1680 = '';\n" +
   "    window.bbMsg1680 = k => { const ta = $('bbM1680'); if(ta) ta.value = msg1680(k, T1680); document.querySelectorAll('#bbK1680 button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); };\n" +
   "    window.bbMsgCopy1680 = () => { const ta = $('bbM1680'); if(!ta) return; const v = ta.value; (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast('Message copied · paste it in the class WeChat group'), () => { ta.select(); try{ document.execCommand('copy'); toast('Message copied'); }catch(e){ toast('Select the message and copy it'); } }); };\n" +
   "    const _os1680 = window.openSheet; if(_os1680) window.openSheet = function(html){ try{ if(typeof html === 'string' && html.indexOf('<h1>Course Books</h1>') === 0 && html.indexOf('bbGive()') > -1 && last1680 && D && D.mgr){\n" +
   "        const m = html.match(/<div class=\"mute small\">([\\s\\S]*?) · send it/); const tmp = document.createElement('div'); tmp.innerHTML = m ? m[1] : ''; T1680 = (tmp.textContent || '').trim() || last1680.book;\n" +
   "        const k = kind1680(), seg = [['new', 'New student'], ['book', 'New book'], ['cur', 'Current books']];\n" +
   "        html += '<h2 style=\"margin-top:16px\">Message to send with it</h2><div class=\"seg\" id=\"bbK1680\" style=\"margin-top:6px\">' + seg.map(x => '<button type=\"button\" data-k=\"' + x[0] + '\" class=\"' + (x[0] === k ? 'on' : '') + '\" onclick=\"bbMsg1680(\\'' + x[0] + '\\')\">' + x[1] + '</button>').join('') + '</div>' +\n" +
   "          '<textarea id=\"bbM1680\" class=\"in-t\" rows=\"8\" style=\"width:100%;margin-top:8px;font-size:13px;line-height:1.5\">' + esc(msg1680(k, T1680)) + '</textarea>' +\n" +
   "          '<button type=\"button\" class=\"btn teal block\" style=\"margin-top:8px\" onclick=\"bbMsgCopy1680()\">Copy message</button><div class=\"small mute\" style=\"margin-top:4px\">You can change the words before copying · send the picture and the message in the class WeChat group.</div>'; } }catch(e){}\n" +
   "      return _os1680.apply(this, arguments.length ? [html].concat([].slice.call(arguments, 1)) : arguments); }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
