import Header from "../components/Header";
import Footer from "../components/Footer";
import resumeData from "../data/resumeData";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section id="home" className="hero">
          <div className="hero-card">
            <h1>Hi, I'm {resumeData.name}</h1>
            <p>
              I build smooth, responsive interfaces with React, Tailwind, and polished animations.
              My focus is on beautiful design, clean code, and portfolio experiences that stand out.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Projects
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contact Me
              </button>
            </div>

            <div className="grid grid-3 mt-8">
              <div className="card">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Experience</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">2+ Years</h3>
                <p className="mt-3 text-slate-300">Building polished UI interfaces and responsive product pages.</p>
              </div>
              <div className="card">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Focus</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">UI / UX</h3>
                <p className="mt-3 text-slate-300">Designing accessible, elegant, and engaging experiences for every screen.</p>
              </div>
              <div className="card">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Tools</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">React + Tailwind</h3>
                <p className="mt-3 text-slate-300">Modern component workflows, rapid styling, and careful UX polish.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-title">
            <p className="text-sky-300 uppercase tracking-[0.28em]">About Me</p>
            <h2>Designing bright, user-first web experiences</h2>
            <p>From portfolio landing pages to interactive product showcases, I create modern and accessible UI layouts that feel premium.</p>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3 className="mb-4 text-2xl font-semibold text-white">Who I Am</h3>
              <p className="leading-8 text-slate-300">{resumeData.about}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {resumeData.skills.frontend.map((skill) => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="mb-4 text-2xl font-semibold text-white">My Approach</h3>
              <ul className="space-y-3 text-slate-300 list-disc list-inside">
                <li>Fast-loading interfaces with clean transitions</li>
                <li>Responsive layouts designed for mobile and desktop</li>
                <li>Polished visuals with readable, accessible typography</li>
                <li>Reliable code structure and reusable component patterns</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-title">
            <p className="text-sky-300 uppercase tracking-[0.28em]">Tech Stack</p>
            <h2>Skills I Use Daily</h2>
            <p>These are the languages, frameworks, and tools I leverage to build modern applications and portfolios.</p>
          </div>

          <div className="grid grid-3">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div key={category} className="card">
                <h3 className="mb-4 text-2xl font-semibold text-white capitalize">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="section">
          <div className="section-title">
            <p className="text-sky-300 uppercase tracking-[0.28em]">Education</p>
            <h2>Background & certifications</h2>
            <p>Strong academic foundation combined with certifications that support technical growth and practical skills.</p>
          </div>

          <div className="grid grid-2">
            {resumeData.education.map((item, idx) => (
              <div key={idx} className="card">
                <h3 className="text-2xl font-semibold text-white">{item.degree}</h3>
                <p className="mt-3 text-slate-300">{item.college}</p>
                <p className="mt-3 text-slate-300 font-semibold">{item.marks}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-2 mt-8">
            <div className="card">
              <h3 className="text-2xl font-semibold text-white">Certifications</h3>
              <div className="mt-4 space-y-3 text-slate-300">
                {resumeData.certifications.map((cert, idx) => (
                  <p key={idx}>✔️ {cert}</p>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-2xl font-semibold text-white">Languages</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {resumeData.languages.map((lang) => (
                  <span key={lang.name} className="skill-pill">{lang.flag} {lang.name}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-title">
            <p className="text-sky-300 uppercase tracking-[0.28em]">Projects</p>
            <h2>Selected work</h2>
            <p>Featured projects showcasing modern UI, thoughtful layout, and polished detail.</p>
          </div>

          <div className="grid grid-2">
            {resumeData.projects.map((project, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-white">{project.icon} {project.title}</h3>
                  <span className="info-badge">Featured</span>
                </div>
                <p className="mt-4 text-slate-300">{project.tech}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    className="btn-secondary"
                    onClick={() => project.github !== "#" ? window.open(project.github, "_blank") : alert("GitHub link coming soon")}
                  >
                    GitHub
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => project.demo !== "#" ? window.open(project.demo, "_blank") : alert("Live demo coming soon")}
                  >
                    Live Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-title">
            <p className="text-sky-300 uppercase tracking-[0.28em]">Contact</p>
            <h2>Let's work together</h2>
            <p>Reach out for collaborations, freelance work, or to discuss your next project idea.</p>
          </div>

          <div className="contact-grid">
            <div className="card contact-card">
              <div className="contact-card-icon">📧</div>
              <div className="contact-card-content">
                <h3>Email</h3>
                <p><a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a></p>
              </div>
            </div>
            <div className="card contact-card">
              <div className="contact-card-icon">📍</div>
              <div className="contact-card-content">
                <h3>Location</h3>
                <p>{resumeData.contact.location}</p>
              </div>
            </div>
            <div className="card contact-card">
              <div className="contact-card-icon">📞</div>
              <div className="contact-card-content">
                <h3>Phone</h3>
                <p>{resumeData.contact.phone}</p>
              </div>
            </div>
            <div className="card contact-card">
              <div className="contact-card-icon">💼</div>
              <div className="contact-card-content">
                <h3>LinkedIn</h3>
                <p><a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer">View profile</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}