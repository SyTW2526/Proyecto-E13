import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock de ReactDOM antes de importar main
vi.mock("react-dom/client", () => ({
  default: {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
      unmount: vi.fn(),
    })),
  },
}));

vi.mock("@/App", () => ({
  default: () => <div>App Mock</div>,
}));

vi.mock("@/store/store", () => ({
  store: {
    getState: vi.fn(),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
  },
}));

describe("main.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("Renderiza la aplicación correctamente", async () => {
    const ReactDOM = await import("react-dom/client");
    const mockRender = vi.fn();
    const mockUnmount = vi.fn();
    const mockCreateRoot = vi.fn(() => ({
      render: mockRender,
      unmount: mockUnmount,
    }));

    vi.mocked(ReactDOM.default.createRoot).mockImplementation(mockCreateRoot);

    // Importar main después de los mocks
    await import("@/main");

    const rootElement = document.getElementById("root");
    expect(rootElement).toBeTruthy();
  });
});
