import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import About from "../components/About";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Certifications from "../components/Certifications";
import Languages from "../components/Languages";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Hobbies from "../components/Hobbies";

import { useTheme } from "../context/ThemeContext";
import profileImage from "../assets/photo.png";
import resumeData from "../data/resumeData";

import API from "../services/api";

export default function Home() {
  const { themeColors } = useTheme();

  // =========================================
  // PORTFOLIO DATA
  // =========================================

  const [portfolioData, setPortfolioData] = useState(resumeData);
  const [loading, setLoading] = useState(true);

  // =========================================
  // GET PORTFOLIO DATA
  // =========================================

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await API.get("/portfolio");

        if (response.data?.success) {
          const data = response.data.data;
          const pInfo = data.personalInfo || {};
          setPortfolioData({
            ...resumeData,
            ...data,
            name: pInfo.name || resumeData.name,
            role: pInfo.role || resumeData.role,
            about: pInfo.about || resumeData.about,
            contact: {
              email: pInfo.email || resumeData.contact?.email,
              linkedin: pInfo.linkedin || resumeData.contact?.linkedin,
              location: pInfo.location || resumeData.contact?.location,
              phone: pInfo.phone || resumeData.contact?.phone,
            },
          });
        }
      } catch (error) {
        console.error(
          "Failed to load portfolio data:",
          error
        );

        // Keep resumeData as fallback
        setPortfolioData(resumeData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // =========================================
  // SCROLL
  // =========================================

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
        }}
      >
        <div className="text-center">

          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: `${themeColors.accent}40`,
              borderTopColor: themeColors.accent,
            }}
          />

          <p className="text-sm opacity-60">
            Loading portfolio...
          </p>

        </div>
      </div>
    );
  }

  // =========================================
  // DESTRUCTURE DATA FOR CLEANER PROPS
  // =========================================

  const {
    about,
    skills,
    projects,
    education,
    certifications,
    languages,
    hobbies,
    contact,
    name,
    role,
  } = portfolioData;

  return (
    <>
      <Header />

      <main
        className="min-h-screen"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
        }}
      >

        {/* =========================================
            HERO
        ========================================= */}

        <section
          id="home"
          className="relative px-4 py-6 sm:px-6 lg:px-8"
          style={{
            backgroundColor: themeColors.background,
          }}
        >

          <div
            className="relative mx-auto min-h-[78vh] max-w-[1480px] overflow-hidden rounded-3xl"
            style={{
              backgroundColor: themeColors.primary,
              background: themeColors.heroBg || themeColors.primary,
              boxShadow: `0 15px 45px ${themeColors.shadow}`,
            }}
          >

            <div className="relative z-10 flex min-h-[78vh] flex-col items-center lg:flex-row">

              {/* =========================================
                  LEFT CONTENT
              ========================================= */}

              <div className="relative z-20 flex w-full items-center px-8 py-10 sm:px-10 lg:w-[52%] lg:px-14 lg:py-10">

                <div className="w-full max-w-[700px]">

                  <div className="mb-4 text-[10px] font-semibold tracking-[3px] text-white/60">
                    WELCOME TO MY PORTFOLIO
                  </div>

                  <h1 className="m-0 max-w-[700px] text-4xl font-bold leading-[1.02] tracking-[-2px] text-white sm:text-5xl lg:text-[52px] xl:text-[64px]">

                    Hi, I'm{" "}

                    <span className="text-white">
                      {name?.split(" ")[0] ||
                        "Chandani"}
                    </span>

                    <br />

                    <span className="text-white">
                      {role ||
                        "Frontend Developer"}
                    </span>

                  </h1>

                  <p className="mt-5 max-w-[600px] text-sm leading-relaxed text-white/70 sm:text-base">
                    {about ||
                      "Computer Science Graduate with hands-on experience in React.js, Node.js, Express.js, MySQL, and JavaScript."}
                  </p>


                  {/* =========================================
                      BUTTONS
                  ========================================= */}

                  <div className="mt-7 flex flex-wrap items-center gap-4">

                    <button
                      onClick={() =>
                        scrollToSection("contact")
                      }
                      className="min-w-[140px] rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor:
                          themeColors.accent,
                        boxShadow: `0 8px 20px ${themeColors.accent}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          themeColors.accentDark;

                        e.currentTarget.style.boxShadow =
                          `0 12px 30px ${themeColors.accent}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          themeColors.accent;

                        e.currentTarget.style.boxShadow =
                          `0 8px 20px ${themeColors.accent}40`;
                      }}
                    >
                      CONTACT ME
                    </button>


                    <button
                      onClick={() =>
                        scrollToSection("projects")
                      }
                      className="min-w-[140px] rounded-full border-2 border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
                    >
                      VIEW PROJECTS
                    </button>

                  </div>

                </div>

              </div>


              {/* =========================================
                  PROFILE IMAGE
              ========================================= */}

              <div className="relative flex w-full items-center justify-center lg:min-h-[500px] lg:w-[48%]">

                <div className="relative z-10 mt-6 flex items-center justify-center lg:mt-0">

                  <img
                    src={profileImage}
                    alt={
                      name ||
                      "Chandani Kumari"
                    }
                    className="h-auto max-h-[400px] w-auto max-w-full object-contain sm:max-h-[450px] lg:max-h-[500px] xl:max-h-[550px]"
                  />

                </div>


                {/* =========================================
                    PROJECT COUNT
                ========================================= */}

                <div className="absolute right-4 top-[180px] z-20 w-[140px] rounded-2xl border border-white/25 bg-white/10 p-4 text-white backdrop-blur-[20px] sm:right-6">

                  <h3 className="m-0 mb-1 text-2xl font-bold text-white/90">
                    {projects?.length || 0}
                  </h3>

                  <p className="m-0 text-[9px] leading-relaxed text-white/70">
                    Projects Completed
                  </p>

                </div>

              </div>

            </div>


            {/* =========================================
                TECHNOLOGIES
            ========================================= */}

            <div
              className="flex w-full flex-wrap items-center justify-around gap-4 border-t border-white/10 px-6 py-5"
              style={{
                backgroundColor:
                  `${themeColors.primary}40`,
              }}
            >

              <span className="text-[15px] font-bold text-white opacity-90 sm:text-[18px] md:text-[20px]">
                ✦ REACT
              </span>

              <span className="text-[15px] font-bold text-white opacity-90 sm:text-[18px] md:text-[20px]">
                ✦ TAILWIND
              </span>

              <span className="text-[15px] font-bold text-white opacity-90 sm:text-[18px] md:text-[20px]">
                ✦ NODE.JS
              </span>

              <span className="text-[15px] font-bold text-white opacity-90 sm:text-[18px] md:text-[20px]">
                ✦ EXPRESS
              </span>

              <span className="text-[15px] font-bold text-white opacity-90 sm:text-[18px] md:text-[20px]">
                ✦ MYSQL
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            PORTFOLIO SECTIONS - WITH PROPS
        ========================================= */}

        <About
          about={about}
          skills={skills}
        />

        <Skills
          skills={skills}
        />

        <Projects
          projects={projects}
        />

        <Education
          education={education}
        />

        <Certifications
          certifications={certifications}
        />

        <Languages
          languages={languages}
        />

        <Hobbies
          hobbies={hobbies}
        />

        <Contact
          contact={contact}
        />

      </main>

      <Footer />
    </>
  );
}