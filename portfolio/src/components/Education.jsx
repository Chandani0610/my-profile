import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function Education({ education: propEducation }) {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Safely use theme with fallback
  let themeColors;
  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    // Fallback theme if not in provider
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

  // Fetch education data if not provided as prop
  useEffect(() => {
    if (propEducation) {
      // Education provided by props is used directly during render.
      return;
    }

    // Otherwise fetch from API
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get("/portfolio");
        
        if (response.data.success) {
          let edu = response.data.data.education || [];
          
          // Ensure edu is an array and filter out null/undefined values
          if (Array.isArray(edu)) {
            edu = edu.filter(item => item != null);
          } else {
            edu = [];
          }
          
          setEducationData(edu);
        } else {
          setEducationData([]);
        }
      } catch (error) {
        console.error("Error fetching education:", error);
        setError("Failed to load education data");
        setEducationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [propEducation]);

  // Fallback data if no education is available
  const fallbackEducation = [
    {
      id: 1,
      degree: "B.Sc. Computer Science",
      institution: "Tribhuvan University",
      year: "2020 - 2024",
      score: "3.8/4.0",
    },
    {
      id: 2,
      degree: "Higher Secondary Education",
      institution: "Nepal College",
      year: "2018 - 2020",
      score: "3.6/4.0",
    },
  ];

  // Get education list with safe fallback and sort by latest first
  const getEducationList = () => {
    if (loading) return [];
    if (error) return fallbackEducation;
    
    // Ensure we have an array and filter out null values
    const sourceEducation = propEducation || educationData;
    const safeEdu = Array.isArray(sourceEducation) ? sourceEducation : [];
    const filteredEdu = safeEdu.filter(item => item != null);
    
    if (filteredEdu.length === 0) {
      return fallbackEducation;
    }
    
    // Sort by year (latest first) or by id if no year
    return filteredEdu.sort((a, b) => {
      // Extract start year from year string
      const getStartYear = (yearStr) => {
        if (!yearStr) return 0;
        const match = yearStr.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
      };
      
      const yearA = getStartYear(a.year || a.startYear);
      const yearB = getStartYear(b.year || b.startYear);
      
      // If years are different, sort by year (latest first)
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      
      // If same year, check if one is current
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      
      // If both are current or both not, sort by id (newer first)
      const idA = a.id || 0;
      const idB = b.id || 0;
      return idB - idA;
    });
  };

  const eduList = getEducationList();
  const safeEduList = Array.isArray(eduList) ? eduList : [];

  // Education icons
  const eduIcons = ['🎓', '📚', '🏫', '📖', '🔬', '💻'];

  // Calculate stats
  const totalEducation = safeEduList.length;
  const currentEducation = safeEduList.filter(item => 
    item.isCurrent || (item.year && item.year.includes('2024'))
  ).length;

  // Render loading state
  if (loading) {
    return (
      <section 
        id="education" 
        className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
        style={{ backgroundColor: themeColors.sectionBg }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center py-12">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: `${themeColors.primary}40`,
                borderTopColor: themeColors.primary,
              }}
            />
            <p className="mt-4" style={{ color: themeColors.textSecondary }}>
              Loading education data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="education" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[650px] text-center">
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Education
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Academic Background
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            {error 
              ? "Strong academic foundation that supports my technical and professional growth." 
              : `${totalEducation} educational qualification${totalEducation !== 1 ? 's' : ''} supporting my technical and professional growth.`
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8 mb-6 rounded-xl border border-red-400/20 bg-red-400/10">
            <p className="text-red-400">{error}</p>
            <p className="text-sm mt-2" style={{ color: themeColors.textSecondary }}>
              Showing fallback education data.
            </p>
          </div>
        )}

        {/* Education Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safeEduList.length > 0 ? (
            safeEduList.map((item, idx) => {
              // Safely access properties
              const degree = item?.degree || "Untitled Degree";
              const institution = item?.college || item?.institution || "Unknown Institution";
              const year = item?.year || "Year not specified";
              const score = item?.marks || item?.score || "Not specified";
              const iconIndex = idx % eduIcons.length;
              const itemId = item?.id || `edu-${idx}`;
              const isCurrent = item?.isCurrent || false;

              return (
                <div
                  key={itemId}
                  className="
                    group
                    rounded-2xl
                    border
                    p-8
                    transition-all
                    duration-300
                    hover:-translate-y-2
                  "
                  style={{ 
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cardBg,
                    boxShadow: `0 12px 35px ${themeColors.shadow}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                    e.currentTarget.style.borderColor = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                    e.currentTarget.style.borderColor = themeColors.border;
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ 
                        backgroundColor: `${themeColors.primary}15`,
                        border: `1px solid ${themeColors.primary}30`,
                        color: themeColors.primary
                      }}
                    >
                      {eduIcons[iconIndex] || '🎓'}
                    </div>
                    {isCurrent && (
                      <span 
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${themeColors.primary}15`,
                          color: themeColors.primary,
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <h3 
                    className="text-2xl font-semibold transition-colors duration-300"
                    style={{ color: themeColors.text }}
                  >
                    {degree}
                  </h3>

                  <p className="mt-3 text-sm" style={{ color: themeColors.textSecondary }}>
                    {institution}
                  </p>

                  <div 
                    className="mt-4 inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                    style={{ 
                      backgroundColor: `${themeColors.primary}15`,
                      border: `1px solid ${themeColors.primary}30`,
                      color: themeColors.primary,
                      boxShadow: `0 2px 8px ${themeColors.primary}20`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 15px ${themeColors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 2px 8px ${themeColors.primary}20`;
                    }}
                  >
                    {score}
                  </div>

                  <p className="mt-3 text-xs" style={{ color: themeColors.textSecondary }}>
                    {year}
                  </p>

                  {/* Decorative indicator */}
                  <div 
                    className="mt-4 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                    style={{ backgroundColor: `${themeColors.primary}30` }}
                  />
                </div>
              );
            })
          ) : (
            <div 
              className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 rounded-xl border"
              style={{
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBg,
              }}
            >
              <div className="text-6xl mb-4">📚</div>
              <p style={{ color: themeColors.textSecondary }}>
                No education data available.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {safeEduList.length > 0 && (
          <div className="mx-auto mt-12 max-w-4xl">
            <div
              className="
                grid
                grid-cols-2
                gap-4
                rounded-2xl
                border
                p-6
                text-center
                md:grid-cols-4
              "
              style={{
                borderColor: themeColors.border,
                backgroundColor: `${themeColors.primary}05`,
                boxShadow: `0 4px 20px ${themeColors.shadow}`,
              }}
            >
              {/* Total Education */}
              <div className="transition-all duration-300 hover:scale-105">
                <p
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  {totalEducation}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  Total Qualifications
                </p>
              </div>

              {/* Current Education */}
              <div className="transition-all duration-300 hover:scale-105">
                <p
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  {currentEducation}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  Current/Recent
                </p>
              </div>

              {/* Highest Degree */}
              <div className="transition-all duration-300 hover:scale-105">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: themeColors.primary }}
                >
                  {safeEduList[0]?.degree || "N/A"}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  Highest Degree
                </p>
              </div>

              {/* Active Years */}
              <div className="transition-all duration-300 hover:scale-105">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeColors.primary }}
                >
                  {safeEduList.length > 0 
                    ? `${Math.min(...safeEduList.map(item => {
                        const match = item.year?.match(/\d{4}/);
                        return match ? parseInt(match[0]) : new Date().getFullYear();
                      }))} - ${Math.max(...safeEduList.map(item => {
                        const match = item.year?.match(/\d{4}/);
                        return match ? parseInt(match[0]) : new Date().getFullYear();
                      }))}`
                    : "N/A"}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  Active Period
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}