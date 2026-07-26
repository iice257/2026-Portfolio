import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouchFlow = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      const revealWindow = 0.2;

      const applyRevealProgress = (progress) => {
        words.forEach((word, index) => {
          const start = (index / words.length) * (1 - revealWindow);
          const localProgress = Math.min(1, Math.max(0, (progress - start) / revealWindow));

          gsap.set(word, {
            opacity: 0.15 + (localProgress * 0.85),
            filter: `blur(${4 * (1 - localProgress)}px)`,
          });
        });
      };

      if (reduceMotion) {
        gsap.set(words, { opacity: 1, filter: "blur(0px)" });
        return;
      }

      applyRevealProgress(0);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: isTouchFlow ? "top 78%" : "10% center",
        end: isTouchFlow ? "bottom 34%" : "73% center",
        invalidateOnRefresh: true,
        fastScrollEnd: false,
        onUpdate: (self) => applyRevealProgress(self.progress),
        onRefresh: (self) => applyRevealProgress(self.progress),
      });

      window.requestAnimationFrame(() => ScrollTrigger.refresh());
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
