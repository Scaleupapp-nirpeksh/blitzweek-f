import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({ children, delay=0, y=14, once=true, as='div', ...rest }){
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.22 }}
      transition={{ duration: 0.45, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}
