// components/Certifications.jsx
import { useState, useMemo } from "react";
import { 
  Award, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Eye, 
  Building2, 
  Sparkles 
} from "lucide-react";
import resumeData from "../data/resumeData";
import { getImageUrl } from "../services/api";

export default function Certifications({ certifications: initialCerts }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fallbackCerts = resumeData.certifications || [];
  const certs = (initialCerts && initialCerts.length > 0) ? initialCerts : fallbackCerts;

  // Normalizing certificates data
  const normalizedCerts = useMemo(() => {
    return certs.map((c, idx) => {
      const title = c.title || c.certification_name || c.name || "Professional Certificate";
      let issuer = c.issuer || "Accredited Organization";
      // Clean up common variations
      if (issuer.includes("HP LIFE")) issuer = "HP LIFE | HP Foundation";
      if (issuer.includes("IES")) issuer = "IES UNIVERSITY";
      if (issuer.includes("MIC")) issuer = "MIC INSTITUTE OF TECHNOLOGY";

      // Fallback images based on title/issuer if image is null
      let image = c.image;
      if (!image) {
        const match = fallbackCerts.find(f => 
          (f.title && title && f.title.toLowerCase() === title.toLowerCase()) ||
          (f.name && title && f.name.toLowerCase() === title.toLowerCase())
        );
        image = match ? match.image : null;
      }

      // Credential ID
      let credential = c.credential || null;
      if (!credential && title.includes("Problem Solving (Basic)")) {
        credential = "ID: FBCED9F0E3A3";
      }

      return {
        id: c.id || idx + 1,
        title,
        issuer,
        credential,
        image,
        link: c.link || c.url || null
      };
    });
  }, [certs, fallbackCerts]);

  // Extract unique issuers for filter pills
  const issuerList = useMemo(() => {
    const counts = {};
    normalizedCerts.forEach(c => {
      counts[c.issuer] = (counts[c.issuer] || 0) + 1;
    });

    const issuers = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return [
      { name: "All", count: normalizedCerts.length },
      ...issuers.map(name => ({ name, count: counts[name] }))
    ];
  }, [normalizedCerts]);

  // Filtered list based on activeFilter and searchQuery
  const filteredCerts = useMemo(() => {
    return normalizedCerts.filter(c => {
      const matchesFilter = activeFilter === "All" || c.issuer.toLowerCase() === activeFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.title.toLowerCase().includes(q) || 
        c.issuer.toLowerCase().includes(q) ||
        (c.credential && c.credential.toLowerCase().includes(q));
      
      return matchesFilter && matchesSearch;
    });
  }, [normalizedCerts, activeFilter, searchQuery]);

  const handleCopy = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certifications" className="relative w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Certifications & Achievements</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              <span>{normalizedCerts.length} Total</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Verified Certifications & Licenses
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Professional credentials, academic excellence awards, and technical certifications earned in Software Engineering, DBMS, Cloud Computing, and Problem Solving.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none mb-6">
          {issuerList.map((item) => {
            const isActive = activeFilter === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveFilter(item.name)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-700 text-white shadow-md shadow-purple-600/25 font-semibold"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50/50 hover:text-purple-700"
                }`}
              >
                <span>{item.name}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Certifications Grid */}
        {filteredCerts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <Award className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No certifications found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No matching credentials for "{searchQuery}" in {activeFilter}
            </p>
            <button
              onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10"
              >
                <div>
                  {/* Certificate Image Preview / Thumbnail */}
                  <div 
                    onClick={() => setSelectedCert(cert)}
                    className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-slate-100 border-b border-slate-100 flex items-center justify-center"
                  >
                    {cert.image ? (
                      <img
                        src={getImageUrl(cert.image)}
                        alt={cert.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add("bg-gradient-to-br", "from-purple-100", "to-indigo-50");
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-purple-400">
                        <Award className="h-12 w-12 stroke-[1.5]" />
                        <span className="text-[10px] font-semibold text-purple-600 mt-1">Verified Credential</span>
                      </div>
                    )}

                    {/* Overlay badge with Eye icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-lg">
                        <Eye className="h-3.5 w-3.5 text-purple-600" />
                        <span>Inspect Certificate</span>
                      </span>
                    </div>

                    {/* Verified ribbon */}
                    <div className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-xs backdrop-blur-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    {/* Issuer Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{cert.issuer}</span>
                    </div>

                    {/* Certificate Title */}
                    <h3 
                      onClick={() => setSelectedCert(cert)}
                      className="mt-1.5 text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer transition hover:text-purple-700"
                    >
                      {cert.title}
                    </h3>

                    {/* Credential ID row with copy */}
                    {cert.credential && (
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-1.5 text-[11px] font-mono text-slate-600 border border-slate-100">
                        <span className="truncate">{cert.credential}</span>
                        <button
                          onClick={() => handleCopy(cert.id, cert.credential)}
                          className="ml-2 shrink-0 text-purple-600 hover:text-purple-800 transition"
                          title="Copy Credential ID"
                        >
                          {copiedId === cert.id ? (
                            <span className="flex items-center gap-0.5 text-emerald-600 font-bold text-[10px]">
                              <Check className="h-3 w-3" />
                              <span>Copied</span>
                            </span>
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 transition group-hover:text-purple-900"
                  >
                    <span>View Certificate</span>
                    <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </button>

                  {cert.image && (
                    <a
                      href={getImageUrl(cert.image)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-slate-500 hover:text-purple-700 flex items-center gap-1"
                      title="Open full size image"
                    >
                      <span>Full View</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ====================================================
          FULL HIGH-RESOLUTION CERTIFICATE LIGHTBOX MODAL
      ==================================================== */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    {selectedCert.issuer}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
                <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900 truncate">
                  {selectedCert.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="flex-1 overflow-auto bg-[#0a0f1d] p-4 sm:p-6 flex items-center justify-center min-h-[350px]">
              {selectedCert.image ? (
                <img
                  src={getImageUrl(selectedCert.image)}
                  alt={selectedCert.title}
                  className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
                />
              ) : (
                <div className="py-16 text-center text-slate-300">
                  <Award className="mx-auto h-20 w-20 text-purple-400 mb-3" />
                  <p className="text-base font-bold text-white">{selectedCert.title}</p>
                  <p className="text-xs text-slate-400 mt-1">Issued by {selectedCert.issuer}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-6 py-3.5 bg-slate-50">
              <div className="text-xs text-slate-500">
                {selectedCert.credential ? (
                  <span className="font-mono">Credential ID: <strong className="text-slate-800">{selectedCert.credential}</strong></span>
                ) : (
                  <span>Official Certificate Issued to <strong>Chandani Kumari</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedCert.image && (
                  <a
                    href={getImageUrl(selectedCert.image)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 text-xs font-semibold shadow-sm transition"
                  >
                    <span>Open High-Res</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
