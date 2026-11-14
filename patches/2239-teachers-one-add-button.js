// 2239: Teachers page showed "Add teacher / staff" twice (top of the page and the TEAM & ACCESS header far below).
// The top button stays; the second one hides while the top one is on the page.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["\n</body>\n</html>", "\n<style id=\"d2239\">#v-teachers:has(#as40Add) .as40-hd > button[onclick=\"AS40.form(0)\"]{display:none}</style>\n</body>\n</html>"]]);
