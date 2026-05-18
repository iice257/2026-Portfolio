import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current;

      // Text-reading scroll animation - progressive reveal
      words.forEach((word, i) => {
        gsap.fromTo(
          word,
          {
            opacity: 0.15,
            filter: "blur(4px)"
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${10 + (i * 4)}% center`,
              end: `${25 + (i * 4)}% center`,
              scrub: true,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const text = "I believe in building with intention, shipping with precision, and designing for impact.";
  const words = text.split(" ");

  return (
    <section
      ref={sectionRef}
      data-normal-url="true"
      className="relative z-20 -mt-[18vh] md:mt-0 min-h-[220vh] md:min-h-[200vh] flex items-start justify-center pt-[18vh] md:pt-[30vh]"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container text-center sticky top-[18vh] md:top-[30vh]">
        <h2
          className="text-[clamp(3.25rem,16vw,6rem)] md:text-giant font-extralight max-w-5xl mx-auto leading-[1.05] md:leading-[1.2]"
          style={{ color: 'var(--fg-primary)' }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => wordsRef.current[i] = el}
              className="inline-block mr-[0.3em] transition-all duration-100"
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
