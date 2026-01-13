import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";
import ShuffleText from "../ReactBits/ShuffleText";
import { motion, AnimatePresence } from "framer-motion";

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useLayoutEffect(() => {
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
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const skillCategories = [
    {
      name: "Frontend",
      skills: ["React", "React Native", "TypeScript", "Next.js", "Tailwind CSS"],
      description: "Building responsive, performant user interfaces with modern frameworks and best practices."
    },
    {
      name: "Backend",
      skills: ["Node.js", "PHP / Laravel", "FastAPI", "Python", "Docker"],
      description: "Designing scalable APIs and server-side architecture for robust applications."
    },
    {
      name: "Data",
      skills: ["MySQL", "MongoDB"],
      description: "Managing databases and data structures for efficient storage and retrieval."
    },
    {
      name: "Practices",
      skills: ["Performance Optimization", "Responsive Design", "UI/UX Awareness", "System Maintenance"],
      description: "Applying industry best practices for maintainable, high-quality code."
    }
  ];

  const handleCategoryClick = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[1].ref}
      className="section-spacing-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Large section title */}
        <div className="mb-16 md:mb-24">
          <p
            className="text-micro mb-6"
            style={{ color: 'var(--fg-muted)' }}
          >
            CAPABILITIES
          </p>
          <h2
            ref={titleRef}
            className="text-massive font-extralight"
            style={{ color: 'var(--fg-primary)' }}
          >
            <ShuffleText text="What I do" duration={0.4} shuffleTimes={4} />
          </h2>
        </div>

        {/* Accordion-style skill categories */}
        <div className="space-y-0">
          {skillCategories.map((category, index) => (
            <div key={category.name}>
              {/* Category Header - Clickable */}
              <button
                onClick={() => handleCategoryClick(category.name)}
                className="w-full flex items-center justify-between py-6 group text-left"
                style={{ borderTop: index === 0 ? 'none' : '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-6">
                  <span
                    className="text-micro w-8"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-display-sm font-light group-hover:font-normal transition-all duration-300"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {category.name}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="text-micro"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {category.skills.length} SKILLS
                  </span>
                  <span
                    className={`text-body-lg transition-transform duration-300 ${expandedCategory === category.name ? 'rotate-45' : ''
                      }`}
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    +
                  </span>
                </div>
              </button>

              {/* Expandable Details */}
              <AnimatePresence>
                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="pb-8 pl-14"
                      style={{ backgroundColor: 'var(--bg-primary)' }}
                    >
                      {/* Description */}
                      <p
                        className="text-editorial font-light mb-6 max-w-2xl"
                        style={{ color: 'var(--fg-secondary)' }}
                      >
                        {category.description}
                      </p>

                      {/* Skills - LEFT ALIGNED, flow naturally like text */}
                      <div className="block leading-relaxed">
                        {category.skills.map((skill, i) => (
                          <span key={skill} className="inline-block mr-2 mb-1">
                            <span className="inline-flex items-center">
                              <span
                                className="text-body-md font-bold"
                                style={{ color: 'var(--fg-primary)' }}
                              >
                                {skill}
                              </span>
                              {/* Dot separator always shown unless it's the very last item? 
                                  User said "separated by those dots like they currently are".
                                  Current code showed dot if not last. 
                                  I will keep it inside the inline-flex.
                               */ }
                              {i < category.skills.length - 1 && (
                                <span className="ml-2" style={{ color: 'var(--fg-muted)' }}>•</span>
                              )}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Bottom border */}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
