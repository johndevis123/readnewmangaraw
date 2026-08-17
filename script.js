let posts = [];

const esc = s =>
  String(s ?? "").replace(
    /[&<>"']/g,
    m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m])
  );


/* =========================================
   LOAD POSTS
========================================= */

async function load() {

  try {

    const r = await fetch(
      "data/posts.json?v=" + Date.now(),
      {
        cache: "no-store"
      }
    );

    if (!r.ok) {
      throw new Error(
        "Failed to load posts.json: " + r.status
      );
    }

    const data = await r.json();

    posts = Array.isArray(data.posts)
      ? data.posts
      : [];

  } catch (e) {

    console.error("Posts loading error:", e);

    posts = [];

  }

  render(posts);
}


/* =========================================
   RENDER
========================================= */

function render(list) {

  const latest =
    document.querySelector("#latest");

  if (!latest) {
    console.error("#latest not found");
    return;
  }


  latest.innerHTML =

    list.map((p, i) => {

      const slug =
        String(p.slug || "");


      return `

        <article
          class="card"
          data-slug="${esc(slug)}"
          style="cursor:pointer"
        >

          <div
            class="cover"
            style="
              background:linear-gradient(
                145deg,
                #${["71323e","174e82","68452a","4b2a70"][i % 4]},
                #071321
              )
            "
          >

            ${
              p.cover
                ? `
                  <img
                    src="${esc(p.cover)}"
                    alt="${esc(p.title)}"
                    loading="lazy"
                    decoding="async"
                  >
                `
                : `
                  <div class="cover-placeholder">
                    ${esc(p.manga || p.title)}
                  </div>
                `
            }

          </div>


          <div class="body">

            <h3>
              ${esc(p.title)}
            </h3>


            <div class="meta">
              ${esc(p.chapter || "")}
              · ◉
              ${esc(p.views || "0")}
            </div>


            <div class="meta rating">
              ★ ${esc(p.rating || "")}
            </div>

          </div>

        </article>

      `;

    }).join("") ||

    `
      <p style="
        padding:20px;
        color:#91a5bd
      ">
        まだ投稿がありません。
      </p>
    `;


  /* =========================================
     CLICK EVENTS
  ========================================= */

  latest
    .querySelectorAll(".card")
    .forEach(card => {

      card.addEventListener(
        "click",
        function () {

          const slug =
            this.dataset.slug;

          openPost(slug);

        }
      );

    });


  renderRanking(list);
}


/* =========================================
   OPEN POST INSIDE HOMEPAGE
========================================= */

function openPost(slug) {

  console.log("Opening post:", slug);


  const post =
    posts.find(
      p =>
        String(p.slug) === String(slug)
    );


  if (!post) {

    console.error(
      "Post not found:",
      slug
    );

    return;

  }


  const reader =
    document.querySelector("#inlineReader");


  if (!reader) {

    console.error(
      "#inlineReader not found in index.html"
    );

    return;

  }


  /* =========================================
     CLOSE IF SAME POST IS OPEN
  ========================================= */

  if (
    reader.dataset.slug === String(slug) &&
    reader.style.display !== "none"
  ) {

    reader.style.display = "none";

    reader.innerHTML = "";

    reader.removeAttribute("data-slug");

    return;

  }


  /* =========================================
     CLOSE OLD READER
  ========================================= */

  reader.innerHTML = "";

  reader.style.display = "none";

  reader.dataset.slug = String(slug);


  /* =========================================
     DATA
  ========================================= */

  const title =
    esc(post.title);


  const manga =
    esc(post.manga || "");


  const chapter =
    esc(post.chapter || "");


  const genre =
    esc(post.genre || "");


  const rating =
    esc(post.rating || "0");


  const images =
    Array.isArray(post.images)
      ? post.images
      : [];


  /* =========================================
     COVER
  ========================================= */

  const coverHTML =
    post.cover
      ? `

        <div
          style="
            text-align:center;
            margin-bottom:25px;
          "
        >

          <img
            src="${esc(post.cover)}"
            alt="${title}"
            loading="lazy"
            decoding="async"
            style="
              display:block;
              max-width:100%;
              height:auto;
              margin:0 auto;
              border-radius:8px;
            "
          >

        </div>

      `
      : "";


  /* =========================================
     CHAPTER IMAGES
  ========================================= */

  const imageHTML =
    images.map(
      (path, index) => `

        <figure
          style="
            margin:0 0 22px;
            padding:0;
            text-align:center;
          "
        >

          <img
            src="${esc(path)}"
            alt="${title} - Page ${index + 1}"
            loading="lazy"
            decoding="async"
            style="
              display:block;
              width:100%;
              max-width:100%;
              height:auto;
              margin:0 auto;
              border-radius:7px;
            "
          >

          <figcaption
            style="
              margin-top:6px;
              font-size:11px;
              color:#8197ae;
            "
          >
            ${title} - Page ${index + 1}
          </figcaption>

        </figure>

      `
    ).join("");


  /* =========================================
     READER HTML
  ========================================= */

  reader.innerHTML = `

    <section
      class="panel"
      style="
        margin:25px 0;
        padding:0;
        overflow:hidden;
      "
    >

      <div
        class="heading"
        style="
          padding:20px;
        "
      >

        <h1>
          ${title}
        </h1>

        <p>

          ${manga}

          ${
            chapter
              ? " · " + chapter
              : ""
          }

          ${
            genre
              ? " · " + genre
              : ""
          }

          · ★ ${rating}

        </p>

      </div>


      <div
        style="
          padding:18px;
        "
      >

        <div
          style="
            margin-bottom:25px;
            color:#91a5bd;
            font-size:13px;
            line-height:1.8;
          "
        >

          <p>
            ${manga}
            ${chapter}
            の Raw をチェックできます。
          </p>

          <p>
            最新の漫画ページを画像で確認できます。
            このページでは
            ${title}
            の章情報と画像を掲載しています。
          </p>

        </div>


        ${coverHTML}


        ${imageHTML}


        <div
          style="
            text-align:center;
            margin-top:30px;
          "
        >

          <button
            type="button"
            id="closeReader"
            style="
              padding:10px 22px;
              border:1px solid #24415f;
              border-radius:8px;
              background:transparent;
              color:#d6e4f3;
              cursor:pointer;
            "
          >
            ✕ 閉じる
          </button>

        </div>


      </div>

    </section>

  `;


  /* =========================================
     SHOW
  ========================================= */

  reader.style.display = "block";


  /* =========================================
     CLOSE BUTTON
  ========================================= */

  const closeButton =
    document.querySelector(
      "#closeReader"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closePost
    );

  }


  /* =========================================
     SCROLL TO READER
  ========================================= */

  setTimeout(() => {

    reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 100);

}


/* =========================================
   CLOSE POST
========================================= */

function closePost() {

  const reader =
    document.querySelector(
      "#inlineReader"
    );


  if (!reader) {
    return;
  }


  reader.style.display = "none";

  reader.innerHTML = "";

  reader.removeAttribute("data-slug");

}


/* =========================================
   RANKING
========================================= */

function renderRanking(list) {

  const rank =
    document.querySelector("#rank");


  if (!rank) {
    return;
  }


  rank.innerHTML =

    list
      .slice(0, 5)
      .map((p, i) => {

        const slug =
          String(p.slug || "");


        return `

          <div
            class="rank"
            data-slug="${esc(slug)}"
            style="cursor:pointer"
          >

            <div class="num">
              ${i + 1}
            </div>


            <div class="rcover">

              ${
                p.cover
                  ? `
                    <img
                      src="${esc(p.cover)}"
                      alt="${esc(p.title)}"
                      loading="lazy"
                    >
                  `
                  : esc(
                      p.manga ||
                      p.title
                    )
              }

            </div>


            <div>

              <div class="rname">
                ${esc(
                  p.manga ||
                  p.title
                )}
              </div>


              <div class="rmeta">

                ★ ${esc(
                  p.rating || ""
                )}

                · ◉ ${esc(
                  p.views || "0"
                )}

              </div>

            </div>

          </div>

        `;

      })
      .join("");


  /* Ranking click */

  rank
    .querySelectorAll(".rank")
    .forEach(item => {

      item.addEventListener(
        "click",
        function () {

          openPost(
            this.dataset.slug
          );

        }
      );

    });

}


/* =========================================
   SEARCH
========================================= */

const searchInput =
  document.querySelector("#q");


if (searchInput) {

  searchInput.addEventListener(
    "input",
    e => {

      const q =
        e.target.value
          .toLowerCase()
          .trim();


      render(

        posts.filter(p =>

          (
            (p.title || "") +
            " " +
            (p.manga || "") +
            " " +
            (p.chapter || "") +
            " " +
            (p.genre || "")
          )

          .toLowerCase()

          .includes(q)

        )

      );

    }
  );

}


/* =========================================
   GENRE TABS
========================================= */

document
  .querySelectorAll(".tabs button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".tabs button")
          .forEach(x =>
            x.classList.remove("on")
          );


        button.classList.add("on");


        const genre =
          button.dataset.g;


        render(

          genre === "all"

            ? posts

            : posts.filter(
                p =>
                  p.genre === genre
              )

        );

      }
    );

  });


/* =========================================
   START
========================================= */

load();
