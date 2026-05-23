const canvas = document.querySelector("#grain-canvas");
const ctx = canvas?.getContext("2d");
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
const supportCard = document.querySelector("#support-card");
const cardName = document.querySelector("#card-name");
const cardCity = document.querySelector("#card-city");
const cardPhotoInput = document.querySelector("#card-photo");
const cardStyleInputs = document.querySelectorAll('input[name="card-style"]');
const downloadCard = document.querySelector("#download-card");
const cardStatus = document.querySelector("#card-status");
const profileCard = document.querySelector("#profile-card");
const profilePhotoInput = document.querySelector("#profile-photo");
const profileStyleInputs = document.querySelectorAll('input[name="profile-style"]');
const downloadProfile = document.querySelector("#download-profile");
const profileStatus = document.querySelector("#profile-status");

const timelineContent = {
  escuta: {
    title: "Encontros territoriais",
    text: "Rodas de conversa com lideranças comunitárias, professores, empreendedores, artistas e trabalhadores."
  },
  plano: {
    title: "Propostas abertas",
    text: "Contribuicoes organizadas por tema, com prioridades claras e devolutivas publicas para a sociedade acompanhar."
  },
  rua: {
    title: "Mobilização nacional",
    text: "Acoes locais conectadas por voluntarios, coletivos culturais, universidades e redes de participacao democratica."
  }
};

let cardLogo = null;
let cardPhoto = null;
let profilePhoto = null;
let particles = [];

const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

function resizeCanvas() {
  if (!canvas || !ctx) return;

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
  if (!canvas || !ctx) return;

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
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
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

  if (header) {
    header.style.minHeight = scrollY > 60 ? "52px" : "58px";
  }
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

function getCardStyle() {
  const selected = document.querySelector('input[name="card-style"]:checked');
  return selected?.value || "brasil";
}

function getProfileStyle() {
  const selected = document.querySelector('input[name="profile-style"]:checked');
  return selected?.value || "brasil";
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }

    if (index === words.length - 1) context.fillText(line, x, currentY);
  });

  return currentY;
}

function drawCoverImage(context, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function roundedRectangle(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function getFitFontSize(context, text, maxWidth, startSize, minSize) {
  let size = startSize;
  while (size > minSize) {
    context.font = `900 ${size}px Arial`;
    if (context.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

function drawSupportCard() {
  if (!supportCard) return;

  const context = supportCard.getContext("2d");
  const width = supportCard.width;
  const height = supportCard.height;
  const name = cardName?.value.trim() || "Seu nome";
  const city = cardCity?.value.trim() || "Sua cidade";
  const style = getCardStyle();
  const styles = {
    brasil: ["#006b44", "#ffcf2e", "#0b4ea2"],
    noite: ["#071926", "#123950", "#ffcf2e"],
    solar: ["#ffcf2e", "#fff8d6", "#006b44"]
  };
  const palette = styles[style] || styles.brasil;

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.55, palette[1]);
  gradient.addColorStop(1, palette[2]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(7,25,38,0.58)";
  context.fillRect(0, 0, width, height);

  const photoBox = { x: 650, y: 610, size: 330 };
  const textMaxWidth = cardPhoto?.complete ? 520 : 880;

  if (cardPhoto?.complete) {
    context.save();
    roundedRectangle(context, photoBox.x, photoBox.y, photoBox.size, photoBox.size, 36);
    context.clip();
    drawCoverImage(context, cardPhoto, photoBox.x, photoBox.y, photoBox.size, photoBox.size);
    context.restore();

    context.strokeStyle = "#ffcf2e";
    context.lineWidth = 10;
    roundedRectangle(context, photoBox.x, photoBox.y, photoBox.size, photoBox.size, 36);
    context.stroke();
  }

  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.lineWidth = 4;
  for (let x = -width; x < width * 2; x += 86) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + width, height);
    context.stroke();
  }

  context.fillStyle = "rgba(255,207,46,0.9)";
  context.beginPath();
  context.arc(width - 120, 120, 160, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = "900 52px Arial";
  context.fillText("EU APOIO", 86, 150);

  if (cardLogo?.complete) {
    const logoWidth = 560;
    const logoHeight = (cardLogo.naturalHeight / cardLogo.naturalWidth) * logoWidth;
    context.drawImage(cardLogo, 80, 230, logoWidth, logoHeight);
  } else {
    context.font = "900 96px Arial";
    context.fillText("JOAQUIM BARBOSA", 80, 330);
  }

  context.fillStyle = "#ffcf2e";
  context.font = "900 56px Arial";
  drawWrappedText(context, "PELO BEM DO BRASIL", 86, 512, 780, 64);

  context.fillStyle = "#ffffff";
  const nameText = name.toUpperCase();
  const nameFontSize = getFitFontSize(context, nameText, textMaxWidth, 72, 42);
  context.font = `900 ${nameFontSize}px Arial`;
  drawWrappedText(context, nameText, 86, 780, textMaxWidth, nameFontSize + 10);

  context.fillStyle = "rgba(255,255,255,0.82)";
  const cityText = city.length > 34 ? `${city.slice(0, 31)}...` : city;
  context.font = "500 38px Arial";
  context.fillText(cityText, 86, 910);

  context.fillStyle = "rgba(255,255,255,0.92)";
  context.font = "900 34px Arial";
  context.fillText("FRENTE NEGRA BRASILEIRA", 86, 1170);

  context.fillStyle = "rgba(255,255,255,0.72)";
  context.font = "500 28px Arial";
  context.fillText("pro Joaquim Barbosa", 86, 1210);

  context.fillStyle = "#ffcf2e";
  context.fillRect(86, 1244, 300, 12);
}

function drawProfileCard() {
  if (!profileCard) return;

  const context = profileCard.getContext("2d");
  const width = profileCard.width;
  const height = profileCard.height;
  const style = getProfileStyle();
  const palette = style === "noite" ? ["#071926", "#0b4ea2", "#ffcf2e"] : ["#006b44", "#ffcf2e", "#0b4ea2"];
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.55, palette[1]);
  gradient.addColorStop(1, palette[2]);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(7,25,38,0.22)";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.lineWidth = 5;
  for (let x = -width; x < width * 2; x += 96) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + width, height);
    context.stroke();
  }

  const centerX = width / 2;
  const centerY = 440;
  const radius = 310;

  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.clip();
  if (profilePhoto?.complete) {
    drawCoverImage(context, profilePhoto, centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else {
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.font = "900 42px Arial";
    context.fillText("SUA FOTO", centerX, centerY + 12);
  }
  context.restore();

  context.strokeStyle = "#ffcf2e";
  context.lineWidth = 24;
  context.beginPath();
  context.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#071926";
  context.fillRect(0, 790, width, 290);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "900 48px Arial";
  context.fillText("EU APOIO", centerX, 860);
  context.fillStyle = "#ffcf2e";
  context.font = "900 54px Arial";
  context.fillText("JOAQUIM BARBOSA", centerX, 930);
  context.fillStyle = "rgba(255,255,255,0.78)";
  context.font = "500 30px Arial";
  context.fillText("Frente Negra Brasileira", centerX, 990);
}

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    dots.forEach((item) => item.classList.remove("active"));
    dot.classList.add("active");
    if (mapTitle) mapTitle.textContent = dot.dataset.title;
    if (mapText) mapText.textContent = dot.dataset.text;
  });
});

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timelineButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const content = timelineContent[button.dataset.panel];
    if (!content) return;
    if (panelTitle) panelTitle.textContent = content.title;
    if (panelText) panelText.textContent = content.text;
  });
});

cardName?.addEventListener("input", drawSupportCard);
cardCity?.addEventListener("input", drawSupportCard);
cardStyleInputs.forEach((input) => input.addEventListener("change", drawSupportCard));
profileStyleInputs.forEach((input) => input.addEventListener("change", drawProfileCard));

cardPhotoInput?.addEventListener("change", () => {
  const file = cardPhotoInput.files?.[0];

  if (!file) {
    cardPhoto = null;
    if (cardStatus) cardStatus.textContent = "O card será baixado como PNG.";
    drawSupportCard();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    cardPhoto = new Image();
    cardPhoto.onload = () => {
      if (cardStatus) cardStatus.textContent = "Foto adicionada ao card.";
      drawSupportCard();
    };
    cardPhoto.onerror = () => {
      cardPhoto = null;
      if (cardStatus) cardStatus.textContent = "Não foi possível carregar essa foto.";
      drawSupportCard();
    };
    cardPhoto.src = reader.result;
  };
  reader.readAsDataURL(file);
});

downloadCard?.addEventListener("click", () => {
  if (!supportCard) return;
  drawSupportCard();
  const link = document.createElement("a");
  link.download = "card-apoio-joaquim-barbosa.png";
  try {
    link.href = supportCard.toDataURL("image/png");
    link.click();
    if (cardStatus) cardStatus.textContent = "Download iniciado.";
  } catch (error) {
    if (cardStatus) cardStatus.textContent = "Não foi possível baixar o card. Tente trocar a foto enviada.";
  }
});

profilePhotoInput?.addEventListener("change", () => {
  const file = profilePhotoInput.files?.[0];

  if (!file) {
    profilePhoto = null;
    if (profileStatus) profileStatus.textContent = "Envie uma foto para personalizar.";
    drawProfileCard();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    profilePhoto = new Image();
    profilePhoto.onload = () => {
      if (profileStatus) profileStatus.textContent = "Foto adicionada ao avatar.";
      drawProfileCard();
    };
    profilePhoto.onerror = () => {
      profilePhoto = null;
      if (profileStatus) profileStatus.textContent = "Não foi possível carregar essa foto.";
      drawProfileCard();
    };
    profilePhoto.src = reader.result;
  };
  reader.readAsDataURL(file);
});

downloadProfile?.addEventListener("click", () => {
  if (!profileCard) return;
  drawProfileCard();
  const link = document.createElement("a");
  link.download = "foto-perfil-joaquim-barbosa.png";
  try {
    link.href = profileCard.toDataURL("image/png");
    link.click();
    if (profileStatus) profileStatus.textContent = "Download iniciado.";
  } catch (error) {
    if (profileStatus) profileStatus.textContent = "Não foi possível baixar a foto de perfil.";
  }
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

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("nome")?.toString().trim();
  if (formNote) {
    formNote.textContent = name
      ? `${name}, sua intenção foi registrada neste protótipo.`
      : "Sua intenção foi registrada neste protótipo.";
  }
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
if (supportCard) {
  cardLogo = new Image();
  cardLogo.onload = drawSupportCard;
  cardLogo.onerror = drawSupportCard;
  cardLogo.src = "logo.svg";
  drawSupportCard();
}
drawProfileCard();
updateScrollEffects();
