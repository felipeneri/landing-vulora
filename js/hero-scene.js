// three.js (~1.2 MB) is only needed for the ambient hero shader, which is
// purely decorative and sits behind a CSS gradient fallback. So we never let it
// block first paint: it's dynamically imported off the critical path, and
// skipped entirely on coarse-pointer devices (phones/tablets) where the shader
// is least useful and the download hurts most.
const canvas = document.querySelector("[data-hero-three]");
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

if (canvas && !isCoarsePointer) {
  const loadHero = () => {
    import("./vendor/three.module.js")
      .then((THREE) => initHeroScene(THREE, canvas))
      .catch(() => {
        /* hero shader is non-essential; CSS fallback remains visible */
      });
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadHero, { timeout: 2500 });
  } else {
    window.addEventListener("load", () => setTimeout(loadHero, 200), {
      once: true,
    });
  }
}

function initHeroScene(THREE, canvas) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    // antialiasing does nothing useful on a full-screen shader quad (no
    // geometric edges) yet still costs GPU time — leave it off.
    antialias: false,
    powerPreference: "high-performance"
  });

  // A heavy full-screen fragment shader: keep the device pixel ratio modest so
  // we are not shading 2x+ the pixels on retina / 4K displays.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 1);

  /* ------------------------------------------------------------------ aurora */

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) }
  };

  const auroraMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      // slow organic drifting center — Lissajous-like path covering wide area
      vec2 drift(float t, float speed, float radiusX, float radiusY, float phase, vec2 anchor) {
        return anchor + vec2(
          radiusX * sin(t * speed + phase),
          radiusY * cos(t * speed * 0.83 + phase * 1.27)
        );
      }

      // soft blob with noise-distorted edges
      float blob(vec2 p, vec2 center, float size, float t, float seed) {
        vec2 d = p - center;
        float distort = (fbm(d * 2.2 + t * 0.15 + seed) - 0.5) * 0.32;
        float dist = length(d);
        return smoothstep(size + distort, 0.0, dist);
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 p = (uv - 0.5) * aspect;
        p.y += uScroll * 0.10;
        p += uMouse * 0.025;

        float t = uTime * 0.14;

        // gentle vignette — darker at far edges, open across the full hero
        float vignette = smoothstep(1.5, 0.25, length(p * vec2(0.82, 0.9)));

        // 4 drifting blobs spread across the ENTIRE hero area
        vec2 c1 = drift(t, 0.38, 0.48, 0.38, 0.0,  vec2(-0.28,  0.18));
        vec2 c2 = drift(t, 0.31, 0.52, 0.42, 1.6,  vec2( 0.26, -0.12));
        vec2 c3 = drift(t, 0.44, 0.40, 0.34, 3.1,  vec2( 0.08,  0.28));
        vec2 c4 = drift(t, 0.35, 0.46, 0.40, 4.7,  vec2(-0.32, -0.22));

        // larger, more overlapping blobs read as a soft diffuse wash
        // rather than four distinct glows
        float b1 = blob(p, c1, 0.58, t, 0.0);
        float b2 = blob(p, c2, 0.56, t, 10.0);
        float b3 = blob(p, c3, 0.52, t, 20.0);
        float b4 = blob(p, c4, 0.60, t, 30.0);

        vec3 green  = vec3(0.30, 0.86, 0.62);
        vec3 cyan   = vec3(0.26, 0.74, 0.90);
        vec3 blue   = vec3(0.38, 0.55, 0.98);
        vec3 violet = vec3(0.66, 0.52, 0.96);

        vec3 color = vec3(0.0);
        color += green  * b1 * 0.52;
        color += cyan   * b2 * 0.48;
        color += blue   * b3 * 0.45;
        color += violet * b4 * 0.42;

        // subtle color mixing where blobs overlap
        color += cyan   * b1 * b2 * 0.16;
        color += violet * b2 * b4 * 0.14;
        color += green  * b1 * b3 * 0.12;
        color += blue   * b3 * b4 * 0.10;

        // diffuse ambient glow
        float ambient = fbm(p * 0.9 + t * 0.18) * 0.16;
        color += vec3(0.05, 0.08, 0.12) * ambient;

        // soft mist layer
        float mist = fbm(p * 0.4 - t * 0.08) * 0.09;
        color += vec3(0.07, 0.09, 0.13) * mist;

        // apply vignette and keep it calm
        color *= vignette * 0.72;

        float alpha = (b1 * 0.34 + b2 * 0.30 + b3 * 0.28 + b4 * 0.30) * vignette;
        alpha = clamp(alpha, 0.0, 0.40);

        gl_FragColor = vec4(color, alpha);
      }
    `
  });

  const surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), auroraMaterial);
  scene.add(surface);

  /* ------------------------------------------------------------- lifecycle */

  const mouseTarget = new THREE.Vector2(0, 0);
  let scrollTarget = 0;
  let frameId = 0;
  let running = false;
  let inView = true;

  // Cap the loop to ~30fps. This shader is purely ambient, so a high refresh
  // rate (60/120Hz ProMotion) just burns GPU/CPU for no visible benefit.
  const FRAME_INTERVAL = 1000 / 30;
  let lastFrame = 0;

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    const width = Math.max(1, clientWidth);
    const height = Math.max(1, clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    uniforms.uResolution.value.set(width, height);
  }

  function onPointerMove(event) {
    mouseTarget.set(
      (event.clientX / window.innerWidth - 0.5) * 2,
      (event.clientY / window.innerHeight - 0.5) * -2
    );
  }

  function onScroll() {
    scrollTarget = window.scrollY / Math.max(1, window.innerHeight);
  }

  function markCanvasReady() {
    if (!canvas.classList.contains("is-ready")) {
      canvas.classList.add("is-ready");
    }
  }

  function render(time = 0) {
    if (running) {
      frameId = requestAnimationFrame(render);
      // Throttle to FRAME_INTERVAL without drifting the animation clock.
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;
    }

    uniforms.uTime.value = time * 0.001;
    uniforms.uMouse.value.lerp(mouseTarget, 0.03);
    uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.06;

    renderer.render(scene, camera);
    markCanvasReady();
  }

  function start() {
    if (running || prefersReducedMotion || !inView || document.hidden) return;
    running = true;
    lastFrame = 0;
    frameId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  function onVisibility() {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  }

  // Pause the loop entirely once the hero is scrolled out of view — the main
  // cause of the page bogging down during navigation was this shader rendering
  // even while off-screen.
  const heroObserver = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView) {
      start();
    } else {
      stop();
    }
  }, { threshold: 0 });
  heroObserver.observe(canvas);

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  onScroll();

  if (prefersReducedMotion) {
    running = false;
    render(0);
  } else {
    start();
  }

  window.addEventListener("pagehide", () => {
    stop();
    heroObserver.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.dispose();
    surface.geometry.dispose();
    auroraMaterial.dispose();
  }, { once: true });
}
