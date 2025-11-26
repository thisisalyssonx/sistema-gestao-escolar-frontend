import { UserRole, AssessmentCriterion, QuestionType, DifficultyLevel } from "./const";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  year: number;
  teacherId: string;
  studentIds: string[];
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  photo?: string;
  nickname?: string;
  photoConsent: boolean;
  createdAt: Date;
}

export interface CarometerAssessment {
  id: string;
  carometerId: string;
  studentId: string;
  assessorId: string;
  date: Date;
  criteria: {
    [key in AssessmentCriterion]: number; // 0-5 scale
  };
  comments?: string;
  status: "draft" | "finalized";
  createdAt: Date;
  updatedAt: Date;
}

export interface Carometer {
  id: string;
  classId: string;
  date: Date;
  createdById: string;
  assessments: CarometerAssessment[];
  createdAt: Date;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | number; // Index for MC, text for essay
  tags: string[];
  difficulty: DifficultyLevel;
  subject: string;
  attachments?: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  classId: string;
  createdById: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: {
    questionId: string;
    answer: string | number;
  }[];
  score?: number;
  status: "in_progress" | "submitted" | "graded";
  startedAt: Date;
  submittedAt?: Date;
  gradedAt?: Date;
}

export interface PerformanceReport {
  studentId: string;
  classId: string;
  period: {
    start: Date;
    end: Date;
  };
  averageScore: number;
  carometer: {
    [key in AssessmentCriterion]: number;
  };
  exams: {
    examId: string;
    score: number;
    date: Date;
  }[];
  attendance: number; // percentage
  trend: "improving" | "stable" | "declining";
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalExams: number;
  averageScore: number;
  recentActivity: AuditLog[];
  alerts: {
    type: "warning" | "info" | "danger";
    message: string;
    studentId?: string;
  }[];
}
