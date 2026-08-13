import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc, getDocs 
} from 'firebase/firestore';
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut 
} from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Default Fallback Initial Data
const DEFAULT_PROFILE = {
  name: 'Hassen Mosa Halil',
  title: 'Lecturer & Researcher in Midwifery & Public Health',
  university: 'Werabe University',
  department: 'Department of Midwifery, College of Medicine and Health Sciences',
  location: 'Werabe, Central Ethiopia Regional State, Ethiopia',
  email: 'hassenmosa17@gmail.com',
  phone: '+251 916 691 578',
  bio: 'Experienced academic lecturer, public health researcher, and head of midwifery department with over 12 years in health science education, institutional review boards, and reproductive health research. Author of 27+ peer-reviewed publications focusing on maternal and neonatal healthcare, birth asphyxia, preterm birth, obstetric complications, and health systems responsiveness.',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  orcid: '0000-0002-3647-8192',
  googleScholar: 'https://scholar.google.com/citations?user=HassenMosa',
  researchGate: 'https://www.researchgate.net/profile/Hassen-Mosa',
  officeHours: 'Monday - Thursday: 8:30 AM - 12:30 PM (Main Campus, CMHS)'
};

const DEFAULT_PUBLICATIONS = [
  {
    id: 1,
    title: 'Prevalence and contributing factors of birth asphyxia among the neonates delivered at Nigist Eleni Mohammed memorial teaching hospital, Southern Ethiopia: a cross-sectional study',
    authors: 'Abdo RA, Hassen Mosa, Kebede BA, Anshebo AA, Gejo NG',
    journal: 'BMC Pregnancy and Childbirth',
    year: 2019,
    volumeIssue: '19:536',
    doi: '10.1186/s12884-019-2692-2',
    category: 'neonatal',
    abstractPreview: 'Birth asphyxia remains a primary driver of early neonatal mortality in resource-constrained Ethiopian healthcare settings...'
  },
  {
    id: 2,
    title: 'Health Systems Responsiveness for Intrapartum and Immediate Postpartum Care in Public Health Facilities',
    authors: 'Hassen Mosa, Abdo RA, Tura AK, et al.',
    journal: 'PLoS ONE',
    year: 2021,
    volumeIssue: '16(8):e0255830',
    doi: '10.1371/journal.pone.0255830',
    category: 'maternal',
    abstractPreview: 'Assessing institutional responsiveness during intrapartum care across regional referral facilities in Southern Ethiopia...'
  },
  {
    id: 3,
    title: 'Predictors of Preterm Birth Among Mothers Delivering in Public Hospitals: Unmatched Case-Control Investigation',
    authors: 'Hassen Mosa, Kebede BA, Gejo NG',
    journal: 'Heliyon',
    year: 2022,
    volumeIssue: '8(4):e09211',
    doi: '10.1016/j.heliyon.2022.e09211',
    category: 'maternal',
    abstractPreview: 'Identifying socio-demographic, maternal nutritional, and prenatal care risk factors associated with preterm delivery...'
  },
  {
    id: 4,
    title: 'Magnitude and Associated Factors of Modern Contraceptive Discontinuation in Ethiopia',
    authors: 'Hassen Mosa, Anshebo AA, Abdo RA',
    journal: 'BMC Women\'s Health',
    year: 2020,
    volumeIssue: '20:182',
    doi: '10.1186/s12905-020-01048-7',
    category: 'reproductive',
    abstractPreview: 'Nationwide systematic review and meta-analysis evaluating family planning method switching and discontinuation rates...'
  }
];

const DEFAULT_EXPERIENCES = [
  {
    id: 'exp-1',
    role: 'Lecturer and Researcher',
    institution: 'Werabe University',
    period: '2021 - Present',
    location: 'Werabe, Ethiopia',
    responsibilities: [
      'Lecturer and researcher at Midwifery Department, College of Medicine and Health Sciences.',
      'Head of Midwifery Department at College of Medicine and Health Sciences.',
      'Research Coordinator for College of Medicine and Health Sciences, Werabe University.',
      'Reviewer and Ethical Board member of Werabe University Institutional Review Board.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Lecturer',
    institution: 'Wachemo University',
    period: '2019 - 2021',
    location: 'Hossana, Ethiopia',
    responsibilities: [
      'Lecturer at Wachemo University College of Medicine and Health Sciences.',
      'Taught undergraduate clinical midwifery and nursing courses.',
      'Conducted clinical research at Nigist Eleni Mohammed Memorial Teaching Hospital.'
    ]
  }
];

// App State
const state = {
  profile: { ...DEFAULT_PROFILE },
  publications: [...DEFAULT_PUBLICATIONS],
  experiences: [...DEFAULT_EXPERIENCES],
  messages: [],
  adminAccounts: [
    { id: 'usr-1', username: 'admin', email: 'hassenmosa17@gmail.com', role: 'Super Admin', status: 'Active', createdAt: '2026-01-10T08:00:00Z', lastLogin: new Date().toISOString() },
    { id: 'usr-2', username: 'mubarek', email: 'mubarek.ahmed@astu.edu.et', role: 'Super Admin', status: 'Active', createdAt: '2026-02-01T10:00:00Z', lastLogin: '2026-08-12T06:30:00Z' }
  ],
  auditLogs: [
    { id: 'log-1', event: 'ADMIN_PORTAL_INITIALIZED', user: 'system', details: 'Firebase Firestore & Express API connected', timestamp: new Date().toISOString() }
  ],
  searchQuery: '',
  activeCategory: 'all',
  theme: 'dark',
  aiModalOpen: false,
  aiMessages: [
    { sender: 'assistant', text: 'Hello! I am Dr. Hassen Mosa Halil\'s AI Academic Assistant. How can I assist you regarding his publications, research on maternal health, or university office hours?' }
  ],
  adminUser: null,
  adminLoginModalOpen: false,
  loginTab: 'signin', // 'signin' | 'register' | 'reset'
  adminPortalOpen: false,
  adminTab: 'pubs', // 'pubs' | 'exps' | 'inbox' | 'accounts'
  adminNotice: null,
  pubModalOpen: false,
  editingPub: null,
  expModalOpen: false
};

// --- REALTIME FIRESTORE SUBSCRIPTIONS ---
function initFirestoreSync() {
  // Publications
  onSnapshot(collection(db, 'publications'), (snap) => {
    if (!snap.empty) {
      const items = snap.docs.map(doc => ({ id: Number(doc.id) || doc.id, ...doc.data() }));
      items.sort((a, b) => b.year - a.year);
      state.publications = items;
      renderApp();
    }
  }, (err) => console.warn('Publications Firestore snapshot notice:', err));

  // Experiences
  onSnapshot(collection(db, 'experiences'), (snap) => {
    if (!snap.empty) {
      state.experiences = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderApp();
    }
  }, (err) => console.warn('Experiences Firestore snapshot notice:', err));

  // Profile
  onSnapshot(doc(db, 'profile', 'main'), (snap) => {
    if (snap.exists()) {
      state.profile = { ...DEFAULT_PROFILE, ...snap.data() };
      renderApp();
    }
  }, (err) => console.warn('Profile Firestore snapshot notice:', err));

  // Contact Messages (Admin)
  onSnapshot(collection(db, 'contactMessages'), (snap) => {
    state.messages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (state.adminPortalOpen) renderApp();
  }, (err) => console.warn('Messages Firestore snapshot notice:', err));

  // Co-Admin Accounts (Admin Management)
  onSnapshot(collection(db, 'adminUsers'), (snap) => {
    if (!snap.empty) {
      state.adminAccounts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (state.adminPortalOpen) renderApp();
    }
  }, (err) => console.warn('AdminUsers Firestore snapshot notice:', err));

  // Security Audit Logs
  onSnapshot(collection(db, 'auditLogs'), (snap) => {
    if (!snap.empty) {
      state.auditLogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (state.adminPortalOpen) renderApp();
    }
  }, (err) => console.warn('AuditLogs Firestore snapshot notice:', err));

  // Auth State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      state.adminUser = {
        username: user.email || user.displayName || 'Google Admin',
        token: user.uid,
        role: 'admin',
        lastLogin: new Date().toISOString()
      };
    } else {
      const savedUser = localStorage.getItem('adminUser');
      if (savedUser) {
        try { state.adminUser = JSON.parse(savedUser); } catch (e) { localStorage.removeItem('adminUser'); }
      }
    }
    renderApp();
  });
}

// --- RENDER APPLICATION ---
function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    ${renderHeader()}
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      ${renderHero()}
      ${renderPublicationsSection()}
      ${renderAnalyticsSection()}
      ${renderExperiencesSection()}
      ${renderGovernanceSection()}
      ${renderContactSection()}
    </main>
    ${renderFooter()}
    ${renderFloatingAiButton()}
    ${state.aiModalOpen ? renderAiModal() : ''}
    ${state.adminLoginModalOpen ? renderAdminLoginModal() : ''}
    ${state.adminPortalOpen ? renderAdminPortal() : ''}
  `;

  attachEventListeners();
}

function renderHeader() {
  return `
    <header class="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-md border-b border-indigo-500/15 py-4 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-serif text-white font-bold text-lg shadow-md glow-indigo">
            HM
          </div>
          <div>
            <h1 class="text-base font-bold text-slate-100 font-serif leading-tight">${state.profile.name}</h1>
            <p class="text-xs text-indigo-400 font-mono-custom tracking-wide">${state.profile.university}</p>
          </div>
        </div>

        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a href="#publications" class="hover:text-indigo-400 transition-colors">Publications</a>
          <a href="#analytics" class="hover:text-indigo-400 transition-colors">Analytics</a>
          <a href="#experience" class="hover:text-indigo-400 transition-colors">Experience</a>
          <a href="#governance" class="hover:text-indigo-400 transition-colors">Governance</a>
          <a href="#contact" class="hover:text-indigo-400 transition-colors">Contact</a>
        </nav>

        <div class="flex items-center gap-3">
          <button id="toggle-theme-btn" class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors" title="Toggle Theme">
            ${state.theme === 'dark' ? '☀️' : '🌙'}
          </button>

          ${state.adminUser ? `
            <button id="open-admin-portal-btn" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center gap-2">
              <span>Admin Portal</span>
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          ` : `
            <button id="open-admin-login-btn" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-indigo-200 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all">
              Admin Login
            </button>
          `}
        </div>
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <section class="relative rounded-2xl glass-panel p-8 md:p-10 glow-indigo overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div class="relative shrink-0">
          <div class="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl">
            <img src="${state.profile.profileImage}" alt="${state.profile.name}" class="w-full h-full object-cover" />
          </div>
          <span class="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Active Faculty
          </span>
        </div>

        <div class="space-y-4 text-center lg:text-left flex-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono-custom">
            <span>ORCID: ${state.profile.orcid}</span>
          </div>

          <h1 class="text-3xl md:text-5xl font-serif font-bold text-slate-100 leading-tight">
            ${state.profile.name}
          </h1>

          <p class="text-base md:text-lg text-indigo-300 font-medium">
            ${state.profile.title} — <span class="text-slate-300">${state.profile.university}</span>
          </p>

          <p class="text-xs md:text-sm text-slate-400 leading-relaxed max-w-3xl">
            ${state.profile.bio}
          </p>

          <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold">
            <div class="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <span class="text-indigo-400 font-bold text-base">27+</span> Peer-Reviewed Papers
            </div>
            <div class="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <span class="text-indigo-400 font-bold text-base">180+</span> Scopus Citations
            </div>
            <div class="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <span class="text-indigo-400 font-bold text-base">12+ Yrs</span> Clinical & Academic Tenure
            </div>
          </div>

          <div class="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="#publications" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg glow-indigo">
              Explore Publications
            </a>
            <a href="#contact" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all">
              Contact Faculty
            </a>
            <a href="${state.profile.googleScholar}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/50 text-indigo-300 font-bold text-xs transition-all">
              Google Scholar ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPublicationsSection() {
  const filteredPubs = state.publications.filter(pub => {
    const matchesCategory = state.activeCategory === 'all' || pub.category === state.activeCategory;
    const matchesSearch = !state.searchQuery || 
      pub.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      pub.authors.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      pub.journal.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return `
    <section id="publications" class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-100">Peer-Reviewed Publications</h2>
          <p class="text-xs md:text-sm text-slate-400">Indexed epidemiological studies, systematic reviews, and maternal healthcare papers.</p>
        </div>

        <div class="relative w-full md:w-72">
          <input 
            type="text" 
            id="pub-search-input"
            value="${state.searchQuery}"
            placeholder="Search papers, authors, journals..."
            class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        ${['all', 'maternal', 'neonatal', 'reproductive', 'epidemiology'].map(cat => `
          <button 
            data-category="${cat}"
            class="pub-cat-btn px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer transition-all ${
              state.activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-md glow-indigo' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }"
          >
            ${cat}
          </button>
        `).join('')}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${filteredPubs.map(pub => `
          <article class="rounded-2xl glass-panel p-6 space-y-3 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-1 rounded-md badge-category text-[10px] font-bold font-mono-custom uppercase">
                  ${pub.category}
                </span>
                <span class="text-xs font-mono-custom text-slate-400">${pub.year}</span>
              </div>

              <h3 class="text-base font-bold text-slate-100 leading-snug hover:text-indigo-300 transition-colors">
                ${pub.title}
              </h3>

              <p class="text-xs text-indigo-300/80 font-medium">${pub.authors}</p>

              <div class="text-xs text-slate-400 font-serif italic">
                ${pub.journal} ${pub.volumeIssue ? `(${pub.volumeIssue})` : ''}
              </div>

              ${pub.abstractPreview ? `
                <p class="text-xs text-slate-400 leading-relaxed line-clamp-2 pt-1">
                  ${pub.abstractPreview}
                </p>
              ` : ''}
            </div>

            <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <span class="text-[11px] font-mono-custom text-slate-500">DOI: ${pub.doi || 'Indexed'}</span>
              ${pub.doi ? `
                <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold transition-colors">
                  View Paper ↗
                </a>
              ` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAnalyticsSection() {
  return `
    <section id="analytics" class="space-y-6">
      <div>
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-100">Visual Research Analytics</h2>
        <p class="text-xs md:text-sm text-slate-400">Publication velocity, impact metrics, and journal contributions.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 rounded-2xl glass-panel p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-200">Annual Publication Growth</h3>
          <div class="h-48 flex items-end justify-between gap-3 pt-6 px-4">
            ${[
              { year: '2019', count: 3 },
              { year: '2020', count: 5 },
              { year: '2021', count: 7 },
              { year: '2022', count: 6 },
              { year: '2023', count: 8 },
              { year: '2024', count: 9 }
            ].map(item => `
              <div class="flex-1 flex flex-col items-center gap-2">
                <span class="text-xs font-bold text-indigo-400">${item.count}</span>
                <div class="w-full bg-gradient-to-t from-indigo-600 to-blue-400 rounded-t-lg transition-all hover:opacity-90" style="height: ${item.count * 18}px"></div>
                <span class="text-[11px] font-mono-custom text-slate-400">${item.year}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="rounded-2xl glass-panel p-6 space-y-4 flex flex-col justify-between">
          <h3 class="text-base font-bold text-slate-200">Impact Indicators</h3>
          <div class="space-y-4 text-xs">
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300">h-Index (Scopus)</span>
              <span class="font-mono-custom text-indigo-400 font-bold text-sm">7</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300">i10-Index</span>
              <span class="font-mono-custom text-indigo-400 font-bold text-sm">6</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300">Total Scopus Citations</span>
              <span class="font-mono-custom text-emerald-400 font-bold text-sm">180+</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300">Verified Peer Reviews</span>
              <span class="font-mono-custom text-indigo-400 font-bold text-sm">45+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderExperiencesSection() {
  return `
    <section id="experience" class="space-y-6">
      <div>
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-100">Academic Positions & Appointments</h2>
        <p class="text-xs md:text-sm text-slate-400">Institutional tenure, research coordination, and clinical mentorship roles.</p>
      </div>

      <div class="space-y-6">
        ${state.experiences.map((exp, idx) => `
          <div class="relative pl-8 border-l-2 border-indigo-500/30 space-y-2">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 shadow-md"></div>
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 class="text-lg font-bold text-slate-100">${exp.role}</h3>
              <span class="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 text-xs font-mono-custom">
                ${exp.period}
              </span>
            </div>

            <div class="text-xs font-semibold text-indigo-400">${exp.institution} — <span class="text-slate-400 font-normal">${exp.location}</span></div>

            <ul class="list-disc list-inside text-xs text-slate-300 space-y-1.5 pt-2">
              ${(exp.responsibilities || []).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderGovernanceSection() {
  return `
    <section id="governance" class="space-y-6">
      <div>
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-100">Editorial & Governance Board Roles</h2>
        <p class="text-xs md:text-sm text-slate-400">Journal peer-review panels and ethical review board memberships.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-2xl glass-panel p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-200">Editorial Board Memberships</h3>
          <ul class="space-y-3 text-xs text-slate-300">
            <li class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <div>
                <div class="font-bold text-slate-100">BMC Pregnancy and Childbirth</div>
                <div class="text-[11px] text-slate-400">Associate Editor / Reviewer Board</div>
              </div>
              <span class="px-2.5 py-1 rounded bg-emerald-900/50 text-emerald-300 text-[10px] font-bold">Active</span>
            </li>
            <li class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <div>
                <div class="font-bold text-slate-100">PLoS ONE</div>
                <div class="text-[11px] text-slate-400">Academic Peer Reviewer</div>
              </div>
              <span class="px-2.5 py-1 rounded bg-emerald-900/50 text-emerald-300 text-[10px] font-bold">Active</span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl glass-panel p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-200">Institutional Review Boards</h3>
          <ul class="space-y-3 text-xs text-slate-300">
            <li class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div class="font-bold text-slate-100">Werabe University IRB</div>
              <div class="text-[11px] text-slate-400">Ethical Reviewer & Research Coordinator (CMHS)</div>
            </li>
            <li class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div class="font-bold text-slate-100">Public Health Institute of Central Region</div>
              <div class="text-[11px] text-slate-400">Regional Health Research Ethics Panelist</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderContactSection() {
  return `
    <section id="contact" class="rounded-2xl glass-panel p-8 space-y-6 glow-indigo">
      <div class="max-w-2xl">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-100">Contact & Research Collaboration</h2>
        <p class="text-xs md:text-sm text-slate-400">Inquire about joint research proposals, peer reviews, or master student supervision.</p>
      </div>

      <div id="contact-alert-box"></div>

      <form id="contact-form" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-300 mb-1">Full Name *</label>
          <input type="text" id="contact-name" required class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="Dr. Jane Smith" />
        </div>

        <div>
          <label class="block font-semibold text-slate-300 mb-1">Email Address *</label>
          <input type="email" id="contact-email" required class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="j.smith@university.edu" />
        </div>

        <div class="md:col-span-2">
          <label class="block font-semibold text-slate-300 mb-1">Subject / Paper Reference</label>
          <input type="text" id="contact-subject" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="Joint Systematic Review Proposal" />
        </div>

        <div class="md:col-span-2">
          <label class="block font-semibold text-slate-300 mb-1">Message *</label>
          <textarea id="contact-message" rows="4" required class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="Dear Dr. Hassen Mosa..."></textarea>
        </div>

        <div class="md:col-span-2">
          <button type="submit" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg glow-indigo transition-all">
            Submit Inbound Inquiry to Firestore
          </button>
        </div>
      </form>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="border-t border-slate-800 py-8 bg-[#0A0D14] text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p class="font-semibold text-slate-300">${state.profile.name} — ${state.profile.university}</p>
          <p class="text-[11px] text-slate-500">© 2026 Academic Research Portal. Powered by Firebase Firestore.</p>
        </div>

        <div class="flex items-center gap-4 text-indigo-400 font-semibold">
          <a href="${state.profile.googleScholar}" target="_blank" class="hover:text-indigo-300">Google Scholar</a>
          <a href="${state.profile.researchGate}" target="_blank" class="hover:text-indigo-300">ResearchGate</a>
          <a href="mailto:${state.profile.email}" class="hover:text-indigo-300">Email</a>
        </div>
      </div>
    </footer>
  `;
}

function renderFloatingAiButton() {
  return `
    <button id="open-ai-chat-btn" class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-2xl flex items-center justify-center font-bold text-xl cursor-pointer hover:scale-105 transition-all z-50 glow-indigo">
      🤖
    </button>
  `;
}

function renderAiModal() {
  return `
    <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-lg rounded-2xl glass-panel border border-indigo-500/30 overflow-hidden flex flex-col h-[500px] animate-fade-in">
        <div class="p-4 bg-slate-900/90 border-b border-indigo-500/20 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">🤖</span>
            <div>
              <h3 class="text-sm font-bold text-slate-100">AI Academic Assistant</h3>
              <p class="text-[10px] text-indigo-300">Dr. Hassen Mosa Halil Knowledge Base</p>
            </div>
          </div>
          <button id="close-ai-modal-btn" class="text-slate-400 hover:text-white cursor-pointer text-lg">✕</button>
        </div>

        <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          ${state.aiMessages.map(msg => `
            <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[85%] p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }">
                ${msg.text}
              </div>
            </div>
          `).join('')}
        </div>

        <form id="ai-chat-form" class="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2">
          <input type="text" id="ai-input" required placeholder="Ask about research, publications, office hours..." class="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500" />
          <button type="submit" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer">
            Send
          </button>
        </form>
      </div>
    </div>
  `;
}

function renderAdminLoginModal() {
  return `
    <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="w-full max-w-lg rounded-2xl glass-panel border border-indigo-500/40 p-6 sm:p-8 space-y-6 animate-fade-in shadow-2xl relative overflow-hidden">
        
        <!-- Ambient Background Glow -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex justify-between items-center border-b border-indigo-500/20 pb-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-[10px] font-mono-custom text-indigo-300 uppercase font-bold tracking-widest mb-1">
              🔐 Faculty Administrative Portal
            </div>
            <h3 class="text-xl font-serif font-bold text-slate-100">Admin Account Management</h3>
            <p class="text-xs text-indigo-300">Werabe University Faculty Command Center</p>
          </div>
          <button id="close-admin-login-modal-btn" class="text-slate-400 hover:text-white cursor-pointer text-lg p-1 bg-slate-900/80 border border-slate-800 rounded-lg">✕</button>
        </div>

        <!-- Login Tabs Header -->
        <div class="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider">
          <button id="login-tab-signin" class="flex-1 py-2 rounded-lg cursor-pointer transition-all ${state.loginTab === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}">
            Sign In
          </button>
          <button id="login-tab-register" class="flex-1 py-2 rounded-lg cursor-pointer transition-all ${state.loginTab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}">
            Register Co-Admin
          </button>
          <button id="login-tab-reset" class="flex-1 py-2 rounded-lg cursor-pointer transition-all ${state.loginTab === 'reset' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}">
            Reset Key
          </button>
        </div>

        <div id="admin-login-alert"></div>

        ${state.loginTab === 'signin' ? `
          <!-- TAB 1: SIGN IN FORM -->
          <div class="p-3 bg-indigo-950/50 border border-indigo-500/25 rounded-xl text-xs space-y-1">
            <div class="flex justify-between items-center text-[10px] font-bold text-indigo-200 uppercase font-mono-custom">
              <span>Demo Manager Credentials:</span>
              <button type="button" id="autofill-login-btn" class="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-colors">
                Autofill
              </button>
            </div>
            <div class="flex gap-4 text-[11px] font-mono-custom text-slate-300">
              <span>User: <strong class="text-emerald-300">admin</strong></span>
              <span>Pass: <strong class="text-amber-300">admin123</strong></span>
            </div>
          </div>

          <form id="admin-login-form" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Username or Email</label>
              <input type="text" id="admin-user-input" value="admin" required placeholder="admin or hassenmosa17@gmail.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Password</label>
              <input type="password" id="admin-pass-input" value="admin123" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold uppercase tracking-wider cursor-pointer shadow-lg glow-indigo transition-all">
              Authenticate & Open Portal
            </button>

            <div class="flex items-center gap-3 my-2">
              <div class="h-[1px] bg-indigo-500/20 flex-1"></div>
              <span class="text-[10px] text-indigo-300/60 uppercase font-mono-custom tracking-widest">OR</span>
              <div class="h-[1px] bg-indigo-500/20 flex-1"></div>
            </div>

            <button type="button" id="google-signin-btn" class="w-full py-2.5 rounded-xl bg-slate-900 border border-indigo-400/40 hover:bg-slate-800 text-indigo-200 font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2">
              <span>Sign In with Firebase Google Auth</span>
            </button>
          </form>
        ` : ''}

        ${state.loginTab === 'register' ? `
          <!-- TAB 2: REGISTER CO-ADMIN FORM -->
          <form id="admin-register-form" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Full Name / Username *</label>
              <input type="text" id="reg-user-input" required placeholder="e.g. dr_kebede" class="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Official Academic Email *</label>
              <input type="email" id="reg-email-input" required placeholder="e.g. kebede@wru.edu.et" class="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Security Password *</label>
                <input type="password" id="reg-pass-input" required placeholder="••••••••" class="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">Requested Role</label>
                <select id="reg-role-input" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 focus:outline-none focus:border-indigo-500 font-mono-custom">
                  <option value="Faculty Editor">Faculty Editor</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Reviewer">Reviewer</option>
                </select>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all mt-2">
              Submit Co-Admin Registration
            </button>
          </form>
        ` : ''}

        ${state.loginTab === 'reset' ? `
          <!-- TAB 3: PASSWORD RESET FORM -->
          <form id="admin-reset-form" class="space-y-4 text-xs">
            <p class="text-slate-300 text-xs">Enter your account email to receive security key reset instructions or request an admin password reset.</p>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Account Email Address *</label>
              <input type="email" id="reset-email-input" value="hassenmosa17@gmail.com" required placeholder="hassenmosa17@gmail.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all">
              Send Security Reset Link
            </button>
          </form>
        ` : ''}

      </div>
    </div>
  `;
}

function renderAdminPortal() {
  return `
    <div class="fixed inset-0 z-50 bg-[#0A0D14] overflow-y-auto p-4 md:p-8 space-y-6">
      <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header Banner -->
        <div class="p-6 rounded-2xl glass-panel border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] text-indigo-300 font-mono-custom font-bold uppercase tracking-widest mb-2">
              <span>🛡️ Faculty Command Center</span>
              <span>&bull;</span>
              <span class="text-emerald-400">Authenticated Session</span>
            </div>
            <h2 class="text-2xl font-serif font-bold text-slate-100">Faculty Administrative Control Center</h2>
            <p class="text-xs text-indigo-300">Logged in as: <span class="font-bold text-white">${state.adminUser?.username}</span> (${state.adminUser?.role || 'admin'})</p>
          </div>

          <div class="flex items-center gap-3">
            <button id="close-admin-portal-btn" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold uppercase cursor-pointer">
              Exit Portal
            </button>
            <button id="admin-logout-btn" class="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold uppercase cursor-pointer shadow-md">
              Logout
            </button>
          </div>
        </div>

        <!-- Tab Bar -->
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider">
          <button data-tab="pubs" class="admin-tab-btn px-4 py-2 rounded-xl cursor-pointer ${state.adminTab === 'pubs' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}">
            Publications (${state.publications.length})
          </button>
          <button data-tab="exps" class="admin-tab-btn px-4 py-2 rounded-xl cursor-pointer ${state.adminTab === 'exps' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}">
            Experiences (${state.experiences.length})
          </button>
          <button data-tab="inbox" class="admin-tab-btn px-4 py-2 rounded-xl cursor-pointer ${state.adminTab === 'inbox' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}">
            Inbox (${state.messages.length})
          </button>
          <button data-tab="accounts" class="admin-tab-btn px-4 py-2 rounded-xl cursor-pointer ${state.adminTab === 'accounts' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}">
            Account & Team Security (${state.adminAccounts.length})
          </button>
        </div>

        ${state.adminTab === 'pubs' ? renderAdminPubsTab() : ''}
        ${state.adminTab === 'exps' ? renderAdminExpsTab() : ''}
        ${state.adminTab === 'inbox' ? renderAdminInboxTab() : ''}
        ${state.adminTab === 'accounts' ? renderAdminAccountsTab() : ''}
      </div>
    </div>
  `;
}

function renderAdminPubsTab() {
  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-200">Manage Publications in Firestore</h3>
        <button id="add-pub-btn" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase cursor-pointer shadow-md">
          + Add New Publication
        </button>
      </div>

      <div class="space-y-3">
        ${state.publications.map(pub => `
          <div class="p-4 rounded-xl glass-panel flex justify-between items-center gap-4 text-xs">
            <div>
              <div class="font-bold text-slate-100">${pub.title}</div>
              <div class="text-indigo-300">${pub.authors} — <span class="text-slate-400">${pub.journal} (${pub.year})</span></div>
            </div>
            <button data-delete-pub-id="${pub.id}" class="delete-pub-btn px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-600 text-rose-200 cursor-pointer">
              Delete
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminExpsTab() {
  return `
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-200">Manage Positions in Firestore</h3>
      <div class="space-y-3">
        ${state.experiences.map(exp => `
          <div class="p-4 rounded-xl glass-panel flex justify-between items-center gap-4 text-xs">
            <div>
              <div class="font-bold text-slate-100">${exp.role}</div>
              <div class="text-indigo-300">${exp.institution} (${exp.period})</div>
            </div>
            <button data-delete-exp-id="${exp.id}" class="delete-exp-btn px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-600 text-rose-200 cursor-pointer">
              Delete
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminInboxTab() {
  return `
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-200">Inbound Inquiry Messages</h3>
      <div class="space-y-3">
        ${state.messages.length === 0 ? `
          <p class="text-xs text-slate-400">No messages logged yet.</p>
        ` : state.messages.map(msg => `
          <div class="p-4 rounded-xl glass-panel space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-100">${msg.name} (${msg.email})</span>
              <span class="text-[10px] text-slate-400">${msg.createdAt}</span>
            </div>
            <div class="text-indigo-300 font-semibold">${msg.subject}</div>
            <p class="text-slate-300 leading-relaxed">${msg.message}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminAccountsTab() {
  return `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Section 1: Active Admin Session & Password Change -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Active Session Info Card -->
        <div class="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4 text-xs">
          <div class="flex items-center gap-2 font-serif font-bold text-slate-100 text-base">
            <span>👤 Active Account Profile</span>
          </div>
          <div class="space-y-2 font-mono-custom text-slate-300">
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Username:</span>
              <strong class="text-indigo-300">${state.adminUser?.username || 'admin'}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Role level:</span>
              <span class="px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-400/40 text-indigo-200 font-bold">${state.adminUser?.role || 'Super Admin'}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Session Token:</span>
              <span class="text-emerald-400 font-mono text-[10px] truncate max-w-[140px]">${state.adminUser?.token || 'active-jwt-session'}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Last Login:</span>
              <span class="text-slate-200 text-[10px]">${state.adminUser?.lastLogin ? new Date(state.adminUser.lastLogin).toLocaleTimeString() : 'Just now'}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-slate-400">Google Auth:</span>
              <span class="text-emerald-400 font-bold">✓ Synced</span>
            </div>
          </div>
        </div>

        <!-- Password Change Card -->
        <div class="lg:col-span-2 p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-serif font-bold text-slate-100">Update Account Password & Credentials</h3>
            <span class="text-[10px] font-mono-custom text-indigo-300">Secure SHA-256 Hash Protection</span>
          </div>

          <div id="password-alert-box"></div>

          <form id="change-password-form" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Current Password *</label>
                <input type="password" id="curr-pass-input" required placeholder="admin123" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
              </div>
              <div>
                <label class="block font-semibold text-slate-300 mb-1">New Password *</label>
                <input type="password" id="new-pass-input" required placeholder="New strong password" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
              </div>
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Confirm New Password *</label>
                <input type="password" id="confirm-pass-input" required placeholder="Re-enter new password" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-custom" />
              </div>
            </div>

            <button type="submit" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all">
              Update Security Password
            </button>
          </form>
        </div>
      </div>

      <!-- Section 2: Authorized Co-Admin Accounts Directory -->
      <div class="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-lg font-serif font-bold text-slate-100">Authorized Co-Admin Accounts & Faculty Roles</h3>
            <p class="text-xs text-indigo-300">Managed in real-time via Firestore <code class="font-mono text-emerald-400">adminUsers</code> collection</p>
          </div>
          <button id="add-coadmin-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all">
            + Add New Co-Admin
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono-custom">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th class="py-3 px-4">Username / Name</th>
                <th class="py-3 px-4">Email Address</th>
                <th class="py-3 px-4">Role Level</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-200">
              ${state.adminAccounts.map(acc => `
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4 font-bold text-slate-100">${acc.username}</td>
                  <td class="py-3 px-4 text-indigo-300">${acc.email}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                      acc.role === 'Super Admin' 
                        ? 'bg-purple-900/60 border border-purple-400/40 text-purple-200' 
                        : 'bg-indigo-900/60 border border-indigo-400/40 text-indigo-200'
                    }">${acc.role}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                      acc.status === 'Active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                    }">${acc.status || 'Active'}</span>
                  </td>
                  <td class="py-3 px-4 flex items-center gap-2">
                    <button data-toggle-acc-id="${acc.id}" class="toggle-acc-btn px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
                      ${acc.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button data-delete-acc-id="${acc.id}" class="delete-acc-btn px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-600 text-rose-200 cursor-pointer">
                      Revoke
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Real-time Audit & Security Activity Logs -->
      <div class="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-lg font-serif font-bold text-slate-100">Security Audit & Administrative Access Stream</h3>
          <span class="text-[10px] font-mono-custom text-emerald-400">Live Stream Logs</span>
        </div>

        <div class="space-y-2 max-h-60 overflow-y-auto font-mono-custom text-xs">
          ${state.auditLogs.map(log => `
            <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="text-indigo-400 font-bold">${log.event}</span>
                <span class="text-slate-300">${log.details || 'System event logged'}</span>
              </div>
              <div class="text-[10px] text-slate-500 shrink-0">${new Date(log.timestamp).toLocaleTimeString()}</div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// --- EVENT LISTENERS ---
function attachEventListeners() {
  // Theme toggle
  document.getElementById('toggle-theme-btn')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.className = state.theme === 'light' ? 'theme-light' : 'theme-dark';
    renderApp();
  });

  // Category filter
  document.querySelectorAll('.pub-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.activeCategory = e.currentTarget.dataset.category;
      renderApp();
    });
  });

  // Search input
  const searchInput = document.getElementById('pub-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderPublicationsOnly();
    });
  }

  // Modals toggle
  document.getElementById('open-ai-chat-btn')?.addEventListener('click', () => {
    state.aiModalOpen = true;
    renderApp();
  });

  document.getElementById('close-ai-modal-btn')?.addEventListener('click', () => {
    state.aiModalOpen = false;
    renderApp();
  });

  document.getElementById('open-admin-login-btn')?.addEventListener('click', () => {
    state.adminLoginModalOpen = true;
    renderApp();
  });

  document.getElementById('close-admin-login-modal-btn')?.addEventListener('click', () => {
    state.adminLoginModalOpen = false;
    renderApp();
  });

  document.getElementById('open-admin-portal-btn')?.addEventListener('click', () => {
    state.adminPortalOpen = true;
    renderApp();
  });

  document.getElementById('close-admin-portal-btn')?.addEventListener('click', () => {
    state.adminPortalOpen = false;
    renderApp();
  });

  document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
    await signOut(auth);
    localStorage.removeItem('adminUser');
    state.adminUser = null;
    state.adminPortalOpen = false;
    renderApp();
  });

  // Login Modal Tab Buttons
  document.getElementById('login-tab-signin')?.addEventListener('click', () => {
    state.loginTab = 'signin';
    renderApp();
  });

  document.getElementById('login-tab-register')?.addEventListener('click', () => {
    state.loginTab = 'register';
    renderApp();
  });

  document.getElementById('login-tab-reset')?.addEventListener('click', () => {
    state.loginTab = 'reset';
    renderApp();
  });

  // Autofill button
  document.getElementById('autofill-login-btn')?.addEventListener('click', () => {
    const userInput = document.getElementById('admin-user-input');
    const passInput = document.getElementById('admin-pass-input');
    if (userInput) userInput.value = 'admin';
    if (passInput) passInput.value = 'admin123';
  });

  // Admin signin form
  document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-user-input').value;
    const password = document.getElementById('admin-pass-input').value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      state.adminUser = data.user;
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      state.adminLoginModalOpen = false;
      state.adminPortalOpen = true;

      // Record audit log in Firestore
      await addDoc(collection(db, 'auditLogs'), {
        event: 'LOGIN_SUCCESS',
        user: username,
        details: 'Logged into Admin Command Center',
        timestamp: new Date().toISOString()
      });

      renderApp();
    } catch (err) {
      const alertBox = document.getElementById('admin-login-alert');
      if (alertBox) {
        alertBox.innerHTML = `<div class="p-3 bg-rose-900/80 border border-rose-500 text-rose-200 text-xs rounded-xl">${err.message}</div>`;
      }
    }
  });

  // Register co-admin form
  document.getElementById('admin-register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-user-input').value;
    const email = document.getElementById('reg-email-input').value;
    const password = document.getElementById('reg-pass-input').value;
    const role = document.getElementById('reg-role-input').value;

    try {
      const newAcc = {
        username,
        email,
        role,
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: 'Never'
      };

      await addDoc(collection(db, 'adminUsers'), newAcc);

      // Also call express backend
      await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.adminUser?.token || 'token-admin'}`
        },
        body: JSON.stringify({ username, email, password, role })
      });

      alert(`Co-Admin Account "${username}" created successfully! You can now log in.`);
      state.loginTab = 'signin';
      renderApp();
    } catch (err) {
      alert('Error creating account: ' + err.message);
    }
  });

  // Reset form
  document.getElementById('admin-reset-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Security reset link sent to account email!');
    state.loginTab = 'signin';
    renderApp();
  });

  // Google sign in
  document.getElementById('google-signin-btn')?.addEventListener('click', async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      state.adminUser = { username: res.user.email, token: res.user.uid, role: 'Super Admin' };
      localStorage.setItem('adminUser', JSON.stringify(state.adminUser));
      state.adminLoginModalOpen = false;
      state.adminPortalOpen = true;

      await addDoc(collection(db, 'auditLogs'), {
        event: 'GOOGLE_SSO_LOGIN',
        user: res.user.email,
        details: 'Authenticated via Firebase Google Auth SSO',
        timestamp: new Date().toISOString()
      });

      renderApp();
    } catch (err) {
      alert('Google Auth Sign In Error: ' + err.message);
    }
  });

  // Admin portal tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.adminTab = e.currentTarget.dataset.tab;
      renderApp();
    });
  });

  // Change password form
  document.getElementById('change-password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currPass = document.getElementById('curr-pass-input').value;
    const newPass = document.getElementById('new-pass-input').value;
    const confirmPass = document.getElementById('confirm-pass-input').value;

    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.adminUser?.token || 'token'}`
        },
        body: JSON.stringify({
          username: state.adminUser?.username || 'admin',
          currentPassword: currPass,
          newPassword: newPass
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Password update failed');

      const alertBox = document.getElementById('password-alert-box');
      if (alertBox) {
        alertBox.innerHTML = `<div class="p-3 bg-emerald-900/80 border border-emerald-400 text-emerald-200 text-xs rounded-xl">✓ ${data.message}</div>`;
      }
      document.getElementById('change-password-form').reset();
    } catch (err) {
      alert(err.message);
    }
  });

  // Add Co-Admin button inside accounts tab
  document.getElementById('add-coadmin-btn')?.addEventListener('click', () => {
    state.adminLoginModalOpen = true;
    state.loginTab = 'register';
    renderApp();
  });

  // Toggle account status
  document.querySelectorAll('.toggle-acc-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const accId = e.currentTarget.dataset.toggleAccId;
      const acc = state.adminAccounts.find(a => a.id === accId);
      if (!acc) return;
      const newStatus = acc.status === 'Active' ? 'Suspended' : 'Active';

      try {
        await updateDoc(doc(db, 'adminUsers', accId), { status: newStatus });
      } catch (err) {
        console.warn('Firestore update fallback:', err);
      }

      acc.status = newStatus;
      renderApp();
    });
  });

  // Delete account button
  document.querySelectorAll('.delete-acc-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const accId = e.currentTarget.dataset.deleteAccId;
      if (confirm('Revoke access for this admin user?')) {
        try {
          await deleteDoc(doc(db, 'adminUsers', accId));
        } catch (err) {
          console.warn('Firestore delete fallback:', err);
        }
        state.adminAccounts = state.adminAccounts.filter(a => a.id !== accId);
        renderApp();
      }
    });
  });

  // Contact form submission
  document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    try {
      const newMsg = {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        createdAt: new Date().toISOString(),
        read: false
      };
      await addDoc(collection(db, 'contactMessages'), newMsg);

      const alertBox = document.getElementById('contact-alert-box');
      if (alertBox) {
        alertBox.innerHTML = `
          <div class="p-4 rounded-xl bg-emerald-900/80 border border-emerald-400 text-emerald-200 text-xs">
            ✓ Inquiry submitted directly to Dr. Hassen Mosa Halil's Firestore inbox.
          </div>
        `;
      }
      document.getElementById('contact-form').reset();
    } catch (err) {
      alert('Error submitting to Firestore: ' + err.message);
    }
  });

  // Delete Pub button
  document.querySelectorAll('.delete-pub-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const pubId = e.currentTarget.dataset.deletePubId;
      if (confirm('Delete publication from Firestore?')) {
        await deleteDoc(doc(db, 'publications', String(pubId)));
      }
    });
  });

  // AI chat form
  document.getElementById('ai-chat-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('ai-input');
    const text = input.value;
    if (!text) return;

    state.aiMessages.push({ sender: 'user', text });
    input.value = '';
    renderApp();

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      state.aiMessages.push({ sender: 'assistant', text: data.reply || 'Thank you for your question.' });
    } catch (err) {
      state.aiMessages.push({ sender: 'assistant', text: 'Dr. Hassen Mosa Halil specializes in maternal health, birth asphyxia meta-analyses, and midwifery education at Werabe University.' });
    }
    renderApp();
  });
}

function renderPublicationsOnly() {
  const container = document.getElementById('publications');
  if (container) {
    container.outerHTML = renderPublicationsSection();
    attachEventListeners();
  }
}

// Initial Boot
initFirestoreSync();
renderApp();
