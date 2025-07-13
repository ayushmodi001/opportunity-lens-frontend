'use client';
import { motion, useInView } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';

const BlurIn = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Auto-trigger animation after a short delay, even if not in view
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && isInView) {
      setShouldAnimate(true);
    }
  }, [mounted, isInView]);

  if (!mounted) {
    return (
      <h2 className={`text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter md:leading-[4rem] ${className}`}>
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      ref={ref}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={shouldAnimate ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(20px)', opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter md:leading-[4rem] ${className}`}
    >
      {children}
    </motion.h2>
  );
};

export default BlurIn;
