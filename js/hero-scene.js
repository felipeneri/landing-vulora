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

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  };

  const material = new THREE.ShaderMaterial({
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
      uniform vec2 uResolution;
      varying vec2 vUv;

      float wave(vec2 uv, float speed, float scale) {
        return sin((uv.x * scale) + uTime * speed) * cos((uv.y * scale * 0.8) - uTime * speed * 0.7);
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 centered = (uv - 0.5) * aspect;

        float drift = wave(centered + uMouse * 0.08, 0.12, 3.2) * 0.5 + 0.5;
        float veil = smoothstep(0.92, 0.2, length(centered * vec2(1.0, 0.82)));
        float topGlow = smoothstep(0.72, 0.0, uv.y) * 0.18;
        float rightGlow = smoothstep(0.35, 0.0, length(centered - vec2(0.42, -0.08))) * 0.14;

        vec3 base = vec3(0.01, 0.012, 0.016);
        vec3 cyan = vec3(0.22, 0.72, 0.78);
        vec3 green = vec3(0.34, 0.82, 0.58);

        vec3 color = base;
        color += cyan * topGlow * (0.35 + drift * 0.12);
        color += green * rightGlow * (0.28 + drift * 0.1);
        color += vec3(0.04, 0.05, 0.06) * drift * veil * 0.25;

        float alpha = (topGlow * 0.55 + rightGlow * 0.45 + drift * 0.08) * veil;
        alpha = clamp(alpha, 0.0, 0.42);

        gl_FragColor = vec4(color, alpha);
      }
    `
  });

  const surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(surface);

  const mouseTarget = new THREE.Vector2(0, 0);

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

  let frameId = 0;

  function render(time = 0) {
    uniforms.uTime.value = time * 0.001;
    uniforms.uMouse.value.lerp(mouseTarget, 0.04);
    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      frameId = requestAnimationFrame(render);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  resize();
  render();

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);
    renderer.dispose();
    surface.geometry.dispose();
    material.dispose();
  }, { once: true });
}
