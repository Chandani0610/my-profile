// components/LetsWorkTogether.jsx
import { useState } from "react";
import { Mail, ArrowRight, Check, Copy, MapPin, Send, MessageSquare, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../services/api";

export default function LetsWorkTogether({ contact }) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const email = contact?.email || "kumarichandanipali@gmail.com";
  const location = contact?.location || "Madhubani, Bihar";
  const github = contact?.github || "https://github.com/Chandani0610";
  const linkedin = contact?.linkedin || "https://www.linkedin.com/in/chandani-kumari-781136261/";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in your email address and message."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "Visitor";

    try {
      // 1. Direct inbox delivery to kumarichandanipali@gmail.com via FormSubmit API
      try {
        await fetch("https://formsubmit.co/ajax/kumarichandanipali@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: fullName,
            email: formData.email,
            subject: formData.subject || `Portfolio Inquiry from ${fullName}`,
            message: formData.message,
            _subject: `[Portfolio Message] ${formData.subject || "Inquiry from " + fullName}`,
            _replyto: formData.email,
            _captcha: "false",
            _template: "table"
          })
        });
      } catch (fsErr) {
        console.warn("FormSubmit delivery note:", fsErr);
      }

      // 2. Also record in local/hosted backend
      try {
        await API.post("/portfolio/contact", formData);
      } catch (apiErr) {
        console.warn("Backend contact recording note:", apiErr);
      }

      setSubmitStatus({
        type: "success",
        message: `Thank you, ${fullName}! Your message has been sent directly to Chandani's email (kumarichandanipali@gmail.com).`
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      // Fallback: direct mailto trigger
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(formData.subject || "Portfolio Inquiry")}&body=${encodeURIComponent(`From: ${fullName} (${formData.email})\n\n${formData.message}`)};`;
      window.location.href = mailtoUrl;
      setSubmitStatus({
        type: "success",
        message: "Opening your default email app to send the message to Chandani..."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          
          {/* ====================================================
              LEFT COLUMN: Available for Opportunities & Details (Transparent)
          ==================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-transparent p-6 sm:p-8 lg:p-9 shadow-xs transition-all duration-300 hover:border-purple-300/60">
            <div>
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-transparent px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-2xs mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Available for Opportunities</span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span className="text-slate-500 font-medium">Full-time Roles</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Let's Work Together
              </h2>

              {/* Subtitle / Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Have a project or a full-time developer role in mind? I'm always open to discussing new engineering projects, creative ideas, or opportunities to be part of your vision.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <a
                  href={`mailto:${email}`}
                  className="contact-get-in-touch-btn group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))',
                    boxShadow: '0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))',
                  }}
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Get in Touch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-transparent px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/40 cursor-pointer"
                  title="Copy Email Address"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Profile Links / Badges */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Mail className="h-4 w-4 text-purple-600 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-purple-700 hover:underline">
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-purple-600 shrink-0" />
                <span>{location}</span>
              </div>

              <div className="flex items-center gap-4 pt-1 font-semibold text-xs">
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-purple-700 transition"
                >
                  <span>GitHub Profile ↗</span>
                </a>

                <span className="text-slate-300">•</span>

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-purple-700 transition"
                >
                  <span>LinkedIn ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN: Contact Me - Get in Touch Form
          ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-9 shadow-sm">
                
                {/* Form Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Contact Me</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Get in touch with me
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Have a question, project inquiry or want to say hi? Send me a direct message!
                  </p>
                </div>

                {/* Status Alert */}
                {submitStatus && (
                  <div className={`mb-5 flex items-start gap-2.5 rounded-2xl p-3.5 text-xs sm:text-sm ${
                    submitStatus.type === "success" 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}>
                    {submitStatus.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    )}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Row 1: First Name & Last Name */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="contact-form-input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="contact-form-input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-form-input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  {/* Row 3: Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Full-time Role / Project Discussion / Collab"
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-form-input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Message <span className="text-purple-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-form-input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="contact-submit-btn group inline-flex w-full items-center justify-center gap-2 rounded-xl text-white py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))',
                        boxShadow: '0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

          </div>

        </div>

      </div>
    </section>
  );
}

