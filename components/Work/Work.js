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
      // Title animation with clip path reveal
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
          }
        }
      );

      // Each work item reveals with different timing
      const items = sectionRef.current.querySelectorAll(".work-item");
      items.forEach((item, i) => {
        const line = item.querySelector(".work-line");
        const content = item.querySelector(".work-content");

        // Line grows from left
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
            }
          }
        );

        // Content fades up
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
            }
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
      period: "Jun 2025 — Present",
      description: "Building responsive, user-friendly interfaces with modern frameworks. Optimizing performance and collaborating with cross-functional teams."
    },
    {
      company: "Nestlé",
      role: "IT Attendant",
      period: "Feb 2025 — Present",
      description: "IT support, system maintenance, and infrastructure optimization. Training staff on software and IT best practices."
    },
    {
      company: "Ice Design Studio",
      role: "Freelance Web Designer",
      period: "Feb 2019 — Present",
      description: "Delivering custom websites for clients. Designing responsive, modern interfaces and managing multiple concurrent projects."
    }
  ];

  const toggleExperience = (index) => {
    setOpenExperience((current) => (current === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[3].ref}
      className="section-spacing-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16 md:py-32">
          <p
            className="text-micro mb-6"
            style={{ color: 'var(--fg-muted)' }}
          >
            EXPERIENCE
          </p>
          <h2
            ref={titleRef}
            className="text-massive font-extralight"
            style={{ color: 'var(--fg-primary)', whiteSpace: 'nowrap' }}
          >
            <ShuffleText text="Where I've worked" duration={0.6} shuffleTimes={4} />
          </h2>
        </div>

        {/* Experience list */}
        <div className="max-w-4xl">
          {experiences.map((exp, i) => (
            <article
              key={exp.company}
              className={`work-item mb-10 last:mb-0 ${exp.company === "NestlÃ©" ? "hidden" : ""}`}
              onMouseEnter={() => setOpenExperience(i)}
            >
              {/* Top line */}
              <div
                className="work-line h-px w-full mb-0"
                style={{ backgroundColor: 'var(--border)' }}
              />

              <div className="work-content">
                <button
                  type="button"
                  aria-expanded={openExperience === i}
                  aria-controls={`work-panel-${i}`}
                  onClick={() => toggleExperience(i)}
                  onFocus={() => setOpenExperience(i)}
                  className="w-full grid md:grid-cols-12 gap-6 md:gap-12 py-8 text-left group"
                >
                  <div className="md:col-span-3">
                    <p
                      className="text-body-sm font-medium"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {exp.period}
                    </p>
                  </div>

                  <div className="md:col-span-9">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                      <div>
                        <h3
                          className="text-body-xl font-medium transition-opacity duration-300 group-hover:opacity-75"
                          style={{ color: 'var(--fg-primary)' }}
                        >
                          {exp.role}
                        </h3>
                        <span
                          className="text-body-md"
                          style={{ color: 'var(--fg-secondary)' }}
                        >
                          {exp.company}
                        </span>
                      </div>

                      <span
                        className={`text-body-xl leading-none transition-transform duration-300 ${openExperience === i ? 'rotate-45' : ''
                          }`}
                        style={{ color: 'var(--fg-primary)' }}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openExperience === i && (
                    <motion.div
                      id={`work-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="grid md:grid-cols-12 gap-6 md:gap-12 pb-10">
                        <div className="hidden md:block md:col-span-3" />
                        <div className="md:col-span-9">
                          <p
                            className="text-editorial font-light leading-relaxed"
                            style={{ color: 'var(--fg-muted)' }}
                          >
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
