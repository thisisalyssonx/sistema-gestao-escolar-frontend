import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "../DashboardLayout";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";

// Mock useAuth
vi.mock("../../contexts/AuthContext", async () => {
  const actual = await vi.importActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: "1",
        name: "Test User",
        email: "test@escola.com",
        role: "teacher",
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date(),
      },
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    }),
  };
});

// Mock wouter
vi.mock("wouter", () => ({
  useLocation: () => ["/dashboard", vi.fn()],
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("DashboardLayout", () => {
  const renderWithProviders = (children: React.ReactNode) => {
    return render(
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it("should render layout with user info", () => {
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@escola.com")).toBeInTheDocument();
  });

  it("should render navigation items", () => {
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Turmas")).toBeInTheDocument();
    expect(screen.getByText("Alunos")).toBeInTheDocument();
  });

  it("should render children content", () => {
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render logout button", () => {
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("Sair")).toBeInTheDocument();
  });
});
