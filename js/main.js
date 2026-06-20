const SHOWCASE_SLIDES = [
  {
    src: "assets/app-vulora.webp",
    altKey: "showcase.slides.overview.alt",
    captionKey: "showcase.slides.overview.caption"
  }
];

let refreshShowcaseCarousel = null;

// Paste a YouTube video ID or any YouTube URL (watch, youtu.be, embed, shorts).
const YOUTUBE_PRESENTATION_ID = "Uz_iZ5OhZ6s";

function parseYouTubeId(input) {
  if (!input) return "";
  const value = String(input).trim();

  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
    const fromQuery = url.searchParams.get("v");
    if (fromQuery) return fromQuery;

    const fromPath = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
    if (fromPath) return fromPath[1];
  } catch {
    const fromString = value.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([\w-]{11})/);
    if (fromString) return fromString[1];
  }

  return "";
}

function buildYouTubeEmbedUrl(videoId) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1"
  });

  if (window.location.origin && window.location.origin !== "null") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/* ----------------------------------------------------------- device mockup */

const MOCKUP_FRAME = "assets/mockup.png";

function createDeviceMockup(appSrc, alt, loading = "lazy") {
  const mockup = document.createElement("div");
  mockup.className = "device-mockup";
  mockup.setAttribute("aria-label", alt);

  const screen = document.createElement("div");
  screen.className = "device-mockup__screen";

  const app = document.createElement("img");
  app.className = "device-mockup__app";
  app.src = appSrc;
  app.alt = alt;
  app.loading = loading;
  app.decoding = "async";
  app.width = 1290;
  app.height = 2796;

  const frame = document.createElement("img");
  frame.className = "device-mockup__frame";
  frame.src = MOCKUP_FRAME;
  frame.alt = "";
  frame.width = 448;
  frame.height = 916;
  frame.setAttribute("aria-hidden", "true");
  frame.decoding = "async";

  screen.appendChild(app);
  mockup.appendChild(screen);
  mockup.appendChild(frame);
  return mockup;
}

/* ----------------------------------------------------------- translations */

const translations = {
  en: {
    meta: {
      title: "Vulora — On-device AI, an engineering case study",
      description: "Vulora is a private financial-intelligence proof of concept with local-first inference — on-device, on your LAN, or on trusted private endpoints — an engineering case study in offline-first, privacy-first AI built on Flutter.",
      ogTitle: "Vulora — On-device AI, an engineering case study",
      ogDescription: "Vulora is a private financial-intelligence proof of concept with local-first inference — on-device, on your LAN, or on trusted private endpoints — an engineering case study in offline-first, privacy-first AI built on Flutter.",
      twitterTitle: "Vulora — On-device AI, an engineering case study",
      twitterDescription: "Vulora is a private financial-intelligence proof of concept with local-first inference — on-device, on your LAN, or on trusted private endpoints — an engineering case study in offline-first, privacy-first AI built on Flutter."
    },
    nav: { thesis: "Thesis", showcase: "App", engineering: "Engineering", privacy: "Privacy", faq: "FAQ", contact: "Get in touch" },
    hero: {
      badge: "Engineering case study · Local-first AI · Flutter",
      title: "Financial intelligence you control.",
      subtitle: "A proof of concept with on-device inference by default — or routed to trusted providers on your LAN or private cloud. Offline-first, contextual AI that never hands your data to third-party clouds.",
      primaryCta: "Explore the build",
      secondaryCta: "Watch demo",
      videoLabel: "Watch presentation video"
    },
    mockup: {
      user: "Can I spend less this month?",
      ai: "Yes. Subscriptions rose 18%. I found three quiet savings.",
      metric: "Private insight",
      metricValue: "−18% subscriptions"
    },
    showcase: {
      eyebrow: "Inside the POC",
      title: "A generative UI, rendered on-device.",
      subtitle: "A dark, liquid-glass interface where the model composes ephemeral components in real time — conversational, contextual and free of third-party clouds.",
      slides: {
        overview: {
          alt: "Vulora app home screen",
          caption: "Generative UI, composed on-device."
        }
      }
    },
    thesis: {
      eyebrow: "The premise",
      title: "Sending sensitive financial data to third-party clouds shouldn't be the industry default.",
      subtitle: "Vulora is the technical answer to that premise: a local-first intelligence layer — on-device, on your LAN, or on a private endpoint you trust — that keeps context and data with you and treats third-party clouds as optional, not mandatory.",
      cards: {
        local: { title: "Local by default", text: "Inference runs where you choose — on the device, your home network, or a trusted private endpoint — without routing your money through public APIs." },
        offline: { title: "Offline-first architecture", text: "Context and history live with you. The app stays useful with or without a network." },
        sovereign: { title: "Data sovereignty", text: "Privacy as an architectural decision, not a checkbox — sensitive data never has to leave the device." }
      }
    },
    engineering: {
      eyebrow: "Under the hood",
      title: "The engineering behind the proof of concept.",
      subtitle: "The hard part isn't the idea — it's making a local LLM fast, safe and reliable on mobile hardware. These are the problems this project solves.",
      cards: {
        llm: { tag: "Gemma 4 E2B · GPU", title: "On-device inference path", text: "A ~2.6 GB Gemma 4 E2B model runs locally on the GPU via flutter_gemma — opt-in download, with image input disabled to stay clear of OOM. The same harness also routes to trusted providers on your LAN or private cloud." },
        tools: { tag: "21 tools · Function calling", title: "An agentic tool layer", text: "21 typed tools dispatched to deterministic Dart handlers — expenses, budgets, finance queries and memory — all driven by function calling." },
        guardrails: { tag: "Confirmations · Privacy", title: "Guardrails by design", text: "Destructive actions wait for an explicit confirmation card; private memories never go back to the model and sensitive categories are refused outright." },
        genui: { tag: "App-owned visuals", title: "Deterministic generative UI", text: "Tools return typed visual payloads — budget and confirmation cards — rendered natively inside the chat. No model-authored JSON drives the screen." },
        streaming: { tag: "Streaming · Context", title: "Streaming under control", text: "Real-time token streaming with reasoning traces, a mutex serializing native FFI calls, token-buffer pruning and a live context cost." },
        storage: { tag: "Drift · Hive", title: "Offline-first persistence", text: "A relational SQLite layer (Drift, 9 tables, enforced foreign keys, money in cents) plus fast Hive key-value — all data stays in the app, on the device." },
      }
    },
    privacy: {
      eyebrow: "Private by design",
      title: "Privacy is an architecture decision, not a feature.",
      text: "Vulora is built to minimize cloud dependency, keep context on the device and make personal finance feel fast, quiet and trustworthy — privacy designed into the system, not bolted on.",
      cards: {
        sensitive: { title: "Sensitive by nature", text: "Money data deserves clear boundaries and careful handling." },
        cloud: { title: "Less cloud reliance", text: "Local-first intelligence, with the cloud used only when it's genuinely the right tool." },
        offline: { title: "Fast and contextual", text: "Designed for an offline-first experience that understands your context." }
      }
    },
    contact: {
      eyebrow: "The engineer",
      title: "A proof of concept, built in the open mind.",
      text: "Vulora started as a personal itch — a real problem I wanted to solve well — and became a deep dive into edge AI: a custom harness with guardrails and tooling, a private benchmark to choose a base model for fine-tuning, and a local-first architecture with pluggable inference — on-device, LAN, or private cloud. No launch, no pitch. Just the engineering, in public view.",
      note: "If you work on mobile architecture, applied AI or edge inference, let's have a chat.",
      site: "Personal site",
      x: "Profile on X"
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers, no hype.",
      items: {
        what: { q: "What is Vulora?", a: "A proof of concept and engineering case study: a private financial-intelligence app with on-device inference by default, and the option to route it to trusted providers you configure — a model on your LAN (e.g. your MacBook), at home, or in a private cloud." },
        stack: { q: "What's the stack?", a: "Flutter and Dart on the client, a pluggable inference layer (on-device Gemma by default, or trusted providers on your LAN or private cloud) behind a custom harness with guardrails and tooling, and a local-first data layer (Drift / Hive)." },
        why: { q: "Why run local models?", a: "Because sensitive financial data shouldn't have to pass through third-party clouds. Local inference — on the device, your LAN, or a private endpoint you trust — makes privacy an architectural guarantee instead of a policy promise." },
        available: { q: "Can I download it?", a: "Not yet — Vulora is a work-in-progress POC, not a publicly released product. It exists to demonstrate the engineering, not to sell anything." },
        bank: { q: "Is Vulora a bank or financial advice?", a: "No. Vulora is not a bank, financial institution, broker or investment adviser, and nothing here is financial, legal, accounting or tax advice." }
      }
    },
    footer: {
      tagline: "A local-first AI engineering case study, built in the open.",
      copy: "© 2026 Vulora. All rights reserved."
    },
    cookies: {
      bannerTitle: "Privacy preferences",
      bannerText: "We use only essential storage by default. Analytics and marketing stay off unless you allow them.",
      accept: "Accept all",
      reject: "Reject non-essential",
      manage: "Manage",
      essential: "Essential cookies",
      analytics: "Analytics and marketing",
      save: "Save preferences"
    },
    legal: { back: "Back to site" }
  },
  "pt-BR": {
    meta: {
      title: "Vulora — IA on-device, um estudo de caso de engenharia",
      description: "A Vulora é uma prova de conceito de inteligência financeira privada com inferência local-first — no dispositivo, na sua rede local ou em endpoints privados de confiança — um estudo de caso de engenharia em IA offline-first e privacy-first, construído em Flutter.",
      ogTitle: "Vulora — IA on-device, um estudo de caso de engenharia",
      ogDescription: "A Vulora é uma prova de conceito de inteligência financeira privada com inferência local-first — no dispositivo, na sua rede local ou em endpoints privados de confiança — um estudo de caso de engenharia em IA offline-first e privacy-first, construído em Flutter.",
      twitterTitle: "Vulora — IA on-device, um estudo de caso de engenharia",
      twitterDescription: "A Vulora é uma prova de conceito de inteligência financeira privada com inferência local-first — no dispositivo, na sua rede local ou em endpoints privados de confiança — um estudo de caso de engenharia em IA offline-first e privacy-first, construído em Flutter."
    },
    nav: { thesis: "Tese", showcase: "App", engineering: "Engenharia", privacy: "Privacidade", faq: "FAQ", contact: "Falar comigo" },
    hero: {
      badge: "Estudo de caso de engenharia · IA local-first · Flutter",
      title: "Inteligência financeira sob seu controle.",
      subtitle: "Uma prova de conceito com inferência on-device por padrão — ou direcionada para provedores confiáveis na sua rede local ou nuvem privada. IA offline-first e contextual que nunca entrega seus dados a nuvens de terceiros.",
      primaryCta: "Explorar a construção",
      secondaryCta: "Ver demo",
      videoLabel: "Assistir vídeo de apresentação"
    },
    mockup: {
      user: "Posso gastar menos este mês?",
      ai: "Sim. Assinaturas subiram 18%. Encontrei três economias discretas.",
      metric: "Insight privado",
      metricValue: "−18% assinaturas"
    },
    showcase: {
      eyebrow: "Dentro da POC",
      title: "Uma interface generativa, renderizada no dispositivo.",
      subtitle: "Uma interface escura em liquid glass onde o modelo compõe componentes efêmeros em tempo real — conversacional, contextual e livre de nuvens de terceiros.",
      slides: {
        overview: {
          alt: "Tela inicial do app Vulora",
          caption: "UI generativa, composta no dispositivo."
        }
      }
    },
    thesis: {
      eyebrow: "A premissa",
      title: "Enviar dados financeiros sensíveis para nuvens de terceiros não deveria ser o padrão da indústria.",
      subtitle: "A Vulora é a resposta técnica a essa premissa: uma camada de inteligência local-first — no dispositivo, na sua rede local ou em um endpoint privado de confiança — que mantém contexto e dados com você e trata nuvens de terceiros como opcionais, não obrigatórias.",
      cards: {
        local: { title: "Local por padrão", text: "A inferência roda onde você escolher — no dispositivo, na sua rede doméstica ou em um endpoint privado de confiança — sem rotear seu dinheiro por APIs públicas." },
        offline: { title: "Arquitetura offline-first", text: "Contexto e histórico ficam com você. O app continua útil com ou sem rede." },
        sovereign: { title: "Soberania de dados", text: "Privacidade como decisão de arquitetura, não um checkbox — dados sensíveis nunca precisam sair do dispositivo." }
      }
    },
    engineering: {
      eyebrow: "Por baixo dos panos",
      title: "A engenharia por trás da prova de conceito.",
      subtitle: "O difícil não é a ideia — é fazer um LLM local ser rápido, seguro e confiável em hardware móvel. Estes são os problemas que este projeto resolve.",
      cards: {
        llm: { tag: "Gemma 4 E2B · GPU", title: "Caminho de inferência on-device", text: "Um modelo Gemma 4 E2B de ~2.6 GB roda localmente na GPU via flutter_gemma — download opt-in e entrada de imagem desativada para evitar OOM. O mesmo harness também direciona para provedores confiáveis na sua rede local ou nuvem privada." },
        tools: { tag: "21 tools · Function calling", title: "Uma camada de tools agentic", text: "21 tools tipadas despachadas para handlers Dart determinísticos — gastos, orçamentos, consultas financeiras e memória — tudo via function calling." },
        guardrails: { tag: "Confirmações · Privacidade", title: "Guardrails por design", text: "Ações destrutivas esperam um card de confirmação explícito; memórias privadas nunca voltam ao modelo e categorias sensíveis são recusadas de imediato." },
        genui: { tag: "Visuais do app", title: "Generative UI determinística", text: "As tools retornam payloads visuais tipados — cards de orçamento e confirmação — renderizados nativamente no chat. Sem JSON do modelo conduzindo a tela." },
        streaming: { tag: "Streaming · Contexto", title: "Streaming sob controle", text: "Streaming de tokens em tempo real com traços de raciocínio, um mutex serializando chamadas FFI nativas, poda por token-buffer e custo de contexto ao vivo." },
        storage: { tag: "Drift · Hive", title: "Persistência offline-first", text: "Uma camada SQLite relacional (Drift, 9 tabelas, foreign keys garantidas, dinheiro em centavos) mais Hive key-value rápido — todos os dados ficam no app, no dispositivo." },
      }
    },
    privacy: {
      eyebrow: "Privacidade por design",
      title: "Privacidade é decisão de arquitetura, não uma funcionalidade.",
      text: "A Vulora é construída para minimizar dependência da nuvem, manter o contexto no dispositivo e tornar finanças pessoais rápidas, silenciosas e confiáveis — privacidade desenhada no sistema, não acoplada depois.",
      cards: {
        sensitive: { title: "Sensível por natureza", text: "Dados sobre dinheiro merecem limites claros e cuidado no tratamento." },
        cloud: { title: "Menos dependência da nuvem", text: "Inteligência local-first, com a nuvem usada só quando ela é realmente a ferramenta certa." },
        offline: { title: "Rápida e contextual", text: "Projetada para uma experiência offline-first que entende seu contexto." }
      }
    },
    contact: {
      eyebrow: "O engenheiro",
      title: "Uma prova de conceito, construída de mente aberta.",
      text: "A Vulora nasceu de uma dor pessoal — um problema real que eu queria resolver bem — e virou um mergulho profundo em edge AI: um harness próprio com guardrails e tooling, um benchmark privado para escolher um modelo base para fine-tuning e uma arquitetura local-first com inferência plugável — on-device, na rede local ou em nuvem privada. Sem lançamento, sem pitch. Só a engenharia, à vista de todos.",
      note: "Se você trabalha com arquitetura mobile, IA aplicada ou inferência na borda, vamos bater um papo.",
      site: "Site pessoal",
      x: "Perfil no X"
    },
    faq: {
      eyebrow: "FAQ",
      title: "Respostas claras, sem hype.",
      items: {
        what: { q: "O que é a Vulora?", a: "Uma prova de conceito e estudo de caso de engenharia: um app de inteligência financeira privada com inferência on-device por padrão, e opção de direcionar para provedores confiáveis que você configura — um modelo na sua rede local (por exemplo, no MacBook), em casa ou em uma nuvem privada." },
        stack: { q: "Qual é a stack?", a: "Flutter e Dart no cliente, uma camada de inferência plugável (Gemma on-device por padrão, ou provedores confiáveis na sua rede local ou nuvem privada) atrás de um harness próprio com guardrails e tooling, e uma camada de dados local-first (Drift / Hive)." },
        why: { q: "Por que rodar modelos locais?", a: "Porque dados financeiros sensíveis não deveriam precisar passar por nuvens de terceiros. Inferência local — no dispositivo, na sua rede ou em um endpoint privado de confiança — torna a privacidade uma garantia de arquitetura, não uma promessa de política." },
        available: { q: "Posso baixar?", a: "Ainda não — a Vulora é uma POC em andamento, não um produto lançado publicamente. Ela existe para demonstrar a engenharia, não para vender nada." },
        bank: { q: "A Vulora é um banco ou aconselhamento financeiro?", a: "Não. A Vulora não é banco, instituição financeira, corretora ou consultoria de investimentos, e nada aqui é aconselhamento financeiro, jurídico, contábil ou tributário." }
      }
    },
    footer: {
      tagline: "Um estudo de caso de engenharia em IA local-first, construído à vista de todos.",
      copy: "© 2026 Vulora. Todos os direitos reservados."
    },
    cookies: {
      bannerTitle: "Preferências de privacidade",
      bannerText: "Usamos apenas armazenamento essencial por padrão. Analytics e marketing ficam desligados até você permitir.",
      accept: "Aceitar tudo",
      reject: "Rejeitar não essenciais",
      manage: "Gerenciar",
      essential: "Cookies essenciais",
      analytics: "Analytics e marketing",
      save: "Salvar preferências"
    },
    legal: { back: "Voltar ao site" }
  }
};

function getTranslation(path, lang = getCurrentLanguage()) {
  return path.split(".").reduce((value, key) => value && value[key], translations[lang]) || "";
}

function detectLanguage() {
  const saved = localStorage.getItem("vulora_language");
  if (saved && translations[saved]) return saved;
  const browserLanguage = navigator.language || "";
  return browserLanguage.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

let currentLanguage = detectLanguage();

function getCurrentLanguage() {
  return currentLanguage;
}

function applyLanguage(lang) {
  currentLanguage = translations[lang] ? lang : "en";
  localStorage.setItem("vulora_language", currentLanguage);
  document.documentElement.lang = currentLanguage === "pt-BR" ? "pt-BR" : "en";

  syncLanguageSwitch();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n, currentLanguage);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((pair) => {
      const [attr, path] = pair.split(":").map((item) => item.trim());
      const value = getTranslation(path, currentLanguage);
      if (attr && value) element.setAttribute(attr, value);
    });
  });

  document.querySelectorAll("[data-i18n-meta]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nMeta, currentLanguage);
    if (!value) return;
    if (element.tagName === "TITLE") {
      element.textContent = value;
    } else {
      element.setAttribute("content", value);
    }
  });

  if (refreshShowcaseCarousel) refreshShowcaseCarousel();
}

/* --------------------------------------------------- custom language switch */

const LANGUAGE_META = {
  "pt-BR": { flag: "assets/flags/br.svg", label: "Português" },
  en: { flag: "assets/flags/us.svg", label: "English" }
};

function syncLanguageSwitch() {
  const meta = LANGUAGE_META[currentLanguage] || LANGUAGE_META.en;
  document.querySelectorAll("[data-language-switch]").forEach((root) => {
    const flag = root.querySelector("[data-language-flag]");
    const label = root.querySelector("[data-language-label]");
    if (flag) flag.src = meta.flag;
    if (label) label.textContent = meta.label;
    root.querySelectorAll("[data-lang]").forEach((option) => {
      option.setAttribute("aria-selected", option.dataset.lang === currentLanguage ? "true" : "false");
    });
  });
}

function initLanguageSwitch() {
  document.querySelectorAll("[data-language-switch]").forEach((root) => {
    const trigger = root.querySelector("[data-language-trigger]");
    const menu = root.querySelector("[data-language-menu]");
    if (!trigger || !menu) return;

    const options = Array.from(menu.querySelectorAll("[data-lang]"));
    options.forEach((option) => option.setAttribute("tabindex", "-1"));

    const open = (focusSelected) => {
      menu.hidden = false;
      root.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      if (focusSelected) {
        const index = Math.max(0, options.findIndex((o) => o.dataset.lang === currentLanguage));
        options[index]?.focus();
      }
    };

    const close = (returnFocus) => {
      menu.hidden = true;
      root.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      if (returnFocus) trigger.focus();
    };

    const choose = (option) => {
      applyLanguage(option.dataset.lang);
      close(true);
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (menu.hidden) open(false);
      else close(false);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(true);
      }
    });

    options.forEach((option, index) => {
      option.addEventListener("click", () => choose(option));
      option.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(option);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          options[(index + 1) % options.length].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          options[(index - 1 + options.length) % options.length].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          close(true);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) close(false);
    });
  });
}

function initLanguage() {
  initLanguageSwitch();
  applyLanguage(currentLanguage);
  document.documentElement.classList.remove("pre-i18n");
}

/* ----------------------------------------------------------- reveal */

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  // Immediately mark elements already in the viewport as visible —
  // prevents the "second render" flash on page load (above-the-fold content
  // appears instantly instead of fading in after the body is revealed)
  const vh = window.innerHeight;
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add("visible");
    }
  });

  // Only observe elements still hidden (below the fold) for scroll animation
  const hidden = document.querySelectorAll(".reveal:not(.visible)");
  if (!hidden.length) return;

  const staggerSet = new Set(
    document.querySelectorAll(".card-grid .reveal, .privacy-list .reveal, .faq-list .reveal, .countdown .reveal")
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
      const index = siblings.indexOf(el);
      if (staggerSet.has(el) && index > 0) {
        setTimeout(() => {
          el.classList.add("visible");
          observer.unobserve(el);
        }, index * 110);
      } else {
        el.classList.add("visible");
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  hidden.forEach((element) => observer.observe(element));
}

/* ----------------------------------------------------------- parallax */

function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll("[data-parallax]");
  if (!targets.length) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    targets.forEach((el) => {
      const strength = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translate3d(0, ${y * strength}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ----------------------------------------------------------- magnetic buttons */

function initMagnetic() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const buttons = document.querySelectorAll("[data-magnetic]");
  if (!buttons.length) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  buttons.forEach((btn) => {
    const strength = 14;
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength - 1}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ----------------------------------------------------------- cookies */

function enableAnalytics() {
  console.info("Analytics enabled placeholder. Add provider code here.");
}

function initCookies() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;

  const saved = localStorage.getItem("vulora_cookie_preferences");
  const managePanel = banner.querySelector("[data-cookie-manage]");
  const analyticsToggle = banner.querySelector("[data-analytics-toggle]");

  if (saved) {
    try {
      const prefs = JSON.parse(saved);
      if (prefs.analytics) enableAnalytics();
      return;
    } catch {
      localStorage.removeItem("vulora_cookie_preferences");
    }
  }

  banner.classList.add("visible");

  const save = (analytics) => {
    localStorage.setItem("vulora_cookie_preferences", JSON.stringify({
      essential: true,
      analytics: Boolean(analytics),
      saved_at: new Date().toISOString()
    }));
    if (analytics) enableAnalytics();
    banner.classList.remove("visible");
  };

  banner.addEventListener("click", (event) => {
    const action = event.target.closest("[data-cookie-action]")?.dataset.cookieAction;
    if (!action) return;
    if (action === "accept") save(true);
    if (action === "reject") save(false);
    if (action === "manage") managePanel.hidden = !managePanel.hidden;
    if (action === "save") save(analyticsToggle.checked);
  });
}

/* ----------------------------------------------------------- misc */

function initDemoButton() {
  const button = document.querySelector("[data-demo-button]");
  if (!button) return;

  const DEMO_SCROLL_EXTRA = 100;

  button.addEventListener("click", () => {
    const target = document.querySelector("#showcase") || document.querySelector(".device");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const centeredTop = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, centeredTop + DEMO_SCROLL_EXTRA), behavior: "smooth" });
  });
}

function initVideoModal() {
  const trigger = document.querySelector("[data-video-modal-trigger]");
  const modal = document.querySelector("[data-video-modal]");
  const iframe = modal?.querySelector("[data-video-modal-iframe]");
  const videoId = parseYouTubeId(YOUTUBE_PRESENTATION_ID);

  if (!trigger || !modal || !iframe || !videoId) return;

  trigger.hidden = false;
  let lastFocus = null;

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    iframe.removeAttribute("src");

    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) modal.hidden = true;
    }, 280);

    lastFocus?.focus();
  }

  function openModal() {
    lastFocus = document.activeElement;
    iframe.src = buildYouTubeEmbedUrl(videoId);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    modal.querySelector(".video-modal__close")?.focus();
  }

  trigger.addEventListener("click", openModal);

  modal.querySelector(".video-modal__close")?.addEventListener("click", closeModal);

  // Close on backdrop click and on Escape, matching standard dialog behaviour.
  modal.querySelector(".video-modal__backdrop")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

function initShowcaseCarousel() {
  const root = document.querySelector("[data-showcase-carousel]");
  const track = root?.querySelector("[data-showcase-track]");
  const viewport = root?.querySelector("[data-showcase-viewport]");
  const dotsRoot = root?.querySelector("[data-showcase-dots]");
  const prevBtn = root?.querySelector("[data-showcase-prev]");
  const nextBtn = root?.querySelector("[data-showcase-next]");
  if (!root || !track || !viewport || !dotsRoot || !prevBtn || !nextBtn || !SHOWCASE_SLIDES.length) return;

  let activeIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  function renderSlides() {
    track.innerHTML = "";
    dotsRoot.innerHTML = "";

    SHOWCASE_SLIDES.forEach((slide, index) => {
      const figure = document.createElement("figure");
      figure.className = `showcase-slide${index === activeIndex ? " is-active" : ""}`;
      figure.setAttribute("role", "group");
      figure.setAttribute("aria-roledescription", "slide");
      figure.setAttribute("aria-label", `${index + 1} of ${SHOWCASE_SLIDES.length}`);

      const mockup = createDeviceMockup(
        slide.src,
        getTranslation(slide.altKey),
        index === 0 ? "eager" : "lazy"
      );

      const caption = document.createElement("figcaption");
      caption.className = "showcase-caption";
      caption.textContent = getTranslation(slide.captionKey);

      figure.appendChild(mockup);
      figure.appendChild(caption);
      track.appendChild(figure);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `showcase-dot${index === activeIndex ? " is-active" : ""}`;
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", getTranslation(slide.captionKey));
      dot.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      dot.addEventListener("click", () => goTo(index));
      dotsRoot.appendChild(dot);
    });
  }

  function updateUI() {
    const offset = activeIndex * -100;
    track.style.transform = `translateX(${offset}%)`;
    track.querySelectorAll(".showcase-slide").forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    dotsRoot.querySelectorAll(".showcase-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
    });
    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === SHOWCASE_SLIDES.length - 1;
  }

  function goTo(index) {
    activeIndex = Math.max(0, Math.min(SHOWCASE_SLIDES.length - 1, index));
    updateUI();
  }

  prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  viewport.addEventListener("touchmove", (event) => {
    touchDeltaX = event.changedTouches[0].clientX - touchStartX;
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 40) return;
    if (touchDeltaX < 0) goTo(activeIndex + 1);
    else goTo(activeIndex - 1);
  }, { passive: true });

  renderSlides();
  updateUI();

  if (SHOWCASE_SLIDES.length <= 1) {
    root.querySelector(".showcase-controls")?.setAttribute("hidden", "");
  }

  refreshShowcaseCarousel = () => {
    renderSlides();
    updateUI();
  };
}

function initHeaderScrolled() {
  const header = document.querySelector(".site-header--float");
  if (!header) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Script is at end of <body> — all DOM is available right now.
// Run everything synchronously BEFORE the browser paints, so the user
// never sees untranslated text or un-revealed content. This mimics
// the instant feel of server-side rendered pages.
initLanguage();
initReveal();
initParallax();
initMagnetic();
initCookies();
initDemoButton();
initVideoModal();
initShowcaseCarousel();
initHeaderScrolled();

// Enable scroll-reveal transitions only after the first paint is committed.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add("motion-ready");
  });
});

// safety fallback — reveal page even if something above throws
setTimeout(() => document.documentElement.classList.remove("pre-i18n"), 400);
