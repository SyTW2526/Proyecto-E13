import AppMenubar from "@/components/appMenubar";
import { useAuth } from "@/hooks/useAuth";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../helpers/test-utils";

vi.mock("@/hooks/useAuth");
let mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/components/customized/dropdown-menu/dropdown-menu-02", () => ({
  default: ({
    onLogout,
    userName,
    onSettings,
  }: {
    onLogout?: () => void;
    userName?: string;
    onSettings?: () => void;
  }) => (
    <div>
      <span>{userName}</span>
      <button onClick={onSettings}>Ajustes</button>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  ),
}));

import userEvent from "@testing-library/user-event";

describe("AppMenubar", () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renderiza el enlace TaskGrid", () => {
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
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
    expect(screen.queryByText("Cerrar sesión")).toBeNull();
  });

  it("Llama a signOut y navega al cerrar sesión", async () => {
    const newNavigate = vi.fn();
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
    });

    mockNavigate = newNavigate;

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Cerrar sesión"));

    expect(mockSignOut).toHaveBeenCalled();
    expect(newNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("Muestra el menú de navegación cuando está autenticado", () => {
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
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
    expect(screen.getByText("Test User")).toBeDefined();
  });

  it("No muestra el dropdown de usuario cuando no está autenticado", () => {
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
    });

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );

    expect(screen.getByText("TaskGrid")).toBeDefined();
    expect(screen.queryByText("Ajustes")).toBeNull();
  });

  it("Navega a ajustes al hacer clic en Ajustes", async () => {
    const newNavigate = vi.fn();
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
    });

    mockNavigate = newNavigate;

    renderWithProviders(
      <MemoryRouter>
        <AppMenubar />
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Ajustes"));

    expect(newNavigate).toHaveBeenCalledWith("/settings");
  });
});
