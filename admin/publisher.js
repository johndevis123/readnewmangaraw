let files = [];

const $ = id => document.getElementById(id);

const esc = s => String(s).replace(/[&<>"']/g, m => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[m]));

$("images").onchange = e => {
  files = [...e.target.files];

  $("files").innerHTML = files.length
    ? files.map((f, i) => `${i + 1}. ${f.name}`).join("<br>")
    : "Select images";
};

function slug(s) {
  return s
    .trim()
    .replace(/[^a-zA-Z0-9一-龯ぁ-んァ-ン]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

$("go").onclick = () => {

  const manga = $("manga").value.trim();
  const ch = $("chapter").value.trim();

  const title =
    $("title").value.trim() ||
    `${manga} Raw ${ch}`;

  const genre = $("genre").value;
  const rating = $("rating").value;
  const mode = $("mode").value;
  const old = $("oldslug").value.trim();

  if (!manga || !ch || !files.length) {
    $("out").textContent =
      "Please enter Manga Title, Chapter Number, and select images.";
    return;
  }

  const s =
    mode === "update" && old
      ? slug(old)
      : slug(`${manga}-${ch}`);

  const imgs = files.map((f, i) =>
    `images/${s}/page-${String(i + 1).padStart(2, "0")}.${(f.name.split(".").pop() || "jpg").toLowerCase()}`
  );

  const post = {
    slug: s,
    title: title,
    manga: manga,
    chapter: ch,
    genre: genre,
    rating: rating,
    views: "0",
    images: imgs
  };

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="../../style.css">
</head>

<body>

<header>
<div class="wrap nav">

<a class="brand" href="../../index.html">
◈ ReadNew<span>MangaRaw</span>
</a>

</div>
</header>

<main class="wrap"
style="display:block;max-width:1050px;margin-top:28px">

<section class="panel">

<div class="heading">

<h1>${esc(title)}</h1>

<p>
${esc(manga)}
　
${esc(ch)}
　
·
　
${esc(genre)}
</p>

</div>

<div style="padding:18px">

${files.map((f, i) => `

<figure
style="margin:0 0 18px;text-align:center">

<img
src="../../${imgs[i]}"
alt="${esc(title)} - Page ${i + 1}"
loading="lazy"
style="max-width:100%;height:auto;border-radius:7px">

<figcaption
style="font-size:11px;color:#8197ae">

${esc(title)} - Page ${i + 1}

</figcaption>

</figure>

`).join("")}

</div>

</section>

</main>

<footer>

<div class="copy">
© 2026 ReadNewMangaRaw
</div>

</footer>

</body>
</html>`;

  download(
    `${s}.html`,
    html,
    "text/html"
  );

  download(
    `${s}-post.json`,
    JSON.stringify(post, null, 2),
    "application/json"
  );

  $("out").innerHTML = `
    <b>Files generated / updated successfully.</b>
    <br><br>

    HTML:
    <code>${s}.html</code>

    <br>

    JSON:
    <code>${s}-post.json</code>

    <br><br>

    Images:
    <code>images/${s}/</code>

    <br><br>

    <b>ALT text:</b>
    ${esc(title)} - Page 1, Page 2, Page 3 ...
  `;
};

function download(name, data, type) {

  const blob = new Blob(
    [data],
    { type: type }
  );

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = name;

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(a.href);
  }, 1000);
}
