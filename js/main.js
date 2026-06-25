const SHOWCASE_SLIDES = [
	{ src: "assets/screens/vulora-screen-01.webp", altKey: "showcase.slides.s01.alt", captionKey: "showcase.slides.s01.caption" },
	{ src: "assets/screens/vulora-screen-02.webp", altKey: "showcase.slides.s02.alt", captionKey: "showcase.slides.s02.caption" },
	{ src: "assets/screens/vulora-screen-03.webp", altKey: "showcase.slides.s03.alt", captionKey: "showcase.slides.s03.caption" },
	{ src: "assets/screens/vulora-screen-04.webp", altKey: "showcase.slides.s04.alt", captionKey: "showcase.slides.s04.caption" },
	{ src: "assets/screens/vulora-screen-05.webp", altKey: "showcase.slides.s05.alt", captionKey: "showcase.slides.s05.caption" },
	{ src: "assets/screens/vulora-screen-06.webp", altKey: "showcase.slides.s06.alt", captionKey: "showcase.slides.s06.caption" },
	{ src: "assets/screens/vulora-screen-07.webp", altKey: "showcase.slides.s07.alt", captionKey: "showcase.slides.s07.caption" },
	{ src: "assets/screens/vulora-screen-08.webp", altKey: "showcase.slides.s08.alt", captionKey: "showcase.slides.s08.caption" },
	{ src: "assets/screens/vulora-screen-09.webp", altKey: "showcase.slides.s09.alt", captionKey: "showcase.slides.s09.caption" },
	{ src: "assets/screens/vulora-screen-10.webp", altKey: "showcase.slides.s10.alt", captionKey: "showcase.slides.s10.caption" },
	{ src: "assets/screens/vulora-screen-11.webp", altKey: "showcase.slides.s11.alt", captionKey: "showcase.slides.s11.caption" },
	{ src: "assets/screens/vulora-screen-12.webp", altKey: "showcase.slides.s12.alt", captionKey: "showcase.slides.s12.caption" },
	{ src: "assets/screens/vulora-screen-13.webp", altKey: "showcase.slides.s13.alt", captionKey: "showcase.slides.s13.caption" },
	{ src: "assets/screens/vulora-screen-14.webp", altKey: "showcase.slides.s14.alt", captionKey: "showcase.slides.s14.caption" },
];

let refreshShowcaseCarousel = null;

// Paste a YouTube video ID or any YouTube URL (watch, youtu.be, embed, shorts).
const YOUTUBE_PRESENTATION_ID = "LieSDjw8Amw";

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
		const fromString = value.match(
			/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([\w-]{11})/,
		);
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
		enablejsapi: "1",
	});

	if (window.location.origin && window.location.origin !== "null") {
		params.set("origin", window.location.origin);
	}

	return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/* ----------------------------------------------------------- device mockup */

const MOCKUP_FRAME = "assets/mockup.png";

function createDeviceMockup(appSrc, alt, loading = "lazy") {
	// Showcase screens are pre-baked 448x916 composites (screenshot already
	// placed inside the device frame). They're painted edge-to-edge behind the
	// frame via the `.device-mockup--composite` variant, aligning exactly.
	const mockup = document.createElement("div");
	mockup.className = "device-mockup device-mockup--composite";
	mockup.setAttribute("aria-label", alt);

	const screen = document.createElement("div");
	screen.className = "device-mockup__screen";

	const app = document.createElement("img");
	app.className = "device-mockup__app";
	app.src = appSrc;
	app.alt = alt;
	app.loading = loading;
	app.decoding = "async";
	app.width = 448;
	app.height = 916;

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
			title: "Vulora — Private financial AI",
			description:
				"A functional Flutter app and case study exploring private financial AI, local-first inference, offline data and mobile architecture.",
			ogTitle:
				"Vulora — Private financial AI, local-first and built with Flutter",
			ogDescription:
				"A technical case study on building a financial assistant with local AI, offline data, tool calling and privacy by architecture.",
			twitterTitle: "Vulora — Private financial AI",
			twitterDescription:
				"A functional Flutter app and case study exploring private financial AI, local-first inference, offline data and mobile architecture.",
		},
		a11y: {
			primaryNav: "Primary navigation",
			home: "Vulora home",
			mainNav: "Main",
			languageSelector: "Language selector",
			language: "Language",
			appPreview: "Vulora app preview",
			appInterface: "Vulora app interface",
			status: "Vulora status",
			showcase: "App screenshots",
			previousScreenshot: "Previous screenshot",
			nextScreenshot: "Next screenshot",
			screenshotNavigation: "Screenshot navigation",
			socialLinks: "Social links",
			email: "Email Vulora",
			close: "Close",
			presentationVideo: "Presentation video",
		},
		nav: {
			demo: "Demo",
			product: "Product",
			features: "Features",
			architecture: "Architecture",
			roadmap: "Roadmap",
			about: "About",
			contact: "Get in touch",
		},
		hero: {
			badge: "Local-first AI · Private by design · Flutter",
			title: "Your financial memory. Your device. Your rules.",
			subtitle:
				"Vulora combines on-device AI, persistent financial memory and deterministic tools to give you a financial assistant that knows your money — without sending it anywhere.",
			primaryCta: "View showcase",
			secondaryCta: "Explore architecture",
			tertiaryCta: "Watch presentation",
		},
		problem: {
			eyebrow: "The problem",
			title:
				"Financial data is too sensitive to depend on public clouds by default.",
			text: "The major AI labs are now building financial assistants. That means your spending habits, transaction history and financial context are becoming the most sensitive data they will ever process — routed through their clouds, their models, their terms of service. Vulora starts from a different question: what if financial intelligence ran close to the data, instead of sending everything away?",
		},
		whynow: {
			eyebrow: "Why now",
			title: "On-device AI stopped being an experiment in 2026.",
			subtitle:
				"For a long time, running serious AI on a phone wasn't viable. That changed — and Vulora was built right at that turning point.",
			cards: {
				models: {
					title: "Small, efficient models",
					text: "Models like Gemma deliver real value on well-scoped tasks such as personal finance — no datacenter required.",
				},
				hardware: {
					title: "The hardware is ready",
					text: "GPU and NPU acceleration on modern phones make local inference fast and viable for everyday use.",
				},
				platforms: {
					title: "Platforms pushing the edge",
					text: "Flutter (flutter_gemma/LiteRT-LM), Apple and Google investing heavily in on-device AI make the timing favorable for well-executed local apps.",
				},
			},
		},
		product: {
			eyebrow: "The product",
			title: "A private financial assistant that remembers your money — and keeps it yours.",
			text: "Vulora combines AI conversation, a persistent financial memory layer and local data to help you register expenses, understand budgets and get honest insights — without your financial life leaving your device by default.",
			note: "Not a launched product yet — a functional app in progress and a product bet: showing what a truly private financial assistant looks like when privacy is built from the architecture up.",
			status: {
				prototype: "Functional prototype",
				ai: "Local-first AI",
				tools: "21+ tools",
				i18n: "Multilingual",
				offline: "Offline-first data",
				model: "Model-agnostic",
			},
		},
		current: {
			eyebrow: "Current state",
			title: "What already works in Vulora.",
			subtitle:
				"Vulora is still in development, but already has a functional foundation with AI, financial tools, local persistence and a mobile interface.",
			cards: {
				assistant: {
					title: "Conversational financial assistant",
					text: "Talk in natural language to register expenses, query financial information and interact with the app through AI.",
				},
				tools: {
					title: "21+ functional tools",
					text: "A typed tool layer for expenses, budgets, transactions, categories, private memory, language, currency, theme and export.",
				},
				inference: {
					title: "Local-first inference",
					text: "On-device model execution, with the option to route inference to trusted providers on a LAN or private cloud.",
				},
				persistence: {
					title: "Offline persistence",
					text: "Financial data and preferences live on the device, powered by SQLite/Drift and Hive.",
				},
				ui: {
					title: "Deterministic generative UI",
					text: "The model calls tools, but the app renders visual components natively and predictably.",
				},
				confirmation: {
					title: "Confirmations for sensitive actions",
					text: "Edits, deletions and exports require explicit confirmation before changing user data.",
				},
			},
		},
		showcase: {
			eyebrow: "Experience",
			title: "A mobile interface designed for contextual AI.",
			subtitle:
				"Vulora combines conversation, visual components and financial actions in a fluid experience. The AI interprets intent; the app executes tools and renders visual responses with control, safety and consistency.",
			slides: {
				s01: { alt: "Vulora screen 01", caption: "Description 01 here" },
				s02: { alt: "Vulora screen 02", caption: "Description 02 here" },
				s03: { alt: "Vulora screen 03", caption: "Description 03 here" },
				s04: { alt: "Vulora screen 04", caption: "Description 04 here" },
				s05: { alt: "Vulora screen 05", caption: "Description 05 here" },
				s06: { alt: "Vulora screen 06", caption: "Description 06 here" },
				s07: { alt: "Vulora screen 07", caption: "Description 07 here" },
				s08: { alt: "Vulora screen 08", caption: "Description 08 here" },
				s09: { alt: "Vulora screen 09", caption: "Description 09 here" },
				s10: { alt: "Vulora screen 10", caption: "Description 10 here" },
				s11: { alt: "Vulora screen 11", caption: "Description 11 here" },
				s12: { alt: "Vulora screen 12", caption: "Description 12 here" },
				s13: { alt: "Vulora screen 13", caption: "Description 13 here" },
				s14: { alt: "Vulora screen 14", caption: "Description 14 here" },
			},
		},
		engineering: {
			eyebrow: "Engineering",
			title:
				"The hard part is not creating a chatbot. It is making AI act with safety, context and privacy.",
			subtitle:
				"Vulora was built as a local-first architecture: model, tools, data and interface work together to deliver useful AI without giving up control.",
			cards: {
				llm: {
					tag: "Gemma · GPU · on-device",
					title: "Local inference",
					text: "A local model runs on device with opt-in download, response streaming and performance care for mobile hardware.",
				},
				tools: {
					tag: "Function calling",
					title: "Tool layer",
					text: "AI does not mutate data directly. It calls typed tools, and Dart handlers execute actions deterministically.",
				},
				guardrails: {
					tag: "Guardrails",
					title: "Sensitive actions with confirmation",
					text: "Edits, deletions and exports pass through confirmation cards before any persistent change.",
				},
				genui: {
					tag: "Generative UI",
					title: "App-owned visual components",
					text: "The interface does not depend on free-form JSON generated by the model. The app renders native components from typed payloads.",
				},
				streaming: {
					tag: "Streaming · FFI",
					title: "Execution control",
					text: "Real-time streaming, native concurrency control, context pruning and error handling keep the experience stable.",
				},
				storage: {
					tag: "Drift · Hive",
					title: "Local data",
					text: "Transactions, categories, preferences and contextual memory live on the device with local-first persistence.",
				},
			},
		},
		stack: {
			eyebrow: "Stack",
			title: "A mobile architecture for private AI.",
			subtitle:
				"Vulora combines a mobile app, local LLM, offline data and pluggable providers in a modular architecture.",
			blocks: {
				client: {
					title: "Client",
					text: "Flutter · Dart · Provider · Custom design system · Liquid glass UI",
				},
				local: {
					title: "Local AI",
					text: "Gemma · flutter_gemma · GPU backend · Streaming · Function calling",
				},
				private: {
					title: "Private / LAN AI",
					text: "OpenAI-compatible endpoints · Anthropic Messages API · Custom providers · Private endpoints",
				},
				data: {
					title: "Data Layer",
					text: "Drift · SQLite · Hive · Migrations · Money stored in cents",
				},
				ux: {
					title: "UX & Product",
					text: "PT/EN i18n · Runtime language switching · Audio input · Confirmation cards · Generative UI",
				},
				reliability: {
					title: "Reliability",
					text: "Typed tool dispatcher · FFI mutex · Token pruning · Error states · Opt-in model download",
				},
			},
		},
		decisions: {
			eyebrow: "Technical decisions",
			title: "Real problems that shaped the architecture.",
			subtitle:
				"Vulora is not just an interface for AI. The project required decisions about local execution, safety, persistence, streaming, UX and privacy.",
			labels: { decision: "Decision", result: "Result" },
			items: {
				local: {
					problem: "Running local AI on mobile hardware",
					decision:
						"Use on-device inference with a local model, opt-in download and adjustments to reduce excessive memory risk.",
					result:
						"A functional foundation for private AI without depending by default on public APIs.",
				},
				control: {
					problem: "Letting AI execute actions without losing control",
					decision:
						"Separate model intent and app execution through typed tools and deterministic handlers.",
					result:
						"The AI interprets the request; the application controls the action.",
				},
				ui: {
					problem:
						"Creating generative UI without handing the screen to the model",
					decision: "Render native visual components from typed payloads.",
					result:
						"The experience feels generative while staying predictable, safe and consistent.",
				},
			},
		},
		roadmap: {
			eyebrow: "Roadmap",
			title: "Where Vulora is today — and where it is going.",
			subtitle:
				"Vulora is an application in continuous development. The AI foundation, local data, tools and mobile experience already exist; the next steps deepen financial intelligence, UX and reliability.",
			phase0: {
				label: "Phase 0 · Completed",
				title: "AI foundation and tool calling",
				text: "AI chat, streaming, initial tools, theme control, calculator, financial transactions and conversation reset.",
			},
			phase1: {
				label: "Phase 1 · Completed",
				title: "Persistence and financial domain",
				text: "Drift, Hive, categories, transactions, budgets, export, private memory and local data.",
			},
			phase2: {
				label: "Phase 2 · Completed",
				title: "Mobile experience and design system",
				text: "Glass interface, brand splash, visual components, rich empty state, carousels, cards and consistent visual system.",
			},
			current: {
				label: "Current phase",
				title: "Product refinement and public case study",
				text: "Landing page, demo, technical narrative, positioning clarity and case preparation for portfolio use.",
			},
			next: {
				label: "Next steps",
				title: "Fine-tuning and deeper financial intelligence",
				text: "Fine-tuning and customization of the local model for more efficient and accurate answers",
			},
		},
		privacy: {
			eyebrow: "Privacy",
			title: "Privacy is not added at the end. It shapes the architecture.",
			text: "In Vulora, financial data, preferences, history and context are designed to stay close to the user. Cloud can be used when it makes sense, but it is not the mandatory starting point.",
			cards: {
				sensitive: {
					title: "Your data stays on your device",
					text: "Transactions, memory, habits and history live in your phone. Not in a datacenter.",
				},
				cloud: {
					title: "No training on your money",
					text: "What you earn, spend and save is yours. It doesn't improve their model.",
				},
				offline: {
					title: "Cloud when you choose it",
					text: "You decide if and when inference goes off-device — to a private endpoint you trust.",
				},
			},
		},
		contact: {
			eyebrow: "The engineer",
			title: "Built like a product. Documented as a case study.",
			text: "I am a product engineer, and I created Vulora to explore a question that matters: what would a truly private financial assistant look like — built for Brazil, designed for real financial behavior, without handing your financial life to Big Tech?",
			text2:
				"The project brings together Flutter architecture, local LLM inference, tool calling, offline persistence, i18n, streaming, design system, guardrails and a product vision applied to a sensitive domain: personal finance.",
			note: "If you build, invest in, or hire across mobile, applied AI, fintech or privacy — whether for a team, a product or a thesis — let's talk.",
			site: "Personal site",
			linkedin: "Connect on LinkedIn",
			github: "View GitHub",
		},
		faq: {
			eyebrow: "FAQ",
			title: "Clear answers, no hype.",
			items: {
				what: {
					q: "What is Vulora?",
					a: "Vulora is a functional application and technical case study about private financial AI. It combines Flutter, local-first AI, offline data, tool calling and a modern mobile interface to explore how financial assistants can work without depending by default on public clouds.",
				},
				available: {
					q: "Is Vulora available for download?",
					a: "Not yet. Vulora is in development and exists today as a functional proof of concept and technical case study.",
				},
				why: {
					q: "Why run local models?",
					a: "Because financial data is sensitive. Running AI locally, on a local network or on trusted private endpoints reduces reliance on public clouds and makes privacy an architectural decision.",
				},
				stack: {
					q: "What's the stack?",
					a: "Flutter and Dart on the client, local model support with Gemma/flutter_gemma, a pluggable inference layer, typed tools, local persistence with Drift/SQLite and Hive, PT/EN i18n and a custom design system.",
				},
				bank: {
					q: "Is Vulora a bank or financial advice?",
					a: "No. Vulora is not a bank, financial institution, broker, investment adviser or financial advice. The project is a technical software and applied AI study.",
				},
				cloud: {
					q: "Does the app use cloud?",
					a: "The proposal is local-first. Cloud can be used as an option, especially through private endpoints or trusted providers configured by the user, but it is not the mandatory default.",
				},
				bigtech: {
					q: "How is Vulora different from ChatGPT or Gemini with finance features?",
					a: "Those are general-purpose AI assistants adding finance as a feature — useful, but built on cloud-first architectures where your data fuels their systems. Vulora is built the other way around: private financial memory first, AI as the interface, cloud as an opt-in.",
				},
			},
		},
		footer: {
			tagline: "Private financial intelligence. Running where your data belongs.",
			copy: "© 2026 Vulora. All rights reserved.",
		},
		cookies: {
			bannerTitle: "Privacy preferences",
			bannerText:
				"We use only essential storage by default. Analytics and marketing stay off unless you allow them.",
			accept: "Accept all",
			reject: "Reject non-essential",
			manage: "Manage",
			essential: "Essential cookies",
			analytics: "Analytics and marketing",
			save: "Save preferences",
		},
		legal: { back: "Back to site" },
	},
	"pt-BR": {
		meta: {
			title: "Vulora — IA financeira privada",
			description:
				"Aplicação Flutter funcional e estudo de caso sobre IA financeira privada, inferência local-first, dados offline e arquitetura mobile.",
			ogTitle: "Vulora — IA financeira privada, local-first e Flutter",
			ogDescription:
				"Um estudo de caso técnico sobre como criar um assistente financeiro com IA local, dados offline, tool calling e privacidade por arquitetura.",
			twitterTitle: "Vulora — IA financeira privada",
			twitterDescription:
				"Aplicação Flutter funcional e estudo de caso sobre IA financeira privada, inferência local-first, dados offline e arquitetura mobile.",
		},
		a11y: {
			primaryNav: "Navegação principal",
			home: "Início da Vulora",
			mainNav: "Principal",
			languageSelector: "Seletor de idioma",
			language: "Idioma",
			appPreview: "Prévia do app Vulora",
			appInterface: "Interface do app Vulora",
			status: "Status da Vulora",
			showcase: "Capturas de tela do app",
			previousScreenshot: "Captura anterior",
			nextScreenshot: "Próxima captura",
			screenshotNavigation: "Navegação das capturas",
			socialLinks: "Links sociais",
			email: "Enviar email para a Vulora",
			close: "Fechar",
			presentationVideo: "Vídeo de apresentação",
		},
		nav: {
			demo: "Demo",
			product: "Produto",
			features: "Features",
			architecture: "Arquitetura",
			roadmap: "Roadmap",
			about: "Sobre",
			contact: "Falar comigo",
		},
		hero: {
			badge: "IA local-first · Privado por design · Flutter",
			title: "Sua memória financeira. Seu dispositivo. Suas regras.",
			subtitle:
				"A Vulora combina IA on-device, memória financeira persistente e tools determinísticas para te dar um assistente que conhece o seu dinheiro — sem enviar nada para fora.",
			primaryCta: "Ver showcase",
			secondaryCta: "Explorar arquitetura",
			tertiaryCta: "Assistir apresentação",
		},
		problem: {
			eyebrow: "O problema",
			title:
				"Dados financeiros são sensíveis demais para dependerem, por padrão, de nuvens públicas.",
			text: "Os grandes labs de IA estão construindo assistentes financeiros. Isso significa que seus hábitos de gasto, histórico de transações e contexto financeiro estão se tornando os dados mais sensíveis que eles vão processar — passando pelos servidores deles, pelos modelos deles, pelos termos de serviço deles. A Vulora parte de uma pergunta diferente: e se essa inteligência rodasse junto dos dados, em vez de mandá-los para fora?",
		},
		whynow: {
			eyebrow: "Por que agora",
			title: "A IA on-device deixou de ser experimento em 2026.",
			subtitle:
				"Por muito tempo, rodar IA séria no celular era inviável. Isso mudou — e a Vulora foi construída exatamente nesse ponto de virada.",
			cards: {
				models: {
					title: "Modelos pequenos e eficientes",
					text: "Modelos como o Gemma entregam valor real em tarefas com escopo definido, como finanças pessoais — sem precisar de um datacenter.",
				},
				hardware: {
					title: "Hardware pronto",
					text: "GPU e NPU em celulares modernos tornam a inferência local rápida e viável no dia a dia.",
				},
				platforms: {
					title: "Plataformas empurrando a borda",
					text: "Flutter (flutter_gemma/LiteRT-LM), Apple e Google investindo pesado em IA on-device tornam o timing favorável para apps locais bem executados.",
				},
			},
		},
		product: {
			eyebrow: "O produto",
			title: "Um assistente financeiro privado que lembra do seu dinheiro — e mantém ele seu.",
			text: "A Vulora combina conversa com IA, uma camada de memória financeira persistente e dados locais para te ajudar a registrar gastos, entender orçamento e ter insights honestos — sem que sua vida financeira saia do dispositivo por padrão.",
			note: "Ainda não é um produto lançado — uma aplicação funcional em desenvolvimento e uma aposta de produto: mostrar como seria um assistente financeiro realmente privado, construído desde a arquitetura para isso.",
			status: {
				prototype: "Protótipo funcional",
				ai: "IA local-first",
				tools: "21+ tools",
				i18n: "Multilíngue",
				offline: "Dados offline-first",
				model: "Agnóstico de modelo",
			},
		},
		current: {
			eyebrow: "Estado atual",
			title: "O que já funciona na Vulora.",
			subtitle:
				"A Vulora ainda está em desenvolvimento, mas já possui uma base funcional com IA, tools financeiras, persistência local e interface mobile.",
			cards: {
				assistant: {
					title: "Assistente financeiro conversacional",
					text: "Converse em linguagem natural para registrar gastos, consultar informações financeiras e interagir com o app por meio de IA.",
				},
				tools: {
					title: "21+ tools funcionais",
					text: "Camada de tools tipadas para gastos, orçamentos, transações, categorias, memória privada, idioma, moeda, tema e exportação.",
				},
				inference: {
					title: "Inferência local-first",
					text: "Execução on-device com modelo local, com opção de direcionamento para provedores confiáveis na rede local ou em nuvem privada.",
				},
				persistence: {
					title: "Persistência offline",
					text: "Dados financeiros e preferências vivem no dispositivo, com arquitetura baseada em SQLite/Drift e Hive.",
				},
				ui: {
					title: "UI generativa determinística",
					text: "O modelo aciona tools, mas o app renderiza os componentes visuais de forma nativa e previsível.",
				},
				confirmation: {
					title: "Confirmações para ações sensíveis",
					text: "Edições, exclusões e exportações exigem confirmação explícita antes de alterar dados do usuário.",
				},
			},
		},
		showcase: {
			eyebrow: "Experiência",
			title: "Uma interface mobile pensada para IA contextual.",
			subtitle:
				"A Vulora combina conversa, componentes visuais e ações financeiras em uma experiência fluida. A IA interpreta a intenção; o app executa tools e renderiza respostas visuais com controle, segurança e consistência.",
			slides: {
				s01: { alt: "Tela 01 da Vulora", caption: "descrição 01 aqui" },
				s02: { alt: "Tela 02 da Vulora", caption: "descrição 02 aqui" },
				s03: { alt: "Tela 03 da Vulora", caption: "descrição 03 aqui" },
				s04: { alt: "Tela 04 da Vulora", caption: "descrição 04 aqui" },
				s05: { alt: "Tela 05 da Vulora", caption: "descrição 05 aqui" },
				s06: { alt: "Tela 06 da Vulora", caption: "descrição 06 aqui" },
				s07: { alt: "Tela 07 da Vulora", caption: "descrição 07 aqui" },
				s08: { alt: "Tela 08 da Vulora", caption: "descrição 08 aqui" },
				s09: { alt: "Tela 09 da Vulora", caption: "descrição 09 aqui" },
				s10: { alt: "Tela 10 da Vulora", caption: "descrição 10 aqui" },
				s11: { alt: "Tela 11 da Vulora", caption: "descrição 11 aqui" },
				s12: { alt: "Tela 12 da Vulora", caption: "descrição 12 aqui" },
				s13: { alt: "Tela 13 da Vulora", caption: "descrição 13 aqui" },
				s14: { alt: "Tela 14 da Vulora", caption: "descrição 14 aqui" },
			},
		},
		engineering: {
			eyebrow: "Engenharia",
			title:
				"O difícil não é criar um chatbot. É fazer a IA agir com segurança, contexto e privacidade.",
			subtitle:
				"A Vulora foi construída como uma arquitetura local-first: modelo, tools, dados e interface trabalham juntos para entregar uma experiência de IA útil sem abrir mão do controle.",
			cards: {
				llm: {
					tag: "Gemma · GPU · on-device",
					title: "Inferência local",
					text: "Modelo local rodando no dispositivo, com download opt-in, streaming de respostas e cuidados de performance para hardware móvel.",
				},
				tools: {
					tag: "Function calling",
					title: "Camada de tools",
					text: "A IA não altera dados diretamente. Ela aciona tools tipadas, e handlers Dart executam ações de forma determinística.",
				},
				guardrails: {
					tag: "Guardrails",
					title: "Ações sensíveis com confirmação",
					text: "Edição, exclusão e exportação passam por cards de confirmação antes de qualquer mudança persistente.",
				},
				genui: {
					tag: "Generative UI",
					title: "Componentes visuais do app",
					text: "A interface não depende de JSON livre gerado pelo modelo. O app renderiza componentes nativos a partir de payloads tipados.",
				},
				streaming: {
					tag: "Streaming · FFI",
					title: "Controle de execução",
					text: "Streaming em tempo real, controle de concorrência nativa, poda de contexto e tratamento de erros para manter a experiência estável.",
				},
				storage: {
					tag: "Drift · Hive",
					title: "Dados locais",
					text: "Transações, categorias, preferências e memória contextual vivem no dispositivo, com persistência local-first.",
				},
			},
		},
		stack: {
			eyebrow: "Stack",
			title: "Uma arquitetura mobile para IA privada.",
			subtitle:
				"A Vulora combina app mobile, LLM local, dados offline e providers plugáveis em uma arquitetura modular.",
			blocks: {
				client: {
					title: "Client",
					text: "Flutter · Dart · Provider · Design system próprio · Liquid glass UI",
				},
				local: {
					title: "Local AI",
					text: "Gemma · flutter_gemma · GPU backend · Streaming · Function calling",
				},
				private: {
					title: "Private / LAN AI",
					text: "OpenAI-compatible endpoints · Anthropic Messages API · Custom providers · Private endpoints",
				},
				data: {
					title: "Data Layer",
					text: "Drift · SQLite · Hive · Migrations · Dinheiro em centavos",
				},
				ux: {
					title: "UX & Product",
					text: "i18n PT/EN · Troca de idioma em runtime · Entrada de áudio · Cards de confirmação · Generative UI",
				},
				reliability: {
					title: "Reliability",
					text: "Dispatcher tipado de tools · Mutex FFI · Poda de tokens · Estados de erro · Download opt-in do modelo",
				},
			},
		},
		decisions: {
			eyebrow: "Decisões técnicas",
			title: "Problemas reais que moldaram a arquitetura.",
			subtitle:
				"A Vulora não é só uma interface para IA. O projeto exigiu decisões sobre execução local, segurança, persistência, streaming, UX e privacidade.",
			labels: { decision: "Decisão", result: "Resultado" },
			items: {
				local: {
					problem: "Rodar IA local em hardware móvel",
					decision:
						"Usar inferência on-device com modelo local, download opt-in e ajustes para reduzir risco de consumo excessivo de memória.",
					result:
						"Uma base funcional para IA privada sem depender, por padrão, de APIs públicas.",
				},
				control: {
					problem: "Permitir que a IA execute ações sem perder controle",
					decision:
						"Separar intenção do modelo e execução do app por meio de tools tipadas e handlers determinísticos.",
					result: "A IA interpreta o pedido; o aplicativo controla a ação.",
				},
				ui: {
					problem: "Criar UI generativa sem entregar a tela ao modelo",
					decision:
						"Renderizar componentes visuais nativos a partir de payloads tipados.",
					result:
						"A experiência parece generativa, mas permanece previsível, segura e consistente.",
				},
			},
		},
		roadmap: {
			eyebrow: "Roadmap",
			title: "Onde a Vulora está hoje — e para onde está indo.",
			subtitle:
				"A Vulora é uma aplicação em desenvolvimento contínuo. A base de IA, dados locais, tools e experiência mobile já existe; os próximos passos aprofundam inteligência financeira, UX e confiabilidade.",
			phase0: {
				label: "Fase 0 · Concluída",
				title: "Base de IA e tool calling",
				text: "Chat com IA, streaming, tools iniciais, controle de tema, calculadora, transações financeiras e reset de conversa.",
			},
			phase1: {
				label: "Fase 1 · Concluída",
				title: "Persistência e domínio financeiro",
				text: "Drift, Hive, categorias, transações, orçamentos, exportação, memória privada e dados locais.",
			},
			phase2: {
				label: "Fase 2 · Concluída",
				title: "Experiência mobile e design system",
				text: "Interface glass, splash de marca, componentes visuais, empty state rica, carrosséis, cartões e sistema visual consistente.",
			},
			current: {
				label: "Fase atual",
				title: "Refinamento de produto e demonstração pública",
				text: "Landing page, demo, narrativa técnica, clareza de posicionamento e preparação do case para portfólio.",
			},
			next: {
				label: "Próximos passos",
				title: "Fine-tuning e inteligência financeira mais profunda",
				text: "Fine-tuning e customização do modelo local para respostas mais eficientes e assertivas.",
			},
		},
		privacy: {
			eyebrow: "Privacidade",
			title: "Privacidade não entra no final. Ela define a arquitetura.",
			text: "Na Vulora, dados financeiros, preferências, histórico e contexto foram pensados para viver próximos ao usuário. A nuvem pode ser usada quando fizer sentido, mas não é o ponto de partida obrigatório.",
			cards: {
				sensitive: {
					title: "Seus dados ficam no dispositivo",
					text: "Transações, memória, hábitos e histórico vivem no seu celular. Não em um datacenter.",
				},
				cloud: {
					title: "Seu dinheiro não treina o modelo deles",
					text: "O que você ganha, gasta e poupa é seu. Não alimenta modelo nenhum.",
				},
				offline: {
					title: "Nuvem quando você decidir",
					text: "Você decide se e quando a inferência sai do dispositivo — para um endpoint privado que você confia.",
				},
			},
		},
		contact: {
			eyebrow: "O engenheiro",
			title: "Construído como produto. Documentado como estudo de caso.",
			text: "Sou product engineer e criei a Vulora para explorar uma pergunta que importa: como seria um assistente financeiro realmente privado, feito para o Brasil, sem entregar sua vida financeira para uma big tech?",
			text2:
				"O projeto reúne arquitetura Flutter, LLM local, tool calling, persistência offline, i18n, streaming, design system, guardrails e uma visão de produto aplicada a um domínio sensível: finanças pessoais.",
			note: "Se você constrói, investe ou contrata em mobile, IA aplicada, fintech ou privacidade — seja para um time, um produto ou uma tese — vamos conversar.",
			site: "Site pessoal",
			linkedin: "Conectar no LinkedIn",
			github: "Ver GitHub",
		},
		faq: {
			eyebrow: "FAQ",
			title: "Respostas claras, sem hype.",
			items: {
				what: {
					q: "O que é a Vulora?",
					a: "A Vulora é uma aplicação funcional e um estudo de caso técnico sobre IA financeira privada. Ela combina Flutter, IA local-first, dados offline, tool calling e uma interface mobile moderna para explorar como assistentes financeiros podem funcionar sem depender, por padrão, de nuvens públicas.",
				},
				available: {
					q: "A Vulora já está disponível para download?",
					a: "Ainda não. A Vulora está em desenvolvimento e existe hoje como uma prova de conceito funcional e case técnico.",
				},
				why: {
					q: "Por que rodar IA localmente?",
					a: "Porque dados financeiros são sensíveis. Rodar IA localmente, na rede local ou em endpoints privados confiáveis reduz dependência de nuvens públicas e torna a privacidade uma decisão de arquitetura.",
				},
				stack: {
					q: "Qual é a stack?",
					a: "Flutter e Dart no cliente, modelo local com Gemma/flutter_gemma, camada de inferência plugável, tools tipadas, persistência local com Drift/SQLite e Hive, i18n PT/EN e design system próprio.",
				},
				bank: {
					q: "A Vulora é banco, corretora ou consultoria financeira?",
					a: "Não. A Vulora não é banco, instituição financeira, corretora, consultoria de investimentos ou aconselhamento financeiro. O projeto é um estudo técnico de software e IA aplicada.",
				},
				cloud: {
					q: "O app usa nuvem?",
					a: "A proposta é local-first. A nuvem pode ser usada como opção, especialmente em endpoints privados ou provedores confiáveis configurados pelo usuário, mas não é o padrão obrigatório.",
				},
				bigtech: {
					q: "O que diferencia a Vulora do ChatGPT ou Gemini com recursos financeiros?",
					a: "Eles são assistentes de propósito geral que adicionam finanças como feature — úteis, mas construídos em arquiteturas cloud-first onde seus dados alimentam os sistemas deles. A Vulora é o contrário: memória financeira privada em primeiro lugar, IA como interface, nuvem como opção.",
				},
			},
		},
		footer: {
			tagline: "Inteligência financeira privada. Rodando onde seus dados pertencem.",
			copy: "© 2026 Vulora. Todos os direitos reservados.",
		},
		cookies: {
			bannerTitle: "Preferências de privacidade",
			bannerText:
				"Usamos apenas armazenamento essencial por padrão. Analytics e marketing ficam desligados até você permitir.",
			accept: "Aceitar tudo",
			reject: "Rejeitar não essenciais",
			manage: "Gerenciar",
			essential: "Cookies essenciais",
			analytics: "Analytics e marketing",
			save: "Salvar preferências",
		},
		legal: { back: "Voltar ao site" },
	},
};

function getTranslation(path, lang = getCurrentLanguage()) {
	return (
		path
			.split(".")
			.reduce((value, key) => value && value[key], translations[lang]) || ""
	);
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
	en: { flag: "assets/flags/us.svg", label: "English" },
};

function syncLanguageSwitch() {
	const meta = LANGUAGE_META[currentLanguage] || LANGUAGE_META.en;
	document.querySelectorAll("[data-language-switch]").forEach((root) => {
		const flag = root.querySelector("[data-language-flag]");
		const label = root.querySelector("[data-language-label]");
		if (flag) flag.src = meta.flag;
		if (label) label.textContent = meta.label;
		root.querySelectorAll("[data-lang]").forEach((option) => {
			option.setAttribute(
				"aria-selected",
				option.dataset.lang === currentLanguage ? "true" : "false",
			);
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
				const index = Math.max(
					0,
					options.findIndex((o) => o.dataset.lang === currentLanguage),
				);
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
			if (
				event.key === "ArrowDown" ||
				event.key === "Enter" ||
				event.key === " "
			) {
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
		document.querySelectorAll(
			".card-grid .reveal, .stack-grid .reveal, .decision-grid .reveal, .roadmap-grid .reveal, .privacy-list .reveal, .faq-list .reveal, .countdown .reveal",
		),
	);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target;
				const siblings = Array.from(
					el.parentElement.querySelectorAll(".reveal"),
				);
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
		},
		{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
	);

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

	window.addEventListener(
		"scroll",
		() => {
			if (!ticking) {
				requestAnimationFrame(update);
				ticking = true;
			}
		},
		{ passive: true },
	);
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
		localStorage.setItem(
			"vulora_cookie_preferences",
			JSON.stringify({
				essential: true,
				analytics: Boolean(analytics),
				saved_at: new Date().toISOString(),
			}),
		);
		if (analytics) enableAnalytics();
		banner.classList.remove("visible");
	};

	banner.addEventListener("click", (event) => {
		const action = event.target.closest("[data-cookie-action]")?.dataset
			.cookieAction;
		if (!action) return;
		if (action === "accept") save(true);
		if (action === "reject") save(false);
		if (action === "manage") managePanel.hidden = !managePanel.hidden;
		if (action === "save") save(analyticsToggle.checked);
	});
}

/* ----------------------------------------------------------- misc */

function initVideoModal() {
	const triggers = document.querySelectorAll("[data-video-modal-trigger]");
	const modal = document.querySelector("[data-video-modal]");
	const iframe = modal?.querySelector("[data-video-modal-iframe]");
	const videoId = parseYouTubeId(YOUTUBE_PRESENTATION_ID);

	if (!triggers.length || !modal || !iframe || !videoId) return;

	triggers.forEach((trigger) => {
		trigger.hidden = false;
	});
	let lastFocus = null;

	function getFocusableModalElements() {
		return Array.from(
			modal.querySelectorAll(
				'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
			),
		).filter((element) => !element.hasAttribute("hidden"));
	}

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

	triggers.forEach((trigger) => trigger.addEventListener("click", openModal));

	modal
		.querySelector(".video-modal__close")
		?.addEventListener("click", closeModal);

	// Close on backdrop click and on Escape, matching standard dialog behaviour.
	modal
		.querySelector(".video-modal__backdrop")
		?.addEventListener("click", closeModal);
	document.addEventListener("keydown", (event) => {
		if (!modal.classList.contains("is-open")) return;
		if (event.key === "Escape") {
			closeModal();
			return;
		}
		if (event.key !== "Tab") return;

		const focusableElements = getFocusableModalElements();
		if (!focusableElements.length) return;

		const first = focusableElements[0];
		const last = focusableElements[focusableElements.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	});
}

function initShowcaseCarousel() {
	const root = document.querySelector("[data-showcase-carousel]");
	const track = root?.querySelector("[data-showcase-track]");
	const viewport = root?.querySelector("[data-showcase-viewport]");
	const dotsRoot = root?.querySelector("[data-showcase-dots]");
	const prevBtn = root?.querySelector("[data-showcase-prev]");
	const nextBtn = root?.querySelector("[data-showcase-next]");
	if (
		!root ||
		!track ||
		!viewport ||
		!dotsRoot ||
		!prevBtn ||
		!nextBtn ||
		!SHOWCASE_SLIDES.length
	)
		return;

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
			figure.setAttribute(
				"aria-label",
				`${index + 1} of ${SHOWCASE_SLIDES.length}`,
			);

			const mockup = createDeviceMockup(
				slide.src,
				getTranslation(slide.altKey),
				index === 0 ? "eager" : "lazy",
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
			dot.setAttribute("aria-label", getTranslation(slide.captionKey));
			if (index === activeIndex) dot.setAttribute("aria-current", "true");
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
			if (index === activeIndex) dot.setAttribute("aria-current", "true");
			else dot.removeAttribute("aria-current");
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

	viewport.addEventListener(
		"touchstart",
		(event) => {
			touchStartX = event.changedTouches[0].clientX;
			touchDeltaX = 0;
		},
		{ passive: true },
	);

	viewport.addEventListener(
		"touchmove",
		(event) => {
			touchDeltaX = event.changedTouches[0].clientX - touchStartX;
		},
		{ passive: true },
	);

	viewport.addEventListener(
		"touchend",
		() => {
			if (Math.abs(touchDeltaX) < 40) return;
			if (touchDeltaX < 0) goTo(activeIndex + 1);
			else goTo(activeIndex - 1);
		},
		{ passive: true },
	);

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
	window.addEventListener(
		"scroll",
		() => {
			if (!ticking) {
				requestAnimationFrame(() => {
					header.classList.toggle("scrolled", window.scrollY > 60);
					ticking = false;
				});
				ticking = true;
			}
		},
		{ passive: true },
	);
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
