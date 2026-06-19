const siteConfig = {
  whatsapp: "77017542775",
  popupAutoOpenMs: 60000,
  popupSessionKey: "sofia_popup_closed",
  popupTypingPhrases: [
    "любовная магия...",
    "возврат любимого...",
    "снятие негатива...",
    "гадание на таро..."
  ],
  tarotCards: [
    { src: "./assets/taro/3.png", name: "Императрица" },
    { src: "./assets/taro/4.png", name: "Император" },
    { src: "./assets/taro/5.png", name: "Иерофант" },
    { src: "./assets/taro/7.png", name: "Колесница" },
    { src: "./assets/taro/8.png", name: "Сила" },
    { src: "./assets/taro/10.png", name: "Колесо Фортуны" },
    { src: "./assets/taro/11.png", name: "Справедливость" },
    { src: "./assets/taro/13.png", name: "Смерть - Перемены" },
    { src: "./assets/taro/15.png", name: "Дьявол" }
  ],
  quizQuestions: [
    "Чувствуете ли вы постоянную усталость, даже после отдыха?",
    "Случаются ли в вашей жизни повторяющиеся ссоры, провалы или внезапные срывы планов?",
    "Есть ли ощущение тяжести, тревоги или давления без понятной причины?",
    "Замечаете ли вы охлаждение в отношениях, которое появилось резко и без объяснения?",
    "Появились ли странные совпадения, потери, конфликты или ощущение, что всё идёт не так?",
    "Хотите ли вы сейчас получить более глубокий разбор своей ситуации?"
  ]
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function openWhatsAppMessage(message) {
  const text = encodeURIComponent(message.trim());
  window.open(`https://wa.me/${siteConfig.whatsapp}?text=${text}`, "_blank", "noopener");
}

function buildMessage({ message, phone, source }) {
  const parts = [
    `Здравствуйте, София.`,
    source ? `Пишу с сайта (${source}).` : `Пишу с сайта.`
  ];

  if (message) {
    parts.push(`Моя ситуация: ${message}`);
  }

  if (phone) {
    parts.push(`Мой номер: ${phone}`);
  }

  return parts.join(" ");
}

function setupStars() {
  const field = document.getElementById("stars-field");
  if (!field || prefersReducedMotion) return;

  for (let i = 0; i < 28; i += 1) {
    const star = document.createElement("span");
    star.className = "star-particle";
    const size = Math.random() * 2 + 1;
    star.style.left = `${Math.random() * 100}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${8 + Math.random() * 12}s`;
    star.style.animationDelay = `${Math.random() * 8}s`;
    field.appendChild(star);
  }
}

function setupEnergyField() {
  const field = document.getElementById("stars-field");
  if (!field || prefersReducedMotion) return;

  const canvas = document.createElement("canvas");
  canvas.className = "energy-canvas";
  field.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.38,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.38,
    intensity: 0,
    lastSeen: 0
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let motes = [];
  const energyColors = {
    arc: "244, 204, 132",
    arcGlow: "214, 108, 146",
    glowCore: "255, 223, 168",
    glowOuter: "198, 86, 124",
    moteHalo: "136, 52, 72",
    moteCore: "248, 214, 150",
    moteShadow: "196, 92, 132",
    pointerCore: "255, 240, 212",
    pointerGlow: "214, 110, 150"
  };

  const moteCount = () => {
    if (window.innerWidth <= 480) return 12;
    if (window.innerWidth <= 768) return 16;
    return 24;
  };

  const randomRange = (min, max) => min + Math.random() * (max - min);

  const createMotes = () => {
    motes = Array.from({ length: moteCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomRange(-0.08, 0.08),
      vy: randomRange(-0.06, 0.06),
      radius: randomRange(1.8, 3.6),
      glow: randomRange(12, 26),
      phase: Math.random() * Math.PI * 2
    }));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createMotes();
  };

  const updatePointer = (x, y, boost = 1) => {
    pointer.targetX = x;
    pointer.targetY = y;
    pointer.lastSeen = performance.now();
    pointer.intensity = Math.max(pointer.intensity, boost);
  };

  const drawArcLine = (x1, y1, x2, y2, alpha, widthPx, phase) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const nx = length ? -dy / length : 0;
    const ny = length ? dx / length : 0;
    const bend = Math.min(28, length * 0.2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);

    for (let step = 1; step < 4; step += 1) {
      const t = step / 4;
      const wave = Math.sin(phase + t * 8) * bend * (1 - Math.abs(0.5 - t));
      ctx.lineTo(x1 + dx * t + nx * wave, y1 + dy * t + ny * wave);
    }

    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(${energyColors.arc}, ${alpha})`;
    ctx.lineWidth = widthPx;
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(${energyColors.arcGlow}, 0.58)`;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const render = (time) => {
    ctx.clearRect(0, 0, width, height);

    const pointerAge = performance.now() - pointer.lastSeen;
    const targetIntensity = pointerAge < 180 ? 1 : pointerAge < 1600 ? 0.68 : 0;
    pointer.intensity += (targetIntensity - pointer.intensity) * 0.08;
    pointer.x += (pointer.targetX - pointer.x) * 0.12;
    pointer.y += (pointer.targetY - pointer.y) * 0.12;

    if (pointer.intensity > 0.02) {
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170);
      glow.addColorStop(0, `rgba(${energyColors.glowCore}, ${0.18 * pointer.intensity})`);
      glow.addColorStop(0.35, `rgba(${energyColors.glowOuter}, ${0.14 * pointer.intensity})`);
      glow.addColorStop(1, "rgba(7, 2, 2, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);
    }

    motes.forEach((mote, index) => {
      mote.x += mote.vx;
      mote.y += mote.vy;
      mote.phase += 0.012 + index * 0.0005;

      if (mote.x < -40) mote.x = width + 40;
      if (mote.x > width + 40) mote.x = -40;
      if (mote.y < -40) mote.y = height + 40;
      if (mote.y > height + 40) mote.y = -40;

      const pulse = 0.65 + (Math.sin(time * 0.0012 + mote.phase) + 1) * 0.16;
      const radius = mote.radius * pulse;

      ctx.beginPath();
      ctx.arc(mote.x, mote.y, radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${energyColors.moteHalo}, 0.13)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mote.x, mote.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${energyColors.moteCore}, 0.74)`;
      ctx.shadowBlur = mote.glow;
      ctx.shadowColor = `rgba(${energyColors.moteShadow}, 0.46)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (pointer.intensity > 0.04) {
      const activeMotes = motes
        .map((mote) => ({ mote, dist: Math.hypot(mote.x - pointer.x, mote.y - pointer.y) }))
        .filter(({ dist }) => dist < (window.innerWidth <= 768 ? 180 : 240))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, window.innerWidth <= 768 ? 3 : 5);

      activeMotes.forEach(({ mote, dist }, index) => {
        const strength = (1 - dist / (window.innerWidth <= 768 ? 180 : 240)) * pointer.intensity;
        const alpha = 0.22 + strength * 0.55;
        drawArcLine(pointer.x, pointer.y, mote.x, mote.y, alpha, 1.1 + strength * 1.4, time * 0.01 + index);
      });

      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 5 + pointer.intensity * 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${energyColors.pointerCore}, ${0.52 * pointer.intensity})`;
      ctx.shadowBlur = 24;
      ctx.shadowColor = `rgba(${energyColors.pointerGlow}, 0.68)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    window.requestAnimationFrame(render);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      updatePointer(event.clientX, event.clientY, event.pointerType === "touch" ? 1 : 0.8);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (event) => {
      updatePointer(event.clientX, event.clientY, 1.15);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY, 1.1);
    },
    { passive: true }
  );

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.requestAnimationFrame(render);
}

function setupHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 18);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupMobileNav() {
  const nav = document.getElementById("navMobile");
  const burger = document.getElementById("burgerBtn");
  const closeButton = document.getElementById("navClose");
  if (!nav || !burger || !closeButton) return;

  const closeNav = () => nav.classList.remove("open");
  const openNav = () => nav.classList.add("open");

  burger.addEventListener("click", openNav);
  closeButton.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
}

function setupRevealAnimations() {
  if (prefersReducedMotion) return;

  const targets = document.querySelectorAll("[data-anim]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupTypingText() {
  const targets = [
    document.getElementById("popupTyping"),
    document.getElementById("dockTyping")
  ].filter(Boolean);

  if (!targets.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = siteConfig.popupTypingPhrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    const value = phrase.slice(0, charIndex);
    targets.forEach((target) => {
      target.textContent = value;
    });

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      window.setTimeout(tick, 900);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % siteConfig.popupTypingPhrases.length;
    }

    window.setTimeout(tick, deleting ? 45 : 70);
  };

  tick();
}

function setupOrbitGallery() {
  const ring = document.getElementById("orbitRing");
  const gallery = document.getElementById("orbitGallery");
  if (!ring || !gallery) return;

  const cards = [...ring.querySelectorAll(".orbit-card")];
  if (!cards.length) return;

  const placeCards = () => {
    const width = window.innerWidth;
    let radius = 320;
    let cardWidth = 190;
    let cardHeight = 300;

    if (width <= 768) {
      radius = 200;
      cardWidth = 150;
      cardHeight = 230;
    }

    ring.style.width = `${cardWidth}px`;
    ring.style.height = `${cardHeight}px`;

    cards.forEach((card, index) => {
      const angle = index * (360 / cards.length);
      card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  };

  placeCards();
  window.addEventListener("resize", placeCards, { passive: true });

  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ring.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(gallery);
}

function setupFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-q");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => openItem.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

function setupPopupForms() {
  const popupOverlay = document.getElementById("popupOverlay");
  const popupLauncher = document.getElementById("popupLauncher");
  const popupClose = document.getElementById("popupClose");
  const popupForm = document.getElementById("popupForm");
  const popupMessage = document.getElementById("popupMessage");
  const popupPhone = document.getElementById("popupPhone");
  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("cfMsg");
  const contactPhone = document.getElementById("cfTel");

  if (popupOverlay && popupLauncher && popupClose) {
    let popupTimerId = null;

    const closePopup = () => {
      popupOverlay.hidden = true;
      window.sessionStorage.setItem(siteConfig.popupSessionKey, "1");
      if (popupTimerId) {
        window.clearTimeout(popupTimerId);
        popupTimerId = null;
      }
    };

    const openPopup = () => {
      if (window.sessionStorage.getItem(siteConfig.popupSessionKey) === "1") return;
      popupOverlay.hidden = false;
      if (popupTimerId) {
        window.clearTimeout(popupTimerId);
        popupTimerId = null;
      }
    };

    popupLauncher.addEventListener("click", openPopup);
    popupClose.addEventListener("click", closePopup);
    popupOverlay.addEventListener("click", (event) => {
      if (event.target === popupOverlay) closePopup();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popupOverlay.hidden) closePopup();
    });

    if (window.sessionStorage.getItem(siteConfig.popupSessionKey) !== "1") {
      popupTimerId = window.setTimeout(openPopup, siteConfig.popupAutoOpenMs);
    }
  }

  if (popupForm && popupMessage && popupPhone) {
    popupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      openWhatsAppMessage(
        buildMessage({
          message: popupMessage.value,
          phone: popupPhone.value,
          source: "popup"
        })
      );
    });
  }

  if (contactForm && contactMessage && contactPhone) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      openWhatsAppMessage(
        buildMessage({
          message: contactMessage.value,
          phone: contactPhone.value,
          source: "contact form"
        })
      );
    });
  }
}

function setupQuizPopup() {
  const popup = document.getElementById("quizPopup");
  const closeButton = document.getElementById("quizClose");
  const triggerIds = ["openQuiz", "contactQuizButton", "dockQuizButton", "faqQuizLink"];
  const triggers = triggerIds.map((id) => document.getElementById(id)).filter(Boolean);
  const questionEl = document.getElementById("quizQuestion");
  const stepEl = document.getElementById("quizStep");
  const barEl = document.getElementById("quizBar");
  const optionsEl = document.getElementById("quizOptions");

  if (!popup || !closeButton || !questionEl || !stepEl || !barEl || !optionsEl) return;

  let index = 0;
  let yesCount = 0;

  const renderQuestion = () => {
    questionEl.textContent = siteConfig.quizQuestions[index];
    stepEl.textContent = `Вопрос ${index + 1} из ${siteConfig.quizQuestions.length}`;
    barEl.style.width = `${((index + 1) / siteConfig.quizQuestions.length) * 100}%`;
    optionsEl.innerHTML = `
      <button class="quiz-opt" type="button" data-answer="yes">Да, это похоже на меня</button>
      <button class="quiz-opt" type="button" data-answer="no">Нет, такого нет</button>
    `;
    optionsEl.querySelectorAll(".quiz-opt").forEach((button) => {
      button.addEventListener("click", () => handleAnswer(button.dataset.answer));
    });
  };

  const renderResult = () => {
    const percent = Math.round((yesCount / siteConfig.quizQuestions.length) * 100);
    stepEl.textContent = "Результат";
    questionEl.textContent =
      percent >= 50
        ? "Есть признаки, что ситуацию стоит посмотреть глубже. Лучше не тянуть и сделать личный разбор."
        : "Даже если сильных признаков немного, внутреннее напряжение и повторяющиеся события всё равно стоит разобрать лично.";
    barEl.style.width = "100%";
    optionsEl.innerHTML = `
      <a class="btn btn-primary full-width" href="https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Здравствуйте, София. Я прошла диагностику на сайте и хочу разобрать свою ситуацию подробнее.")}" target="_blank" rel="noopener">Разобрать ситуацию в WhatsApp</a>
    `;
  };

  const handleAnswer = (answer) => {
    if (answer === "yes") yesCount += 1;
    index += 1;

    if (index >= siteConfig.quizQuestions.length) {
      renderResult();
      return;
    }

    renderQuestion();
  };

  const resetQuiz = () => {
    index = 0;
    yesCount = 0;
    renderQuestion();
  };

  const openQuiz = () => {
    resetQuiz();
    popup.hidden = false;
  };

  const closeQuiz = () => {
    popup.hidden = true;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openQuiz();
    });
  });

  closeButton.addEventListener("click", closeQuiz);
  popup.addEventListener("click", (event) => {
    if (event.target === popup) closeQuiz();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) closeQuiz();
  });

  renderQuestion();
}

function setupTarotCard() {
  const stage = document.getElementById("taroStage");
  const inner = document.getElementById("taroInner");
  const frontImage = document.getElementById("taroFrontImg");
  const cardName = document.getElementById("taroCardName");
  const ctaButton = document.getElementById("taroCta");
  const waButton = document.getElementById("taroWaBtn");
  if (!stage || !inner || !frontImage || !cardName || !ctaButton || !waButton) return;

  let drawn = false;

  const drawCard = () => {
    if (drawn) return;
    drawn = true;
    const card = siteConfig.tarotCards[Math.floor(Math.random() * siteConfig.tarotCards.length)];
    frontImage.src = card.src;
    frontImage.alt = card.name;
    cardName.textContent = card.name;
    inner.classList.add("flipped");
    waButton.hidden = false;
    waButton.href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Здравствуйте, София. Я вытянула карту дня "${card.name}" на сайте и хочу разобрать её для своей ситуации.`)}`;
    ctaButton.textContent = "Карта выбрана";
    ctaButton.disabled = true;
  };

  stage.addEventListener("click", drawCard);
  ctaButton.addEventListener("click", drawCard);
}

function setupSplitListReveal() {
  if (prefersReducedMotion) return;
  const list = document.getElementById("aboutList");
  if (!list) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          list.classList.add("sli-vis");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(list);
}

setupStars();
setupEnergyField();
setupHeader();
setupMobileNav();
setupRevealAnimations();
setupTypingText();
setupOrbitGallery();
setupFaq();
setupPopupForms();
setupQuizPopup();
setupTarotCard();
setupSplitListReveal();
