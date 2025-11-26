import {
  Student,
  Class,
  Question,
  Exam,
  CarometerAssessment,
  Carometer,
  ExamSubmission,
  PerformanceReport,
  DashboardStats,
  AuditLog,
} from "../types";
import { QUESTION_TYPES, DIFFICULTY_LEVELS, ASSESSMENT_CRITERIA, USER_ROLES } from "../const";

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Ana Silva",
    email: "ana.silva@escola.com",
    classId: "c1",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    nickname: "Aninha",
    photoConsent: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "s2",
    name: "Bruno Santos",
    email: "bruno.santos@escola.com",
    classId: "c1",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno",
    nickname: "Bruninho",
    photoConsent: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "s3",
    name: "Carla Oliveira",
    email: "carla.oliveira@escola.com",
    classId: "c1",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
    nickname: "Carol",
    photoConsent: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "s4",
    name: "Daniel Costa",
    email: "daniel.costa@escola.com",
    classId: "c2",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    nickname: "Dani",
    photoConsent: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "s5",
    name: "Elena Rodrigues",
    email: "elena.rodrigues@escola.com",
    classId: "c2",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    nickname: "Lena",
    photoConsent: true,
    createdAt: new Date("2024-01-15"),
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: "c1",
    name: "9º Ano A",
    grade: "9º Ano",
    year: 2025,
    teacherId: "t1",
    studentIds: ["s1", "s2", "s3"],
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "c2",
    name: "8º Ano B",
    grade: "8º Ano",
    year: 2025,
    teacherId: "t1",
    studentIds: ["s4", "s5"],
    createdAt: new Date("2024-01-10"),
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: "q1",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: "Qual é a capital do Brasil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correctAnswer: 2,
    tags: ["geografia", "brasil"],
    difficulty: DIFFICULTY_LEVELS.EASY,
    subject: "Geografia",
    createdById: "t1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "q2",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: "Quanto é 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    tags: ["matemática", "básico"],
    difficulty: DIFFICULTY_LEVELS.EASY,
    subject: "Matemática",
    createdById: "t1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "q3",
    type: QUESTION_TYPES.ESSAY,
    content: "Explique a importância da fotossíntese para o meio ambiente.",
    correctAnswer: "A fotossíntese é fundamental pois produz oxigênio e remove CO2 da atmosfera.",
    tags: ["biologia", "meio ambiente"],
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    subject: "Biologia",
    createdById: "t1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    id: "e1",
    title: "Prova de Geografia - 1º Bimestre",
    description: "Avaliação sobre capitais e regiões do Brasil",
    classId: "c1",
    createdById: "t1",
    questions: [mockQuestions[0]],
    timeLimit: 60,
    shuffleQuestions: true,
    shuffleOptions: true,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-15"),
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "e2",
    title: "Simulado de Matemática",
    description: "Simulado preparatório para prova final",
    classId: "c1",
    createdById: "t1",
    questions: [mockQuestions[1]],
    timeLimit: 45,
    shuffleQuestions: false,
    shuffleOptions: true,
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-03-20"),
    createdAt: new Date("2024-03-01"),
  },
];

// Mock Carometer Assessments
export const mockCarometerAssessments: CarometerAssessment[] = [
  {
    id: "ca1",
    carometerId: "car1",
    studentId: "s1",
    assessorId: "t1",
    date: new Date("2024-03-15"),
    criteria: {
      [ASSESSMENT_CRITERIA.ATTENDANCE]: 5,
      [ASSESSMENT_CRITERIA.PARTICIPATION]: 4,
      [ASSESSMENT_CRITERIA.RESPONSIBILITY]: 5,
      [ASSESSMENT_CRITERIA.SOCIABILITY]: 4,
    },
    comments: "Excelente aluna, sempre participativa.",
    status: "finalized",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "ca2",
    carometerId: "car1",
    studentId: "s2",
    assessorId: "t1",
    date: new Date("2024-03-15"),
    criteria: {
      [ASSESSMENT_CRITERIA.ATTENDANCE]: 4,
      [ASSESSMENT_CRITERIA.PARTICIPATION]: 3,
      [ASSESSMENT_CRITERIA.RESPONSIBILITY]: 4,
      [ASSESSMENT_CRITERIA.SOCIABILITY]: 5,
    },
    comments: "Bom aluno, pode melhorar a participação.",
    status: "finalized",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
];

// Mock Carometers
export const mockCarometers: Carometer[] = [
  {
    id: "car1",
    classId: "c1",
    date: new Date("2024-03-15"),
    createdById: "t1",
    assessments: mockCarometerAssessments,
    createdAt: new Date("2024-03-15"),
  },
];

// Mock Exam Submissions
export const mockExamSubmissions: ExamSubmission[] = [
  {
    id: "sub1",
    examId: "e1",
    studentId: "s1",
    answers: [{ questionId: "q1", answer: 2 }],
    score: 10,
    status: "graded",
    startedAt: new Date("2024-03-02T10:00:00"),
    submittedAt: new Date("2024-03-02T10:45:00"),
    gradedAt: new Date("2024-03-02T11:00:00"),
  },
  {
    id: "sub2",
    examId: "e1",
    studentId: "s2",
    answers: [{ questionId: "q1", answer: 1 }],
    score: 0,
    status: "graded",
    startedAt: new Date("2024-03-02T10:00:00"),
    submittedAt: new Date("2024-03-02T10:30:00"),
    gradedAt: new Date("2024-03-02T11:00:00"),
  },
];

// Mock Performance Reports
export const mockPerformanceReports: PerformanceReport[] = [
  {
    studentId: "s1",
    classId: "c1",
    period: {
      start: new Date("2024-01-01"),
      end: new Date("2024-03-31"),
    },
    averageScore: 8.5,
    carometer: {
      [ASSESSMENT_CRITERIA.ATTENDANCE]: 5,
      [ASSESSMENT_CRITERIA.PARTICIPATION]: 4,
      [ASSESSMENT_CRITERIA.RESPONSIBILITY]: 5,
      [ASSESSMENT_CRITERIA.SOCIABILITY]: 4,
    },
    exams: [
      { examId: "e1", score: 10, date: new Date("2024-03-02") },
      { examId: "e2", score: 7, date: new Date("2024-03-12") },
    ],
    attendance: 95,
    trend: "improving",
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "log1",
    userId: "t1",
    action: "CREATE",
    resource: "exam",
    resourceId: "e1",
    details: "Criou prova de Geografia",
    timestamp: new Date("2024-02-20T14:30:00"),
    ipAddress: "192.168.1.1",
  },
  {
    id: "log2",
    userId: "t1",
    action: "UPDATE",
    resource: "carometer",
    resourceId: "car1",
    details: "Finalizou avaliação do carômetro",
    timestamp: new Date("2024-03-15T16:00:00"),
    ipAddress: "192.168.1.1",
  },
  {
    id: "log3",
    userId: "s1",
    action: "SUBMIT",
    resource: "exam",
    resourceId: "e1",
    details: "Enviou prova de Geografia",
    timestamp: new Date("2024-03-02T10:45:00"),
    ipAddress: "192.168.1.50",
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalStudents: 5,
  totalClasses: 2,
  totalExams: 2,
  averageScore: 7.8,
  recentActivity: mockAuditLogs.slice(0, 5),
  alerts: [
    {
      type: "warning",
      message: "Bruno Santos teve queda de desempenho no último mês",
      studentId: "s2",
    },
    {
      type: "info",
      message: "3 provas aguardando correção",
    },
  ],
};

// Helper functions to simulate API calls
export const getStudentsByClass = (classId: string): Student[] => {
  return mockStudents.filter((s) => s.classId === classId);
};

export const getClassById = (classId: string): Class | undefined => {
  return mockClasses.find((c) => c.id === classId);
};

export const getExamsByClass = (classId: string): Exam[] => {
  return mockExams.filter((e) => e.classId === classId);
};

export const getCarometersByClass = (classId: string): Carometer[] => {
  return mockCarometers.filter((c) => c.classId === classId);
};

export const getPerformanceReport = (studentId: string): PerformanceReport | undefined => {
  return mockPerformanceReports.find((r) => r.studentId === studentId);
};
