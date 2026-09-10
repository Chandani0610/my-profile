import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import API, { getImageUrl } from "../services/api";

export default function Certifications({ certifications: propCertifications }) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  // Fetch certifications if not provided as prop
  useEffect(() => {
    if (propCertifications) {
      // Certifications supplied by props are consumed directly during render.
      return;
    }

    // Otherwise fetch from API
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get("/portfolio");
        
        if (response.data.success) {
          let certs = response.data.data.certifications || [];
          
          // Handle both old (string array) and new (object array) formats
          if (Array.isArray(certs)) {
            // Filter out null or undefined values
            certs = certs.filter(cert => cert != null);
            
            if (certs.length > 0 && typeof certs[0] === 'string') {
              // Convert string array to object array with proper structure
              certs = certs.map((name, index) => ({
                id: index + 1,
                name: name || "Untitled Certification",
                issuer: "Unknown Issuer",
                credential: "",
                url: "",
                image: "",
                description: ""
              }));
            }
            setCertifications(certs);
          } else {
            setCertifications([]);
          }
        } else {
          setCertifications([]);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setError("Failed to load certifications");
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [propCertifications]);

  // Fallback data if no certifications are available
  const fallbackCertifications = [
    { id: 1, name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services" },
    { id: 2, name: "NPTEL - Programming in Java", issuer: "NPTEL" },
    { id: 3, name: "NPTEL - Data Structures and Algorithms", issuer: "NPTEL" },
    { id: 4, name: "HackerRank - Problem Solving (Intermediate)", issuer: "HackerRank" },
    { id: 5, name: "HackerRank - SQL (Intermediate)", issuer: "HackerRank" },
    { id: 6, name: "React.js Certification - Meta", issuer: "Meta" },
  ];

  // Get certification list with safe fallback
  const getCertList = () => {
    if (loading) return [];
    if (error) return fallbackCertifications;
    
    // Ensure we have an array and filter out null values
    const sourceCertifications = propCertifications ?? certifications;
    const safeCerts = Array.isArray(sourceCertifications) ? sourceCertifications : [];
    const filteredCerts = safeCerts.filter(cert => cert != null);
    
    if (filteredCerts.length === 0) {
      return fallbackCertifications;
    }
    
    return filteredCerts;
  };

  const certList = getCertList();
  const certIcons = ["🏅", "📜", "🎯", "⭐", "🏆", "📋"];

  // Safe calculation of stats with null checks
  const safeCertList = Array.isArray(certList) ? certList : [];
  const totalCertifications = safeCertList.length;
  
  const nptelCount = safeCertList.filter(cert => {
    if (!cert) return false;
    const certName = typeof cert === 'string' ? cert : (cert.name || '');
    return certName.includes("NPTEL");
  }).length;
  
  const hackerRankCount = safeCertList.filter(cert => {
    if (!cert) return false;
    const certName = typeof cert === 'string' ? cert : (cert.name || '');
    return certName.includes("HackerRank");
  }).length;

  // Render a single certification item
  const renderCertificationItem = (cert, index) => {
    if (!cert) return null;
    
    const iconIndex = index % certIcons.length;
    const displayName = typeof cert === 'string' ? cert : (cert.name || "Untitled Certification");
    const displayIssuer = typeof cert === 'string' ? "" : (cert.issuer || "");
    const displayCredential = typeof cert === 'string' ? "" : (cert.credential || "");
    const displayUrl = typeof cert === 'string' ? "" : (cert.url || "");
    const displayImage = typeof cert === 'string' ? "" : (cert.image || "");
    const displayDescription = typeof cert === 'string' ? "" : (cert.description || "");
    const certId = cert.id || `cert-${index}`;

    return (
      <div
        key={certId}
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
          {/* Image or Icon */}
          {displayImage ? (
            <div className="mb-2.5">
              <img
                src={getImageUrl(displayImage)}
                alt={displayName}
                className="h-14 w-14 rounded-lg object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Show fallback icon if image fails to load
                  const parent = e.target.parentElement;
                  const fallback = document.createElement('div');
                  fallback.className = `
                    flex h-14 w-14 items-center justify-center rounded-xl 
                    text-2xl transition-all duration-300 group-hover:scale-105 
                    group-hover:rotate-3
                  `;
                  fallback.style.backgroundColor = `${themeColors.primary}15`;
                  fallback.style.border = `1px solid ${themeColors.primary}30`;
                  fallback.style.color = themeColors.primary;
                  fallback.textContent = certIcons[iconIndex];
                  if (parent) {
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          ) : (
            <div
              className="
                mb-2.5
                flex
                h-14
                w-14
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
              {certIcons[iconIndex]}
            </div>
          )}

          {/* Certificate Name */}
          <h3
            className="
              mb-1
              text-sm
              font-semibold
              leading-relaxed
              transition-colors
              duration-300
              sm:text-base
            "
            style={{ color: themeColors.text }}
          >
            {displayName}
          </h3>

          {/* Issuer */}
          {displayIssuer && (
            <p
              className="mb-2 text-xs"
              style={{ color: themeColors.textSecondary }}
            >
              {displayIssuer}
            </p>
          )}

          {/* Credential ID */}
          {displayCredential && (
            <p
              className="mb-2 text-[10px]"
              style={{ color: themeColors.textSecondary }}
            >
              ID: {displayCredential}
            </p>
          )}

          {/* Description */}
          {displayDescription && (
            <p
              className="mb-2 text-xs"
              style={{ color: themeColors.textSecondary }}
            >
              {displayDescription}
            </p>
          )}

          {/* Verify Link */}
          {displayUrl && (
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:opacity-80 mb-2 inline-block"
              style={{ color: themeColors.primary }}
            >
              🔗 Verify Credential
            </a>
          )}

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
              e.currentTarget.style.backgroundColor = `${themeColors.primary}25`;
              e.currentTarget.style.borderColor = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${themeColors.primary}15`;
              e.currentTarget.style.borderColor = `${themeColors.primary}30`;
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
    );
  };

  // Render loading state
  if (loading) {
    return (
      <section
        id="certifications"
        className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        style={{ backgroundColor: themeColors.sectionBg }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: `${themeColors.primary}40`,
                borderTopColor: themeColors.primary,
              }}
            />
            <p className="mt-4" style={{ color: themeColors.textSecondary }}>
              Loading certifications...
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            {error 
              ? "Certifications that support my technical knowledge." 
              : "Certifications that support my technical knowledge and professional development."
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8 mb-6 rounded-xl border border-red-400/20 bg-red-400/10">
            <p className="text-red-400">{error}</p>
            <p className="text-sm mt-2" style={{ color: themeColors.textSecondary }}>
              Showing fallback certifications.
            </p>
          </div>
        )}

        {/* Certification Cards */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          {safeCertList.length > 0 ? (
            safeCertList.map((cert, idx) => renderCertificationItem(cert, idx))
          ) : (
            <div 
              className="col-span-1 md:col-span-2 text-center py-8 rounded-xl border"
              style={{
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBg,
              }}
            >
              <p style={{ color: themeColors.textSecondary }}>
                No certifications available.
              </p>
            </div>
          )}
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