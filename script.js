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
   ADS
========================================= */

function createAd300x250(container) {

  if (!container) return;

  const wrapper =
    document.createElement("div");

  wrapper.style.cssText = `
    width:100%;
    max-width:300px;
    min-height:250px;
    margin:25px auto;
    text-align:center;
    overflow:hidden;
  `;


  const options =
    document.createElement("script");

  options.textContent = `
    atOptions = {
      'key' : 'a8a805cc341bb0537e9ecf27dd55a271',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  `;


  const script =
    document.createElement("script");

  script.src =
    "https://www.highperformanceformat.com/a8a805cc341bb0537e9ecf27dd55a271/invoke.js";

  script.async = true;


  wrapper.appendChild(options);
  wrapper.appendChild(script);

  container.appendChild(wrapper);

}


/* =========================================
   728x90 AD
========================================= */

function createAd728x90(container) {

  if (!container) return;

  const wrapper =
    document.createElement("div");

  wrapper.style.cssText = `
    width:100%;
    max-width:728px;
    min-height:90px;
    margin:25px auto;
    text-align:center;
    overflow:hidden;
  `;


  const options =
    document.createElement("script");

  options.textContent = `
    atOptions = {
      'key' : 'ce956904ebd6d4f505c512d6335bafb6',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  `;


  const script =
    document.createElement("script");

  script.src =
    "https://www.highperformanceformat.com/ce956904ebd6d4f505c512d6335bafb6/invoke.js";

  script.async = true;


  wrapper.appendChild(options);
  wrapper.appendChild(script);

  container.appendChild(wrapper);

}


/* =========================================
   LOAD ADS
   5 x 300x250
   5 x 728x90
========================================= */

function loadBannerAds(container) {

  if (!container) return;

  container.innerHTML = "";


  /* 300x250 — 5 TIMES */

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    createAd300x250(container);

  }


  /* 728x90 — 5 TIMES */

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    createAd728x90(container);

  }

}


/* =========================================
   LOAD POSTS
========================================= */

async function load() {

  try {

    const response =
      await fetch(
        "data/posts.json?v=" +
        Date.now(),
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
    document.querySelector(
      "#latest"
    );


  if (!latest) {

    console.error(
      "#latest not found"
    );

    return;

  }


  latest.innerHTML = "";

  latest.classList.remove(
    "post-is-open"
  );


  if (!list.length) {

    latest.innerHTML = `

      <p
        style="
          padding:20px;
          color:#91a5bd;
        "
      >

        まだ投稿がありません。

      </p>

    `;


    renderRanking([]);

    return;

  }


  list.forEach(
    (post, index) => {

      const slug =
        String(
          post.slug || ""
        );


      /* ===================================
         CARD
      =================================== */

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "card";


      card.style.cursor =
        "pointer";


      card.dataset.slug =
        slug;


      card.innerHTML = `

        <div
          class="cover"
          style="
            background:linear-gradient(
              145deg,
              #${
                [
                  "71323e",
                  "174e82",
                  "68452a",
                  "4b2a70"
                ][
                  index % 4
                ]
              },
              #071321
            )
          "
        >

          ${
            post.cover

              ? `

                <img
                  src="${esc(
                    post.cover
                  )}"
                  alt="${esc(
                    post.title
                  )}"
                  loading="lazy"
                  decoding="async"
                >

              `

              : `

                <div
                  class="cover-placeholder"
                >

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

            ${esc(
              post.title
            )}

          </h3>


          <div class="meta">

            ${esc(
              post.chapter || ""
            )}

            · ◉

            ${esc(
              post.views || "0"
            )}

          </div>


          <div class="meta rating">

            ★

            ${esc(
              post.rating || ""
            )}

          </div>

        </div>

      `;


      /* ===================================
         CARD CLICK
      =================================== */

      card.addEventListener(
        "click",
        function () {

          openPost(slug);

        }
      );


      latest.appendChild(
        card
      );


      /* ===================================
         INLINE POST BOX
      =================================== */

      const box =
        document.createElement(
          "div"
        );


      box.className =
        "inline-post";


      box.id =
        "post-" + slug;


      box.style.display =
        "none";


      box.style.width =
        "100%";


      box.style.maxWidth =
        "100%";


      box.style.gridColumn =
        "1 / -1";


      box.style.boxSizing =
        "border-box";


      latest.appendChild(
        box
      );

    }
  );


  renderRanking(list);

}


/* =========================================
   OPEN POST
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


  const latest =
    document.querySelector(
      "#latest"
    );


  const box =
    document.getElementById(
      "post-" + slug
    );


  if (!latest || !box) {

    console.error(
      "Post container not found:",
      slug
    );

    return;

  }


  /* =====================================
     CLOSE ALL OTHER POSTS
  ===================================== */

  document
    .querySelectorAll(
      ".inline-post"
    )
    .forEach(
      element => {

        if (
          element !== box
        ) {

          element.style.display =
            "none";

          element.innerHTML =
            "";

        }

      }
    );


  /* =====================================
     IF ALREADY OPEN → CLOSE
  ===================================== */

  if (
    box.style.display ===
    "block"
  ) {

    closePost(slug);

    return;

  }


  /* =====================================
     IMPORTANT:
     MOVE OPENED POST TO TOP
  ===================================== */

  latest.prepend(box);


  box.style.display =
    "block";


  box.style.width =
    "100%";


  box.style.maxWidth =
    "100%";


  box.style.gridColumn =
    "1 / -1";


  box.style.gridRow =
    "auto";


  box.style.boxSizing =
    "border-box";


  latest.classList.add(
    "post-is-open"
  );


  /* =====================================
     DATA
  ===================================== */

  const title =
    esc(
      post.title || ""
    );


  const manga =
    esc(
      post.manga || ""
    );


  const chapter =
    esc(
      post.chapter || ""
    );


  const genre =
    esc(
      post.genre || ""
    );


  const rating =
    esc(
      post.rating || "0"
    );


  const images =
    Array.isArray(
      post.images
    )
      ? post.images
      : [];


  /* =====================================
     COVER
  ===================================== */

  let coverHTML =
    "";


  if (post.cover) {

    coverHTML = `

      <div
        style="
          width:100%;
          text-align:center;
          margin:0 0 25px;
        "
      >

        <img
          src="${esc(
            post.cover
          )}"
          alt="${title}"
          loading="lazy"
          decoding="async"
          style="
            display:block;
            width:100%;
            max-width:900px;
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

  let imageHTML =
    "";


  images.forEach(
    (path, index) => {

      imageHTML += `

        <figure
          style="
            margin:0 0 20px;
            padding:0;
            width:100%;
            text-align:center;
          "
        >

          <img
            src="${esc(path)}"
            alt="${title} - Page ${
              index + 1
            }"
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
     POST HTML
  ===================================== */

  box.innerHTML = `

    <section
      class="panel"
      style="
        width:100%;
        max-width:100%;
        margin:0 0 30px;
        padding:0;
        overflow:hidden;
        box-sizing:border-box;
      "
    >


      <!-- POST HEADER -->

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


      <!-- POST CONTENT -->

      <div
        style="
          width:100%;
          padding:18px;
          box-sizing:border-box;
        "
      >


        <!-- DESCRIPTION -->

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


        <!-- COVER -->

        ${coverHTML}


        <!-- CHAPTER IMAGES -->

        ${imageHTML}


        <!-- ADS -->

        <div
          class="inline-post-ads"
          style="
            width:100%;
            margin:30px auto;
            text-align:center;
          "
        ></div>


        <!-- CLOSE -->

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <button
            type="button"
            class="close-inline-post"
            style="
              padding:10px 20px;
              border:1px solid #24415f;
              border-radius:8px;
              background:transparent;
              color:#d6e4f3;
              cursor:pointer;
              font-size:14px;
            "
          >

            ✕ 閉じる

          </button>

        </div>


      </div>

    </section>

  `;


  /* =====================================
     LOAD 10 ADS
  ===================================== */

  const postAds =
    box.querySelector(
      ".inline-post-ads"
    );


  if (postAds) {

    loadBannerAds(
      postAds
    );

  }


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
     SCROLL TO VERY TOP OF OPENED POST
  ===================================== */

  setTimeout(
    () => {

      const headerOffset =
        10;


      const position =
        box.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;


      window.scrollTo({

        top:
          Math.max(
            0,
            position
          ),

        behavior:
          "smooth"

      });

    },
    100
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


  if (!box) return;


  const card =
    document.querySelector(
      `.card[data-slug="${CSS.escape(slug)}"]`
    );


  /* =====================================
     MOVE BOX BACK AFTER ITS CARD
  ===================================== */

  if (
    card &&
    card.parentNode
  ) {

    card.parentNode.insertBefore(
      box,
      card.nextSibling
    );

  }


  box.style.display =
    "none";


  box.innerHTML =
    "";


  const latest =
    document.querySelector(
      "#latest"
    );


  if (latest) {

    latest.classList.remove(
      "post-is-open"
    );

  }

}


/* =========================================
   RANKING
========================================= */

function renderRanking(list) {

  const rank =
    document.querySelector(
      "#rank"
    );


  if (!rank) return;


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
              data-slug="${esc(
                slug
              )}"
              style="
                cursor:pointer;
              "
            >

              <div class="num">

                ${index + 1}

              </div>


              <div class="rcover">

                ${
                  post.cover

                    ? `

                      <img
                        src="${esc(
                          post.cover
                        )}"
                        alt="${esc(
                          post.title
                        )}"
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

                  ★

                  ${esc(
                    post.rating || ""
                  )}

                  · ◉

                  ${esc(
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
     RANKING CLICK
  ===================================== */

  rank
    .querySelectorAll(
      ".rank"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          function () {

            openPost(
              element.dataset.slug
            );

          }
        );

      }
    );

}


/* =========================================
   SEARCH
========================================= */

const searchInput =
  document.querySelector(
    "#q"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function (event) {

      const q =
        event.target.value
          .toLowerCase()
          .trim();


      const filtered =
        posts.filter(
          post => {

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

          }
        );


      render(
        filtered
      );

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
  .forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          document
            .querySelectorAll(
              ".tabs button"
            )
            .forEach(
              x =>
                x.classList.remove(
                  "on"
                )
            );


          button.classList.add(
            "on"
          );


          const genre =
            button.dataset.g;


          const filtered =
            genre === "all"

              ? posts

              : posts.filter(
                  post =>
                    post.genre ===
                    genre
                );


          render(
            filtered
          );

        }
      );

    }
  );


/* =========================================
   HOMEPAGE ADS
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const homepageAds =
      document.querySelector(
        "#homepageAds"
      );


    if (homepageAds) {

      loadBannerAds(
        homepageAds
      );

    }

  }
);


/* =========================================
   START
========================================= */

load();
