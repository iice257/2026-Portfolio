import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";
import ShuffleText from "../ReactBits/ShuffleText";
import { AnimatePresence, motion } from "framer-motion";

const Work = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [openExperience, setOpenExperience] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.5,
          },
        }
      );

      const items = sectionRef.current.querySelectorAll(".work-item");
      items.forEach((item) => {
        const line = item.querySelector(".work-line");
        const content = item.querySelector(".work-content");

        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          content,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const experiences = [
    {
      company: "W3Pets",
      role: "Frontend Developer",
      period: "Jun 2025 - Present",
      description:
        "Building responsive, user-friendly interfaces with modern frameworks. Optimizing performance and collaborating with cross-functional teams.",
    },
    {
      company: "Nestle",
      role: "IT Attendant",
      period: "Feb 2025 - Present",
      description:
        "IT support, system maintenance, and infrastructure optimization. Training staff on software and IT best practices.",
      hidden: true,
    },
    {
      company: "Ice Design Studio",
      role: "Freelance Web Designer",
      period: "Feb 2019 - Present",
      description:
        "Delivering custom websites for clients. Designing responsive, modern interfaces and managing multiple concurrent projects.",
    },
  ];

  const visibleExperiences = experiences.filter((experience) => !experience.hidden);

  const toggleExperience = (index) => {
    setOpenExperience((current) => (current === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[3].ref}
      className="section-spacing-lg"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <div className="mb-16 md:mb-24 text-left">
          <p className="text-micro mb-6" style={{ color: "var(--fg-muted)" }}>
            EXPERIENCE
          </p>
          <h2
            ref={titleRef}
            className="text-[clamp(4rem,8.35vw,8.25rem)] leading-[0.95] font-extralight"
            style={{ color: "var(--fg-primary)" }}
          >
            <ShuffleText text="Where I've worked" duration={0.6} shuffleTimes={4} />
          </h2>
        </div>

        <div className="space-y-0">
          {visibleExperiences.map((exp, i) => (
            <article key={exp.company} className="work-item" onMouseEnter={() => setOpenExperience(i)}>
              <div className="work-line h-px w-full" style={{ backgroundColor: "var(--border)" }} />

              <div className="work-content">
                <button
                  type="button"
                  aria-expanded={openExperience === i}
                  aria-controls={`work-panel-${i}`}
                  onClick={() => toggleExperience(i)}
                  onFocus={() => setOpenExperience(i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span className="text-micro w-8 shrink-0" style={{ color: "var(--fg-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="text-display-sm font-light group-hover:font-black transition-all duration-300"
                        style={{ color: "var(--fg-primary)" }}
                      >
                        {exp.role}
                      </h3>
                      <span className="text-body-md" style={{ color: "var(--fg-secondary)" }}>
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:block text-micro" style={{ color: "var(--fg-muted)" }}>
                      {exp.period}
                    </span>
                    <span
                      className={`text-body-lg leading-none transition-transform duration-300 ${
                        openExperience === i ? "rotate-45" : ""
                      }`}
                      style={{ color: "var(--fg-primary)" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openExperience === i && (
                    <motion.div
                      id={`work-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="pb-8 pl-14">
                        <p
                          className="text-editorial font-light leading-relaxed max-w-3xl"
                          style={{ color: "var(--fg-secondary)" }}
                        >
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </article>
          ))}

          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
};

export default Work;
