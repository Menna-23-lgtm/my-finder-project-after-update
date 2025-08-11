const menuToggle = document.querySelector(".menu-toggle");
const listes = document.querySelector(".listes");

menuToggle.addEventListener("click", () => {
  listes.classList.toggle("active");
});

const themeToggle = document.querySelector(".nav_right i");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeToggle.classList.replace("fa-sun", "fa-moon");
  } else {
    themeToggle.classList.replace("fa-moon", "fa-sun");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const customizeBtn = document.querySelector(".customize-btn");
  if (!customizeBtn) {
    console.warn(".customize-btn not found");
    return;
  }

  let panel = document.querySelector(".customize-panel");
  const PANEL_WIDTH = 240;

  if (!panel) {
    panel = document.createElement("div");
    panel.className = "customize-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-hidden", "true");
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      right: -${PANEL_WIDTH + 20}px;
      transform: translateY(-50%);
      width: ${PANEL_WIDTH}px;
      max-width: 80%;
      background: #fff;
      padding: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      border-radius: 10px 0 0 10px;
      z-index: 99999;
      transition: right 300ms ease;
      font-family: inherit;
    `;
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0;font-size:14px">Choose primary color</h3>
        <button class="cp-close" aria-label="Close" style="border:none;background:transparent;font-size:18px;cursor:pointer;line-height:1">✕</button>
      </div>
      <div class="cp-colors" style="display:flex;gap:8px;flex-wrap:wrap"></div>
      <div style="margin-top:10px;font-size:12px;color:#666">Current: <span class="cp-current" style="font-weight:700"></span></div>
    `;
    document.body.appendChild(panel);
  }

  const colors = [
    "#e2574c",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#607d8b",
    "#00bcd4",
    "#795548",
    "#d737ff",
    "#317a7d",
  ];
  const colorsWrap = panel.querySelector(".cp-colors");

  if (colorsWrap.children.length === 0) {
    colors.forEach((color) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cp-color";
      btn.dataset.color = color;
      btn.title = color;
      btn.style.cssText = `
        width:34px; height:34px; border-radius:50%; border:2px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.12); background:${color}; cursor:pointer; padding:0; margin:0;
      `;
      colorsWrap.appendChild(btn);
    });
  }

  const closeBtn = panel.querySelector(".cp-close");
  const currentSpan = panel.querySelector(".cp-current");

  const savedColor = localStorage.getItem("primaryColor");
  if (savedColor) {
    updateColors(savedColor);
    if (currentSpan) currentSpan.textContent = savedColor;
  } else if (currentSpan) {
    currentSpan.textContent = "—";
  }

  function openPanel() {
    const rect = customizeBtn.getBoundingClientRect();
    const right = Math.max(8, window.innerWidth - rect.left);
    panel.style.right = `${right}px`;
    panel.classList.add("active");
    panel.setAttribute("aria-hidden", "false");
    panel.dataset.open = "true";
    const firstColor = panel.querySelector(".cp-color");
    if (firstColor) firstColor.focus();
  }

  function closePanel() {
    panel.style.right = `-${PANEL_WIDTH + 20}px`;
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden", "true");
    delete panel.dataset.open;
    customizeBtn.focus();
  }

  function togglePanel() {
    if (panel.dataset.open) closePanel();
    else openPanel();
  }

  customizeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePanel();
    });
  }

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest(".cp-color");
    if (!btn) return;
    const color = btn.dataset.color;
    if (!color) return;
    updateColors(color);
    localStorage.setItem("primaryColor", color);
    if (currentSpan) currentSpan.textContent = color;
  });

  function updateColors(color) {
    document.documentElement.style.setProperty("--primary-color", color);

    const bt1 = document.querySelector(".bt1");
    if (bt1) bt1.style.backgroundColor = color;

    document.querySelectorAll(".tags button").forEach((btn) => {
      btn.style.borderColor = color;
    });

    document.querySelectorAll(".icon, .nav_right i").forEach((icon) => {
      icon.style.color = color;
    });

    document.querySelectorAll(".logo svg path").forEach((path) => {
      const fill = path.getAttribute("fill");
      if (
        fill &&
        fill.toLowerCase() !== "#fff" &&
        fill.toLowerCase() !== "white" &&
        fill.toLowerCase() !== "none"
      ) {
        path.setAttribute("fill", color);
      }
    });

    const hero = document.querySelector(".hero");
    if (hero) hero.style.backgroundColor = color;

    const searchBtn = document.querySelector(".search-btn");
    if (searchBtn) searchBtn.style.backgroundColor = color;

  }

  document.addEventListener("click", (e) => {
    if (!panel.dataset.open) return;
    if (
      e.target.closest(".customize-panel") ||
      e.target.closest(".customize-btn")
    )
      return;
    closePanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.dataset.open) closePanel();
  });

  window.addEventListener("resize", () => {
    if (panel.dataset.open) openPanel();
  });
});
