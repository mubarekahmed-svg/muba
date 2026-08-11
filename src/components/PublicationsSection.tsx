import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Copy, Check, Filter, Layers, BarChart2, BookOpen, Quote, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { PUBLICATIONS_LIST } from '../data/profileData';
import { Publication } from '../types';

interface PublicationsSectionProps {
  publications?: Publication[];
  theme?: 'light' | 'dark';
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications, theme = 'light' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<number | null>(null);
  const [showCitationModal, setShowCitationModal] = useState<Publication | null>(null);

  const isLight = theme === 'light';
  const activePubs = publications && publications.length > 0 ? publications : PUBLICATIONS_LIST;

  // Category filters
  const categories = [
    { id: 'all', label: `All Research (${activePubs.length})` },
    { id: 'maternal', label: 'Maternal & Obstetric Care' },
    { id: 'neonatal', label: 'Neonatal & Asphyxia' },
    { id: 'preterm', label: 'Preterm Birth & Labor' },
    { id: 'health-systems', label: 'Health Systems' },
    { id: 'general', label: 'General Medicine' },
  ];

  // Filtered publications
  const filteredPubs = useMemo(() => {
    return activePubs.filter((pub) => {
      const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        pub.title.toLowerCase().includes(query) ||
        pub.authors.toLowerCase().includes(query) ||
        pub.journal.toLowerCase().includes(query) ||
        (pub.doi && pub.doi.toLowerCase().includes(query)) ||
        pub.year.toString().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, activePubs]);

  // Copy citation helper
  const handleCopyCitation = (pub: Publication, format: 'APA' | 'BibTeX') => {
    let citationText = '';
    if (format === 'APA') {
      citationText = `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${pub.volumeIssue ? `, ${pub.volumeIssue}` : ''}.${pub.doi ? ` https://doi.org/${pub.doi}` : ''}`;
    } else {
      citationText = `@article{halil${pub.year}_${pub.id},\n  title={${pub.title}},\n  author={${pub.authors}},\n  journal={${pub.journal}},\n  volume={${pub.volumeIssue || ''}},\n  year={${pub.year}}\n}`;
    }

    navigator.clipboard.writeText(citationText);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to highlight author name
  const renderAuthors = (authorsStr: string) => {
    const target = 'Hassen Mosa';
    if (!authorsStr.includes(target)) return authorsStr;
    const parts = authorsStr.split(target);
    return (
      <span>
        {parts[0]}
        <strong className="text-white font-bold underline decoration-white/40">Hassen Mosa</strong>
        {parts[1]}
      </span>
    );
  };

  return (
    <section id="publications" className={`py-20 border-b transition-colors duration-300 ${
      isLight ? 'bg-[#F0F4FF] text-blue-950 border-blue-300/80' : 'bg-[#070F26] text-white border-blue-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] ${
              isLight ? 'text-blue-950' : 'text-white'
            }`}>
              Selected Publications
            </h2>
            <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic max-w-2xl font-medium ${
              isLight ? 'text-blue-900/90' : 'text-blue-200/90'
            }`}>
              27 empirical studies, systematic reviews, and clinical research in maternal health, neonatal outcomes, and healthcare quality.
            </p>
          </div>

          {/* View toggle */}
          <div className={`flex items-center gap-1 p-1 border rounded-sm self-start md:self-auto shadow-xs ${
            isLight ? 'bg-white border-blue-300' : 'bg-blue-950/80 border-blue-500/30'
          }`}>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-sm ${
                viewMode === 'cards'
                  ? isLight ? 'bg-blue-950 text-white font-bold shadow-xs' : 'bg-blue-500 text-black font-bold shadow-xs'
                  : isLight ? 'text-blue-900 hover:text-blue-950' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-sm ${
                viewMode === 'table'
                  ? isLight ? 'bg-blue-950 text-white font-bold shadow-xs' : 'bg-blue-500 text-black font-bold shadow-xs'
                  : isLight ? 'text-blue-900 hover:text-blue-950' : 'text-blue-300 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Index Table
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className={`rounded-sm p-5 border mb-8 space-y-4 ${
          isLight ? 'bg-white border-blue-200 shadow-sm' : 'bg-blue-950/60 border-blue-500/30'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-blue-500' : 'text-blue-400'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keyword, journal, author, DOI or year..."
                className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-xs focus:outline-none font-mono ${
                  isLight
                    ? 'bg-blue-50/50 border-blue-300 text-blue-950 focus:border-blue-600 placeholder-blue-400'
                    : 'bg-[#04091A] border-blue-500/30 text-white focus:border-blue-400 placeholder-blue-400'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                    isLight ? 'text-blue-600 hover:text-blue-900' : 'text-blue-400 hover:text-blue-200'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results count badge */}
            <div className={`text-[10px] font-mono uppercase tracking-wider whitespace-nowrap px-3.5 py-2.5 rounded-sm border font-bold ${
              isLight ? 'bg-blue-100 border-blue-300 text-blue-950' : 'bg-[#04091A] border-blue-500/30 text-blue-300'
            }`}>
              Matches: <strong className={isLight ? 'text-blue-950' : 'text-white'}>{filteredPubs.length}</strong> / {PUBLICATIONS_LIST.length}
            </div>
          </div>

          {/* Category Pills */}
          <div className={`flex flex-wrap items-center gap-2 pt-2 border-t ${
            isLight ? 'border-blue-100' : 'border-blue-500/20'
          }`}>
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mr-2 flex items-center gap-1 ${
              isLight ? 'text-blue-900' : 'text-blue-300'
            }`}>
              <Filter className="w-3 h-3" /> Scope:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 border text-[10px] uppercase tracking-wider font-mono rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? isLight
                      ? 'bg-blue-950 text-white border-blue-950 font-bold shadow-xs'
                      : 'bg-blue-500 text-black border-blue-400 font-bold shadow-xs'
                    : isLight
                      ? 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                      : 'bg-blue-950/80 text-blue-300 border-blue-500/30 hover:border-blue-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content View: Cards vs Table */}
        {filteredPubs.length === 0 ? (
          <div className={`text-center py-16 rounded-sm border border-dashed ${
            isLight ? 'bg-white border-stone-300' : 'bg-zinc-900/50 border-white/10'
          }`}>
            <BookOpen className={`w-8 h-8 mx-auto mb-3 ${isLight ? 'text-stone-400' : 'text-zinc-600'}`} />
            <h3 className={`text-sm font-bold uppercase tracking-widest ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>No matching papers found</h3>
            <p className={`text-xs mt-1 font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>Try adjusting search parameters or scope category.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className={`mt-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                isLight ? 'bg-stone-900 text-white' : 'bg-white text-black'
              }`}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPubs.map((pub) => {
              const isExpanded = expandedAbstractId === pub.id;
              return (
                <div
                  key={pub.id}
                  className={`border rounded-sm p-6 transition-all flex flex-col justify-between group ${
                    isLight
                      ? 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                      : 'bg-zinc-900 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className={`flex items-start justify-between gap-3 border-b pb-3 ${
                      isLight ? 'border-stone-100' : 'border-white/5'
                    }`}>
                      <span className={`text-[10px] font-mono tracking-widest uppercase ${
                        isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                      }`}>
                        {pub.journal} &bull; {pub.year}
                      </span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                        #{pub.id.toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Paper Title */}
                    <h3 className={`text-base font-bold leading-snug transition-colors ${
                      isLight ? 'text-stone-900 group-hover:text-stone-700' : 'text-white group-hover:text-zinc-300'
                    }`}>
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    <p className={`text-xs leading-relaxed font-sans ${
                      isLight ? 'text-stone-600' : 'text-zinc-400'
                    }`}>
                      {renderAuthors(pub.authors)}
                    </p>

                    {/* Volume / Issue info if available */}
                    {pub.volumeIssue && (
                      <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
                        {pub.journal}, {pub.volumeIssue} ({pub.year})
                      </p>
                    )}

                    {/* Abstract preview if available */}
                    {pub.abstractPreview && (
                      <div className="pt-1">
                        <button
                          onClick={() => setExpandedAbstractId(isExpanded ? null : pub.id)}
                          className={`text-[10px] uppercase tracking-widest font-mono flex items-center gap-1 cursor-pointer ${
                            isLight ? 'text-stone-600 hover:text-stone-900 font-semibold' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? 'Hide Abstract' : 'Read Abstract'}
                        </button>
                        {isExpanded && (
                          <p className={`mt-2 text-xs p-3.5 border leading-relaxed font-serif-editorial italic ${
                            isLight ? 'bg-stone-50 text-stone-800 border-stone-200' : 'bg-[#0A0A0A] text-zinc-300 border-white/10'
                          }`}>
                            {pub.abstractPreview}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className={`pt-4 mt-6 border-t flex items-center justify-between gap-2 text-xs ${
                    isLight ? 'border-stone-200' : 'border-white/10'
                  }`}>
                    <button
                      onClick={() => setShowCitationModal(pub)}
                      className={`text-[10px] uppercase tracking-widest font-mono inline-flex items-center gap-1.5 cursor-pointer ${
                        isLight ? 'text-stone-600 hover:text-stone-900 font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Quote className="w-3 h-3" /> Cite
                    </button>

                    {pub.link ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-white hover:text-black text-white text-[10px] uppercase tracking-widest font-mono border border-white/10 transition-colors inline-flex items-center gap-1 rounded-sm"
                      >
                        <span>Full Text / DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-600 text-[10px] font-mono uppercase">Indexed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto bg-zinc-900 border border-white/10 rounded-sm">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#0A0A0A] text-zinc-400 uppercase tracking-widest text-[10px] font-mono border-b border-white/10">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Journal</th>
                  <th className="px-4 py-3.5">Year</th>
                  <th className="px-4 py-3.5">Authors</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPubs.map((pub) => (
                  <tr key={pub.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-zinc-500">{pub.id}</td>
                    <td className="px-4 py-3 font-medium text-white max-w-xs sm:max-w-md">
                      {pub.title}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300 whitespace-nowrap">
                      {pub.journal}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{pub.year}</td>
                    <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">
                      {renderAuthors(pub.authors)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {pub.link ? (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-zinc-800 text-white hover:bg-white hover:text-black font-mono text-[10px] uppercase border border-white/10 inline-flex items-center gap-1 rounded-sm"
                        >
                          DOI <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[10px]">Indexed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Citation Modal */}
      {showCitationModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/20 rounded-sm max-w-lg w-full p-6 text-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-white">
                <Quote className="w-3.5 h-3.5 text-zinc-400" /> Export Citation
              </h3>
              <button
                onClick={() => setShowCitationModal(null)}
                className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                [✕]
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs font-sans">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Paper Title</label>
                <p className="font-bold text-white text-sm">{showCitationModal.title}</p>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">APA Citation</label>
                <div className="p-3 bg-zinc-900 rounded-sm border border-white/10 font-mono text-[11px] leading-relaxed text-zinc-300">
                  {showCitationModal.authors} ({showCitationModal.year}). {showCitationModal.title}. <em>{showCitationModal.journal}</em>{showCitationModal.volumeIssue ? `, ${showCitationModal.volumeIssue}` : ''}.
                </div>
                <button
                  onClick={() => handleCopyCitation(showCitationModal, 'APA')}
                  className="mt-2 px-3 py-1.5 bg-white text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-sm"
                >
                  {copiedId === showCitationModal.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === showCitationModal.id ? 'Copied APA!' : 'Copy APA Citation'}</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">BibTeX Citation</label>
                <div className="p-3 bg-zinc-900 rounded-sm border border-white/10 font-mono text-[10px] leading-relaxed text-zinc-400 whitespace-pre">
                  {`@article{halil${showCitationModal.year}_${showCitationModal.id},\n  title={${showCitationModal.title}},\n  author={${showCitationModal.authors}},\n  journal={${showCitationModal.journal}},\n  year={${showCitationModal.year}}\n}`}
                </div>
                <button
                  onClick={() => handleCopyCitation(showCitationModal, 'BibTeX')}
                  className="mt-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/20 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-sm"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy BibTeX Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
