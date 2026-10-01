// Simple hash-based tabs: #home, #education, #experience, #projects,
// plus one page per project: #projects/3d-imaging, #projects/campfire-prague, …
const pages = document.querySelectorAll("[data-page]");
const links = document.querySelectorAll("[data-tab]");
const dropdowns = [
  { root: document.querySelector(".menu"), toggle: document.querySelector(".menu-toggle") },
  { root: document.querySelector(".lang"), toggle: document.querySelector(".lang-toggle") },
];

function showTab() {
  const name = location.hash.slice(1);
  const target = [...pages].some((page) => page.dataset.page === name) ? name : "home";
  const tab = target.split("/")[0];
  const wasHome = document.body.dataset.view === "home";

  document.body.dataset.view = target;
  pages.forEach((page) => { page.hidden = page.dataset.page !== target; });
  links.forEach((link) => {
    if (link.dataset.tab === tab) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeDropdowns();
  window.scrollTo({ top: 0 });

  // Arriving on the home page always starts the subtext from the first phrase
  if (target === "home" && !wasHome) startRotator();
}

// Dropdowns: the phone menu and the language picker
function closeDropdowns(except) {
  dropdowns.forEach((d) => {
    if (d === except) return;
    d.root.classList.remove("open");
    d.toggle.setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach((d) => {
  d.toggle.addEventListener("click", () => {
    closeDropdowns(d);
    const open = d.root.classList.toggle("open");
    d.toggle.setAttribute("aria-expanded", String(open));
  });
});

document.addEventListener("click", (e) => {
  if (!dropdowns.some((d) => d.root.contains(e.target))) closeDropdowns();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdowns();
});

// Switching language keeps you on the same tab
document.querySelectorAll(".lang-list a").forEach((a) => {
  a.addEventListener("click", () => {
    a.href = a.getAttribute("href").split("#")[0] + location.hash;
  });
});

// Home page: type out each phrase, pause, clear it, type the next
const output = document.querySelector(".rotator-text");
const phrases = [...document.querySelectorAll(".phrases li")].map((li) => li.textContent.trim());
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TYPE_MS = 65;
const HOLD_MS = 2200;
const GAP_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let run = 0; // bumped on every restart so an older loop knows to stop

async function rotate(id) {
  for (let i = 0; ; i = (i + 1) % phrases.length) {
    const phrase = phrases[i];

    if (reduceMotion) {
      output.textContent = phrase;
      await wait(3000);
      if (id !== run) return;
      continue;
    }

    for (let n = 1; n <= phrase.length; n++) {
      if (id !== run) return;
      output.textContent = phrase.slice(0, n);
      await wait(TYPE_MS);
    }
    await wait(HOLD_MS);
    if (id !== run) return;
    output.textContent = "";
    await wait(GAP_MS);
  }
}

function startRotator() {
  if (!output || !phrases.length) return;
  output.textContent = "";
  rotate(++run);
}

// Soft glow that trails the mouse (stays parked in the corner on touch screens)
const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = 0, y = window.innerHeight, tx = x, ty = y, moving = false;

  const step = () => {
    x += (tx - x) * (reduceMotion ? 1 : 0.12);
    y += (ty - y) * (reduceMotion ? 1 : 0.12);
    glow.style.transform = `translate(${x}px, ${y}px)`;
    moving = Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5;
    if (moving) requestAnimationFrame(step);
  };

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!moving) { moving = true; requestAnimationFrame(step); }
  });
}

window.addEventListener("hashchange", showTab);
showTab();
