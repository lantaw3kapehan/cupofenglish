// 15 Oct night · "A week" column a little wider (no wrapping next to the date); a student with no classes in the
// records says so instead of "new".
require('../tools/lib.js')(process.argv[2], [
["grid-template-columns:minmax(0,1fr) 84px 110px 118px 130px!important", "grid-template-columns:minmax(0,1fr) 84px 104px 168px 124px!important"],
["'<span class=\"sa-w new\"><b>new</b><small>no full month yet</small></span>'", "'<span class=\"sa-w new\"><b>—</b><small>no classes on record</small></span>'"],
]);
