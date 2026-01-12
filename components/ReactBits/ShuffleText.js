import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

/**
 * ShuffleText - Text shuffling animation on scroll entry
 * Simplified version without premium GSAP SplitText plugin
 */
const ShuffleText = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  ease = 'power3.out',
  threshold = 0.1,
  tag = 'span',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 1,
  stagger = 0.03,
  scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [displayChars, setDisplayChars] = useState([]);
  const animatingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  // Split text into chars on mount
  useEffect(() => {
    const chars = text.split('').map((char, i) => ({
      id: i,
      original: char,
      current: char,
      isSpace: char === ' '
    }));
    setDisplayChars(chars);
  }, [text]);

  // Animate function
  const animate = useCallback(() => {
    if (animatingRef.current) return;
    if (triggerOnce && hasPlayedRef.current) return;
    if (respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      onShuffleComplete?.();
      return;
    }

    animatingRef.current = true;
    hasPlayedRef.current = true;

    const originalChars = text.split('');
    const rolls = Math.max(1, Math.floor(shuffleTimes));
    const totalSteps = rolls + 1;
    const stepDuration = (duration * 1000) / totalSteps;

    let currentStep = 0;

    const step = () => {
      if (currentStep >= totalSteps) {
        // Final state - show original
        setDisplayChars(originalChars.map((char, i) => ({
          id: i,
          original: char,
          current: char,
          isSpace: char === ' '
        })));
        setReady(true);
        animatingRef.current = false;
        onShuffleComplete?.();
        return;
      }

      // Calculate progress
      const progress = currentStep / (totalSteps - 1);

      setDisplayChars(originalChars.map((char, i) => {
        if (char === ' ') return { id: i, original: char, current: char, isSpace: true };

        // Progressively reveal characters from left to right
        const charProgress = i / originalChars.length;
        const shouldReveal = charProgress < progress;

        if (shouldReveal) {
          return { id: i, original: char, current: char, isSpace: false };
        }

        // Random scramble character
        const randomChar = scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)];
        return { id: i, original: char, current: randomChar, isSpace: false };
      }));

      currentStep++;
      setTimeout(step, stepDuration);
    };

    step();
  }, [text, duration, shuffleTimes, scrambleCharset, triggerOnce, respectReducedMotion, onShuffleComplete]);

  // ScrollTrigger setup
  useEffect(() => {
    const el = ref.current;
    if (!el || displayChars.length === 0) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${(1 - threshold) * 100}%`,
      once: triggerOnce,
      onEnter: animate
    });

    return () => st.kill();
  }, [animate, threshold, triggerOnce, displayChars.length]);

  // Hover trigger
  useEffect(() => {
    if (!triggerOnHover || !ref.current) return;

    const el = ref.current;
    const handleHover = () => {
      if (!animatingRef.current && hasPlayedRef.current) {
        hasPlayedRef.current = false; // Allow replay on hover
        animate();
      }
    };

    el.addEventListener('mouseenter', handleHover);
    return () => el.removeEventListener('mouseenter', handleHover);
  }, [animate, triggerOnHover]);

  const commonStyle = useMemo(() => ({ textAlign, ...style }), [textAlign, style]);
  const classes = useMemo(() => `shuffle-parent ${ready ? 'is-ready' : ''} ${className}`, [ready, className]);

  const Tag = tag || 'span';

  return (
    <Tag ref={ref} className={classes} style={commonStyle}>
      {displayChars.map((char) => (
        <span
          key={char.id}
          className="shuffle-char"
          style={{
            display: 'inline-block',
            willChange: ready ? 'auto' : 'contents',
          }}
        >
          {char.isSpace ? '\u00A0' : char.current}
        </span>
      ))}
    </Tag>
  );
};

export default ShuffleText;
