const manga = [
 {t:"ワンピース",c:"第1191話",g:"アクション",v:"125.4K",r:"9.6",color:"red"},
 {t:"ブルーロック",c:"第338話",g:"スポーツ",v:"98.7K",r:"9.5",color:"blue"},
 {t:"キングダム",c:"第884話",g:"歴史・戦争",v:"89.3K",r:"9.4",color:"brown"},
 {t:"チェンソーマン",c:"第192話",g:"アクション",v:"76.2K",r:"9.3",color:"red"},
 {t:"呪術廻戦 モジュロ",c:"第24話",g:"SF・ダークファンタジー",v:"69.8K",r:"9.4",color:"purple"},
 {t:"サカモトデイズ",c:"第269話",g:"アクション",v:"65.1K",r:"9.2",color:"green"},
 {t:"アオのハコ",c:"第232話",g:"恋愛",v:"58.7K",r:"8.9",color:"pink"},
 {t:"薫る花は凛と咲く",c:"第180話",g:"恋愛・学園",v:"47.3K",r:"8.8",color:"violet"},
 {t:"ダンダダン",c:"第188話",g:"SF・オカルト",v:"52.6K",r:"9.1",color:"darkred"},
 {t:"カグラバチ",c:"第110話",g:"アクション・ファンタジー",v:"49.2K",r:"9.0",color:"navy"}
];

const ranking = [
 {t:"ワンピース",g:"アクション・冒険",r:"9.6",v:"1.2M",color:"red"},
 {t:"ブルーロック",g:"スポーツ",r:"9.5",v:"980K",color:"blue"},
 {t:"キングダム",g:"歴史・戦争",r:"9.4",v:"862K",color:"brown"},
 {t:"チェンソーマン",g:"アクション・ダーク",r:"9.3",v:"754K",color:"red"},
 {t:"呪術廻戦 モジュロ",g:"ダークファンタジー",r:"9.4",v:"698K",color:"purple"}
];

const colorMap={red:"#7e1c27",blue:"#174e82",brown:"#654126",purple:"#4e2b73",green:"#1d5b4a",pink:"#914d63",violet:"#593b83",darkred:"#6e2020",navy:"#173d67"};

function cover(title,color){
 return `<div class="cover" style="background:linear-gradient(145deg,${colorMap[color]||"#173d67"},#08111e)">
   <span class="badge">13時間前</span><span class="heart">♡</span>
   <span class="cover-title">${title}</span>
 </div>`;
}
function renderManga(list=manga){
 document.getElementById("mangaGrid").innerHTML=list.map(m=>`
  <article class="card" data-genre="${m.g}">
   ${cover(m.t,m.color)}
   <div class="card-body"><div class="card-title">${m.t}</div>
   <div class="chapter">${m.c}</div>
   <div class="stats"><span>◉ ${m.v}</span><span class="rating">★ ${m.r}</span></div></div>
  </article>`).join("");
}
document.getElementById("rankingList").innerHTML=ranking.map((m,i)=>`
 <div class="rank-item"><div class="rank-num">${i+1}</div>
 <div class="rank-cover" style="background:${colorMap[m.color]}">${m.t}</div>
 <div><div class="rank-name">${m.t}</div><div class="rank-genre">ジャンル：${m.g}</div><div class="rank-meta">★ ${m.r}　 ◉ ${m.v}</div></div></div>`).join("");

renderManga();

document.querySelectorAll(".genre-tabs button").forEach(btn=>{
 btn.addEventListener("click",()=>{
   document.querySelectorAll(".genre-tabs button").forEach(b=>b.classList.remove("selected"));
   btn.classList.add("selected");
   const f=btn.dataset.filter;
   renderManga(f==="all"?manga:manga.filter(x=>x.g.includes(f)));
 });
});

document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.trim();
 renderManga(q?manga.filter(x=>(x.t+x.c+x.g).includes(q)):manga);
});

document.getElementById("themeBtn").addEventListener("click",()=>{
 document.body.classList.toggle("light-preview");
});
document.getElementById("topBtn").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
