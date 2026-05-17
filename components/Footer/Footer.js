import Link from "next/link";
import { CONTACT_LINKS, MENULINKS, METADATA } from "../../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navLinks = MENULINKS.filter((link) => link.ref !== "home");

  return (
    <footer
      className="relative overflow-hidden pt-20 md:pt-28 pb-8"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--fg-primary), transparent)" }}
      />

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
              Available for selected builds
            </p>
            <h2
              className="text-display-lg md:text-display-xl font-light leading-none max-w-4xl"
              style={{ color: "var(--fg-primary)" }}
            >
              Let&apos;s ship something useful.
            </h2>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <nav aria-label="Footer navigation">
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                Index
              </p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.ref}>
                    <Link
                      href={`/#${link.ref}`}
                      className="text-body-lg link-underline"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                Direct
              </p>
              <ul className="space-y-3">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="text-body-lg link-underline"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 py-10 md:py-14 border-y" style={{ borderColor: "var(--border)" }}>
          <p
            className="font-extralight uppercase leading-none select-none"
            style={{
              color: "var(--fg-primary)",
              fontSize: "clamp(3rem, 6rem, 7rem)",
              letterSpacing: 0,
            }}
          >
            Kingsley Aremu
          </p>
        </div>

        <div className="pt-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-body-sm" style={{ color: "var(--fg-muted)" }}>
            &copy; {currentYear} {METADATA.author}
          </p>
          <p className="text-body-sm" style={{ color: "var(--fg-muted)" }}>
            Full-Stack Developer based in {METADATA.location}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
