const COLORS = ["#3B82F6", "#14B8A6", "#F43F5E", "#A855F7", "#F59E0B"];

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  nodes.forEach((el) => io.observe(el));
}

function initMockCycle() {
  const windowEl = document.getElementById("mock-window");
  const hexEl = document.getElementById("mock-hex");
  if (!windowEl || !hexEl) return;

  let i = 0;
  const swatches = windowEl.querySelectorAll(".mock-swatch");

  function apply(color) {
    windowEl.style.setProperty("--mock-color", color);
    hexEl.textContent = color;
    if (swatches[0]) swatches[0].style.background = color;
  }

  apply(COLORS[0]);
  window.setInterval(() => {
    i = (i + 1) % COLORS.length;
    apply(COLORS[i]);
  }, 2800);
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initMockCycle();
});
