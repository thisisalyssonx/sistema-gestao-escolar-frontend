import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => ["/login", mockSetLocation],
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it("should render login form", () => {
    renderLogin();

    expect(screen.getByText("Sistema de Avaliação Educacional")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should render demo login buttons", () => {
    renderLogin();

    expect(screen.getByRole("button", { name: "Professor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aluno" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Coordenador" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Admin" })).toBeInTheDocument();
  });

  it("should fill credentials when demo button is clicked", async () => {
    const user = userEvent.setup();
    renderLogin();

    const teacherButton = screen.getByRole("button", { name: "Professor" });
    await user.click(teacherButton);

    const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement;

    expect(emailInput.value).toBe("professor@escola.com");
    expect(passwordInput.value).toBe("prof123");
  });

  it("should validate empty fields", async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it("should submit login form with valid credentials", async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByLabelText("E-mail");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(emailInput, "professor@escola.com");
    await user.type(passwordInput, "senha123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetLocation).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should navigate to register page", async () => {
    const user = userEvent.setup();
    renderLogin();

    const registerLink = screen.getByRole("button", { name: "Criar conta" });
    await user.click(registerLink);

    expect(mockSetLocation).toHaveBeenCalledWith("/register");
  });

  it("should render hero image", () => {
    renderLogin();

    const heroImage = screen.getByAltText("Sistema Educacional");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/hero-education.png");
  });
});
