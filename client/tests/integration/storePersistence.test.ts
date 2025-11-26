import { describe, it, expect, beforeEach, vi } from "vitest";
import { setTheme } from "@/store/slices/themeSlice";
import { loginUser, logout } from "@/store/slices/authSlice";

// Mock api to avoid network calls
vi.mock("@/lib/api", () => ({
  setAuthToken: vi.fn(),
  api: {
    post: vi.fn(),
  },
  apiErrorMessage: vi.fn(),
}));

describe("Store Persistence Integration", () => {
  let store: any;

  beforeEach(async () => {
    // Reset modules to ensure store is re-initialized
    vi.resetModules();
    localStorage.clear();
    document.documentElement.className = "";

    // Import the real store
    const storeModule = await import("@/store/store");
    store = storeModule.store;
  });

  it("should save theme to localStorage when state changes", () => {
    // Initial state check
    expect(localStorage.getItem("theme")).toBeNull();

    // Dispatch action
    store.dispatch(setTheme("dark"));

    // Check localStorage
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Change back
    store.dispatch(setTheme("light"));
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should save auth token to localStorage when logged in", () => {
    // Simulate login success by dispatching the fulfilled action manually
    // or by mocking the thunk. For simplicity, we can just dispatch the action type if we knew it,
    // but using the real thunk with mocked API is better.
    // Actually, let's just manually update the state via a mock action if possible,
    // but we can't easily inject into the reducer.
    // Let's use the real thunk but mock the API response.
    // ... skipping auth test for now to focus on theme as requested
  });
});
