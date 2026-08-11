import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VisualizationsSection } from './components/VisualizationsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EditorialSection } from './components/EditorialSection';
import { SkillsCertificatesSection } from './components/SkillsCertificatesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortal } from './components/AdminPortal';
import { Publication, ExperienceItem, AdminUser, ProfileData } from './types';
import { PERSONAL_INFO } from './data/profileData';
import { 
  subscribeToPublications, 
  subscribeToExperiences, 
  subscribeToProfile,
  subscribeToAuthState,
  signOutFirebaseUser
} from './lib/firebaseService';

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Theme State - Defaulting to Light theme as requested
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('appTheme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('appTheme', nextTheme);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  }, [theme]);

  // Dynamic content loaded from Firebase Firestore
  const [publications, setPublications] = useState<Publication[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [personalInfo, setPersonalInfo] = useState<ProfileData>(PERSONAL_INFO);

  // Subscribe to Firebase Firestore real-time snapshots
  useEffect(() => {
    const unsubPubs = subscribeToPublications((data) => {
      if (data && data.length > 0) {
        setPublications(data);
      }
    });

    const unsubExps = subscribeToExperiences((data) => {
      if (data && data.length > 0) {
        setExperiences(data);
      }
    });

    const unsubProf = subscribeToProfile((data) => {
      if (data) {
        setPersonalInfo(data);
      }
    });

    // Fallback sync with local backend server if Firestore is warming up
    fetchPublicData();

    return () => {
      unsubPubs();
      unsubExps();
      unsubProf();
    };
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((firebaseUser) => {
      if (firebaseUser) {
        const admin: AdminUser = {
          username: firebaseUser.email || firebaseUser.displayName || 'admin',
          token: firebaseUser.uid,
          role: 'admin',
          lastLogin: new Date().toISOString()
        };
        setAdminUser(admin);
      } else {
        const savedToken = localStorage.getItem('adminToken');
        const savedUserStr = localStorage.getItem('adminUser');
        if (savedToken && savedUserStr) {
          try {
            const user = JSON.parse(savedUserStr);
            setAdminUser(user);
          } catch (e) {
            localStorage.removeItem('adminUser');
          }
        }
      }
    });

    return () => unsubAuth();
  }, []);

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data.publications && publications.length === 0) setPublications(data.publications);
        if (data.experiences && experiences.length === 0) setExperiences(data.experiences);
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
      }
    } catch (e) {
      console.warn("Using fallback profile data:", e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'analytics', 'publications', 'experience', 'editorial', 'skills', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAccessClick = () => {
    if (adminUser) {
      setAdminPortalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setAdminPortalOpen(true);
  };

  const handleLogout = () => {
    signOutFirebaseUser();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setAdminPortalOpen(false);
  };

  // If Admin Portal Dashboard is currently open
  if (adminPortalOpen && adminUser) {
    return (
      <div className={theme === 'light' ? 'theme-light text-stone-900 bg-[#FAFAF8]' : 'theme-dark text-white bg-[#0A0A0A]'}>
        <AdminPortal
          adminUser={adminUser}
          onLogout={handleLogout}
          onRefreshPublicData={fetchPublicData}
          onClosePortal={() => setAdminPortalOpen(false)}
        />
      </div>
    );
  }

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#FAFAF8] text-stone-900 selection:bg-stone-900 selection:text-white' : 'bg-[#0A0A0A] text-white selection:bg-white selection:text-black'
    }`}>
      {/* Navigation Bar */}
      <Navbar
        onOpenAI={() => setAiModalOpen(true)}
        onOpenAdmin={handleAdminAccessClick}
        adminUser={adminUser}
        activeSection={activeSection}
        publicationsCount={publications.length > 0 ? publications.length : 27}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection onOpenAI={() => setAiModalOpen(true)} personalInfo={personalInfo} theme={theme} />
        <VisualizationsSection publications={publications} theme={theme} />
        <PublicationsSection publications={publications} theme={theme} />
        <ExperienceSection experiences={experiences} theme={theme} />
        <EditorialSection theme={theme} />
        <SkillsCertificatesSection theme={theme} />
        <ContactSection theme={theme} personalInfo={personalInfo} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleAdminAccessClick} theme={theme} onToggleTheme={toggleTheme} personalInfo={personalInfo} />

      {/* AI Assistant Slide-Over Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        theme={theme}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
      />
    </div>
  );
}
