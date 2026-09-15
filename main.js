document.addEventListener("DOMContentLoaded", () => {
  const appEl = document.getElementById("app");
  const introEl = document.querySelector(".intro-screen");

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      const targetY =
        targetEl.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    });
  });

  const spawnFallingText = (message, x, y) => {
    const el = document.createElement("div");
    el.className = "falling-text";
    el.textContent = message;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const direction = Math.random() < 0.5 ? -1 : 1;
    el.style.setProperty(
      "--dx",
      `${direction * (10 + Math.random() * 20)}px`,
    );
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  };

  document.querySelectorAll(".project-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const message =
        link.dataset.kind === "preview"
          ? "正在赶来的路上"
          : "作者会尽快开源的！";
      spawnFallingText(message, event.clientX, event.clientY);
    });
  });

  const adjustIntroForSmallScreen = () => {
    const titleEl = document.querySelector(".intro-title");
    if (!appEl || !titleEl) return;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    appEl.classList.toggle(
      "intro-compact",
      titleEl.getBoundingClientRect().width > viewportWidth * 0.98,
    );
  };

  const updateEnterState = () => {
    if (!appEl || !introEl) return;
    const hasEntered = window.scrollY > window.innerHeight * 0.3;
    appEl.classList.toggle("compact-header", hasEntered);
    introEl.classList.toggle("intro-hidden", hasEntered);
  };

  adjustIntroForSmallScreen();
  updateEnterState();
  window.addEventListener("resize", adjustIntroForSmallScreen);
  window.addEventListener("scroll", updateEnterState, { passive: true });

  document.querySelectorAll(".reveal").forEach((el) => {
    const activate = () => {
      el.classList.remove("reveal-pending");
      el.classList.add("reveal-active");
    };

    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      activate();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      activate();
      return;
    }

    el.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          activate();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
  });
});
