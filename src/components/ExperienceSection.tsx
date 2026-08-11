import React, { useState } from 'react';
import { Briefcase, GraduationCap, Building2, MapPin, Calendar, CheckCircle2, Award } from 'lucide-react';
import { WORK_EXPERIENCES, EDUCATION_LIST } from '../data/profileData';
import { ExperienceItem } from '../types';

interface ExperienceSectionProps {
  experiences?: ExperienceItem[];
  theme?: 'light' | 'dark';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, theme = 'light' }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const isLight = theme === 'light';
  const activeExperiences = experiences && experiences.length > 0 ? experiences : WORK_EXPERIENCES;

  return (
    <section id="experience" className={`py-20 border-b transition-colors duration-300 ${
      isLight ? 'bg-[#FFFBEB] text-amber-950 border-amber-300/80' : 'bg-[#1C130B] text-white border-amber-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] ${
            isLight ? 'text-amber-950' : 'text-white'
          }`}>
            Academic Faculty & Degrees
          </h2>
          <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic font-medium ${
            isLight ? 'text-amber-900/90' : 'text-amber-200/90'
          }`}>
            Timeline of university faculty appointments, department leadership, research administration, and higher education qualifications.
          </p>

          {/* Toggle Buttons */}
          <div className={`inline-flex items-center p-1 border rounded-sm mt-6 gap-1 shadow-xs ${
            isLight ? 'bg-white border-amber-300' : 'bg-amber-950/80 border-amber-500/30'
          }`}>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] font-black transition-all cursor-pointer rounded-sm ${
                activeTab === 'experience'
                  ? isLight ? 'bg-amber-950 text-white shadow-xs' : 'bg-amber-500 text-black shadow-xs'
                  : isLight ? 'text-amber-900 hover:text-amber-950' : 'text-amber-300 hover:text-white'
              }`}
            >
              Academic Positions ({activeExperiences.length})
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] font-black transition-all cursor-pointer rounded-sm ${
                activeTab === 'education'
                  ? isLight ? 'bg-amber-950 text-white shadow-xs' : 'bg-amber-500 text-black shadow-xs'
                  : isLight ? 'text-amber-900 hover:text-amber-950' : 'text-amber-300 hover:text-white'
              }`}
            >
              Higher Education Degrees ({EDUCATION_LIST.length})
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'experience' ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {activeExperiences.map((exp) => (
              <div
                key={exp.id}
                className={`border rounded-sm p-6 sm:p-8 relative transition-all ${
                  isLight
                    ? 'bg-white border-amber-300/80 hover:border-amber-400 shadow-xs'
                    : 'bg-amber-950/60 border-amber-500/30 hover:border-amber-400'
                }`}
              >
                {/* Visual timeline node */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
                  isLight ? 'border-amber-200' : 'border-amber-500/20'
                }`}>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 font-bold ${
                      isLight ? 'text-amber-900' : 'text-amber-300'
                    }`}>
                      {exp.institution}
                    </span>
                    <h3 className={`text-lg font-bold tracking-tight ${
                      isLight ? 'text-amber-950' : 'text-white'
                    }`}>
                      {exp.role}
                    </h3>
                  </div>

                  <div className={`flex flex-wrap items-center gap-2 text-xs font-mono ${
                    isLight ? 'text-amber-900' : 'text-amber-200'
                  }`}>
                    <span className={`px-3 py-1 border rounded-sm font-bold ${
                      isLight ? 'bg-amber-100 border-amber-300 text-amber-950' : 'bg-[#120B05] border-amber-500/40 text-amber-200'
                    }`}>
                      {exp.period}
                    </span>
                    <span className={`px-2.5 py-1 border rounded-sm font-medium ${
                      isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-[#120B05] border-amber-500/30 text-amber-300'
                    }`}>
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div className="pt-4 space-y-3">
                  <h4 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold ${
                    isLight ? 'text-amber-900' : 'text-amber-300'
                  }`}>
                    Faculty & Departmental Responsibilities:
                  </h4>
                  <ul className={`space-y-2 text-xs font-sans ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isLight ? 'text-amber-700' : 'text-amber-400'
                        }`} />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {EDUCATION_LIST.map((edu) => (
              <div
                key={edu.id}
                className={`border rounded-sm p-6 transition-all flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-amber-300/80 hover:border-amber-400 shadow-xs'
                    : 'bg-amber-950/60 border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b pb-3 ${
                    isLight ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                      isLight ? 'text-amber-900' : 'text-amber-300'
                    }`}>
                      {edu.date}
                    </span>
                    <span className={`text-[10px] font-mono font-medium ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                      {edu.location}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold leading-snug ${
                    isLight ? 'text-amber-950' : 'text-white'
                  }`}>
                    {edu.degree}
                  </h3>

                  <p className={`text-xs font-mono font-semibold ${
                    isLight ? 'text-amber-900' : 'text-amber-200'
                  }`}>
                    {edu.institution}
                  </p>

                  {edu.details && (
                    <p className={`text-xs p-3.5 border leading-relaxed font-serif-editorial italic ${
                      isLight ? 'bg-amber-50/70 text-amber-950 border-amber-200' : 'bg-[#120B05] text-amber-200 border-amber-500/30'
                    }`}>
                      {edu.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
