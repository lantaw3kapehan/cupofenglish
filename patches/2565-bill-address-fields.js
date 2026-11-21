// 2565 (Misty 21 Nov 10:56): the payment confirmation address follows the template, one line each: City / Province / Country
// ("Jinan City,\nShandong Province,\nChina"). Three boxes instead of one free box; typing a known Chinese city fills its province
// and China (still editable). Beijing, Shanghai, Tianjin and Chongqing have no province line.
const file = process.argv[2];
const helper = `<script id="b2565">
/* 21 Nov · 2565 · Bill-to address in three parts (City · Province · Country) */
(function(){
  var P = { Shandong: 'Jinan Qingdao Yantai Weifang Zibo Linyi Jining Weihai Tai\\'an Dezhou Liaocheng Binzhou Heze Rizhao Zaozhuang Dongying',
    Guangdong: 'Guangzhou Shenzhen Dongguan Foshan Zhuhai Zhongshan Huizhou Jiangmen Shantou Zhanjiang Zhaoqing Maoming Qingyuan Shaoguan Meizhou Jieyang Chaozhou Yangjiang Heyuan Shanwei Yunfu',
    Jiangsu: 'Nanjing Suzhou Wuxi Changzhou Nantong Xuzhou Yangzhou Yancheng Zhenjiang Huai\\'an Lianyungang Suqian',
    Zhejiang: 'Hangzhou Ningbo Wenzhou Shaoxing Jiaxing Huzhou Jinhua Lishui Quzhou Zhoushan', Anhui: 'Hefei Wuhu Bengbu Anqing Fuyang Huainan Ma\\'anshan Huangshan',
    Fujian: 'Fuzhou Xiamen Quanzhou Zhangzhou Putian', Henan: 'Zhengzhou Luoyang Kaifeng Xinxiang Nanyang Anyang', Hebei: 'Shijiazhuang Tangshan Baoding Langfang Handan Qinhuangdao Cangzhou',
    Hubei: 'Wuhan Yichang Xiangyang Jingzhou', Hunan: 'Changsha Zhuzhou Xiangtan Hengyang Yueyang Changde', Jiangxi: 'Nanchang Ganzhou Jiujiang',
    Sichuan: 'Chengdu Mianyang Deyang Yibin Nanchong Leshan Luzhou', Yunnan: 'Kunming Dali Lijiang Qujing', Guizhou: 'Guiyang Zunyi', Shaanxi: 'Xi\\'an Xianyang Baoji',
    Shanxi: 'Taiyuan Datong', Liaoning: 'Shenyang Dalian Anshan', Jilin: 'Changchun', Heilongjiang: 'Harbin Daqing', Gansu: 'Lanzhou', Qinghai: 'Xining', Hainan: 'Haikou Sanya' };
  var R = { 'Inner Mongolia Autonomous Region': 'Hohhot Baotou Ordos Chifeng', 'Guangxi Zhuang Autonomous Region': 'Nanning Guilin Liuzhou', 'Ningxia Hui Autonomous Region': 'Yinchuan',
    'Xinjiang Uygur Autonomous Region': 'Urumqi', 'Tibet Autonomous Region': 'Lhasa' };
  var M = {}; Object.keys(P).forEach(function(p){ P[p].split(' ').forEach(function(c){ M[c.toLowerCase()] = p + ' Province'; }); });
  Object.keys(R).forEach(function(p){ R[p].split(' ').forEach(function(c){ M[c.toLowerCase()] = p; }); });
  ['Beijing', 'Shanghai', 'Tianjin', 'Chongqing'].forEach(function(c){ M[c.toLowerCase()] = ''; });   /* municipalities: no province */
  window.CITY2565 = Object.keys(M).sort().map(function(k){ return k.replace(/(^|[\\s'])[a-z]/g, function(x){ return x.toUpperCase(); }); });
  var cut = function(s){ return String(s || '').replace(/\\s+/g, ' ').trim().replace(/,$/, '').trim(); };
  window.addrSplit2565 = function(a){ var L = String(a || '').split(/\\n|,/).map(cut).filter(Boolean), o = { city: '', prov: '', country: '' }; if(!L.length) return o;
    o.city = L[0].replace(/\\s+City$/i, ''); if(L.length === 2){ if(/Province|Region|SAR/i.test(L[1])) o.prov = L[1]; else o.country = L[1]; } else if(L.length > 2){ o.prov = L[1]; o.country = L.slice(2).join(', '); } return o; };
  window.addrJoin2565 = function(o){ var c = cut(o.city).replace(/\\s+City$/i, ''), p = cut(o.prov), n = cut(o.country); if(!c && !p && !n) return '';
    return [c ? c + ' City' : '', p, n].filter(Boolean).join(',\\n'); };
  window.addrCity2565 = function(v){ var k = cut(v).replace(/\\s+City$/i, '').toLowerCase(); return Object.prototype.hasOwnProperty.call(M, k) ? { prov: M[k], country: 'China' } : null; };
})();
</script>
`;
require('../tools/lib.js')(file, [
  [`  <label>Address</label><textarea class="in-t" rows="2" oninput="ivSet('bill_addr',this.value)" placeholder="Jinan City, Shandong Province,&#10;China">\${e(S.bill_addr)}</textarea>`,
   `  \${(() => { const A = window.addrSplit2565 ? addrSplit2565(S.bill_addr) : { city: '', prov: '', country: '' };   /* 2565: City · Province · Country, one line each */
      return \`<label>Address <span class="mute small">· one line each: City · Province · Country</span></label>
  <div class="row2" style="grid-template-columns:1fr 1fr 1fr"><div><input id="ivAC" class="in-t" list="ivACL" value="\${e(A.city)}" placeholder="City · Jinan" oninput="ivAddr2565(1)"></div><div><input id="ivAP" class="in-t" value="\${e(A.prov)}" placeholder="Province · Shandong Province" oninput="ivAddr2565()"></div><div><input id="ivAN" class="in-t" value="\${e(A.country)}" placeholder="Country · China" oninput="ivAddr2565()"></div></div>
  <datalist id="ivACL">\${(window.CITY2565 || []).map(c => '<option value="' + c + '">').join('')}</datalist>
  <div class="small mute" style="margin-top:4px">Shown as: <span id="ivAS" style="white-space:pre-line;color:var(--ink)">\${e(S.bill_addr || '—')}</span> · Beijing, Shanghai, Tianjin and Chongqing have no province.</div>\`; })()}`],
  ["window.ivSet = (k, v, re) => { S[k] = v; S.dirty = 1; if(re) redraw(); else preview(); if(k === 'email') goUpd(); };",
   "window.ivSet = (k, v, re) => { S[k] = v; S.dirty = 1; if(re) redraw(); else preview(); if(k === 'email') goUpd(); };\nwindow.ivAddr2565 = function(city){ const g = id => document.getElementById(id), C = g('ivAC'), Pv = g('ivAP'), N = g('ivAN'); if(!C || !Pv || !N) return;   /* 2565 */\n  if(city && window.addrCity2565){ const h = addrCity2565(C.value); if(h){ if(!Pv.dataset.typed) Pv.value = h.prov; if(!N.dataset.typed) N.value = h.country; } } else if(!city){ const a = document.activeElement; if(a === Pv || a === N) a.dataset.typed = a.value ? '1' : ''; }\n  const v = addrJoin2565({ city: C.value, prov: Pv.value, country: N.value }), s = g('ivAS'); if(s) s.textContent = v || '—'; ivSet('bill_addr', v); };"],
  ['<script id="b2278">', helper + '<script id="b2278">'],
]);
