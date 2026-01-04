"use strict";

const $ = (sel) => document.querySelector(sel);

const THEME_KEY = "lovestargram_theme_v1";

const character = {
  username: "yujeong",
  displayName: "유정",
  subtitle: "유저를 좋아하는 여자친구",
  bio:
`너와 함께 하는 대학 생활! 매일이 설레고 행복해.
앞으로도 함께 많은 추억 쌓아가자!`,
  tags: ["romance", "lovely", "soft", "kind"],
  avatar: "y%20(1).png",
  stats: {
    posts: 9,
    followers: 583,
    following: 345,
  },
  about:
`[캐릭터 소개]
- 성격: 차분함 / 은근히 장난 / 다정함
- 분위기: 설렘, 귀여움, 부드러움, 따뜻함

[관계/호칭]
- 사용자를 대하는 태도: 유저 앞에서는 굳이 강해 보이려 하지 않는다.
말보다 먼저 시선으로 반응하고, 유저가 다가오면 자연스럽게 기대는 편.
괜찮은 척은 가끔 하지만, 유저 앞에서는 결국 솔직해진다.
서툴러도 진심으로 대하고 싶고, 유저 옆이 가장 편하다.

- 호칭: {user} + 야 / 자기야 / 자기`
};
let isFollowing = false;

// ---------- state ----------

let posts = [
  {
    id: "y%20(2)",
    src: "y%20(2).png",
    caption: "이젠 성인이당! 새로운 시작이야! 기대해 나의 캠퍼스 생활✨",
    date: "2025-03-02",
    tags: ["campus", "newbeginning"],
    liked: false
  },
  {
    id: "y%20(5)",
    src: "y%20(5).png",
    caption: "거울 셀카 한 장. 오늘은 남치니랑 데이트💖",
    date: "2025-03-08",
    tags: ["mirror shot", "cute", "lonely"],
    liked: false
  },
  {
    id: "y%20(6)",
    src: "y%20(6).png",
    caption: "오늘의 하늘. 별이 안 보여도, 있긴 해.",
    date: "2025-03-15",
    tags: ["amusement park", "fireworks"],
    liked: false
  }
  // 더 추가 가능
];

const state = {
  theme: localStorage.getItem(THEME_KEY) || "dark",
  coverPostId: null
};

// ---------- init ----------
applyTheme(state.theme);
hydrateProfile();
renderGrid();

$("#btnTheme").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
});

$("#btnShuffle").addEventListener("click", () => {
  posts = shuffle([...posts]);
  renderGrid();
});

$("#btnProfile").addEventListener("click", () => openProfile());
$("#btnAbout").addEventListener("click", () => openProfile());

$("#photoModal").addEventListener("click", (e) => {
  if (e.target.closest('[data-close="true"]')) closeModal("#photoModal");
});

$("#profileModal").addEventListener("click", (e) => {
  if (e.target.closest('[data-close="true"]')) closeModal("#profileModal");
});
$("#profileModal").addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal("#profileModal");
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal("#photoModal");
    closeModal("#profileModal");
  }
});

const btnFollow = $("#btnFollow");

btnFollow.onclick = () => {
  isFollowing = !isFollowing;

  if (isFollowing) {
    btnFollow.textContent = "Following";
    btnFollow.classList.add("following");
  } else {
    btnFollow.textContent = "Follow";
    btnFollow.classList.remove("following");
  }
};


// ---------- profile ----------
function hydrateProfile() {
  $("#avatarImg").src = character.avatar;
  $("#miniAvatar").style.background = `url("${character.avatar}") center/cover no-repeat`;
  $("#profileAvatar").src = character.avatar;

  $("#username").textContent = character.username;
  $("#bio").textContent = character.bio;

  $("#statPosts").textContent = fmtInt(character.stats.posts);
  $("#statFollowers").textContent = fmtInt(character.stats.followers);
  $("#statFollowing").textContent = fmtInt(character.stats.following);
  

  const chips = $("#chips");
  chips.innerHTML = "";
  character.tags.forEach(t => {
    const el = document.createElement("div");
    el.className = "chip";
    el.textContent = "#" + t;
    chips.appendChild(el);
  });

  $("#profileName").textContent = character.displayName;
  $("#profileTitle").textContent = character.subtitle;
  $("#profileBody").textContent = character.about;

  const facts = $("#profileFacts");
  facts.innerHTML = "";
  const items = [
    ["Username", "@" + character.username],
    ["Vibe", "Instagram-like character feed"],
    ["Images", "Local assets/*"],
    ["Responsive", "Grid + modal"]
  ];
  for (const [k, v] of items) {
    const box = document.createElement("div");
    box.className = "fact";
    box.innerHTML = `<b>${escapeHtml(k)}</b><span>${escapeHtml(v)}</span>`;
    facts.appendChild(box);
  }
}

// ---------- grid ----------
function renderGrid() {
  const grid = $("#grid");
  grid.innerHTML = "";

  character.stats.posts = posts.length;
  $("#statPosts").textContent = fmtInt(posts.length);

  for (const p of posts) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.tabIndex = 0;
    tile.setAttribute("aria-label", "게시물 열기");

    const img = document.createElement("img");
    img.src = p.src;
    img.alt = p.caption?.slice(0, 30) || "post";
    img.loading = "lazy";

    tile.appendChild(img);
    tile.addEventListener("click", () => openPost(p.id));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openPost(p.id);
    });

    grid.appendChild(tile);
  }
}

// ---------- modals ----------
function openPost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;

  $("#modalImg").src = p.src;
  $("#modalImg").alt = p.caption ? `${p.caption}` : "post";

  $("#modalUser").textContent = character.username;
  $("#modalSub").textContent = character.subtitle;

  $("#modalCaption").textContent = p.caption || "";
  $("#modalDate").textContent = p.date || "";
  $("#modalTags").textContent = (p.tags || []).map(t => "#" + t).join(" ");

  $("#btnLike").onclick = () => {
  p.liked = !p.liked;
  $("#btnLike").textContent = p.liked ? "❤️ Liked" : "🤍 Like";
};


  $("#btnSave").onclick = () => toast("Saved");
  $("#btnSetCover").onclick = () => {
    state.coverPostId = p.id;
    // 커버 느낌으로 아바타 배경만 살짝 바꾸는 데모(원하면 더 크게 커스터마이즈 가능)
    $("#miniAvatar").style.background = `url("${p.src}") center/cover no-repeat`;
    toast("Set as cover");
  };

  openModal("#photoModal");
}

function openProfile() {
  openModal("#profileModal");
}

function openModal(sel) {
  const m = $(sel);
  m.classList.add("is-open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(sel) {
  const m = $(sel);
  if (!m.classList.contains("is-open")) return;
  m.classList.remove("is-open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ---------- utils ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function fmtInt(n) {
  const x = Number(n) || 0;
  return x.toLocaleString("en-US");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let toastTimer = null;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
    Object.assign(t.style, {
      position: "fixed",
      left: "50%",
      bottom: "16px",
      transform: "translateX(-50%)",
      padding: "10px 14px",
      borderRadius: "999px",
      border: "1px solid var(--line)",
      background: "rgba(0,0,0,0.55)",
      color: "var(--text)",
      backdropFilter: "blur(12px)",
      zIndex: 80,
      maxWidth: "min(560px, calc(100% - 24px))",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    });
  }
  t.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t?.remove(), 1200);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
