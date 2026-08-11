import React, { useState } from 'react';
import { Award, CheckCircle, GraduationCap, Search, Sparkles, BookOpenCheck } from 'lucide-react';
import { CERTIFICATES_AND_TRAININGS, AWARDS, SKILL_HIGHLIGHTS } from '../data/profileData';

interface SkillsCertificatesSectionProps {
  theme?: 'light' | 'dark';
}

export const SkillsCertificatesSection: React.FC<SkillsCertificatesSectionProps> = ({ theme = 'light' }) => {
  const [certFilter, setCertFilter] = useState('');
  const isLight = theme === 'light';

  const filteredCerts = CERTIFICATES_AND_TRAININGS.filter((cert) =>
    cert.title.toLowerCase().includes(certFilter.toLowerCase()) ||
    cert.organizer.toLowerCase().includes(certFilter.toLowerCase()) ||
    (cert.category && cert.category.toLowerCase().includes(certFilter.toLowerCase()))
  );

  return (
    <section id="skills" className={`py-20 border-b transition-colors duration-300 ${
      isLight ? 'bg-[#FFF7ED] text-orange-950 border-orange-300/80' : 'bg-[#1F1008] text-white border-orange-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] ${
            isLight ? 'text-orange-950' : 'text-white'
          }`}>
            Honors, Skills & Certification
          </h2>
          <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic font-medium ${
            isLight ? 'text-orange-900/90' : 'text-orange-200/90'
          }`}>
            Recognized research excellence awards, certified technical competencies in statistical packages, clinical preceptorship, and specialized training.
          </p>
        </div>

        {/* Awards Highlights */}
        <div className="mb-16">
          <h3 className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold ${
            isLight ? 'text-orange-900' : 'text-orange-300'
          }`}>
            <Sparkles className={`w-4 h-4 ${isLight ? 'text-orange-800' : 'text-orange-300'}`} />
            University Research Excellence Awards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AWARDS.map((award, idx) => (
              <div
                key={idx}
                className={`border rounded-sm p-6 flex items-start gap-4 transition-all ${
                  isLight
                    ? 'bg-white border-orange-200 hover:border-orange-400 shadow-xs'
                    : 'bg-orange-950/60 border-orange-500/30 hover:border-orange-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-sm font-black flex items-center justify-center shrink-0 text-base font-mono ${
                  isLight ? 'bg-orange-900 text-white shadow-xs' : 'bg-orange-500 text-black shadow-xs'
                }`}>
                  ★
                </div>
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                    isLight ? 'text-orange-900' : 'text-orange-300'
                  }`}>
                    Award Year {award.year}
                  </span>
                  <h4 className={`text-base font-bold mt-0.5 ${
                    isLight ? 'text-orange-950' : 'text-white'
                  }`}>
                    {award.title}
                  </h4>
                  <p className={`text-xs mt-1 font-serif-editorial italic font-medium ${
                    isLight ? 'text-orange-900/80' : 'text-orange-200/80'
                  }`}>
                    Awarded by {award.institution} for outstanding research contributions.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Competency Grid */}
        <div className="mb-16">
          <h3 className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold ${
            isLight ? 'text-orange-900' : 'text-orange-300'
          }`}>
            <BookOpenCheck className={`w-4 h-4 ${isLight ? 'text-orange-800' : 'text-orange-300'}`} />
            Core Research & Methodology Competencies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SKILL_HIGHLIGHTS.map((skill, idx) => (
              <div
                key={idx}
                className={`border rounded-sm p-4 flex items-start gap-3 transition-colors ${
                  isLight
                    ? 'bg-white border-orange-200 hover:border-orange-300 shadow-xs'
                    : 'bg-orange-950/60 border-orange-500/30 hover:border-orange-400'
                }`}
              >
                <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                  isLight ? 'text-orange-700' : 'text-orange-400'
                }`} />
                <span className={`text-xs font-mono leading-snug font-semibold ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates & Specialized Training */}
        <div>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4 ${
            isLight ? 'border-orange-200' : 'border-orange-500/20'
          }`}>
            <div>
              <h3 className={`text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold ${
                isLight ? 'text-orange-900' : 'text-orange-300'
              }`}>
                <GraduationCap className={`w-4 h-4 ${isLight ? 'text-orange-800' : 'text-orange-300'}`} />
                Professional Training & Certificates ({CERTIFICATES_AND_TRAININGS.length})
              </h3>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-orange-500' : 'text-orange-400'
              }`} />
              <input
                type="text"
                value={certFilter}
                onChange={(e) => setCertFilter(e.target.value)}
                placeholder="Search certificates..."
                className={`w-full pl-9 pr-3 py-2 rounded-sm border text-xs font-mono focus:outline-none ${
                  isLight
                    ? 'bg-white border-orange-300 text-orange-950 placeholder-orange-400 focus:border-orange-600'
                    : 'bg-[#140B05] border-orange-500/30 text-white placeholder-orange-400 focus:border-orange-400'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCerts.map((cert, idx) => (
              <div
                key={idx}
                className={`border rounded-sm p-5 transition-all flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-orange-200 hover:border-orange-300 shadow-xs'
                    : 'bg-orange-950/60 border-orange-500/30 hover:border-orange-400'
                }`}
              >
                <div className="space-y-3">
                  <div className={`flex items-center justify-between gap-2 border-b pb-2 ${
                    isLight ? 'border-orange-100' : 'border-orange-500/20'
                  }`}>
                    {cert.category && (
                      <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                        isLight ? 'text-orange-900' : 'text-orange-300'
                      }`}>
                        {cert.category}
                      </span>
                    )}
                    <span className={`text-[10px] font-mono font-semibold ${isLight ? 'text-orange-800' : 'text-orange-300'}`}>
                      {cert.date}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${isLight ? 'text-orange-950' : 'text-white'}`}>
                    {cert.title}
                  </h4>

                  <p className={`text-xs font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <strong className={isLight ? 'text-orange-950' : 'text-orange-200'}>Organized by:</strong> {cert.organizer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
