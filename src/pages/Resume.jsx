import { useEffect } from "react";
import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Resume() {
  // Safely use theme with fallback
  let themeColors;
  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    themeColors = {
      primary: '#08bde0',
      primaryDark: '#07a8c9',
      primaryLight: '#e8f4f8',
      accent: '#48e39a',
      accentDark: '#32d789',
      text: '#10243e',
      textSecondary: '#7c8997',
      border: '#e9eef2',
      cardBg: '#ffffff',
      cardBorder: '#e7edf1',
      background: '#f8fafb',
      sectionBg: '#ffffff',
      shadow: 'rgba(16,36,62,0.08)',
      shadowHover: 'rgba(16,36,62,0.12)',
      gradient: 'linear-gradient(135deg, #08bde0, #07a8c9)',
    };
  }

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (nav && window.scrollY > 50) {
        nav.style.background = `${themeColors.cardBg}DD`;
      } else if (nav) {
        nav.style.background = `${themeColors.cardBg}CC`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [themeColors.cardBg]);

  return (
    <>
      <style>{`
        /* ===== RESUME STYLES ===== */
        .resume-section {
          padding: 80px 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .resume-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: ${themeColors.text}DD;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }
        .resume-subtitle {
          color: ${themeColors.primary}CC;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .resume-card {
          background: ${themeColors.cardBg};
          border: 1px solid ${themeColors.border};
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px ${themeColors.shadow};
        }
        .resume-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px ${themeColors.shadowHover};
          border-color: ${themeColors.primary}50;
        }
        .resume-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${themeColors.text}DD;
          margin-bottom: 12px;
        }
        .resume-label span {
          font-size: 1.4rem;
        }
        .resume-content {
          color: ${themeColors.textSecondary}BB;
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .resume-badge {
          display: inline-block;
          background: ${themeColors.primary}15;
          color: ${themeColors.primary}CC;
          border: 1px solid ${themeColors.primary}30;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 0.8rem;
          font-weight: 500;
          margin: 3px 4px 3px 0;
          transition: all 0.2s ease;
        }
        .resume-badge:hover {
          background: ${themeColors.primary}25;
          transform: scale(1.05);
        }
        .resume-btn {
          background: ${themeColors.primary};
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px ${themeColors.primary}30;
        }
        .resume-btn:hover {
          background: ${themeColors.primaryDark};
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${themeColors.primary}40;
        }
        .resume-btn-outline {
          background: transparent;
          color: ${themeColors.primary}CC;
          border: 2px solid ${themeColors.primary}40;
          padding: 8px 22px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .resume-btn-outline:hover {
          background: ${themeColors.primary};
          color: white;
          transform: translateY(-2px);
          border-color: ${themeColors.primary};
        }
        .resume-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .resume-grid {
            grid-template-columns: 1fr;
          }
          .resume-title {
            font-size: 2rem;
          }
        }
        .resume-social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${themeColors.primary}10;
          border: 1px solid ${themeColors.primary}20;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 1.2rem;
          color: ${themeColors.textSecondary}BB;
        }
        .resume-social-icon:hover {
          background: ${themeColors.primary}20;
          transform: translateY(-3px);
          color: ${themeColors.primary}CC;
          border-color: ${themeColors.primary}40;
        }
        .resume-container {
          background: ${themeColors.background};
          color: ${themeColors.text};
        }
      `}</style>

      <div className="resume-container">
        {/* ===== PROFILE SECTION ===== */}
        <section id="profile" className="resume-section" style={{ paddingTop: '120px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                fontWeight: '700',
                color: 'white',
                boxShadow: `0 20px 60px ${themeColors.primary}30`
              }}>
                {resumeData.name?.split(' ').map(n => n[0]).join('') || 'CK'}
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: `${themeColors.textSecondary}BB`, fontSize: '1.1rem' }}>Hello, I'm</p>
              <h1 className="resume-title">{resumeData.name}</h1>
              <p style={{ color: `${themeColors.primary}CC`, fontSize: '1.2rem', fontWeight: 500 }}>{resumeData.role || 'Frontend Developer'}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button className="resume-btn" onClick={() => alert('📄 Resume preview: ' + resumeData.name)}>
                  Download CV
                </button>
                <button className="resume-btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Contact Info
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="resume-social-icon">
                  💼
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="resume-social-icon">
                  🔗
                </a>
                <a href={`mailto:${resumeData.contact.email}`} className="resume-social-icon">
                  📧
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section id="about" className="resume-section">
          <p className="resume-subtitle">Get To Know More</p>
          <h2 className="resume-title">About Me</h2>
          <div className="resume-card">
            <div className="resume-label"><span>📖</span> About Me</div>
            <div className="resume-content">{resumeData.about}</div>
          </div>
        </section>

        {/* ===== EDUCATION SECTION ===== */}
        <section id="education" className="resume-section">
          <p className="resume-subtitle">My Background</p>
          <h2 className="resume-title">Education & More</h2>
          <div className="resume-card">
            <div className="resume-label"><span>🎓</span> Education</div>
            <div className="resume-content">
              {resumeData.education.map((item, idx) => (
                <div key={idx} style={{ marginBottom: idx < resumeData.education.length - 1 ? '12px' : '0' }}>
                  <strong style={{ color: `${themeColors.text}DD` }}>{item.degree}</strong>
                  <span style={{ color: `${themeColors.textSecondary}BB` }}> — {item.college}</span>
                  <br />
                  <span style={{ color: `${themeColors.primary}CC`, fontSize: '0.9rem' }}>{item.marks}</span>
                  <span style={{ color: `${themeColors.textSecondary}BB`, fontSize: '0.85rem', marginLeft: '8px' }}>| {item.year}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CERTIFICATIONS ===== */}
        <section className="resume-section" style={{ paddingTop: '0' }}>
          <div className="resume-card">
            <div className="resume-label"><span>🏅</span> Certifications</div>
            <div className="resume-content">
              {resumeData.certifications.map((cert, idx) => (
                <span key={idx} className="resume-badge">✔ {cert}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOBBIES ===== */}
        <section id="hobbies" className="resume-section" style={{ paddingTop: '0' }}>
          <div className="resume-card">
            <div className="resume-label"><span>🎨</span> Hobbies</div>
            <div className="resume-content">
              {resumeData.hobbies.map((hobby, idx) => (
                <span key={idx} className="resume-badge">
                  {['🎨', '🎧', '🧩'][idx % 3]} {hobby}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LANGUAGES ===== */}
        <section id="languages" className="resume-section" style={{ paddingTop: '0' }}>
          <div className="resume-card">
            <div className="resume-label"><span>🌐</span> Languages</div>
            <div className="resume-content">
              {resumeData.languages.map((lang, idx) => (
                <span key={idx} className="resume-badge">
                  {lang.flag} {lang.name} ({lang.level})
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TECH STACK ===== */}
        <section id="experience" className="resume-section">
          <p className="resume-subtitle">Explore My</p>
          <h2 className="resume-title">Tech Stack</h2>
          <div className="resume-grid">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div key={category} className="resume-card" style={{ marginBottom: '0' }}>
                <div className="resume-label">
                  <span>
                    {category === 'languages' && '💻'}
                    {category === 'frontend' && '🎨'}
                    {category === 'backend' && '⚙️'}
                    {category === 'database' && '🗄️'}
                    {category === 'tools' && '🛠️'}
                    {category === 'coreSubjects' && '📚'}
                  </span>
                  {category === 'coreSubjects' ? 'Core Subjects' : category}
                </div>
                <div className="resume-content">
                  {items.map((skill, idx) => (
                    <span key={idx} className="resume-badge">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PROJECTS ===== */}
        <section id="projects" className="resume-section">
          <p className="resume-subtitle">Browse My Recent</p>
          <h2 className="resume-title">Projects</h2>
          {resumeData.projects.map((project, idx) => (
            <div key={idx} className="resume-card">
              <div className="resume-label">
                <span>{project.icon}</span>
                {project.title}
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '0.7rem',
                  background: `${themeColors.primary}15`,
                  color: `${themeColors.primary}CC`,
                  padding: '2px 12px',
                  borderRadius: '12px',
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  Featured
                </span>
              </div>
              <div className="resume-content">
                <div style={{ marginBottom: '8px' }}>
                  {project.tech.split(' + ').map((tech, i) => (
                    <span key={i} className="resume-badge">{tech}</span>
                  ))}
                </div>
                <p style={{ marginBottom: '12px', color: `${themeColors.textSecondary}BB` }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="resume-btn" style={{ padding: '6px 18px', fontSize: '0.8rem' }}
                    onClick={() => project.github !== '#' ? window.open(project.github, '_blank') : alert('GitHub link coming soon')}>
                    GitHub ↗
                  </button>
                  <button className="resume-btn-outline" style={{ padding: '6px 18px', fontSize: '0.8rem' }}
                    onClick={() => project.demo !== '#' ? window.open(project.demo, '_blank') : alert('Live demo coming soon')}>
                    Live Demo ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="resume-section">
          <p className="resume-subtitle">Get in Touch</p>
          <h2 className="resume-title">Contact Me</h2>
          <div className="resume-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: `${themeColors.textSecondary}BB` }}>Email</div>
                  <a href={`mailto:${resumeData.contact.email}`} style={{ color: `${themeColors.primary}CC`, textDecoration: 'none' }}>
                    {resumeData.contact.email}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>💼</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: `${themeColors.textSecondary}BB` }}>LinkedIn</div>
                  <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: `${themeColors.primary}CC`, textDecoration: 'none' }}>
                    View Profile →
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: `${themeColors.textSecondary}BB` }}>Location</div>
                  <span style={{ color: `${themeColors.textSecondary}BB` }}>{resumeData.contact.location}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: `${themeColors.textSecondary}BB` }}>Phone</div>
                  <a href={`tel:${resumeData.contact.phone}`} style={{ color: `${themeColors.primary}CC`, textDecoration: 'none' }}>
                    {resumeData.contact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer style={{
          textAlign: 'center',
          padding: '32px 20px',
          borderTop: `1px solid ${themeColors.border}`,
          color: `${themeColors.textSecondary}BB`,
          fontSize: '0.85rem',
          backgroundColor: themeColors.sectionBg
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href="#about" style={{ color: `${themeColors.textSecondary}BB`, textDecoration: 'none' }}>About</a>
            <a href="#experience" style={{ color: `${themeColors.textSecondary}BB`, textDecoration: 'none' }}>Tech Stack</a>
            <a href="#projects" style={{ color: `${themeColors.textSecondary}BB`, textDecoration: 'none' }}>Projects</a>
            <a href="#contact" style={{ color: `${themeColors.textSecondary}BB`, textDecoration: 'none' }}>Contact</a>
          </div>
          <p style={{ color: `${themeColors.textSecondary}99` }}>© {new Date().getFullYear()} {resumeData.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
}