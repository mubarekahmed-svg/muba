import React from 'react';
import { BookOpen, GraduationCap, Mail, ShieldCheck, Lock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profileData';
import { ProfileData } from '../types';

interface FooterProps {
  onOpenAdmin?: () => void;
  personalInfo?: ProfileData;
  theme?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, personalInfo, theme = 'light' }) => {
  const info = personalInfo || PERSONAL_INFO;
  const isLight = theme === 'light';

  return (
    <footer className={`py-12 border-t text-xs transition-colors duration-300 ${
      isLight ? 'bg-[#F1F5F9] text-slate-800 border-indigo-200' : 'bg-[#080D1A] text-slate-300 border-indigo-500/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b ${
          isLight ? 'border-slate-300/80' : 'border-indigo-500/20'
        }`}>
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-sm font-bold flex items-center justify-center text-xs font-mono shadow-xs ${
                isLight ? 'bg-indigo-950 text-white' : 'bg-indigo-500 text-black'
              }`}>
                HM
              </div>
              <span className={`font-black text-base tracking-tight uppercase ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {info.name}
              </span>
            </div>
            <p className={`max-w-sm text-xs leading-relaxed font-serif-editorial italic font-medium ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              {info.title} &bull; {info.department}, {info.university}, Ethiopia.
            </p>
            <div className={`pt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider font-bold ${
              isLight ? 'text-indigo-950' : 'text-indigo-300'
            }`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`} /> 27 Peer-Reviewed Publications &bull; 19 Reviewer Boards
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-4 space-y-2">
            <h4 className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
              isLight ? 'text-indigo-950' : 'text-white'
            }`}>Index</h4>
            <div className={`grid grid-cols-2 gap-2 text-[11px] font-mono ${
              isLight ? 'text-slate-700 font-semibold' : 'text-slate-300'
            }`}>
              <a href="#overview" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Overview</a>
              <a href="#publications" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Publications</a>
              <a href="#experience" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Experience</a>
              <a href="#editorial" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Editorial Roles</a>
              <a href="#skills" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Skills & Honors</a>
              <a href="#contact" className={isLight ? 'hover:text-indigo-900' : 'hover:text-white'}>Contact</a>
            </div>
          </div>

          {/* Direct Contact & Admin Access */}
          <div className="md:col-span-3 space-y-2">
            <h4 className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
              isLight ? 'text-indigo-950' : 'text-white'
            }`}>Contact & Admin</h4>
            <p className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{info.email}</p>
            <p className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{info.phone}</p>
            <p className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{PERSONAL_INFO.location}</p>
            
            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className={`text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    isLight ? 'text-indigo-900 hover:text-indigo-950' : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  <Lock className={`w-3 h-3 ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`} />
                  <span>[Manager Access]</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Copyright */}
        <div className={`pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase font-semibold ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. Werabe University, Ethiopia.
          </div>
          <div>
            <a href="#overview" className={`transition-colors font-bold ${
              isLight ? 'text-indigo-950 hover:text-indigo-700' : 'text-indigo-300 hover:text-white'
            }`}>Back to Top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

