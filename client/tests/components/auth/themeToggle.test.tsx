import ThemeToggle from "@/components/themeToggle";
import { useTheme } from "@/hooks/useTheme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el label para cambiar al modo claro cuando el tema es oscuro", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Cambiar a tema light" }),
    ).toBeInTheDocument();
  });

  it("Cambia al tema opuesto al hacer click", async () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme,
    });

    render(<ThemeToggle />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: "Cambiar a tema dark" }),
    );

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
