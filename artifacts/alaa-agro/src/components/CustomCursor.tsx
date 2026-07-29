import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [data-cursor-hover]');
      
      if (interactiveEl) {
        setIsHovering(true);
        const text = interactiveEl.getAttribute('data-cursor-text');
        if (text) setHoverText(text);
        else setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible || shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-medium tracking-wider uppercase overflow-hidden"
      animate={{
        x: mousePosition.x - (isHovering ? 32 : 6),
        y: mousePosition.y - (isHovering ? 32 : 6),
        width: isHovering ? 64 : 12,
        height: isHovering ? 64 : 12,
        opacity: 1
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.5
      }}
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering && hoverText ? 1 : 0 }}
        className="absolute whitespace-nowrap"
      >
        {hoverText}
      </motion.span>
    </motion.div>
  );
}