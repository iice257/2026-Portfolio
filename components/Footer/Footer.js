import { METADATA } from "../../constants";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-ink/5 dark:border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-ink/40 dark:text-ash/40 font-medium">
          © {new Date().getFullYear()} {METADATA.author}.
        </p>

        <div className="flex gap-6">
          <a href="mailto:kingsley.aremu@gmail.com" className="text-sm text-ink/60 dark:text-ash/60 hover:text-ink dark:hover:text-white transition-colors">
            Email
          </a>
          <a href="https://linkedin.com/in/kingsley-aremu" target="_blank" rel="noopener noreferrer" className="text-sm text-ink/60 dark:text-ash/60 hover:text-ink dark:hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com/kingsleyaremu" target="_blank" rel="noopener noreferrer" className="text-sm text-ink/60 dark:text-ash/60 hover:text-ink dark:hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
