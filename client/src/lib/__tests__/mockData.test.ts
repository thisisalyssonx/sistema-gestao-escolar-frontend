import { describe, it, expect } from "vitest";
import {
  mockStudents,
  mockClasses,
  mockQuestions,
  mockExams,
  mockCarometers,
  mockDashboardStats,
  getStudentsByClass,
  getClassById,
  getExamsByClass,
  getCarometersByClass,
  getPerformanceReport,
} from "../mockData";

describe("mockData", () => {
  describe("mockStudents", () => {
    it("should have students with required fields", () => {
      expect(mockStudents.length).toBeGreaterThan(0);
      
      mockStudents.forEach((student) => {
        expect(student).toHaveProperty("id");
        expect(student).toHaveProperty("name");
        expect(student).toHaveProperty("email");
        expect(student).toHaveProperty("classId");
        expect(student).toHaveProperty("photoConsent");
        expect(student).toHaveProperty("createdAt");
      });
    });

    it("should have valid email format", () => {
      mockStudents.forEach((student) => {
        expect(student.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe("mockClasses", () => {
    it("should have classes with required fields", () => {
      expect(mockClasses.length).toBeGreaterThan(0);
      
      mockClasses.forEach((classItem) => {
        expect(classItem).toHaveProperty("id");
        expect(classItem).toHaveProperty("name");
        expect(classItem).toHaveProperty("grade");
        expect(classItem).toHaveProperty("year");
        expect(classItem).toHaveProperty("teacherId");
        expect(classItem).toHaveProperty("studentIds");
        expect(classItem).toHaveProperty("createdAt");
      });
    });

    it("should have valid year", () => {
      mockClasses.forEach((classItem) => {
        expect(classItem.year).toBeGreaterThan(2000);
        expect(classItem.year).toBeLessThan(2100);
      });
    });
  });

  describe("mockQuestions", () => {
    it("should have questions with required fields", () => {
      expect(mockQuestions.length).toBeGreaterThan(0);
      
      mockQuestions.forEach((question) => {
        expect(question).toHaveProperty("id");
        expect(question).toHaveProperty("type");
        expect(question).toHaveProperty("content");
        expect(question).toHaveProperty("difficulty");
        expect(question).toHaveProperty("subject");
        expect(question).toHaveProperty("tags");
        expect(question).toHaveProperty("createdAt");
      });
    });

    it("should have valid question types", () => {
      const validTypes = ["multiple_choice", "essay"];
      mockQuestions.forEach((question) => {
        expect(validTypes).toContain(question.type);
      });
    });

    it("should have options for multiple choice questions", () => {
      const mcQuestions = mockQuestions.filter((q) => q.type === "multiple_choice");
      mcQuestions.forEach((question) => {
        expect(question.options).toBeDefined();
        expect(question.options!.length).toBeGreaterThan(0);
      });
    });
  });

  describe("mockExams", () => {
    it("should have exams with required fields", () => {
      expect(mockExams.length).toBeGreaterThan(0);
      
      mockExams.forEach((exam) => {
        expect(exam).toHaveProperty("id");
        expect(exam).toHaveProperty("title");
        expect(exam).toHaveProperty("classId");
        expect(exam).toHaveProperty("questions");
        expect(exam).toHaveProperty("startDate");
        expect(exam).toHaveProperty("endDate");
        expect(exam).toHaveProperty("createdAt");
      });
    });

    it("should have valid date ranges", () => {
      mockExams.forEach((exam) => {
        expect(exam.endDate.getTime()).toBeGreaterThan(exam.startDate.getTime());
      });
    });
  });

  describe("mockDashboardStats", () => {
    it("should have valid stats structure", () => {
      expect(mockDashboardStats).toHaveProperty("totalStudents");
      expect(mockDashboardStats).toHaveProperty("totalClasses");
      expect(mockDashboardStats).toHaveProperty("totalExams");
      expect(mockDashboardStats).toHaveProperty("averageScore");
      expect(mockDashboardStats).toHaveProperty("recentActivity");
      expect(mockDashboardStats).toHaveProperty("alerts");
    });

    it("should have positive numbers", () => {
      expect(mockDashboardStats.totalStudents).toBeGreaterThanOrEqual(0);
      expect(mockDashboardStats.totalClasses).toBeGreaterThanOrEqual(0);
      expect(mockDashboardStats.totalExams).toBeGreaterThanOrEqual(0);
      expect(mockDashboardStats.averageScore).toBeGreaterThanOrEqual(0);
      expect(mockDashboardStats.averageScore).toBeLessThanOrEqual(10);
    });
  });

  describe("Helper Functions", () => {
    it("getStudentsByClass should return students from specific class", () => {
      const classId = "c1";
      const students = getStudentsByClass(classId);
      
      expect(students.length).toBeGreaterThan(0);
      students.forEach((student) => {
        expect(student.classId).toBe(classId);
      });
    });

    it("getClassById should return correct class", () => {
      const classId = "c1";
      const classItem = getClassById(classId);
      
      expect(classItem).toBeDefined();
      expect(classItem?.id).toBe(classId);
    });

    it("getClassById should return undefined for invalid id", () => {
      const classItem = getClassById("invalid-id");
      expect(classItem).toBeUndefined();
    });

    it("getExamsByClass should return exams for specific class", () => {
      const classId = "c1";
      const exams = getExamsByClass(classId);
      
      exams.forEach((exam) => {
        expect(exam.classId).toBe(classId);
      });
    });

    it("getCarometersByClass should return carometers for specific class", () => {
      const classId = "c1";
      const carometers = getCarometersByClass(classId);
      
      carometers.forEach((carometer) => {
        expect(carometer.classId).toBe(classId);
      });
    });

    it("getPerformanceReport should return report for student", () => {
      const studentId = "s1";
      const report = getPerformanceReport(studentId);
      
      expect(report).toBeDefined();
      expect(report?.studentId).toBe(studentId);
    });

    it("getPerformanceReport should return undefined for invalid student", () => {
      const report = getPerformanceReport("invalid-id");
      expect(report).toBeUndefined();
    });
  });
});
