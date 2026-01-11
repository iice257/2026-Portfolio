import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Philosophy = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text reveal
      const words = textRef.current.innerText.split(" ");
      textRef.current.innerHTML = words.map(word => `<span class="inline-block opacity-20 transition-opacity duration-300 mr-4">${word}</span>`).join("");

      const spans = textRef.current.querySelectorAll("span");

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * spans.length);
          spans.forEach((span, i) => {
            if (i <= index) {
              span.style.opacity = 1;
              span.style.transform = "translateY(0)";
            } else {
              span.style.opacity = 0.2;
            }
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-48 px-6 md:px-24 bg-paper dark:bg-black min-h-screen flex items-center justify-center">
      <div className="max-w-6xl">
        <p ref={textRef} className="text-display-md md:text-display-xl font-bold tracking-tight leading-[1.1] text-black dark:text-white">
          I believe that code is a medium for art. Minimalism isn&apos;t about absence, but about the extreme focus on the essential. Every interaction is a dialogue, every pixel is a choice. We don&apos;t just build websites; we craft digital atmospheres that command attention and respect.
        </p>
      </div>
    </section>
  );
};

export default Philosophy;
