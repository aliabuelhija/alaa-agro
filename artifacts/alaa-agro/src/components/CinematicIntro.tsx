import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale } from "../contexts/LocaleContext";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
// ─── Performance mode detection (runs synchronously) ─────────────────────────
type PerfMode = "desktop" | "mobile" | "fallback";

function detectPerfMode(): PerfMode {
  try {
    const w = window.innerWidth;
    const cores = navigator.hardwareConcurrency || 2;

    // Quick canvas benchmark
    const bench = document.createElement("canvas");
    bench.width = 200;
    bench.height = 200;
    const ctx = bench.getContext("2d");
    const t0 = performance.now();
    if (ctx) {
      for (let i = 0; i < 800; i++) {
        ctx.beginPath();
        ctx.arc(100, 100, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const benchMs = performance.now() - t0;

    if (benchMs > 25 || cores <= 1) return "fallback";
    if (w < 768) return "mobile";
    return "desktop";
  } catch {
    return "fallback";
  }
}

// ─── Particle ─────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  type: "flour" | "grain";
  angle: number;
  angularV: number;
  phase: number;
  life: number;
  born: number;
}

// ─── Animation phases ─────────────────────────────────────────────────────────
type AnimPhase =
  | "bg-fade"
  | "particles-in"
  | "grain-join"
  | "converge"
  | "logo-reveal"
  | "line-text"
  | "tagline"
  | "disperse"
  | "crossfade"
  | "done";

const PHASE_ORDER: AnimPhase[] = [
  "bg-fade",
  "particles-in",
  "grain-join",
  "converge",
  "logo-reveal",
  "line-text",
  "tagline",
  "disperse",
  "crossfade",
  "done",
];

const DESKTOP_TIMES: Record<AnimPhase, number> = {
  "bg-fade": 0,
  "particles-in": 300,
  "grain-join": 1100,
  converge: 2200,
  "logo-reveal": 2900,
  "line-text": 3350,
  tagline: 3700,
  disperse: 3950,
  crossfade: 4300,
  done: 5100,
};

const MOBILE_TIMES: Record<AnimPhase, number> = {
  "bg-fade": 0,
  "particles-in": 200,
  "grain-join": 700,
  converge: 1350,
  "logo-reveal": 1800,
  "line-text": 2100,
  tagline: 2380,
  disperse: 2550,
  crossfade: 2700,
  done: 3100,
};

// ─── Main component ───────────────────────────────────────────────────────────
interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLocale();

  // Detect perf mode synchronously on mount so first render is correct
  const [perfMode] = useState<PerfMode>(() =>
    typeof window !== "undefined" ? detectPerfMode() : "fallback",
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);
  const isSkippedRef = useRef(false);

  const [phase, setPhase] = useState<AnimPhase>("bg-fade");
  const [showSkip, setShowSkip] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);

  const tagline =
    locale === "ru"
      ? "Российская с/х продукция для мировой торговли"
      : "Russian Agricultural Products for Global Trade";

  // ── Complete helper: always call onComplete after exit anim ──────────────
  const triggerComplete = useCallback(
    (delay = 650) => {
      if (isSkippedRef.current) return;
      isSkippedRef.current = true;
      setExiting(true);
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
      setTimeout(() => {
        sessionStorage.setItem("alaa_agro_intro_seen", "true");
        onComplete();
      }, delay);
    },
    [onComplete],
  );

  // ── Skip handler ─────────────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    triggerComplete(350);
  }, [triggerComplete]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    },
    [handleSkip],
  );

  // ── Reduced motion: brief logo fade only ──────────────────────────────────
  useEffect(() => {
    if (!shouldReduceMotion) return;
    const id = setTimeout(() => {
      sessionStorage.setItem("alaa_agro_intro_seen", "true");
      onComplete();
    }, 400);
    return () => clearTimeout(id);
  }, [shouldReduceMotion, onComplete]);

  // ── Hard cap: 5 seconds ───────────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => {
      if (!isSkippedRef.current) triggerComplete(350);
    }, 5000);
    return () => clearTimeout(id);
  }, [triggerComplete]);

  // ── Show skip button after 4 seconds ─────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(id);
  }, []);

  // ── Canvas particle animation ─────────────────────────────────────────────
  useEffect(() => {
    if (shouldReduceMotion || perfMode === "fallback") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const times = perfMode === "mobile" ? MOBILE_TIMES : DESKTOP_TIMES;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const getDims = () => ({
      W: canvas.width,
      H: canvas.height,
      CX: canvas.width / 2,
      CY: canvas.height / 2,
    });

    const maxFlour = perfMode === "desktop" ? 300 : 120;
    const maxGrain = perfMode === "desktop" ? 80 : 32;

    function spawnFlour(now: number): Particle {
      const { W, H, CX, CY } = getDims();
      const a = Math.random() * Math.PI * 2;
      const dist = 0.28 + Math.random() * 0.55;
      return {
        x: CX + Math.cos(a) * W * dist,
        y: CY + Math.sin(a) * H * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.12,
        radius: 1 + Math.random() * 2.8,
        opacity: 0.15 + Math.random() * 0.55,
        type: "flour",
        angle: 0,
        angularV: 0,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        born: now,
      };
    }

    function spawnGrain(now: number): Particle {
      const { W, H, CX, CY } = getDims();
      const a = Math.random() * Math.PI * 2;
      const dist = 0.18 + Math.random() * 0.48;
      return {
        x: CX + Math.cos(a) * W * dist,
        y: CY + Math.sin(a) * H * dist,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 2.5 + Math.random() * 3.2,
        opacity: 0.3 + Math.random() * 0.45,
        type: "grain",
        angle: Math.random() * Math.PI * 2,
        angularV: (Math.random() - 0.5) * 0.022,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        born: now,
      };
    }

    function drawFlour(p: Particle, sysAlpha: number) {
      const r = p.radius;
      const a = sysAlpha * p.opacity * p.life;
      // Soft halo layers (blur simulation)
      for (let i = 3; i >= 1; i--) {
        ctx.beginPath();
        ctx.ellipse(
          p.x,
          p.y,
          r * (1 + i * 0.7) * 1.3,
          r * (1 + i * 0.7),
          0,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(240,238,228,${Math.max(0, (a * 0.07) / i)})`;
        ctx.fill();
      }
      // Core particle
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, r * 1.4, r, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(250,247,238,${Math.max(0, a)})`;
      ctx.fill();
    }

    function drawGrain(p: Particle, sysAlpha: number) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const r = p.radius;
      const a = sysAlpha * p.opacity * p.life;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0, `rgba(215,175,80,${a})`);
      grad.addColorStop(0.5, `rgba(185,138,50,${a * 0.7})`);
      grad.addColorStop(1, `rgba(160,110,28,0)`);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.52, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    startTimeRef.current = performance.now();
    let lastSpawnFlour = 0;
    let lastSpawnGrain = 0;

    function loop(now: number) {
      const elapsed = now - startTimeRef.current;
      const { W, H, CX, CY } = getDims();

      // Resolve current phase
      let currentPhase: AnimPhase = "bg-fade";
      for (let i = PHASE_ORDER.length - 1; i >= 0; i--) {
        if (elapsed >= times[PHASE_ORDER[i]]) {
          currentPhase = PHASE_ORDER[i];
          break;
        }
      }
      setPhase(currentPhase);

      // Background opacity
      setBgOpacity(Math.min(1, elapsed / (times["particles-in"] + 80)));

      // Convergence 0→1
      const convStart = times["converge"];
      const convEnd = times["logo-reveal"];
      const convergence =
        elapsed < convStart
          ? 0
          : elapsed > convEnd
            ? 1
            : (elapsed - convStart) / (convEnd - convStart);

      // Disperse 0→1
      const dispStart = times["disperse"];
      const dispEnd = times["crossfade"];
      const disperse =
        elapsed < dispStart
          ? 0
          : elapsed > dispEnd
            ? 1
            : (elapsed - dispStart) / (dispEnd - dispStart);

      // Overall particle alpha
      const sysAlpha =
        disperse > 0 ? Math.max(0, 1 - Math.pow(disperse, 0.65)) : 1;

      // Spawn
      const flourCount = particlesRef.current.filter(
        (p) => p.type === "flour",
      ).length;
      const grainCount = particlesRef.current.filter(
        (p) => p.type === "grain",
      ).length;
      if (
        elapsed >= times["particles-in"] &&
        flourCount < maxFlour &&
        now - lastSpawnFlour > 18
      ) {
        particlesRef.current.push(spawnFlour(now));
        lastSpawnFlour = now;
      }
      if (
        elapsed >= times["grain-join"] &&
        grainCount < maxGrain &&
        now - lastSpawnGrain > 45
      ) {
        particlesRef.current.push(spawnGrain(now));
        lastSpawnGrain = now;
      }

      ctx.clearRect(0, 0, W, H);

      const t = elapsed * 0.001;

      for (const p of particlesRef.current) {
        // Fade in particle
        p.life = Math.min(1, (now - p.born) / 850);

        // Sinusoidal turbulence
        const tx = Math.sin(t * 0.65 + p.phase) * 0.14;
        const ty = Math.cos(t * 0.48 + p.phase * 1.4) * 0.11;

        if (convergence > 0.04) {
          const dx = CX - p.x;
          const dy = CY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const pull = convergence * 0.022 * (1 + convergence * 0.5);
          p.vx += (dx / dist) * pull + tx * (1 - convergence) * 0.6;
          p.vy += (dy / dist) * pull + ty * (1 - convergence) * 0.6;
          const damp = 0.935 - convergence * 0.03;
          p.vx *= damp;
          p.vy *= damp;
        } else {
          p.vx += tx * 0.09;
          p.vy += ty * 0.09;
          p.vx *= 0.982;
          p.vy *= 0.982;
        }

        if (disperse > 0) {
          const dx = p.x - CX;
          const dy = p.y - CY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          p.vx += (dx / dist) * disperse * 1.4;
          p.vy += (dy / dist) * disperse * 1.4;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angularV;

        if (p.type === "flour") drawFlour(p, sysAlpha);
        else drawGrain(p, sysAlpha);
      }

      // Trigger exit from crossfade phase
      if (currentPhase === "crossfade" && !isSkippedRef.current) {
        setExiting(true);
      }

      // Fully done
      if (currentPhase === "done" && !isSkippedRef.current) {
        cancelAnimationFrame(rafRef.current);
        particlesRef.current = [];
        sessionStorage.setItem("alaa_agro_intro_seen", "true");
        setExiting(true);
        setTimeout(onComplete, 650);
        isSkippedRef.current = true;
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
      window.removeEventListener("resize", resize);
    };
  }, [shouldReduceMotion, perfMode, onComplete]);

  // ── Reduced motion: logo-only fade ───────────────────────────────────────
  if (shouldReduceMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0B281E]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <img src={logoPath} alt="ALAA AGRO" className="w-32 opacity-90" />
      </motion.div>
    );
  }

  // ── Fallback mode: static logo fade ──────────────────────────────────────
  if (perfMode === "fallback") {
    return (
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        style={{ background: "#0B281E" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        onAnimationComplete={() => {
          sessionStorage.setItem("alaa_agro_intro_seen", "true");
          onComplete();
        }}
      >
        <motion.img
          src={logoPath}
          alt="ALAA AGRO"
          className="w-32 drop-shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
      </motion.div>
    );
  }

  // ── Text / logo visibility based on phase ────────────────────────────────
  const LOGO_PHASES: AnimPhase[] = [
    "logo-reveal",
    "line-text",
    "tagline",
    "disperse",
    "crossfade",
  ];
  const LINE_PHASES: AnimPhase[] = [
    "line-text",
    "tagline",
    "disperse",
    "crossfade",
  ];
  const COMPANY_PHASES: AnimPhase[] = [
    "line-text",
    "tagline",
    "disperse",
    "crossfade",
  ];
  const TAGLINE_PHASES: AnimPhase[] = ["tagline", "disperse", "crossfade"];

  const showLogo = LOGO_PHASES.includes(phase);
  const showLine = LINE_PHASES.includes(phase);
  const showCompany = COMPANY_PHASES.includes(phase);
  const showTaglineText = TAGLINE_PHASES.includes(phase);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="cinematic-intro"
          className="fixed inset-0 z-[300] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-label="Introduction animation"
          role="presentation"
        >
          {/* Deep forest-green background */}
          <div
            className="absolute inset-0"
            style={{ background: "#0B281E", opacity: bgOpacity }}
          />

          {/* Directional golden light */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 68% 28%, rgba(194,154,61,0.2) 0%, rgba(180,140,50,0.06) 50%, transparent 75%)",
              opacity: bgOpacity,
            }}
          />

          {/* Canvas — particle system */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ willChange: "transform" }}
          />

          {/* ── Logo + text overlay ────────────────────────────────────── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <AnimatePresence>
              {showLogo && (
                <motion.img
                  key="logo"
                  src={logoPath}
                  alt="ALAA AGRO"
                  className="w-24 md:w-32 mb-5 drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.82, filter: "blur(10px)" }}
                  animate={{ opacity: 0.95, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
            </AnimatePresence>

            {/* Animated gold line */}
            <AnimatePresence>
              {showLine && (
                <motion.svg
                  key="gold-line"
                  width="220"
                  height="4"
                  viewBox="0 0 220 4"
                  className="mb-4 overflow-visible"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.line
                    x1="0"
                    y1="2"
                    x2="220"
                    y2="2"
                    stroke="#C29A3D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.65, ease: "easeInOut" }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            {/* Company name */}
            <AnimatePresence>
              {showCompany && (
                <motion.p
                  key="company-name"
                  className="text-white font-sans text-[11px] md:text-sm tracking-[0.28em] uppercase font-semibold mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.92, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  ALAA AGRO TRADE LLC
                </motion.p>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {showTaglineText && (
                <motion.p
                  key="tagline"
                  className="text-white/55 font-sans text-[9px] md:text-[11px] tracking-[0.18em] uppercase font-light text-center max-w-xs px-6"
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {tagline}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* ── Skip Intro button ─────────────────────────────────────── */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                key="skip-btn"
                onClick={handleSkip}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className="absolute bottom-8 right-8 z-10 text-white/45 hover:text-white/90 text-[10px] uppercase tracking-widest font-medium px-4 py-2 border border-white/15 hover:border-white/40 rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A3D] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B281E]"
                aria-label="Skip introduction animation"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Skip Intro
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
