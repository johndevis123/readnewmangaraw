let files = [];
let coverFile = null;

const $ = id => document.getElementById(id);

const WORKER_URL =
  "https://manga-cms-api.ghazaalbaloch2.workers.dev/publish";

$("cover").onchange = e => {

  coverFile =
    e.target.files[0] || null;

  $("coverFile").innerHTML =
    coverFile
      ? `Cover: ${coverFile.name}`
      : "Select one cover image";
};


$("images").onchange = e => {

  files =
    [...e.target.files];

  $("files").innerHTML =
    files.length
      ? files
          .map((f, i) =>
            `${i + 1}. ${f.name}`
          )
          .join("<br>")
      : "Select images";
};


$("go").onclick = async () => {

  const manga =
    $("manga").value.trim();

  const chapter =
    $("chapter").value.trim();

  const title =
    $("title").value.trim() ||
    `${manga} Raw ${chapter}`;

  const genre =
    $("genre").value;

  const rating =
    $("rating").value;

  const mode =
    $("mode").value;

  const oldslug =
    $("oldslug").value.trim();


  if (
    !manga ||
    !chapter ||
    !coverFile ||
    !files.length
  ) {

    $("out").textContent =
      "Please enter Manga Title, Chapter Number, select a Cover Image, and select Chapter Images.";

    return;
  }


  const out =
    $("out");

  const button =
    $("go");


  button.disabled =
    true;

  button.textContent =
    "⏳ Uploading...";


  out.innerHTML =
    "Uploading files to GitHub...<br><br>Please wait.";


  try {

    const formData =
      new FormData();


    formData.append(
      "manga",
      manga
    );

    formData.append(
      "chapter",
      chapter
    );

    formData.append(
      "title",
      title
    );

    formData.append(
      "genre",
      genre
    );

    formData.append(
      "rating",
      rating
    );

    formData.append(
      "mode",
      mode
    );

    formData.append(
      "oldslug",
      oldslug
    );


    formData.append(
      "cover",
      coverFile,
      coverFile.name
    );


    files.forEach(file => {

      formData.append(
        "images",
        file,
        file.name
      );

    });


    const response =
      await fetch(
        WORKER_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();


    if (!response.ok ||
        !result.success) {

      throw new Error(
        result.error ||
        `Upload failed (${response.status})`
      );

    }


    out.innerHTML = `

<b>✅ Published Successfully!</b>

<br><br>

<b>Slug:</b>
<code>${escapeHTML(result.slug)}</code>

<br><br>

<b>Chapter HTML:</b>
<code>${escapeHTML(result.html)}</code>

<br><br>

<b>Cover:</b>
<code>${escapeHTML(result.cover)}</code>

<br><br>

<b>Chapter Images:</b>
<br>

${result.images
  .map(
    x =>
      `<code>${escapeHTML(x)}</code>`
  )
  .join("<br>")}

<br><br>

GitHub has been updated successfully.

`;

  } catch(error) {

    console.error(error);

    out.innerHTML = `

<b style="color:#ff7777">
❌ Upload Failed
</b>

<br><br>

${escapeHTML(
  error.message ||
  String(error)
)}

<br><br>

Please check the Worker and GitHub settings.

`;

  } finally {

    button.disabled =
      false;

    button.textContent =
      "🚀 Generate / Update Files";

  }

};


function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[m])
    );

}
