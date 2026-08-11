import { Publication, ExperienceItem, EducationItem, EditorialRole, CertificateItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Hassen Mosa Halil',
  title: 'Lecturer & Researcher in Midwifery & Public Health',
  university: 'Werabe University',
  department: 'Department of Midwifery, College of Medicine and Health Sciences',
  location: 'Werabe, Central Ethiopia Regional State, Ethiopia',
  email: 'hassenmosa17@gmail.com',
  phone: '+251 916 691 578',
  nationality: 'Ethiopian',
  languages: [
    { language: 'Siltigna', level: 'Native Speaker' },
    { language: 'Amharic', level: 'Very Good' },
    { language: 'English', level: 'Very Good' },
  ],
  bio: 'Experienced academic lecturer, public health researcher, and head of midwifery department with over 12 years in health science education, institutional review boards, and reproductive health research. Author of 27+ peer-reviewed publications focusing on maternal and neonatal healthcare, birth asphyxia, preterm birth, obstetric complications, and health systems responsiveness.',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  orcid: '0000-0002-3647-8192',
  googleScholar: 'https://scholar.google.com/citations?user=HassenMosa',
  researchGate: 'https://www.researchgate.net/profile/Hassen-Mosa',
  scopus: 'https://www.scopus.com/authid/detail.uri?authorId=5721111',
  officeHours: 'Monday - Thursday: 8:30 AM - 12:30 PM (Main Campus, CMHS)',
  stats: {
    publications: 27,
    reviewerJournals: 15,
    editorJournals: 4,
    yearsExperience: 12,
  }
};

export const WORK_EXPERIENCES: ExperienceItem[] = [
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
      'Reviewer and Ethical Board member of Werabe University Institutional Review Board.',
      'Institutional Review Board member of Public Health Institute of Central Region of Ethiopia.',
      'Advisor for undergraduate and postgraduate research projects in maternal and child health.'
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
  },
  {
    id: 'exp-3',
    role: 'Assistant Lecturer',
    institution: 'Hossana College of Health Science',
    period: '2013 - 2016',
    location: 'Hossana, Ethiopia',
    responsibilities: [
      'Delivered lectures and practical clinical mentorship for health science students.',
      'Supervised community health practice and hospital clinical attachments.'
    ]
  }
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: 'edu-1',
    institution: 'Jimma University',
    location: 'Jimma, Ethiopia',
    degree: 'MSc in Maternity Health Nursing',
    date: '28 June 2018',
    details: 'Specialized advanced study in maternal health care, obstetric nursing, and health research methodologies.'
  },
  {
    id: 'edu-2',
    institution: 'Hawassa University',
    location: 'Hawassa, Ethiopia',
    degree: 'BSc in Midwifery / Nursing',
    date: '12 July 2012',
    details: 'Comprehensive health science and clinical midwifery undergraduate program.'
  },
  {
    id: 'edu-3',
    institution: 'Werabe Preparatory School',
    location: 'Werabe, Ethiopia',
    degree: 'Preparatory School Certificate',
    date: '2008'
  },
  {
    id: 'edu-4',
    institution: 'Silti Secondary School',
    location: 'Silti, Ethiopia',
    degree: 'Secondary Education Certificate',
    date: '2007'
  },
  {
    id: 'edu-5',
    institution: 'Boze Primary School',
    location: 'Kibet, Ethiopia',
    degree: 'Primary School Certificate',
    date: '2002'
  }
];

export const PUBLICATIONS_LIST: Publication[] = [
  {
    id: 1,
    title: 'Prevalence and contributing factors of birth asphyxia among the neonates delivered at Nigist Eleni Mohammed memorial teaching hospital, Southern Ethiopia: a cross-sectional study',
    authors: 'Abdo RA, Hassen Mosa, Kebede BA, Anshebo AA, Gejo NG',
    journal: 'BMC Pregnancy and Childbirth',
    year: 2019,
    volumeIssue: '19:536',
    doi: '10.1186/s12884-019-2696-6',
    link: 'https://doi.org/10.1186/s12884-019-2696-6',
    category: 'neonatal',
    abstractPreview: 'Assesses the prevalence and clinical risk determinants of birth asphyxia among newborns in Southern Ethiopia teaching hospital.'
  },
  {
    id: 2,
    title: 'Factors associated with preterm birth at Wachemo University Nigist Eleni Mohammed memorial hospital, southern Ethiopia: case-control study',
    authors: 'Gejo NG, W/Mariam MT, Kebede BA, Abdo RA, Anshebo AA, Hassen Mosa et al.',
    journal: 'BMC Pregnancy and Childbirth',
    year: 2021,
    volumeIssue: '21:35',
    doi: '10.1186/s12884-020-03503-9',
    link: 'https://doi.org/10.1186/s12884-020-03503-9',
    category: 'preterm',
    abstractPreview: 'Case-control study identifying maternal and obstetric factors correlated with premature births.'
  },
  {
    id: 3,
    title: 'The effects of isobaric and hyperbaric bupivacaine on maternal hemodynamic changes post spinal anesthesia for elective cesarean delivery: A prospective cohort study',
    authors: 'Helill SE, Sahile WA, Abdo RA, Wolde GD, Hassen Mosa',
    journal: 'PLoS ONE',
    year: 2019,
    volumeIssue: '14(12): e0226030',
    doi: '10.1371/journal.pone.0226030',
    link: 'https://doi.org/10.1371/journal.pone.0226030',
    category: 'maternal',
    abstractPreview: 'Comparative evaluation of hemodynamic stability during elective C-section under different bupivacaine formulations.'
  },
  {
    id: 4,
    title: 'Determinants of dietary diversity practice among pregnant women attending antenatal clinic at Wachemo University Nigist Eleni Mohammed memorial referral hospital, Southern Ethiopia',
    authors: 'Delil R, Zinab B, Hassen Mosa, Ahmed R, Hassen H',
    journal: 'PLoS ONE',
    year: 2021,
    volumeIssue: '16(4): e0250037',
    doi: '10.1371/journal.pone.0250037',
    link: 'https://doi.org/10.1371/journal.pone.0250037',
    category: 'maternal',
    abstractPreview: 'Investigates socio-demographic and nutritional factors governing dietary diversity practices in pregnant mothers.'
  },
  {
    id: 5,
    title: 'Prevalence and risk factors associated with birth asphyxia among neonates delivered in Ethiopia: A systematic review and meta-analysis',
    authors: 'Ahmed R, Hassen Mosa, Sultan M, Helill SE, Assefa B, Abdu M, et al.',
    journal: 'PLoS ONE',
    year: 2021,
    volumeIssue: '16(8): e0255488',
    doi: '10.1371/journal.pone.0255488',
    link: 'https://doi.org/10.1371/journal.pone.0255488',
    category: 'neonatal',
    abstractPreview: 'Nationwide meta-analysis quantifying the cumulative prevalence and major determinants of neonatal asphyxia across Ethiopian health facilities.'
  },
  {
    id: 6,
    title: 'Health system responsiveness in maternity care at Hadiya zone public hospitals in Southern Ethiopia: Users’ perspectives',
    authors: 'Abdo RA, Hassen Mosa, Kebede BA, Anshebo AA, Ayalew MD, Nedamo SA, et al.',
    journal: 'PLoS ONE',
    year: 2021,
    volumeIssue: '16(10): e0258092',
    doi: '10.1371/journal.pone.0258092',
    link: 'https://doi.org/10.1371/journal.pone.0258092',
    category: 'health-systems',
    abstractPreview: 'Evaluates patient satisfaction, dignity, and responsiveness metrics across public hospital maternity wards.'
  },
  {
    id: 7,
    title: 'Prevalence and factors associated with failed induction of labor in Worabe Comprehensive Specialized Hospital, Southern Ethiopia',
    authors: 'Mohammed M, Oumer R, Mohammed F, Walle F, Hassen Mosa, Ahmed R, et al.',
    journal: 'PLoS ONE',
    year: 2022,
    volumeIssue: '17(1): e0263371',
    doi: '10.1371/journal.pone.0263371',
    link: 'https://doi.org/10.1371/journal.pone.0263371',
    category: 'maternal',
    abstractPreview: 'Examines clinical rates and risk factors contributing to unsuccessful labor induction at Worabe hospital.'
  },
  {
    id: 8,
    title: 'Magnitude of Preterm Birth and Its Associated Factors: A Cross-Sectional Study at Butajira Hospital, Southern Nations, Nationalities, and People’s Region, Ethiopia',
    authors: 'Abdo RA, Hassen Mosa, Muhammed MA, Karebo MS',
    journal: 'Hindawi International Journal of Pediatrics',
    year: 2020,
    volumeIssue: 'Article ID 6303062',
    doi: '10.1155/2020/6303062',
    link: 'https://doi.org/10.1155/2020/6303062',
    category: 'preterm',
    abstractPreview: 'Analyzes preterm birth rates and maternal health predictors in Butajira General Hospital.'
  },
  {
    id: 9,
    title: 'Prevalence and Factors Associated with Anemia Among Pregnant Women in Hossana Town, Southern Ethiopia: A Cross-Sectional Study',
    authors: 'Kedir RD, Hassen Mosa, Reta AE, Helill SE, Abdo RA',
    journal: 'Journal of Nepal Pediatric Society',
    year: 2021,
    volumeIssue: '41(2):218-25',
    doi: '10.3126/jnps.v41i2.32436',
    link: 'https://doi.org/10.3126/jnps.v41i2.32436',
    category: 'maternal',
    abstractPreview: 'Surveys gestational anemia prevalence and associated dietary and socio-economic markers.'
  },
  {
    id: 10,
    title: 'Prevalence and Associated Factors of Pre-eclampsia among Pregnant Women at Antenatal Booking in the Halaba Kullito General Hospital, Southern Ethiopia',
    authors: 'Andarge RB, Anshebo AA, Hassen Mosa, Kebede BA, Abdo RA',
    journal: 'Journal of Women\'s Health Care',
    year: 2020,
    volumeIssue: '9:496',
    doi: '10.35248/2167-0420.20.9.496',
    link: 'https://doi.org/10.35248/2167-0420.20.9.496',
    category: 'maternal',
    abstractPreview: 'Identifies early antenatal predictors and risk profile for pre-eclampsia.'
  },
  {
    id: 11,
    title: 'Prevalence and Predictors of Adverse Birth Outcome among Deliveries at Butajira General Hospital, Gurage Zone, SNNPR, Ethiopia',
    authors: 'Abdo RA, Hassen Mosa, Kebede BA',
    journal: 'Journal of Women\'s Health Care',
    year: 2019,
    volumeIssue: '8:474',
    doi: '10.35248/2167-0420.19.8.474',
    link: 'http://dx.doi.org/10.35248/2167-0420.19.8.474',
    category: 'neonatal',
    abstractPreview: 'Evaluates stillbirth, low birthweight, and birth trauma predictors during labor delivery.'
  },
  {
    id: 12,
    title: 'Magnitude and Factors Associated With Obstructed Labor among Women Delivered at Halaba Kulito Primary Hospital, Southern Ethiopia',
    authors: 'Abdo RA, Hassen Mosa',
    journal: 'Journal of Women\'s Health Care',
    year: 2019,
    volumeIssue: '8:453',
    doi: '10.4172/2167-0420.1000453',
    link: 'https://doi.org/10.4172/2167-0420.1000453',
    category: 'maternal',
    abstractPreview: 'Analyzes anatomical, maternal, and health delivery factors leading to obstructed labor.'
  },
  {
    id: 13,
    title: 'Predictors of Cesarean Section among Women Delivered at Durame General Hospital, Southern Ethiopia',
    authors: 'Hassen Mosa, Abdo RA, Hellil SE, Kedir RD',
    journal: 'Journal of Women\'s Health Care',
    year: 2020,
    volumeIssue: '9:482',
    doi: '10.35248/2167-0420.20.9.482',
    link: 'http://dx.doi.org/10.35248/2167-0420.20.9.482',
    category: 'maternal',
    abstractPreview: 'Primary study led by Hassen Mosa determining clinical indications for surgical delivery.'
  },
  {
    id: 14,
    title: 'Magnitude and Factors Affecting Long-acting Reversible Contraceptive Utilization among Reproductive Age Women in Silti District, Southern Ethiopia',
    authors: 'Kebede BA, Belete MA, Negeri HA, Hassen Mosa, Anshebo AA, Abdo RA',
    journal: 'Journal of Women\'s Health Care',
    year: 2020,
    volumeIssue: '9:494',
    doi: '10.35248/2167-0420.20.9.494',
    link: 'http://dx.doi.org/10.35248/2167-0420.20.9.494',
    category: 'health-systems',
    abstractPreview: 'Assesses community adoption and barriers to long-acting reversible contraceptive methods in Silti.'
  },
  {
    id: 15,
    title: 'The Rate, Indications and Contributing Factors of Cesarean Delivery in Southern Nation Nationalities and People’s Region, Ethiopia',
    authors: 'Abayneh Mache G, Hassen Mosa, Abdo RA',
    journal: 'Journal of Midwifery and Reproductive Health',
    year: 2021,
    volumeIssue: '9(1):2541-2547',
    doi: '10.22038/jmrh.2020.48476.1596',
    link: 'https://dx.doi.org/10.22038/jmrh.2020.48476.1596',
    category: 'maternal',
    abstractPreview: 'Regional survey documenting C-section rates against WHO recommendation thresholds.'
  },
  {
    id: 16,
    title: 'Predictors of Low Birth Weight among Newborns Delivered At a Referral Hospital in Hadiya Zone, Southern Ethiopia',
    authors: 'Girma Hailu A, Alemu Anshebo A, Hassen Mosa, Abdo RA',
    journal: 'Journal of Midwifery and Reproductive Health',
    year: 2021,
    volumeIssue: '9(4):1-8',
    doi: '10.22038/jmrh.2021.53939.1660',
    link: 'https://dx.doi.org/10.22038/jmrh.2021.53939.1660',
    category: 'neonatal',
    abstractPreview: 'Statistical analysis of maternal health status, nutritional intake, and birthweight outcomes.'
  },
  {
    id: 17,
    title: 'Sero-prevalence and Risk Factors Associated with Hepatitis B Virus Infections among Pregnant Women at Shone Hospital, Southern Ethiopia',
    authors: 'Firde M, Hassen Mosa, Ahmed R, Demelash M, Endale F',
    journal: 'Journal of Midwifery and Reproductive Health',
    year: 2022,
    volumeIssue: '10(1): 1-9',
    doi: '10.22038/jmrh.2021.56706.1688',
    link: 'https://dx.doi.org/10.22038/jmrh.2021.56706.1688',
    category: 'maternal',
    abstractPreview: 'Screening for HBV seroprevalence in pregnant mothers to prevent vertical transmission.'
  },
  {
    id: 18,
    title: 'Birth Preparedness and Complication Readiness among Antenatal Care Attendants at Butajira General Hospital, Southern Ethiopia',
    authors: 'Hassen Mosa, Abdo RA, Kebede BA, Godana GA',
    journal: 'Journal of Pregnancy and Child Health',
    year: 2019,
    volumeIssue: '6: 417',
    doi: '10.4172/2376-127X.1000417',
    link: 'https://www.omicsonline.org/open-access/birth-preparedness-and-complication-readiness-among-antenatal-care-attendants-at-butajira-general-hospital-southern-ethiopia-109368.html',
    category: 'maternal',
    abstractPreview: 'Evaluates maternal knowledge and emergency readiness for labor delivery complications.'
  },
  {
    id: 19,
    title: 'Mistreatment and Its Associated Factors among Women during Labor and Delivery in Hospitals of Silte Town, Southern Ethiopia',
    authors: 'Hassen Mosa, Zeleke YT, RAA, Benti AT',
    journal: 'Journal of Midwifery and Reproductive Health',
    year: 2020,
    volumeIssue: '8(3):1-8',
    doi: '10.22038/jmrh.2020.43343.1512',
    link: 'https://dx.doi.org/10.22038/jmrh.2020.43343.1512',
    category: 'health-systems',
    abstractPreview: 'Groundbreaking research examining respectful maternity care and healthcare provider practices in Silte.'
  },
  {
    id: 20,
    title: 'Levels and associated factors of the maternal healthcare continuum in Hadiya zone, Southern Ethiopia: A multilevel analysis',
    authors: 'Ritbano Ahmed, Mohammed Sultan, Selamu Abose, Hassen Mosa et al.',
    journal: 'PLoS ONE',
    year: 2022,
    volumeIssue: '17(10): e0275752',
    doi: '10.1371/journal.pone.0275752',
    link: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0275752',
    category: 'health-systems',
    abstractPreview: 'Multilevel statistical modelling of retention across ANC, skilled delivery, and PNC maternity care.'
  },
  {
    id: 21,
    title: 'Skilled birth care uptake among women from socially disadvantaged minorities in the Kambata-Tambaro Zone, Southern Ethiopia',
    authors: 'Abebe Alemu, Biruk Assefa, Ritbano Ahmed, Hassen Mosa, Negesso Gebeyehu',
    journal: 'PLOS Global Public Health',
    year: 2022,
    volumeIssue: '11(2): e0001238',
    doi: '10.1371/journal.pgph.0001238',
    link: 'https://doi.org/10.1371/journal.pgph.0001238',
    category: 'health-systems',
    abstractPreview: 'Equity study investigating health service barriers for minority ethnic populations.'
  },
  {
    id: 22,
    title: 'Metabolic syndrome and its predictors among adults seeking medical care: A trending public health concern',
    authors: 'Oumer A, Jemal A, Girum T, Shemsu Kedir, Bedru A, Hassen Mosa, Assefa K',
    journal: 'Clinical Nutrition ESPEN',
    year: 2023,
    volumeIssue: '54: 1-7',
    doi: '10.1016/j.clnesp.2023.01.002',
    link: 'https://doi.org/10.1016/j.clnesp.2023.01.002',
    category: 'general',
    abstractPreview: 'Assessment of metabolic syndrome risk factors in adult outpatient populations.'
  },
  {
    id: 23,
    title: 'Pregnant women’s intentions to use maternity waiting homes and its associated factors in rural districts of Hadiya Zone, Southern Ethiopia',
    authors: 'Habtamu Hasen, Getachew Arage, Manayeh Mulusew, Romedan Delil, Ashebir Endale, Hassen Mosa, Ritbano Ahmed',
    journal: 'PLoS ONE',
    year: 2023,
    volumeIssue: '18(6): e0281652',
    doi: '10.1371/journal.pone.0281652',
    link: 'https://doi.org/10.1371/journal.pone.0281652',
    category: 'maternal',
    abstractPreview: 'Investigates willingness and structural determinants for maternity waiting home utilization among rural pregnant mothers.'
  },
  {
    id: 24,
    title: 'Management of preexisting pelvic organ prolapse in pregnancy complicated with preterm premature rupture of membrane: a case report',
    authors: 'Muhudin Arusi, Elham Abdulhakim, Yasin Awol, Hassen Mosa',
    journal: 'Journal of Medical Case Reports',
    year: 2023,
    volumeIssue: '17: 252',
    doi: '10.1186/s13256-023-03901-5',
    link: 'https://doi.org/10.1186/s13256-023-03901-5',
    category: 'maternal',
    abstractPreview: 'Clinical case management of complex high-risk obstetric case involving pelvic prolapse and PPROM.'
  },
  {
    id: 25,
    title: 'Status, Associated Factors, and Reasons for Bypassing the Childbirth Center among Postpartum Women in the Dire Dawa Administration, Ethiopia: a Mixed Study',
    authors: 'Mohammed A, Hassen Mosa, Hailu M, Getnet T, Manaye Y',
    journal: 'Int J Psychiatry',
    year: 2023,
    volumeIssue: '8(3): 40-50',
    category: 'health-systems',
    abstractPreview: 'Mixed-methods research exploring maternal choices to bypass local health facilities during labor.'
  },
  {
    id: 26,
    title: 'Magnitude, associated factors of difficult airway, and predictive value of airway examinations among maxillofacial surgery patients at public hospitals in Southern Ethiopia',
    authors: 'Abas Ali, Bilen Kassahun, Elias Habtu, Hassen Mosa et al.',
    journal: 'Annals of Medicine & Surgery',
    year: 2024,
    volumeIssue: 'DOI: 10.1097/MS9.000000000000175',
    doi: '10.1097/MS9.000000000000175',
    category: 'general',
    abstractPreview: 'Multicenter surgical study evaluating pre-operative airway management diagnostics.'
  },
  {
    id: 27,
    title: 'Puerperal Sepsis among Postpartum Women at Hadiya Zone, Ethiopia',
    authors: 'Hassen Mosa, Ritbano Ahmed, Abas Ali, Shemsu Oumer',
    journal: 'Journal of Midwifery and Reproductive Health',
    year: 2023,
    volumeIssue: '11:1-7',
    doi: '10.22038/jmrh.2024.72442.2123',
    link: 'https://dx.doi.org/10.22038/jmrh.2024.72442.2123',
    category: 'maternal',
    abstractPreview: 'Investigates risk factors and clinical determinants of postpartum puerperal sepsis.'
  }
];

export const EDITORIAL_BOARDS: EditorialRole[] = [
  { role: 'Editor', journal: 'PLoS ONE' },
  { role: 'Editor', journal: 'Women’s Health Science Journal' },
  { role: 'Editor', journal: 'Journal of Women\'s Reproductive Health' },
  { role: 'Editor', journal: 'Frontiers in Reproductive Health', section: 'Gynecology Section' },
];

export const REVIEWER_JOURNALS: EditorialRole[] = [
  { role: 'Reviewer', journal: 'PLoS ONE' },
  { role: 'Reviewer', journal: 'Journal of Medical Devices: Evidence and Research' },
  { role: 'Reviewer', journal: 'Clinical Epidemiology' },
  { role: 'Reviewer', journal: 'Journal of Patient Preference and Adherence' },
  { role: 'Reviewer', journal: 'International Journal of Women\'s Health' },
  { role: 'Reviewer', journal: 'Risk Management and Healthcare Policy' },
  { role: 'Reviewer', journal: 'Biomedical and Pharmacology Journal' },
  { role: 'Reviewer', journal: 'Heliyon' },
  { role: 'Reviewer', journal: 'International Journal of Reproductive Medicine' },
  { role: 'Reviewer', journal: 'Therapeutics and Clinical Risk Management' },
  { role: 'Reviewer', journal: 'International Journal of General Medicine' },
  { role: 'Reviewer', journal: 'Journal of Advances in Medicine and Medical Research' },
  { role: 'Reviewer', journal: 'Obstetrics and Gynecology International' },
  { role: 'Reviewer', journal: 'Frontiers in Reproductive Health (Gynecology)' },
  { role: 'Reviewer', journal: 'Journal of Multidisciplinary Healthcare' }
];

export const CERTIFICATES_AND_TRAININGS: CertificateItem[] = [
  { title: 'IMNCI (Integrated Management of Neonatal and Childhood Illness)', organizer: 'JHPIEGO, HRH project and EMA (Ethiopian Midwives Association)', date: 'March 2-7, 2015', category: 'Clinical & Pediatric' },
  { title: 'HBB (Helping Babies to Breathe)', organizer: 'JHPIEGO, HRH project and EMA', date: '2015', category: 'Neonatal Care' },
  { title: 'ETS (Effective Teaching Skills)', organizer: 'JHPIEGO HRH project and EMA', date: 'February 11-17, 2013', category: 'Medical Pedagogy' },
  { title: 'IP (Infection Prevention)', organizer: 'Hossana College of Health Science', date: '2014', category: 'Clinical Safety' },
  { title: 'Systematic Review and Meta-Analysis', organizer: 'Wachemo University', date: '2019', category: 'Research Methodology' },
  { title: 'Advanced Qualitative Research Methods', organizer: 'Wachemo University', date: 'April 04-06, 2019', category: 'Research Methodology' },
  { title: 'Classroom English Training', organizer: 'Wachemo University', date: 'March 3-5, 2022', category: 'Pedagogy' },
  { title: 'DTTP (Developmental Team Training Program)', organizer: 'Jimma University', date: 'Nov 2017 - Jan 2018', category: 'Leadership' },
  { title: 'PBL (Problem Based Learning)', organizer: 'Wachemo University & JHPIEGO', date: 'March 10-13, 2021', category: 'Pedagogy' },
  { title: 'PBL (Problem Based Learning)', organizer: 'Werabe University & JHPIEGO', date: 'February 26-30, 2022', category: 'Pedagogy' },
  { title: 'Data Management and Statistical Analysis Using SPSS Software', organizer: 'Werabe University', date: 'March 3-5, 2022', category: 'Data Analysis' },
  { title: 'Manuscript Writing and Publication', organizer: 'Werabe University', date: '2022', category: 'Academic Writing' },
  { title: 'RIMS (Research Information Management System)', organizer: 'Werabe University RPD Office', date: '2022', category: 'Research Systems' },
  { title: 'TOT Training on Preceptorship', organizer: 'Ethiopian Federal Ministry of Health & Maternity Foundation', date: '2023', category: 'Clinical Preceptorship' },
  { title: 'Implementation Research and Interventional Study', organizer: 'Werabe University', date: '2023', category: 'Research Methodology' },
  { title: 'Practical Grant Writing and Hunting', organizer: 'Werabe University', date: 'May 08-10, 2023', category: 'Grant Writing' }
];

export const AWARDS = [
  { title: 'Successful Completion of Research Award', year: '2023', institution: 'Werabe University' },
  { title: 'Successful Completion of Research Award', year: '2020', institution: 'Wachemo University' }
];

export const SKILL_HIGHLIGHTS = [
  'Conducting Maternal & Neonatal Health Research',
  'Manuscript Preparation & International Peer-Review Publication',
  'Research Advisory & Thesis Supervision',
  'Organizing Annual Research Forums & Academic Conferences',
  'Statistical Data Analysis (STATA, SPSS)',
  'Systematic Reviews & Meta-Analyses',
  'Scientific Presentation & Academic Communication',
  'Editorial Board Service & Peer Review'
];
