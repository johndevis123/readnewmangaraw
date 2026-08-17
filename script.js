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
   NO LAZY LOAD
   NO EXTRA GAPS
========================================= */


/* =========================================
   300x250 AD
========================================= */

function createAd300x250(container) {

  if (!container) return;


  const wrapper =
    document.createElement("div");


  wrapper.style.cssText = `
    width:100%;
    max-width:300px;
    height:250px;
    margin:0 auto;
    padding:0;
    line-height:0;
    text-align:center;
    overflow:hidden;
    display:block;
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
    height:90px;
    margin:0 auto;
    padding:0;
    line-height:0;
    text-align:center;
    overflow:hidden;
    display:block;
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
   LOAD 3 x 300 + 3 x 728 ADS
   NO EXTRA GAP
========================================= */

function loadBannerAds(container) {

  if (!container) return;


  container.innerHTML = "";


  container.style.cssText = `
    width:100%;
    margin:0;
    padding:0;
    line-height:0;
    text-align:center;
    display:block;
  `;


  /* 300x250 ADS */

  createAd300x250(container);
  createAd300x250(container);
  createAd300x250(container);


  /* 728x90 ADS */

  createAd728x90(container);
  createAd728x90(container);
  createAd728x90(container);

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


  /* Close opened post when
     search/filter changes */

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


  /* =====================================
     CREATE POST CARDS ONLY
     
     Reader remains ABOVE #latest.
  ===================================== */

  list.forEach(
    (post, index) => {

      const slug =
        String(
          post.slug || ""
        );


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


      card.addEventListener(
        "click",
        function () {

          openPost(slug);

        }
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


  /* =====================================
     IF SAME POST IS ALREADY OPEN
  ===================================== */

  if (
    reader.style.display ===
      "block" &&
    reader.dataset.slug ===
      String(slug)
  ) {

    closePost(slug);

    return;

  }


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
          margin:0;
          padding:0;
          line-height:0;
        "
      >

        <img
          src="${esc(
            post.cover
          )}"
          alt="${title}"
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
     
     NO LAZY LOAD
  ===================================== */

  let imageHTML =
    "";


  images.forEach(
    (path, index) => {

      imageHTML += `

        <figure
          style="
            margin:0;
            padding:0;
            width:100%;
            text-align:center;
            line-height:0;
          "
        >

          <img
            src="${esc(
              path
            )}"
            alt="${title} - Page ${
              index + 1
            }"
            decoding="async"
            style="
              display:block;
              width:100%;
              max-width:100%;
              height:auto;
              margin:0;
              padding:0;
              border-radius:7px;
            "
          >

          <figcaption
            style="
              margin:0;
              padding:4px 0;
              font-size:11px;
              line-height:1.3;
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
     OPEN FULL WIDTH READER
     
     Reader is ABOVE #latest.
  ===================================== */

  reader.dataset.slug =
    String(slug);


  reader.style.display =
    "block";


  reader.style.width =
    "100%";


  reader.style.maxWidth =
    "100%";


  reader.style.boxSizing =
    "border-box";


  reader.style.margin =
    "0";


  reader.style.padding =
    "0";


  reader.innerHTML = `

    <section
      class="panel"
      style="
        width:100%;
        max-width:100%;
        margin:0;
        padding:0;
        overflow:hidden;
        box-sizing:border-box;
      "
    >


      <!-- =========================
           POST HEADER
      ========================== -->

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


      <!-- =========================
           POST CONTENT
      ========================== -->

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
            margin:0;
            padding:0;
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


        <!-- =========================
             POST ADS
             3 x 300
             3 x 728

             NO EXTRA GAP
        ========================== -->

        <div
          class="inline-post-ads"
          style="
            width:100%;
            margin:0;
            padding:0;
            line-height:0;
            text-align:center;
          "
        ></div>


        <!-- =========================
             CLOSE
        ========================== -->

        <div
          style="
            text-align:center;
            margin:0;
            padding:10px 0 20px;
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
            "
          >

            ✕ 閉じる

          </button>

        </div>


      </div>

    </section>

  `;


  /* =====================================
     LOAD POST ADS
  ===================================== */

  const postAds =
    reader.querySelector(
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
    reader.querySelector(
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
     SCROLL TO TOP OF OPENED POST
  ===================================== */

  setTimeout(
    () => {

      reader.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    80
  );

}


/* =========================================
   CLOSE POST
========================================= */

function closePost(slug) {

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

function loadHomepageAds() {

  const homepageAds =
    document.querySelector(
      "#homepageAds"
    );


  if (!homepageAds) return;


  homepageAds.style.cssText = `
    width:100%;
    margin:0;
    padding:0;
    line-height:0;
    text-align:center;
    display:block;
  `;


  loadBannerAds(
    homepageAds
  );

}


/* =========================================
   START
========================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      loadHomepageAds();

      load();

    }
  );

} else {

  loadHomepageAds();

  load();

}
