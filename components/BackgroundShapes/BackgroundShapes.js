import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const BackgroundShapes = () => {
  const containerRef = useRef(null);
  const shapesRef = useRef([]);

  useLayoutEffect(() => {
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

  // Non-equal rectangles positioned asymmetrically
  const shapes = [
    { width: 180, height: 280, top: "15%", left: "5%", opacity: 0.03 },
    { width: 120, height: 400, top: "35%", right: "8%", opacity: 0.025 },
    { width: 250, height: 150, top: "60%", left: "12%", opacity: 0.02 },
    { width: 100, height: 320, top: "75%", right: "15%", opacity: 0.03 },
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
