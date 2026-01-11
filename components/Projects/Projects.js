import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { PROJECTS, MENULINKS } from "../../constants";

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll(".gallery-item");

      items.forEach((item, index) => {
        const image = item.querySelector(".gallery-image-wrapper");
        const info = item.querySelector(".gallery-info");

        // Parallax Image
        gsap.fromTo(image.querySelector("img"),
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );

        // Sticky/Fade Info
        gsap.fromTo(info,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "cinematic",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              end: "top 40%",
              scrub: 0.5
            }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id={MENULINKS[2].ref} className="py-32 px-4 md:px-12 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">

      {/* Editorial Label */}
      <div className="mb-24 flex justify-between items-end border-b border-black dark:border-white pb-6">
        <h2 className="text-display-lg md:text-kinetic-base tracking-tighter leading-[0.8]">
          SELECTED<br />WORKS
        </h2>
        <span className="text-meta">(001 — 004)</span>
      </div>

      <div className="flex flex-col gap-32 md:gap-48">
        {PROJECTS.map((project, index) => (
          <div
            key={project.name}
            className={`gallery-item flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-24`}
          >
            {/* Image Stage */}
            <div className="gallery-image-wrapper w-full md:w-[60vw] h-[60vh] md:h-[80vh] relative overflow-hidden bg-neutral-300 dark:bg-neutral-800">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            {/* Project Info */}
            <div className="gallery-info flex flex-col justify-end pb-8">
              <span className="text-meta text-neutral-500 mb-4">0{index + 1} / {project.tech[0]}</span>
              <h3 className="text-display-md font-bold tracking-tight mb-4">
                {project.name}
              </h3>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-sm mb-8">
                {project.description}
              </p>
              <a href={project.url} className="text-sm uppercase tracking-widest border-b border-black dark:border-white w-max pb-1">
                View Live
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
