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
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

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
          trigger: isMobile ? headingRef.current : sectionRef.current,
          start: isMobile ? "top 82%" : "10% center",
          end: isMobile ? "bottom 24%" : "73% center",
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
      className="relative z-20 min-h-[120svh] md:min-h-[200vh] flex items-start justify-center pt-[22svh] pb-[28svh] md:pt-[30vh] md:pb-0"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container text-center md:sticky md:top-[30vh]">
        <h2
          ref={headingRef}
          className="text-[clamp(3.6rem,15vw,5.1rem)] md:text-giant font-extralight max-w-[calc(100vw-2rem)] md:max-w-5xl mx-auto leading-[1.01] md:leading-[1.2]"
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
