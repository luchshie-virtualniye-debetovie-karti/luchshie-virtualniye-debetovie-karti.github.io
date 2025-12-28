(function () {
  const headingSelector = ".article h2, .article h3";
  const headings = Array.from(document.querySelectorAll(headingSelector));

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[«»"'.:,!?()]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Добавляем id заголовкам (если нет)
  headings.forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent || "");
  });

  const tocDesktop = document.getElementById("tocNavDesktop");
  const tocMobile = document.getElementById("tocNavMobile");

  function buildToc(container) {
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    headings.forEach((h) => {
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent || "";
      a.className = h.tagName === "H3" ? "depth-3" : "";
      frag.appendChild(a);
    });

    container.appendChild(frag);
  }

  buildToc(tocDesktop);
  buildToc(tocMobile);

  // Mobile toggle
  const toggle = document.getElementById("tocToggle");
  const body = document.getElementById("tocBody");
  if (toggle && body) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      body.hidden = expanded;
    });
  }

  // Подсветка активного пункта TOC при скролле
  const linksDesktop = tocDesktop ? Array.from(tocDesktop.querySelectorAll("a")) : [];
  const linksMobile = tocMobile ? Array.from(tocMobile.querySelectorAll("a")) : [];

  function setActive(id) {
    [...linksDesktop, ...linksMobile].forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  }

  if (headings.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      { root: null, threshold: 0.2, rootMargin: "-20% 0px -70% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    setActive(headings[0].id);
  }
})();
