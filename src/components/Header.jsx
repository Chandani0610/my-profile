import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <header className="glass-nav text-white sticky top-0 z-50 shadow-lg hidden md:block">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
            Chandani<span className="text-yellow-300">.</span>
          </h1>
          <ul className="flex gap-8 text-lg font-medium">
            <li><a href="#about" className="nav-link hover:text-yellow-200 transition">About</a></li>
            <li><a href="#education" className="nav-link hover:text-yellow-200 transition">Education</a></li>
            <li><a href="#skills" className="nav-link hover:text-yellow-200 transition">Skills</a></li>
            <li><a href="#projects" className="nav-link hover:text-yellow-200 transition">Projects</a></li>
            <li><a href="#contact" className="nav-link hover:text-yellow-200 transition">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <header className="glass-nav text-white sticky top-0 z-50 shadow-lg md:hidden">
        <nav className="flex justify-between items-center px-4 py-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
            Chandani<span className="text-yellow-300">.</span>
          </h1>
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="bg-blue-800 py-4 px-6 flex flex-col gap-3 border-t border-blue-700">
            <a href="#about" onClick={closeMenu} className="hover:text-yellow-200 transition py-1">About</a>
            <a href="#education" onClick={closeMenu} className="hover:text-yellow-200 transition py-1">Education</a>
            <a href="#skills" onClick={closeMenu} className="hover:text-yellow-200 transition py-1">Skills</a>
            <a href="#projects" onClick={closeMenu} className="hover:text-yellow-200 transition py-1">Projects</a>
            <a href="#contact" onClick={closeMenu} className="hover:text-yellow-200 transition py-1">Contact</a>
          </div>
        )}
      </header>
    </>
  );
}

