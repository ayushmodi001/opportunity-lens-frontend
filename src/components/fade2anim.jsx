'use client';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const TextFade = ({ direction, children, className = '', staggerChildren = 0.1 }) => {
  const FADE_DOWN = {
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
    hidden: { opacity: 0, y: direction === 'down' ? -18 : 18 },
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'show' : ''}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerChildren,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) && index < React.Children.count(children) - 1 ? (
          <motion.div variants={FADE_DOWN} className="text-sm sm:text-base md:text-lg">
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
}

export default TextFade;