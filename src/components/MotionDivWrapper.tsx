import React from 'react';

import { motion } from 'framer-motion';

export default function MotionDivWrapper({
  children,
  initial = { opacity: 0, scale: 0.9 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.9 },
  duration,
  delay,
  key,
}: {
  children: React.ReactNode;
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  exit?: Record<string, number>;
  duration?: number;
  delay?: number;
  key?: string | number;
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

{
  /* <motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
transition={{ duration: 0.4, delay: 0.05 }}

>
{children}

</motion.div> */
}
