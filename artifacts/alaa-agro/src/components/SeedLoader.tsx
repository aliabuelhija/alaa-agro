import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function SeedLoader({ onComplete }: { onComplete: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if already visited in this session
    const hasVisited = sessionStorage.getItem('alaa_agro_visited');
    
    if (hasVisited || shouldReduceMotion) {
      onComplete();
      return;
    }

    // Sequence timing
    const timer = setTimeout(() => {
      setIsComplete(true);
      sessionStorage.setItem('alaa_agro_visited', 'true');
      setTimeout(onComplete, 500); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Soil Line */}
        <motion.div 
          className="absolute top-1/2 left-0 w-full h-[1px] bg-border"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />
        
        {/* Seed falling */}
        <motion.div
          className="absolute w-3 h-4 rounded-[50%] bg-accent z-10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1.5, 0.36, 1] }}
        />

        {/* Root growing down */}
        <motion.svg className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-16" viewBox="0 0 32 64">
          <motion.path
            d="M16 0 Q 20 20 10 40 T 16 64"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
        </motion.svg>

        {/* Stem growing up */}
        <motion.svg className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-16 h-24" viewBox="0 0 64 96">
          <motion.path
            d="M32 96 Q 32 60 45 40 T 32 0"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          />
          {/* Leaves */}
          <motion.path
            d="M40 50 Q 55 45 60 30 Q 45 35 40 50"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.4 }}
            style={{ originX: 0, originY: 1 }}
          />
          <motion.path
            d="M35 70 Q 20 65 15 50 Q 30 55 35 70"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.6 }}
            style={{ originX: 1, originY: 1 }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}