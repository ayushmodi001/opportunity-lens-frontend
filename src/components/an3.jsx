'use client';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';

const StaggeredFade = ({ text, className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const variants = {
    hidden: { opacity: 0 },
    show: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.07 },
    }),
  };

  const letters = typeof text === 'string' ? text.split('') : [];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <h2 className={cn(
        'text-lg tracking-tight font-bold',
        className
      )}>
        {text}
      </h2>
    );
  }

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={isInView ? 'show' : ''}
      variants={variants}
      viewport={{ once: true }}
      className={cn(
        'text-lg tracking-tight font-bold',
        className
      )}
    >
      {letters.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={variants} custom={i}>
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};

export default StaggeredFade;