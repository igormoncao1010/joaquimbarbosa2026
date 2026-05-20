const canvas = document.querySelector("#grain-canvas");
const ctx = canvas.getContext("2d");
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll("[data-reveal]");
const statementTrack = document.querySelector(".statement-track");
const mapTitle = document.querySelector("#map-title");
const mapText = document.querySelector("#map-text");
const dots = document.querySelectorAll(".pulse-dot");
const timelineButtons = document.querySelectorAll(".timeline-item");
const panelTitle = document.querySelector("#panel-title");
const panelText = document.querySelector("#panel-text");
const form = document.querySelector(".signup-form");
const formNote = document.querySelector(".form-note");
const hero = document.querySelector(".hero");
const heroReveal = document.querySelector(".hero-image-reveal");
const galleryMain = document.querySelector("#gallery-main");
const galleryTitle = document.querySelector("#gallery-title");
const galleryCredit = document.querySelector("#gallery-credit");
const galleryFeature = document.querySelector(".gallery-feature");
const galleryThumbs = document.querySelectorAll(".gallery-thumb");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const careerButtons = document.querySelectorAll(".career-point");
const careerTitle = document.querySelector("#career-title");
const careerText = document.querySelector("#career-text");

const timelineContent = {
  escuta: {
    title: "Encontros territoriais",
    text: "Rodas de conversa com lideranças comunitárias, professores, empreendedores, artistas e trabalhadores."
  },
  plano: {
    title: "Propostas abertas",
    text: "Contribuições organizadas por tema, com prioridades claras e devolutivas públicas para a sociedade acompanhar."
  },
  rua: {
    title: "Mobilização nacional",
    text: "Ações locais conectadas por voluntários, coletivos culturais, universidades e redes de participação democrática."
  }
};

const galleryPhotos = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa%20em%202012.JPG",
    title: "Joaquim Barbosa em 2012",
    credit: "Wikimedia Commons / Agência Brasil"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20barbosa%20stf.jpg",
    title: "Joaquim Barbosa no STF",
    credit: "Wikimedia Commons / Agência Brasil"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa%20em%20sua%20posse%2C%207%20de%20maio%20de%202003.jpg",
    title: "Posse no Supremo Tribunal Federal",
    credit: "Wikimedia Commons"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa%20na%20Universidade%20de%20Bras%C3%ADlia.jpg",
    title: "Joaquim Barbosa na Universidade de Brasília",
    credit: "Wikimedia Commons"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa%20na%20Universidade%20de%20Bras%C3%ADlia%20foto%202.jpg",
    title: "Encontro na Universidade de Brasília",
    credit: "Wikimedia Commons"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa%20durante%20o%20julgamento%20do%20mensal%C3%A3o%202012%20%28cropped%29.JPG",
    title: "Durante o julgamento do mensalão",
    credit: "Wikimedia Commons / Agência Brasil"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Joaquim%20Barbosa-21-11-2012-edit.jpg",
    title: "Joaquim Barbosa em 21/11/2012",
    credit: "Wikimedia Commons"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Ministro%20Joaquim%20Barbosa%20%C3%A9%20recebido%20no%20gabinete%20do%20vice-presidente%20Michel%20Temer%20%28cropped%29.jpg",
    title: "Recebido no gabinete da Vice-Presidência",
    credit: "Wikimedia Commons"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/O%20ministro%20do%20STF%20Joaquim%20Barbosa.jpg",
    title: "O ministro do STF Joaquim Barbosa",
    credit: "Wikimedia Commons"
  }
];

const careerContent = {
  stf: {
    title: "STF",
    text: "Nomeado para o Supremo Tribunal Federal em 2003, construiu uma atuação reconhecida pela independência e pelo peso técnico em temas de grande repercussão nacional."
  },
  mensalao: {
    title: "Mensalão",
    text: "Como relator da Ação Penal 470, tornou-se uma das figuras centrais do julgamento do mensalão, episódio que projetou sua imagem de rigor contra a corrupção."
  },
  presidencia: {
    title: "Presidência do STF",
    text: "Ao assumir a presidência do Supremo, tornou-se símbolo histórico de representação e abriu uma imagem pública associada a coragem institucional."
  },
  formacao: {
    title: "Formação e método",
    text: "Sua trajetória inclui atuação no Ministério Público Federal, experiência acadêmica e formação em direito público, elementos que sustentam seu perfil técnico."
  }
};

let currentGalleryIndex = 0;

const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

let particles = [];

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: Math.min(82, Math.floor(window.innerWidth / 14)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.5,
    vx: Math.random() * 0.35 - 0.17,
    vy: Math.random() * 0.35 - 0.12
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(16,16,15,0.34)";

  particles.forEach((particle) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

    if (distance < 150) {
      particle.x -= dx * 0.0015;
      particle.y -= dy * 0.0015;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function updateScrollEffects() {
  const scrollY = window.scrollY;

  if (heroReveal) {
    heroReveal.style.transform = `translateY(${scrollY * 0.08}px)`;
  }

  if (statementTrack) {
    statementTrack.style.setProperty("--marquee", `${-scrollY * 0.28}px`);
  }

  header.style.minHeight = scrollY > 60 ? "52px" : "58px";
}

function moveHeroReveal(event) {
  if (!heroReveal) return;
  const rect = heroReveal.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  heroReveal.style.setProperty("--reveal-x", `${x}%`);
  heroReveal.style.setProperty("--reveal-y", `${y}%`);
  heroReveal.style.setProperty("--reveal-size", window.matchMedia("(max-width: 820px)").matches ? "118px" : "170px");
  heroReveal.classList.add("is-revealing");
}

function hideHeroReveal(event) {
  if (!heroReveal || event.pointerType === "touch") return;
  heroReveal.classList.remove("is-revealing");
  heroReveal.style.setProperty("--reveal-size", "0px");
}

menuButton.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    dots.forEach((item) => item.classList.remove("active"));
    dot.classList.add("active");
    mapTitle.textContent = dot.dataset.title;
    mapText.textContent = dot.dataset.text;
  });
});

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timelineButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const content = timelineContent[button.dataset.panel];
    panelTitle.textContent = content.title;
    panelText.textContent = content.text;
  });
});

function setGalleryPhoto(index) {
  if (!galleryMain) return;
  currentGalleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[currentGalleryIndex];

  galleryFeature?.classList.add("is-changing");

  window.setTimeout(() => {
    galleryMain.src = photo.src;
    galleryMain.alt = photo.title;
    galleryTitle.textContent = photo.title;
    galleryCredit.textContent = photo.credit;
    galleryThumbs.forEach((thumb) => {
      thumb.classList.toggle("active", Number(thumb.dataset.galleryIndex) === currentGalleryIndex);
    });
    galleryFeature?.classList.remove("is-changing");
  }, 120);
}

galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    setGalleryPhoto(Number(thumb.dataset.galleryIndex));
  });
});

galleryPrev?.addEventListener("click", () => setGalleryPhoto(currentGalleryIndex - 1));
galleryNext?.addEventListener("click", () => setGalleryPhoto(currentGalleryIndex + 1));

careerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = careerContent[button.dataset.career];
    if (!content) return;

    careerButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    careerTitle.textContent = content.title;
    careerText.textContent = content.text;
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

if (hero && heroReveal) {
  hero.addEventListener("pointermove", moveHeroReveal);
  hero.addEventListener("pointerdown", moveHeroReveal);
  hero.addEventListener("pointerleave", hideHeroReveal);
  hero.addEventListener("pointercancel", () => {
    heroReveal.classList.remove("is-revealing");
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("nome")?.toString().trim();
  formNote.textContent = name
    ? `${name}, sua intenção foi registrada neste protótipo.`
    : "Sua intenção foi registrada neste protótipo.";
  form.reset();
});

window.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawParticles();
updateScrollEffects();
