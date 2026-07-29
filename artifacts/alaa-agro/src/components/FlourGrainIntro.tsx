import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
// Deterministic pseudo-random using a seeded approach
function seededValues(
  seed: number,
  count: number,
  min: number,
  max: number,
): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(min + (s / 233280) * (max - min));
  }
  return out;
}

interface Grain {
  id: number;
  x: number; // % from left
  startY: number; // % from top (start above viewport)
  endY: number; // % (land position)
  size: number; // px
  duration: number;
  delay: number;
  opacity: number;
  drift: number; // horizontal drift px
  rotate: number; // end rotation
  isFlour: boolean; // flour dust vs grain kernel
}

const GRAIN_COUNT = 70;

function buildParticles(): Grain[] {
  const xs = seededValues(1, GRAIN_COUNT, 0, 100);
  const startYs = seededValues(2, GRAIN_COUNT, -20, -2);
  const endYs = seededValues(3, GRAIN_COUNT, 60, 110);
  const sizes = seededValues(4, GRAIN_COUNT, 2, 7);
  const durs = seededValues(5, GRAIN_COUNT, 1.8, 3.5);
  const delays = seededValues(6, GRAIN_COUNT, 0, 2.2);
  const opas = seededValues(7, GRAIN_COUNT, 0.25, 0.75);
  const drifts = seededValues(8, GRAIN_COUNT, -30, 30);
  const rots = seededValues(9, GRAIN_COUNT, -180, 360);
  const types = seededValues(10, GRAIN_COUNT, 0, 1);

  return Array.from({ length: GRAIN_COUNT }, (_, i) => ({
    id: i,
    x: xs[i],
    startY: startYs[i],
    endY: endYs[i],
    size: sizes[i],
    duration: durs[i],
    delay: delays[i],
    opacity: opas[i],
    drift: drifts[i],
    rotate: rots[i],
    isFlour: types[i] > 0.55,
  }));
}

// Flour dust burst — larger, blurry, ephemeral
interface DustPuff {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function buildDustPuffs(): DustPuff[] {
  const count = 12;
  const xs = seededValues(11, count, 5, 95);
  const ys = seededValues(12, count, 10, 85);
  const sizes = seededValues(13, count, 40, 120);
  const dels = seededValues(14, count, 0.2, 2.0);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: xs[i],
    y: ys[i],
    size: sizes[i],
    delay: dels[i],
  }));
}

const PARTICLES = buildParticles();
const DUST_PUFFS = buildDustPuffs();

// How long the overlay stays before exiting (ms)
const HOLD_MS = 3400;
const EXIT_MS = 900;

interface Props {
  onComplete: () => void;
}

export function FlourGrainIntro({ onComplete }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setExiting(true), HOLD_MS);
    const doneTimer = setTimeout(onComplete, HOLD_MS + EXIT_MS);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-[500] overflow-hidden flex items-center justify-center"
          style={{
            background:
              "linear-gradient(160deg, #0B281E 0%, #1A1200 50%, #1A3E2E 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: EXIT_MS / 1000, ease: "easeInOut" },
          }}
        >
          {/* Warm amber radial glow — hero matching the main site hero */}
          <motion.div
            className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(194,154,61,0.18) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          {/* Bottom-left secondary glow */}
          <motion.div
            className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(194,154,61,0.10) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Flour dust puffs */}
          {DUST_PUFFS.map((puff) => (
            <motion.div
              key={`dust-${puff.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${puff.x}%`,
                top: `${puff.y}%`,
                width: puff.size,
                height: puff.size,
                background:
                  "radial-gradient(circle, rgba(245,240,230,0.22) 0%, transparent 70%)",
                filter: "blur(8px)",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 1.4] }}
              transition={{
                delay: puff.delay,
                duration: 1.8,
                ease: "easeOut",
                times: [0, 0.3, 1],
              }}
            />
          ))}

          {/* Falling grain particles */}
          {PARTICLES.map((g) => (
            <motion.div
              key={`grain-${g.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${g.x}%`,
                top: `${g.startY}%`,
                width: g.isFlour ? g.size * 1.8 : g.size,
                height: g.isFlour ? g.size * 1.8 : g.size * 2.2,
                borderRadius: g.isFlour ? "50%" : "40% 40% 50% 50%",
                backgroundColor: g.isFlour
                  ? `rgba(245,240,230,${g.opacity * 0.6})`
                  : `rgba(194,154,61,${g.opacity})`,
                filter: g.isFlour ? "blur(1.5px)" : "none",
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: `${g.endY - g.startY}vh`,
                x: g.drift,
                rotate: g.rotate,
                opacity: [0, g.opacity, g.opacity, 0],
              }}
              transition={{
                delay: g.delay,
                duration: g.duration,
                ease: "easeIn",
                opacity: { times: [0, 0.1, 0.8, 1], duration: g.duration },
              }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 select-none">
            {/* Logo */}
            <motion.img
              src={logoPath}
              alt="ALAA AGRO TRADE LLC"
              className="w-28 h-28 md:w-36 md:h-36 object-contain mb-8"
              initial={{ opacity: 0, scale: 0.7, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.3,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Gold divider line that grows */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-accent to-transparent mb-8"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            />

            {/* Company name — clip-path reveal */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                className="font-serif text-3xl md:text-5xl tracking-widest text-[#F5F0E6]"
                style={{ letterSpacing: "0.12em" }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: 1.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                ALAA AGRO TRADE
              </motion.h1>
            </div>

            {/* LLC badge */}
            <div className="overflow-hidden mb-10">
              <motion.p
                className="text-xs md:text-sm tracking-[0.35em] text-accent uppercase font-medium"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: 1.35,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                LLC &nbsp;·&nbsp; MOSCOW, RUSSIA
              </motion.p>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-sm md:text-base text-[#F5F0E6]/60 max-w-sm leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.9, ease: "easeOut" }}
            >
              Russian Agricultural Products for Global Trade
            </motion.p>

            {/* Progress dots */}
            <motion.div
              className="flex items-center gap-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-accent"
                  initial={{ width: 6, opacity: 0.3 }}
                  animate={{
                    width: i === 0 ? 24 : 6,
                    opacity: i === 0 ? 1 : 0.3,
                  }}
                  transition={{ delay: 2.2 + i * 0.1, duration: 0.4 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
