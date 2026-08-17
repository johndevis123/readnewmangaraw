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


/* =========================================
   300x250
========================================= */

function createAd300x250(container) {

  if (!container) return;


  const wrapper =
    document.createElement("div");


  wrapper.className =
    "ad-wrapper ad-300";


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
   728x90
========================================= */

function createAd728x90(container) {

  if (!container) return;


  const wrapper =
    document.createElement("div");


  wrapper.className =
    "ad-wrapper ad-728";


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
   CREATE ONE AD PAIR
========================================= */

function createAdPair(container) {

  if (!container) return;


  createAd300x250(container);

  createAd728x90(container);

}


/* =========================================
   LOAD 3 + 3 ADS
========================================= */

function loadBannerAds(container) {

  if (!container) return;


  container.innerHTML = "";


  /*
     3 groups

     Group 1:
     300 + 728

     Group 2:
     300 + 728

     Group 3:
     300 + 728
  */

  createAdPair(container);

  createAdPair(container);

  createAdPair(container);

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
   CREATE POST CARD
========================================= */

function createPostCard(post, index) {

  const slug =
    String(post.slug || "");


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "card";


  card.dataset.slug =
    slug;


  card.style.cursor =
    "pointer";


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
            ][index % 4]
          },
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

        ★

        ${esc(post.rating || "")}

      </div>

    </div>

  `;


  card.addEventListener(
    "click",
    function () {

      openPost(slug);

    }
  );


  return card;

}


/* =========================================
   RENDER
========================================= */

function render(list) {

  const latest =
    document.querySelector(
      "#latest"
    );


  const reader =
    document.querySelector(
      "#inlineReader"
    );


  if (!latest) {

    console.error(
      "#latest not found"
    );

    return;

  }


  /*
     Close opened reader
     when search/filter changes.
  */

  if (reader) {

    reader.style.display =
      "none";

    reader.innerHTML =
      "";

    reader.dataset.slug =
      "";

  }


  latest.innerHTML =
    "";


  if (!list.length) {

    latest.innerHTML = `

      <p class="empty-posts">

        まだ投稿がありません。

      </p>

    `;


    renderRanking([]);

    return;

  }


  list.forEach(
    (post, index) => {

      const card =
        createPostCard(
          post,
          index
        );


      latest.appendChild(card);

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


  const reader =
    document.querySelector(
      "#inlineReader"
    );


  if (!reader) {

    console.error(
      "#inlineReader not found"
    );

    return;

  }


  /* =======================================
     SAME POST = CLOSE
  ======================================= */

  if (
    reader.style.display === "block" &&
    reader.dataset.slug === String(slug)
  ) {

    closePost();

    return;

  }


  /* =======================================
     DATA
  ======================================= */

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
    Array.isArray(post.images)
      ? post.images
      : [];


  /* =======================================
     COVER
  ======================================= */

  let coverHTML =
    "";


  if (post.cover) {

    coverHTML = `

      <div class="reader-cover">

        <img
          src="${esc(post.cover)}"
          alt="${title}"
          decoding="async"
        >

      </div>

    `;

  }


  /* =======================================
     BUILD IMAGE HTML
  ======================================= */

  let imageHTML =
    "";


  images.forEach(
    (path, index) => {

      imageHTML += `

        <figure class="chapter-image">

          <img
            src="${esc(path)}"
            alt="${title} - Page ${
              index + 1
            }"
            decoding="async"
          >

          <figcaption>

            ${title}
            - Page ${index + 1}

          </figcaption>

        </figure>

      `;

    }
  );


  /* =======================================
     SPLIT IMAGES INTO 3 PARTS
     
     ADS WILL APPEAR BETWEEN CONTENT.
  ======================================= */

  const total =
    images.length;


  const partSize =
    Math.max(
      1,
      Math.ceil(total / 3)
    );


  let parts = [];


  for (
    let i = 0;
    i < total;
    i += partSize
  ) {

    parts.push(
      imageHTMLFromRange(
        images,
        i,
        Math.min(
          i + partSize,
          total
        ),
        title
      )
    );

  }


  while (parts.length < 3) {

    parts.push("");

  }


  /* =======================================
     READER
  ======================================= */

  reader.dataset.slug =
    String(slug);


  reader.style.display =
    "block";


  reader.innerHTML = `

    <section class="reader-panel">


      <!-- ================================
           POST HEADER
      ================================= -->

      <div class="reader-heading">

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


      <!-- ================================
           READER BODY
      ================================= -->

      <div class="reader-body">


        <!-- DESCRIPTION -->

        <div class="reader-description">

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


        <!-- ================================
             IMAGE PART 1
        ================================= -->

        <div class="reader-images">

          ${parts[0]}

        </div>


        <!-- ================================
             ADS GROUP 1
        ================================= -->

        <div
          class="reader-ads ads-group-1"
        ></div>


        <!-- ================================
             IMAGE PART 2
        ================================= -->

        <div class="reader-images">

          ${parts[1]}

        </div>


        <!-- ================================
             ADS GROUP 2
        ================================= -->

        <div
          class="reader-ads ads-group-2"
        ></div>


        <!-- ================================
             IMAGE PART 3
        ================================= -->

        <div class="reader-images">

          ${parts[2]}

        </div>


        <!-- ================================
             ADS GROUP 3
        ================================= -->

        <div
          class="reader-ads ads-group-3"
        ></div>


        <!-- ================================
             CLOSE
        ================================= -->

        <div class="reader-close">

          <button
            type="button"
            id="closeReaderButton"
          >

            ✕ 閉じる

          </button>

        </div>


      </div>

    </section>

  `;


  /* =======================================
     LOAD 3 + 3 ADS
  ======================================= */

  const adGroups =
    reader.querySelectorAll(
      ".reader-ads"
    );


  adGroups.forEach(
    group => {

      loadBannerAds(group);

    }
  );


  /* =======================================
     CLOSE BUTTON
  ======================================= */

  const closeButton =
    document.querySelector(
      "#closeReaderButton"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();

        closePost();

      }
    );

  }


  /* =======================================
     SCROLL TO READER
  ======================================= */

  setTimeout(
    () => {

      reader.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    50
  );

}


/* =========================================
   CREATE IMAGES FOR RANGE
========================================= */

function imageHTMLFromRange(
  images,
  start,
  end,
  title
) {

  let html = "";


  for (
    let i = start;
    i < end;
    i++
  ) {

    const path =
      images[i];


    html += `

      <figure class="chapter-image">

        <img
          src="${esc(path)}"
          alt="${title} - Page ${
            i + 1
          }"
          decoding="async"
        >

        <figcaption>

          ${title}
          - Page ${i + 1}

        </figcaption>

      </figure>

    `;

  }


  return html;

}


/* =========================================
   CLOSE POST
========================================= */

function closePost() {

  const reader =
    document.querySelector(
      "#inlineReader"
    );


  if (!reader) return;


  reader.style.display =
    "none";


  reader.innerHTML =
    "";


  reader.dataset.slug =
    "";

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
              data-slug="${esc(slug)}"
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
                        decoding="async"
                      >

                    `

                    : esc(
                        post.manga ||
                        post.title
                      )
                }

              </div>


              <div class="rank-info">

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


  rank
    .querySelectorAll(".rank")
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

function setupSearch() {

  const searchInput =
    document.querySelector(
      "#q"
    );


  if (!searchInput) return;


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

function setupTabs() {

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

}


/* =========================================
   START
========================================= */

function start() {

  setupSearch();

  setupTabs();

  load();

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    start
  );

} else {

  start();

}
