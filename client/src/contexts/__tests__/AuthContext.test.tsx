import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with no user", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should login successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("professor@escola.com", "senha123");
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe("professor@escola.com");
    });
  });

  it("should assign correct role based on email", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("admin@escola.com", "senha123");
    });

    await waitFor(() => {
      expect(result.current.user?.role).toBe("admin");
    });
  });

  it("should register new user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register(
        "Novo Usuário",
        "novo@escola.com",
        "senha123",
        "teacher"
      );
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.name).toBe("Novo Usuário");
      expect(result.current.user?.role).toBe("teacher");
    });
  });

  it("should logout successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("professor@escola.com", "senha123");
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should persist user in localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("professor@escola.com", "senha123");
    });

    await waitFor(() => {
      const storedUser = localStorage.getItem("user");
      expect(storedUser).not.toBeNull();
      const parsed = JSON.parse(storedUser!);
      expect(parsed.email).toBe("professor@escola.com");
    });
  });

  it("should restore user from localStorage", () => {
    const mockUser = {
      id: "test-id",
      name: "Test User",
      email: "test@escola.com",
      role: "teacher",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe("test@escola.com");
    });
  });
});
