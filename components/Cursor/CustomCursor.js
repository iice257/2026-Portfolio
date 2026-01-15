import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { useTheme } from '../../context/ThemeContext';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Default hidden until mouse moves
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
      // Ensure visible on movement
      if (!isVisible) setIsVisible(true);

      if (xSet.current && ySet.current) {
        xSet.current(e.clientX);
        ySet.current(e.clientY);
      }
      if (textRef.current) {
        xSetText(e.clientX);
        ySetText(e.clientY);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave); // document leave covers window exit mostly
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  // Theme colors
  const isDark = theme === 'dark';
  const isProject = cursorVariant === 'project';
  const isMenu = cursorVariant === 'menu';

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          willChange: 'transform',
          mixBlendMode: 'difference' // Inverts cursor color based on background
        }}
      >
        {/* Cursor Container */}
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            transform: isProject ? 'scale(0)' : (isMenu ? 'scale(1.2)' : 'scale(1)'),
          }}
        >
          {/* Hollow Arrow SVG - White stroke allows difference mode to invert it */}
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
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      {/* Floating Text - Glass Pill Style */}
      {cursorText && (
        <div
          ref={textRef}
          className={`fixed top-0 left-0 pointer-events-none z-[999999] flex items-center justify-center overflow-visible transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: 'transform' }}
        >
          <div
            className="absolute left-8 top-8 bg-black/80 text-white backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {cursorText}
          </div>
        </div>
      )}

      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
