'use client';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const BlurIn = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.h2
      ref={ref}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : {}}
      transition={{ duration: 1.2 }}
      className={`text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter md:leading-[4rem] ${className}`}
    >
      {children}
    </motion.h2>
  );
};

export default BlurIn;
