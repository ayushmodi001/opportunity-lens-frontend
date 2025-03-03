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
      },
    }),
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className="flex justify-center">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? 'animate' : ''}
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