let posts = [];


/* =========================================
   ESCAPE HTML
========================================= */

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

    const response = await fetch(
      "data/posts.json?v=" + Date.now(),
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {

      throw new Error(
        "Failed to load posts.json: " +
        response.status
      );

    }

    const data =
      await response.json();

    posts =
      Array.isArray(data.posts)
        ? data.posts
        : [];

  } catch (error) {

    console.error(
      "Posts loading error:",
      error
    );

    posts = [];

  }

  render(posts);

}


/* =========================================
   RENDER POSTS
========================================= */

function render(list) {

  const latest =
    document.querySelector("#latest");

  if (!latest) {

    console.error(
      "#latest not found"
    );

    return;

  }


  latest.innerHTML = "";


  if (!list.length) {

    latest.innerHTML = `
      <p style="
        padding:20px;
        color:#91a5bd;
      ">
        まだ投稿がありません。
      </p>
    `;

    renderRanking([]);

    return;

  }


  list.forEach((post, index) => {

    const slug =
      String(post.slug || "");


    /* =====================================
       CARD
    ===================================== */

    const card =
      document.createElement("article");

    card.className = "card";

    card.style.cursor = "pointer";

    card.dataset.slug = slug;


    card.innerHTML = `

      <div
        class="cover"
        style="
          background:linear-gradient(
            145deg,
            #${[
              "71323e",
              "174e82",
              "68452a",
              "4b2a70"
            ][index % 4]},
            #071321
          )
        "
      >

        ${
          post.cover
            ? `
              <img
                src="${esc(post.cover)}"
                alt="${esc(post.title)}"
                loading="lazy"
                decoding="async"
              >
            `
            : `
              <div class="cover-placeholder">
                ${esc(
                  post.manga ||
                  post.title
                )}
              </div>
            `
        }

      </div>


      <div class="body">

        <h3>
          ${esc(post.title)}
        </h3>


        <div class="meta">
          ${esc(post.chapter || "")}
          · ◉
          ${esc(post.views || "0")}
        </div>


        <div class="meta rating">
          ★ ${esc(post.rating || "")}
        </div>

      </div>

    `;


    /* =====================================
       CLICK
    ===================================== */

    card.addEventListener(
      "click",
      function () {

        openPost(slug);

      }
    );


    latest.appendChild(card);


    /* =====================================
       INLINE POST CONTAINER
    ===================================== */

    const box =
      document.createElement("div");

    box.className = "inline-post";

    box.id =
      "post-" + slug;

    box.style.display = "none";


    latest.appendChild(box);

  });


  renderRanking(list);

}


/* =========================================
   OPEN POST ON SAME PAGE
========================================= */

function openPost(slug) {

  const post =
    posts.find(
      p =>
        String(p.slug) ===
        String(slug)
    );


  if (!post) {

    console.error(
      "Post not found:",
      slug
    );

    return;

  }


  const box =
    document.getElementById(
      "post-" + slug
    );


  if (!box) {

    console.error(
      "Inline post container not found:",
      slug
    );

    return;

  }


  /* =====================================
     CLOSE OTHER OPEN POSTS
  ===================================== */

  document
    .querySelectorAll(".inline-post")
    .forEach(element => {

      if (element !== box) {

        element.style.display =
          "none";

        element.innerHTML = "";

      }

    });


  /* =====================================
     TOGGLE CURRENT POST
  ===================================== */

  if (
    box.style.display ===
    "block"
  ) {

    box.style.display =
      "none";

    box.innerHTML = "";

    return;

  }


  /* =====================================
     DATA
  ===================================== */

  const title =
    esc(post.title || "");


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


  /* =====================================
     COVER
  ===================================== */

  let coverHTML = "";


  if (post.cover) {

    coverHTML = `

      <div
        style="
          text-align:center;
          margin:0 0 25px;
        "
      >

        <img
          src="${esc(post.cover)}"
          alt="${title}"
          loading="lazy"
          decoding="async"
          style="
            display:block;
            width:100%;
            max-width:700px;
            height:auto;
            margin:0 auto;
            border-radius:8px;
          "
        >

      </div>

    `;

  }


  /* =====================================
     CHAPTER IMAGES
  ===================================== */

  let imageHTML = "";


  images.forEach(
    (path, index) => {

      imageHTML += `

        <figure
          style="
            margin:0 0 20px;
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

            ${title}
            - Page ${index + 1}

          </figcaption>

        </figure>

      `;

    }
  );


  /* =====================================
     INLINE CONTENT
  ===================================== */

  box.innerHTML = `

    <section
      class="panel"
      style="
        margin:18px 0 25px;
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
            margin-bottom:22px;
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
            margin-top:25px;
          "
        >

          <button
            type="button"
            class="close-inline-post"
          >

            ✕ 閉じる

          </button>

        </div>


      </div>

    </section>

  `;


  /* =====================================
     CLOSE BUTTON
  ===================================== */

  const closeButton =
    box.querySelector(
      ".close-inline-post"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();

        closePost(slug);

      }
    );

  }


  /* =====================================
     SHOW
  ===================================== */

  box.style.display =
    "block";


  /* =====================================
     SCROLL
  ===================================== */

  setTimeout(
    () => {

      box.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    50
  );

}


/* =========================================
   CLOSE POST
========================================= */

function closePost(slug) {

  const box =
    document.getElementById(
      "post-" + slug
    );


  if (!box) {

    return;

  }


  box.style.display =
    "none";


  box.innerHTML = "";

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
      .map(
        (post, index) => {

          const slug =
            String(
              post.slug || ""
            );


          return `

            <div
              class="rank"
              data-slug="${esc(slug)}"
              style="cursor:pointer"
            >

              <div class="num">
                ${index + 1}
              </div>


              <div class="rcover">

                ${
                  post.cover
                    ? `
                      <img
                        src="${esc(post.cover)}"
                        alt="${esc(post.title)}"
                        loading="lazy"
                      >
                    `
                    : esc(
                        post.manga ||
                        post.title
                      )
                }

              </div>


              <div>

                <div class="rname">

                  ${esc(
                    post.manga ||
                    post.title
                  )}

                </div>


                <div class="rmeta">

                  ★ ${esc(
                    post.rating || ""
                  )}

                  · ◉ ${esc(
                    post.views || "0"
                  )}

                </div>

              </div>

            </div>

          `;

        }
      )
      .join("");


  /* =====================================
     RANKING CLICK EVENTS
  ===================================== */

  rank
    .querySelectorAll(".rank")
    .forEach(element => {

      element.addEventListener(
        "click",
        function () {

          openPost(
            element.dataset.slug
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
    function (event) {

      const q =
        event.target.value
          .toLowerCase()
          .trim();


      const filtered =
        posts.filter(post => {

          const text =

            (post.title || "") +
            " " +
            (post.manga || "") +
            " " +
            (post.chapter || "") +
            " " +
            (post.genre || "");


          return text
            .toLowerCase()
            .includes(q);

        });


      render(filtered);

    }
  );

}


/* =========================================
   GENRE TABS
========================================= */

document
  .querySelectorAll(
    ".tabs button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      function () {


        document
          .querySelectorAll(
            ".tabs button"
          )
          .forEach(
            x =>
              x.classList.remove("on")
          );


        button.classList.add("on");


        const genre =
          button.dataset.g;


        const filtered =
          genre === "all"
            ? posts
            : posts.filter(
                post =>
                  post.genre === genre
              );


        render(filtered);

      }
    );

  });


/* =========================================
   START
========================================= */

load();
