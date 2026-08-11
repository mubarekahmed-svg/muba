import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Award, 
  Layers, 
  Activity, 
  BookOpen, 
  Globe, 
  Sparkles,
  Search,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { Publication } from '../types';
import { PUBLICATIONS_LIST } from '../data/profileData';

interface VisualizationsSectionProps {
  publications?: Publication[];
  theme?: 'light' | 'dark';
}

export const VisualizationsSection: React.FC<VisualizationsSectionProps> = ({ 
  publications, 
  theme = 'light' 
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'topics' | 'indexing' | 'impact'>('timeline');
  const [metricFilter, setMetricFilter] = useState<'all' | 'maternal' | 'neonatal'>('all');

  const isLight = theme === 'light';
  const activePubs = publications && publications.length > 0 ? publications : PUBLICATIONS_LIST;

  // 1. Calculate publications per year
  const yearCounts: { [year: string]: number } = {};
  activePubs.forEach((pub) => {
    const yr = pub.year || 2021;
    yearCounts[yr] = (yearCounts[yr] || 0) + 1;
  });

  const yearsSorted = Object.keys(yearCounts).sort();
  let cumulative = 0;
  const timelineData = yearsSorted.map((yr) => {
    const count = yearCounts[yr];
    cumulative += count;
    return {
      year: String(yr),
      annual: count,
      cumulative: cumulative,
      citationsEst: count * 14 + Math.floor(Math.random() * 5),
    };
  });

  // 2. Topic distribution
  const topicData = [
    { name: 'Maternal Health & Care Quality', count: 10, percentage: 37, color: isLight ? '#0f766e' : '#2dd4bf' },
    { name: 'Neonatal & Birth Asphyxia', count: 8, percentage: 30, color: isLight ? '#1e40af' : '#60a5fa' },
    { name: 'Preterm Birth & Intrapartum', count: 5, percentage: 18, color: isLight ? '#6b21a8' : '#c084fc' },
    { name: 'Reproductive & Family Health', count: 4, percentage: 15, color: isLight ? '#d97706' : '#fbbf24' },
  ];

  // 3. Indexing distribution
  const indexingData = [
    { category: 'PLOS & BMC Series', count: 11, color: isLight ? '#047857' : '#34d399' },
    { category: 'Scopus / Web of Science', count: 18, color: isLight ? '#2563eb' : '#3b82f6' },
    { category: 'PubMed / MEDLINE', count: 22, color: isLight ? '#7c3aed' : '#a78bfa' },
    { category: 'Open Access CC-BY', count: 27, color: isLight ? '#b45309' : '#f59e0b' },
  ];

  // 4. Radar Competency Metrics
  const radarData = [
    { subject: 'Epidemiology', level: 95 },
    { subject: 'Biostatistics (SPSS/STATA)', level: 92 },
    { subject: 'Maternal Health', level: 98 },
    { subject: 'Neonatal Resuscitation', level: 90 },
    { subject: 'IRB Ethics & Review', level: 88 },
    { subject: 'Systematic Reviews', level: 94 },
  ];

  // Theme-aware colors
  const strokeColor = isLight ? '#1c1917' : '#ffffff';
  const gridColor = isLight ? '#e7e5e4' : '#27272a';
  const textColor = isLight ? '#44403c' : '#a1a1aa';
  const tooltipBg = isLight ? '#ffffff' : '#09090b';
  const tooltipBorder = isLight ? '#d6d3d1' : '#27272a';

  return (
    <section id="analytics" className={`py-20 border-b transition-colors duration-300 relative overflow-hidden ${
      isLight ? 'bg-[#F0FDF4] text-emerald-950 border-emerald-300/80' : 'bg-[#02221A] text-white border-emerald-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-black border rounded-xs shadow-xs ${
                isLight ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950' : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              }`}>
                Visual Analytics
              </span>
              <span className={`text-xs font-mono font-semibold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                Corpus Metrics & Trends
              </span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black uppercase tracking-[0.03em] ${
              isLight ? 'text-emerald-950' : 'text-white'
            }`}>
              Research Impact & Corpus Analytics
            </h2>
            <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic max-w-2xl font-medium ${
              isLight ? 'text-emerald-900/90' : 'text-emerald-200/90'
            }`}>
              Quantitative visualization of publication trajectories, domain distribution across 27 peer-reviewed papers, editorial review activity, and indexed journal impact.
            </p>
          </div>

          {/* Interactive Visual Tabs */}
          <div className={`flex flex-wrap items-center gap-1 p-1.5 border rounded-sm shadow-xs ${
            isLight ? 'bg-white border-emerald-300/90' : 'bg-emerald-950/80 border-emerald-500/30'
          }`}>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-black flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                activeTab === 'timeline'
                  ? isLight ? 'bg-emerald-900 text-white shadow-xs' : 'bg-emerald-500 text-black shadow-xs'
                  : isLight ? 'text-emerald-900 hover:text-emerald-950' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Growth
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-black flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                activeTab === 'topics'
                  ? isLight ? 'bg-emerald-900 text-white shadow-xs' : 'bg-emerald-500 text-black shadow-xs'
                  : isLight ? 'text-emerald-900 hover:text-emerald-950' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" /> Domains
            </button>
            <button
              onClick={() => setActiveTab('indexing')}
              className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-black flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                activeTab === 'indexing'
                  ? isLight ? 'bg-emerald-900 text-white shadow-xs' : 'bg-emerald-500 text-black shadow-xs'
                  : isLight ? 'text-emerald-900 hover:text-emerald-950' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Indexing
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-black flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                activeTab === 'impact'
                  ? isLight ? 'bg-emerald-900 text-white shadow-xs' : 'bg-emerald-500 text-black shadow-xs'
                  : isLight ? 'text-emerald-900 hover:text-emerald-950' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Radar Skills
            </button>
          </div>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-5 border rounded-sm ${
            isLight ? 'bg-white border-emerald-300/80 shadow-xs' : 'bg-emerald-950/60 border-emerald-500/30'
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Peer-Reviewed Works
            </div>
            <div className={`text-3xl font-black mt-1 font-mono tracking-tight ${isLight ? 'text-emerald-950' : 'text-white'}`}>
              {activePubs.length}
            </div>
            <div className={`text-[10px] mt-1 flex items-center gap-1 font-semibold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
              <TrendingUp className="w-3 h-3" /> 100% International Indexed
            </div>
          </div>

          <div className={`p-5 border rounded-sm ${
            isLight ? 'bg-white border-emerald-300/80 shadow-xs' : 'bg-emerald-950/60 border-emerald-500/30'
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Editorial & Review Boards
            </div>
            <div className={`text-3xl font-black mt-1 font-mono tracking-tight ${isLight ? 'text-emerald-950' : 'text-white'}`}>
              19+
            </div>
            <div className={`text-[10px] mt-1 font-medium ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              PLoS ONE, BMC, Heliyon, etc.
            </div>
          </div>

          <div className={`p-5 border rounded-sm ${
            isLight ? 'bg-white border-emerald-300/80 shadow-xs' : 'bg-emerald-950/60 border-emerald-500/30'
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              First / Corresponding Author
            </div>
            <div className={`text-3xl font-black mt-1 font-mono tracking-tight ${isLight ? 'text-emerald-950' : 'text-white'}`}>
              82%
            </div>
            <div className={`text-[10px] mt-1 font-medium ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Lead Principal Investigator
            </div>
          </div>

          <div className={`p-5 border rounded-sm ${
            isLight ? 'bg-white border-emerald-300/80 shadow-xs' : 'bg-emerald-950/60 border-emerald-500/30'
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Research Focus Reach
            </div>
            <div className={`text-3xl font-black mt-1 font-mono tracking-tight ${isLight ? 'text-emerald-950' : 'text-white'}`}>
              Sub-Saharan
            </div>
            <div className={`text-[10px] mt-1 font-medium ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Ethiopian Healthcare System
            </div>
          </div>
        </div>

        {/* Visualization Canvas Area */}
        <div className={`border rounded-sm p-6 lg:p-8 ${
          isLight ? 'bg-white border-emerald-300 shadow-sm' : 'bg-emerald-950/80 border-emerald-500/30'
        }`}>

          {/* TAB 1: Publication Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                <div>
                  <h3 className={`text-sm font-mono font-bold uppercase tracking-[0.2em] ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}>
                    Publication Growth Trajectory (2018–2026)
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                    Annual release density vs. cumulative peer-reviewed research outputs
                  </p>
                </div>
                <div className={`text-[11px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                  Total Records: <strong>{activePubs.length}</strong>
                </div>
              </div>

              <div className="h-72 sm:h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isLight ? '#0f766e' : '#2dd4bf'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={isLight ? '#0f766e' : '#2dd4bf'} stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorAnnual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isLight ? '#2563eb' : '#60a5fa'} stopOpacity={0.5}/>
                        <stop offset="95%" stopColor={isLight ? '#2563eb' : '#60a5fa'} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="year" stroke={textColor} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis stroke={textColor} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: tooltipBg, 
                        borderColor: tooltipBorder, 
                        color: isLight ? '#1c1917' : '#ffffff',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        borderRadius: '2px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      name="Cumulative Publications" 
                      stroke={isLight ? '#0f766e' : '#2dd4bf'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCumulative)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="annual" 
                      name="Annual Publications" 
                      stroke={isLight ? '#2563eb' : '#60a5fa'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorAnnual)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={`p-4 border rounded-sm text-xs ${
                isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-zinc-950 border-white/10 text-zinc-300'
              }`}>
                <strong className="font-mono uppercase tracking-wider text-stone-900 dark:text-white">Publication Summary:</strong> Hassen Mosa Halil has maintained an active research publishing cadence between 2020 and 2025, producing 4–6 peer-reviewed clinical and public health papers annually focused on improving maternal and newborn survival metrics in Ethiopia.
              </div>
            </div>
          )}

          {/* TAB 2: Domain Topics Distribution */}
          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className={`text-sm font-mono font-bold uppercase tracking-[0.2em] ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  Research Categorization Breakdown
                </h3>
                <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                  Distribution of studies across core clinical and public health disciplines
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topicData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percentage }) => `${percentage}%`}
                      >
                        {topicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: tooltipBg, 
                          borderColor: tooltipBorder, 
                          color: isLight ? '#1c1917' : '#ffffff',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          borderRadius: '2px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  {topicData.map((topic, i) => (
                    <div key={i} className={`p-3 border rounded-sm flex items-center justify-between ${
                      isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-white/10'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }}></span>
                        <div>
                          <p className={`text-xs font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                            {topic.name}
                          </p>
                          <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
                            {topic.count} Peer-Reviewed Articles
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                        {topic.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Journal Indexing & Tiers */}
          {activeTab === 'indexing' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className={`text-sm font-mono font-bold uppercase tracking-[0.2em] ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  Journal Indexing & High-Impact Outlets
                </h3>
                <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                  Verification across global indexing databases (MEDLINE, Scopus, Web of Science, DOAJ)
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={indexingData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" stroke={textColor} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis dataKey="category" type="category" stroke={textColor} width={130} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: tooltipBg, 
                        borderColor: tooltipBorder, 
                        color: isLight ? '#1c1917' : '#ffffff',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        borderRadius: '2px'
                      }} 
                    />
                    <Bar dataKey="count" name="Indexed Publications" radius={[0, 4, 4, 0]}>
                      {indexingData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-3 border rounded-sm font-mono text-[11px] ${
                  isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                }`}>
                  <strong className="block text-xs uppercase mb-1">PLOS ONE & BMC</strong>
                  11 Articles published in flagship Open Access Q1/Q2 medical journals.
                </div>
                <div className={`p-3 border rounded-sm font-mono text-[11px] ${
                  isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                }`}>
                  <strong className="block text-xs uppercase mb-1">PubMed / Scopus</strong>
                  100% of published articles are indexed in major global biomedical repositories.
                </div>
                <div className={`p-3 border rounded-sm font-mono text-[11px] ${
                  isLight ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                }`}>
                  <strong className="block text-xs uppercase mb-1">Peer Review Standards</strong>
                  Rigorous double-blind peer review compliance across all publications.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Radar Skill Matrix */}
          {activeTab === 'impact' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className={`text-sm font-mono font-bold uppercase tracking-[0.2em] ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  Academic Competency & Expertise Profile
                </h3>
                <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                  Multi-axial evaluation of research methodologies, statistical tools, and administrative ethics
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke={gridColor} />
                      <PolarAngleAxis dataKey="subject" stroke={textColor} tick={{ fontSize: 11, fontFamily: 'sans-serif' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={textColor} />
                      <Radar 
                        name="Competency Index" 
                        dataKey="level" 
                        stroke={isLight ? '#0f766e' : '#2dd4bf'} 
                        fill={isLight ? '#0f766e' : '#2dd4bf'} 
                        fillOpacity={0.5} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: tooltipBg, 
                          borderColor: tooltipBorder, 
                          color: isLight ? '#1c1917' : '#ffffff',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          borderRadius: '2px'
                        }} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  {radarData.map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={`font-semibold ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>
                          {skill.subject}
                        </span>
                        <span className={isLight ? 'text-stone-600 font-bold' : 'text-zinc-400 font-bold'}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        isLight ? 'bg-stone-200' : 'bg-zinc-800'
                      }`}>
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${skill.level}%`,
                            backgroundColor: isLight ? '#0f766e' : '#2dd4bf'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
