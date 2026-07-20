import { useEffect, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function makeTexture(THREE, index, dark) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 164;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 256, 164);
  const base = dark ? 18 + (index % 5) * 9 : 226 - (index % 5) * 10;
  gradient.addColorStop(0, `rgb(${base},${base},${base})`);
  const end = dark ? base + 40 : base - 46;
  gradient.addColorStop(1, `rgb(${end},${end},${end})`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 164);
  context.strokeStyle = dark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.24)";
  context.lineWidth = 1;
  for (let line = 0; line < 22; line += 1) {
    context.beginPath();
    for (let x = 0; x <= 256; x += 5) {
      const y = 82 + Math.sin(x * 0.025 + line * 0.56 + index) * (11 + line * 1.2) + (line - 11) * 3;
      if (x === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createWaveField(THREE, density, refraction = false, ink = 0xffffff) {
  const cols = Math.round((refraction ? 76 : 104) * density);
  const rows = Math.round((refraction ? 50 : 72) * density);
  const positions = new Float32Array(cols * rows * 3);
  const base = new Float32Array(cols * rows * 2);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const x = (col / (cols - 1) - 0.5) * 15;
      const y = (row / (rows - 1) - 0.5) * 9;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      base[index * 2] = x;
      base[index * 2 + 1] = y;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const indices = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const current = row * cols + col;
      indices.push(current, current + 1);
    }
  }
  if (refraction) {
    for (let row = 0; row < rows - 1; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const current = row * cols + col;
        indices.push(current, current + cols);
      }
    }
  }
  geometry.setIndex(indices);
  const material = new THREE.LineBasicMaterial({
    color: ink,
    transparent: true,
    opacity: refraction ? 0.42 : 0.58,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.LineSegments(geometry, material);

  return { root: points, update: (time, pointer, params, reducedMotion) => {
    const array = geometry.attributes.position.array;
    const px = pointer.x * 7.5;
    const py = pointer.y * 4.5;
    for (let index = 0; index < cols * rows; index += 1) {
      const x = base[index * 2];
      const y = base[index * 2 + 1];
      const dx = x - px;
      const dy = y - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let z;
      if (refraction) {
        const radius = params.radius * 3;
        const lens = Math.exp(-(distance * distance) / Math.max(0.2, radius * radius));
        z = lens * params.strength * 2.5 + Math.sin(distance * 4 - time * 0.65) * lens * 0.16;
        array[index * 3] = x + (dx / Math.max(0.15, distance)) * lens * params.strength * 0.45;
        array[index * 3 + 1] = y + (dy / Math.max(0.15, distance)) * lens * params.strength * 0.45;
      } else {
        const local = Math.exp(-(distance * distance) / 2.8) * (reducedMotion ? 0 : 0.48);
        z = (
          Math.sin(x * 1.05 * params.frequency + time * params.speed) * 0.48 +
          Math.cos(y * 1.38 * params.frequency - time * params.speed * 0.72) * 0.36 +
          local
        ) * params.amplitude;
      }
      array[index * 3 + 2] = z;
    }
    geometry.attributes.position.needsUpdate = true;
    points.rotation.x = refraction ? -0.13 : -0.92;
    points.position.y = refraction ? 0 : -0.6;
  } };
}

function sampleText(countScale) {
  const canvas = document.createElement("canvas");
  canvas.width = 1100;
  canvas.height = 300;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.font = "800 148px Inter, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("PLAYGROUND", canvas.width / 2, canvas.height / 2);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = countScale > 0.8 ? 4 : countScale > 0.5 ? 5 : 7;
  const points = [];
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (pixels[(y * canvas.width + x) * 4] > 128 && Math.random() > 0.16) {
        points.push([(x - canvas.width / 2) / 68, -(y - canvas.height / 2) / 68, (Math.random() - 0.5) * 0.3]);
      }
    }
  }
  return points;
}

function createParticleType(THREE, density, ink) {
  const targets = sampleText(density);
  const positions = new Float32Array(targets.length * 3);
  const noise = new Float32Array(targets.length * 3);
  targets.forEach((target, index) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1 + Math.random() * 5;
    noise[index * 3] = Math.cos(angle) * radius;
    noise[index * 3 + 1] = Math.sin(angle) * radius;
    noise[index * 3 + 2] = (Math.random() - 0.5) * 5;
    positions[index * 3] = target[0];
    positions[index * 3 + 1] = target[1];
    positions[index * 3 + 2] = target[2];
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: ink, size: 0.036, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  return { root: points, update: (time, pointer, params, reducedMotion) => {
    const array = geometry.attributes.position.array;
    const dispersion = reducedMotion ? 0 : params.dispersion * (0.55 + Math.sin(time * 0.65) * 0.25);
    targets.forEach((target, index) => {
      const offset = index * 3;
      const targetX = target[0] + noise[offset] * dispersion;
      const targetY = target[1] + noise[offset + 1] * dispersion;
      const targetZ = target[2] + noise[offset + 2] * params.depth * dispersion;
      array[offset] += (targetX - array[offset]) * params.cohesion;
      array[offset + 1] += (targetY - array[offset + 1]) * params.cohesion;
      array[offset + 2] += (targetZ - array[offset + 2]) * params.cohesion;
    });
    geometry.attributes.position.needsUpdate = true;
    points.rotation.y += (pointer.x * 0.08 - points.rotation.y) * 0.04;
    points.rotation.x += (-pointer.y * 0.05 - points.rotation.x) * 0.04;
  } };
}

function createAtlas(THREE, density, dark) {
  const group = new THREE.Group();
  const textures = [];
  const panels = [];
  const columns = Math.round(9 * density + 3);
  const rows = 3;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const normalized = column / (columns - 1) - 0.5;
      const angle = normalized * 1.75;
      const radius = 8;
      const texture = makeTexture(THREE, row * columns + column, dark);
      textures.push(texture);
      const geometry = new THREE.PlaneGeometry(1.55, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, color: dark ? 0xdddddd : 0xffffff, side: THREE.DoubleSide });
      const panel = new THREE.Mesh(geometry, material);
      panel.position.set(Math.sin(angle) * radius, (1 - row) * 1.15, -Math.cos(angle) * radius + 5.8);
      panel.rotation.y = -angle;
      panel.userData.base = panel.position.clone();
      panels.push(panel);
      group.add(panel);
    }
  }
  return { root: group, update: (time, pointer, params, reducedMotion) => {
    panels.forEach((panel) => {
      const screenX = panel.userData.base.x / 8;
      const distance = Math.abs(screenX - pointer.x);
      const focus = Math.exp(-distance * distance * 5) * params.focus;
      panel.position.x = panel.userData.base.x * (0.72 + params.curvature * 0.42);
      panel.position.z = panel.userData.base.z - Math.abs(screenX) * params.curvature * 0.9 + focus * 1.6;
      panel.scale.setScalar(1 + focus * 0.18);
    });
    group.rotation.y += ((reducedMotion ? 0 : -pointer.x * params.motion * 0.16) - group.rotation.y) * 0.035;
    group.scale.setScalar(params.depth);
  }, dispose: () => textures.forEach((texture) => texture.dispose()) };
}

function createSignal(THREE, density, ink) {
  const cols = Math.round(92 * density);
  const rows = Math.round(52 * density);
  const positions = new Float32Array(cols * rows * 3);
  const base = new Float32Array(cols * rows * 2);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const x = (col / (cols - 1) - 0.5) * 14;
      const y = (row / (rows - 1) - 0.5) * 8;
      base[index * 2] = x;
      base[index * 2 + 1] = y;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: ink, size: 0.026, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  return { root: points, update: (time, pointer, params, reducedMotion, audioLevel = 0.12) => {
    const array = geometry.attributes.position.array;
    for (let index = 0; index < cols * rows; index += 1) {
      const x = base[index * 2];
      const y = base[index * 2 + 1];
      const low = Math.exp(-Math.pow(x + 4.2, 2) / 4) * Math.sin(y * 1.6 + time * 1.4);
      const mid = Math.exp(-Math.pow(x, 2) / 5) * Math.sin(y * 3 + time * 2.1);
      const high = Math.exp(-Math.pow(x - 4, 2) / 3) * Math.sin(y * 5.2 - time * 2.8);
      const idle = reducedMotion ? 0.18 : 0.36;
      const response = params.response === "bands"
        ? low * 1.25 + mid * 0.55 + high * 1.05
        : params.response === "wave"
          ? Math.sin(x * 0.72 + y * 1.4 + time * 1.5) + mid * 0.35
          : low + mid * 0.72 + high * 0.45;
      array[index * 3 + 2] = response * params.terrain * (idle + audioLevel * params.sensitivity * 2.4);
    }
    geometry.attributes.position.needsUpdate = true;
    points.rotation.x = -0.92;
    points.position.y = -0.7;
  } };
}

export default function ThreeExperiment({ mode, paused, params, qualityConfig, reducedMotion, audioLevelRef, theme }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let disposed = false;
    let animationFrame = 0;
    let renderer;
    let scene;
    let camera;
    let field;
    let observer;
    let restartRender = () => {};
    const handleVisibility = () => restartRender();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    import("three").then((THREE) => {
      if (disposed) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
      camera.position.set(0, 0, mode === "galaxy" ? 9.2 : 11.5);
      if (mode === "galaxy") camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ antialias: qualityConfig.dpr > 1, alpha: true, powerPreference: qualityConfig.density > 0.8 ? "high-performance" : "low-power" });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qualityConfig.dpr));
      renderer.domElement.dataset.playgroundWebgl = "true";
      if (!paused) renderer.domElement.dataset.playgroundLoop = "active";
      renderer.domElement.className = "playground-canvas";
      renderer.domElement.setAttribute("aria-label", `${mode} interactive WebGL experiment`);
      host.appendChild(renderer.domElement);

      const ink = theme === "dark" ? 0xffffff : 0x111111;
      if (mode === "refraction") field = createWaveField(THREE, qualityConfig.density, true, ink);
      if (mode === "particle-type") field = createParticleType(THREE, qualityConfig.density, ink);
      if (mode === "atlas-field") field = createAtlas(THREE, qualityConfig.density, theme === "dark");
      if (mode === "signal-field") field = createSignal(THREE, qualityConfig.density, ink);
      scene.add(field.root);

      const resize = () => {
        const rect = host.getBoundingClientRect();
        camera.aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height, false);
      };
      observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      let lastFrame = 0;
      const render = (time) => {
        animationFrame = 0;
        if (disposed || paused || document.hidden) return;
        const interval = 1000 / qualityConfig.fps;
        if (time - lastFrame >= interval) {
          lastFrame = time;
          const pointerEase = mode === "refraction" ? params.recovery : 0.045;
          pointer.x += (pointer.tx - pointer.x) * pointerEase;
          pointer.y += (pointer.ty - pointer.y) * pointerEase;
          field.update(time * 0.001, pointer, params, reducedMotion, audioLevelRef?.current || 0);
          renderer.render(scene, camera);
        }
        animationFrame = requestAnimationFrame(render);
      };
      restartRender = () => {
        if (!disposed && !paused && !document.hidden && !animationFrame) animationFrame = requestAnimationFrame(render);
      };
      animationFrame = requestAnimationFrame(render);
    });

    const updatePointer = (event) => {
      const rect = host.getBoundingClientRect();
      pointer.tx = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      pointer.ty = clamp(-((event.clientY - rect.top) / rect.height * 2 - 1), -1, 1);
    };
    host.addEventListener("pointermove", updatePointer);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      host.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer?.disconnect();
      if (field?.root) {
        field.root.traverse((object) => {
          object.geometry?.dispose?.();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material?.dispose?.();
        });
        field.dispose?.();
      }
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      }
    };
  }, [mode, paused, params, qualityConfig, reducedMotion, audioLevelRef, theme]);

  return <div ref={hostRef} className="playground-three-surface" />;
}

export function SignalExperiment(props) {
  const [audioActive, setAudioActive] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Idle field - audio is off");
  const audioLevelRef = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioActive || props.paused) return undefined;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let frame = 0;
    let oscillator = null;
    let gain = null;
    let stream = null;
    let source = null;
    let cancelled = false;
    const sample = () => {
      analyser.getByteFrequencyData(data);
      audioLevelRef.current = data.reduce((sum, value) => sum + value, 0) / data.length / 255;
      frame = requestAnimationFrame(sample);
    };
    const handleVisibility = () => {
      if (document.hidden) context.suspend().catch(() => {});
      else context.resume().catch(() => {});
    };

    const connect = async () => {
      try {
        if (props.params.source === "microphone") {
          setAudioStatus("Requesting microphone permission…");
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (cancelled) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          source = context.createMediaStreamSource(stream);
          source.connect(analyser);
          setAudioStatus("Optional microphone input active");
        } else {
          oscillator = context.createOscillator();
          gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = 82;
          gain.gain.value = 0.025;
          oscillator.connect(analyser);
          analyser.connect(gain);
          gain.connect(context.destination);
          oscillator.start();
          setAudioStatus("Synthetic signal active");
        }
        frame = requestAnimationFrame(sample);
        audioRef.current = { context, oscillator, stream };
      } catch {
        setAudioActive(false);
        setAudioStatus("Microphone unavailable - the idle field remains active");
        context.close().catch(() => {});
      }
    };
    connect();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      oscillator?.stop();
      oscillator?.disconnect();
      source?.disconnect();
      analyser.disconnect();
      gain?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      document.removeEventListener("visibilitychange", handleVisibility);
      context.close().catch(() => {});
      audioRef.current = null;
      audioLevelRef.current = 0;
    };
  }, [audioActive, props.params.source, props.paused]);

  return (
    <div className="signal-experiment">
      <ThreeExperiment {...props} mode="signal-field" audioLevelRef={audioLevelRef} />
      <button
        type="button"
        className="signal-activation"
        onClick={() => setAudioActive((active) => !active)}
        data-clickable="true"
        aria-pressed={audioActive}
      >
        <span aria-hidden="true">{audioActive ? "II" : "Play"}</span>
        <span>{audioActive ? "Stop signal" : props.params.source === "microphone" ? "Enable microphone" : "Play synthetic signal"}</span>
      </button>
      <p className="signal-status" role="status">{props.params.source === "microphone" && !audioActive ? "Microphone is optional and only starts after this explicit action. " : ""}{audioStatus}</p>
    </div>
  );
}
