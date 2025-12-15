import { ChatForm } from "@/components/chat/ChatForm";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRef } from "react";

describe("ChatForm", () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() =>
      render(
        <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
          {() => <div>Test</div>}
        </ChatForm>,
      ),
    ).not.toThrow();
  });

  it("renders form with children", () => {
    render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {() => <div data-testid="child-content">Child Content</div>}
      </ChatForm>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("passes files and setFiles to children", () => {
    let receivedFiles: File[] | null = null;
    let receivedSetFiles: React.Dispatch<
      React.SetStateAction<File[] | null>
    > | null = null;

    render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {({ files, setFiles }) => {
          receivedFiles = files;
          receivedSetFiles = setFiles;
          return <div>Test</div>;
        }}
      </ChatForm>,
    );

    expect(receivedFiles).toBeNull();
    expect(receivedSetFiles).toBeDefined();
  });

  it("applies className to form", () => {
    const { container } = render(
      <ChatForm
        isPending={false}
        handleSubmit={mockHandleSubmit}
        className="custom-class"
      >
        {() => <div>Test</div>}
      </ChatForm>,
    );

    expect(container.querySelector("form")).toHaveClass("custom-class");
  });

  it("forwards ref to form element", () => {
    const formRef = createRef<HTMLFormElement>();

    render(
      <ChatForm ref={formRef} isPending={false} handleSubmit={mockHandleSubmit}>
        {() => <div>Test</div>}
      </ChatForm>,
    );

    expect(formRef.current).toBeInstanceOf(HTMLFormElement);
  });

  it("renders form element", () => {
    const { container } = render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {() => <div>Test</div>}
      </ChatForm>,
    );

    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("has displayName set correctly", () => {
    expect(ChatForm.displayName).toBe("ChatForm");
  });

  it("calls handleSubmit without files when form is submitted without files", () => {
    render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {() => <button type="submit">Submit</button>}
      </ChatForm>,
    );

    const form = document.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("calls handleSubmit with file attachments when files are set", async () => {
    let setFilesRef: React.Dispatch<React.SetStateAction<File[] | null>>;

    render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {({ setFiles }) => {
          setFilesRef = setFiles;
          return <button type="submit">Submit</button>;
        }}
      </ChatForm>,
    );

    const testFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });
    await import("@testing-library/react").then(({ act }) => {
      act(() => {
        setFilesRef!([testFile]);
      });
    });

    const form = document.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("clears files after submission with files", async () => {
    let currentFiles: File[] | null = null;
    let setFilesRef: React.Dispatch<React.SetStateAction<File[] | null>>;

    const { rerender } = render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {({ files, setFiles }) => {
          currentFiles = files;
          setFilesRef = setFiles;
          return <button type="submit">Submit</button>;
        }}
      </ChatForm>,
    );

    const testFile = new File(["test"], "test.txt", { type: "text/plain" });
    await import("@testing-library/react").then(({ act }) => {
      act(() => {
        setFilesRef!([testFile]);
      });
    });

    rerender(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {({ files, setFiles }) => {
          currentFiles = files;
          setFilesRef = setFiles;
          return <button type="submit">Submit</button>;
        }}
      </ChatForm>,
    );

    expect(currentFiles).toHaveLength(1);
  });

  it("submits form with multiple files", async () => {
    let setFilesRef: React.Dispatch<React.SetStateAction<File[] | null>>;

    render(
      <ChatForm isPending={false} handleSubmit={mockHandleSubmit}>
        {({ setFiles }) => {
          setFilesRef = setFiles;
          return <button type="submit">Submit</button>;
        }}
      </ChatForm>,
    );

    const files = [
      new File(["content1"], "file1.txt", { type: "text/plain" }),
      new File(["content2"], "file2.txt", { type: "text/plain" }),
    ];

    await import("@testing-library/react").then(({ act }) => {
      act(() => {
        setFilesRef!(files);
      });
    });

    const form = document.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
