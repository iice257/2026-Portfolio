import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CONTACT_LINKS, MENULINKS } from "../../constants";

const Contact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current.querySelectorAll(".contact-reveal");

      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[4].ref}
      className="section-spacing-lg section-container"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-caption uppercase tracking-widest mb-4 contact-reveal"
          style={{ color: "var(--fg-muted)" }}
        >
          Get in Touch
        </p>

        <h2
          className="text-display-lg md:text-display-xl font-light mb-8 contact-reveal"
          style={{ color: "var(--fg-primary)" }}
        >
          <span className="block">We&apos;re gonna build amazing things,</span>
          <span className="block">together.</span>
        </h2>

        <p
          className="text-body-xl mb-12 contact-reveal"
          style={{ color: "var(--fg-secondary)" }}
        >
          I&apos;m always open. Really.
        </p>

        <a href={CONTACT_LINKS[0].url} className="btn btn-primary contact-reveal">
          Send an Email
        </a>

        <p
          className="text-body-sm mt-8 contact-reveal"
          style={{ color: "var(--fg-muted)" }}
        >
          or reach out on{" "}
          {CONTACT_LINKS.slice(1).map((link, index) => (
            <span key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
                style={{ color: "var(--fg-primary)" }}
              >
                {link.label}
              </a>
              {index < CONTACT_LINKS.length - 2 ? " / " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Contact;
