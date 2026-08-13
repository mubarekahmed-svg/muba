# Dr. Hassen Mosa Halil — Faculty Academic & Research Portal

A full-stack, responsive academic web application and administrative management portal for **Dr. Hassen Mosa Halil** (Assistant Professor of Public Health & Clinical Midwifery, College of Medicine and Health Sciences, Werabe University, Ethiopia).

Built with **React**, **Vite**, **Tailwind CSS**, **Express.js**, and **Firebase Firestore**.

---

## 🚀 Features

- **Faculty Hero & Profile Banner**: Displays official credentials, ORCID ID, Scopus citations, and live active status badge.
- **Peer-Reviewed Publications Directory**: Interactive search and category filter (*Maternal Health*, *Neonatal Care*, *Reproductive Epidemiology*) with direct DOI links.
- **Academic & Clinical Photo Gallery**: Filterable photo gallery displaying fieldwork, clinical simulation labs, university symposia, and campus life with a high-resolution lightbox modal.
- **Visual Research Analytics**: Bar charts and growth trends for annual publication metrics and citations.
- **Academic & Clinical Tenure Timeline**: Historical positions across Werabe University, Wachemo University, and primary health care units.
- **Faculty Command Center (Admin Portal)**:
  - **Multi-Tab Authentication**: Direct credential sign-in, co-admin registration, and password reset workflows.
  - **Firebase Google SSO Auth**: Integrated Google single sign-on support.
  - **Profile & Avatar Manager**: Live profile picture upload, URL input, and preset avatar selection. Updates sync directly to Firestore.
  - **Photo Gallery Manager**: Publish, edit, and delete photo gallery items with captions, categories, and dates.
  - **Inbound Message Inbox**: Read and log contact inquiry messages.
  - **Team Security Command**: Manage co-admin account roles, suspend/activate accounts, and view live real-time audit logs.
- **AI Academic Assistant**: Powered by Google Gemini API to answer public questions about Dr. Hassen's research papers and office hours.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / API**: Node.js, Express.js (`server.ts`), Google Gen AI SDK (`@google/genai`).
- **Database & Auth**: Firebase Firestore (real-time collections for `publications`, `experiences`, `gallery`, `profile`, `adminUsers`, `auditLogs`, `contactMessages`) and Firebase Authentication.
- **Deployment**: Configured with relative paths (`base: './'`) for seamless static hosting on **GitHub Pages**.

---

## 📦 Local Development Instructions

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/dr-hassen-mosa-portal.git
cd dr-hassen-mosa-portal
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## 🌐 Deploying to GitHub Pages

This repository is pre-configured with a relative base path (`base: './'` in `vite.config.ts`) and a GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Method 1: Automated GitHub Actions (Recommended)
1. Push this code to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Dr. Hassen Mosa Halil Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, choose **GitHub Actions**.
4. The workflow will automatically build and publish your site to `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`.

### Method 2: Manual Build & Push
```bash
npm run build
```
The output files inside `dist/` can be published directly to a `gh-pages` branch or any static web host.

---

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Super Admin Email**: `mubarek.ahmed@astu.edu.et` / `hassenmosa17@gmail.com`

---

## 📄 License

Academic Portal & Research Materials © 2026 Dr. Hassen Mosa Halil & Werabe University CMHS.
