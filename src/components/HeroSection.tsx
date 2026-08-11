import React, { useState } from 'react';
import { BookOpen, Mail, Phone, MapPin, Award, Sparkles, Download, CheckCircle, ExternalLink, ShieldCheck, Building, FileSpreadsheet, Globe, Link as LinkIcon, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profileData';
import { ProfileData } from '../types';

interface HeroSectionProps {
  onOpenAI: () => void;
  personalInfo?: ProfileData;
  theme?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenAI,
  personalInfo,
  theme = 'light'
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);

  const info = personalInfo || PERSONAL_INFO;
  const isLight = theme === 'light';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(info.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleDownloadCVPrint = () => {
    window.print();
  };

  return (
    <section id="overview" className={`pt-28 pb-20 relative overflow-hidden transition-colors duration-300 border-b ${
      isLight ? 'bg-[#F8FAFC] text-slate-900 border-indigo-200/80' : 'bg-[#0A0F1D] text-white border-indigo-500/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Editorial Header Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3.5 py-1 border rounded-full text-[10px] uppercase tracking-wider font-mono font-bold shadow-xs ${
                isLight ? 'border-indigo-300 text-indigo-950 bg-indigo-100/80' : 'border-indigo-500/30 text-indigo-200 bg-indigo-950/80'
              }`}>
                Head of Midwifery Dept
              </span>
              <span className={`px-3.5 py-1 border rounded-full text-[10px] uppercase tracking-wider font-mono font-bold shadow-xs ${
                isLight ? 'border-indigo-300 text-indigo-950 bg-indigo-100/80' : 'border-indigo-500/30 text-indigo-200 bg-indigo-950/80'
              }`}>
                {info.university || 'Werabe University, Ethiopia'}
              </span>
              <span className={`px-3.5 py-1 border rounded-full text-[10px] uppercase tracking-wider font-mono font-bold shadow-xs ${
                isLight ? 'border-indigo-300 text-indigo-950 bg-indigo-100/80' : 'border-indigo-500/30 text-indigo-200 bg-indigo-950/80'
              }`}>
                IRB Board Member
              </span>
            </div>

            {/* Title & Headline */}
            <div>
              <h1 className={`text-[52px] sm:text-[84px] lg:text-[96px] leading-[0.88] font-black tracking-[-0.04em] uppercase mb-6 ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                HASSEN MOSA<br />
                <span className={isLight ? 'text-indigo-600' : 'text-indigo-400'}>HALIL.</span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className={`w-20 h-[2px] mt-3 shrink-0 hidden sm:block ${isLight ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
                <div className="space-y-4">
                  <p className={`text-xl sm:text-2xl font-serif-editorial italic max-w-2xl leading-relaxed font-semibold ${
                    isLight ? 'text-indigo-950' : 'text-indigo-200'
                  }`}>
                    {info.title}
                  </p>
                  <p className={`text-sm font-sans max-w-2xl leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {info.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact quick links */}
            <div className={`flex flex-wrap items-center gap-3 text-xs font-mono pt-2 border-t ${
              isLight ? 'border-indigo-200 text-slate-800' : 'border-indigo-500/20 text-slate-200'
            }`}>
              <button
                onClick={handleCopyEmail}
                className={`inline-flex items-center gap-2 px-3.5 py-2 border transition-all cursor-pointer rounded-sm shadow-xs font-semibold ${
                  isLight ? 'border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-950' : 'border-indigo-500/30 bg-slate-900 hover:border-indigo-400 text-indigo-200'
                }`}
                title="Click to copy email address"
              >
                <Mail className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`} />
                <span>{info.email}</span>
                {copiedEmail ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-1" /> : null}
              </button>

              <a
                href={`tel:${info.phone.replace(/\s+/g, '')}`}
                className={`inline-flex items-center gap-2 px-3.5 py-2 border transition-all rounded-sm shadow-xs font-semibold ${
                  isLight ? 'border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-950' : 'border-indigo-500/30 bg-slate-900 hover:border-indigo-400 text-indigo-200'
                }`}
              >
                <Phone className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`} />
                <span>{info.phone}</span>
              </a>

              <div className={`inline-flex items-center gap-2 px-3.5 py-2 border rounded-sm font-semibold ${
                isLight ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-indigo-500/30 bg-slate-900/90 text-indigo-300'
              }`}>
                <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`} />
                <span>{info.location}</span>
              </div>
            </div>

            {/* Academic Profiles & Identifiers Badges */}
            {(info.orcid || info.googleScholar || info.researchGate || info.officeHours) && (
              <div className={`flex flex-wrap items-center gap-2 text-[11px] font-mono pt-1 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {info.orcid && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-sm font-bold ${
                    isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>ORCID: {info.orcid}</span>
                  </span>
                )}
                {info.googleScholar && (
                  <a
                    href={info.googleScholar}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-sm font-bold hover:underline ${
                      isLight ? 'bg-blue-100 border-blue-300 text-blue-950' : 'bg-blue-950/80 border-blue-500/40 text-blue-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                    <span>Google Scholar Profile</span>
                  </a>
                )}
                {info.researchGate && (
                  <a
                    href={info.researchGate}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-sm font-bold hover:underline ${
                      isLight ? 'bg-purple-100 border-purple-300 text-purple-950' : 'bg-purple-950/80 border-purple-500/40 text-purple-200'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                    <span>ResearchGate</span>
                  </a>
                )}
                {info.officeHours && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-sm font-bold ${
                    isLight ? 'bg-indigo-100 border-indigo-300 text-indigo-950' : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
                  }`}>
                    <Clock className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
                    <span>{info.officeHours}</span>
                  </span>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#publications"
                className={`px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 rounded-sm transition-all cursor-pointer shadow-md ${
                  isLight 
                    ? 'bg-indigo-950 text-white hover:bg-indigo-900' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>27 Peer-Reviewed Works</span>
              </a>

              <button
                onClick={onOpenAI}
                className={`px-6 py-3.5 border text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 rounded-sm transition-all cursor-pointer shadow-xs ${
                  isLight
                    ? 'bg-indigo-100/90 hover:bg-indigo-200/90 border-indigo-300 text-indigo-950'
                    : 'bg-indigo-950/90 hover:bg-indigo-900/90 border-indigo-500/40 text-white'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isLight ? 'text-indigo-800' : 'text-indigo-300'}`} />
                <span>Ask AI Research Assistant</span>
              </button>

              <button
                onClick={() => setShowCVModal(true)}
                className={`px-5 py-3.5 border text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 rounded-sm transition-all cursor-pointer shadow-xs ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Download className={`w-4 h-4 ${isLight ? 'text-slate-700' : 'text-slate-400'}`} />
                <span>Curriculum Vitae</span>
              </button>
            </div>

          </div>

          {/* Editorial Sidebar Specs Column */}
          <div className={`lg:col-span-4 border-l pl-0 lg:pl-8 space-y-8 ${
            isLight ? 'border-indigo-200' : 'border-indigo-500/20'
          }`}>
            
            {/* Status / Profile Identifier with Picture */}
            <div className={`p-6 rounded-sm border ${
              isLight ? 'bg-white border-indigo-200/90 shadow-sm' : 'bg-slate-900/90 border-indigo-500/30'
            }`}>
              {/* Profile Image if uploaded */}
              {info.profileImage && (
                <div className="mb-5 overflow-hidden rounded-sm border-2 border-indigo-300 dark:border-indigo-500/40 shadow-md">
                  <img 
                    src={info.profileImage} 
                    alt={info.name} 
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className={`flex justify-between items-center mb-4 pb-3 border-b ${
                isLight ? 'border-indigo-100' : 'border-indigo-500/20'
              }`}>
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${
                  isLight ? 'text-indigo-900' : 'text-indigo-300'
                }`}>FACULTY IDENTIFIER</span>
                <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>WERABE-MED-01</span>
              </div>
              <div className="space-y-1">
                <span className={`text-xl font-black tracking-tight block ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>{info.name.toUpperCase()}</span>
                <p className={`text-xs font-serif-editorial italic font-medium ${
                  isLight ? 'text-indigo-950' : 'text-indigo-200'
                }`}>Lecturer & Researcher in Public Health / Midwifery</p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div>
              <h2 className={`text-[10px] uppercase tracking-[0.3em] mb-4 font-bold ${
                isLight ? 'text-indigo-900' : 'text-indigo-300'
              }`}>ACADEMIC METRICS</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 border rounded-sm ${
                  isLight ? 'bg-white border-indigo-200' : 'bg-slate-900/90 border-indigo-500/30'
                }`}>
                  <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-indigo-950' : 'text-white'}`}>27</div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-indigo-300'}`}>Publications</div>
                </div>
                <div className={`p-4 border rounded-sm ${
                  isLight ? 'bg-white border-indigo-200' : 'bg-slate-900/90 border-indigo-500/30'
                }`}>
                  <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-indigo-950' : 'text-white'}`}>15+</div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-indigo-300'}`}>Review Journals</div>
                </div>
                <div className={`p-4 border rounded-sm ${
                  isLight ? 'bg-white border-indigo-200' : 'bg-slate-900/90 border-indigo-500/30'
                }`}>
                  <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-indigo-950' : 'text-white'}`}>04</div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-indigo-300'}`}>Editorial Boards</div>
                </div>
                <div className={`p-4 border rounded-sm ${
                  isLight ? 'bg-white border-indigo-200' : 'bg-slate-900/90 border-indigo-500/30'
                }`}>
                  <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-indigo-950' : 'text-white'}`}>12+</div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-indigo-300'}`}>Years Experience</div>
                </div>
              </div>
            </div>

            {/* Languages List */}
            <div>
              <h2 className={`text-[10px] uppercase tracking-[0.3em] mb-3 font-bold ${
                isLight ? 'text-indigo-900' : 'text-indigo-300'
              }`}>LANGUAGES</h2>
              <div className="flex flex-wrap gap-2">
                {info.languages.map((lang) => (
                  <span 
                    key={lang.language} 
                    className={`px-3.5 py-1 border text-[10px] uppercase tracking-wider font-mono font-bold rounded-full ${
                      isLight ? 'border-indigo-300 bg-white text-indigo-950 shadow-xs' : 'border-indigo-500/30 bg-slate-900 text-indigo-200'
                    }`}
                  >
                    {lang.language} &bull; {lang.level}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* CV Modal / Printable Preview */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-sm max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto ${
            isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#0A0A0A] border-white/20 text-zinc-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-stone-200' : 'border-white/10'
            }`}>
              <h3 className={`text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}>
                <FileSpreadsheet className="w-4 h-4 text-stone-500" />
                Curriculum Vitae — {info.name}
              </h3>
              <button
                onClick={() => setShowCVModal(false)}
                className="text-stone-400 hover:text-stone-900 text-xs uppercase tracking-widest font-semibold p-1 cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <div className="py-6 space-y-4 text-xs font-sans">
              <p className="leading-relaxed">
                <strong className="uppercase tracking-wider">Name:</strong> {info.name} <br />
                <strong className="uppercase tracking-wider">Current Role:</strong> {info.title} <br />
                <strong className="uppercase tracking-wider">Email:</strong> {info.email} | <strong>Phone:</strong> {info.phone} <br />
                <strong className="uppercase tracking-wider">Address:</strong> {info.location}
              </p>

              <div className={`p-4 border text-xs leading-relaxed font-serif-editorial italic ${
                isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-zinc-900 border-white/10 text-zinc-400'
              }`}>
                This academic portfolio website contains verified research metrics across 27 peer-reviewed publications, 15 international peer review journals, 4 editorial appointments, training certificates, and educational history.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCVPrint}
                  className={`px-5 py-3 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-colors cursor-pointer rounded-sm ${
                    isLight ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>

                <a
                  href="#publications"
                  onClick={() => setShowCVModal(false)}
                  className={`px-5 py-3 font-semibold text-[10px] uppercase tracking-[0.2em] border transition-colors rounded-sm ${
                    isLight ? 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200' : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'
                  }`}
                >
                  Browse Publications
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
