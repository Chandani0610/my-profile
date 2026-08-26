import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Contact() {
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

  const contactItems = [
    {
      id: 'email',
      icon: '📧',
      label: 'Email',
      value: resumeData.contact.email,
      href: `mailto:${resumeData.contact.email}`,
      isLink: true,
    },
    {
      id: 'location',
      icon: '📍',
      label: 'Location',
      value: resumeData.contact.location,
      href: null,
      isLink: false,
    },
    {
      id: 'phone',
      icon: '📞',
      label: 'Phone',
      value: resumeData.contact.phone,
      href: `tel:${resumeData.contact.phone}`,
      isLink: true,
    },
    {
      id: 'linkedin',
      icon: '💼',
      label: 'LinkedIn',
      value: 'View Profile →',
      href: resumeData.contact.linkedin,
      isLink: true,
      isExternal: true,
    },
  ];

  return (
    <section 
      id="contact" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Contact
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Let's Work Together
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Reach out for collaborations, freelance work, or to discuss your
            next project idea.
          </p>

        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

          {contactItems.map((item) => (
            <div
              key={item.id}
              className="
                group
                rounded-2xl
                border
                p-6
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
              <div className="flex items-center gap-5">
                
                <div 
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ 
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary
                  }}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 
                    className="mb-1 text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--primary)]"
                    style={{ color: themeColors.text }}
                  >
                    {item.label}
                  </h3>

                  {item.isLink ? (
                    <a
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noreferrer" : undefined}
                      className="break-all text-sm transition-all duration-200 group-hover:translate-x-1"
                      style={{ 
                        color: themeColors.textSecondary,
                      }}
                      onMouseEnter={(e) => e.target.style.color = themeColors.primary}
                      onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p 
                      className="text-sm"
                      style={{ color: themeColors.textSecondary }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>

                {/* Arrow indicator for clickable items */}
                {item.isLink && (
                  <span 
                    className="text-sm transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                    style={{ color: themeColors.primary }}
                  >
                    →
                  </span>
                )}
              </div>

              {/* Decorative indicator */}
              <div 
                className="mt-4 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                style={{ backgroundColor: `${themeColors.primary}30` }}
              />
            </div>
          ))}

        </div>

        {/* Call to Action Banner */}
        <div 
          className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark})`,
            boxShadow: `0 20px 60px ${themeColors.primary}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 30px 80px ${themeColors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 60px ${themeColors.primary}30`;
          }}
        >
          <h3 className="text-2xl font-bold text-white">
            Ready to Start a Project?
          </h3>
          <p className="mt-2 text-white/80">
            Let's discuss your ideas and bring them to life together.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ color: themeColors.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📧 Email Me
            </a>
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
            >
              💼 Connect on LinkedIn
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}