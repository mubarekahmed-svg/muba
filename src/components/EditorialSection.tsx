import React, { useState } from 'react';
import { FileText, CheckCircle, ShieldCheck, Search, Award, Star } from 'lucide-react';
import { EDITORIAL_BOARDS, REVIEWER_JOURNALS } from '../data/profileData';

interface EditorialSectionProps {
  theme?: 'light' | 'dark';
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({ theme = 'light' }) => {
  const [searchJournal, setSearchJournal] = useState('');
  const isLight = theme === 'light';

  const filteredReviewerJournals = REVIEWER_JOURNALS.filter((j) =>
    j.journal.toLowerCase().includes(searchJournal.toLowerCase())
  );

  return (
    <section id="editorial" className={`py-20 border-b transition-colors duration-300 relative overflow-hidden ${
      isLight ? 'bg-[#FAF5FF] text-purple-950 border-purple-300/80' : 'bg-[#140A21] text-white border-purple-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] ${
            isLight ? 'text-purple-950' : 'text-white'
          }`}>
            Editorial Governance & Peer Review
          </h2>
          <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic font-medium ${
            isLight ? 'text-purple-900/90' : 'text-purple-200/90'
          }`}>
            Editorial board appointments and peer reviewer contributions for leading international medical, public health, and reproductive health journals.
          </p>
        </div>

        {/* Editorial Boards Section */}
        <div className="mb-16">
          <h3 className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold ${
            isLight ? 'text-purple-900' : 'text-purple-300'
          }`}>
            <Star className={`w-4 h-4 ${isLight ? 'text-purple-800' : 'text-purple-300'}`} />
            Editorial Board Memberships (4 Journals)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITORIAL_BOARDS.map((ed, idx) => (
              <div
                key={idx}
                className={`border rounded-sm p-6 transition-all flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-purple-200 hover:border-purple-400 shadow-xs'
                    : 'bg-purple-950/60 border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <div className="space-y-3">
                  <div className={`flex items-center justify-between border-b pb-3 ${
                    isLight ? 'border-purple-100' : 'border-purple-500/20'
                  }`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                      isLight ? 'text-purple-900' : 'text-purple-300'
                    }`}>
                      {ed.role}
                    </span>
                    <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-purple-700' : 'text-purple-400'}`} />
                  </div>
                  <h4 className={`text-base font-bold leading-snug ${
                    isLight ? 'text-purple-950' : 'text-white'
                  }`}>
                    {ed.journal}
                  </h4>
                  {ed.section && (
                    <p className={`text-xs font-serif-editorial italic font-medium ${
                      isLight ? 'text-purple-900/80' : 'text-purple-200/80'
                    }`}>
                      {ed.section}
                    </p>
                  )}
                </div>

                <div className={`pt-4 mt-4 border-t text-[10px] font-mono uppercase tracking-wider font-bold ${
                  isLight ? 'border-purple-100 text-purple-700' : 'border-purple-500/20 text-purple-300'
                }`}>
                  Journal Governance
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Reviewer Journals Section */}
        <div>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4 ${
            isLight ? 'border-purple-200' : 'border-purple-500/20'
          }`}>
            <h3 className={`text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold ${
              isLight ? 'text-purple-900' : 'text-purple-300'
            }`}>
              <Award className={`w-4 h-4 ${isLight ? 'text-purple-800' : 'text-purple-300'}`} />
              Peer Reviewer Panel ({REVIEWER_JOURNALS.length} Journals)
            </h3>

            <div className="relative max-w-xs w-full">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-purple-500' : 'text-purple-400'
              }`} />
              <input
                type="text"
                value={searchJournal}
                onChange={(e) => setSearchJournal(e.target.value)}
                placeholder="Search reviewer journals..."
                className={`w-full pl-9 pr-3 py-2 rounded-sm border text-xs font-mono focus:outline-none ${
                  isLight
                    ? 'bg-white border-purple-300 text-purple-950 placeholder-purple-400 focus:border-purple-600'
                    : 'bg-[#0E0617] border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredReviewerJournals.map((rev, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-sm border transition-colors flex items-center gap-3 ${
                  isLight
                    ? 'bg-white border-purple-200 hover:border-purple-300 shadow-xs'
                    : 'bg-purple-950/60 border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <CheckCircle className={`w-4 h-4 shrink-0 ${
                  isLight ? 'text-purple-700' : 'text-purple-400'
                }`} />
                <div>
                  <h5 className={`text-xs font-bold ${
                    isLight ? 'text-purple-950' : 'text-white'
                  }`}>
                    {rev.journal}
                  </h5>
                  <span className={`text-[10px] font-mono uppercase font-semibold ${
                    isLight ? 'text-purple-800' : 'text-purple-300'
                  }`}>
                    Peer Reviewer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
