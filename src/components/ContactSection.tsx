import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Building, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profileData';
import { ProfileData } from '../types';
import { addContactMessageToFirestore } from '../lib/firebaseService';

interface ContactSectionProps {
  personalInfo?: ProfileData;
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ personalInfo, theme = 'light' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Research Collaboration',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ referenceId: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const info = personalInfo || PERSONAL_INFO;
  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Submit to Firebase Firestore
      const msg = await addContactMessageToFirestore({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        category: formData.category,
        message: formData.message,
      });

      // 2. Backup post to server API if needed
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => {});

      setSuccessResponse({
        referenceId: msg.id,
        message: 'Thank you for reaching out to Hassen Mosa Halil. Your message has been logged directly in the secure Firestore system.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'Research Collaboration',
        message: '',
      });
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      // Fallback to server API if Firestore client fails
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccessResponse({
            referenceId: data.referenceId,
            message: data.message,
          });
          setFormData({
            name: '',
            email: '',
            subject: '',
            category: 'Research Collaboration',
            message: '',
          });
        } else {
          setErrorMessage(data.error || 'Failed to submit contact inquiry.');
        }
      } catch (fallbackErr) {
        setErrorMessage('Network error submitting form. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`py-20 border-b transition-colors duration-300 ${
      isLight ? 'bg-[#FAFAF8] text-stone-900 border-stone-200' : 'bg-[#0A0A0A] text-white border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] ${
            isLight ? 'text-stone-900' : 'text-white'
          }`}>
            Academic Inquiries & Contact
          </h2>
          <p className={`mt-2 text-xs sm:text-sm font-serif-editorial italic ${
            isLight ? 'text-stone-600' : 'text-zinc-400'
          }`}>
            Direct channel for scientific research collaborations, peer review invitations, grant proposals, and academic advisement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`border rounded-sm p-6 space-y-6 ${
              isLight ? 'bg-white border-stone-200 shadow-xs text-stone-900' : 'bg-zinc-900 border-white/10 text-white'
            }`}>
              <h3 className={`text-xs font-mono uppercase tracking-[0.2em] pb-3 border-b ${
                isLight ? 'text-stone-600 font-bold border-stone-200' : 'text-zinc-400 border-white/10'
              }`}>
                Official Directory & Office
              </h3>

              <div className="space-y-5 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-sm border shrink-0 ${
                    isLight ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-[#0A0A0A] border-white/10 text-zinc-400'
                  }`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block ${
                      isLight ? 'text-stone-500 font-semibold' : 'text-zinc-500'
                    }`}>Email</span>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className={`font-bold hover:underline ${
                      isLight ? 'text-stone-900' : 'text-white'
                    }`}>
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-sm border shrink-0 ${
                    isLight ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-[#0A0A0A] border-white/10 text-zinc-400'
                  }`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block ${
                      isLight ? 'text-stone-500 font-semibold' : 'text-zinc-500'
                    }`}>Direct Telephone</span>
                    <a href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`} className={`font-bold hover:underline font-mono ${
                      isLight ? 'text-stone-900' : 'text-white'
                    }`}>
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-sm border shrink-0 ${
                    isLight ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-[#0A0A0A] border-white/10 text-zinc-400'
                  }`}>
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block ${
                      isLight ? 'text-stone-500 font-semibold' : 'text-zinc-500'
                    }`}>Departmental Office</span>
                    <p className={`font-medium ${
                      isLight ? 'text-stone-700' : 'text-zinc-300'
                    }`}>
                      Dept. of Midwifery, College of Medicine & Health Sciences, {PERSONAL_INFO.university}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-sm border shrink-0 ${
                    isLight ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-[#0A0A0A] border-white/10 text-zinc-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block ${
                      isLight ? 'text-stone-500 font-semibold' : 'text-zinc-500'
                    }`}>Location</span>
                    <p className={`font-medium ${
                      isLight ? 'text-stone-700' : 'text-zinc-300'
                    }`}>
                      {PERSONAL_INFO.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${
                  isLight ? 'text-stone-600 font-semibold' : 'text-zinc-500'
                }`}>
                  <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-stone-700' : 'text-zinc-400'}`} /> Academic Turnaround: 24–48 Hours
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className={`border rounded-sm p-6 sm:p-8 ${
              isLight ? 'bg-white border-stone-200 shadow-xs text-stone-900' : 'bg-zinc-900 border-white/10 text-white'
            }`}>
              <h3 className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 border-b pb-3 ${
                isLight ? 'text-stone-600 font-bold border-stone-200' : 'text-zinc-400 border-white/10'
              }`}>
                Send Academic Inquiry Message
              </h3>

              {successResponse ? (
                <div className={`p-6 border space-y-3 rounded-sm ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-800' : 'bg-[#0A0A0A] border-white/20 text-zinc-200'
                }`}>
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inquiry Dispatched
                  </div>
                  <p className={`text-xs font-serif-editorial italic leading-relaxed ${
                    isLight ? 'text-stone-700' : 'text-zinc-300'
                  }`}>{successResponse.message}</p>
                  <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
                    Reference ID: {successResponse.referenceId}
                  </p>
                  <button
                    onClick={() => setSuccessResponse(null)}
                    className={`mt-2 px-4 py-2 font-bold text-[10px] uppercase tracking-widest rounded-sm cursor-pointer ${
                      isLight ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className={`p-3 border text-xs flex items-center gap-2 font-mono rounded-sm ${
                      isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-zinc-950 border-white/20 text-zinc-300'
                    }`}>
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 ${
                        isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                      }`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                        className={`w-full px-3.5 py-2.5 border rounded-sm text-xs font-mono focus:outline-none ${
                          isLight
                            ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500'
                            : 'bg-[#0A0A0A] border-white/10 text-white placeholder-zinc-600 focus:border-white/30'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 ${
                        isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                      }`}>
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane.smith@university.edu"
                        className={`w-full px-3.5 py-2.5 border rounded-sm text-xs font-mono focus:outline-none ${
                          isLight
                            ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500'
                            : 'bg-[#0A0A0A] border-white/10 text-white placeholder-zinc-600 focus:border-white/30'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 ${
                        isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                      }`}>
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-sm text-xs font-mono focus:outline-none ${
                          isLight
                            ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500'
                            : 'bg-[#0A0A0A] border-white/10 text-white focus:border-white/30'
                        }`}
                      >
                        <option value="Research Collaboration">Research Collaboration</option>
                        <option value="Peer Review Request">Peer Review Request</option>
                        <option value="Student Inquiry">Student / Thesis Advisement</option>
                        <option value="General">General Academic Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 ${
                        isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                      }`}>
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Joint manuscript invitation"
                        className={`w-full px-3.5 py-2.5 border rounded-sm text-xs font-mono focus:outline-none ${
                          isLight
                            ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500'
                            : 'bg-[#0A0A0A] border-white/10 text-white placeholder-zinc-600 focus:border-white/30'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 ${
                      isLight ? 'text-stone-600 font-semibold' : 'text-zinc-400'
                    }`}>
                      Message Content *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline your proposal or inquiry details..."
                      className={`w-full px-3.5 py-2.5 border rounded-sm text-xs font-mono focus:outline-none ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500'
                          : 'bg-[#0A0A0A] border-white/10 text-white placeholder-zinc-600 focus:border-white/30'
                      }`}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 font-bold text-xs uppercase tracking-[0.2em] font-mono flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer rounded-sm ${
                      isLight
                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Transmitting Message...' : 'Submit Academic Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
