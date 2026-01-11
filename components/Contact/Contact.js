import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";

const Contact = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
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
          }
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
          style={{ color: 'var(--fg-muted)' }}
        >
          Get in Touch
        </p>

        <h2
          className="text-display-lg md:text-display-xl font-light mb-8 contact-reveal"
          style={{ color: 'var(--fg-primary)' }}
        >
          Let&apos;s build something together
        </h2>

        <p
          className="text-body-xl mb-12 contact-reveal"
          style={{ color: 'var(--fg-secondary)' }}
        >
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        <a
          href="mailto:kingsley.aremu@gmail.com"
          className="btn btn-primary contact-reveal"
        >
          Send an Email
        </a>

        <p
          className="text-body-sm mt-8 contact-reveal"
          style={{ color: 'var(--fg-muted)' }}
        >
          or reach out on{" "}
          <a
            href="https://linkedin.com/in/kingsley-aremu"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
            style={{ color: 'var(--fg-primary)' }}
          >
            LinkedIn
          </a>
          {" "}·{" "}
          <a
            href="tel:+2348168367367"
            className="link-underline"
            style={{ color: 'var(--fg-primary)' }}
          >
            +234-816-836-7367
          </a>
        </p>
      </div>
    </section>
  );
};

export default Contact;
