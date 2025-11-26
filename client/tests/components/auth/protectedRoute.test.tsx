import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { screen } from "@testing-library/react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { renderWithProviders } from "../../helpers/test-utils";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const { useAuth } = await import("@/hooks/useAuth");

describe("ProtectedRoute", () => {
  it("should render children when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      signOut: vi.fn(),
      updateUserProfile: vi.fn(),
    });

    renderWithProviders(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should navigate to home when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      signOut: vi.fn(),
      updateUserProfile: vi.fn(),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
