import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouchFlow = window.matchMedia("(hover: none), (pointer: coarse)").matches;

      if (reduceMotion) {
        gsap.set(words, { opacity: 1, filter: "blur(0px)" });
        return;
      }

      gsap.set(words, {
        opacity: 0.15,
        filter: "blur(4px)",
      });

      gsap.to(words, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.24,
        stagger: 0.063,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: isTouchFlow ? headingRef.current : sectionRef.current,
          start: isTouchFlow ? "top 84%" : "10% center",
          end: isTouchFlow ? "bottom 18%" : "73% center",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text = "I believe in building with intention, shipping with precision, and designing for impact.";
  const words = text.split(" ");

  return (
    <section
      ref={sectionRef}
      data-normal-url="true"
      className="philosophy-section relative z-20 flex items-start justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="philosophy-copy section-container text-center">
        <h2
          ref={headingRef}
          className="philosophy-heading font-extralight mx-auto"
          style={{ color: 'var(--fg-primary)' }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => wordsRef.current[i] = el}
              className="inline-block mr-[0.3em]"
              style={{
                fontWeight: ['intention,', 'precision,', 'impact.'].includes(word) ? 400 : 200
              }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default Philosophy;
