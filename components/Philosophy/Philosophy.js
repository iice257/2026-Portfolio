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
      const applyViewportReveal = () => {
        const viewportHeight = window.innerHeight;
        const transitionStart = viewportHeight * 0.42;
        const transitionEnd = viewportHeight * 0.58;

        words.forEach((word) => {
          const rect = word.getBoundingClientRect();
          const wordCenter = rect.top + (rect.height * 0.5);
          const reveal = Math.min(
            1,
            Math.max(0, (transitionEnd - wordCenter) / (transitionEnd - transitionStart))
          );

          gsap.set(word, {
            opacity: 0.18 + (reveal * 0.82),
            filter: `blur(${4.5 * (1 - reveal)}px)`,
          });
        });
      };

      if (reduceMotion) {
        gsap.set(words, { opacity: 1, filter: "blur(0px)" });
        return;
      }

      applyViewportReveal();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        fastScrollEnd: false,
        onUpdate: applyViewportReveal,
        onRefresh: applyViewportReveal,
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
