import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash2, Edit3, Save, X, Search, CheckCircle2, 
  AlertCircle, ShieldCheck, LogOut, Mail, GraduationCap, UserCheck, RefreshCw, Eye, MessageSquare, ArrowLeft,
  Lock, Camera, Key, Upload, Link, Globe, Sun, Moon, Briefcase
} from 'lucide-react';
import { Publication, ExperienceItem, ContactMessage, ProfileData, AdminUser } from '../types';
import {
  addPublicationInFirestore,
  updatePublicationInFirestore,
  deletePublicationFromFirestore,
  addExperienceInFirestore,
  deleteExperienceFromFirestore,
  updateProfileInFirestore,
  toggleMessageReadInFirestore,
  deleteContactMessageFromFirestore,
  subscribeToPublications,
  subscribeToExperiences,
  subscribeToProfile,
  subscribeToContactMessages
} from '../lib/firebaseService';

interface AdminPortalProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onRefreshPublicData: () => void;
  onClosePortal: () => void;
}

const PRESET_AVATARS = [
  { id: 'academic-1', label: 'Academic Male Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { id: 'academic-2', label: 'Executive Faculty', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { id: 'academic-3', label: 'Clinical Midwifery Scholar', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600' },
  { id: 'academic-4', label: 'Research Fellow', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  adminUser, 
  onLogout, 
  onRefreshPublicData,
  onClosePortal 
}) => {
  const [activeTab, setActiveTab] = useState<'publications' | 'experiences' | 'profile' | 'security' | 'inquiries'>('publications');

  // Password Management State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Publications State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pubSearch, setPubSearch] = useState('');
  const [pubCategoryFilter, setPubCategoryFilter] = useState('all');
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);

  // New / Edit Publication Form
  const [pubForm, setPubForm] = useState({
    title: '',
    authors: 'Hassen Mosa et al.',
    journal: '',
    year: new Date().getFullYear(),
    volumeIssue: '',
    doi: '',
    link: '',
    category: 'maternal' as Publication['category'],
    abstractPreview: ''
  });

  // Experiences State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expForm, setExpForm] = useState({
    role: '',
    institution: 'Werabe University',
    period: '2021 - Present',
    location: 'Werabe, Ethiopia',
    responsibilitiesStr: ''
  });

  // Messages Inbox State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Profile Info State
  const [profileForm, setProfileForm] = useState<ProfileData | null>(null);

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data on load
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setPublications(data.publications || []);
        setExperiences(data.experiences || []);
        setProfileForm(data.personalInfo || null);
      }

      // Fetch messages inbox
      const msgRes = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${adminUser.token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubPubs = subscribeToPublications((data) => {
      if (data && data.length > 0) setPublications(data);
    });

    const unsubExps = subscribeToExperiences((data) => {
      if (data && data.length > 0) setExperiences(data);
    });

    const unsubProf = subscribeToProfile((data) => {
      if (data) setProfileForm(data);
    });

    const unsubMsgs = subscribeToContactMessages((data) => {
      setMessages(data);
    });

    loadAdminData();

    return () => {
      unsubPubs();
      unsubExps();
      unsubProf();
      unsubMsgs();
    };
  }, [adminUser]);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ----------------------------------------------------
  // PUBLICATIONS CRUD
  // ----------------------------------------------------
  const handleOpenNewPubModal = () => {
    setEditingPub(null);
    setPubForm({
      title: '',
      authors: 'Hassen Mosa et al.',
      journal: '',
      year: new Date().getFullYear(),
      volumeIssue: '',
      doi: '',
      link: '',
      category: 'maternal',
      abstractPreview: ''
    });
    setPubModalOpen(true);
  };

  const handleOpenEditPubModal = (pub: Publication) => {
    setEditingPub(pub);
    setPubForm({
      title: pub.title,
      authors: pub.authors,
      journal: pub.journal,
      year: pub.year,
      volumeIssue: pub.volumeIssue || '',
      doi: pub.doi || '',
      link: pub.link || '',
      category: pub.category,
      abstractPreview: pub.abstractPreview || ''
    });
    setPubModalOpen(true);
  };

  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title || !pubForm.journal) {
      showNotify('error', 'Title and Journal are required.');
      return;
    }

    try {
      if (editingPub) {
        await updatePublicationInFirestore(editingPub.id, pubForm);
        showNotify('success', `Publication #${editingPub.id} updated in Firestore.`);
      } else {
        const newPub = await addPublicationInFirestore(pubForm);
        showNotify('success', `Publication created in Firestore as #${newPub.id}.`);
      }

      setPubModalOpen(false);
      onRefreshPublicData();
    } catch (err: any) {
      console.warn("Firestore pub save error, using server fallback:", err);
      try {
        if (editingPub) {
          const res = await fetch(`/api/admin/publications/${editingPub.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminUser.token}`
            },
            body: JSON.stringify(pubForm)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to update publication');
          showNotify('success', `Publication #${editingPub.id} updated.`);
        } else {
          const res = await fetch('/api/admin/publications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminUser.token}`
            },
            body: JSON.stringify(pubForm)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to create publication');
          showNotify('success', `Publication created and indexed as #${data.publication.id}.`);
        }

        setPubModalOpen(false);
        await loadAdminData();
        onRefreshPublicData();
      } catch (fallbackErr: any) {
        showNotify('error', fallbackErr.message || 'Operation failed');
      }
    }
  };

  const handleDeletePublication = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete publication #${id}?\n"${title}"`)) {
      return;
    }

    try {
      await deletePublicationFromFirestore(id);
      showNotify('success', `Publication #${id} removed from Firestore.`);
      onRefreshPublicData();
    } catch (err: any) {
      console.warn("Firestore delete pub error, using server fallback:", err);
      try {
        const res = await fetch(`/api/admin/publications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminUser.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete publication');

        showNotify('success', `Publication #${id} removed successfully.`);
        await loadAdminData();
        onRefreshPublicData();
      } catch (fallbackErr: any) {
        showNotify('error', fallbackErr.message || 'Delete operation failed');
      }
    }
  };

  // ----------------------------------------------------
  // EXPERIENCES CRUD
  // ----------------------------------------------------
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.role || !expForm.institution) {
      showNotify('error', 'Role and Institution are required.');
      return;
    }

    try {
      const respArr = expForm.responsibilitiesStr
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      await addExperienceInFirestore({
        role: expForm.role,
        institution: expForm.institution,
        period: expForm.period,
        location: expForm.location,
        responsibilities: respArr
      });

      showNotify('success', 'Academic position added to Firestore.');
      setExpModalOpen(false);
      setExpForm({
        role: '',
        institution: 'Werabe University',
        period: '2021 - Present',
        location: 'Werabe, Ethiopia',
        responsibilitiesStr: ''
      });
      onRefreshPublicData();
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to add position');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      await deleteExperienceFromFirestore(id);
      showNotify('success', 'Position removed from Firestore.');
      onRefreshPublicData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // ----------------------------------------------------
  // PROFILE & PASSWORD MANAGEMENT
  // ----------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;

    try {
      await updateProfileInFirestore(profileForm);
      showNotify('success', 'Personal profile & academic metadata updated in Firestore.');
      onRefreshPublicData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotify('error', 'Selected photo exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && profileForm) {
        setProfileForm({
          ...profileForm,
          profileImage: reader.result as string
        });
        showNotify('success', 'Photo loaded into profile preview! Click "Save Profile Updates" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotify('error', 'New password and confirmation password do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      showNotify('error', 'New password must be at least 4 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.token}`
        },
        body: JSON.stringify({
          username: adminUser.username || 'admin',
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotify('success', data.message || 'Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showNotify('error', data.error || 'Failed to update password.');
      }
    } catch (err: any) {
      showNotify('error', 'Network error changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // ----------------------------------------------------
  // INQUIRIES & MESSAGES CRUD
  // ----------------------------------------------------
  const handleToggleReadMessage = async (id: string) => {
    try {
      const target = messages.find(m => m.id === id);
      if (target) {
        await toggleMessageReadInFirestore(id, Boolean(target.read));
      }
    } catch (err) {
      console.error('Toggle read error:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;
    try {
      await deleteContactMessageFromFirestore(id);
      showNotify('success', 'Inquiry message deleted from Firestore.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // Filtered publications
  const filteredPublications = publications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
                          pub.journal.toLowerCase().includes(pubSearch.toLowerCase()) ||
                          pub.authors.toLowerCase().includes(pubSearch.toLowerCase());
    const matchesCategory = pubCategoryFilter === 'all' || pub.category === pubCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#070D1B] text-white font-sans border-t border-indigo-500/20">
      
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0B132B]/95 backdrop-blur-md border-b border-indigo-500/30 py-4 px-4 sm:px-8 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClosePortal}
            className="px-3 py-2 bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition-all rounded-md text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            title="Return to public portfolio view"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Return to Website</span>
          </button>

          <div className="border-l border-indigo-500/30 pl-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
              <h1 className="text-sm sm:text-base font-black uppercase tracking-[0.1em] text-white">
                Faculty Admin CRUD Dashboard
              </h1>
            </div>
            <p className="text-[10px] font-mono text-indigo-300/80">
              Authenticated as <strong className="text-amber-300 font-mono">{adminUser.username}</strong> &bull; Werabe University Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            disabled={loading}
            className="p-2 bg-indigo-950/80 border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 hover:text-white rounded-md text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
            title="Refresh Data from Server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline font-bold">Sync Data</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-600 hover:text-white rounded-md text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors text-rose-200 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Global Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className={`p-4 border rounded-md font-mono text-xs flex items-center gap-3 shadow-md ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo-500/20 pb-4">
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] font-black flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              activeTab === 'publications'
                ? 'bg-indigo-500 text-black shadow-indigo-950'
                : 'bg-[#0E1A38] border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Publications Manager [{publications.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] font-black flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              activeTab === 'experiences'
                ? 'bg-indigo-500 text-black shadow-indigo-950'
                : 'bg-[#0E1A38] border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Positions [{experiences.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] font-black flex items-center gap-2 cursor-pointer transition-all relative shadow-xs ${
              activeTab === 'inquiries'
                ? 'bg-indigo-500 text-black shadow-indigo-950'
                : 'bg-[#0E1A38] border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries Inbox</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-mono font-black rounded-full shadow-xs animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] font-black flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              activeTab === 'profile'
                ? 'bg-indigo-500 text-black shadow-indigo-950'
                : 'bg-[#0E1A38] border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profile & Picture</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] font-black flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              activeTab === 'security'
                ? 'bg-indigo-500 text-black shadow-indigo-950'
                : 'bg-[#0E1A38] border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Passwords</span>
          </button>
        </div>

        {/* TAB 1: PUBLICATIONS CRUD MANAGER */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0E1A38] border border-indigo-500/30 p-4 rounded-md shadow-sm">
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="Search publications by title, journal, or author..."
                    value={pubSearch}
                    onChange={(e) => setPubSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-xs font-mono text-white font-medium placeholder-indigo-400/60 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={pubCategoryFilter}
                  onChange={(e) => setPubCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-xs font-mono text-indigo-200 font-semibold focus:outline-none focus:border-indigo-400"
                >
                  <option value="all">All Research Categories</option>
                  <option value="maternal">Maternal Health Care</option>
                  <option value="neonatal">Neonatal & Birth Asphyxia</option>
                  <option value="preterm">Preterm Birth Studies</option>
                  <option value="health-systems">Health Systems & Quality</option>
                  <option value="general">General Clinical & Public Health</option>
                </select>
              </div>

              {/* Add New Publication Button */}
              <button
                onClick={handleOpenNewPubModal}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-[0.15em] transition-all rounded-md flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Publication</span>
              </button>
            </div>

            {/* Publications Table / Card List */}
            <div className="bg-[#0E1A38] border border-indigo-500/30 rounded-md overflow-hidden shadow-sm">
              <div className="p-4 border-b border-indigo-500/20 flex items-center justify-between font-mono text-xs text-indigo-300 font-bold bg-indigo-950/40">
                <span>INDEXED MANUSCRIPTS ({filteredPublications.length} OF {publications.length})</span>
                <span>ACTION CONTROLS</span>
              </div>

              {filteredPublications.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 font-mono text-xs">
                  No publication records matching search queries.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredPublications.map((pub) => (
                    <div key={pub.id} className="p-4 sm:p-5 hover:bg-indigo-950/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/10 last:border-0">
                      
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-[#070D1B] border border-indigo-500/30 font-mono text-[10px] text-indigo-300 font-bold uppercase tracking-widest rounded-md">
                            #{pub.id}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-900/60 text-indigo-200 font-mono text-[10px] font-bold uppercase rounded-md border border-indigo-400/20">
                            {pub.category}
                          </span>
                          <span className="font-mono text-[11px] font-extrabold text-amber-300 px-1.5 py-0.5 bg-amber-950/40 border border-amber-500/30 rounded-md">
                            {pub.year}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white leading-snug">
                          {pub.title}
                        </h3>

                        <p className="text-xs font-serif-editorial italic text-slate-300">
                          {pub.authors} &bull; <strong className="text-indigo-200 not-italic font-semibold">{pub.journal}</strong> {pub.volumeIssue && `(${pub.volumeIssue})`}
                        </p>

                        {pub.doi && (
                          <span className="font-mono text-[10px] text-indigo-300/70 block font-semibold">
                            DOI: {pub.doi}
                          </span>
                        )}
                      </div>

                      {/* CRUD Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleOpenEditPubModal(pub)}
                          className="px-3 py-1.5 bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white text-indigo-200 rounded-md font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeletePublication(pub.id, pub.title)}
                          className="px-3 py-1.5 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-600 hover:text-white text-rose-300 rounded-md font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ACADEMIC POSITIONS CRUD */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#0E1A38] border border-indigo-500/30 p-4 rounded-md shadow-sm">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-200 font-bold">
                Academic Positions & Faculty Appointments
              </h2>
              <button
                onClick={() => setExpModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-[0.15em] rounded-md flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-[#0E1A38] border border-indigo-500/30 p-6 rounded-md space-y-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-950/50 border border-amber-500/30 rounded-md inline-block mb-1">
                        {exp.period}
                      </span>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">{exp.role}</h3>
                      <p className="text-xs font-mono text-indigo-300 font-semibold">{exp.institution} &bull; {exp.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="px-3 py-1.5 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-600 hover:text-white text-rose-300 rounded-md font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Remove Position</span>
                    </button>
                  </div>

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-slate-200 border-t border-indigo-500/20 pt-3 font-medium">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400 font-mono text-[10px] mt-0.5">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-[#0E1A38] border border-indigo-500/30 p-4 rounded-md flex items-center justify-between shadow-sm">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-200 font-bold">
                Academic Messages & Proposal Requests ({messages.length})
              </h2>
              <span className="font-mono text-[11px] text-indigo-300">
                Unread: <strong className="text-amber-300 font-bold">{unreadCount}</strong>
              </span>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="bg-[#0E1A38] border border-indigo-500/30 p-12 text-center font-mono text-xs text-indigo-300/70 rounded-md">
                  No contact messages received yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`bg-[#0E1A38] border p-6 rounded-md space-y-4 transition-all shadow-sm ${
                      msg.read ? 'border-indigo-500/20 opacity-80' : 'border-indigo-400/50 bg-[#122046]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-indigo-500/20 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {!msg.read && (
                            <span className="px-2 py-0.5 bg-rose-500 text-white font-mono text-[9px] font-black uppercase rounded-md shadow-xs">
                              UNREAD
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-500/30 font-mono text-[10px] text-indigo-300 font-bold uppercase rounded-md">
                            {msg.category}
                          </span>
                          <span className="font-mono text-[10px] text-indigo-300/70 font-semibold">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{msg.subject}</h3>
                        <p className="text-xs font-mono text-indigo-200 font-semibold">
                          From: <strong className="text-amber-300">{msg.name}</strong> ({msg.email})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleReadMessage(msg.id)}
                          className="px-2.5 py-1.5 bg-indigo-950 border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 font-mono text-[10px] font-bold uppercase rounded-md cursor-pointer transition-colors"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                          className="px-2.5 py-1.5 bg-indigo-500 text-black hover:bg-indigo-400 font-mono text-[10px] font-black uppercase rounded-md flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                        >
                          <Mail className="w-3 h-3" /> Reply
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-600 text-rose-300 hover:text-white rounded-md cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-serif-editorial italic text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                      "{msg.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & PICTURE */}
        {activeTab === 'profile' && profileForm && (
          <form onSubmit={handleSaveProfile} className="bg-[#0E1A38] border border-indigo-500/30 p-6 sm:p-8 rounded-md space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-200 font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Faculty Profile Picture & Personal Metadata</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded-md">Live Sync Enabled</span>
            </div>

            {/* Profile Picture Upload & Presets Section */}
            <div className="bg-[#070D1B] border border-indigo-500/30 p-5 rounded-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span className="uppercase tracking-wider font-bold">Faculty Profile Picture</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Image Preview Box */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-md overflow-hidden border-2 border-indigo-500/50 bg-slate-900 relative group shadow-lg">
                    {profileForm.profileImage ? (
                      <img 
                        src={profileForm.profileImage} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-indigo-300/60 font-mono text-xs p-2 text-center">
                        <Camera className="w-8 h-8 mb-1 opacity-50" />
                        <span>No Photo Selected</span>
                      </div>
                    )}
                  </div>
                  {profileForm.profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, profileImage: '' })}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 uppercase tracking-widest font-bold cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Upload Controls & Presets */}
                <div className="flex-1 space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1.5">
                      Upload Custom Photo File (PNG / JPG / WEBP)
                    </label>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-white rounded-md cursor-pointer transition-colors text-xs font-mono font-bold shadow-xs">
                      <Upload className="w-4 h-4 text-indigo-300" />
                      <span>Choose File from Device...</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileUpload}
                        className="hidden" 
                      />
                    </label>
                    <p className="text-[10px] text-indigo-300/60 mt-1 font-semibold">Supports images up to 5MB.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1.5">
                      Or Choose Preset Academic Avatars
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setProfileForm({ ...profileForm, profileImage: preset.url })}
                          className={`p-2 border rounded-md flex items-center gap-2 text-[10px] transition-all text-left cursor-pointer ${
                            profileForm.profileImage === preset.url
                              ? 'border-indigo-400 bg-indigo-600/30 text-white font-bold'
                              : 'border-indigo-500/20 bg-indigo-950/40 text-indigo-200 hover:text-white hover:border-indigo-400/50'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-6 h-6 rounded-xs object-cover shrink-0" />
                          <span className="truncate font-medium">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                      Direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={profileForm.profileImage || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-medium focus:outline-none focus:border-indigo-400 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* General Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Full Academic Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Academic Title
                </label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={profileForm.university}
                  onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Telephone
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Academic Identifiers & Links */}
            <div className="border-t border-indigo-500/20 pt-4 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-200 font-bold flex items-center gap-2">
                <Link className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Research Profiles & Identifiers</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    ORCID iD
                  </label>
                  <input
                    type="text"
                    placeholder="0000-0002-3647-8192"
                    value={profileForm.orcid || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, orcid: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Google Scholar Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://scholar.google.com/..."
                    value={profileForm.googleScholar || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, googleScholar: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    ResearchGate Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.researchgate.net/profile/..."
                    value={profileForm.researchGate || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, researchGate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Office Hours / Address
                  </label>
                  <input
                    type="text"
                    placeholder="Mon-Thu 8:30 AM - 12:30 PM (Main Campus)"
                    value={profileForm.officeHours || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, officeHours: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                Biography Summary
              </label>
              <textarea
                rows={4}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white focus:outline-none focus:border-indigo-400 font-serif-editorial italic text-xs font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-[0.2em] font-mono rounded-md cursor-pointer flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </form>
        )}

        {/* TAB 5: SECURITY & PASSWORDS */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="bg-[#0E1A38] border border-indigo-500/30 p-6 sm:p-8 rounded-md space-y-6 max-w-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-200 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Admin Password & Credentials Manager</span>
              </h2>
              <span className="text-[10px] font-mono text-indigo-300/70 font-semibold">Encrypted Admin Token</span>
            </div>

            <div className="p-4 bg-[#070D1B] border border-indigo-500/30 text-xs text-indigo-200 font-mono space-y-1 rounded-md">
              <p><strong className="text-white">Active Account:</strong> <span className="text-amber-300">{adminUser.username}</span> ({adminUser.role})</p>
              <p className="text-[10px] text-indigo-300/60 font-semibold">Updating your password takes effect immediately for future logins across all sessions.</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password (e.g. admin123)"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password to confirm"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-[0.2em] font-mono rounded-md cursor-pointer flex items-center gap-2 shadow-md transition-all"
            >
              <Key className="w-4 h-4" />
              <span>{passwordLoading ? 'Updating Password...' : 'Update Password Credentials'}</span>
            </button>
          </form>
        )}

      </div>

      {/* PUBLICATION FORM MODAL (ADD / EDIT) */}
      {pubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-indigo-500/40 w-full max-w-2xl rounded-md p-6 sm:p-8 text-white space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <button
              onClick={() => setPubModalOpen(false)}
              className="absolute top-4 right-4 text-indigo-300 hover:text-white font-mono text-xs cursor-pointer p-1"
            >
              [✕]
            </button>

            <h2 className="text-lg font-black uppercase tracking-wider text-white border-b border-indigo-500/30 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>{editingPub ? `Edit Publication #${editingPub.id}` : 'Add New Peer-Reviewed Publication'}</span>
            </h2>

            <form onSubmit={handleSavePublication} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  value={pubForm.title}
                  onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                  placeholder="e.g. Prevalence and risk factors associated with birth asphyxia..."
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Journal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pubForm.journal}
                    onChange={(e) => setPubForm({ ...pubForm, journal: e.target.value })}
                    placeholder="e.g. PLoS ONE or BMC Pregnancy and Childbirth"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Publication Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={pubForm.year}
                    onChange={(e) => setPubForm({ ...pubForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Authors List
                </label>
                <input
                  type="text"
                  value={pubForm.authors}
                  onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                  placeholder="e.g. Hassen Mosa, Abdo RA, Kebede BA, et al."
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Research Category
                  </label>
                  <select
                    value={pubForm.category}
                    onChange={(e) => setPubForm({ ...pubForm, category: e.target.value as Publication['category'] })}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-indigo-200 font-semibold focus:outline-none focus:border-indigo-400"
                  >
                    <option value="maternal">Maternal Healthcare</option>
                    <option value="neonatal">Neonatal & Birth Asphyxia</option>
                    <option value="preterm">Preterm Birth Studies</option>
                    <option value="health-systems">Health Systems & Quality</option>
                    <option value="general">General Clinical & Public Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Volume / Issue / Article ID
                  </label>
                  <input
                    type="text"
                    value={pubForm.volumeIssue}
                    onChange={(e) => setPubForm({ ...pubForm, volumeIssue: e.target.value })}
                    placeholder="e.g. 16(8): e0255488"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    DOI Identifier
                  </label>
                  <input
                    type="text"
                    value={pubForm.doi}
                    onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
                    placeholder="e.g. 10.1371/journal.pone.0255488"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                    Direct Link URL
                  </label>
                  <input
                    type="text"
                    value={pubForm.link}
                    onChange={(e) => setPubForm({ ...pubForm, link: e.target.value })}
                    placeholder="https://doi.org/10.1371/journal.pone.0255488"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">
                  Abstract Overview / Key Findings
                </label>
                <textarea
                  rows={3}
                  value={pubForm.abstractPreview}
                  onChange={(e) => setPubForm({ ...pubForm, abstractPreview: e.target.value })}
                  placeholder="Summary of research methodology and clinical findings..."
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-medium focus:outline-none focus:border-indigo-400"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPubModalOpen(false)}
                  className="px-4 py-2 bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-md font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-md cursor-pointer shadow-md transition-all"
                >
                  {editingPub ? 'Update Manuscript' : 'Save & Add Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ACADEMIC POSITION MODAL */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-indigo-500/40 w-full max-w-lg rounded-md p-6 text-white space-y-4 relative font-mono text-xs shadow-2xl">
            <button
              onClick={() => setExpModalOpen(false)}
              className="absolute top-4 right-4 text-indigo-300 hover:text-white cursor-pointer p-1"
            >
              [✕]
            </button>

            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-indigo-500/30 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Add Academic Position</span>
            </h2>

            <form onSubmit={handleSaveExperience} className="space-y-3">
              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="e.g. Senior Research Associate"
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={expForm.institution}
                  onChange={(e) => setExpForm({ ...expForm, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Period</label>
                  <input
                    type="text"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="2022 - Present"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="Werabe, Ethiopia"
                    className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Responsibilities (One per line)</label>
                <textarea
                  rows={4}
                  value={expForm.responsibilitiesStr}
                  onChange={(e) => setExpForm({ ...expForm, responsibilitiesStr: e.target.value })}
                  placeholder="Coordinating research projects&#10;Mentoring graduate students"
                  className="w-full px-3 py-2 bg-[#070D1B] border border-indigo-500/40 rounded-md text-white font-medium focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black uppercase tracking-wider rounded-md cursor-pointer shadow-md transition-all"
              >
                Save Academic Position
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
