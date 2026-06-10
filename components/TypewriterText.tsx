'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TypewriterText({ texts }: { texts: string[] }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentFullText = texts[currentIndex];

      if (isDeleting) {
        setDisplayedText(currentFullText.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setDisplayedText(currentFullText.substring(0, charIndex + 1));
        charIndex++;
      }

      let typeSpeed = isDeleting ? 20 : 40; // faster delete

      if (!isDeleting && charIndex === currentFullText.length) {
        // Pause at the end of the quote before deleting
        typeSpeed = 3500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Switch to the next quote
        isDeleting = false;
        currentIndex = (currentIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before typing next quote
      }

      timeout = setTimeout(type, typeSpeed);
    };

    timeout = setTimeout(type, 500);

    return () => clearTimeout(timeout);
  }, [texts]);

  return (
    <blockquote
      className="font-playfair italic leading-tight relative"
      style={{
        color: 'rgba(255,255,255,0.9)',
        fontSize: '42px',
        lineHeight: 1.2,
        minHeight: '160px',
      }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block font-sans font-light text-white ml-2 opacity-50"
        style={{ transform: 'translateY(-2px)' }}
      >
        |
      </motion.span>
    </blockquote>
  );
}
