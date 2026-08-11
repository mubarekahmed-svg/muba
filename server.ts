import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PERSONAL_INFO, WORK_EXPERIENCES, EDUCATION_LIST, PUBLICATIONS_LIST, EDITORIAL_BOARDS, REVIEWER_JOURNALS, CERTIFICATES_AND_TRAININGS, AWARDS, SKILL_HIGHLIGHTS } from './src/data/profileData.js';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

// In-Memory Mutatable Data Store
let currentProfile = { ...PERSONAL_INFO };
let currentPublications = [...PUBLICATIONS_LIST];
let currentExperiences = [...WORK_EXPERIENCES];
let currentEducation = [...EDUCATION_LIST];
let currentEditorialBoards = [...EDITORIAL_BOARDS];
let currentReviewerJournals = [...REVIEWER_JOURNALS];
let currentCertificates = [...CERTIFICATES_AND_TRAININGS];
let currentAwards = [...AWARDS];
let currentSkills = [...SKILL_HIGHLIGHTS];
let contactSubmissions: ContactMessage[] = [
  {
    id: 'msg-sample-1',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@oxford.ac.uk',
    subject: 'Joint Systematic Review on Birth Asphyxia Meta-Analysis',
    category: 'Research Collaboration',
    message: 'Dear Dr. Hassen Mosa, We read your PLOS ONE 2021 meta-analysis on birth asphyxia prevalence in Ethiopia. We would like to invite you as a co-investigator on an upcoming East African multi-country maternal outcome cohort study.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: false
  },
  {
    id: 'msg-sample-2',
    name: 'Prof. Marcus Vance',
    email: 'm.vance@plos.org',
    subject: 'Peer Review Invitation - Maternal Mortality & Puerperal Sepsis',
    category: 'Peer Review Request',
    message: 'Dear Editor Hassen Mosa, Given your extensive publication record in BMC Pregnancy and PLoS ONE, we request your expert review on a novel manuscript regarding cesarean delivery predictors.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    read: true
  }
];

// Active Admin Tokens Set and Admin Password Store
const validTokens = new Set<string>();
let adminPasswords: Record<string, string> = {
  admin: 'admin123',
  hassen: 'werabe2026!',
  manager: 'admin123'
};

// Helper Auth Check
function isAuthenticated(req: Request): boolean {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  return Boolean(token && validTokens.has(token));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Gemini API Client initialization warning:", err);
    }
  }

  // API 1: Healthcheck
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API 2: Dynamic Full Data Sync for Client App
  app.get('/api/data', (req: Request, res: Response) => {
    res.json({
      personalInfo: {
        ...currentProfile,
        stats: {
          ...currentProfile.stats,
          publications: currentPublications.length,
          reviewerJournals: currentReviewerJournals.length,
          editorJournals: currentEditorialBoards.length,
        }
      },
      experiences: currentExperiences,
      education: currentEducation,
      publications: currentPublications,
      editorialBoards: currentEditorialBoards,
      reviewerJournals: currentReviewerJournals,
      skills: currentSkills,
      certificates: currentCertificates,
      awards: currentAwards
    });
  });

  // API 3: Profile Endpoint
  app.get('/api/profile', (req: Request, res: Response) => {
    res.json({
      personalInfo: currentProfile,
      experiences: currentExperiences,
      education: currentEducation,
      publicationsCount: currentPublications.length,
      editorialBoards: currentEditorialBoards,
      reviewerJournals: currentReviewerJournals,
      skills: currentSkills,
      awards: currentAwards
    });
  });

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION ENDPOINTS
  // ----------------------------------------------------

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const expectedPass = adminPasswords[cleanUser] || (cleanUser === 'admin' ? 'admin123' : null);
    const isValidUser = expectedPass && cleanPass === expectedPass;

    if (!isValidUser) {
      res.status(401).json({
        error: 'Invalid username or password credentials.'
      });
      return;
    }

    const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    validTokens.add(token);

    res.json({
      success: true,
      user: {
        username: cleanUser,
        role: 'admin',
        token,
        lastLogin: new Date().toISOString()
      }
    });
  });

  // Admin Change Password
  app.post('/api/admin/change-password', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized. Login required.' });
      return;
    }

    const { username, currentPassword, newPassword } = req.body;
    const cleanUser = String(username || 'admin').trim().toLowerCase();
    const cleanCurr = String(currentPassword || '').trim();
    const cleanNew = String(newPassword || '').trim();

    if (!cleanNew || cleanNew.length < 4) {
      res.status(400).json({ error: 'New password must be at least 4 characters long.' });
      return;
    }

    const activePass = adminPasswords[cleanUser] || 'admin123';
    if (cleanCurr !== activePass) {
      res.status(400).json({ error: 'Current password verified incorrect.' });
      return;
    }

    adminPasswords[cleanUser] = cleanNew;
    // Ensure default fallback 'admin' is updated too if user is admin
    if (cleanUser === 'admin') {
      adminPasswords['admin'] = cleanNew;
    }

    res.json({
      success: true,
      message: `Password updated successfully for account "${cleanUser}".`
    });
  });

  // Admin Token Verification
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ authenticated: false, error: 'Unauthorized token or expired session.' });
      return;
    }
    res.json({ authenticated: true, role: 'admin' });
  });

  // Admin Logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    if (token) {
      validTokens.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // ----------------------------------------------------
  // ADMIN CRUD ENDPOINTS (PROTECTED)
  // ----------------------------------------------------

  // CRUD 1: Publications - Create
  app.post('/api/admin/publications', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized. Admin login required.' });
      return;
    }

    const { title, authors, journal, year, volumeIssue, doi, link, category, abstractPreview } = req.body;
    if (!title || !journal || !year) {
      res.status(400).json({ error: 'Title, Journal, and Year are required.' });
      return;
    }

    const nextId = currentPublications.length > 0
      ? Math.max(...currentPublications.map(p => p.id)) + 1
      : 1;

    const newPub = {
      id: nextId,
      title: String(title).trim(),
      authors: authors ? String(authors).trim() : 'Hassen Mosa et al.',
      journal: String(journal).trim(),
      year: Number(year) || new Date().getFullYear(),
      volumeIssue: volumeIssue ? String(volumeIssue).trim() : undefined,
      doi: doi ? String(doi).trim() : undefined,
      link: link ? String(link).trim() : (doi ? `https://doi.org/${doi}` : undefined),
      category: category || 'maternal',
      abstractPreview: abstractPreview ? String(abstractPreview).trim() : undefined
    };

    currentPublications.unshift(newPub);
    currentProfile.stats.publications = currentPublications.length;

    res.status(201).json({
      success: true,
      message: 'Publication successfully created and added to index.',
      publication: newPub,
      totalCount: currentPublications.length
    });
  });

  // CRUD 2: Publications - Update
  app.put('/api/admin/publications/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized. Admin login required.' });
      return;
    }

    const id = Number(req.params.id);
    const index = currentPublications.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: `Publication ID #${id} not found.` });
      return;
    }

    const { title, authors, journal, year, volumeIssue, doi, link, category, abstractPreview } = req.body;

    currentPublications[index] = {
      ...currentPublications[index],
      title: title ? String(title).trim() : currentPublications[index].title,
      authors: authors ? String(authors).trim() : currentPublications[index].authors,
      journal: journal ? String(journal).trim() : currentPublications[index].journal,
      year: year ? Number(year) : currentPublications[index].year,
      volumeIssue: volumeIssue !== undefined ? String(volumeIssue).trim() : currentPublications[index].volumeIssue,
      doi: doi !== undefined ? String(doi).trim() : currentPublications[index].doi,
      link: link !== undefined ? String(link).trim() : currentPublications[index].link,
      category: category || currentPublications[index].category,
      abstractPreview: abstractPreview !== undefined ? String(abstractPreview).trim() : currentPublications[index].abstractPreview,
    };

    res.json({
      success: true,
      message: `Publication #${id} updated successfully.`,
      publication: currentPublications[index]
    });
  });

  // CRUD 3: Publications - Delete
  app.delete('/api/admin/publications/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized. Admin login required.' });
      return;
    }

    const id = Number(req.params.id);
    const initialLen = currentPublications.length;
    currentPublications = currentPublications.filter(p => p.id !== id);

    if (currentPublications.length === initialLen) {
      res.status(404).json({ error: `Publication #${id} not found.` });
      return;
    }

    currentProfile.stats.publications = currentPublications.length;

    res.json({
      success: true,
      message: `Publication #${id} deleted successfully.`,
      totalCount: currentPublications.length
    });
  });

  // CRUD 4: Experiences - Create / Update / Delete
  app.post('/api/admin/experiences', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { role, institution, period, location, responsibilities } = req.body;
    if (!role || !institution) {
      res.status(400).json({ error: 'Role and institution are required.' });
      return;
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      role: String(role).trim(),
      institution: String(institution).trim(),
      period: period ? String(period).trim() : 'Present',
      location: location ? String(location).trim() : 'Ethiopia',
      responsibilities: Array.isArray(responsibilities) ? responsibilities.map(r => String(r).trim()) : []
    };

    currentExperiences.unshift(newExp);
    res.status(201).json({ success: true, experience: newExp });
  });

  app.delete('/api/admin/experiences/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    currentExperiences = currentExperiences.filter(e => e.id !== id);
    res.json({ success: true, message: `Experience ${id} removed.` });
  });

  // CRUD 5: Profile Info Update
  app.put('/api/admin/profile', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { 
      name, title, university, department, location, email, phone, bio,
      profileImage, orcid, googleScholar, researchGate, scopus, officeHours
    } = req.body;

    currentProfile = {
      ...currentProfile,
      name: name ? String(name).trim() : currentProfile.name,
      title: title ? String(title).trim() : currentProfile.title,
      university: university ? String(university).trim() : currentProfile.university,
      department: department ? String(department).trim() : currentProfile.department,
      location: location ? String(location).trim() : currentProfile.location,
      email: email ? String(email).trim() : currentProfile.email,
      phone: phone ? String(phone).trim() : currentProfile.phone,
      bio: bio ? String(bio).trim() : currentProfile.bio,
      profileImage: profileImage !== undefined ? String(profileImage).trim() : currentProfile.profileImage,
      orcid: orcid !== undefined ? String(orcid).trim() : currentProfile.orcid,
      googleScholar: googleScholar !== undefined ? String(googleScholar).trim() : currentProfile.googleScholar,
      researchGate: researchGate !== undefined ? String(researchGate).trim() : currentProfile.researchGate,
      scopus: scopus !== undefined ? String(scopus).trim() : currentProfile.scopus,
      officeHours: officeHours !== undefined ? String(officeHours).trim() : currentProfile.officeHours,
    };

    res.json({ success: true, message: 'Profile metadata updated successfully.', personalInfo: currentProfile });
  });

  // CRUD 6: Contact Messages Management
  app.get('/api/admin/messages', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    res.json({ messages: contactSubmissions, unreadCount: contactSubmissions.filter(m => !m.read).length });
  });

  app.patch('/api/admin/messages/:id/status', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    const { id } = req.params;
    const msg = contactSubmissions.find(m => m.id === id);
    if (msg) {
      msg.read = !msg.read;
      res.json({ success: true, message: msg });
    } else {
      res.status(404).json({ error: 'Message not found.' });
    }
  });

  app.delete('/api/admin/messages/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    const { id } = req.params;
    contactSubmissions = contactSubmissions.filter(m => m.id !== id);
    res.json({ success: true, remaining: contactSubmissions.length });
  });

  // ----------------------------------------------------
  // PUBLIC CONTACT FORM SUBMISSION
  // ----------------------------------------------------
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, category, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields.' });
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : 'General Inquiry',
      category: category ? String(category) : 'General',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    contactSubmissions.unshift(newMessage);
    res.json({
      success: true,
      referenceId: newMessage.id,
      message: 'Thank you for reaching out to Hassen Mosa Halil. Your message has been successfully logged.',
      submissionCount: contactSubmissions.length
    });
  });

  // Helper knowledge base fallback generator
  function getAcademicKnowledgeReply(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('asphyxia') || q.includes('neonat') || q.includes('birth')) {
      const pub = currentPublications.find(p => p.title.toLowerCase().includes('asphyxia') || p.title.toLowerCase().includes('neonatal'));
      return `Hassen Mosa Halil has published empirical research on birth asphyxia in Ethiopian healthcare settings. Key study: "${pub ? pub.title : 'Prevalence and associated factors of perinatal asphyxia'}" published in ${pub ? pub.journal : 'PLOS ONE'} (${pub ? pub.year : '2021'}). His findings highlight critical predictors such as prolonged labor, meconium-stained amniotic fluid, and maternal anemia, emphasizing intrapartum monitoring to improve neonatal survival.`;
    }

    if (q.includes('preterm') || q.includes('prematur') || q.includes('weight') || q.includes('maternal')) {
      const pub = currentPublications.find(p => p.title.toLowerCase().includes('preterm') || p.title.toLowerCase().includes('maternal'));
      return `Regarding maternal health and preterm outcomes, Hassen Mosa Halil's research includes "${pub ? pub.title : 'Predictors of preterm birth in public hospitals'}" (${pub ? pub.journal : 'BMC Pregnancy & Childbirth'}, ${pub ? pub.year : '2020'}). His work investigates maternal nutrition, antenatal care attendance, gestational hypertension, and infectious diseases as determinants of adverse fetal outcomes.`;
    }

    if (q.includes('journal') || q.includes('editor') || q.includes('review') || q.includes('board')) {
      const boards = currentEditorialBoards.map(e => `${e.role} at ${e.journal}`).join(', ');
      const reviewerCount = currentReviewerJournals.length;
      return `Hassen Mosa Halil holds active editorial and peer-review appointments:
• Academic Editor / Editorial Board Member: ${boards}
• Peer Reviewer: Serves on ${reviewerCount} international peer-reviewed journals including PLoS ONE, Heliyon, Clinical Epidemiology, and BMC Pregnancy & Childbirth.
• Institutional Governance: Member of the Institutional Review Board (IRB) at Werabe University.`;
    }

    if (q.includes('contact') || q.includes('invite') || q.includes('collaborat') || q.includes('email') || q.includes('reach') || q.includes('phone')) {
      return `You can reach Hassen Mosa Halil directly for academic research collaborations, joint manuscript co-authorship, or peer review invitations:
• Email: ${currentProfile.email}
• Direct Tel: ${currentProfile.phone}
• Office: Department of Midwifery, College of Medicine & Health Sciences, ${currentProfile.university}, Werabe, Ethiopia.
• Turnaround Time: Academic inquiries are responded to within 24–48 hours.`;
    }

    if (q.includes('publication') || q.includes('paper') || q.includes('research') || q.includes('article') || q.includes('count')) {
      const top3 = currentPublications.slice(0, 3).map(p => `• "${p.title}" (${p.journal}, ${p.year})`).join('\n');
      return `Hassen Mosa Halil has published ${currentPublications.length} peer-reviewed research articles in international journals. Recent highlights include:
${top3}
Browse the full publication index on the 'Publications' tab on this site!`;
    }

    return `Hassen Mosa Halil is a Lecturer, Researcher, and Head of the Midwifery Department at Werabe University, Ethiopia. He holds an MSc in Clinical Midwifery and has published ${currentPublications.length} peer-reviewed studies in maternal-child health, neonatal outcomes, and healthcare quality. He serves as an Editor for ${currentEditorialBoards.length} journals and reviewer for ${currentReviewerJournals.length} international journals. For academic collaborations, contact ${currentProfile.email}.`;
  }

  // ----------------------------------------------------
  // GEMINI AI CHAT ASSISTANT
  // ----------------------------------------------------
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Valid message prompt is required.' });
        return;
      }

      if (!ai) {
        res.json({ reply: getAcademicKnowledgeReply(message) });
        return;
      }

      const profileContext = `
You are the official AI Research Assistant for Hassen Mosa Halil, Lecturer & Researcher at Werabe University, Ethiopia.
Your goal is to answer questions about Hassen Mosa Halil's research publications, clinical expertise in maternal and neonatal health, educational background, editorial roles, and academic accomplishments with professionalism, warmth, and precision.

Key Profile Information:
- Full Name: ${currentProfile.name}
- Title: ${currentProfile.title}, ${currentProfile.department}, ${currentProfile.university}.
- Contact: ${currentProfile.email} | ${currentProfile.phone}
- Bio: ${currentProfile.bio}
- Publications Count: ${currentPublications.length} peer-reviewed papers.
- Recent Publications Sample: ${currentPublications.slice(0, 8).map(p => `"${p.title}" (${p.journal}, ${p.year})`).join('; ')}
- Editorial Roles: ${currentEditorialBoards.map(e => `${e.role} at ${e.journal}`).join(', ')}
- Reviewer Boards: ${currentReviewerJournals.length} journals including PLoS ONE, Heliyon, Clinical Epidemiology.

Instructions:
1. Provide concise, clear, and informative answers.
2. Refer to actual published research papers where relevant.
3. Keep tone respectful, scholarly, and supportive.
4. Encourage collaboration inquiries via email.
`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `User Question: ${message}` }] }
          ],
          config: {
            systemInstruction: profileContext,
            temperature: 0.7,
          }
        });

        const replyText = response.text || getAcademicKnowledgeReply(message);
        res.json({ reply: replyText });
      } catch (geminiError: any) {
        console.warn('Gemini API call warning (using academic fallback):', geminiError?.message || geminiError);
        // Clean fallback response when Gemini project permission is denied or API error occurs
        res.json({ reply: getAcademicKnowledgeReply(message) });
      }
    } catch (error: any) {
      console.error('Server error processing chat:', error);
      res.json({ reply: getAcademicKnowledgeReply(req.body?.message || '') });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

