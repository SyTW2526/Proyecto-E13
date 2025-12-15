import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskFormFields } from "@/components/tasks/TaskFormFields";
import { I18nTestProvider } from "../../helpers/i18nTestProvider";

const mockUpdateField = vi.fn();
const mockFormData = {
  name: "",
  description: "",
  priority: "MEDIUM" as const,
  status: "PENDING" as const,
  listId: "list-1",
  dueDate: "",
};

const mockLists = [
  {
    id: "list-1",
    name: "Personal",
    createdAt: "2024-01-01",
    tasks: [],
    ownerId: "u1",
    shares: [],
  },
  {
    id: "list-2",
    name: "Work",
    createdAt: "2024-01-01",
    tasks: [],
    ownerId: "u1",
    shares: [],
  },
];

describe("TaskFormFields", () => {
  it("renders all form fields", () => {
    render(
      <I18nTestProvider>
        <TaskFormFields
          formData={mockFormData}
          updateField={mockUpdateField}
          accessibleLists={mockLists}
        />
      </I18nTestProvider>,
    );

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });

  it("calls updateField when name changes", async () => {
    const updateField = vi.fn();
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <TaskFormFields
          formData={mockFormData}
          updateField={updateField}
          accessibleLists={mockLists}
        />
      </I18nTestProvider>,
    );

    const nameInput = screen.getByLabelText(/nombre/i);
    await user.type(nameInput, "New Task");

    expect(updateField).toHaveBeenCalled();
  });

  it("shows required indicator for name field", () => {
    render(
      <I18nTestProvider>
        <TaskFormFields
          formData={mockFormData}
          updateField={mockUpdateField}
          accessibleLists={mockLists}
        />
      </I18nTestProvider>,
    );

    // Required fields should have asterisks
    expect(screen.getAllByText("*").length).toBeGreaterThan(0);
  });

  it("renders date picker for due date", () => {
    render(
      <I18nTestProvider>
        <TaskFormFields
          formData={mockFormData}
          updateField={mockUpdateField}
          accessibleLists={mockLists}
        />
      </I18nTestProvider>,
    );

    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
  });
});
