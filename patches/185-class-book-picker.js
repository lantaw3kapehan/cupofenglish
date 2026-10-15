// 15 Oct · New class › Book / course: tapping the field shows EVERY book (it showed only the ones matching the book
// already filled in), and "A1, DKEnglish Level1"-style entries (level + book) are shown as the book alone.
require('../tools/lib.js')(process.argv[2], [
["const classBooks = () => { const seen = {}, out = []; const add = b => { b = String(b || '').trim().replace(/\\s+/g, '');",
 "const bookOnly = b => { b = String(b || '').trim(); const m = b.match(/^(pre-?a1|a1|a2|b1|b2|c1|c2)\\s*[,·]\\s*(.+)$/i); return m ? m[2].trim() : b; };\nconst classBooks = () => { const seen = {}, out = []; const add = b => { b = bookOnly(b).replace(/\\s+/g, '');"],
["<input id=\"cB\" class=\"in-t\" list=\"cBL\" placeholder=\"Tap to pick · ShortVowels\" oninput=\"classPrev()\" autocomplete=\"off\">",
 "<input id=\"cB\" class=\"in-t\" list=\"cBL\" placeholder=\"Tap to pick · ShortVowels\" oninput=\"classPrev()\" onfocus=\"if(this.value){this.dataset.was=this.value;this.placeholder=this.value;this.value=''}\" onblur=\"if(!this.value&&this.dataset.was){this.value=this.dataset.was}this.dataset.was='';this.placeholder='Tap to pick · ShortVowels';classPrev()\" autocomplete=\"off\">"],
["$('cB').value = s.book || ''; if(!CHIST", "$('cB').value = bookOnly(s.book).replace(/\\s+/g, ''); if(!CHIST"],
]);
