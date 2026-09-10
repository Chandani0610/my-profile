import { useTheme } from "../context/ThemeContext";

export default function Contact({ contact }) {
  // Safely use theme with fallback
  let themeColors;

  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    // Fallback theme if not in provider
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
  const contactData = contact || {
    email: "chandani@example.com",
    phone: "+977 9876543210",
    location: "Kathmandu, Nepal",
    linkedin: "https://linkedin.com/in/chandani",
    github: "https://github.com/Chandani0610",
  };

  const contactItems = [
    {
      id: "email",
      icon: "📧",
      label: "Email",
      value: contactData.email,
      href: `mailto:${contactData.email}`,
      isLink: true,
    },
    {
      id: "location",
      icon: "📍",
      label: "Location",
      value: contactData.location,
      href: null,
      isLink: false,
    },
    {
      id: "phone",
      icon: "📞",
      label: "Phone",
      value: contactData.phone,
      href: `tel:${contactData.phone}`,
      isLink: true,
    },
    {
      id: "linkedin",
      icon: "💼",
      label: "LinkedIn",
      value: "View Profile →",
      href: contactData.linkedin,
      isLink: true,
      isExternal: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      style={{
        backgroundColor: themeColors.sectionBg,
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* ================= SECTION HEADER ================= */}
        <div className="mx-auto mb-8 max-w-[600px] text-center">
          <p
            className="text-xs uppercase tracking-[0.22em]"
            style={{
              color: themeColors.primary,
            }}
          >
            Contact
          </p>

          <h2
            className="m-0 mt-1 text-2xl font-bold tracking-[-0.8px] sm:text-3xl"
            style={{
              color: themeColors.text,
            }}
          >
            Let's Work Together
          </h2>

          <p
            className="mx-auto mt-2 max-w-xl text-xs sm:text-sm"
            style={{
              color: themeColors.textSecondary,
            }}
          >
            Reach out for collaborations, freelance work, or to discuss your
            next project idea.
          </p>
        </div>

        {/* ================= CONTACT CARDS ================= */}
        <div
          className="
            mx-auto
            grid
            max-w-4xl
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          {contactItems.map((item) => (
            <div
              key={item.id}
              className="
                group
                rounded-xl
                border
                p-4
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
                e.currentTarget.style.boxShadow =
                  `0 12px 30px ${themeColors.shadowHover}`;
                e.currentTarget.style.borderColor =
                  themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  `0 6px 20px ${themeColors.shadow}`;
                e.currentTarget.style.borderColor =
                  themeColors.border;
              }}
            >
              {/* Card Content */}
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-xl
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:rotate-2
                  "
                  style={{
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary,
                  }}
                >
                  {item.icon}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      mb-0.5
                      text-base
                      font-semibold
                      transition-colors
                      duration-300
                    "
                    style={{
                      color: themeColors.text,
                    }}
                  >
                    {item.label}
                  </h3>

                  {item.isLink ? (
                    <a
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noreferrer" : undefined}
                      className="
                        break-all
                        text-xs
                        transition-all
                        duration-200
                      "
                      style={{
                        color: themeColors.textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          themeColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          themeColors.textSecondary;
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="text-xs"
                      style={{
                        color: themeColors.textSecondary,
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {item.isLink && (
                  <span
                    className="
                      text-sm
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                    "
                    style={{
                      color: themeColors.primary,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= CALL TO ACTION ================= */}
        <div
          className="
            mx-auto
            mt-8
            max-w-3xl
            overflow-hidden
            rounded-2xl
            p-6
            text-center
            transition-all
            duration-300
            hover:shadow-2xl
          "
          style={{
            background: `linear-gradient(
              135deg,
              ${themeColors.primary},
              ${themeColors.primaryDark}
            )`,
            boxShadow: `0 15px 45px ${themeColors.primary}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              `0 25px 65px ${themeColors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              `0 15px 45px ${themeColors.primary}30`;
          }}
        >
          <h3 className="text-xl font-bold text-white">
            Ready to Start a Project?
          </h3>

          <p className="mt-1.5 text-sm text-white/80">
            Let's discuss your ideas and bring them to life together.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {/* Email Button */}
            <a
              href={`mailto:${contactData.email}`}
              className="
                rounded-full
                bg-white
                px-5
                py-2
                text-xs
                font-semibold
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
              style={{
                color: themeColors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              📧 Email Me
            </a>

            {/* LinkedIn Button */}
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="
                rounded-full
                border
                border-white/30
                bg-white/10
                px-5
                py-2
                text-xs
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/20
                hover:shadow-lg
              "
            >
              💼 Connect on LinkedIn
            </a>

            {/* GitHub Button */}
            {contactData.github && (
              <a
                href={contactData.github}
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-full
                  border
                  border-white/30
                  bg-white/10
                  px-5
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/20
                  hover:shadow-lg
                "
              >
                🐙 GitHub
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}