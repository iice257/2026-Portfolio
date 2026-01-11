import { useState, useEffect } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { MENULINKS } from "../../constants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-between items-start mix-blend-difference text-white">
        {/* Logo - Top Left */}
        <a href="#home" className="text-sm font-bold tracking-widest uppercase">
          KA — 26
        </a>

        {/* Menu Trigger - Top Right */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-sm font-bold tracking-widest uppercase group overflow-hidden relative"
          >
            <span className="block group-hover:-translate-y-full transition-transform duration-500 ease-cinematic">
              Menu
            </span>
            <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-cinematic">
              Open
            </span>
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 bg-neutral-900 z-[60] transition-transform duration-700 ease-cinematic ${isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="absolute top-8 right-8">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white text-sm font-bold tracking-widest uppercase"
          >
            Close
          </button>
        </div>

        <nav className="h-full flex flex-col justify-center px-12 md:px-24">
          <ul className="flex flex-col gap-4">
            {MENULINKS.map((link, i) => (
              <li key={link.ref} className="overflow-hidden">
                <a
                  href={`#${link.ref}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-display-lg md:text-kinetic-base font-bold text-neutral-400 hover:text-white transition-colors duration-300 tracking-tighter"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
