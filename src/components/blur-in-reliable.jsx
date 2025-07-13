'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const BlurInReliable = ({ children, className = "" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <h2 className={`text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter md:leading-[4rem] ${className}`}>
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      className={`text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter md:leading-[4rem] ${className}`}
    >
      {children}
    </motion.h2>
  );
};

export default BlurInReliable;
