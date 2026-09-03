import { useTheme } from "../context/ThemeContext";

export default function Certifications({ certifications }) {
  let themeColors;

  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    themeColors = {
      primary: "#08bde0",
      primaryDark: "#07a8c9",
      primaryLight: "#e8f4f8",
      accent: "#48e39a",
      accentDark: "#32d789",
      text: "#10243e",
      textSecondary: "#7c8997",
      border: "#e9eef2",
      cardBg: "#ffffff",
      cardBorder: "#e7edf1",
      background: "#f8fafb",
      sectionBg: "#ffffff",
      shadow: "rgba(16,36,62,0.08)",
      shadowHover: "rgba(16,36,62,0.12)",
      gradient: "linear-gradient(135deg, #08bde0, #07a8c9)",
    };
  }

  // Use props or fallback data
  const certList = certifications || [
    "AWS Certified Developer - Associate",
    "NPTEL - Programming in Java",
    "NPTEL - Data Structures and Algorithms",
    "HackerRank - Problem Solving (Intermediate)",
    "HackerRank - SQL (Intermediate)",
    "React.js Certification - Meta",
  ];

  const certIcons = ["🏅", "📜", "🎯", "⭐", "🏆", "📋"];

  // Calculate stats
  const totalCertifications = certList.length;
  const nptelCount = certList.filter(c => c.includes("NPTEL")).length;
  const hackerRankCount = certList.filter(c => c.includes("HackerRank")).length;

  return (
    <section
      id="certifications"
      className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto mb-8 max-w-[600px] text-center">
          <p
            className="text-xs uppercase tracking-[0.22em]"
            style={{ color: themeColors.primary }}
          >
            Certifications
          </p>

          <h2
            className="m-0 mt-1 text-2xl font-bold tracking-[-0.8px] sm:text-3xl"
            style={{ color: themeColors.text }}
          >
            Professional Certifications
          </h2>

          <p
            className="mx-auto mt-2 max-w-xl text-xs sm:text-sm"
            style={{ color: themeColors.textSecondary }}
          >
            Certifications that support my technical knowledge and
            professional development.
          </p>
        </div>

        {/* Certification Cards */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          {certList.map((cert, idx) => (
            <div
              key={idx}
              className="
                group
                rounded-xl
                border
                p-4
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
              "
              style={{
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBg,
                boxShadow: `0 6px 20px ${themeColors.shadow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 30px ${themeColors.primary}20`;
                e.currentTarget.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 20px ${themeColors.shadow}`;
                e.currentTarget.style.borderColor = themeColors.border;
              }}
            >
              <div className="flex flex-col items-center justify-center">
                {/* Icon */}
                <div
                  className="
                    mb-2.5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    text-2xl
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:rotate-3
                  "
                  style={{
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary,
                  }}
                >
                  {certIcons[idx % certIcons.length]}
                </div>

                {/* Certificate Name */}
                <h3
                  className="
                    mb-2
                    text-sm
                    font-semibold
                    leading-relaxed
                    transition-colors
                    duration-300
                    sm:text-base
                  "
                  style={{ color: themeColors.text }}
                >
                  {cert}
                </h3>

                {/* Certified Badge */}
                <div
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-3
                    py-1
                    text-[10px]
                    font-medium
                    transition-all
                    duration-300
                    group-hover:scale-105
                  "
                  style={{
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      `${themeColors.primary}25`;
                    e.currentTarget.style.borderColor = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      `${themeColors.primary}15`;
                    e.currentTarget.style.borderColor =
                      `${themeColors.primary}30`;
                  }}
                >
                  <span>✔</span>
                  Certified
                </div>

                {/* Decorative Line */}
                <div
                  className="
                    mt-2
                    h-0.5
                    w-8
                    rounded-full
                    transition-all
                    duration-300
                    group-hover:w-16
                  "
                  style={{
                    backgroundColor: `${themeColors.primary}30`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-7 max-w-3xl">
          <div
            className="
              grid
              grid-cols-2
              gap-3
              rounded-xl
              border
              p-4
              text-center
              md:grid-cols-4
            "
            style={{
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`,
              boxShadow: `0 4px 15px ${themeColors.shadow}`,
            }}
          >
            {/* Total */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{ color: themeColors.primary }}
              >
                {totalCertifications}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: themeColors.textSecondary }}
              >
                Total Certifications
              </p>
            </div>

            {/* NPTEL */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{ color: themeColors.primary }}
              >
                {nptelCount}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: themeColors.textSecondary }}
              >
                NPTEL Courses
              </p>
            </div>

            {/* HackerRank */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{ color: themeColors.primary }}
              >
                {hackerRankCount}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: themeColors.textSecondary }}
              >
                HackerRank
              </p>
            </div>

            {/* Active Period */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{ color: themeColors.primary }}
              >
                2024-{new Date().getFullYear()}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: themeColors.textSecondary }}
              >
                Active Period
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}