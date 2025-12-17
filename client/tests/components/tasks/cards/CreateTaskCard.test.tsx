import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CreateTaskCard } from "@/components/tasks/cards/CreateTaskCard";
import { I18nTestProvider } from "../../../helpers/i18nTestProvider";

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

vi.mock("@/components/tasks/dialogs/CreateTaskDialog", () => ({
  default: ({
    open,
    onOpenChange,
    filterByEditPermission,
    showCreateList,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filterByEditPermission?: boolean;
    showCreateList?: boolean;
  }) =>
    open ? (
      <div data-testid="create-task-dialog">
        <span data-testid="filter-by-edit">
          {filterByEditPermission ? "true" : "false"}
        </span>
        <span data-testid="show-create-list">
          {showCreateList ? "true" : "false"}
        </span>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

describe("CreateTaskCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the card with plus icon and create text", () => {
    render(
      <I18nTestProvider>
        <CreateTaskCard />
      </I18nTestProvider>,
    );

    expect(screen.getByText(/crear/i)).toBeInTheDocument();
  });

  it("opens dialog when clicked", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard />
      </I18nTestProvider>,
    );

    expect(screen.queryByTestId("create-task-dialog")).not.toBeInTheDocument();

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    expect(card).toBeInTheDocument();

    await user.click(card!);

    expect(screen.getByTestId("create-task-dialog")).toBeInTheDocument();
  });

  it("does not open dialog when disabled and clicked", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard disabled={true} />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.queryByTestId("create-task-dialog")).not.toBeInTheDocument();
  });

  it("renders with disabled styling when disabled", () => {
    render(
      <I18nTestProvider>
        <CreateTaskCard disabled={true} />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    expect(card).toHaveClass("opacity-50");
    expect(card).toHaveClass("cursor-not-allowed");
  });

  it("renders with hover styling when not disabled", () => {
    render(
      <I18nTestProvider>
        <CreateTaskCard disabled={false} />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    expect(card).toHaveClass("cursor-pointer");
    expect(card).not.toHaveClass("opacity-50");
  });

  it("passes filterByEditPermission prop to dialog", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard filterByEditPermission={true} />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.getByTestId("filter-by-edit")).toHaveTextContent("true");
  });

  it("passes showCreateList prop to dialog", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard showCreateList={false} />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.getByTestId("show-create-list")).toHaveTextContent("false");
  });

  it("defaults filterByEditPermission to false", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.getByTestId("filter-by-edit")).toHaveTextContent("false");
  });

  it("defaults showCreateList to true", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.getByTestId("show-create-list")).toHaveTextContent("true");
  });

  it("closes dialog when onOpenChange is called with false", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <CreateTaskCard />
      </I18nTestProvider>,
    );

    const card = screen.getByText(/crear/i).closest("div[class*='card']");
    await user.click(card!);

    expect(screen.getByTestId("create-task-dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Close"));

    expect(screen.queryByTestId("create-task-dialog")).not.toBeInTheDocument();
  });
});
