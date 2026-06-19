import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const canvas = document.querySelector("[data-hero-three]");

if (canvas) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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
        for (int i = 0; i < 5; i++) {
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

        float b1 = blob(p, c1, 0.46, t, 0.0);
        float b2 = blob(p, c2, 0.44, t, 10.0);
        float b3 = blob(p, c3, 0.40, t, 20.0);
        float b4 = blob(p, c4, 0.48, t, 30.0);

        vec3 green  = vec3(0.30, 0.86, 0.62);
        vec3 cyan   = vec3(0.26, 0.74, 0.90);
        vec3 blue   = vec3(0.38, 0.55, 0.98);
        vec3 violet = vec3(0.66, 0.52, 0.96);

        vec3 color = vec3(0.0);
        color += green  * b1 * 0.92;
        color += cyan   * b2 * 0.85;
        color += blue   * b3 * 0.80;
        color += violet * b4 * 0.76;

        // subtle color mixing where blobs overlap
        color += cyan   * b1 * b2 * 0.28;
        color += violet * b2 * b4 * 0.24;
        color += green  * b1 * b3 * 0.20;
        color += blue   * b3 * b4 * 0.18;

        // diffuse ambient glow
        float ambient = fbm(p * 0.9 + t * 0.18) * 0.16;
        color += vec3(0.05, 0.08, 0.12) * ambient;

        // soft mist layer
        float mist = fbm(p * 0.4 - t * 0.08) * 0.09;
        color += vec3(0.07, 0.09, 0.13) * mist;

        // apply vignette and keep it calm
        color *= vignette * 0.8;

        float alpha = (b1 * 0.52 + b2 * 0.48 + b3 * 0.44 + b4 * 0.48) * vignette;
        alpha = clamp(alpha, 0.0, 0.62);

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
  let running = !prefersReducedMotion;

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
    uniforms.uTime.value = time * 0.001;
    uniforms.uMouse.value.lerp(mouseTarget, 0.03);
    uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.06;

    renderer.render(scene, camera);
    markCanvasReady();

    if (running) {
      frameId = requestAnimationFrame(render);
    }
  }

  function start() {
    if (running) return;
    running = true;
    render(performance.now());
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  function onVisibility() {
    if (document.hidden) {
      stop();
    } else if (!prefersReducedMotion) {
      start();
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  onScroll();

  if (prefersReducedMotion) {
    render(0);
  } else {
    render();
  }

  window.addEventListener("pagehide", () => {
    stop();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.dispose();
    surface.geometry.dispose();
    auroraMaterial.dispose();
  }, { once: true });
}
