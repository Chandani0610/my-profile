// components/Header.jsx
import { useState, useEffect } from "react";
import { Download, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "languages", label: "Languages" },
    { id: "hobbies", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ];

  // Real-time Scroll Spy: Track which section is currently active as user scrolls
  useEffect(() => {
    let isScrollingTimeout;

    const handleScroll = () => {
      // 1. If at the very top of the page, activate Home
      if (window.scrollY < 80) {
        setActiveNav("home");
        return;
      }

      // 2. If scrolled near the bottom of the page, activate Contact
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (window.scrollY + windowHeight >= docHeight - 60) {
        setActiveNav("contact");
        return;
      }

      // 3. Find the section currently in view
      const headerOffset = 140;
      let currentSection = "home";

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            currentSection = item.id;
          }
        }
      }

      setActiveNav(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isScrollingTimeout) clearTimeout(isScrollingTimeout);
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand: Monogram avatar + Name + Role */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3 text-left transition hover:opacity-90 cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full ck-monogram-badge text-sm font-bold text-white shadow-md">
            CK
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
              Chandani Kumari
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Full Stack Developer
            </p>
          </div>
        </button>

        {/* Center Nav Links - Desktop */}
        <ul className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`header-nav-item relative px-3.5 py-1.5 transition-all duration-200 rounded-full cursor-pointer ${
                    isActive
                      ? "header-nav-active font-bold"
                      : "text-slate-600 hover:text-purple-600 hover:bg-slate-50"
                  }`}
                  style={isActive ? {
                    color: "var(--theme-primary, #7c3aed)",
                    backgroundColor: "var(--theme-glow-soft, rgba(124, 58, 237, 0.08))",
                  } : {}}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="header-active-bar absolute bottom-0 left-2.5 right-2.5 h-[2.5px] rounded-full transition-all duration-300"
                      style={{
                        background: "var(--theme-primary, #7c3aed)",
                        boxShadow: "0 2px 8px var(--theme-glow, rgba(124, 58, 237, 0.4))",
                      }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Download Resume Pill Button */}
          <a
            href="/Chandani_Kumari_Resume.pdf"
            download
            className="header-resume-btn flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))",
              boxShadow: "0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))",
            }}
          >
            <Download className="h-4 w-4" />
            <span>Download Resume</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full py-2.5 px-3.5 text-left text-sm rounded-xl font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "font-bold"
                        : "text-slate-700 hover:text-purple-600 hover:bg-slate-50"
                    }`}
                    style={isActive ? {
                      color: "var(--theme-primary, #7c3aed)",
                      backgroundColor: "var(--theme-glow-soft, rgba(124, 58, 237, 0.1))",
                    } : {}}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: "var(--theme-primary, #7c3aed)",
                          boxShadow: "0 0 8px var(--theme-glow, rgba(124, 58, 237, 0.6))",
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href="/Chandani_Kumari_Resume.pdf"
                download
                className="header-resume-btn flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white shadow-md cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))",
                  boxShadow: "0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))",
                }}
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}