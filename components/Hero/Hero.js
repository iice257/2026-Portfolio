import { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current.children,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
    >
      <div ref={textRef} className="flex flex-col gap-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black dark:text-white leading-[1.05]">
          Kingsley Aremu.
        </h1>
        <p className="text-xl md:text-2xl text-ink/80 dark:text-ash/80 max-w-2xl font-light leading-relaxed">
          Full-Stack Engineer crafting digital experiences with purpose, precision, and minimal aesthetics.
        </p>
        <div className="pt-8">
          <span className="inline-block px-4 py-2 border border-ink/10 dark:border-ash/20 rounded-full text-sm uppercase tracking-widest font-medium">
            Available for work
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
