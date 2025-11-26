import { describe, it, expect } from "vitest";

describe("Form Validations", () => {
  describe("Email Validation", () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it("should validate correct email formats", () => {
      expect(isValidEmail("user@escola.com")).toBe(true);
      expect(isValidEmail("professor.silva@escola.com.br")).toBe(true);
      expect(isValidEmail("aluno123@escola.edu")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@escola.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user@escola")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("Password Validation", () => {
    const isValidPassword = (password: string): boolean => {
      return password.length >= 8;
    };

    it("should validate passwords with minimum length", () => {
      expect(isValidPassword("senha123")).toBe(true);
      expect(isValidPassword("12345678")).toBe(true);
      expect(isValidPassword("abcdefgh")).toBe(true);
    });

    it("should reject passwords below minimum length", () => {
      expect(isValidPassword("1234567")).toBe(false);
      expect(isValidPassword("abc")).toBe(false);
      expect(isValidPassword("")).toBe(false);
    });
  });

  describe("Name Validation", () => {
    const isValidName = (name: string): boolean => {
      return name.trim().length >= 3;
    };

    it("should validate names with minimum length", () => {
      expect(isValidName("Ana Silva")).toBe(true);
      expect(isValidName("João")).toBe(true);
      expect(isValidName("Maria")).toBe(true);
    });

    it("should reject names below minimum length", () => {
      expect(isValidName("AB")).toBe(false);
      expect(isValidName("  ")).toBe(false);
      expect(isValidName("")).toBe(false);
    });
  });

  describe("Score Validation", () => {
    const isValidScore = (score: number): boolean => {
      return score >= 0 && score <= 10;
    };

    it("should validate scores within range", () => {
      expect(isValidScore(0)).toBe(true);
      expect(isValidScore(5)).toBe(true);
      expect(isValidScore(10)).toBe(true);
      expect(isValidScore(7.5)).toBe(true);
    });

    it("should reject scores outside range", () => {
      expect(isValidScore(-1)).toBe(false);
      expect(isValidScore(11)).toBe(false);
      expect(isValidScore(100)).toBe(false);
    });
  });

  describe("Date Validation", () => {
    const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
      return endDate.getTime() > startDate.getTime();
    };

    it("should validate correct date ranges", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-12-31");
      expect(isValidDateRange(start, end)).toBe(true);
    });

    it("should reject invalid date ranges", () => {
      const start = new Date("2024-12-31");
      const end = new Date("2024-01-01");
      expect(isValidDateRange(start, end)).toBe(false);
    });

    it("should reject equal dates", () => {
      const date = new Date("2024-01-01");
      expect(isValidDateRange(date, date)).toBe(false);
    });
  });

  describe("Time Limit Validation", () => {
    const isValidTimeLimit = (minutes: number): boolean => {
      return minutes > 0 && minutes <= 300;
    };

    it("should validate reasonable time limits", () => {
      expect(isValidTimeLimit(30)).toBe(true);
      expect(isValidTimeLimit(60)).toBe(true);
      expect(isValidTimeLimit(120)).toBe(true);
    });

    it("should reject invalid time limits", () => {
      expect(isValidTimeLimit(0)).toBe(false);
      expect(isValidTimeLimit(-10)).toBe(false);
      expect(isValidTimeLimit(500)).toBe(false);
    });
  });

  describe("Question Options Validation", () => {
    const hasValidOptions = (options: string[]): boolean => {
      return options.length >= 2 && options.every((opt) => opt.trim().length > 0);
    };

    it("should validate questions with valid options", () => {
      expect(hasValidOptions(["Opção A", "Opção B"])).toBe(true);
      expect(hasValidOptions(["A", "B", "C", "D"])).toBe(true);
    });

    it("should reject questions with invalid options", () => {
      expect(hasValidOptions(["Opção A"])).toBe(false);
      expect(hasValidOptions(["Opção A", ""])).toBe(false);
      expect(hasValidOptions([])).toBe(false);
    });
  });

  describe("Carometer Criteria Validation", () => {
    const isValidCriteriaScore = (score: number): boolean => {
      return Number.isInteger(score) && score >= 0 && score <= 5;
    };

    it("should validate criteria scores within range", () => {
      expect(isValidCriteriaScore(0)).toBe(true);
      expect(isValidCriteriaScore(3)).toBe(true);
      expect(isValidCriteriaScore(5)).toBe(true);
    });

    it("should reject criteria scores outside range", () => {
      expect(isValidCriteriaScore(-1)).toBe(false);
      expect(isValidCriteriaScore(6)).toBe(false);
      expect(isValidCriteriaScore(3.5)).toBe(false);
    });
  });
});
