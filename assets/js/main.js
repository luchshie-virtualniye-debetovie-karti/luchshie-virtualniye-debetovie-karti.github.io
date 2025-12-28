(() => {
  const headingSelector = ".article h2, .article h3";
  const headings = Array.from(document.querySelectorAll(headingSelector));

  const slugify = (text) =>
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/[«»"'.:,!?()]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Добавляем id заголовкам
  headings.forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent);
  });

  const tocDesktop = document.getElementById("tocNavDesktop");
  const tocMobile = document.getElementById("tocNavMobile");

  const buildToc = (container) => {
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    headings.forEach((h) => {
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent || "";
      if (h.tagName === "H3") a.className = "depth-3";
      frag.appendChild(a);
    });

    container.appendChild(frag);
  };

  buildToc(tocDesktop);
  buildToc(tocMobile);

  // Toggle mobile TOC
  const toggle = document.getElementById("tocToggle");
  const body = document.getElementById("tocBody");
  if (toggle && body) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      body.hidden = expanded;
    });
  }

  // Подсветка активного пункта TOC
  const allLinks = [
    ...(tocDesktop ? Array.from(tocDesktop.querySelectorAll("a")) : []),
    ...(tocMobile ? Array.from(tocMobile.querySelectorAll("a")) : []),
  ];

  const setActive = (id) => {
    allLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    });
  };

  if (headings.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { threshold: 0.2, rootMargin: "-20% 0px -70% 0px" }
    );

    headings.forEach((h) => obs.observe(h));
    setActive(headings[0].id);
  }
})();
