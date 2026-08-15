let files = [];
let coverFile = null;

const $ = id => document.getElementById(id);

const WORKER_URL =
  "https://manga-cms-api.ghazaalbaloch2.workers.dev/publish";


/* =========================
   COVER
========================= */

$("cover").onchange = e => {

  coverFile = e.target.files[0] || null;

  $("coverFile").textContent =
    coverFile
      ? `Cover: ${coverFile.name}`
      : "Select one cover image";
};


/* =========================
   CHAPTER IMAGES
========================= */

$("images").onchange = e => {

  files = [...e.target.files];

  $("files").innerHTML =
    files.length
      ? files
          .map((file, index) =>
            `${index + 1}. ${escapeHTML(file.name)}`
          )
          .join("<br>")
      : "Select images";
};


/* =========================
   PUBLISH
========================= */

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


  /* Validation */

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


  const button =
    $("go");

  const out =
    $("out");


  button.disabled = true;

  button.textContent =
    "⏳ Uploading...";


  out.innerHTML =
    "Uploading to GitHub...<br><br>Please wait.";


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


    /* Cover */

    formData.append(
      "cover",
      coverFile,
      coverFile.name
    );


    /* Chapter images */

    files.forEach(file => {

      formData.append(
        "images",
        file,
        file.name
      );

    });


    /* Send to Cloudflare */

    const response =
      await fetch(
        WORKER_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const text =
      await response.text();


    let result;

    try {

      result =
        JSON.parse(text);

    } catch {

      throw new Error(
        `Worker returned invalid response: ${text}`
      );

    }


    if (
      !response.ok ||
      !result.success
    ) {

      throw new Error(
        result.error ||
        `Upload failed. HTTP ${response.status}`
      );

    }


    /* Success */

    out.innerHTML = `

      <b>✅ Published Successfully!</b>

      <br><br>

      <b>Slug:</b><br>

      <code>
      ${escapeHTML(result.slug)}
      </code>

      <br><br>

      <b>Chapter HTML:</b><br>

      <code>
      ${escapeHTML(result.html)}
      </code>

      <br><br>

      <b>Cover:</b><br>

      <code>
      ${escapeHTML(result.cover)}
      </code>

      <br><br>

      <b>Chapter Images:</b>

      <br>

      ${result.images
        .map(
          image =>
            `<code>${escapeHTML(image)}</code>`
        )
        .join("<br>")}

      <br><br>

      <b>GitHub updated successfully.</b>

    `;


  } catch(error) {

    console.error(
      "Publisher error:",
      error
    );


    out.innerHTML = `

      <b style="color:#ff7777">
      ❌ Upload Failed
      </b>

      <br><br>

      <b>Error:</b>

      <br>

      ${escapeHTML(
        error.message ||
        String(error)
      )}

    `;

  } finally {

    button.disabled =
      false;

    button.textContent =
      "🚀 Generate / Update Files";

  }

};


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character])
    );

}
