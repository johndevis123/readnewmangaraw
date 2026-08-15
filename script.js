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

    posts = data.posts || [];

  } catch (e) {

    console.error("Posts loading error:", e);

    posts = [];
  }

  render(posts);
}


function render(list) {

  document.querySelector("#latest").innerHTML =
    list.map((p, i) => `

      <article
        class="card"
        onclick="location.href='posts/${encodeURIComponent(p.slug)}.html'"
      >

        <div
          class="cover"
          style="background:linear-gradient(
            145deg,
            #${["71323e","174e82","68452a","4b2a70"][i % 4]},
            #071321
          )"
        >

          ${
            p.cover
              ? `
                <img
                  src="${esc(p.cover)}"
                  alt=""
                  loading="lazy"
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

    `).join("") ||
    `
      <p style="padding:20px;color:#91a5bd">
        まだ投稿がありません。
      </p>
    `;


  document.querySelector("#rank").innerHTML =
    list
      .slice(0, 5)
      .map((p, i) => `

        <div class="rank">

          <div class="num">
            ${i + 1}
          </div>

          <div class="rcover">

            ${
              p.cover
                ? `
                  <img
                    src="${esc(p.cover)}"
                    alt=""
                    loading="lazy"
                  >
                `
                : esc(p.manga || p.title)
            }

          </div>

          <div>

            <div class="rname">
              ${esc(p.manga || p.title)}
            </div>

            <div class="rmeta">
              ★ ${esc(p.rating || "")}
              · ◉ ${esc(p.views || "0")}
            </div>

          </div>

        </div>

      `)
      .join("");
}


/* =========================================
   Search
========================================= */

document.querySelector("#q").oninput = e => {

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
};


/* =========================================
   Genre tabs
========================================= */

document
  .querySelectorAll(".tabs button")
  .forEach(button => {

    button.onclick = () => {

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
              p => p.genre === genre
            )
      );
    };

  });


/* =========================================
   Load posts
========================================= */

load();
