export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "/logo.svg";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Assessment Criteria
export const ASSESSMENT_CRITERIA = {
  ATTENDANCE: "attendance",
  PARTICIPATION: "participation",
  RESPONSIBILITY: "responsibility",
  SOCIABILITY: "sociability",
} as const;

export type AssessmentCriterion = typeof ASSESSMENT_CRITERIA[keyof typeof ASSESSMENT_CRITERIA];

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  ESSAY: "essay",
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
