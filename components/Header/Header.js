import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-paper/80 dark:bg-void/80 backdrop-blur-md border-b border-ink/5 dark:border-white/5 py-4"
          : "bg-transparent py-6 md:py-8"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink dark:text-white hover:opacity-70 transition-opacity">
          KA.
        </Link>

        <nav className="flex gap-8">
          <Link href="#work" className="text-sm font-medium text-ink/70 dark:text-ash/70 hover:text-ink dark:hover:text-white transition-colors">
            Work
          </Link>
          <Link href="#capabilities" className="text-sm font-medium text-ink/70 dark:text-ash/70 hover:text-ink dark:hover:text-white transition-colors">
            Capabilities
          </Link>
          <Link href="#contact" className="text-sm font-medium text-ink/70 dark:text-ash/70 hover:text-ink dark:hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
