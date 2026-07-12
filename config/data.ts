export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSet {
  id: string;
  subject: string;
  grade: string;
  title: string;
  part: number;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uploadedBy: string;
  school: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface Paper {
  id: string;
  grade: '7' | '9' | '12';
  subject: string;
  year: number;
  paperNumber: number;
  fileSize: string;
  downloads: number;
  uploadedBy: string;
  school: string;
  uploadedAt: string;
  fileUri?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorGrade: string;
  subject: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  liked: boolean;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  pages: number;
  uploadedBy: string;
  school: string;
  date: string;
  fileUri?: string;
}

export interface Video {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  teacher: string;
  school: string;
  views: number;
  thumbnail: string;
  uploadedAt: string;
  fileUri?: string;
}

export interface Formula {
  id: string;
  name: string;
  subject: string;
  formula: string;
  variables: string;
  example: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  urgent: boolean;
}

export interface StudentRecord {
  id: string;
  name: string;
  grade: string;
  school: string;
  quizzesCompleted: number;
  avgScore: number;
  lastActive: string;
}

// ─── All content now comes from teacher uploads (AsyncStorage) ─
export const QUIZ_SETS: QuizSet[] = [];
export const PAPERS: Paper[] = [];
export const NOTES: Note[] = [];
export const VIDEOS: Video[] = [];

// ─── SUBJECTS (used across screens) ──────────────────────────
export const SUBJECTS = [
  'Mathematics', 'Biology', 'Chemistry', 'Physics',
  'English', 'Civic Education', 'History', 'Geography',
  'Integrated Science', 'Social Studies',
];

// ─── COMMUNITY POSTS ─────────────────────────────────────────
export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: 'cp1', authorName: 'Mwape Chileshe', authorGrade: 'Grade 12', subject: 'Mathematics', content: 'Can someone help me understand integration by parts? I have tried many times but I keep getting confused at the uv step. Any tips or worked examples would be really helpful!', likes: 12, replies: 5, timestamp: '2 hours ago', liked: false },
  { id: 'cp2', authorName: 'Natasha Mwamba', authorGrade: 'Grade 9', subject: 'Biology', content: 'Quick tip: To remember the order of taxonomy (Kingdom, Phylum, Class, Order, Family, Genus, Species), use: "Kings Play Chess On Fancy Green Surfaces". Hope this helps everyone studying for exams!', likes: 34, replies: 8, timestamp: '5 hours ago', liked: false },
  { id: 'cp3', authorName: 'Bwalya Kapambwe', authorGrade: 'Grade 12', subject: 'Chemistry', content: 'I have uploaded my notes on organic chemistry reactions. Check the notes section. It covers alkanes, alkenes, and alkynes with all reaction mechanisms. Very useful for Paper 2!', likes: 47, replies: 12, timestamp: '1 day ago', liked: false },
  { id: 'cp4', authorName: 'Thandiwe Phiri', authorGrade: 'Grade 9', subject: 'Physics', content: 'What is the difference between speed and velocity? I always mix them up in exams. Speed is scalar (just magnitude) but velocity is a vector (magnitude + direction). Let me know if you need more examples.', likes: 8, replies: 9, timestamp: '1 day ago', liked: false },
  { id: 'cp5', authorName: 'Chileshe Mubanga', authorGrade: 'Grade 12', subject: 'English', content: 'Grade 12 English Paper 1 2023 tip: The comprehension section focuses on environmental conservation and youth empowerment themes. Practice writing topic sentences and concluding paragraphs. Check the ECZ marking scheme for tips on what examiners look for.', likes: 56, replies: 14, timestamp: '2 days ago', liked: false },
  { id: 'cp6', authorName: 'Musamba Lungu', authorGrade: 'Grade 7', subject: 'Mathematics', content: 'What is the easiest way to find the LCM of two numbers? My teacher explained it but I did not understand properly. Is listing multiples better or using prime factorization?', likes: 6, replies: 7, timestamp: '3 days ago', liked: false },
  { id: 'cp7', authorName: 'Kasonde Mutale', authorGrade: 'Grade 12', subject: 'Civic Education', content: 'Remember: Zambia gained independence on 24th October 1964. The first president was Dr. Kenneth Kaunda. Zambia has 10 provinces. These facts always appear in Civic Education papers so memorise them well!', likes: 29, replies: 4, timestamp: '3 days ago', liked: false },
  { id: 'cp8', authorName: 'Precious Banda', authorGrade: 'Grade 9', subject: 'Chemistry', content: 'Formula reminder: Density = Mass divided by Volume. The units are kg/m³ or g/cm³. If Mass = 200g and Volume = 40cm³, then Density = 5 g/cm³. Easy way to remember: "D = M over V". Write this on a sticky note!', likes: 41, replies: 6, timestamp: '4 days ago', liked: false },
];

// ─── FORMULA BANK ─────────────────────────────────────────────
export const FORMULAS: Formula[] = [
  { id: 'f1', name: 'Area of a Circle', subject: 'Mathematics', formula: 'A = πr²', variables: 'A = area, π ≈ 3.14159, r = radius', example: 'If r = 7 cm, A = π × 7² = 154 cm²' },
  { id: 'f2', name: 'Circumference of Circle', subject: 'Mathematics', formula: 'C = 2πr', variables: 'C = circumference, π ≈ 3.14159, r = radius', example: 'If r = 5 cm, C = 2 × π × 5 ≈ 31.4 cm' },
  { id: 'f3', name: "Newton's Second Law", subject: 'Physics', formula: 'F = ma', variables: 'F = force (N), m = mass (kg), a = acceleration (m/s²)', example: 'If m = 10 kg, a = 3 m/s², F = 30 N' },
  { id: 'f4', name: 'Kinetic Energy', subject: 'Physics', formula: 'KE = ½mv²', variables: 'KE = kinetic energy (J), m = mass (kg), v = velocity (m/s)', example: 'If m = 2 kg, v = 4 m/s, KE = ½ × 2 × 16 = 16 J' },
  { id: 'f5', name: 'Potential Energy', subject: 'Physics', formula: 'PE = mgh', variables: 'PE = potential energy (J), m = mass (kg), g = 9.8 m/s², h = height (m)', example: 'If m = 5 kg, h = 10 m, PE = 5 × 9.8 × 10 = 490 J' },
  { id: 'f6', name: "Ohm's Law", subject: 'Physics', formula: 'V = IR', variables: 'V = voltage (V), I = current (A), R = resistance (Ω)', example: 'If I = 2 A, R = 6 Ω, V = 12 V' },
  { id: 'f7', name: 'Speed Formula', subject: 'Physics', formula: 'v = d/t', variables: 'v = speed (m/s), d = distance (m), t = time (s)', example: 'If d = 100 m, t = 10 s, v = 10 m/s' },
  { id: 'f8', name: 'Density Formula', subject: 'Chemistry', formula: 'ρ = m/V', variables: 'ρ = density (g/cm³), m = mass (g), V = volume (cm³)', example: 'If m = 200 g, V = 50 cm³, ρ = 4 g/cm³' },
  { id: 'f9', name: 'Quadratic Formula', subject: 'Mathematics', formula: 'x = (-b ± √(b²-4ac)) / 2a', variables: 'For ax² + bx + c = 0', example: 'For x² - 5x + 6 = 0: a=1, b=-5, c=6 → x = 2 or x = 3' },
  { id: 'f10', name: 'Pythagoras Theorem', subject: 'Mathematics', formula: 'a² + b² = c²', variables: 'a, b = legs of right triangle, c = hypotenuse', example: 'If a = 3, b = 4, then c² = 9 + 16 = 25, c = 5' },
  { id: 'f11', name: 'Pressure Formula', subject: 'Physics', formula: 'P = F/A', variables: 'P = pressure (Pa), F = force (N), A = area (m²)', example: 'If F = 100 N, A = 2 m², P = 50 Pa' },
  { id: 'f12', name: 'Mole Calculation', subject: 'Chemistry', formula: 'n = m/M', variables: 'n = moles, m = mass (g), M = molar mass (g/mol)', example: 'Mass of H₂O = 18 g, M = 18 g/mol → n = 1 mol' },
  { id: 'f13', name: 'Work Done', subject: 'Physics', formula: 'W = Fd', variables: 'W = work (J), F = force (N), d = distance (m)', example: 'If F = 20 N, d = 5 m, W = 100 J' },
  { id: 'f14', name: 'Wave Speed', subject: 'Physics', formula: 'v = fλ', variables: 'v = wave speed (m/s), f = frequency (Hz), λ = wavelength (m)', example: 'If f = 500 Hz, λ = 0.68 m, v = 340 m/s' },
];

// ─── SCHOOL NEWS ──────────────────────────────────────────────
export const NEWS: NewsItem[] = [
  { id: 'news1', title: 'Grade 12 Examinations Timetable Released', summary: 'The ECZ has released the official Grade 12 external examinations timetable. Exams begin on 15th October. All candidates should collect their entry cards from their schools.', category: 'Examinations', date: '10 Jul 2026', urgent: true },
  { id: 'news2', title: 'Grade 9 & 7 Trial Exams Notice', summary: 'Trial examinations for Grades 7 and 9 are scheduled for August. Schools are advised to prepare candidates accordingly. Past papers are available on this platform.', category: 'Examinations', date: '8 Jul 2026', urgent: false },
  { id: 'news3', title: 'New ECZ Syllabus Updates for 2027', summary: 'The Examinations Council of Zambia has announced syllabus updates for Mathematics and Science subjects effective 2027. Current students will not be affected.', category: 'Curriculum', date: '5 Jul 2026', urgent: false },
  { id: 'news4', title: 'MY ECZ STUDY Platform Launched', summary: 'Schools can now upload learning materials — past papers, study notes, and video lessons — directly to this platform for students. Teachers should contact the admin to get access.', category: 'Platform', date: '1 Jul 2026', urgent: false },
  { id: 'news5', title: 'Scholarship Applications Open', summary: 'The Ministry of Education has opened applications for the 2027 government scholarships. Grade 12 students with a minimum of 5 credits are encouraged to apply through their school.', category: 'Scholarships', date: '28 Jun 2026', urgent: false },
  { id: 'news6', title: 'School Registration Deadline Reminder', summary: 'Schools must ensure all examination candidates are registered with ECZ by 31st July. Late registrations will attract a penalty fee. Contact your district education office.', category: 'Administration', date: '25 Jun 2026', urgent: true },
];

// ─── STUDENT RECORDS (teacher dashboard) ─────────────────────
export const STUDENT_RECORDS: StudentRecord[] = [
  { id: 's1', name: 'Chanda Mutale',    grade: '12', school: 'Lusaka Boys',     quizzesCompleted: 18, avgScore: 87, lastActive: '2 hours ago' },
  { id: 's2', name: 'Natasha Mwamba',   grade: '9',  school: 'Kabulonga Girls', quizzesCompleted: 14, avgScore: 82, lastActive: '5 hours ago' },
  { id: 's3', name: 'Bwalya Kapambwe',  grade: '12', school: 'Lusaka Boys',     quizzesCompleted: 22, avgScore: 91, lastActive: '1 day ago' },
  { id: 's4', name: 'Thandiwe Phiri',   grade: '9',  school: 'Kabulonga Girls', quizzesCompleted: 10, avgScore: 74, lastActive: '2 days ago' },
  { id: 's5', name: 'Musamba Lungu',    grade: '7',  school: 'Lusaka Boys',     quizzesCompleted: 6,  avgScore: 68, lastActive: '3 days ago' },
  { id: 's6', name: 'Precious Banda',   grade: '9',  school: 'Kabulonga Girls', quizzesCompleted: 16, avgScore: 79, lastActive: '1 day ago' },
  { id: 's7', name: 'Kasonde Mutale',   grade: '12', school: 'Lusaka Boys',     quizzesCompleted: 20, avgScore: 85, lastActive: '4 hours ago' },
  { id: 's8', name: 'Mwila Mulenga',    grade: '7',  school: 'Matero Basic',    quizzesCompleted: 8,  avgScore: 72, lastActive: '1 day ago' },
];
