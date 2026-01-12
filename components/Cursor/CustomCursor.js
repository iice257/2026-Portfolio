import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { useTheme } from '../../context/ThemeContext';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const { cursorText, cursorVariant } = useCursor();
  const { theme } = useTheme();

  // Use GSAP's quickSetter for performance
  const xSet = useRef(null);
  const ySet = useRef(null);

  useEffect(() => {
    // Setup quickSetters
    xSet.current = gsap.quickSetter(cursorRef.current, "x", "px");
    ySet.current = gsap.quickSetter(cursorRef.current, "y", "px");

    // Text ref setters
    const xSetText = gsap.quickSetter(textRef.current, "x", "px");
    const ySetText = gsap.quickSetter(textRef.current, "y", "px");

    const onMouseMove = (e) => {
      if (xSet.current && ySet.current) {
        xSet.current(e.clientX);
        ySet.current(e.clientY);
      }
      if (textRef.current) {
        xSetText(e.clientX);
        ySetText(e.clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Theme colors
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#ffffff' : '#000000';
  const glowFilter = isDark
    ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
    : 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.2))';

  const isProject = cursorVariant === 'project';

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        {/* Cursor Container - handles rotation or scaling if needed */}
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            transform: isProject ? 'scale(0)' : 'scale(1)', // Hide pointer when expanding to project overlay? Or keep it? 
            // User said "behave exactly like normal", usually text cursors replace the pointer. 
            // But let's keep the pointer for precision and maybe just show text next to it.
            // Actually, standard circle cursors often expand. 
            // For an arrow, expanding into a circle is weird.
            // Let's decide: When hovering project, maybe we keep the arrow but just show the text?
            // Let's hide the arrow and show a "Click" indicator if it's a project, 
            // OR just keep the arrow and show text. 
            // Let's keep the arrow visible for now as requested "cursor throughout the site".
            filter: glowFilter,
          }}
        >
          {/* Hollow Arrow SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            <path
              d="M5.5 3L11.5 26.5L16.2 17.8L25.5 17.8L5.5 3Z"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      {/* Floating Text - Only visible when cursorVariant is 'project' */}
      <div
        ref={textRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center overflow-visible"
        style={{ willChange: 'transform' }}
      >
        {cursorText && (
          <div
            className="absolute left-8 top-8 bg-black/80 text-white backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.8)',
              color: isDark ? '#fff' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}
          >
            {cursorText}
          </div>
        )}
      </div>

      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
