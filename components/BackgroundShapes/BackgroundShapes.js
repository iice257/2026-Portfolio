import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const BackgroundShapes = () => {
  const containerRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each shape moves at different parallax speed
      shapesRef.current.forEach((shape, i) => {
        const speed = 0.3 + (i * 0.15);

        gsap.to(shape, {
          y: () => window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          }
        });

        // Subtle scale morph on scroll
        gsap.to(shape, {
          scaleX: 1 + (i % 2 === 0 ? 0.05 : -0.05),
          scaleY: 1 + (i % 2 === 0 ? -0.05 : 0.05),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // Non-equal rectangles positioned asymmetrically - neo-brutalist style
  const shapes = [
    { width: 180, height: 280, top: "8%", left: "3%", opacity: 0.04 },
    { width: 100, height: 450, top: "25%", right: "6%", opacity: 0.03 },
    { width: 280, height: 120, top: "55%", left: "8%", opacity: 0.025 },
    { width: 140, height: 200, top: "70%", right: "12%", opacity: 0.03 },
    { width: 220, height: 80, top: "85%", left: "20%", opacity: 0.02 },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          ref={el => shapesRef.current[i] = el}
          className="absolute"
          style={{
            width: shape.width,
            height: shape.height,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            opacity: shape.opacity,
            border: '1px solid var(--fg-primary)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundShapes;
