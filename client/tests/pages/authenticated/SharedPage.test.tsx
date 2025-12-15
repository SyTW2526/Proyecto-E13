import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SharedPage from "@/pages/authenticated/sharedPage";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import themeReducer from "@/store/slices/themeSlice";
import listsReducer from "@/store/slices/listsSlice";
import tasksReducer from "@/store/slices/tasksSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import uiReducer from "@/store/slices/uiSlice";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "es" },
  }),
}));

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
  apiErrorMessage: vi.fn(),
}));

vi.mock("@/components/tasks/TasksPageLayout", () => ({
  TasksPageLayout: ({
    title,
    emptyTasksMessage,
    headerActions,
  }: {
    title: string;
    emptyTasksMessage: string;
    headerActions?: React.ReactNode;
  }) => (
    <div data-testid="shared-layout">
      <h1>{title}</h1>
      {headerActions && <div data-testid="header-actions">{headerActions}</div>}
      <p>{emptyTasksMessage}</p>
    </div>
  ),
}));

vi.mock("@/components/tasks/dialogs/CreateTaskDialog", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="create-task-dialog">{children}</div>
  ),
}));

describe("SharedPage", () => {
  let store: ReturnType<typeof configureStore>;

  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        tasks: tasksReducer,
        notifications: notificationsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token123",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
        lists: {
          lists: [],
          isLoading: false,
          error: null,
          selectedListId: null,
        },
        tasks: {
          tasks: [],
          isLoading: false,
          error: null,
          filters: {
            status: "all",
            listId: null,
            priority: "all",
            favorite: "all",
          },
          sorting: { field: "createdAt", order: "desc" },
        },
      },
    });
  });

  const renderPage = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <SharedPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("renders shared page layout", () => {
    renderPage();
    expect(screen.getByTestId("shared-layout")).toBeInTheDocument();
  });

  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("shared.title")).toBeInTheDocument();
  });

  it("renders header actions", () => {
    renderPage();
    expect(screen.getByTestId("header-actions")).toBeInTheDocument();
  });

  it("renders empty state message", () => {
    renderPage();
    expect(screen.getByText("shared.emptyState")).toBeInTheDocument();
  });
});
