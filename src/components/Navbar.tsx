import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Award, MessageSquare, Mail, Menu, X, Sparkles, FileText, UserCheck, ShieldCheck, Sun, Moon, BarChart2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profileData';
import { AdminUser } from '../types';

interface NavbarProps {
  onOpenAI: () => void;
  onOpenAdmin: () => void;
  adminUser: AdminUser | null;
  activeSection: string;
  publicationsCount?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAI, 
  onOpenAdmin, 
  adminUser, 
  activeSection,
  publicationsCount = 27,
  theme = 'light',
  onToggleTheme
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'light';

  const navLinks = [
    { name: 'Overview', href: '#overview', icon: UserCheck },
    { name: 'Analytics', href: '#analytics', icon: BarChart2 },
    { name: 'Publications', href: '#publications', icon: BookOpen, count: String(publicationsCount) },
    { name: 'Experience', href: '#experience', icon: GraduationCap },
    { name: 'Editorial', href: '#editorial', icon: FileText },
    { name: 'Competencies', href: '#skills', icon: Award },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isLight
          ? scrolled
            ? 'bg-[#FAFAF8]/95 backdrop-blur-md text-stone-900 border-b border-stone-200 py-3.5 shadow-xs'
            : 'bg-[#FAFAF8] text-stone-900 py-5 border-b border-stone-200'
          : scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md text-white border-b border-white/10 py-3.5'
            : 'bg-[#0A0A0A] text-white py-5 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a href="#overview" className="flex items-baseline gap-3 group">
            <span className={`text-lg font-black tracking-[-0.03em] uppercase transition-colors ${
              isLight ? 'text-stone-900 group-hover:text-stone-600' : 'text-white group-hover:text-zinc-300'
            }`}>
              HASSEN MOSA HALIL
            </span>
            <span className={`hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase border-l pl-3 ${
              isLight ? 'text-stone-500 border-stone-300' : 'text-zinc-500 border-white/10'
            }`}>
              WERABE UNIVERSITY
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-all relative py-1 ${
                    isActive
                      ? isLight
                        ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                        : 'text-white font-bold border-b-2 border-white'
                      : isLight
                        ? 'text-stone-500 hover:text-stone-900'
                        : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {link.count && (
                    <span className={`ml-1 font-mono text-[9px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>[{link.count}]</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`p-1.5 border rounded-sm text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-white/20 text-zinc-200'
                }`}
                title={isLight ? "Switch to Editorial Dark Theme" : "Switch to Editorial Light Theme"}
              >
                {isLight ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-stone-700" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Light</span>
                  </>
                )}
              </button>
            )}

            <button
              id="open-ai-assistant-nav"
              onClick={onOpenAI}
              className={`px-3.5 py-1.5 border rounded-sm text-[10px] uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-900 hover:text-white border-stone-300 text-stone-900'
                  : 'bg-zinc-900 hover:bg-white hover:text-black border-white/20 text-white'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-stone-700' : 'text-zinc-400'}`} />
              <span>AI Assistant</span>
            </button>

            <button
              id="open-admin-portal-nav"
              onClick={onOpenAdmin}
              className={`px-3.5 py-1.5 border rounded-sm text-[10px] font-mono uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                adminUser 
                  ? isLight ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-black border-white'
                  : isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminUser ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2 border text-xs font-medium flex items-center gap-1 ${
                  isLight ? 'border-stone-300 bg-stone-100 text-stone-800' : 'border-white/20 bg-zinc-900 text-white'
                }`}
                title="Toggle Theme"
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
              </button>
            )}
            <button
              onClick={onOpenAdmin}
              className={`p-2 border text-xs font-medium flex items-center gap-1 ${
                isLight ? 'border-stone-300 bg-stone-100 text-stone-800' : 'border-white/20 bg-zinc-900 text-white'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAI}
              className={`p-2 border text-xs font-medium flex items-center gap-1 ${
                isLight ? 'border-stone-300 bg-stone-100 text-stone-800' : 'border-white/20 bg-zinc-900 text-white'
              }`}
              title="Ask AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 border ${
                isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className={`lg:hidden mt-3 pt-3 border-t flex flex-col gap-1 pb-2 ${
            isLight ? 'bg-[#FAFAF8] border-stone-200' : 'bg-[#0A0A0A] border-white/10'
          }`}>
            {navLinks.map((link) => {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-between border-b ${
                    isLight 
                      ? 'text-stone-800 hover:bg-stone-100 border-stone-200' 
                      : 'text-zinc-300 hover:bg-zinc-900 border-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.count && <span className="font-mono text-[10px] text-zinc-500">({link.count})</span>}
                </a>
              );
            })}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className={`px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-left flex items-center justify-between ${
                isLight ? 'text-stone-900 hover:bg-stone-100' : 'text-white hover:bg-zinc-900'
              }`}
            >
              <span>{adminUser ? '→ Open Admin Dashboard' : '→ Admin / Manager Login'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

