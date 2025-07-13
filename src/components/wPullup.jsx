'use client';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';

const WordsPullUp = ({ text, className = '' }) => {
  const splittedText = text.split(' ');
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInView) {
      setShouldAnimate(true);
    }
  }, [mounted, isInView]);

  if (!mounted) {
    return (
      <div className="flex justify-center">
        <div className={cn(
          'text-sm text-center sm:text-lg  tracking-tighter md:text-xl md:leading-[2rem]',
          className
        )}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={shouldAnimate ? 'animate' : 'initial'}
          custom={i}
          className={cn(
            'text-sm text-center sm:text-lg  tracking-tighter md:text-xl md:leading-[2rem]',
            'pr-2', // class to separate words
            className
          )}
        >
          {current == '' ? <span>&nbsp;</span> : current}
        </motion.div>
      ))}
    </div>
  );
}

export default WordsPullUp;