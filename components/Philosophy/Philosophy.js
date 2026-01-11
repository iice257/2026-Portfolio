import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current.querySelectorAll(".word");

      // Pinned section with word-by-word reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        }
      });

      tl.fromTo(
        words,
        {
          opacity: 0.15,
          y: 10
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const text = "I build software that feels inevitable — clean interfaces, fast experiences, and systems that scale. Every line of code is a decision. I make the ones that matter.";
  const words = text.split(" ");

  return (
    <section
      ref={sectionRef}
      className="section-spacing-lg section-container"
    >
      <div className="max-w-4xl mx-auto">
        <p
          ref={textRef}
          className="text-display-md md:text-display-lg font-light leading-snug tracking-tight"
          style={{ color: 'var(--fg-primary)' }}
        >
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Philosophy;
