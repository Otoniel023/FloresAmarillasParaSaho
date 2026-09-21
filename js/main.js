/* ============================================
   Flores Amarillas para Saho — lógica
   ============================================ */

/* ------------------------------------------------------------
   CONFIG: edita aquí el nombre y las fotos.
   Cuando tengas las fotos reales:
     1. Cópialas dentro de la carpeta /fotos
     2. Agrega una línea por foto en el arreglo "photos" de abajo,
        con la ruta y (opcional) una frase/caption.
   El carrusel acepta fotos verticales, horizontales, claras u
   oscuras: cada una se enmarca con un fondo desenfocado tomado
   de la misma imagen, así que siempre contrasta bien.
------------------------------------------------------------- */
const CONFIG = {
  novia: "mi persona favorita",
  photos: [
    { src: "fotos/3.jpg", caption: "Flores para ti" },
    { src: "fotos/1.jpg", caption: "Nosotros, de noche" },
    { src: "fotos/2.jpg", caption: "Riendo de la nada" },
  ],
};

/* ------------------------------------------------------------
   Flor amarilla, dibujada a mano en SVG (sin <use>/<defs> para
   que se vea igual en cualquier navegador). Dos variantes:
   una flor completa de 5 pétalos con centro texturizado, y un
   pétalo suelto para la lluvia de fondo.
------------------------------------------------------------- */
const FLOWER_INNER = (() => {
  const petal = (angle) => `
    <path transform="rotate(${angle} 32 32)" d="M32 32C23 27 22 9 32 3C42 9 41 27 32 32Z" fill="#FFC72C"/>
    <path transform="rotate(${angle} 32 32)" d="M32 30C26 26 26 13 32 8C38 13 38 26 32 30Z" fill="#FFE18A" opacity=".7"/>`;
  const petals = [0, 72, 144, 216, 288].map(petal).join("");
  const seeds = [0, 51, 102, 154, 206, 257, 309]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      const x = (32 + Math.cos(rad) * 4.4).toFixed(1);
      const y = (32 + Math.sin(rad) * 4.4).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="1" fill="#B85E12"/>`;
    })
    .join("");
  return `${petals}<circle cx="32" cy="32" r="8.5" fill="#E8871E"/><circle cx="32" cy="32" r="8.5" fill="none" stroke="#C96A12" stroke-width=".6" opacity=".5"/>${seeds}`;
})();

const PETAL_INNER = `
  <path d="M32 40C23 35 22 15 32 6C42 15 41 35 32 40Z" fill="#FFC72C"/>
  <path d="M32 37C27 33 27 18 32 11C37 18 37 33 32 37Z" fill="#FFE18A" opacity=".6"/>
  <path d="M32 9L32 35" stroke="#E8871E" stroke-width=".8" opacity=".4" stroke-linecap="round"/>`;

function flowerSVG(size, variant) {
  const inner = variant === "petal" ? PETAL_INNER : FLOWER_INNER;
  const wh = size ? ` width="${size}" height="${size}"` : "";
  return `<svg viewBox="0 0 64 64"${wh} aria-hidden="true">${inner}</svg>`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-editable]').forEach(el => {
    if (CONFIG.novia) el.textContent = CONFIG.novia;
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll("[data-flower]").forEach((el) => {
    el.innerHTML = FLOWER_INNER;
  });

  initPetals();
  initScrollReveal();
  initProgressBar();
  initCarousel();
  initSurprise();
});

/* ---------------- Lluvia de pétalos ---------------- */
function initPetals() {
  const container = document.getElementById("petals");
  const count = window.innerWidth < 700 ? 14 : 24;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    const variant = Math.random() < 0.6 ? "flower" : "petal";
    petal.innerHTML = flowerSVG(Math.round(rand(12, 24)), variant);

    const left = rand(0, 100);
    const fallDuration = rand(9, 20);
    const swayDuration = rand(3, 6);
    const delay = rand(0, 20);

    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `-${delay}s, -${rand(0, 4)}s`;
    petal.style.opacity = (rand(4, 9) / 10).toFixed(2);

    container.appendChild(petal);
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---------------- Reveal on scroll ---------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-fade, .reveal-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------------- Barra de progreso ---------------- */
function initProgressBar() {
  const bar = document.getElementById("progressBar");
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------- Carrusel personalizado (coverflow) ---------------- */
function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const photos = CONFIG.photos.length ? CONFIG.photos : [{ src: "", caption: "" }];
  let current = 0;
  let autoplayTimer = null;

  const placeholderIcon = flowerSVG(36, "flower");

  // Construye los slides
  photos.forEach((photo, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.dataset.index = i;

    const frame = document.createElement("div");
    frame.className = "slide-frame";

    if (photo.src) {
      const backdrop = document.createElement("div");
      backdrop.className = "slide-backdrop";
      backdrop.style.backgroundImage = `url('${photo.src}')`;
      frame.appendChild(backdrop);

      const img = document.createElement("img");
      img.className = "slide-photo";
      img.src = photo.src;
      img.alt = photo.caption || `Foto ${i + 1}`;
      img.loading = "lazy";
      frame.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "slide-placeholder";
      ph.innerHTML = `${placeholderIcon}<span>Foto próximamente</span>`;
      frame.appendChild(ph);
    }

    const caption = document.createElement("div");
    caption.className = "slide-caption";
    caption.textContent = photo.caption || "";

    slide.appendChild(frame);
    slide.appendChild(caption);
    slide.addEventListener("click", () => {
      if (Number(slide.dataset.index) !== current) goTo(Number(slide.dataset.index));
    });

    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `Ir a la foto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);

  function render() {
    const total = slides.length;
    slides.forEach((slide, i) => {
      let pos = i - current;
      if (pos > total / 2) pos -= total;
      if (pos < -total / 2) pos += total;

      if (pos < -2 || pos > 2) {
        slide.dataset.pos = "hidden";
      } else {
        slide.dataset.pos = String(pos);
      }
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function goTo(index) {
    const total = slides.length;
    current = ((index % total) + total) % total;
    render();
    restartAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", (e) => {
    const rect = track.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Swipe / drag
  let startX = 0;
  let dragging = false;

  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
  });
  window.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      diff < 0 ? next() : prev();
    }
  });

  // Autoplay
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 4500);
  }
  track.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  track.addEventListener("mouseleave", restartAutoplay);

  render();
  restartAutoplay();
}

/* ---------------- Botón sorpresa + confeti ---------------- */
function initSurprise() {
  const btn = document.getElementById("surpriseBtn");
  const msg = document.getElementById("surpriseMessage");

  btn.addEventListener("click", () => {
    btn.classList.add("opened");
    msg.classList.add("show");
    launchConfetti();
  }, { once: true });
}

function launchConfetti() {
  const count = 40;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = Math.round(rand(10, 24));
    const variant = Math.random() < 0.7 ? "flower" : "petal";
    piece.innerHTML = flowerSVG(size, variant);

    const left = rand(0, 100);
    const duration = rand(2.2, 4);
    const rotateEnd = rand(360, 900) * (Math.random() > 0.5 ? 1 : -1);
    const driftX = rand(-120, 120);

    piece.style.left = `${left}vw`;

    const anim = piece.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${driftX}px, 105vh) rotate(${rotateEnd}deg)`, opacity: 0.9 },
      ],
      { duration: duration * 1000, easing: "cubic-bezier(.25,.46,.45,.94)" }
    );

    document.body.appendChild(piece);
    anim.onfinish = () => piece.remove();
  }
}
