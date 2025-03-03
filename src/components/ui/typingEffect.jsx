'use client';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TypingEffect = ({ text = " ", className=" "  }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <h2
      ref={ref}
      className={cn(
        "text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]",
        className
      )}
    >
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </h2>
  );
};

export default TypingEffect;