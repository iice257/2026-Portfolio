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

        gsap.set(item, { pointerEvents: "none" });

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
              toggleActions: "play none none none",
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
              toggleActions: "play none none none",
            },
            onComplete: () => {
              gsap.set(item, { pointerEvents: "auto" });
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
      period: "JUN 2025 - DEC 2025",
      summary:
        "Built responsive frontend experiences for W3Pets, focusing on clean UI implementation, reusable components, polished user flows, and frontend performance.",
      details: [
        "Developed frontend interfaces with attention to layout, responsiveness, and interaction quality.",
        "Translated product requirements into clean, reusable UI components.",
        "Improved visual consistency across pages, components, and user journeys.",
        "Worked across layout structure, state handling, styling, and frontend refinement.",
      ],
      stack: ["React", "JavaScript", "CSS", "Responsive UI", "Component Systems"],
    },
    {
      company: "Ice Design Studio",
      role: "Freelance Web Designer",
      period: "FEB 2019 - PRESENT",
      summary:
        "Designed and built custom websites for clients, from concept to delivery, with focus on modern interfaces, responsive layouts, and practical business websites.",
      details: [
        "Built client websites across portfolio, business, landing page, and service-based use cases.",
        "Managed multiple concurrent projects, including design direction, revisions, and delivery.",
        "Created responsive interfaces optimized for mobile, desktop, clarity, and conversion.",
        "Helped clients turn rough ideas into structured, usable web experiences.",
      ],
      stack: ["React", "HTML", "CSS", "JavaScript", "UI Design", "Client Delivery"],
    },
    {
      company: "GamblePause",
      role: "Web Developer",
      period: "MAY 2024 - SEPT 2024",
      summary:
        "Helped build and maintain the first version of the GamblePause website, supporting the early web presence and refining the frontend experience after launch.",
      details: [
        "Contributed to the first public version of the website.",
        "Helped implement and refine key frontend pages and content sections.",
        "Maintained the site after launch with updates, fixes, and layout improvements.",
        "Balanced speed, clarity, and maintainability during early-stage delivery.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Responsive Design", "Website Maintenance"],
    },
    {
      company: "REDACTED",
      role: "IT Attendant",
      period: "REDACTED - REDACTED",
      location: "REDACTED",
      redacted: true,
      summary:
        "Provided IT support in a disciplined operational environment, assisting with endpoint support, system access, troubleshooting, and day-to-day technical issue resolution.",
      details: [
        "Supported users with technical issues across devices, access, and workplace systems.",
        "Assisted with hardware, software, and basic network-related troubleshooting.",
        "Worked in an operations-focused environment where reliability, documentation, and response time mattered.",
        "Built practical experience across support workflows, escalation, and IT service delivery.",
      ],
      stack: [
        "IT Support",
        "Troubleshooting",
        "Hardware Support",
        "Software Support",
        "User Support",
        "Operations",
      ],
    },
  ];

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
            className="text-[clamp(3.5rem,7.75vw,7.65rem)] leading-[1.08] font-extralight pb-[0.16em]"
            style={{ color: "var(--fg-primary)" }}
          >
            <ShuffleText text="Where I've worked" duration={0.6} shuffleTimes={4} />
          </h2>
        </div>

        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <article key={`${exp.role}-${i}`} className="work-item" onMouseEnter={() => setOpenExperience(i)}>
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
                        {exp.redacted ? <span className="redacted-text">REDACTED</span> : exp.company}
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
                          {exp.summary}
                        </p>
                        {exp.location && (
                          <p className="text-micro mt-5" style={{ color: "var(--fg-muted)" }}>
                            Location: <span className="redacted-text">REDACTED</span>
                          </p>
                        )}
                        <ul className="mt-6 space-y-3 max-w-3xl">
                          {exp.details.map((detail) => (
                            <li key={detail} className="flex gap-4 text-body-md" style={{ color: "var(--fg-secondary)" }}>
                              <span className="mt-[0.75em] h-px w-5 shrink-0" style={{ backgroundColor: "var(--border)" }} />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-micro mt-7 max-w-3xl" style={{ color: "var(--fg-muted)" }}>
                          {exp.stack.join(" · ")}
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

        <p
          className="text-micro py-6 border-b"
          style={{ color: "var(--fg-muted)", borderColor: "var(--border)" }}
        >
          5+ years building for the web · Multiple client websites shipped · Frontend, UI, and IT systems experience · Applied AI/ML learning in progress
        </p>

        <div className="pt-10 max-w-4xl">
          <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
            AI & Machine Learning Practice
          </p>
          <p className="text-body-lg font-light leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Currently building deeper machine learning foundations through Deep Learning with Python, neural network fundamentals, and applied exploration of modern AI systems. Focused on understanding how models learn, how they are evaluated, and how AI can be integrated into real products with strong UX and reliable systems thinking.
          </p>
          <p className="text-micro mt-5" style={{ color: "var(--fg-muted)" }}>
            Deep Learning · Neural Networks · LLMs · AI Agents · Model Evaluation · Product UX
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
