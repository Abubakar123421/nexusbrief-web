'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function DataFlowVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  // Define paths for convergence
  const inputPaths = [
    'M 0 50 C 80 50, 100 200, 150 200',
    'M 0 120 C 80 120, 100 200, 150 200',
    'M 0 280 C 80 280, 100 200, 150 200',
    'M 0 350 C 80 350, 100 200, 150 200',
  ];

  const outputPath = 'M 150 200 C 220 200, 220 150, 300 150';
  const outputPath2 = 'M 150 200 C 220 200, 220 250, 300 250';

  const dotTransition = (delay: number, duration: number) => ({
    duration,
    delay,
    ease: 'linear',
    repeat: Infinity,
  });

  // A subtle muted orange/ochre to fit editorial aesthetics (like FT or NYT accents)
  const accentColor = '#D97736'; 

  return (
    <motion.div
      ref={containerRef}
      style={{ y }}
      className="w-full h-full min-h-[400px] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-700"
    >
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] h-auto overflow-visible"
      >
        {/* Draw the static ultra-thin tracks */}
        {inputPaths.map((d, i) => (
          <path
            key={`track-in-${i}`}
            d={d}
            stroke="#0A0A0A"
            strokeWidth="0.5"
            strokeOpacity="0.1"
            fill="none"
          />
        ))}
        <path
          d={outputPath}
          stroke="#0A0A0A"
          strokeWidth="0.5"
          strokeOpacity="0.1"
          fill="none"
        />
        <path
          d={outputPath2}
          stroke="#0A0A0A"
          strokeWidth="0.5"
          strokeOpacity="0.1"
          fill="none"
        />

        {/* Central Convergence Node */}
        <motion.circle
          cx="150"
          cy="200"
          r="4"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        />
        <circle cx="150" cy="200" r="1.5" fill={accentColor} />

        {/* Output nodes (Digest representations) */}
        <circle cx="300" cy="150" r="2" fill="#0A0A0A" fillOpacity="0.4" />
        <circle cx="300" cy="250" r="2" fill="#0A0A0A" fillOpacity="0.4" />

        {/* Animate Dots on Input Paths */}
        {inputPaths.map((d, i) => (
          <g key={`group-in-${i}`}>
            <motion.circle r="2.5" fill="#0A0A0A" fillOpacity="0.3">
              <animateMotion
                dur={`${4 + i * 0.5}s`}
                repeatCount="indefinite"
                path={d}
                calcMode="linear"
              />
            </motion.circle>
            {/* Second wave of dots for continuous flow */}
            <motion.circle r="1.5" fill="#0A0A0A" fillOpacity="0.2">
              <animateMotion
                dur={`${4 + i * 0.5}s`}
                begin={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
                path={d}
                calcMode="linear"
              />
            </motion.circle>
          </g>
        ))}

        {/* Animate Dots on Output Paths (Fewer, meaning filtered/curated) */}
        <g>
          <motion.circle r="3" fill={accentColor}>
            <animateMotion
              dur="6s"
              begin="1s"
              repeatCount="indefinite"
              path={outputPath}
              calcMode="linear"
            />
          </motion.circle>
          <motion.circle r="3" fill={accentColor}>
            <animateMotion
              dur="6.5s"
              begin="3s"
              repeatCount="indefinite"
              path={outputPath2}
              calcMode="linear"
            />
          </motion.circle>
        </g>
      </svg>
    </motion.div>
  );
}
