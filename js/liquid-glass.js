/**
 * Liquid glass — vanilla port of the SDF displacement-map refraction technique
 * from github.com/samasante/liquid-glass ("material" mode).
 *
 * How it works: a rounded-rect signed-distance field is rasterized to a
 * displacement map on a canvas (R/G encode X/Y displacement around neutral grey,
 * B encodes a specular mask). An SVG <filter> feeds that map to feDisplacementMap
 * so it refracts the LIVE page behind the element, and the B channel is lifted
 * into a bright edge sheen. The element gets it via:
 *
 *     backdrop-filter: blur() saturate() url(#filter)
 *
 * The url() refraction ships in Blink (Chrome/Edge/Arc/Brave) only; WebKit/Gecko
 * keep the blur + saturate + edge highlight (frosted glass without the bend).
 *
 * No build step / framework — plain ES module.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/* ------------------------------------------------------- displacement map gen */

// 8-bit signed-around-0.5 channel encode (displacement) and the specular lift.
const encodeAxis = (signed) => ((0.5 + signed) * 255 + 0.5) | 0;
const encodeSpec = (spec) => (127 * spec + 128 + 0.5) | 0;

// erf(x) ≈ tanh(√π · x): cheap smooth monotone approximation for the edge feather.
const ERF_K = Math.sqrt(Math.PI);
const erf = (x) => Math.tanh(ERF_K * x);

// Mean of the dome gradient x/√(R²−x²) over [0, halfExtent] — closed form, used
// to normalize the spherical-cap profile so the average displacement lands at 0.5.
const domeGradientMean = (radius, halfExtent) =>
  halfExtent > 0
    ? (radius - Math.sqrt(radius * radius - halfExtent * halfExtent)) / halfExtent
    : 0;

const computeDomeConstants = (capDepth, halfW, halfH) => {
  const cap = Math.max(0.01, Math.min(capDepth, Math.min(halfW, halfH) - 1));
  const Rx = (halfW * halfW + cap * cap) / (2 * cap);
  const Ry = (halfH * halfH + cap * cap) / (2 * cap);
  const meanX = domeGradientMean(Rx, halfW);
  const meanY = domeGradientMean(Ry, halfH);
  return {
    Rx,
    Ry,
    scaleX: meanX > 0 ? 0.5 / meanX : 1,
    scaleY: meanY > 0 ? 0.5 / meanY : 1,
  };
};

const domeGradient = (distance, radius, scale) => {
  const inside = Math.min(distance, radius * (1 - 1e-3));
  return (inside / Math.sqrt(radius * radius - inside * inside)) * scale;
};

/**
 * Synchronous quadrant-mirrored displacement-map generator. Computes only the
 * top-left quadrant and reflects displacement signs into the other three.
 * Returns a PNG data URL. (Faithful port of createLensMapGenerator.)
 */
const createLensMapGenerator = (size) => {
  let canvas = null;
  let ctx = null;
  let image = null;
  let domeLut = null;
  let lutDome = -Infinity;
  let lutHalfW = -Infinity;
  let lutHalfH = -Infinity;
  let lutLen = 0;
  let lutDirty = true;
  let dome = null;

  return {
    generate(shape) {
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext("2d");
        image = ctx.createImageData(size, size);
      }
      const {
        lensHalfWidth: halfW,
        lensHalfHeight: halfH,
        borderRadius,
        depth,
        clipToShape,
        softEdge,
        sheenAngle = 45,
        glow = 0,
        glowSpread = 1,
        glowFalloff = 1.5,
        sheen = 0,
        sheenWidth = 3,
        sheenFalloff = 1.5,
        curvature = 0,
        splay = 0,
        bend = 0,
        bendWidth = 0.16,
      } = shape;
      const data = image.data;
      const half = size >> 1;
      const radius = Math.min(borderRadius, Math.min(halfW, halfH));
      const minHalf = Math.min(halfW, halfH);
      const depthPx = Math.min(depth * minHalf, minHalf - 1);
      const innerHalfW = Math.max(0, halfW - depthPx);
      const innerHalfH = Math.max(0, halfH - depthPx);
      const innerRadius = Math.max(
        0,
        Math.min(borderRadius, Math.min(innerHalfW, innerHalfH)),
      );
      const falloff = depthPx > 0 ? Math.SQRT1_2 / depthPx : 1e6;
      const hasSpecular = glow > 0 || sheen > 0;
      const angle = (sheenAngle * Math.PI) / 180;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const edgeInv = sheenWidth > 0 ? 1 / sheenWidth : 0;
      const glowReachInv = 1 / Math.max(2, glowSpread * Math.min(halfW, halfH));
      const stepX = (2 * halfW) / size;
      const stepY = (2 * halfH) / size;
      const invW = 1 / halfW;
      const invH = 1 / halfH;
      const hasDome = curvature > 0;
      const domeCap = curvature * Math.min(halfW, halfH);
      const hasSplay = splay > 0;
      const hasEdgeRefract = bend > 0;
      const erInv = 1 / Math.max(2, bendWidth * Math.min(halfW, halfH));

      const cornerDistance = (ox, oy) =>
        ox > 0 || oy > 0 ? Math.sqrt(ox * ox + oy * oy) : 0;

      if (hasDome) {
        if (
          !dome ||
          Math.abs(domeCap - lutDome) > 0.5 ||
          Math.abs(halfW - lutHalfW) > 1 ||
          Math.abs(halfH - lutHalfH) > 1
        ) {
          dome = computeDomeConstants(domeCap, halfW, halfH);
          lutDome = domeCap;
          lutHalfW = halfW;
          lutHalfH = halfH;
          lutDirty = true;
        }
        if (lutLen !== half) {
          domeLut = new Float32Array(half);
          lutLen = half;
          lutDirty = true;
        }
        if (lutDirty) {
          const lut = domeLut;
          const d = dome;
          const r2 = d.Rx * d.Rx;
          const rMax = d.Rx * (1 - 1e-3);
          for (let col = 0; col < half; col += 1) {
            const px = -((col + 0.5) * stepX - halfW);
            const clamped = px < rMax ? px : rMax;
            lut[col] = (clamped / Math.sqrt(r2 - clamped * clamped)) * d.scaleX;
          }
          lutDirty = false;
        }
      }
      const lut = hasDome ? domeLut : null;
      const splayHalf = 0.5 * Math.min(halfW, halfH);
      const splayInv = splayHalf > 0 ? 1 / splayHalf : 0;
      const sheenNorm = Math.SQRT1_2;

      for (let row = 0; row < half; row += 1) {
        const mirrorRow = size - 1 - row;
        const py = -((row + 0.5) * stepY - halfH);
        const edgeY = py - halfH + radius;
        const innerEdgeY = softEdge ? py - innerHalfH + innerRadius : 0;
        const dirYBase =
          hasDome && lut
            ? domeGradient(py, dome.Ry, dome.scaleY)
            : py * invH > 1
              ? 1
              : py * invH;
        const normY = py * invH > 1 ? 1 : py * invH;
        const splayY = hasSplay ? Math.max(0, 1 - (halfH - py) * splayInv) : 0;
        const rowBase = row * size;
        const mirrorRowBase = mirrorRow * size;
        for (let col = 0; col < half; col += 1) {
          const mirrorCol = size - 1 - col;
          const px = -((col + 0.5) * stepX - halfW);
          const edgeX = px - halfW + radius;
          const sdf =
            cornerDistance(edgeX > 0 ? edgeX : 0, edgeY > 0 ? edgeY : 0) +
            (edgeX > edgeY ? (edgeX > 0 ? 0 : edgeX) : edgeY > 0 ? 0 : edgeY) -
            radius;

          const i00 = (rowBase + col) * 4;
          const i01 = (rowBase + mirrorCol) * 4;
          const i10 = (mirrorRowBase + col) * 4;
          const i11 = (mirrorRowBase + mirrorCol) * 4;

          if (clipToShape && sdf >= 0) {
            for (const idx of [i00, i01, i10, i11]) {
              data[idx] = 128;
              data[idx + 1] = 128;
              data[idx + 2] = 128;
              data[idx + 3] = 255;
            }
            continue;
          }

          let dirX = lut ? lut[col] : px * invW > 1 ? 1 : px * invW;
          let dirY = dirYBase;
          if (hasSplay) {
            const yAtt = splayY * splay;
            const xAtt = Math.max(0, 1 - (halfW - px) * splayInv) * splay;
            if (yAtt > 0.001 || xAtt > 0.001) {
              const prevX = dirX;
              const prevY = dirY;
              dirX = prevX * (1 - yAtt);
              dirY = prevY * (1 - xAtt);
              const prevLen = Math.sqrt(prevX * prevX + prevY * prevY);
              const nextLen = Math.sqrt(dirX * dirX + dirY * dirY);
              if (nextLen > 0.001) {
                const restore = prevLen / nextLen;
                dirX *= restore;
                dirY *= restore;
              }
            }
          }

          let edgeOpacity = 1;
          if (softEdge) {
            const ix = px - innerHalfW + innerRadius;
            const innerSdf =
              cornerDistance(ix > 0 ? ix : 0, innerEdgeY > 0 ? innerEdgeY : 0) +
              (ix > innerEdgeY
                ? ix > 0
                  ? 0
                  : ix
                : innerEdgeY > 0
                  ? 0
                  : innerEdgeY) -
              innerRadius;
            edgeOpacity = 0.5 * (1 + erf(innerSdf * falloff));
          }

          let dx = 0.5 * dirX * edgeOpacity;
          let dy = 0.5 * dirY * edgeOpacity;
          if (hasEdgeRefract) {
            const s = sdf < 0 ? Math.max(0, 1 + sdf * erInv) : 0;
            if (s > 0) {
              const len = Math.sqrt(dirX * dirX + dirY * dirY);
              if (len > 1e-4) {
                const m = 6.75 * s * s * (1 - s);
                const a = (0.5 * bend * m * edgeOpacity) / len;
                dx += dirX * a;
                dy += dirY * a;
              }
            }
          }

          let specMain = 0;
          let specCross = 0;
          if (hasSpecular) {
            const normX = px * invW > 1 ? 1 : px * invW;
            const axisMain = Math.min(
              1,
              Math.abs(normX * cosA + normY * sinA) * sheenNorm,
            );
            const axisCross = Math.min(
              1,
              Math.abs(normX * cosA - normY * sinA) * sheenNorm,
            );
            if (sheen > 0) {
              const band = sdf < 0 ? Math.max(0, 1 + sdf * edgeInv) : 0;
              const b = sheen * Math.pow(band, sheenFalloff);
              specMain += b * (0.16 + 0.84 * Math.pow(axisMain, 1.6));
              specCross += b * (0.16 + 0.84 * Math.pow(axisCross, 1.6));
            }
            if (glow > 0) {
              const reach = sdf < 0 ? Math.min(1, -sdf * glowReachInv) : 1;
              const t = 1 - reach;
              const g =
                glow * Math.pow(t * t * (3 - 2 * t), glowFalloff) * edgeOpacity;
              specMain += g * (0.6 + 0.4 * axisMain);
              specCross += g * (0.6 + 0.4 * axisCross);
            }
            if (specMain > 1) specMain = 1;
            else if (specMain < -1) specMain = -1;
            if (specCross > 1) specCross = 1;
            else if (specCross < -1) specCross = -1;
          }

          const rPos = encodeAxis(dx);
          const rNeg = encodeAxis(-dx);
          const gPos = encodeAxis(dy);
          const gNeg = encodeAxis(-dy);
          const bMain = encodeSpec(specMain);
          const bCross = encodeSpec(specCross);

          data[i00] = rPos; data[i00 + 1] = gPos; data[i00 + 2] = bMain; data[i00 + 3] = 255;
          data[i01] = rNeg; data[i01 + 1] = gPos; data[i01 + 2] = bCross; data[i01 + 3] = 255;
          data[i10] = rPos; data[i10 + 1] = gNeg; data[i10 + 2] = bCross; data[i10 + 3] = 255;
          data[i11] = rNeg; data[i11 + 1] = gNeg; data[i11 + 2] = bMain; data[i11 + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
      return canvas.toDataURL();
    },
    dispose() {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
        canvas = null;
      }
      ctx = null;
      image = null;
      domeLut = null;
      dome = null;
      lutDome = -Infinity;
      lutHalfW = -Infinity;
      lutHalfH = -Infinity;
      lutLen = 0;
      lutDirty = true;
    },
  };
};

/* ---------------------------------------------------------------- engine info */

// Does this engine support `backdrop-filter: url(#…)`? Blink does; WebKit/Gecko
// parse the syntax but don't render it (and an invalid value drops the WHOLE
// backdrop-filter), so sniff the engine and bias toward a false negative.
const supportsBackdropUrl = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const hasUAData = navigator.userAgentData != null;
  return (
    hasUAData ||
    (/\b(?:Chrome|Chromium|Edg)\//.test(ua) &&
      !/\b(?:CriOS|EdgiOS|FxiOS|OPiOS)\b/.test(ua) &&
      !/iPhone|iPad|iPod/.test(ua))
  );
};

/* -------------------------------------------------------- shared filter defs */

let defsSvg = null;
const ensureDefsSvg = () => {
  if (defsSvg) return defsSvg;
  defsSvg = document.createElementNS(SVG_NS, "svg");
  defsSvg.setAttribute("aria-hidden", "true");
  defsSvg.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  document.body.appendChild(defsSvg);
  return defsSvg;
};

/* --------------------------------------------------------------- the look */

// Balanced material look — refraction WITHOUT the 3-pass RGB split (dispersion:0
// → one feDisplacementMap), a soft rim meniscus + directional sheen + inner glow.
const DEFAULT_OPTICS = {
  mapSize: 384,
  clipToShape: true,
  softEdge: true,
  strength: 0.05,
  depth: 0.5,
  curvature: 0.3,
  splay: 0,
  dispersion: 0, // balanced: single displacement, no chromatic split
  bend: 0.45,
  bendWidth: 0.16,
  frost: 6,
  saturate: 1.15,
  specular: 1,
  sheenAngle: 45,
  sheen: 0.32,
  sheenWidth: 3,
  sheenFalloff: 1.5,
  glow: 0.1,
  glowSpread: 1,
  glowFalloff: 0.5,
  // Edge-highlight layer (added on top of the host's own border).
  edgeTopAlpha: 0.14, // faint bright top sheen
  edgeRingAlpha: 0.05, // 1px all-round hairline; 0 = drop it (thinner border)
};

/**
 * Turn an element into liquid glass. The element should already have a
 * TRANSLUCENT background (the tint) and a border-radius. Returns a disposer.
 */
export function applyLiquidGlass(el, userOptics = {}) {
  if (!el) return () => {};
  const optics = { ...DEFAULT_OPTICS, ...userOptics };
  const supportsUrl = supportsBackdropUrl();
  const baseId = `lg-${Math.random().toString(36).slice(2, 9)}`;

  // A positioned containing block for the inset edge layer.
  if (getComputedStyle(el).position === "static") {
    el.style.position = "relative";
  }

  // Soft bright edge — its own inset layer so it never fights an existing
  // box-shadow. Kept whisper-thin to match the elements' original hairline
  // border (the host already has its own border; this just adds a faint glass
  // top-sheen on top, not a second thick frame). `edgeRingAlpha: 0` drops the
  // 1px all-round ring entirely — a 1px-thinner border for elements that
  // already carry their own (the buttons).
  const g = Math.max(0, Math.min(1.5, optics.specular));
  const shadows = [
    `inset 0 1px 0 rgba(255,255,255,${(optics.edgeTopAlpha * g).toFixed(3)})`,
  ];
  if (optics.edgeRingAlpha > 0) {
    shadows.push(`inset 0 0 0 1px rgba(255,255,255,${(optics.edgeRingAlpha * g).toFixed(3)})`);
  }
  const edge = document.createElement("span");
  edge.setAttribute("aria-hidden", "true");
  edge.dataset.lgEdge = "";
  edge.style.cssText =
    "position:absolute;inset:0;pointer-events:none;border-radius:inherit;" +
    `box-shadow:${shadows.join(",")}`;
  el.appendChild(edge);

  // The SVG filter (Blink refraction). Lives in the shared hidden defs svg.
  let filterEl = null;
  let feImage = null;
  if (supportsUrl) {
    const defs = ensureDefsSvg();
    filterEl = document.createElementNS(SVG_NS, "filter");
    filterEl.setAttribute("filterUnits", "userSpaceOnUse");
    filterEl.setAttribute("primitiveUnits", "userSpaceOnUse");
    filterEl.setAttribute("color-interpolation-filters", "sRGB");
    defs.appendChild(filterEl);
  }

  const gen = createLensMapGenerator(optics.mapSize);
  let version = 0;
  let lastKey = "";

  const mk = (name, attrs) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  const buildFilter = (w, h, mapUrl, margin) => {
    if (!filterEl) return;
    const sx = optics.scaleX ?? optics.strength;
    const sy = optics.scaleY ?? optics.strength;
    const maxScale = Math.max(sx, sy);
    const norm = Math.sqrt((w * w + h * h) / 2);
    const dispScale = maxScale * norm;
    const hasSpecular = optics.glow > 0 || optics.sheen > 0;

    filterEl.setAttribute("x", String(-margin));
    filterEl.setAttribute("y", String(-margin));
    filterEl.setAttribute("width", String(w + 2 * margin));
    filterEl.setAttribute("height", String(h + 2 * margin));
    filterEl.replaceChildren();

    // Neutral-grey backing so displacement near the box edge stays neutral.
    filterEl.appendChild(
      mk("feFlood", { "flood-color": "rgb(128,128,128)", "flood-opacity": "1", result: "mapBg" }),
    );
    feImage = mk("feImage", {
      href: mapUrl,
      x: "0",
      y: "0",
      width: String(w),
      height: String(h),
      preserveAspectRatio: "none",
      result: "rawMap",
    });
    filterEl.appendChild(feImage);
    filterEl.appendChild(
      mk("feComposite", { in: "rawMap", in2: "mapBg", operator: "over", result: "map" }),
    );

    // Single displacement (balanced — no chromatic split).
    filterEl.appendChild(
      mk("feDisplacementMap", {
        in: "SourceGraphic",
        in2: "map",
        scale: String(dispScale),
        xChannelSelector: "R",
        yChannelSelector: "G",
        result: "lensOut",
      }),
    );

    if (hasSpecular) {
      filterEl.appendChild(
        mk("feColorMatrix", {
          in: "map",
          type: "matrix",
          values: `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 ${-128 / 255}`,
          result: "sheenMask",
        }),
      );
      filterEl.appendChild(
        mk("feComposite", {
          in: "sheenMask",
          in2: "lensOut",
          operator: "arithmetic",
          k1: "0",
          k2: String(optics.specular),
          k3: "1",
          k4: "0",
        }),
      );
    }
  };

  const applyBackdrop = () => {
    const frost = Math.max(0, optics.frost);
    const sat = optics.saturate ?? 1;
    const fns = [frost > 0 ? `blur(${frost}px)` : "", sat !== 1 ? `saturate(${sat})` : ""]
      .filter(Boolean)
      .join(" ");
    let value = fns || "none";
    if (supportsUrl && filterEl) {
      version += 1;
      filterEl.id = `${baseId}-v${version}`;
      value = `${fns ? fns + " " : ""}url(#${filterEl.id})`;
    }
    el.style.backdropFilter = value;
    el.style.setProperty("-webkit-backdrop-filter", value);
  };

  const refresh = () => {
    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 2 || h < 2) return;
    const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    const key = `${w}x${h}x${r}`;
    if (key === lastKey) return;
    lastKey = key;

    if (supportsUrl) {
      const sx = optics.scaleX ?? optics.strength;
      const sy = optics.scaleY ?? optics.strength;
      const norm = Math.sqrt((w * w + h * h) / 2);
      const dispScale = Math.max(sx, sy) * norm;
      const margin = Math.ceil(dispScale * 0.5 + 28);
      const mapUrl = gen.generate({
        lensHalfWidth: w / 2,
        lensHalfHeight: h / 2,
        borderRadius: r,
        depth: optics.depth,
        clipToShape: optics.clipToShape,
        softEdge: optics.softEdge,
        sheenAngle: optics.sheenAngle,
        glow: optics.glow,
        glowSpread: optics.glowSpread,
        glowFalloff: optics.glowFalloff,
        sheen: optics.sheen,
        sheenWidth: optics.sheenWidth,
        sheenFalloff: optics.sheenFalloff,
        curvature: optics.curvature,
        splay: optics.splay,
        bend: optics.bend,
        bendWidth: optics.bendWidth,
      });
      buildFilter(w, h, mapUrl, margin);
    }
    applyBackdrop();
  };

  el.dataset.liquidGlass = "material";
  refresh();
  const ro = new ResizeObserver(refresh);
  ro.observe(el);
  window.addEventListener("resize", refresh, { passive: true });

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", refresh);
    gen.dispose();
    filterEl?.remove();
    edge.remove();
    el.style.removeProperty("backdrop-filter");
    el.style.removeProperty("-webkit-backdrop-filter");
    delete el.dataset.liquidGlass;
  };
}

/* ----------------------------------------------------------------- bootstrap */
/* Test scope: floating menu + hero badge/secondary buttons + consent card. */

const init = () => {
  const targets = [
    // wide, short bar — dial the refraction down so it doesn't over-bend
    { sel: ".site-header--float", optics: { strength: 0.03, frost: 7, depth: 0.45, bend: 0.4 } },
    { sel: ".hero .badge", optics: { strength: 0.06, frost: 4 } },
    // all secondary buttons (hero + contact …) — standardized; drop the 1px
    // edge ring so the border stays a touch thinner than the other surfaces
    { sel: ".button-secondary", optics: { strength: 0.06, frost: 5, edgeRingAlpha: 0 } },
    { sel: ".cookie-banner", optics: { strength: 0.045, frost: 8 } },
  ];
  for (const { sel, optics } of targets) {
    document.querySelectorAll(sel).forEach((el) => applyLiquidGlass(el, optics));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
