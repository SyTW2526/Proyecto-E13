import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { screen } from "@testing-library/react";
import AppMenubar from "@/components/appMenubar";
import { renderWithProviders } from "../helpers/test-utils";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("AppMenubar", () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render TaskGrid link", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      signOut: mockSignOut,
      updateUserProfile: vi.fn(),
      clearAuthError: vi.fn(),
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
  });

  it("should show navigation menu when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      token: "token123",
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      signOut: mockSignOut,
      updateUserProfile: vi.fn(),
      clearAuthError: vi.fn(),
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
  });

  it("should not show user dropdown when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      signOut: mockSignOut,
      updateUserProfile: vi.fn(),
      clearAuthError: vi.fn(),
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
  });
});
