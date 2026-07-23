import { useEffect } from "react";
import resumeData from "../data/resumeData";

export default function Resume() {
  useEffect(() => {
    // Re-apply any necessary effects after component mounts
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (nav && window.scrollY > 50) {
        nav.style.background = "rgba(219, 234, 254, 0.95)";
      } else if (nav) {
        nav.style.background = "rgba(219, 234, 254, 0.9)";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav id="desktop-nav">
        <div className="logo">Chandani<span>.</span></div>
        <div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Tech Stack</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hamburger Navigation */}
      <nav id="hamburger-nav">
        <div className="logo">Chandani<span>.</span></div>
        <div className="hamburger-menu">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links">
            <li><a href="#about" onClick={toggleMenu}>About</a></li>
            <li><a href="#experience" onClick={toggleMenu}>Tech Stack</a></li>
            <li><a href="#projects" onClick={toggleMenu}>Projects</a></li>
            <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
          </div>
        </div>
      </nav>

      {/* PROFILE SECTION */}
      <section id="profile">
        <div className="section__pic-container">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%233b82f6'/%3E%3Ctext x='50' y='67' text-anchor='middle' fill='white' font-size='40' dy='.3em'%3ECK%3C/text%3E%3C/svg%3E"
            alt="Chandani profile"
          />
        </div>
        <div className="section__text">
          <p className="section__text__p1">Hello, I'm</p>
          <h1 className="title">{resumeData.name}</h1>
          <p className="section__text__p2">{resumeData.role}</p>
          <div className="btn-container">
            <button className="btn btn-color-2" onClick={() => alert('📄 Resume preview: Chandani Kumari - Frontend Developer')}>
              Download CV
            </button>
            <button className="btn btn-color-1" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact Info
            </button>
          </div>
          <div id="socials-container">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231e4a8a'%3E%3Cpath d='M22.23 0H1.77C0.79 0 0 0.78 0 1.77v20.46C0 23.22 0.79 24 1.77 24h20.46c0.98 0 1.77-0.78 1.77-1.77V1.77C24 0.78 23.21 0 22.23 0zM7.08 20.31H3.55V8.97h3.53v11.34zM5.31 7.48c-1.13 0-2.05-0.92-2.05-2.05s0.92-2.05 2.05-2.05 2.05 0.92 2.05 2.05-0.92 2.05-2.05 2.05zM20.31 20.31h-3.53v-5.65c0-1.35-0.48-2.28-1.68-2.28-0.92 0-1.46 0.62-1.7 1.22-0.09 0.21-0.11 0.51-0.11 0.81v5.9h-3.53V8.97h3.53v1.56c0.47-0.73 1.31-1.77 3.19-1.77 2.33 0 4.08 1.52 4.08 4.79v6.76z'/%3E%3C/svg%3E"
              alt="LinkedIn"
              className="icon"
              onClick={() => window.open('https://linkedin.com')}
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231e4a8a'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22 0.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
              alt="GitHub"
              className="icon"
              onClick={() => window.open('https://github.com')}
            />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>Get To Know More</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>About Section</h1>
      </section>
      <section className="about-subsection">
        <div className="line-item">
          <div className="line-label"><span>📖</span> About Me</div>
          <div className="line-content">{resumeData.about}</div>
        </div>
      </section>
      {/* EDUCATION SECTION */}

      <section id="education">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>My Background</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>Education & More</h1>
      </section>

      <section className="education-subsection">
        <div className="line-item">
          <div className="line-label"><span>🎓</span> Education</div>
          <div className="line-content">
            <strong>B-Tech</strong> (IES College of Technology) — CGPA: 8.30 &nbsp;|&nbsp;
            <strong> 12th </strong> (JN College Madhubani,Bihar) — 71.2% &nbsp;|&nbsp;
            <strong>10th</strong> (Bilat Singh Girls school Khajauli , Madhubani,Bihar) — 71.4%
          </div>
        </div>
      </section>
      {/*Certifications*/}
      <section>
        <div className="line-item">
          <div className="line-label"><span>🏅</span> Certifications</div>
          <div className="line-content">
            {resumeData.certifications.map((cert, idx) => (
              <span key={idx}>✔️ {cert} &nbsp;</span>
            ))}
          </div>
        </div>
      </section>
      {/* HOBBIES  */}
      <section id="hobbies">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>Beyond Coding</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>  Hobbies & Languages</h1>
        <div className="line-item">
          <div className="line-label"><span>🎨</span> Hobbies</div>
          <div className="line-content">
            {resumeData.hobbies.map((hobby, idx) => (
              <span key={idx}>{idx === 0 ? "🎨" : idx === 1 ? "🎧" : "🧩"} {hobby} &nbsp;</span>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages">
        <div className="line-item">
          <div className="line-label"><span>🌐</span> Languages</div>
          <div className="line-content">
            {resumeData.languages.map((lang, idx) => (
              <span key={idx}>{lang.flag} {lang.name} ({lang.level}) &nbsp;</span>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section id="experience">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>Explore My</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>Tech Stack</h1>
      </section>
      <section className="skills-subsection">
        <div className="line-item">
          <div className="line-label"><span>⚙️</span> Frontend</div>
          <div className="line-content">
            {resumeData.skills.frontend.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="skills-subsection">
        <div className="line-item">
          <div className="line-label"><span>🗄️</span> Backend & DB</div>
          <div className="line-content">
            {resumeData.skills.backend.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="skills-subsection">
        <div className="line-item">
          <div className="line-label"><span>🧠</span> DSA & Tools</div>
          <div className="line-content">
            {resumeData.skills.tools.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>Browse My Recent</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>Projects</h1>
      </section>
      <section className="projects-subsection">
        {resumeData.projects.map((project, idx) => (
          <div className="line-item" key={idx}>
            <div className="line-label"><span>{project.icon}</span> {project.title}</div>
            <div className="line-content">
              <span className="project-inline">{project.tech}</span>
              <div className="btn-container" style={{ margin: 0, gap: "0.5rem" }}>
                <button 
                  className="btn btn-color-2 project-btn" 
                  style={{ padding: "0.3rem 1rem", fontSize: "0.8rem" }}
                  onClick={() => window.open(project.github)}
                >
                  GitHub
                </button>
                <button 
                  className="btn btn-color-2 project-btn" 
                  style={{ padding: "0.3rem 1rem", fontSize: "0.8rem" }}
                  onClick={() => alert(`${project.title} - Live demo preview`)}
                >
                  Live Demo
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact">
        <p className="section__text__p1" style={{ backgroundColor: "white" }}>Get in Touch</p>
        <h1 className="title" style={{ backgroundColor: "white" }}>Contact Me</h1>
      </section>

      <section className="contact-subsection">
        <div className="contact-row">
          <div className="contact-info-container" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231e4a8a' viewBox='0 0 24 24' width='28' height='28'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E"
              className="icon contact-icon"
              alt="email"
              style={{ height: "1.8rem" }}
            />
            <p><a href={`mailto:${resumeData.contact.email}`} style={{ color: "#1e4a8a", textDecoration: "none" }}>{resumeData.contact.email}</a></p>
          </div>
          <div className="contact-info-container" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231e4a8a' viewBox='0 0 24 24' width='28' height='28'%3E%3Cpath d='M22.23 0H1.77C0.79 0 0 0.78 0 1.77v20.46C0 23.22 0.79 24 1.77 24h20.46c0.98 0 1.77-0.78 1.77-1.77V1.77C24 0.78 23.21 0 22.23 0zM7.08 20.31H3.55V8.97h3.53v11.34zM5.31 7.48c-1.13 0-2.05-0.92-2.05-2.05s0.92-2.05 2.05-2.05 2.05 0.92 2.05 2.05-0.92 2.05-2.05 2.05zM20.31 20.31h-3.53v-5.65c0-1.35-0.48-2.28-1.68-2.28-0.92 0-1.46 0.62-1.7 1.22-0.09 0.21-0.11 0.51-0.11 0.81v5.9h-3.53V8.97h3.53v1.56c0.47-0.73 1.31-1.77 3.19-1.77 2.33 0 4.08 1.52 4.08 4.79v6.76z'/%3E%3C/svg%3E"
              className="icon contact-icon"
              alt="linkedin"
              style={{ height: "1.8rem" }}
            />
            <p><a href={resumeData.contact.linkedin} style={{ color: "#1e4a8a", textDecoration: "none" }}>LinkedIn</a></p>
          </div>
          <div className="contact-info-container" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231e4a8a' viewBox='0 0 24 24' width='28' height='28'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E"
              className="icon contact-icon"
              alt="location"
              style={{ height: "1.8rem" }}
            />
            <p>{resumeData.contact.location}</p>
          </div>
          <div className="contact-info-container" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231e4a8a' viewBox='0 0 24 24' width='28' height='28'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E"
              className="icon contact-icon"
              alt="phone"
              style={{ height: "1.8rem" }}
            />
            <p>{resumeData.contact.phone}</p>
          </div>
        </div>
      </section>

      <footer>
        <nav>
          <div className="nav-links-container">
            <ul className="nav-links">
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Tech Stack</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>
        <p>2026 Chandani Kumari. All Rights Reserved.</p>
      </footer>
    </>
  );
}

// Helper function for mobile menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (menu && icon) {
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }
}