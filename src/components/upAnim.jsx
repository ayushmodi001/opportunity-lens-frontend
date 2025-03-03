'use client';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const WordsPullUp = ({ text, className = '' }) => {
  const splittedText = text.split(' ');

  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      }
    }),
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.p
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : ''}
      className={cn(
        'text-sm text-center sm:text-lg font-semibold tracking-tighter md:text-xl md:leading-[2rem]',
        className
      )}
    >
      {splittedText.map((current, i) => (
        <motion.span
          key={i}
          variants={pullupVariant}
          custom={i}
          className={cn(
            'inline-block',
            'mr-2' // class to separate words
          )}
        >
          {current === '' ? <span>&nbsp;</span> : current}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default WordsPullUp;