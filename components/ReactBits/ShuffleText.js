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
  triggerOnHover = true,
  triggerOnTap = false,
  preserveWords = true,
  clipDuringShuffle = true,
}) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [displayChars, setDisplayChars] = useState([]);
  const [shuffleWidth, setShuffleWidth] = useState(null);
  const animatingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const measureShuffleWidth = useCallback(() => {
    const el = ref.current;
    if (!el) return null;

    const parentWidth = el.parentElement?.getBoundingClientRect().width || 0;
    const rectWidth = el.getBoundingClientRect().width;
    const scrollWidth = el.scrollWidth || rectWidth;
    const availableWidth = parentWidth > 0 ? parentWidth : scrollWidth;

    return Math.max(1, Math.ceil(Math.min(scrollWidth, availableWidth)));
  }, []);

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
      setIsShuffling(false);
      onShuffleComplete?.();
      return;
    }

    clearTimers();
    setShuffleWidth(measureShuffleWidth());
    animatingRef.current = true;
    hasPlayedRef.current = true;
    setReady(false);
    setIsShuffling(true);

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
        setIsShuffling(false);
        setShuffleWidth(null);
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
      const timer = setTimeout(step, stepDuration);
      timersRef.current.push(timer);
    };

    step();
  }, [clearTimers, measureShuffleWidth, text, duration, shuffleTimes, scrambleCharset, triggerOnce, respectReducedMotion, onShuffleComplete]);

  useEffect(() => () => clearTimers(), [clearTimers]);

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

  useEffect(() => {
    if (!triggerOnTap || !ref.current) return;

    const el = ref.current;
    const handlePointerUp = () => {
      if (animatingRef.current) return;

      hasPlayedRef.current = false;
      animate();
    };

    el.addEventListener('pointerup', handlePointerUp);
    return () => el.removeEventListener('pointerup', handlePointerUp);
  }, [animate, triggerOnTap]);

  const commonStyle = useMemo(() => {
    const shuffleStyle = isShuffling && clipDuringShuffle && shuffleWidth
      ? { width: `${shuffleWidth}px` }
      : {};

    return { textAlign, ...style, ...shuffleStyle };
  }, [clipDuringShuffle, isShuffling, shuffleWidth, textAlign, style]);
  const classes = useMemo(() => {
    const states = [
      'shuffle-parent',
      textAlign === 'left' ? 'shuffle-align-left' : '',
      ready ? 'is-ready' : '',
      isShuffling ? 'is-shuffling' : '',
      clipDuringShuffle ? 'clip-during-shuffle' : '',
      className,
    ];

    return states.filter(Boolean).join(' ');
  }, [clipDuringShuffle, isShuffling, ready, className, textAlign]);
  const tokens = useMemo(() => {
    const result = [];
    let currentWord = [];

    displayChars.forEach((char) => {
      if (char.isSpace) {
        if (currentWord.length > 0) {
          result.push({ type: 'word', chars: currentWord });
          currentWord = [];
        }
        result.push({ type: 'space', id: char.id });
        return;
      }

      currentWord.push(char);
    });

    if (currentWord.length > 0) {
      result.push({ type: 'word', chars: currentWord });
    }

    return result;
  }, [displayChars]);

  const Tag = tag || 'span';

  return (
    <Tag ref={ref} className={classes} style={commonStyle}>
      {preserveWords ? (
        tokens.map((token, tokenIndex) => {
          if (token.type === 'space') {
            return <span key={`space-${token.id}`} className="shuffle-space"> </span>;
          }

          return (
            <span key={`word-${tokenIndex}`} className="shuffle-word">
              {token.chars.map((char) => (
                <span
                  key={char.id}
                  className="shuffle-char"
                  style={{
                    display: 'inline-block',
                    willChange: ready ? 'auto' : 'transform',
                  }}
                >
                  {char.current}
                </span>
              ))}
            </span>
          );
        })
      ) : (
        displayChars.map((char) => (
          <span
            key={char.id}
            className="shuffle-char"
            style={{
              display: 'inline-block',
              willChange: ready ? 'auto' : 'transform',
            }}
          >
            {char.isSpace ? '\u00A0' : char.current}
          </span>
        ))
      )}
    </Tag>
  );
};

export default ShuffleText;
