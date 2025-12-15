import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TaskCard } from "@/components/tasks/cards/TaskCard";
import type { Task } from "@/types/tasks-system/task";
import { I18nTestProvider } from "../../../helpers/i18nTestProvider";

vi.mock("@/hooks/tasks/useTasks", () => ({
  useTasks: () => ({
    toggleFavorite: vi.fn(),
    removeTask: vi.fn(() => ({ unwrap: vi.fn() })),
    editTask: vi.fn(),
  }),
}));

vi.mock("@/hooks/useLists", () => ({
  useLists: () => ({
    accessibleLists: [{ id: "list-1", name: "Test List" }],
    createList: vi.fn(),
    isOwner: () => true,
    canAccess: () => true,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "Test User" },
  }),
}));

const mockTask: Task = {
  id: "task-1",
  name: "Test Task",
  description: "Test description",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "2024-12-31",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  listId: "list-1",
  completed: false,
  shares: [],
  favorite: false,
};

const mockFormatDate = (date?: string) => date || "";

describe("TaskCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task name and description", () => {
    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with correct status badge", () => {
    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
  });

  it("renders with correct priority badge", () => {
    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    expect(screen.getByText(/media/i)).toBeInTheDocument();
  });

  it("shows action menu when clicking actions button", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    // Find first dropdown trigger button (actions menu)
    const buttons = screen.getAllByRole("button");
    const actionsButton = buttons.find(
      (btn) => btn.getAttribute("aria-haspopup") === "menu",
    );
    expect(actionsButton).toBeDefined();

    await user.click(actionsButton!);

    expect(screen.getByText(/editar/i)).toBeInTheDocument();
    expect(screen.getByText(/compartir/i)).toBeInTheDocument();
    expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
  });

  it("renders dates correctly", () => {
    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    expect(screen.getByText("2024-12-31")).toBeInTheDocument();
  });

  it("renders favorite checkbox", () => {
    render(
      <I18nTestProvider>
        <TaskCard task={mockTask} formatDate={mockFormatDate} />
      </I18nTestProvider>,
    );

    const favoriteCheckbox = screen.getByRole("checkbox");
    expect(favoriteCheckbox).toBeInTheDocument();
  });
});
