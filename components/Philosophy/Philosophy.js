import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while text animates
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade in and scale text
          gsap.set(textRef.current, {
            opacity: progress < 0.5 ? progress * 2 : 2 - (progress * 2),
            scale: 1 + (progress * 0.05),
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container text-center">
        <h2
          ref={textRef}
          className="text-giant font-extralight max-w-5xl mx-auto"
          style={{ color: 'var(--fg-primary)' }}
        >
          I believe in building with{" "}
          <span className="font-light" style={{ color: 'var(--fg-primary)' }}>
            intention
          </span>
          , shipping with{" "}
          <span className="font-light" style={{ color: 'var(--fg-primary)' }}>
            precision
          </span>
          , and designing for{" "}
          <span className="font-light" style={{ color: 'var(--fg-primary)' }}>
            impact
          </span>
          .
        </h2>
      </div>
    </section>
  );
};

export default Philosophy;
