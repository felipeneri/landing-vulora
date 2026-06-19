const LAUNCH_DATE = "2026-08-01T09:00:00-03:00";
const LEADS_ENDPOINT = "";

const SHOWCASE_SLIDES = [
  {
    src: "assets/app-vulora.webp",
    altKey: "showcase.slides.overview.alt",
    captionKey: "showcase.slides.overview.caption"
  }
];

let refreshShowcaseCarousel = null;

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
      title: "Vulora — Private Financial Intelligence",
      description: "A private, AI-native financial experience designed to turn your money into a conversation.",
      ogTitle: "Vulora — Private Financial Intelligence",
      ogDescription: "A private, AI-native financial experience designed to turn your money into a conversation.",
      twitterTitle: "Vulora — Private Financial Intelligence",
      twitterDescription: "A private, AI-native financial experience designed to turn your money into a conversation.",
      privacyTitle: "Privacy Policy — Vulora",
      privacyDescription: "Vulora landing page privacy policy.",
      cookiesTitle: "Cookie Policy — Vulora",
      cookiesDescription: "Vulora cookie policy.",
      termsTitle: "Terms of Use — Vulora",
      termsDescription: "Vulora terms of use."
    },
    nav: { product: "Product", showcase: "App", privacy: "Privacy", beta: "Beta", faq: "FAQ", waitlist: "Join waitlist" },
    hero: {
      badge: "Private AI · Local-first · Finance",
      title: "Private financial intelligence.",
      subtitle: "Vulora turns your financial life into a private conversation — intelligent, contextual and designed to feel alive.",
      primaryCta: "Join the private beta",
      secondaryCta: "Watch demo"
    },
    mockup: {
      user: "Can I spend less this month?",
      ai: "Yes. Subscriptions rose 18%. I found three quiet savings.",
      metric: "Private insight",
      metricValue: "−18% subscriptions"
    },
    showcase: {
      eyebrow: "Inside the app",
      title: "Quiet intelligence, in your pocket.",
      subtitle: "A dark, liquid-glass interface designed to keep your financial life private — conversational, contextual and unmistakably yours.",
      slides: {
        overview: {
          alt: "Vulora app home screen",
          caption: "Your financial life, in conversation."
        }
      }
    },
    conversation: {
      eyebrow: "The product",
      title: "Not a dashboard. A conversation.",
      cards: {
        ask: { title: "Ask naturally", text: "Talk to your money like you would talk to a trusted analyst." },
        spend: { title: "Understand your spending", text: "See context, patterns and signals without staring at charts." },
        private: { title: "Keep data private", text: "Built around the belief that sensitive financial data deserves restraint." }
      }
    },
    privacy: {
      eyebrow: "Private by design",
      title: "Financial intelligence should feel close, not exposed.",
      text: "Vulora is being designed to reduce cloud dependency, keep context near you and make personal finance feel fast, quiet and trustworthy.",
      cards: {
        sensitive: { title: "Sensitive by nature", text: "Money data deserves clear boundaries and careful handling." },
        cloud: { title: "Less cloud reliance", text: "The vision is local-first intelligence with the cloud used intentionally." },
        offline: { title: "Fast and contextual", text: "Designed for an offline-first experience that understands your context." }
      }
    },
    beta: {
      eyebrow: "Private beta",
      title: "Something private is coming.",
      subtitle: "We're preparing the first private beta of Vulora."
    },
    countdown: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    form: {
      title: "Join the waitlist",
      subtitle: "Early access invitations will be sent privately.",
      name: "Name (optional)",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      consent: "I agree to receive updates about Vulora and understand I can unsubscribe at any time.",
      submit: "Request access",
      loading: "Sending request…",
      success: "You're on the list. We'll be in touch privately.",
      successTitle: "You're on the list",
      successSubtitle: "We'll be in touch privately when the beta opens.",
      invalidEmail: "Enter a valid email address.",
      consentRequired: "Consent is required to join the waitlist.",
      error: "Something went wrong. Please try again."
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers, quiet promises.",
      items: {
        what: { q: "What is Vulora?", a: "Vulora is a personal financial intelligence project designed to make your financial life conversational, contextual and private." },
        bank: { q: "Is Vulora a bank?", a: "No. Vulora is not a bank, financial institution, broker or investment adviser." },
        cloud: { q: "Does Vulora send my financial data to the cloud?", a: "Vulora is being designed with a local-first privacy vision and reduced cloud dependency. Product behavior may evolve during beta." },
        when: { q: "When will it be available?", a: "The first private beta is planned as a preview. Join the waitlist to receive updates." },
        advice: { q: "Is this financial advice?", a: "No. Vulora content is informational and does not replace professional financial, legal, accounting or tax advice." }
      }
    },
    footer: {
      tagline: "Private financial intelligence, designed with restraint.",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      terms: "Terms of Use",
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
    legal: { back: "Back to site" },
    privacyPage: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      updated: "Last updated: June 18, 2026",
      sections: {
        collect: { title: "What we collect", text: "This landing page may collect your optional name, email address, consent status and UTM parameters from the URL when you join the waitlist." },
        use: { title: "How we use it", text: "We use this information to manage the interested users list, send project updates and understand traffic sources." },
        control: { title: "Your choices", text: "You may request access, correction or deletion of your landing page data by contacting privacy@vulora.com.br." },
        project: { title: "Development notice", text: "The Vulora application is a project in development. Product features, data handling and availability may change as the beta evolves." },
        updates: { title: "Updates", text: "This policy may be updated from time to time. We avoid absolute promises and aim to describe our practices clearly." }
      }
    },
    cookiesPage: {
      eyebrow: "Legal",
      title: "Cookie Policy",
      updated: "Last updated: June 18, 2026",
      sections: {
        necessary: { title: "Necessary storage", text: "We use necessary browser storage for basic site behavior, such as remembering your language and cookie preferences." },
        optional: { title: "Non-essential cookies", text: "Analytics or marketing tools should only run after your consent. They are off by default on this static landing page." },
        manage: { title: "Managing consent", text: "The cookie banner on the landing page lets you accept all, reject non-essential storage or manage preferences. You can clear browser storage to reset the choice." }
      }
    },
    termsPage: {
      eyebrow: "Legal",
      title: "Terms of Use",
      updated: "Last updated: June 18, 2026",
      sections: {
        site: { title: "This website", text: "This site is an informational landing page used to present Vulora and collect interest in a private beta." },
        notFinancial: { title: "No financial services", text: "Vulora is not a financial institution, bank, broker, investment adviser or financial consultancy." },
        noAdvice: { title: "No professional advice", text: "Information on this site is not financial, legal, accounting or tax advice and should not replace qualified professional guidance." },
        liability: { title: "Liability", text: "The site is provided for general information. To the extent permitted by law, Vulora is not responsible for losses arising from reliance on preview information or temporary unavailability." }
      }
    }
  },
  "pt-BR": {
    meta: {
      title: "Vulora — Inteligência Financeira Privada",
      description: "Uma experiência financeira privada e nativa de IA, criada para transformar seu dinheiro em uma conversa.",
      ogTitle: "Vulora — Inteligência Financeira Privada",
      ogDescription: "Uma experiência financeira privada e nativa de IA, criada para transformar seu dinheiro em uma conversa.",
      twitterTitle: "Vulora — Inteligência Financeira Privada",
      twitterDescription: "Uma experiência financeira privada e nativa de IA, criada para transformar seu dinheiro em uma conversa.",
      privacyTitle: "Política de Privacidade — Vulora",
      privacyDescription: "Política de privacidade da landing page da Vulora.",
      cookiesTitle: "Política de Cookies — Vulora",
      cookiesDescription: "Política de cookies da Vulora.",
      termsTitle: "Termos de Uso — Vulora",
      termsDescription: "Termos de uso da Vulora."
    },
    nav: { product: "Produto", showcase: "App", privacy: "Privacidade", beta: "Beta", faq: "FAQ", waitlist: "Entrar na lista" },
    hero: {
      badge: "IA privada · Local-first · Finanças",
      title: "Inteligência financeira privada.",
      subtitle: "A Vulora transforma sua vida financeira em uma conversa privada — inteligente, contextual e desenhada para parecer viva.",
      primaryCta: "Entrar no beta privado",
      secondaryCta: "Ver demo"
    },
    mockup: {
      user: "Posso gastar menos este mês?",
      ai: "Sim. Assinaturas subiram 18%. Encontrei três economias discretas.",
      metric: "Insight privado",
      metricValue: "−18% assinaturas"
    },
    showcase: {
      eyebrow: "Dentro do app",
      title: "Inteligência silenciosa, no seu bolso.",
      subtitle: "Uma interface escura em liquid glass, desenhada para manter sua vida financeira privada — conversacional, contextual e inconfundivelmente sua.",
      slides: {
        overview: {
          alt: "Tela inicial do app Vulora",
          caption: "Sua vida financeira, em conversa."
        }
      }
    },
    conversation: {
      eyebrow: "O produto",
      title: "Não é um dashboard. É uma conversa.",
      cards: {
        ask: { title: "Pergunte naturalmente", text: "Converse com seu dinheiro como falaria com um analista de confiança." },
        spend: { title: "Entenda seus gastos", text: "Veja contexto, padrões e sinais sem encarar gráficos o tempo todo." },
        private: { title: "Mantenha dados privados", text: "Criada a partir da convicção de que dados financeiros sensíveis exigem discrição." }
      }
    },
    privacy: {
      eyebrow: "Privacidade por design",
      title: "Inteligência financeira deve parecer próxima, não exposta.",
      text: "A Vulora está sendo desenhada para reduzir dependência da nuvem, manter contexto perto de você e tornar finanças pessoais rápidas, silenciosas e confiáveis.",
      cards: {
        sensitive: { title: "Sensível por natureza", text: "Dados sobre dinheiro merecem limites claros e cuidado no tratamento." },
        cloud: { title: "Menos dependência da nuvem", text: "A visão é uma inteligência local-first, com nuvem usada de forma intencional." },
        offline: { title: "Rápida e contextual", text: "Projetada para uma experiência offline-first que entende seu contexto." }
      }
    },
    beta: {
      eyebrow: "Beta privado",
      title: "Algo privado está chegando.",
      subtitle: "Estamos preparando o primeiro beta privado da Vulora."
    },
    countdown: { days: "Dias", hours: "Horas", minutes: "Minutos", seconds: "Segundos" },
    form: {
      title: "Entre na lista",
      subtitle: "Convites de acesso antecipado serão enviados de forma privada.",
      name: "Nome (opcional)",
      namePlaceholder: "Seu nome",
      email: "E-mail",
      emailPlaceholder: "voce@exemplo.com",
      consent: "Aceito receber novidades sobre a Vulora e entendo que posso cancelar a inscrição a qualquer momento.",
      submit: "Solicitar acesso",
      loading: "Enviando solicitação…",
      success: "Você está na lista. Entraremos em contato de forma privada.",
      successTitle: "Você está na lista",
      successSubtitle: "Entraremos em contato de forma privada quando o beta abrir.",
      invalidEmail: "Informe um e-mail válido.",
      consentRequired: "O consentimento é obrigatório para entrar na lista.",
      error: "Algo deu errado. Tente novamente."
    },
    faq: {
      eyebrow: "FAQ",
      title: "Respostas claras, promessas silenciosas.",
      items: {
        what: { q: "O que é a Vulora?", a: "A Vulora é um projeto de inteligência financeira pessoal criado para tornar sua vida financeira conversacional, contextual e privada." },
        bank: { q: "A Vulora é um banco?", a: "Não. A Vulora não é banco, instituição financeira, corretora ou consultoria de investimentos." },
        cloud: { q: "A Vulora envia meus dados financeiros para a nuvem?", a: "A Vulora está sendo desenhada com uma visão local-first de privacidade e menor dependência da nuvem. O comportamento do produto pode evoluir durante o beta." },
        when: { q: "Quando estará disponível?", a: "O primeiro beta privado está planejado como uma versão preview. Entre na lista para receber novidades." },
        advice: { q: "Isso é aconselhamento financeiro?", a: "Não. O conteúdo da Vulora é informativo e não substitui orientação profissional financeira, jurídica, contábil ou tributária." }
      }
    },
    footer: {
      tagline: "Inteligência financeira privada, desenhada com discrição.",
      privacy: "Política de Privacidade",
      cookies: "Política de Cookies",
      terms: "Termos de Uso",
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
    legal: { back: "Voltar ao site" },
    privacyPage: {
      eyebrow: "Legal",
      title: "Política de Privacidade",
      updated: "Última atualização: 18 de junho de 2026",
      sections: {
        collect: { title: "O que coletamos", text: "Esta landing page pode coletar seu nome opcional, endereço de e-mail, status de consentimento e parâmetros UTM da URL quando você entra na lista de espera." },
        use: { title: "Como usamos", text: "Usamos essas informações para gerenciar a lista de interessados, enviar novidades do projeto e entender a origem do tráfego." },
        control: { title: "Suas escolhas", text: "Você pode solicitar acesso, correção ou exclusão dos seus dados da landing page entrando em contato por privacy@vulora.com.br." },
        project: { title: "Aviso de desenvolvimento", text: "A aplicação Vulora é um projeto em desenvolvimento. Funcionalidades, tratamento de dados e disponibilidade podem mudar conforme o beta evolui." },
        updates: { title: "Atualizações", text: "Esta política pode ser atualizada periodicamente. Evitamos promessas absolutas e buscamos descrever nossas práticas com clareza." }
      }
    },
    cookiesPage: {
      eyebrow: "Legal",
      title: "Política de Cookies",
      updated: "Última atualização: 18 de junho de 2026",
      sections: {
        necessary: { title: "Armazenamento necessário", text: "Usamos armazenamento necessário do navegador para o funcionamento básico do site, como lembrar seu idioma e suas preferências de cookies." },
        optional: { title: "Cookies não essenciais", text: "Ferramentas de analytics ou marketing só devem rodar após seu consentimento. Elas ficam desligadas por padrão nesta landing estática." },
        manage: { title: "Gerenciar consentimento", text: "O banner de cookies na landing permite aceitar tudo, rejeitar armazenamento não essencial ou gerenciar preferências. Você pode limpar o armazenamento do navegador para redefinir a escolha." }
      }
    },
    termsPage: {
      eyebrow: "Legal",
      title: "Termos de Uso",
      updated: "Última atualização: 18 de junho de 2026",
      sections: {
        site: { title: "Este site", text: "Este site é uma landing page informativa usada para apresentar a Vulora e captar interessados em um beta privado." },
        notFinancial: { title: "Sem serviços financeiros", text: "A Vulora não é instituição financeira, banco, corretora, consultoria de investimentos ou consultoria financeira." },
        noAdvice: { title: "Sem aconselhamento profissional", text: "As informações deste site não constituem aconselhamento financeiro, jurídico, contábil ou tributário e não substituem orientação profissional qualificada." },
        liability: { title: "Responsabilidade", text: "O site é fornecido para informação geral. Na extensão permitida por lei, a Vulora não se responsabiliza por perdas decorrentes de confiança em informações de preview ou indisponibilidade temporária." }
      }
    }
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

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = currentLanguage;
  });

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

function initLanguage() {
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.addEventListener("change", (event) => applyLanguage(event.target.value));
  });
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

/* ----------------------------------------------------------- countdown */

function initCountdown() {
  const nodes = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
    seconds: document.querySelector('[data-countdown="seconds"]')
  };
  if (!nodes.days) return;

  const target = new Date(LAUNCH_DATE).getTime();
  const pad = (value) => String(value).padStart(2, "0");
  const update = () => {
    const distance = Math.max(0, target - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    nodes.days.textContent = pad(days);
    nodes.hours.textContent = pad(hours);
    nodes.minutes.textContent = pad(minutes);
    nodes.seconds.textContent = pad(seconds);
  };

  update();
  setInterval(update, 1000);
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

/* ----------------------------------------------------------- lead form */

function getUtmPayload() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || ""
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldState(input, state) {
  const field = input.closest(".field");
  if (!field) return;
  field.classList.remove("is-invalid", "is-valid");
  if (state) field.classList.add(`is-${state}`);
}

function showStatus(status, message, type = "") {
  status.textContent = message;
  status.classList.remove("error", "success");
  status.classList.remove("is-visible");
  if (type) status.classList.add(type);
  requestAnimationFrame(() => status.classList.add("is-visible"));
}

function initLeadForm() {
  const form = document.querySelector("[data-lead-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[name="email"]');
  const consentInput = form.querySelector('input[name="consent"]');

  emailInput?.addEventListener("input", () => {
    if (emailInput.value.trim() && isValidEmail(emailInput.value.trim())) {
      setFieldState(emailInput, "valid");
    } else {
      setFieldState(emailInput, null);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.classList.remove("is-visible", "error", "success");

    const formData = new FormData(form);
    if (formData.get("website")) return;

    const email = String(formData.get("email") || "").trim();
    const consent = formData.get("consent") === "on";

    if (!isValidEmail(email)) {
      setFieldState(emailInput, "invalid");
      showStatus(status, getTranslation("form.invalidEmail"), "error");
      emailInput?.focus();
      return;
    }
    setFieldState(emailInput, "valid");

    if (!consent) {
      showStatus(status, getTranslation("form.consentRequired"), "error");
      consentInput?.focus();
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email,
      consent: true,
      language: getCurrentLanguage(),
      source: "vulora-landing",
      ...getUtmPayload(),
      created_at: new Date().toISOString()
    };

    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = getTranslation("form.loading");

    try {
      if (LEADS_ENDPOINT) {
        const response = await fetch(LEADS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Lead endpoint failed: ${response.status}`);
      } else {
        console.info("Vulora lead payload", payload);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      form.reset();
      setFieldState(emailInput, null);
      form.setAttribute("data-state", "success");
      const heading = form.querySelector(".form-heading");
      if (heading) {
        heading.innerHTML = "";
        const title = document.createElement("h3");
        title.textContent = getTranslation("form.successTitle");
        const sub = document.createElement("p");
        sub.textContent = getTranslation("form.successSubtitle");
        heading.appendChild(title);
        heading.appendChild(sub);
      }
      showStatus(status, getTranslation("form.success"), "success");
    } catch (error) {
      console.error(error);
      showStatus(status, getTranslation("form.error"), "error");
    } finally {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.textContent = getTranslation("form.submit");
    }
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

  button.addEventListener("click", () => {
    const target = document.querySelector("#showcase") || document.querySelector(".device");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
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
initCountdown();
initParallax();
initMagnetic();
initLeadForm();
initCookies();
initDemoButton();
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
