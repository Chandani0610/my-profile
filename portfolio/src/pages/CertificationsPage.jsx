// pages/CertificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Eye, 
  Copy, 
  Check, 
  Filter, 
  Sparkles,
  Building2,
  Calendar,
  X
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import resumeData from '../data/resumeData';
import API, { getImageUrl } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function CertificationsPage() {
  const { currentTheme, themeColors } = useTheme();

  const [certifications, setCertifications] = useState(resumeData.certifications || []);
  const [selectedIssuer, setSelectedIssuer] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load certifications from API or fallback
  useEffect(() => {
    const loadCerts = async () => {
      try {
        const res = await API.get('/portfolio');
        if (res.data?.success && Array.isArray(res.data.data?.certifications) && res.data.data.certifications.length > 0) {
          const merged = res.data.data.certifications.map((item, idx) => {
            const fallback = resumeData.certifications[idx] || {};
            return {
              id: item.id || fallback.id || idx + 1,
              title: item.certification_name || item.title || fallback.title,
              issuer: item.issuer || fallback.issuer || 'Professional Organization',
              credential: item.credential || fallback.credential || (fallback.id === 8 ? 'ID: FBCED9F0E3A3' : null),
              image: item.image || fallback.image || '/uploads/certifications/cert-1788807884045-868142352.png',
              link: item.link || fallback.link || '#'
            };
          });
          setCertifications(merged);
        }
      } catch {
        // Fallback to resumeData
      }
    };
    loadCerts();
  }, []);

  // Filter logic
  const issuers = ['All', 'NPTEL', 'HackerRank', 'HP LIFE', 'IES UNIVERSITY', 'Forage', 'MIC INSTITUTE'];

  const filteredCerts = certifications.filter((cert) => {
    const titleMatch = (cert.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const issuerMatch = (cert.issuer || '').toLowerCase().includes(searchQuery.toLowerCase());
    const credentialMatch = (cert.credential || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || issuerMatch || credentialMatch;

    if (selectedIssuer === 'All') return matchesSearch;
    return matchesSearch && (cert.issuer || '').toLowerCase().includes(selectedIssuer.toLowerCase());
  });

  const handleCopy = (idText, certId) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      {/* Main Header */}
      <Header />

      <main className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-bold text-purple-300">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>11 Verified Certificates</span>
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>Verified Credentials & Honors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Licenses & Certifications
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Showcasing continuous learning and validated expertise across Cloud Computing, Database Management Systems, Problem Solving, Software Engineering, and Professional Leadership.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-10 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by certification title, issuer, or credential ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/70 pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold px-1.5 py-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between md:justify-end gap-2 shrink-0">
              <span>Showing</span>
              <span className="font-bold text-white px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                {filteredCerts.length} of {certifications.length}
              </span>
              <span>Credentials</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Issuer:</span>
            </span>
            {issuers.map((issuer) => {
              const count = issuer === 'All' 
                ? certifications.length 
                : certifications.filter(c => (c.issuer || '').toLowerCase().includes(issuer.toLowerCase())).length;

              const isSelected = selectedIssuer === issuer;
              return (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(issuer)}
                  className={"shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 " + (
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold scale-[1.02]"
                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/60"
                  )}
                >
                  <span>{issuer}</span>
                  <span className={"text-[10px] px-1.5 py-0.2 rounded-full " + (
                    isSelected ? "bg-white/25 text-white" : "bg-slate-700 text-slate-300"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            CERTIFICATIONS GRID (3 COLUMNS)
        ========================================================= */}
        {filteredCerts.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 py-16 text-center">
            <Award className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-3 text-base font-bold text-white">No certifications found</h3>
            <p className="mt-1 text-xs text-slate-400">Try changing your search keywords or issuer filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedIssuer('All'); }}
              className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert, index) => {
              const imgUrl = getImageUrl(cert.image);
              return (
                <div
                  key={cert.id || index}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-600/15 overflow-hidden"
                >
                  {/* Card Thumbnail / Preview */}
                  <div 
                    onClick={() => setSelectedCert(cert)}
                    className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer border-b border-slate-800/80"
                  >
                    <img
                      src={imgUrl}
                      alt={cert.title}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                        e.target.parentElement.innerHTML = '<div class="text-center p-4"><div class="text-4xl mb-2">📜</div><p class="text-xs font-bold text-purple-400">Verified Certificate</p></div>';
                      }}
                    />

                    {/* Verified Overlay Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 shadow-md">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Verified</span>
                    </div>

                    {/* Click to Zoom Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white">
                      <Eye className="h-4 w-4" />
                      <span>Click to View Full Certificate</span>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Issuer Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
                          {cert.issuer}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                        {cert.title}
                      </h3>

                      {/* Credential ID badge if present */}
                      {cert.credential && (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-1.5 text-xs text-slate-400">
                          <span className="truncate font-mono text-[11px] text-slate-300">
                            {cert.credential}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(cert.credential.replace(/^ID:\s*/i, ''), cert.id);
                            }}
                            className="ml-2 p-1 text-slate-400 hover:text-white rounded transition"
                            title="Copy Credential ID"
                          >
                            {copiedId === cert.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-purple-600/20"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Certificate</span>
                      </button>

                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 p-2.5 text-slate-300 hover:text-white transition"
                        title="Open high resolution image"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* =========================================================
          FULL-SCREEN HIGH-RES CERTIFICATE MODAL VIEWER
      ========================================================= */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium">
                    {selectedCert.issuer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getImageUrl(selectedCert.image)}
                  download={selectedCert.title.replace(/[^a-zA-Z0-9]/g, '_') + "_Certificate.png"}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/90 flex items-center justify-center min-h-[300px]">
              <img
                src={getImageUrl(selectedCert.image)}
                alt={selectedCert.title}
                className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
              />
            </div>

            {/* Modal Footer with Credential Details */}
            <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">Official Verified Credential</span>
                {selectedCert.credential && (
                  <span className="text-slate-300 font-mono ml-2">• {selectedCert.credential}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={getImageUrl(selectedCert.image)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
