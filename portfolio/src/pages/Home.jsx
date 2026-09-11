// pages/Home.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import TechStack from "../components/TechStack";
import Education from "../components/Education";
import FeaturedProject from "../components/FeaturedProject";
import Projects from "../components/Projects";
import Certifications from "../components/Certifications";
import Languages from "../components/Languages";
import Hobbies from "../components/Hobbies";
import LetsWorkTogether from "../components/LetsWorkTogether";
import Footer from "../components/Footer";

import { useTheme } from "../context/ThemeContext";
import resumeData from "../data/resumeData";
import API from "../services/api";

export default function Home() {
  const { currentTheme, themeColors } = useTheme();

  const [portfolioData, setPortfolioData] = useState(resumeData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await API.get("/portfolio");

        if (response.data?.success) {
          const data = response.data.data;
          const pInfo = data.personalInfo || {};

          let mergedProjects = data.projects || [];
          try {
            const stored = localStorage.getItem("portfolio_custom_projects");
            if (stored) {
              const localCustom = JSON.parse(stored);
              mergedProjects = mergedProjects.map((p) => {
                const match = localCustom.find(
                  (l) => l.id === p.id || (l.title && p.title && l.title.toLowerCase() === p.title.toLowerCase())
                );
                return match && match.image ? { ...p, image: match.image } : p;
              });
            }
          } catch (e) {}
          
          setPortfolioData((prev) => ({
            ...prev,
            ...data,
            projects: mergedProjects.length > 0 ? mergedProjects : prev.projects,
            name: pInfo.name || prev.name,
            role: pInfo.role || prev.role,
            about: pInfo.about || prev.about,
            contact: {
              ...prev.contact,
              email: pInfo.email || prev.contact?.email,
              linkedin: pInfo.linkedin || prev.contact?.linkedin,
              location: pInfo.location || prev.contact?.location,
              phone: pInfo.phone || prev.contact?.phone,
              github: "https://github.com/Chandani0610",
            },
          }));
        }
      } catch (error) {
        console.warn("Backend API unavailable, using local portfolio data:", error.message);
        let fallback = { ...resumeData };
        try {
          const stored = localStorage.getItem("portfolio_custom_projects");
          if (stored) {
            fallback.projects = JSON.parse(stored);
          }
        } catch (e) {}
        setPortfolioData(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();

    const handleUpdate = () => fetchPortfolio();
    window.addEventListener("portfolio_projects_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_projects_updated", handleUpdate);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-theme={currentTheme} className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* Header / Navbar */}
      <Header />

      <main className="flex flex-col gap-2 pb-4">
        {/* 1. Hero Section */}
        <Hero data={portfolioData} scrollToSection={scrollToSection} />

        {/* 2. About Me & My Approach */}
        <AboutMe data={portfolioData} />

        {/* 3. TECH STACK - Placed ON TOP OF THE EDUCATION SECTION */}
        <TechStack skills={portfolioData.skills} />

        {/* 4. EDUCATION - Placed ON TOP OF THE PROJECT SECTION */}
        <Education education={portfolioData.education} />

        {/* 4. Featured Project: KahaniLand */}
        <FeaturedProject project={portfolioData.featuredProject} />

        {/* 5. Other Projects / My Works */}
        <Projects projects={portfolioData.projects} />

        {/* 6. Certifications Section - Placed right below Projects */}
        <Certifications certifications={portfolioData.certifications} />

        {/* 7. LANGUAGES - Placed BELOW CERTIFICATIONS PAGE */}
        <Languages languages={portfolioData.languages} />

        {/* 8. HOBBIES & INTERESTS - Placed BELOW LANGUAGES */}
        <Hobbies hobbies={portfolioData.hobbies} />

        {/* 9. Let's Work Together - Placed ON TOP OF THE FOOTER */}
        <LetsWorkTogether contact={portfolioData.contact} />
      </main>

      {/* Footer */}
      <Footer onGetInTouch={() => scrollToSection("contact")} />
    </div>
  );
}
