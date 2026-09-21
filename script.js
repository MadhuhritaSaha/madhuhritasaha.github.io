/* ▒▒ Madhuhrita Saha — portfolio interactions ▒▒ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---- nav: scrolled state + burger ---- */
  const nav = $("#nav");
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });
  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open"); nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ---- scrollspy ---- */
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = $(`#navLinks a[href="#${e.target.id}"]`);
      if (link) link.classList.toggle("active", e.isIntersecting);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => spy.observe(s));

  /* ---- reveal on scroll (staggered) ---- */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add("in"), d);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => ro.observe(el));

  /* ---- hero stat count-up ---- */
  const counted = new WeakSet();
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      const end = +e.target.dataset.count, dur = 1200, t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        e.target.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3)))).padStart(2, "0");
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(el => co.observe(el));

  /* ---- typing rotator ---- */
  const words = ["VLSI & digital design", "embedded & edge AI", "sensing-to-intelligence systems", "research storytelling", "pointillism & folk art"];
  const tw = $("#typeWord");
  if (tw) {
    let w = 0, i = 0, del = false;
    (function type() {
      const word = words[w];
      tw.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(type, 55); }
      else if (!del) { del = true; setTimeout(type, 1900); }
      else if (i > 0) { i--; setTimeout(type, 26); }
      else { del = false; w = (w + 1) % words.length; setTimeout(type, 350); }
    })();
  }

  /* ---- explore all projects + filters ---- */
  const exploreBtn = $("#exploreBtn"), allProjects = $("#allProjects");
  exploreBtn?.addEventListener("click", () => {
    const open = allProjects.hidden;
    allProjects.hidden = !open;
    exploreBtn.textContent = open ? "Hide projects ↑" : "Explore all projects ↓";
    exploreBtn.setAttribute("aria-expanded", open);
    if (open) $$(".chip-btn")[0].click();
  });
  $$(".chip-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".chip-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".proj-card").forEach(c => c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f));
  }));

  /* ---- lightbox ---- */
  const items = $$("#gallery .g-item");
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let cur = 0;
  const show = n => {
    cur = (n + items.length) % items.length;
    const img = $("img", items[cur]);
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = items[cur].dataset.cap || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const hide = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  items.forEach((it, n) => it.addEventListener("click", () => show(n)));
  $("#lbClose")?.addEventListener("click", hide);
  $("#lbPrev")?.addEventListener("click", e => { e.stopPropagation(); show(cur - 1); });
  $("#lbNext")?.addEventListener("click", e => { e.stopPropagation(); show(cur + 1); });
  lb?.addEventListener("click", e => { if (e.target === lb) hide(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  /* ---- back to top + footer year ---- */
  const toTop = $("#toTop");
  addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 700), { passive: true });
  toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();
})();
