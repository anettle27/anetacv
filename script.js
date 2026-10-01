// Simple hash-based tabs: #home, #education, #experience, #projects,
// plus one page per project: #projects/project-one, #projects/project-two, …
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

  document.body.dataset.view = target;
  pages.forEach((page) => { page.hidden = page.dataset.page !== target; });
  links.forEach((link) => {
    if (link.dataset.tab === tab) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeDropdowns();
  window.scrollTo({ top: 0 });
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

window.addEventListener("hashchange", showTab);
showTab();

// Home page: type out each phrase, pause, clear it, type the next
const output = document.querySelector(".rotator-text");
const phrases = [...document.querySelectorAll(".phrases li")].map((li) => li.textContent.trim());
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TYPE_MS = 65;
const HOLD_MS = 2200;
const GAP_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function rotate() {
  for (let i = 0; ; i = (i + 1) % phrases.length) {
    const phrase = phrases[i];

    if (reduceMotion) {
      output.textContent = phrase;
      await wait(3000);
      continue;
    }

    for (let n = 1; n <= phrase.length; n++) {
      output.textContent = phrase.slice(0, n);
      await wait(TYPE_MS);
    }
    await wait(HOLD_MS);
    output.textContent = "";
    await wait(GAP_MS);
  }
}

if (output && phrases.length) rotate();
