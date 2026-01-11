import Profiles from "../Profiles/Profiles";
import { METADATA } from "../../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="section-container py-16"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left column */}
          <div>
            <p
              className="text-body-lg mb-4"
              style={{ color: 'var(--fg-primary)' }}
            >
              {METADATA.author}
            </p>
            <p
              className="text-body-md mb-6"
              style={{ color: 'var(--fg-muted)' }}
            >
              Full-Stack Developer based in Lagos, Nigeria.
              <br />
              Building products that matter.
            </p>
            <Profiles />
          </div>

          {/* Right column */}
          <div className="md:text-right">
            <p
              className="text-body-sm mb-4"
              style={{ color: 'var(--fg-muted)' }}
            >
              Currently available for new opportunities
            </p>
            <a
              href="mailto:kingsley.aremu@gmail.com"
              className="text-body-md link-underline"
              style={{ color: 'var(--fg-primary)' }}
            >
              kingsley.aremu@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="text-body-sm"
            style={{ color: 'var(--fg-muted)' }}
          >
            © {currentYear} {METADATA.author}
          </p>
          <p
            className="text-body-sm"
            style={{ color: 'var(--fg-muted)' }}
          >
            Designed & built with intention
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
